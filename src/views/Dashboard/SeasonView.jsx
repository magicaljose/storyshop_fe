import React from 'react';
import { TextField, Button, Checkbox } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import Editor from '../react-medium-editor/dist/editor';
import JustifyText from '../react-medium-editor/lib/JustifyText';
import CustomHyperLink from '../react-medium-editor/lib/CustomHyperLink';
import CommentButton from '../react-medium-editor/lib/CommentButton';

import MediumEditor from 'medium-editor';
import MediumEditorAutofocus from 'medium-editor-autofocus';

import InputTrigger from '../InputMention/InputMention';

import loadingGF from 'assets/img/loding_loding.gif';

import setQueries from 'queries/setQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import updateQueries from 'queries/updateQueries';

let enter_count = 0;

class SeasonView extends React.Component {
	commentHighlight = {};
	state = {
        key: '',
        suggestorState: {},
        selfComment: {},
        chatList: {},
        isResolved: false,
        showElipse: false,
        toggleOnlyForNow: false
    }
    ref = [];
    commentDivs = {};

    componentDidMount = () => {
		document.addEventListener('mouseup', this.handleClickOutside);
    }

	componentDidCatch = (error, info) => {
		console.log(error, info);
	}

    componentWillUnmount = () => {
        document.removeEventListener('mouseup', this.handleClickOutside);

        if (this.sceneComments) {
        	this.sceneComments();
        }
    }

    setWrapperRef = (key, node) => {
        this.ref[key] = node;
    }

    saveKey = (key) => {
        this.setState({key});
    }

    handleEnter = id => event => {
	    if (event.key === "Enter") {
		    this.saveFields(id);
	    }
    }

	saveWhenStop = id => event => {
		const { writeAccess } = this.props;
		
		if (!writeAccess) return;

		if (this.timmer) {
			clearTimeout(this.timmer);
			this.timmer = null;
		}

		this.timmer = setTimeout(() => this.saveFields(id), 1000);
	}

	handleSceneEnter = id => event => {
		const { writeAccess } = this.props;

		if (!writeAccess) return;

		try {
			if (event.key === '@') {
				this.props.keyFoundAssistant();
			}
		} catch (error) {
			console.log(error)
		}

		try {
			if (event.key === "Enter") {
				if (enter_count === 0) {
					this.timeoutenter = setTimeout(() => {
						const obj = JSON.parse(id);
						const { episodeId, sceneId } = obj;

						if (enter_count === 2) {
							const { appendNewScene, handleSceneEdit, newSeasonId } = this.props;
							const episode = this.props.world.seasons[newSeasonId].episodes[episodeId];
							const scenes = episode.scenes;
							const scene = scenes[sceneId];

							if (scene.edit && scene.story.length > 0) {
								handleSceneEdit(episodeId, sceneId, true);
							}

							appendNewScene(episodeId);
						}

						if (enter_count === 3) {
							const { appendNewEpisode, handleSceneEdit, newSeasonId } = this.props;
							const episode = this.props.world.seasons[newSeasonId].episodes[episodeId];
							const scenes = episode.scenes;
							const scene = scenes[sceneId];

							if (scene.edit && scene.story.length > 0) {
								handleSceneEdit(episodeId, sceneId, true);
							}

							appendNewEpisode()
						}

						enter_count = 0;
					}, 2000);
				}

				if (enter_count !== 0) {
					// event.preventDefault();
				}

				enter_count += 1;
			} else if (event.key === "Backspace" && enter_count > 0) {
				enter_count -= 1;
			} else if (event.key !== "Enter" && event.key !== "Backspace") {
				// console.log("working")
				if (this.timeoutenter) {
					clearTimeout(this.timeoutenter);
					this.timeoutenter = null;
					enter_count = 0;
				}
			}
		} catch (e) {
			console.log(e);
		}
    }

