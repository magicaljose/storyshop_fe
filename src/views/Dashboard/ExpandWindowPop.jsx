import React from 'react';
import Popup from "reactjs-popup";

//// Material Components ////
import { 
	TextField, Button
} from '@material-ui/core';
////////////////////////////

/////// Autosize Textarea //////
import autosize from "autosize";
///////////////////////////////

/////////////////////////// Images //////////////////////////
import notesblank_img from 'assets/img/icons/notesblank.png';
import notesflagged_img from 'assets/img/icons/notesflagged.png';
import pulse_img from 'assets/img/icons/pulse.png';
import tearup_img from 'assets/img/icons/tearup.png';
import BeatsMode_img from 'assets/img/icons/BeatsMode.png';
import chapter_selected_img from 'assets/img/icons/chapterview_selected.png';
import chapter_unselected_img from 'assets/img/icons/chapterview_unselected.png';
import summary_selected_img from 'assets/img/icons/summary_view_selected.png';
import summary_unselected_img from 'assets/img/icons/summary_view_unselected.png';
/////////////////////////////////////////////////////////////

import NotesPop from './NotesPop.jsx';

import { Scrollbars } from 'react-custom-scrollbars';

import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

const numberWithCommas = (number) => {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return parts.join(".");
}

const getJSONStringify = (data) => {
    	let cache = [];
		let beats = JSON.stringify(data, function(key, value) {
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Duplicate reference found
		            try {
		                // If this value does not reference a parent it can be deduped
		                return JSON.parse(JSON.stringify(value));
		            } catch (error) {
		                // discard key if value cannot be deduped
		                return;
		            }
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    return value;
		});
		cache = null;

		return beats;
    }

class ExpandWindowPop extends React.Component {
	firebaseOn={}
	defaultState = {
		data: {},
        notesOf: {},
        expandButtons: {},
        showOneSumm: {},
        notesPop: false
	}

	state = {
        data: {},
        notesOf: {},
        expandButtons: {},
        showOneSumm: {},
        notesPop: false
    }

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				const { windowOf } = this.props;

