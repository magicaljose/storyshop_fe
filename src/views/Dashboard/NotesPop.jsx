import React from 'react';
import Popup from "reactjs-popup";

//// Material Components ////
import { 
	TextField, Button
} from '@material-ui/core';
////////////////////////////

import { Scrollbars } from 'react-custom-scrollbars';

import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

const formatDate = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;

  const strTime = hours + ':' + minutes + '' + ampm;

  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

class NotesPop extends React.Component {
	defaultState = {
		options: {},
		notes: {},
		noteName: "",
		chats: {},
		newMessage: "",
		editComment: {}
	}

	messageRef = null;

	state = {
		options: {},
		notes: {},
		noteName: "",
		chats: {},
		newMessage: "",
		editComment: {}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				const { notesOf } = this.props;

				this.getCommentNotes(notesOf);
			} else {
				if (this.messageRef) {
					this.messageRef();

					this.messageRef = null;
				}

				this.setState(this.defaultState);
			}
		}
	}

	getCommentNotes(notesOf) {
		const { season_id, episode_id, scene_id } = notesOf;
		const user_id = localStorage.getItem("storyShop_uid");
		const user_name = localStorage.getItem("storyShop_user_name");

		const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					let chats = {}

					results.data.forEach(snap => {
						const id = snap.id;
						let data = snap.data();

						if (data.deleted) return;

						chats[id] = data;

						if (!data.user_id) {
							data["user_id"] = user_id;

							const ddata = {
								user_id: user_id
							}

							const cb = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							if (scene_id) {
								updateQueries.updateSceneChat(scene_id, id, ddata, cb);
							} else {
								updateQueries.updateEpisodeChat(episode_id, id, ddata, cb);
							}
						}

						if (!data.user_name) {
							data["user_name"] = user_name;

							const ddata = {
								user_name: user_name
							}

							const cb = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							if (scene_id) {
								updateQueries.updateSceneChat(scene_id, id, ddata, cb);
							} else {
								updateQueries.updateEpisodeChat(episode_id, id, ddata, cb);
							}
						}

						if (data.user_id !== user_id) {
							const cb = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							const ddata = {
								chat_id: id
							}

							if (scene_id) {
								updateQueries.updateSceneChatReadRecip(scene_id, user_id, ddata, cb);
							} else {
								updateQueries.updateEpisodeChatReadRecip(episode_id, user_id, ddata, cb);
							}
						}
					});

					this.setState({ chats: chats });
				}
			}
		}

		const oldNotescallback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					results.data.forEach(snap => {
						const id = snap.id;
						let data = snap.data();

						if (data.deleted) return;

						setQueries.insertSceneChat(scene_id, data, (e, r) => {});
						updateQueries.updateOldSceneChat(scene_id, id, {deleted: true}, (e, r) => {});
					});
				}
			}
		}

		if (scene_id) {
			this.setState({ noteName: "Scene" });

			this.oldNotesRef = realtimeGetQueries.getOldSceneChat(scene_id, oldNotescallback);
			this.messageRef = realtimeGetQueries.getSceneChat(scene_id, callback);
		} else {
			const cb = (error, results) => {
				if (error) {
					console.log(error);
				} else {
					if (results.status===1) {
						this.setState({ noteName: results.data.name || "Chapter" });
					}
				}
			}

			getQueries.getEpisodeWithDoc(episode_id, cb);
			this.messageRef = realtimeGetQueries.getEpisodeChats(episode_id, callback);
		}
	}

	saveComment = (message) => {
		const { notesOf } = this.props;
		const { season_id, episode_id, scene_id } = notesOf;
		const user_name = localStorage.getItem("storyShop_user_name");
		const user_id = localStorage.getItem("storyShop_uid");
		const timestamp = new Date().getTime();

		if (!user_id) return;

		const fields = {
			user_id: user_id,
			user_name: user_name || "",
			timestamp: timestamp,
			message: message,
		};

		const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.status === 1) {
	    			const key = results.key;
	    		}
	    	}
	    }
 
		if (scene_id) {			
			setQueries.insertSceneChat(scene_id, fields, callback);
		} else {
			setQueries.insertEpisodeChat(episode_id, fields, callback);
		}
	}

	handleSubmit = (event) => {
		if (event.keyCode === 13) {
			event.preventDefault();

			const { newMessage } = this.state;

			if (typeof(newMessage) === "string" && newMessage.trim() === "") return;

			this.saveComment(newMessage);

			this.setState({ newMessage: "" });
		}
	}

	handleMessageEdit = comment_id => event => {
		if (event.keyCode === 13) {
			event.preventDefault();

			const { notesOf } = this.props;
			const { season_id, episode_id, scene_id } = notesOf;
			
			const message = this.state.chats[comment_id].message;
			const editedAt = new Date().getTime();

			const fields = { 
				message: message,
				editedAt: editedAt
			};

			const callback = (error, result) => {
				if (error) {
					console.log(error);
				} else {
					if (result.status === 1) {
						this.setState({ editComment: {} });
					}
				}
			}

			if (scene_id) {
				updateQueries.updateSceneChat(scene_id, comment_id, fields, callback);
			} else {
				updateQueries.updateEpisodeChat(episode_id, comment_id, fields, callback);
			}
		}
	}

	handleChange = (event) => {
		const { name, value } = event.target;

		this.setState({ [name]: value });
	}

	handleMessageChange = message_id => event => {
		const { name, value } = event.target;

		this.setState(prevState => ({
			...prevState,
			chats: {
				...prevState.chats,
				[message_id]: {
					...prevState.chats[message_id],
					[name]: value
				}
			}
		}));
	}

	handlePop = (name, id) => {
		this.setState(prevState => ({
			...prevState,
			[name]: {
				...prevState[name],
				[id]: !this.state[name][id]
			}
		}));
    }

    editMessage = (comment_id) => {
    	this.setState(prevState => ({
    		...prevState,
    		editComment: {
    			...prevState.editComment,
    			[comment_id]: true
    		}
    	}));

    	this.handlePop("options", comment_id)
    }

    deleteMessage = (comment_id) => {
		const { notesOf } = this.props;
		const { season_id, episode_id, scene_id } = notesOf;

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.status === 1) {
					this.setState({ editComment: {} });
				}
			}
		}
		
		const fields =  { 
			deleted: true 
		};

		if (scene_id) {
			updateQueries.updateSceneChat(scene_id, comment_id, fields, callback);
		} else {
			updateQueries.updateEpisodeChat(episode_id, comment_id, fields, callback);
		}
    }

    flagComment = (comment_id, flag) => {
    	const { notesOf } = this.props;
		const { season_id, episode_id, scene_id } = notesOf;

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			}
		}
		
		const fields =  { 
			flag: !flag
		};

		if (scene_id) {
			updateQueries.updateSceneChat(scene_id, comment_id, fields, callback);
		} else {
			updateQueries.updateEpisodeChat(episode_id, comment_id, fields, callback);
		}
    }

	getEllipsesPop(comment_id) {
		return (
			<div className='ell-pop'>
				<Button className='ed-cmnt'
					onClick={() => this.editMessage(comment_id)}
				>
					Edit
				</Button>

				<Button className='dlt-cmnt' 
					onClick={() => this.deleteMessage(comment_id)}
				>
					Delete
				</Button>
			</div>
		)
	}

	getCommentBox(comment_id, user, dt, msg, flag) {
		const { options, editComment } = this.state;

		return (
			<div className='cmnt-bx'>
				<div className='cmnt-hd'>
					<div className='usr drk'>{user}</div>

					<div className='dt'>
						{formatDate(new Date(dt))}
					</div>

					<div className='ell'>
						<div onClick={() => this.handlePop("options", comment_id)}>
							<i className="fa fa-ellipsis-h"></i>
						</div>

						{
							options[comment_id] && (this.getEllipsesPop(comment_id))
						}
					</div>

					<div className={`dngr ${flag ? "flag-active" : ""}`} onClick={() => this.flagComment(comment_id, flag)}>
						<i className="fa fa-exclamation-triangle"></i>
					</div>
				</div>

				{
					editComment[comment_id] ? (
						<TextField
							onKeyDown={this.handleMessageEdit(comment_id)}
						    name="message"
						    value={msg} 
						    onChange={this.handleMessageChange(comment_id)} 
						    multiline
						    rowsMax="5"
						    rows="3"
						    className="msg-fld"
						/>
					) : (
						<div className='cmnt-txt'>{msg}</div>
					)
				}
			</div>
		)
	}

	getCommentsBox() {
		const { chats } = this.state;
		let data = [];

		Object.entries(chats).map(([chat_id, chatData]) => {
			if (chatData.deleted) return;

			const { user_name, timestamp, message, flag } = chatData

			data.push(this.getCommentBox(chat_id, user_name, timestamp, message, flag));
		});

		return (
			<Scrollbars className='editor-hst' autoHide
				autoHideTimeout={800}
				autoHideDuration={200} 
			>
				{data}
			</Scrollbars>
		)
	}

	getCommentArea() {
		const { newMessage } = this.state;

		return (
			<div className='editor-cmt'>
				<TextField
					onKeyDown={this.handleSubmit}
				    name="newMessage"
				    value={newMessage}
				    onChange={this.handleChange}
				    multiline
				    rowsMax="5"
				    rows="4"
				    className="msg-fld"
				/>

				<div className='hlp-txt'>
					<span>Press Enter to Post</span>
				</div>
			</div>
		)
	}

	render() {
		const { open, closeModal, notesOf } = this.props;
		const { noteName } = this.state;

		return (
			<Popup open={open} onClose={closeModal} closeOnDocumentClick className='main-notes-pop'>
				<div className='main-txt cmn-hd-cl'>
					<div className='txt-ttl'>Notes Board</div>

					<div className='txt-nm'>{noteName || "Title"} {notesOf && notesOf.sceneNumber}</div>
				</div>

				<div className='main-editor'>
					{this.getCommentsBox()}

					{this.getCommentArea()}
				</div>
			</Popup>
		)
	}
}

export default NotesPop;