    handleClickOutside = (event) => {
		try {
			const {key} = this.state;
        	const ignore = document.querySelector('.medium-editor-toolbar');

        	if (ignore && ignore.contains(event.target)) {
            	return;
        	}

        	if (this.ref[key] && !this.ref[key].contains(event.target)) {
            	const { id } = this.ref[key];

	          	this.saveFields(id);
        	}

        	if (this.commentDivs) {
        		Object.entries(this.commentDivs).map(([key, item]) => {
        			if (item && !item.contains(event.target)) {
        				this.setState({ selfComment: {}, showElipse: false });

        				if (this.sceneComments) {
        					this.sceneComments();
        				}

        				if (this.state.toggleOnlyForNow) {
        					this.props.toggleComment();
        				}
        			}
        		})
        	}
		} catch (e) {
			console.log(e);
		}
    }

    saveFields = id => {
	    const {
            handleSeasonEdit, handleEpisodeEdit, handleSceneEdit,
            newSeasonId
        } = this.props;
	    
	    const obj = JSON.parse(id);
        const { episodeId, sceneId } = obj;
        const seasonId = obj.season;

        if (sceneId) {
        } else if (episodeId) {
            const episode = this.props.world.seasons[newSeasonId].episodes[episodeId];

            if (episode.edit) {
                handleEpisodeEdit(episodeId);
            }
        } else if (seasonId) {
            const season = this.props.world.seasons[newSeasonId];

            if (season.edit) {
                handleSeasonEdit();
            }
        }
    }

	CreateWorldBuilder = MediumEditor.Extension.extend({
		name: 'worldbuilder',

		init: () => {
			this.wrldBtn = document.createElement('button');
			this.wrldBtn.classList.add('medium-editor-action');
			this.wrldBtn.classList.add('wb-crd-lnk');
			this.wrldBtn.innerHTML = `<i class="fa fa-plus-square"></i>`;
			this.wrldBtn.title = 'Create World Card';

			this.wrldBtn.addEventListener('click', this.props.handleWorldLink);
		},

		getButton: () => {
			return this.wrldBtn;
		}
	});

	renderCardPop = () => {
		return (
			<div className='main-c-bx'>
			</div>
		)
	}

	showDoCommentBox = (scene_id, cmnt_id, new_comment) => {
		if (this.state.selfComment[cmnt_id]) {
			this.setState(prevState => ({
				...prevState,
				selfComment: {
					...prevState.selfComment,
					[cmnt_id]: false
				},
				showElipse: false,
				new_comment
			}));
		} else {
			this.getCommentChats(scene_id, cmnt_id);

			if (document.getElementById(cmnt_id)) {
				document.getElementById(cmnt_id).style.animation = "myfirst 8s 1";

				this.commentHighlight[cmnt_id] = setTimeout(() => {
					document.getElementById(cmnt_id).style.animation = "";
				}, 1000);
			}			

			this.setState(prevState => ({
				...prevState,
				selfComment: {
					...prevState.selfComment,
					[cmnt_id]: true
				},
				showElipse: false,
				new_comment
			}));
		}
	}

	changeCommentInput = (event) => {
		this.setState({ "commentInput": event.target.value });
	}

	doOnKeyDown = (scene_id, comment_id) => (event) => {
		if (event.which === 13) {
			this.doComment(scene_id, comment_id);
		}
	}