				if (windowOf.scene_id) {
		  			this.getSceneBeats(windowOf.episode_id, windowOf.scene_id);
		  		} else {
		  			this.getBeats(windowOf.episode_id);
		  		} 	
			} else {
				this.setState(this.defaultState);
			}
		}
	}
	
	getSceneBeats = (episode_id, scene_id) => {
		const user_id = localStorage.getItem("storyShop_uid");
		let flag = false;
		let newMessages = 0;
		
		const cb = (error, results) => { 
			if (error) {
	  			console.log(error);
	  		} else {
				if (results.status === 1) {
					const scene_key = results.id;
					let sceneData = results.data;

					if (sceneData.pulse) {
						sceneData["pulse"] = sceneData.pulse.slice(0,50);
					}

					this.getMessagesDetails(episode_id, scene_id);

					this.setState({ data : sceneData });
				} else {
					this.setState({ data : {} });
				}
			}
		}
		getQueries.getSceneWithDoc(scene_id, cb)
  	}

  	getBeats = (episode_id) => {
		const user_id = localStorage.getItem("storyShop_uid");

		let flag = false; 
		let newMessages = 0;
		
		const callback = (error, results) => { 
			if (error) {
	  			console.log(error);
	  		} else {
				if (results.status === 1) {
					let episodeData = results.data;

					if (episodeData.pulse) {
						episodeData["pulse"] = episodeData.pulse.slice(0,50);
					}

					this.getMessagesDetails(episode_id);

					this.setState({ data : episodeData });
				} else {
					this.setState({ data : {} });
				}
			}
		}
		getQueries.getEpisodeWithDoc(episode_id, callback);
    }

    getMessagesDetails = (episode_id, scene_id) => {
    	const user_id = localStorage.getItem("storyShop_uid");

    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				const cb = (err, res) => {
    					if (err) {
    						console.log(err);
    					} else {
    						let data = {};

    						if (res.status === 1) {
    							data = this.countMessages(user_id, results.data, res.data.chat_id);
    						} else {
    							data = this.countMessages(user_id, results.data, "startFrom");
    						}

    						let newMessages = data.newMessages;
    						let flag = data.flag;

    						if (scene_id) {
    							this.setState(prevState => ({
									...prevState,
									data: {
		    					    	...prevState.data,
										[scene_id]: {
											...prevState.data[scene_id],
											messages: newMessages,
											flag: flag
										}
									}
								}));
    						} else {
    							this.setState(prevState => ({
									...prevState,
									data: {
		    					    	...prevState.data,
										[episode_id]: {
											...prevState.data[episode_id],
											messages: newMessages,
											flag: flag
										}
									}
								}));
    						}
    					}
    				}

    				if (scene_id) {
    					getQueries.getSceneReadRecip(scene_id, user_id, cb);
    				} else {
    					getQueries.getEpisodeReadRecip(episode_id, user_id, cb);
    				}
    			}
    		}
    	}

    	if (scene_id) {
    		this.firebaseOn[`chat-${scene_id}`] = realtimeGetQueries.getSceneChat(scene_id, callback);
    	} else {
    		this.firebaseOn[`chat-${episode_id}`] = realtimeGetQueries.getEpisodeChats(episode_id, callback);
    	}
    }

    countMessages = (user_id, data, startFrom) => {
    	let messages = 0;
    	let flag = false;

    	data.forEach(snap => {
    		const chat_id = snap.id;
    		const chatData = snap.data();

    		if (chatData.deleted) return;

    		if (!flag && chatData.flag) {
    			flag = true;
    		}

    		if (chatData.user_id !== user_id) {
    			messages++;

    			if (chat_id === startFrom) {
    				messages = 0;
    			}
    		}
    	});

    	return {
    		newMessages: messages || "",
    		flag: flag 
    	};
    }

    openExpButtons = (id) => {
    	this.setState(prevState => ({
    		...prevState,
    		expandButtons: {
    			...prevState.expandButtons,
    			[id]: !this.state.expandButtons[id]
    		}
    	}));
    }

    showSumm = (id, value) => {
    	if (!value) {
    		let { showOneSumm, expandButtons } = this.state;

    		delete showOneSumm[id];
    		delete expandButtons[id];

    		this.setState({ showOneSumm, expandButtons });
    	} else {
    		this.setState(prevState => ({
    			...prevState,
    			expandButtons: {},
    			showOneSumm: {
    				...prevState.showOneSumm,
    				[id]: true
    			}
    		}));
    	}
    }

    handleChange = (episode_id, scene_id) => (event) => {
    	const { name, value } = event.target;

    	// splitconst fields = this.state.data;
		// let lengths = fields.pulse.split(/[^\s]+/).length - 1;
		//console.log('chk');
		//console.log(lengths);
		//console.log(fields.pulse.length);
		/*if(lengths > 50){
			this.setState({maxlength:fields.pulse.length});
		} else {
			this.setState({maxlength:1000});
		}*/

    	if (scene_id) {
			this.setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					[name]: value
				}
			}));
    	} else {
			this.setState(prevState => ({
				...prevState,
				data: {
					...prevState.data,
					[name]: value
				}
			}));
    	}
    }

    setTextareaWrapperRef = (name, key, node) => {
    	setTimeout(() => {
    		autosize(node);
    	}, 800);
    }

    openNotes = (season_id, episode_id) => {
    	this.setState({
    		notesOf: {
    			season_id,
    			episode_id,
    		},
    		notesPop: true
    	});
    }

    closeNotes = () => {
    	this.setState({ notesPop: false })
    }

    openChapterWindow = (episode_id, scene_id) => {
		const { season_id } = this.props.windowOf;

		if (scene_id) {
			window.open(`https://app.storyshop.io/chapter-${episode_id}/${season_id}?portal=true&scene=${scene_id}`, '', 'width=850,height=250,left=200,top=200');
		} else {
			window.open(`https://app.storyshop.io/chapter-${episode_id}/${season_id}?portal=true`, '', 'width=850,height=250,left=200,top=200');
		}
	}

    saveSummery = (cancel) => {
    	if (cancel) {
    		this.props.closeModal();
    	}

    	const { data } = this.state;
    	const { windowOf } = this.props;

    	const { scene_id, episode_id, season_id } = windowOf;
		
		let fields = {
			name: data.name || "",
			pulse: data.pulse || "",
			summary: data.summary || ""
		}

		const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			const f = {
    				name: data.name,
					pulse: data.pulse,
					notes: data.notes,
					summary: data.summary
    			}

    			let type = "episode";

    			if (scene_id) {
    				type = "scene";
    			}

    			this.props.changeBeatSave(f, type, season_id, episode_id, scene_id);
    			this.props.closeModal();
    		}
    	}

		if (scene_id) {
			fields["name"] = "Scene";

			updateQueries.updateScene(scene_id, fields, callback);
		} else {
		    updateQueries.updateEpisode(episode_id, fields, callback);	
		}
		
    }

	render() {
		const { open, closeModal, windowOf, writeAccess } = this.props;
		const { data, notesPop, notesOf, expandButtons, showOneSumm } = this.state;

		let id = "";
		let season_id = "";
		let scene_id = "";

		if (windowOf) {
			id = windowOf.episode_id;
			season_id = windowOf.season_id;
			scene_id = windowOf.scene_id;
		}

		return (
			<Popup open={open} onClose={closeModal} closeOnDocumentClick className='main-expand-pop'>
				<Scrollbars className='cmn-bb-crd'>
				{scene_id ? 
		  			(
					  	<div className="main_col_sc">
			  				<div key={id} data-element={scene_id} className='sc-bx'>
								<div className='rw1'>
									<div className='rw1-cont'>
										<div className='rwgrd-cont'>
											<div className='cl1 cmn-hd-cl'>Scene</div>

											<div className='cl2'>
												<div className='c16'>
													<span>{numberWithCommas(data.count || 0)}</span>
												</div>
											</div>
											
										    <div className='cl35'>
						                        <div className='cl5'>	
						                        	<div className='cl7'>
														<img src={pulse_img} alt="pulse..." />
												    </div>								
													<span className='txt-pd ch-size'>
														<input
												            rows="1"
															className={`cptxt15`} name="pulse" value={data.pulse || ""} 
															onChange={this.handleChange(id, scene_id)}
															maxLength="50"
															placeholder="Pulse"
														/>
													</span>
												</div>

												<div className='cl3-grid'>
													<div className='cl3-nn'>
														<button className='btn' onClick={() => this.openExpButtons(scene_id)}>
															{
																!showOneSumm[scene_id]? (
																	<img src={summary_selected_img} alt="summary_view..." />
																) : (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																)
															}
														</button>

														{
															expandButtons[scene_id] && (
																<div className='exp-grp'>
																	<button onClick={() => this.showSumm(scene_id, true)}>
																		{
																			!showOneSumm[scene_id] ? (
																				<img src={chapter_unselected_img} alt="summary_view..." />
																			) : (
																				<img src={chapter_selected_img} alt="BeatsModeimg..." />
																			)
																		}
																	</button>

																	<button onClick={() => this.showSumm(scene_id, false)}>
																		{
																			!showOneSumm[scene_id] ? (
																				<img src={summary_selected_img} alt="summary_view..." />
																			) : (
																				<img src={summary_unselected_img} alt="BeatsModeimg..." />
																			)
																		}
																	</button>
																</div>
															)
														}
													</div>

													<div className='cl13' onClick={() => this.openNotes(season_id, id, scene_id)}>
														<button className='btn'>
															{
																data.flag ? (
																	<img src={notesflagged_img} alt="notesflagged..." />
																) : (
																	<img src={notesblank_img} alt="notesflagged..." />
																)
															}
															<span>{data.messages || ""}</span>
														</button>
													</div>

													{writeAccess && (<div className='cl13-fl' onClick={() => this.openChapterWindow(id, scene_id)}>
														<button className='btn'><img src={tearup_img} alt="BeatsModeimg..." /></button>
													</div>)}

													<div className='br-dt'>
														{/*<button className='icn'>
															<i className="fa fa-ellipsis-v"></i>
														</button>*/}
													</div>
												</div>
											</div>

											
										</div>
									</div>
								</div>

								{
									(!showOneSumm[scene_id] ) && (
										<div className='rw2'>
											<div className='txt-rw1 cmn-hd-cl'>
												Beat Summary
											</div>

											<div className='txt-pd ch-size'>
												<textarea ref={(node) => this.setTextareaWrapperRef("summary", scene_id, node)}
													rows="1"
													className={`txt-rw2`} name="summary" value={data.summary || ""} 
													onChange={this.handleChange(id, scene_id)}
												/>
											</div>
										</div>
									)
								}

								<div className='txt-pd ch-btn'>
									{writeAccess && (<button className='icn' onClick={() => this.saveSummery()}>Save</button>) }
									<button className='icn' onClick={() => this.saveSummery(true)}>Cancel</button>
								</div>

								<NotesPop 
									open={notesPop} 
									closeModal={this.closeNotes}
									notesOf={notesOf}
								/>
							</div>
						</div>
		  			)
		  		:
		  			(
						<div className="main_col_chsc">
							<div data-element={id} className='chp-bx'>
								<div className='rw1'>
									<div className='rw1-cont'>
										<div className='rwgrd-cont'>
											<div className='cl1 ch-size'>
												<span className='bl'>Chapter 1</span>
												<textarea ref={(node) => this.setTextareaWrapperRef("chapter", id, node)}
													className={`cl1-in cmn-hd-cl`} name="name" value={data.name}
													onChange={this.handleChange(id)}
											        rows="1"
											        placeholder="Chapter Title"
												/>
											</div>
				                         
											<div className='cl2'>
												<div className='cl6'>
													<span>{numberWithCommas(data.count || 0)}</span>
												</div>
											
											</div>
											
					                        <div className='cl35'>
												<div className='cl5'>
													<div className='cl7'>
														<img src={pulse_img} alt="pulse..." />
											    	</div>
													<span className='txt-pd ch-size'> 
														<input
															className={`cptxt15`} name="pulse" value={data.pulse || ""} 
															onChange={this.handleChange(id)}
												            rows="1"
												            maxLength="50"
												            placeholder="Pulse"
														/>
													</span>
												</div>

												
											  	<div className='cl3-grid'>
													<div className='cl3-nn'>
														<button className='btn' onClick={() => this.openExpButtons(id)}>
															{
																!showOneSumm[id]? (
																	<img src={summary_selected_img} alt="summary_view..." />
																) : (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																)
															}
														</button>

														{
															expandButtons[id] && (
																<div className='exp-grp'>
																	<button className='btn' onClick={() => this.showSumm(id, true)}>
																		{
																			!showOneSumm[id] ? (
																				<img src={chapter_unselected_img} alt="summary_view..." />
																			) : (
																				<img src={chapter_selected_img} alt="BeatsModeimg..." />
																			)
																		}
																	</button>

																	<button onClick={() => this.showSumm(id, false)}>
																		{
																			!showOneSumm[id] ? (
																				<img src={summary_selected_img} alt="summary_view..." />
																			) : (
																				<img src={summary_unselected_img} alt="BeatsModeimg..." />
																			)
																		}
																	</button>
																</div>
															)
														}
													</div>

													<div className='cl13' onClick={() => this.openNotes(season_id, id)}>
														<button className='btn'>
															<span className='rnd-cnt'>{data.messages || ""}</span>
															{
																data.flag ? (
																	<img src={notesflagged_img} alt="notesflagged..." />
																) : (
																	<img src={notesblank_img} alt="notesflagged..." />
																)
															}
														</button>
													</div>
													{writeAccess && (
														<div className='cl13-fl' onClick={() => this.openChapterWindow(id)}>
															<button className='btn'><img src={tearup_img} alt="BeatsModeimg..." /></button>
														</div>
													)}

													<div className='br-dt'>
														{/*<button className='icn'>
															<i className="fa fa-ellipsis-v"></i>
														</button>*/}
													</div>
											  	</div>
											</div>
										</div>
									</div> 
								</div>

								{
									(!showOneSumm[id]) && (
										<div className='rw2'>
											<div className='txt-rw1 cmn-hd-cl'>
												Beat Summary
											</div>

											<div className='txt-pd ch-size'>
												<textarea ref={(node) => this.setTextareaWrapperRef("summary", id, node)}
													className={`txt-rw2`} name="summary" value={data.summary || ""} 
													onChange={this.handleChange(id)}
													rows="2"
												/>
											</div>
										</div>
									)
								}

								<div className='txt-pd ch-btn'>
									{writeAccess && (<button className='icn' onClick={() => this.saveSummery()}>Save</button>) }
									<button className='icn' onClick={() => this.saveSummery(true)}>Cancel</button>
								</div>

								<NotesPop 
									open={notesPop} 
									closeModal={this.closeNotes}
									notesOf={notesOf}
								/>
							</div>
						</div>
					)
				}
				</Scrollbars>
			</Popup>
		)
	}
}

export default ExpandWindowPop;