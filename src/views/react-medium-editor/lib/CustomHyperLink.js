import MediumEditor from 'medium-editor';
import rangy from 'rangy';
import 'rangy/lib/rangy-selectionsaverestore';
import 'rangy/lib/rangy-classapplier';

rangy.init();

const CustomHyperLink = MediumEditor.Extension.extend({
	name: 'builderhyper',

	init: function (options) {
		console.log(options);
		this.button = this.document.createElement('button');
	    this.button.classList.add('medium-editor-action');
	    this.button.innerHTML = `BH`;
	    this.button.title = 'Create HyperLink';

	    this.on(this.button, 'click', this.handleClick.bind(this));
	},

	getButton: function ()  {
		return this.button;
	},

	handleClick: function (event) {
	}
});

export default CustomHyperLink;