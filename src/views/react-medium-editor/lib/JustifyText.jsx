import MediumEditor from 'medium-editor';
import rangy from 'rangy';
import 'rangy/lib/rangy-selectionsaverestore';
import 'rangy/lib/rangy-classapplier';

import justify from 'assets/img/justify.png'

rangy.init();

const JustifyText = MediumEditor.Extension.extend({
	name: 'justifyText',

	init: function () {
		this.button = this.document.createElement('button');
	    this.button.classList.add('medium-editor-action');
	    this.button.innerHTML = `<i class="fa fa-align-center"></i>`;
	    this.button.title = 'Center Justify';

	    this.on(this.button, 'click', this.handleClick.bind(this));
	},

	getButton: function ()  {
		return this.button;
	},

	handleClick: function (event) {
	    const parent = this.base.getSelectedParentElement();

	    if (parent.classList.length === 0) {
	    	parent.classList.add("center-justify");
	    } else if (parent.classList.contains("center-justify")) {
	    	parent.classList.remove("center-justify");
	    	parent.classList.add("unset-justify");
	    } else if (parent.classList.contains("unset-justify")) {
	    	parent.classList.remove("unset-justify");
	    	parent.classList.add("center-justify");
	    }

	    this.base.checkContentChanged();
	}
});

export default JustifyText;