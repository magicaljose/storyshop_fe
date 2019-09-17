import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getHookObject(type, selectionStart, selectionEnd, elementValue, startPoint) {
  // const caret = getCaretCoordinates(element, element.selectionEnd);
  const caret = {top: 0, left: 0, height: 50};

  const result = {
    hookType: type,
    cursor: {
      selectionStart: selectionStart,
      selectionEnd: selectionEnd,
      startPoint: startPoint,
      top: caret.top,
      left: caret.left,
      height: caret.height,
    },
  };

  if (!startPoint) {
    return result;
  }

  result.text = elementValue.textContent.substr(startPoint, selectionStart);

  return result;
}

class InputMention extends Component {
  constructor(args) {
    super(args);

    this.state = {
      triggered: false,
      triggerStartPosition: null,
    };

    this.handleTrigger = this.handleTrigger.bind(this);
    this.resetState = this.resetState.bind(this);
    this.element = this.props.elementRef;
  }

  componentDidMount() {
    this.props.endTrigger(this.resetState);
  }

  handleTrigger(event) {
    const {
      trigger,
      onStart,
      onCancel,
      onType,
    } = this.props;

    const {
      which,
      shiftKey,
      metaKey,
      ctrlKey,
    } = event;

    let selectionStart = 0;
    let selectionEnd = 0;
    let elementValue = "";

    if (document.getSelection) {    // all browsers, except IE before version 9
        var sel = document.getSelection();
        // sel is a string in Firefox and Opera, 
        // and a selectionRange object in Google Chrome, Safari and IE from version 9
        // the alert method displays the result of the toString method of the passed object
        selectionStart = sel.anchorOffset;
        selectionEnd = sel.focusOffset;
        elementValue = sel.anchorNode;
    }

    // const { selectionStart } = event.target;
    const { triggered, triggerStartPosition } = this.state;

    if (!triggered) {
      if (
        which === trigger.keyCode &&
        shiftKey === !!trigger.shiftKey &&
        ctrlKey === !!trigger.ctrlKey &&
        metaKey === !!trigger.metaKey
      ) {
        this.setState({
          triggered: true,
          triggerStartPosition: selectionStart + 1,
        }, () => {
          setTimeout(() => {
            onStart(getHookObject('start', selectionStart, selectionEnd));
          }, 0);
        });
        return null;
      }
    } else {
      if (which === 8 && selectionStart <= triggerStartPosition) {
        this.setState({
          triggered: false,
          triggerStartPosition: null,
        }, () => {
          setTimeout(() => {
            onCancel(getHookObject('cancel', selectionStart, selectionEnd));
          }, 0);
        });

        return null;
      }

      setTimeout(() => {
        onType(getHookObject('typing', selectionStart, selectionEnd, elementValue, triggerStartPosition));
      }, 0);
    }

    return null;
  }

  resetState() {
    this.setState({
      triggered: false,
      triggerStartPosition: null,
    });
  }

  render() {
    const {
      elementRef,
      children,
      trigger,
      onStart,
      onCancel,
      onType,
      endTrigger,
      ...rest
    } = this.props;

    return (
      <div
        role="textbox"
        tabIndex={-1}
        onKeyDown={this.handleTrigger}
        {...rest}
      >
        {
          !elementRef
            ? (
              React.Children.map(this.props.children, child => (
                React.cloneElement(child, {
                  ref: (element) => {
                    this.element = element;
                    if (typeof child.ref === 'function') {
                      child.ref(element);
                    }
                  },
                })
              ))
            )
            : (
              children
            )
        }
      </div>
    );
  }
}

InputMention.propTypes = {
  trigger: PropTypes.shape({
    keyCode: PropTypes.number,
    shiftKey: PropTypes.bool,
    ctrlKey: PropTypes.bool,
    metaKey: PropTypes.bool,
  }),
  onStart: PropTypes.func,
  onCancel: PropTypes.func,
  onType: PropTypes.func,
  endTrigger: PropTypes.func,
  children: PropTypes.element.isRequired,
  elementRef: PropTypes.element,
};

InputMention.defaultProps = {
  trigger: {
    keyCode: null,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
  },
  onStart: () => {},
  onCancel: () => {},
  onType: () => {},
  endTrigger: () => {},
  elementRef: null,
};

export default InputMention;