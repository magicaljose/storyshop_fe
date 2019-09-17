import MediumEditor from 'medium-editor';
import rangy from 'rangy';
import 'rangy/lib/rangy-selectionsaverestore';
import 'rangy/lib/rangy-classapplier';

import setQueries from 'queries/setQueries';

rangy.init();

const CommentButton = MediumEditor.Extension.extend({
	name: 'comment',

	init: function() {
		this.button = this.document.createElement('button');
		this.button.classList.add('medium-editor-action');
		this.button.classList.add('cmnt-btn');
		this.button.innerHTML = `<i class="fa fa-comment"></i>`;
		this.button.title = 'Comment';

		this.on(this.button, 'click', this.handleClick.bind(this));
	},

	getButton: function ()  {
		return this.button;
	},	

	handleClick: function (event) {
		event.preventDefault();

        const selection_range = MediumEditor.selection.getSelectionRange(this.document);
        const name = selection_range.toString();
        const offset_position = selection_range.startContainer.parentElement.offsetTop;

        const callback = (error, result) => {
            if (error) {
                console.log(error);
            } else {
                this.doFormSave();
                this.toggleComment();
                this.showDoCommentBox(this.scene_id, result.key, true);
            }
        }
            
        this.doComment(name, offset_position, callback);

        return false;
	},

	doComment: function(name, offset_position, cb) {
		const timestamp = new Date().getTime();

		const data = {
			init: true,
			commented_onText: name,
			offset_position: offset_position,
			created_at: timestamp
		}

		const callback = (error, result) => {
			if (error) {
				cb(error, null);
			} else {
				const key = result.key;

				this.classApplier = rangy.createClassApplier('cmnt-prt', {
                    elementTagName: 'a',
                    elementAttributes: {
                        id: key,
                        "cmnt-for": this.scene_id 
                    },
                    normalize: true
                });

                cb(null, {key});
			}
		}

		setQueries.insertSceneComment(this.scene_id, data, callback);
	},

    doFormSave: function () {
        this.completeFormSave();
    },

    completeFormSave: function () {
        this.classApplier.toggleSelection();
    	this.base.checkContentChanged();
    },
});

export default CommentButton;