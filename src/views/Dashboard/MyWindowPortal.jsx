import React from 'react';
import ReactDOM from 'react-dom';

const copyStyles = (sourceDoc, targetDoc) => {
  Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
    try {
        if (styleSheet.cssRules) { // for <style> elements
          const newStyleEl = sourceDoc.createElement('style');

          Array.from(styleSheet.cssRules).forEach(cssRule => {
            // write the text of each rule into the body of the style element
            newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
          });

          targetDoc.head.appendChild(newStyleEl);
        } else if (styleSheet.href) { // for <link> elements loading CSS from a URL
          const newLinkEl = sourceDoc.createElement('link');

          newLinkEl.rel = 'stylesheet';
          newLinkEl.href = styleSheet.href;
          targetDoc.head.appendChild(newLinkEl);
        }
    } catch(e) {
        console.log(e);
    }
  });
}

class MyWindowPortal extends React.Component {
    // STEP 1: create a container <div>
    containerEl = document.createElement('div');

  	componentDidMount = () => {
    	// STEP 3: open a new browser window and store a reference to it
    	this.externalWindow = window.open('', '', 'width=750,height=250,left=200,top=200');

        copyStyles(document, this.externalWindow.document);

    	// STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    	this.externalWindow.document.body.appendChild(this.containerEl);
  	}

  	componentWillUnmount = () => {
    	// STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
    	// So we tidy up by closing the window
    	this.externalWindow.close();
  	}
  
  	render() {
    	// STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    	return ReactDOM.createPortal(this.props.children, this.containerEl);
  	}
}

export default MyWindowPortal;