	doComment = (scene_id, comment_id) => {
		const { commentInput } = this.state;
		if (!commentInput || !commentInput.trim()) return;

		const user_name = localStorage.getItem("storyShop_user_name");
		const user_id = localStorage.getItem("storyShop_uid");
		const timestamp = new Date().getTime();

		if (!user_id) return;

		const data = {
			user_id: user_id,
			user_name: user_name || "",
			timestamp: timestamp,
			comment: commentInput,
		}

		const cb = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				const comment_chat_id = result.key;

				const readData = {
					last_chat_comment: comment_chat_id, 
					last_chat_comment_by: user_id
				}

				updateQueries.updateSceneComments(scene_id, comment_id, readData, () => {});
			}
		}

		setQueries.insertSceneCommentChats(scene_id, comment_id, data, cb);
		this.setState({ commentInput: "" });

		if (this.state.new_comment && this.state.toggleOnlyForNow) {
			this.props.toggleComment();
			this.setState({ 
				toggleOnlyForNow: false, 
				new_comment: false, 
				selfComment: {} 
			});
		}
	}

	getCommentChats = (scene_id, cmnt_id) => {
		const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					results.data.forEach(snap => {
						const comment_chat_id = snap.id;
						const comment_chats = snap.data();

						this.setState(prevState => ({
							...prevState,
							chatList: {
								...prevState.chatList,
								[comment_chat_id]: comment_chats
							}
						}));
					});

					if (results.data.docs[results.data.docs.length - 1]) {
						const user_id = localStorage.getItem("storyShop_uid");

						const readData = {
							[user_id]: results.data.docs[results.data.docs.length - 1].id
						}

						updateQueries.updateSceneComments(scene_id, cmnt_id, readData, () => {});
					}
				} else {
					this.setState(prevState => ({
						...prevState,
						chatList: {}
					}));
				}
			}
		}

		if (this.sceneComments) {
			this.setState({ chatList: {} });
			this.sceneComments();
			this.sceneComments = null;
		}

		this.sceneComments = realtimeGetQueries.getSceneCommentChats(scene_id, cmnt_id, callback);
	}

	resolveComment = (scene_id, cmnt_id) => (event) => {
		this.setState({ isResolved: true });

		const data = {
			isResolved: true
		}

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				this.setState({ isResolved: false });
			}
		}

		updateQueries.updateSceneComments(scene_id, cmnt_id, data, callback);
	}

	highlightComment = (scene_id, cmnt_id) => {
		const data = {
			isHighLight: true
		}

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				this.setState({ selfComment: {} });
			}
		}

		updateQueries.updateSceneComments(scene_id, cmnt_id, data, callback);
	}

	deleteComment = (scene_id, cmnt_id) => {
		const data = {
			deleted: true
		}

		if (document.getElementById(cmnt_id)) {
			document.getElementById(cmnt_id).className="";

			if (document.getElementById(scene_id)) {
				const storyHTML = document.getElementById(scene_id).innerHTML;

				updateQueries.updateScene(scene_id, {story: storyHTML}, () => {});
			}
		}

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				this.setState({ selfComment: {} });
			}
		}

		updateQueries.updateSceneComments(scene_id, cmnt_id, data, callback);
	}

	openCommentElips = () => {
		this.setState({ showElipse: true });
	}

	toggleComment = () => {
		if (this.props.showComments) return;
		this.props.toggleComment();
		this.setState({ toggleOnlyForNow: true });
	}

	onCommentKeyDown = scene_id => event => {
		const { which } = event;

		if (which === 27) { // 27 is the character code of the escape key
			event.preventDefault();

			this.setState({ selfComment: {} });
		}

		if (which === 38 || which === 40) {
			const { commentsList } = this.props;
			const { selfComment } = this.state;

			if (Object.entries(selfComment).length === 0) return;
			const prev_comment_id = Object.entries(selfComment)[0][0];
			const arrayCommentsList = Object.entries(commentsList[scene_id]);

			const isPrevComment = ([comment_id, comment_data]) => comment_id === prev_comment_id;

			const prev_comment_index = arrayCommentsList.findIndex(isPrevComment);
			//console.log(prev_comment_index);

			if (which === 38) { // 40 is the character code of the up arrow
		    	event.preventDefault();

		    	let new_comment_id = '';
				if (prev_comment_index === 0) //return;
				{
					new_comment_id = arrayCommentsList[arrayCommentsList.length-1][0];
				} else { 
					new_comment_id = arrayCommentsList[prev_comment_index-1][0];
				}
		    	this.setState({ selfComment: {} });

		    	this.showDoCommentBox(scene_id, new_comment_id);
		    }

			if (which === 40 ) { // 40 is the character code of the down arrow
		      	event.preventDefault();
		        let new_comment_id = '';
		      	if (prev_comment_index === arrayCommentsList.length-1) //return;
		      	
				{
					new_comment_id = arrayCommentsList[0][0];
				}
				else { 
					new_comment_id = arrayCommentsList[prev_comment_index+1][0];
				}
		      	this.setState({ selfComment: {} });

		    	this.showDoCommentBox(scene_id, new_comment_id);
		    }
		}		
	}

	renderDoCommentBox = (scene_id, cmnt_id, resolved) => {
		const { fromScene, chatList, isResolved, showElipse } = this.state;

		return (
			<div id={cmnt_id} ref={(node) => this.commentDivs[cmnt_id] = node} className='do-cmt-bx'>
				{
					showElipse ? (
						<div className='main-cmt-elp'>
							<div className='fx-cls' 
							  onClick={() => this.showDoCommentBox(scene_id, cmnt_id)}>
								<i className="fa fa-times"></i>
							</div>

							<div className='elp-btns'>
								<div className='elp-hl' 
								  onClick={() => this.highlightComment(scene_id, cmnt_id)}>
								  	Highlight Comment
								</div>

								<div className='elp-hl elp-dc' 
								  onClick={() => this.deleteComment(scene_id, cmnt_id)}>
								  	Delete Comment
								</div>
							</div>
						</div>
					) : (
						<div className='main-cmt-bx'>
							{(!fromScene || !resolved) && (
			            		<div className='tp-hd'>
				            		<div className='rslv-bx'>
				            			<Checkbox
				            			  disabled={resolved}
				            			  className='rslv-chk'
										  checked={resolved}
										  onChange={this.resolveComment(scene_id, cmnt_id)}
										/>

										<span className='rslv-txt'>Comment Resolved</span>
				            		</div>
				            								
				            		<div className='oth-bx' onClick={() => this.openCommentElips(cmnt_id)}>
				            			<i className="fa fa-ellipsis-v elps"></i>
				            		</div>
				            	</div>
				            )}

			            	<div className='hst-bx'>
			            		{
			            			chatList && Object.entries(chatList)
			            			.map(([ch_id, ch_data]) => (
			            				<div key={ch_id} className='cht-bx'>
			            					<div className='usr-txt'>{ch_data.user_name}</div>
			            					<div className='msg-txt'>{ch_data.comment}</div>
			            				</div>
			            			))
			            		}
				            </div>

			            	<div className='rpl-bx'>
			            		<input disabled={resolved} autoFocus type="text" placeholder="Reply" onChange={this.changeCommentInput} 
			            		  onKeyDown={this.doOnKeyDown(scene_id, cmnt_id)} value={this.state.commentInput} 
			            		/>
			            	</div>
						</div>
					)
				}
            </div>
		)
	}

    renderNewScenes = (episodeKey, sceneKey, index) => {
        const {
            handleChange, handleEditorChange, handleSceneClick, beatStyles, 
            setScrollRef, newSeasonId, commentsList, showComments, suggestorState, 
            toggleSuggestor, handleInput, suggestorSelection,
        } = this.props;

        const suggestorData = suggestorState[sceneKey];

        const {
        	selfComment
        } = this.state;

        const episode = this.props.world.seasons[newSeasonId].episodes[episodeKey];
        const scenes = episode.scenes;
        const scene = scenes[sceneKey];
        const scene_name = scenes[sceneKey].name;
        const story = scenes[sceneKey].story;
        const id = `{"episodeId": "${episodeKey}", "sceneId": "${sceneKey}"}`;
	    let sceneKeys = Object.keys(scenes);

		const cmntScene = scene.key;

		let count = 0;

		let comnts_comnts = {};

		if (showComments && commentsList[sceneKey]) {
			Object.entries(commentsList[sceneKey]).map(([cmnt_id, dd], index) => {
				if (!document.getElementById(cmnt_id)) return;

				if (comnts_comnts[document.getElementById(cmnt_id).offsetTop]) {
					comnts_comnts[document.getElementById(cmnt_id).offsetTop].push({cmnt_id, dd});
				} else {
					comnts_comnts[document.getElementById(cmnt_id).offsetTop] = [{cmnt_id, dd}];
				}
			});
		}

        return (
            <div key={index} data-element={sceneKey} ref={(node) => {this.setWrapperRef(sceneKey, node); setScrollRef(sceneKey, node)}}
			  className={`scene-container ${beatStyles.lineSpacing ? beatStyles.lineSpacing : ""}`} id={id}
              key={sceneKey} onClick={() => this.saveKey(sceneKey)}>
		        {
		        	scene.hideScene && (
		        		<div className={`${beatStyles.indentCheck ? "indent-on" : "indent-of"
		        			} ${beatStyles.fontSize ? beatStyles.fontSize : "font-size-11"
		        			} editor-scene${sceneKey} ${showComments ? "toggle-comment" : ""}`}
		        		>
		        			<InputTrigger
						          trigger={{
						            keyCode: 50,
						            shiftKey: true,
						          }}
						          onStart={(metaData) => toggleSuggestor(metaData, sceneKey)}
						          onCancel={(metaData) => toggleSuggestor(metaData, sceneKey)}
						          onType={(metaData) => handleInput(metaData, sceneKey)}
						          endTrigger={(endHandler) => setScrollRef(`${sceneKey}-trigger`, endHandler)}
						        >
		            		<Editor
		            		  ref={(node) => {setScrollRef(`editor-${sceneKey}`, node); this.setWrapperRef(`editor-${sceneKey}`, node);}}
						      id={sceneKey}
	                          className={`html-edit`}
						      onKeyDown={this.handleSceneEnter(id)}
	                          text={story}
	                          onChange={(text, medium) => handleEditorChange(id, text, medium)}
	                          options={{
							    toolbar: {buttons: ['bold', {
									name: 'italic',
									 contentDefault: '<b><i>i</i></b>'
								}, 'justifyText', 'worldbuilder', 'comment']},
							    extensions: this.props.showLite && !this.props.writeAccess ? {
									'autofocus': new MediumEditorAutofocus(),
									'worldbuilder': new this.CreateWorldBuilder(),
									'justifyText': new JustifyText(),
								} : {
									'autofocus': new MediumEditorAutofocus(),
									'worldbuilder': new this.CreateWorldBuilder(),
									'justifyText': new JustifyText(),
									'comment': new CommentButton({
										scene_id: sceneKey, 
										showDoCommentBox: this.showDoCommentBox,
										toggleComment: this.toggleComment
									}),
								},
								paste: {
									forcePlainText: true,
									cleanPastedHTML: true,
									cleanReplacements: [
										[/<\s*div.*?>/g, '<p>'],
	            						[/<\s*\/\s*div\s*.*?>/g, '</p>']
									],
									cleanAttrs: ['id', 'class', 'style', 'dir'],
	        						cleanTags: ['meta'],
	        						unwrapTags: ['span']
								}
						      }}
						    />

						    </InputTrigger>

						    {
				    			/*suggestorData && suggestorData.showSuggestor && (
				    				<div
						    		  data-element={sceneKey}
							          id="dropdown"
							          className='dynamic-drp'
							          style={{
							            position: "absolute",
							            width: "200px",
							            borderRadius: "6px",
							            background: "white",
							            boxShadow: "rgba(0, 0, 0, 0.4) 0px 1px 4px",
							            minHeight: "30px",
							            maxHeight: "120px",
							            zIndex: "1",
							            overflow: "auto"
							          }}
							        >
							          	{
							            	suggestorData.cmp && Object.entries(suggestorData.cmp).map(([fieldKey, fields]) => {
							            		return Object.entries(fields).map(([f_id, data], index_key) => {
							            			return (
							            				<div key={index_key} className={`item-ref ${f_id === suggestorData.selected_item ? "active" : ""}`} 
							            				  data-element={f_id} card-category={data.category}
							            				  onClick={() => suggestorSelection(sceneKey, f_id)}
										                  style={{
										                    padding: '10px 20px'
										                  }}
										                >
										                  	{ data.name.val || "" }
										                </div>
							            			)
							            		});
							            	})
							         	}
							        </div>
				    			)*/
					    	}

					    	<div className="main-comments-lst"
					    	  onKeyDown={this.onCommentKeyDown(sceneKey)}
					    	>
					    		{
							    	showComments && (
							    		<div className='comments-lst'>
									    	{
										    	commentsList[sceneKey] && 
										    	Object.entries(comnts_comnts).map(([tp, tp_lst], index_key) => {
										    		return(
										    		<div key={index_key} className='on-cmnt' style={{marginTop: `${tp - 10}px`}}>
										    			{
										    				tp_lst.map((snp, index) => {
										    					const cmnt_id = snp.cmnt_id;
										    					const dd = snp.dd;

													    		if (!dd.isResolved) {
													    			count++;
													    		}									    		

													    		return (
														    		<div key={cmnt_id} data-ref-pos={dd.offset_position} className='main-cmnts'>
																		<div className={`cmnt-prt-bx ${dd.isHighLight ? 'hl-cmnt' : 
																		''} ${dd.isResolved ? 'rslv-dn' : ''}`} 
																		onClick={() => this.showDoCommentBox(sceneKey, cmnt_id)}>
																			<span className='main-bx'>
																				<i className="material-icons">chat_bubble</i>
																			</span>
																			
																			<span className='nmbr-cnt'>
																				{
																				    dd.isResolved ? (
																				    	<i className="fa fa-check"></i>
																				    ) : count
																				}
																			</span>
																		</div>

																		{
															            	selfComment[cmnt_id] && this.renderDoCommentBox(sceneKey, cmnt_id, dd.isResolved)
															            }
																	</div>
														    	)
													    	})
										    			}
										    		</div>
										    	)})
										    }
									    </div>
							    	)
							    }
					    		{
							    	/*showComments && (
							    		<div className='comments-lst'>
									    	{
									    		commentsList[sceneKey] && 
									    		Object.entries(commentsList[sceneKey])
									    		.sort(([cmnt_id1, dd1], [cmnt_id2, dd2]) => dd1.offset_position - dd2.offset_position)
									    		.map(([cmnt_id, dd]) => {
									    			if (!dd.isResolved) {
													    count++;
													}

										    		return (
											    		<div key={cmnt_id} data-ref-pos={dd.offset_position} className='main-cmnts'>
															<div className={`cmnt-prt-bx ${dd.isHighLight ? 'hl-cmnt' : 
															''} ${dd.isResolved ? 'rslv-dn' : ''}`} 
															onClick={() => this.showDoCommentBox(sceneKey, cmnt_id)}>
																<span className='main-bx'>
																	<i className="material-icons">chat_bubble</i>
																</span>
																
																<span className='nmbr-cnt'>
																	{
																	    dd.isResolved ? (
																	    	<i className="fa fa-check"></i>
																	    ) : count
																	}
																</span>
															</div>

															{
												            	selfComment[cmnt_id] && this.renderDoCommentBox(sceneKey, cmnt_id, dd.isResolved)
												            }
														</div>
										    		)
									    		})
										    }
									    </div>
							    	)*/
							    }
					    	</div>					    

		                	{
		                		sceneKeys.length - 1 !== index && (
		                			<div className="three-dots">•••</div>
		                		)
		                	}
		            	</div>
		            )}
            </div>
        )
    }

    renderNewEpisode = (episodeKey) => {
        const {
            handleChange, handleBtnOpen, writeAccess, showEpisode, EEExpanded,
            appendNewEpisode, appendNewScene, handleEpisodeClick, world, newSeasonId
        } = this.props;
        if (!this.props.world.seasons[newSeasonId]) return <div></div>
        const { episodes } = this.props.world.seasons[newSeasonId];
        const episode = episodes[episodeKey];

		if (!episode) return <div></div>;

		const episode_name = episode.name;
		const scenes = episode.scenes;

		if (!episodeKey) return <div></div>;

		const id = `{"episodeId": "${episodeKey}"}`;

		if (showEpisode && episode.showEpisode) {
			return <div key={episodeKey} data-element={episodeKey}></div>;
		}

        return (
            <div key={episodeKey} data-element={episodeKey} className={`episode-container editor-episode${episodeKey}`} key={episodeKey}>
                <div ref={(node) => this.setWrapperRef(episodeKey, node)} id={id}
                     className="episode-txt" onClick={() => this.saveKey(episodeKey)}>
                    {
                        episode.name && !episode.edit ?
                        	<h2 className='txt-display' onClick={() => handleEpisodeClick(episodeKey)}>{episode_name}</h2>
                        :
                        	<TextField autoFocus className='input-field episode' name="episode name" placeholder="Chapter Title"
				              value={episode_name} onChange={(event) => handleChange(id, event)} onKeyPress={this.handleEnter(id)} />
                    }
                </div>

                <div className='main-scene-container'>
                    { 
                        Object.entries(scenes)
                        .sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
                        .map( ([sceneKey, sceneData], index) => this.renderNewScenes(episodeKey, sceneKey, index) ) 
                    }
                </div> 
            </div>
        )
    }

    render() {
        const {
            world, handleChange, handleSeasonClick, beatStyles, setScrollRef
        } = this.props;
        const { season_id, newSeasonId, showEpisode, comments } = this.props;

	    let season = {};
	    let episodes = {};
	    let season_name = "";
	    let id = '';

	    if (world && Object.keys(world.seasons).length > 0) {
		    season = world.seasons[newSeasonId];
		    
		    if (!season) {
				return (
					<center>
				        <img src={loadingGF} alt="loading..." />
				    </center>
				)
			}

		    episodes = season.episodes;
		    season_name = season.name;
		    id = '{"season": "season"}';
	    }

	    if (!season_name && JSON.stringify(episodes) === "{}") {
			return (
				<center>
				    <img src={loadingGF} alt="loading..." />
				</center>
			)
		}

		let contentStyle = {
			fontFamily: beatStyles.fontType
		}

        return (
            <div className='form-container' style={contentStyle}>
                <div ref={(node) => setScrollRef("main-season-id", node)} id="main-season-id" className="main-season-container">
                    <div data-element={season_id} className={`${this.props.isFull ? "full-screen " : ""}season-container`}>
                        <div ref={(node) => this.setWrapperRef('season', node)} id={id}
                             className='season-txt' onClick={() => this.saveKey('season')} >
                            {
                                Object.keys(season).length > 0 && !season.edit ?
                                    <h1 className='txt-display' onClick={handleSeasonClick}>{season_name}</h1>
                                :
                                    <TextField autoFocus onKeyPress={this.handleEnter(id)}
									  className='input-field season' name="season name" placeholder="Book Title"
                                      value={season_name} onChange={(event) => handleChange(id, event)} />
                            }
                        </div>

                        {
                            Object.keys(season).length > 0 && (
                                <div className={`main-episode-container editor-season${newSeasonId}`}>
                                    {/*showEpisode ? this.renderNewEpisode(showEpisode) : Object.keys(episodes).length > 0 && Object.keys(episodes).map( (episodeKey) => this.renderNewEpisode(episodeKey) ) */}
									{
										episodes ? 
											Object.entries(episodes)
											.sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
										  	  .map( ([episodeKey, episodeData]) => this.renderNewEpisode(episodeKey) )
										: 
											(
												<center>
													<img src={loadingGF} alt="loading..." />
												</center>
											)
									}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SeasonView;