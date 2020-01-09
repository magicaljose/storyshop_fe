import React from 'react';

//////////// Database ////////////////
import {db} from 'config_db/firebase';
//////////////////////////////////////

import Avatar from 'react-avatar';

//// Material Components ////
import {
	NativeSelect, Button, Fab, FormGroup, FormControlLabel, Checkbox
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Menu } from 'material-ui';
import MenuItem from 'material-ui/Menu/MenuItem';
////////////////////////////

///////////// Local Files ////////////
import NotesPop from './NotesPop.jsx';
import SelectPov from './SelectPov.jsx';
import worldBuilders from '../worldBuilders.js';
//////////////////////////////////////

/////////////////////////// Images //////////////////////////
import setting_close from 'assets/img/settings_close.png';
import setting_open from 'assets/img/settings_open.png';
import loadingGF from 'assets/img/loding_loding.gif';

import notesblank_img from 'assets/img/icons/notesblank.png';
import notesflagged_img from 'assets/img/icons/notesflagged.png';
import pulse_img from 'assets/img/icons/pulse.png';
import summary_view_img from 'assets/img/icons/summary_view.png';
import tearup_img from 'assets/img/icons/tearup.png';
import BeatsMode_img from 'assets/img/icons/BeatsMode.png';
import chapter_selected_img from 'assets/img/icons/chapterview_selected.png';
import chapter_unselected_img from 'assets/img/icons/chapterview_unselected.png';
import summary_selected_img from 'assets/img/icons/summary_view_selected.png';
import summary_unselected_img from 'assets/img/icons/summary_view_unselected.png';
import pov_view_selected from 'assets/img/icons/pov_view_selected.jpg';
import pov_view_unselected from 'assets/img/icons/pov_view_unselected.jpg';
/////////////////////////////////////////////////////////////

/////// Autosize Textarea //////
import autosize from "autosize";
///////////////////////////////

////////// Dragable Component ////////////
import {
	DragDropContext, Droppable, Draggable
} from 'react-beautiful-dnd';
/////////////////////////////////////////

//////////////// Sematic UI /////////////////
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
////////////////////////////////////////////

//////////////// Queries /////////////////
import realtimeGetQueries from 'queries/realtimeGetQueries';
import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';
////////////////////////////////////////////

import enable_beatmode from 'assets/img/icons/enable_beatmode.png';

const getSettingIcon = (setOn) => {
	if (setOn) return setting_open;

	return setting_close
}

const numberWithCommas = (number) => {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
}

class BeatsMode extends React.Component {
	ref = []
	refEl={}
	textareaRef = {};
	editorTimmer={};
	firebaseOn={};
	getScenePovs={};
	getSettingPovs={};
	expndListPovs={};
	defaultState = {
		setting_pop: false,
		type: "Arial",
		size: "font-size-11",
		notesPop: false,
		season_name: "",
		beatsData: {},
		seasonWordCount: 0,
		isLoading: true,
		nextButtons: {},
		expand: {},
		expandButtons: {},
		showOneSumm: {},
		openElepsId: "",
		addPovOpen: false,
		povFields: {},
		povPopData: {},
		povExpndLst: {},
		settings: {},
	}
	state = {
		setting_pop: false,
		type: "Arial",
		size: "font-size-11",
		notesPop: false,
		season_name: "",
		beatsData: {},
		seasonWordCount: 0,
		isLoading: true,
		nextButtons: {},
		expand: {},
		expandButtons: {},
		showOneSumm: {},
		openElepsId: "",
		addPovOpen: false,
		povFields: {},
		povPopData: {},
		povExpndLst: {},
		settings: {}
	}

	componentWillMount = () => {
		const ref = db.ref();
		const { world_id, series_id, season_id } = this.props;

		if (!season_id) return;

		this.getSeasonName(season_id);
		this.getSeasonWordCount(season_id);
		this.getEpisodes(season_id);

		const callback1 = (error1, result1) => {
			if (error1) {
				console.log(error1);
			} else {
				if(result1.status === 1)
				{
					this.setState(result1.data);
				}
			}
		}
    	getQueries.getSeasonBeatModeSettings(season_id,callback1);
	}

	componentDidMount = () => {
		document.addEventListener('mouseup', this.handleClickOutside);
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		if (nextProps.series_id !== this.props.series_id ||
		  nextProps.season_id !== this.props.season_id) {
			return true
		}

		if (this.getJSONStringify(nextState) !== this.getJSONStringify(this.state)) {
			return true
		}

		if (nextState.notesPop !== this.state.notesPop) {
			return true
		}

		if (this.getJSONStringify(nextProps.expand) !== this.getJSONStringify(this.props.expand)) {
			return true
		}

		if (this.getJSONStringify(nextProps.summ_expand) !== this.getJSONStringify(this.props.summ_expand)) {
			return true
		}

		if (this.getJSONStringify(nextProps.showOneSumm) !== this.getJSONStringify(this.props.showOneSumm)) {
			return true
		}

		if (this.getJSONStringify(nextProps.expandButtons) !== this.getJSONStringify(this.props.expandButtons)) {
			return true
		}

		/*if (this.getJSONStringify(nextProps.charFields) !== this.getJSONStringify(this.props.charFields)) {
			return true
		}*/

		return false
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.size !== this.state.size) {
			if (this.textareaRef) {
				autosize.destroy(Object.values(this.textareaRef));
				autosize(Object.values(this.textareaRef));
			}
		}

		if (prevProps.series_id !== this.props.series_id ||
		  prevProps.season_id !== this.props.season_id) {
		  	this.setState(this.defaultState)

			const { world_id, series_id, season_id } = this.props;

			this.getSeasonName(season_id);
			this.getSeasonWordCount(season_id);

			setTimeout(() => {this.getEpisodes(season_id);}, 1000);
		}

        if (prevState.notesPop !== this.state.notesPop) {
            if (this.state.notesPop) {
                if (!this.props.beatScrollBar.view) return;

                this.props.beatScrollBar.view.removeEventListener('wheel', this.props.onBeatScrollHandler, false);
            } else {
                if (!this.props.beatScrollBar.view) return;

                this.props.beatScrollBar.view.addEventListener('wheel', this.props.onBeatScrollHandler, false);
            }
        }
	}

	componentWillUnmount() {
        document.removeEventListener('mouseup', this.handleClickOutside);

        if (this.textareaRef) {
			autosize.destroy(Object.values(this.textareaRef));
			this.textareaRef = {};
		}

		if (this.seasonWordCount) {
			this.seasonWordCount();
		}

		if (this.firebaseOn) {
			Object.entries(this.firebaseOn).map(([key, query]) => {
				query();
			});
		}

		if (this.getScenePovs) {
			Object.entries(this.getScenePovs).map(([id, fb_fn]) => {
				fb_fn();
			});

			this.getScenePovs={}
		}

		if (this.getSettingPovs) {
			Object.entries(this.getSettingPovs).map(([id, fb_fn]) => {
				fb_fn();
			});

			this.getSettingPovs={}
		}
    }

    getJSONStringify = (data) => {
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

    getSeasonName = (season_id) => {
		const callback = (error, result) =>{
			if (error) {
	  			console.log(error);
	  		} else {
				if (result.status === 1) {
					this.setState({ season_name: result.data.name || "" });
				}
			}
		}

		return getQueries.getSeasonWithDoc(season_id, callback);
    }

    getSeasonWordCount = (season_id) => {
		const callback = (error,result) =>{
			if (error) {
	  				console.log(error);
	  			} else {
					if (result.status === 1) {
						this.setState({ seasonWordCount: result.data.count || 0 });
					}
				}
		}

		this.seasonWordCount = realtimeGetQueries.getSeasonWordCountDoc(season_id, callback);
    }

    getEpisodes = (season_id) => {
    	const callback = (error, results) => {
			if (error) {
	  			console.log(error);
	  		} else {
				if (results.data.docs.length > 0) {
					results.data.docChanges().forEach(change => {
						if (change.doc.data().isDeleted === true) return;

						if (change.type === "modified") {
							if (!this.state.beatsData[change.doc.id] && change.doc.data().isDeleted === false) {
							} else {
								if (this.state.beatsData[change.doc.id].count !== change.doc.data().count) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    							...prevState.beatsData,
			    							[change.doc.id]: {
			    								...prevState.beatsData[change.doc.id],
			    								count: change.doc.data().count || 0
			    							}
										}
									}));
								}

								if (this.state.beatsData[change.doc.id].pulse !== change.doc.data().pulse) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    							...prevState.beatsData,
			    							[change.doc.id]: {
			    								...prevState.beatsData[change.doc.id],
			    								pulse: change.doc.data().pulse || ""
			    							}
										}
									}));
								}

								if (this.state.beatsData[change.doc.id].name !== change.doc.data().name) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    							...prevState.beatsData,
			    							[change.doc.id]: {
			    								...prevState.beatsData[change.doc.id],
			    								name: change.doc.data().name || ""
			    							}
										}
									}));
								}

								if (this.state.beatsData[change.doc.id].summary !== change.doc.data().summary) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    							...prevState.beatsData,
			    							[change.doc.id]: {
			    								...prevState.beatsData[change.doc.id],
			    								summary: change.doc.data().summary || ""
			    							}
										}
									}));

									if (this.textareaRef && this.textareaRef[`summary-${change.doc.id}`]) {
										autosize.destroy(this.textareaRef[`summary-${change.doc.id}`]);
										autosize(this.textareaRef[`summary-${change.doc.id}`]);
									}
								}

								if (this.state.beatsData[change.doc.id].sort !== change.doc.data().sort) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    							...prevState.beatsData,
			    							[change.doc.id]: {
			    								...prevState.beatsData[change.doc.id],
			    								sort: change.doc.data().sort || 0
			    							}
										}
									}));
								}

								return;
							}
						}

						if (change.type === "removed") return;

						const episode_id = change.doc.id;
						let episodeData = change.doc.data();

						episodeData['scenes'] = {};
						episodeData['povFields'] = {};
						episodeData['settingsFields'] = {};

						if (episodeData.pulse) {
							episodeData["pulse"] = episodeData.pulse.slice(0,50);
						}

    					this.getMessagesDetails(episode_id);

						this.setState(prevState => ({
							...prevState,
							beatsData: {
    							...prevState.beatsData,
    							[episode_id]: episodeData
							}
						}));

						this.getScenesWithEpisode(episode_id);
					});

					this.setState({ isLoading: false });
				} else {
					this.setState({ isLoading: false });
				}
			}

    	}

		this.firebaseOn[season_id] = realtimeGetQueries.getEpisodesWithSeason_id(season_id, callback);
    }

    getScenesWithEpisode = (episode_id) => {
		const callback = (error, results) => {
			if (error) {
	  			console.log(error);
	  		} else {
				if (results.data.docs.length > 0) {
					results.data.docChanges().forEach(change => {
						if (change.doc.data().isDeleted === true) return;

						if (change.type === "modified") {							
							if (!this.state.beatsData[episode_id].scenes[change.doc.id] && change.doc.data().isDeleted === false) {
							} else {
								if (this.state.beatsData[episode_id].scenes[change.doc.id].count !== change.doc.data().count) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    					    	...prevState.beatsData,
											[episode_id]: {
												...prevState.beatsData[episode_id],
												scenes: {
													...prevState.beatsData[episode_id].scenes,
													[change.doc.id]: {
														...prevState.beatsData[episode_id].scenes[change.doc.id],
														count: change.doc.data().count || 0
													}
												}
											}
										}
									}));
								}

								if (this.state.beatsData[episode_id].scenes[change.doc.id].pulse !== change.doc.data().pulse) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    					    	...prevState.beatsData,
											[episode_id]: {
												...prevState.beatsData[episode_id],
												scenes: {
													...prevState.beatsData[episode_id].scenes,
													[change.doc.id]: {
														...prevState.beatsData[episode_id].scenes[change.doc.id],
					    								pulse: change.doc.data().pulse || ""
													}
												}
											}
										}
									}));
								}

								if (this.state.beatsData[episode_id].scenes[change.doc.id].name !== change.doc.data().name) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    					    	...prevState.beatsData,
											[episode_id]: {
												...prevState.beatsData[episode_id],
												scenes: {
													...prevState.beatsData[episode_id].scenes,
													[change.doc.id]: {
														...prevState.beatsData[episode_id].scenes[change.doc.id],
					    								name: change.doc.data().name || ""
													}
												}
											}
										}
									}));
								}

								if (this.state.beatsData[episode_id].scenes[change.doc.id].summary !== change.doc.data().summary) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    					    	...prevState.beatsData,
											[episode_id]: {
												...prevState.beatsData[episode_id],
												scenes: {
													...prevState.beatsData[episode_id].scenes,
													[change.doc.id]: {
														...prevState.beatsData[episode_id].scenes[change.doc.id],
					    								summary: change.doc.data().summary || ""
													}
												}
											}
										}
									}));

									if (this.textareaRef && this.textareaRef[`summary-${change.doc.id}`]) {
										autosize.destroy(this.textareaRef[`summary-${change.doc.id}`]);
										autosize(this.textareaRef[`summary-${change.doc.id}`]);
									}
								}

								if (this.state.beatsData[episode_id].scenes[change.doc.id].sort !== change.doc.data().sort) {
									this.setState(prevState => ({
										...prevState,
										beatsData: {
			    					    	...prevState.beatsData,
											[episode_id]: {
												...prevState.beatsData[episode_id],
												scenes: {
													...prevState.beatsData[episode_id].scenes,
													[change.doc.id]: {
														...prevState.beatsData[episode_id].scenes[change.doc.id],
					    								sort: change.doc.data().sort || 0
													}
												}
											}
										}
									}));
								}

								return;
							}
						}

						if (change.type === "removed") return;

						const scene_id = change.doc.id;
						let scenesData = change.doc.data();

						if (scenesData.pulse) {
							scenesData["pulse"] = scenesData.pulse.slice(0,50);
						}

						this.getMessagesDetails(episode_id, scene_id);

						this.getScenePov(episode_id, scene_id);
						this.getSettingPov(episode_id, scene_id);

						this.setState(prevState => ({
							...prevState,
							beatsData: {
    					    	...prevState.beatsData,
								[episode_id]: {
									...prevState.beatsData[episode_id],
									scenes: {
										...prevState.beatsData[episode_id].scenes,
										[scene_id]: scenesData
									}
								}
							}
						}));
					});
				}
			}
		}

		this.firebaseOn[episode_id] = realtimeGetQueries.getSceneWithEpisode_id(episode_id, callback);
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
									beatsData: {
		    					    	...prevState.beatsData,
										[episode_id]: {
											...prevState.beatsData[episode_id],
											scenes: {
												...prevState.beatsData[episode_id].scenes,
												[scene_id]: {
													...prevState.beatsData[episode_id].scenes[scene_id],
													messages: newMessages,
													flag: flag
												}
											}
										}
									}
								}));
    						} else {
    							this.setState(prevState => ({
									...prevState,
									beatsData: {
		    					    	...prevState.beatsData,
										[episode_id]: {
											...prevState.beatsData[episode_id],
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

    getScenePov = (episode_id, scene_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				let povId = Object.entries(result.data)[0][0];

    				let povFields = this.state.beatsData[episode_id].povFields;

    				if (this.state.beatsData[episode_id].scenes[scene_id].povField !== povId &&
    				this.state.beatsData[episode_id].povFields[this.state.beatsData[episode_id].scenes[scene_id].povField]) {
    					delete povFields[this.state.beatsData[episode_id].scenes[scene_id].povField];
    				}

    				this.setState(prevState => ({
						...prevState,
						beatsData: {
					    	...prevState.beatsData,
							[episode_id]: {
								...prevState.beatsData[episode_id],
								povFields: {
									...povFields,
									[povId]: true
								},
								scenes: {
									...prevState.beatsData[episode_id].scenes,
									[scene_id]: {
										...prevState.beatsData[episode_id].scenes[scene_id],
										povField: povId
									}
								}
							}
						}
					}));
    			}
    		}
    	}

    	this.getScenePovs[scene_id] = realtimeGetQueries.getScenePov(scene_id, callback);
    }

    getSettingPov = (episode_id, scene_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				let povId = Object.entries(result.data)[0][0];

    				this.getBuilderOfPov(povId);

    				this.setState(prevState => ({
						...prevState,
						beatsData: {
					    	...prevState.beatsData,
							[episode_id]: {
								...prevState.beatsData[episode_id],
								settingsFields: {
									...prevState.beatsData[episode_id].settingsFields,
									[povId]: true
								},
								scenes: {
									...prevState.beatsData[episode_id].scenes,
									[scene_id]: {
										...prevState.beatsData[episode_id].scenes[scene_id],
										settingField: povId
									}
								}
							}
						}
					}));
    			}
    		}
    	}

    	this.getSettingPovs[scene_id] = realtimeGetQueries.getScenePovSetting(scene_id, callback);
    }

    getBuilderOfPov = (builder_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				this.setState(prevState => ({
    					...prevState,
    					settings: {
    						...prevState.settings,
    						[builder_id]: result.data
    					}
    				}))
    			}
    		}
    	}

    	getQueries.getBuilderWithDoc(builder_id, callback);
    }

   	handleClickOutside = (event) => {
   		try {
   			if (this.ref.setting_pop && !this.ref.setting_pop.contains(event.target)) {
		        if (this.state.setting_pop) this.setState({ setting_pop: false });
	      	}

	      	if (this.refEl) {
	      		Object.entries(this.refEl).map(item => {
	      			if (this.refEl[item[0]] && !this.refEl[item[0]].contains(event.target)) {
	      				this.setState(prevState => ({
	      					...prevState,
	      					nextButtons: {
	      						...prevState.nextButtons,
	      						[item[0]]: false
	      					}
	      				}));
	      			}
	      		})
	      	}

	      	if (this.expndListPovs) {
	      		Object.entries(this.expndListPovs).map(item => {
	      			if (this.expndListPovs[item[0]] && !this.expndListPovs[item[0]].contains(event.target)) {
	      				this.setState({ povExpndLst: {} });
	      			}
	      		})
	      	}
   		} catch(e) {
   			console.log(e);

			db.ref().child("error_log")
				.push({
					user_id: localStorage.getItem("storyShop_uid") || "",
					Date: new Date(),
					Component: "BeatsMode",
					ErrorFunction: "handleClickOutside",
					error_message: e || ""
				});
   		}
    }

	setWrapperRef = (key, node) => {
        this.ref[key] = node;
    }

    setElWrapperRef = (key, node) => {
        this.refEl[key] = node;
    }

    setTextareaWrapperRef = (name, key, node) => {
        this.textareaRef[`${name}-${key}`] = node;

        setTimeout(() => {
        	autosize(node);
        }, 600)
    }


    handlePop = name => {
	    this.setState({ [name]: !this.state[name] });
    }

    handleSettingChange = name => event => {
    	if (!this.props.writeAccess) return;
	    this.setState({[name]: event.target.value});
		const { season_id } = this.props;
		const callback = (error, result) => {
			if (error) {
				console.log(error);
			}
    	}
    	const fields = {
				[name]: event.target.value
		}
		updateQueries.updateBeatSettings(season_id,fields,callback);
    }

    openNotes = (season_id, episode_id, scene_id, sceneNumber) => {
    	if (scene_id) {
    		this.setState({
    			notesOf: {
    				season_id,
    				episode_id,
    				scene_id,
    				sceneNumber
    			},
    			notesPop: true
    		})
    	} else {
    		this.setState({
    			notesOf: {
    				season_id,
    				episode_id,
    			},
    			notesPop: true
    		})
    	}

    }

    closeNotes = () => {
    	this.setState({ notesPop: false });
    }

    appendNewBeat = (type, episode_id) => {
		const { season_id } = this.props;
		if (type === "episode") {
		const callback1 = (error1,result1) =>{
			if (error1) {
	  			console.log(error1);
	  			}
			else {
				  let fieldss ={
						season_id,
						sort:result1.data.docs.length
					};
					const callback = (error,result) =>{
					if (error) {
							console.log(error);
						}
					}
					return setQueries.insertEpisode(fieldss, callback);
			}
		}
		return getQueries.getEpisodesWithSeason_id(season_id,callback1);
		}
		else if (type === "scene") {
			 const callback1 = (error1,result1) =>{
			if (error1) {
	  			console.log(error1);
	  			}
				else
				{
					let fieldss ={
						episode_id,
						name:"Scene",
						sort:result1.data.docs.length
					};
					const callback = (error,result) =>{
					if (error) {
							console.log(error);
						}
					}
					return setQueries.insertScene(fieldss, callback);
				}
			 }
			return getQueries.getSceneWithEpisode_id(episode_id,callback1);
		 }
    }

    openNextButtons = (id) => {
    	this.setState(prevState => ({
	    		...prevState,
	    		openElepsId: id,
	    		nextButtons: {
	    			...prevState.nextButtons,
	    			[id]: !this.state.nextButtons[id]
	    		}
	    	}));

    }

    closeNextButtons = (id, index, type, sc_type, sc_id) => {
    	if (type === "clone") {
    		if (sc_type) {
    			this.setState(prevState => ({
		    		...prevState,
		    		nextButtons: {
		    			...prevState.nextButtons,
		    			[sc_id]: !this.state.nextButtons[sc_id]
		    		}
		    	}));
    			this.props.cloneNewScene(id, sc_id, index);
    		} else {
    			this.setState(prevState => ({
		    		...prevState,
		    		nextButtons: {
		    			...prevState.nextButtons,
		    			[id]: !this.state.nextButtons[id]
		    		}
		    	}));
    			this.props.cloneNewEpisode(id, index)
    		}
    	} else {
    		if (sc_type) {
    			this.setState(prevState => ({
		    		...prevState,
		    		nextButtons: {
		    			...prevState.nextButtons,
		    			[sc_id]: !this.state.nextButtons[sc_id]
		    		}
		    	}));
    			this.props.appendNewScene(id, index)
    		} else {
    			this.setState(prevState => ({
		    		...prevState,
		    		nextButtons: {
		    			...prevState.nextButtons,
		    			[id]: !this.state.nextButtons[id]
		    		}
		    	}));
    			this.props.appendNewEpisode(id, index)
    		}
    	}
    }

    deleteItem = (episode_id, scene_id) => {
    	const { season_id } = this.props;

    	if (scene_id) {
    		let beatsData = this.state.beatsData;
    		if (!beatsData) return;
    		let episode = beatsData[episode_id];
    		if (!episode) return;
    		let scenes = episode.scenes;
    		if (!scenes) return;

	    	delete scenes[scene_id];

	    	this.setState({ beatsData });

    		this.props.removeScene(season_id, episode_id, scene_id);
    	} else {
    		let beatsData = this.state.beatsData;
    		if (!beatsData) return;

	    	delete beatsData[episode_id];

	    	this.setState({ beatsData });

    		this.props.removeEpisode(season_id, episode_id);
    	}

    	this.setState({nextButtons: {}});
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
    	if (!this.props.writeAccess) return;
    	const { name, value } = event.target;
    	const ref = db.ref();
		const { season_id } = this.props;

		const episodeRef = ref.child("test_episode").child(season_id)

    	if (scene_id) {
    		if (this.editorTimmer[`${name}-${scene_id}`]) {
				clearTimeout(this.editorTimmer[`${name}-${scene_id}`]);
				this.editorTimmer[`${name}-${scene_id}`] = null;
			}

    		this.editorTimmer[`${name}-${scene_id}`] = setTimeout(() => {
    			const callback = (error, result) => {
    				if (error) {
    					console.log(error);
    				} else {
    					const fields = this.state.beatsData[episode_id].scenes[scene_id];

    					const ff = {
    						name: fields.name,
							summary: fields.summary,
							notes: fields.notes,
							pulse: fields.pulse || ""
    					}

    					this.props.changeBeatSave(ff, "scene", season_id, episode_id, scene_id)
    				}
    			}

    			updateQueries.updateScene(scene_id, {[name]: value}, callback);
    		}, 1000);

    		this.setState(prevState => ({
    			...prevState,
    			beatsData: {
    				...prevState.beatsData,
    				[episode_id]: {
    					...prevState.beatsData[episode_id],
    					"scenes": {
    						...prevState.beatsData[episode_id].scenes,
    						[scene_id]: {
    							...prevState.beatsData[episode_id].scenes[scene_id],
    							[name]: value
    						}
    					}
    				}
    			}
    		}));
    	} else {

    		if (this.editorTimmer[`${name}-${episode_id}`]) {
				clearTimeout(this.editorTimmer[`${name}-${episode_id}`]);
				this.editorTimmer[`${name}-${episode_id}`] = null;
			}

    		this.editorTimmer[`${name}-${episode_id}`] = setTimeout(() => {
    			const callback = (error, result) => {
    				if (error) {
    					console.log(error);
    				} else {
    					const fields = this.state.beatsData[episode_id];

    					const ff = {
    						name: fields.name,
							summary: fields.summary,
							notes: fields.notes,
							pulse: fields.pulse || ""
    					}

    					this.props.changeBeatSave(ff, "episode", season_id, episode_id);
    				}
    			}

    			updateQueries.updateEpisode(episode_id, {[name]: value}, callback);
    		}, 1000);

    		this.setState(prevState => ({
    			...prevState,
    			beatsData: {
    				...prevState.beatsData,
    				[episode_id]: {
    					...prevState.beatsData[episode_id],
    					[name]: value
    				}
    			}
    		}));
    	}
    }

    handleDropChange = (event, { name, value }) => {
		const { world_id, seriesList } = this.props;

		const [series_id, sName, ssId] = seriesList[value];

		this.props.history.push(`/${world_id}/${series_id}/${ssId}`);
    }

    handleSeriesChange = id => {
		const { world_id, seriesList } = this.props;

		const [series_id, sName, ssId] = seriesList[id];

		this.setState({ ["anchorEl"]: null });

		this.props.history.push(`/${world_id}/${series_id}/${ssId}`);
	}

	handleClick = (name, event) => {
		this.setState({ [name]: event.currentTarget });
	};

	handleClose = name => {
		this.setState({ [name]: null });
	};

	expandBeat = value => {
		this.setState({ summ_expand: value, showOneSumm: {} });
	}

	expandScenes = (index) => {
		this.setState(prevState => ({
			...prevState,
			expand: {
				...prevState.expand,
				[index]: !prevState.expand[index]
			}
		}))
	}

	openChapterWindow = (episode_id, scene_id) => {
		const { season_id } = this.props;

		if (scene_id) {
			window.open(`https://app.storyshop.io/chapter-${episode_id}/${season_id}?portal=true&scene=${scene_id}`, '', 'width=850,height=250,left=200,top=200');
		} else {
			window.open(`https://app.storyshop.io/chapter-${episode_id}/${season_id}?portal=true`, '', 'width=850,height=250,left=200,top=200');
		}
	}

	addPov = (episode_id, scene_id, fieldsOf, selectedPov) => {
		this.setState({
			addPovOpen: true,
			povPopData: {episode_id, scene_id},
			povFieldsOf: fieldsOf,
			povFields: selectedPov ? {[selectedPov]:true} : {}
		});
	}

	closePovModal = () => {
		this.setState({ addPovOpen: false, povPopData: {}, povFieldsOf: "" });
	}

	handlePovChange = (char_id) => (event) => {
		this.setState({ povFields: {[char_id]: event.target.checked} });
	}

	savePovFor = (povfor, povFieldsOf, cancel) => {
		if (cancel) {
			return this.closePovModal();
		}

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				this.closePovModal();
			}
		}

		const { charFields, settingFields } = this.props;

		const data = this.state.povFields;

		if (Object.entries(data).length === 0) return;

		if (povFieldsOf === "pov") {
			if (!charFields[Object.entries(data)[0][0]]) return;
			return updateQueries.insertScenePov(povfor.scene_id, data, callback);
		}

		// if (!settingFields[Object.entries(data)[0][0]]) return;
		updateQueries.insertScenePovSetting(povfor.scene_id, data, callback);
	}

	getPovExpndLst = (episode_id) => {
		if (this.state.povExpndLst[episode_id]) return this.setState({ povExpndLst: {}});
		this.setState({ povExpndLst: {[episode_id]: true} });
	}

    getSettingPop() {
    	const { type, size } = this.state;

    	return (
    		<div className='main-set-pop'>
    			<div className='r1'>
    				<label className='cmn-hd-cl'>Font</label>

					<NativeSelect
					    value={type}
					    onChange={this.handleSettingChange('type')}
					>
					    <option value="Palatino">Palatino</option>
					    <option value="tisa of regular">Tisa OT Regular</option>
					    <option value="Garamond">Garamond</option>
					    <option value="Cochin">Cochin</option>
					    <option value="Helvetica">Helvetica</option>
					    <option value="Times New Roman">Times New Roman</option>
					    <option value="Arial">Arial</option>
					</NativeSelect>
    			</div>

    			<div className='r2'>
    				<label className='cmn-hd-cl'>Font Size</label>

					<NativeSelect
					    value={size}
					    onChange={this.handleSettingChange('size')}
					>
						<option value="">Select Font Size</option>
					    <option value="font-size-9">Small</option>
					    <option value="font-size-11">Medium</option>
					    <option value="font-size-13">Large</option>
					    <option value="font-size-15">Extra Large</option>
					</NativeSelect>
    			</div>
    		</div>
    	)
    }

	getChapterBox(id, data, index) {
		const { season_id, showOneSumm, showExpndOneSumm, expandButtons, summ_expand, writeAccess, charFields, settingFields } = this.props;
		const { size, type, povExpndLst, settings } = this.state;

		let style = {
			"fontFamily": type
		}

		/*let povContent;

		if (data.povFields) {
			let result = Object.entries(data.povFields).map(([povField, povVal]) => povVal === true)

			console.log(result);
			console.log(result.length)
		}*/

		return (
			<div data-element={id} className='chp-bx'>
				<div className='rw1'>
					<div className='rw1-cont'>
						<div className='rwgrd-cont'>
							<div className='cl1 ch-size'>
								<span className='bl'>Chapter {index + 1}</span>
								<textarea style={style} ref={(node) => this.setTextareaWrapperRef("chapter", id, node)}
									className={`cl1-in cmn-hd-cl ${size}`} name="name" value={data.name}
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
										<input style={style} type="text" className={`cptxt15 ${size}`} name="pulse" value={data.pulse || ""}
											onChange={this.handleChange(id)}
											maxLength="50"
								            rows="1"
								            placeholder="Pulse"
										/>
									</span>
								</div>


							  	<div className='cl3-grid'>
									<div className='cl3-nn'>
										<button className='btn' onClick={() => this.props.openExpButtons(`${id}-chapterExpand`)}>
											{
												summ_expand ?
													showExpndOneSumm[id] ? (
														<img src={chapter_selected_img} alt="BeatsModeimg..." />
													) : (
														<img src={summary_selected_img} alt="summary_view..." />
													)
												:
													(showOneSumm[id]) ? (
														<img src={summary_selected_img} alt="summary_view..." />
													) : (
														<img src={chapter_selected_img} alt="BeatsModeimg..." />
													)
											}
											<span className="fixed-hov-ob">Expand Beats Summary</span>
										</button>

										{
											expandButtons[`${id}-chapterExpand`] && (
												<div className='exp-grp'>
													<button className='btn' onClick={() => this.props.showSumm(id, false)}>
														{
															summ_expand ?
																showExpndOneSumm[id] ? (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																) : (
																	<img src={chapter_unselected_img} alt="summary_view..." />
																)
															:
																(showOneSumm[id]) ? (
																	<img src={chapter_unselected_img} alt="summary_view..." />
																) : (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																)
														}
													</button>

													<button onClick={() => this.props.showSumm(id, true)}>
														{
															summ_expand ?
																showExpndOneSumm[id] ? (
																	<img src={summary_unselected_img} alt="BeatsModeimg..." />
																) : (
																	<img src={summary_selected_img} alt="summary_view..." />
																)
															:
																(showOneSumm[id]) ? (
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
											{
												data.flag ? (
													<img src={notesflagged_img} alt="notesflagged..." />
												) : (
													<img src={notesblank_img} alt="notesflagged..." />
												)

											}

                                            {
                                                data.messages && data.messages > 0 && (
                                                    <div className='rnd-cnt'></div>
                                                )
                                            }
											<span className="fixed-hov-ob">Notes Board</span>
										</button>
									</div>
									<div className='cl13-fl'>
										{ writeAccess && (
											<button className='btn' onClick={() => this.openChapterWindow(id)}>
												<img src={tearup_img} alt="BeatsModeimg..." />
												<span className="fixed-hov-ob">Pop Out as New Window</span>
											</button>
										)}
									</div>

									<div className='br-dt' ref={(node) => this.setElWrapperRef(id, node)}>
										{
											writeAccess && (
												<button className='icn' onClick={() => this.openNextButtons(id)}>
													<i className="fa fa-ellipsis-v"></i>
													<span className="fixed-hov-ob">Insert, Clone, or Delete Beat</span>
												</button>
											)
										}

										{
											this.state.nextButtons[id] && (
												<div className='icn-bx'>
													<button disabled={!writeAccess} style={style} onClick={() => this.closeNextButtons(id, index, "insert")}>
														Insert
													</button>

													<button disabled={!writeAccess} style={style} onClick={() => this.closeNextButtons(id, index, "clone")}>
														Clone
													</button>

													<button disabled={!writeAccess} style={style} onClick={() => this.deleteItem(id)}>
														Delete
													</button>
												</div>
											)
										}
									</div>
							  	</div>
							</div>
						</div>
					</div>
				</div>

				{
					summ_expand === "pov" && (
						<div className='rw3 pov-rw'>
							<div className='cmn-grp pov-grp'>
								<div className='cmn-prt cmn-hd-cl'>POVs:</div>
								<div className='cmn-prt crd-grp'>
									{
										data.povFields && Object.entries(data.povFields)
										.filter(([povField, povVal]) => povVal === true)
										.slice(0, 2)
										.map(([povField, povVal], index) => {
											if (povVal) return (
												<div key={index} className='crd-grp-cmn crds'>
													{
														charFields[povField] && charFields[povField].cardAvatar ? (
															<img className='char-prf-avtr' style={
																{height: '42px', width: '42px', borderRadius: '50%'}
															} src={
																charFields[povField].cardAvatar.url
															} alt={
																charFields[povField].cardAvatar.name
															} />
														) : (
															<Avatar size="42px" style={
																{height: '42px', width: '42px', borderRadius: '150px'}
															} className='char-prf-avtr' name={charFields[povField] && charFields[povField].name.val} round={true} />
														)
													}
												</div>
											)
										})
									}

									{
										data.povFields && Object.entries(data.povFields).length > 2 && (
											<div ref={(node) => this.expndListPovs[id] = node} className='crd-grp-cmn pov-expnd'>
												<div className='pov-expnd-btn' onClick={() => this.getPovExpndLst(id)}>
													<i className="fa fa-angle-down" aria-hidden="true"></i>
												</div>

												{
													povExpndLst[id] && (
														<div className='pov-ext-lst'>
															<FormGroup>
																{
																	Object.entries(data.povFields).map(([povField, povVal], index) => (
																		<FormControlLabel key={index}
														                	control={
																				charFields[povField] && charFields[povField].cardAvatar ? (
																					<img className='char-prf-avtr' style={
																						{height: '42px', width: '42px', borderRadius: '50%'}
																					} src={
																						charFields[povField].cardAvatar.url
																					} alt={
																						charFields[povField].cardAvatar.name
																					} />
																				) : (
																					<Avatar size="42px" style={
																						{height: '42px', width: '42px', borderRadius: '150px'}
																					} className='char-prf-avtr' name={charFields[povField] && charFields[povField].name.val} round={true} />
																				)
																			}
														                	label={charFields[povField] && charFields[povField].name.val}
														        			className="list_lbl list_expnd-pv"
														        			labelPlacement="start"
														              	/>
																	))
																}
															</FormGroup>
														</div>
													)
												}
											</div>
										)
									}
								</div>
							</div>

							<div className='cmn-grp cast-grp'>
								<div className='cmn-prt cmn-hd-cl'>Cast:</div>
								<div className='cmn-prt crd-grp'>
									{
										Object.entries(charFields)
										.map(([char_id, card], index_key) => {
											if (!card.appearance) return;

											const found = card.appearance.find(element => element.episode_id === id);

											if (!found) return;

											return (
												<div key={index_key} className='crd-grp-cmn crds'>
													{
														card && card.cardAvatar ? (
															<img className='char-prf-avtr' style={
																{height: '42px', width: '42px', borderRadius: '50%'}
															} src={
																card && card.cardAvatar && card.cardAvatar.url
															} alt={
																card && card.cardAvatar && card.cardAvatar.name
															} />
														) : (
															<Avatar size="42px" style={
																{height: '42px', width: '42px', borderRadius: '150px'}
															} className='char-prf-avtr' name={card && card.name && card.name.val} round={true} />
														)

													}
												</div>
											)
										})
									}
								</div>
							</div>

							<div className='cmn-grp set-grp'>
								<div className='cmn-prt cmn-hd-cl'>Settings:</div>
								<div className='cmn-prt crd-grp ext'>
									{
										data.settingsFields && Object.entries(data.settingsFields)
										.slice(0, 2)
										.map(([povField, povVal], index) => (
											<div key={index} className='crd-grp-cmn crds'>
												{
													settings[povField] && settings[povField].cardAvatar ? (
														<img className='char-prf-avtr' style={
															{height: '42px', width: '42px', borderRadius: '50%'}
														} src={
															settings[povField].cardAvatar.url
														} alt={
															settings[povField].cardAvatar.name
														} />
													) : (
														<Avatar size="42px" style={
															{height: '42px', width: '42px', borderRadius: '150px'}
														} className='char-prf-avtr' name={settings[povField] && settings[povField].name} round={true} />
													)

												}
											</div>
										))
									}

									{
										data.settingsFields && Object.entries(data.settingsFields).length > 2 && (
											<div ref={(node) => this.expndListPovs[`setting_${id}`] = node} className='crd-grp-cmn pov-expnd'>
												<div className='pov-expnd-btn' onClick={() => this.getPovExpndLst(`setting_${id}`)}>
													<i className="fa fa-angle-down" aria-hidden="true"></i>
												</div>

												{
													povExpndLst[`setting_${id}`] && (
														<div className='pov-ext-lst'>
															<FormGroup>
																{
																	Object.entries(data.settingsFields).map(([povField, povVal], index) => (
																		<FormControlLabel key={index}
														                	control={
																				settings[povField] && settings[povField].cardAvatar ? (
																					<img className='char-prf-avtr' style={
																						{height: '42px', width: '42px', borderRadius: '50%'}
																					} src={
																						settings[povField].cardAvatar.url
																					} alt={
																						settings[povField].cardAvatar.name
																					} />
																				) : (
																					<Avatar size="42px" style={
																						{height: '42px', width: '42px', borderRadius: '150px'}
																					} className='char-prf-avtr' name={settings[povField] && settings[povField].name} round={true} />
																				)

																			}
														                	label={
														                		<div>
														                			<span>{settings[povField] && settings[povField].name}</span>
														                		</div>
														                	}
														        			className="list_lbl list_expnd-pv"
														        			labelPlacement="start"
														              	/>
																	))
																}
															</FormGroup>
														</div>
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

				{
					summ_expand ?
						(!showExpndOneSumm[id] || !summ_expand) && (
							<div className='rw2'>
								<div className='txt-rw1 cmn-hd-cl'>
									Beat Summary
								</div>

								<span className='txt-pd ch-size'>
									<textarea style={style} ref={(node) => this.setTextareaWrapperRef("summary", id, node)}
										className={`txt-rw2 ${size}`} name="summary" value={data.summary || ""}
										onChange={this.handleChange(id)}
								        rows="2"
									/>
								</span>
							</div>
						)
					:
						(showOneSumm[id]) && (
							<div className='rw2'>
								<div className='txt-rw1 cmn-hd-cl'>
									Beat Summary
								</div>

								<span className='txt-pd ch-size'>
									<textarea style={style} ref={(node) => this.setTextareaWrapperRef("summary", id, node)}
										className={`txt-rw2 ${size}`} name="summary" value={data.summary || ""}
										onChange={this.handleChange(id)}
								        rows="2"
									/>
								</span>
							</div>
						)
				}
			</div>
		)
	}

	getSceneBox(key, episode_id, scene_id, data) {
		const {
			season_id, showOneSumm, showExpndOneSumm, expandButtons, summ_expand,
			writeAccess, charFields, settingFields, povExpndLst
		} = this.props;
		const { size, type, settings } = this.state;

		let style = {
			"fontFamily": type
		}

		return (
			<div key={key} data-element={scene_id} className='sc-bx'>
				<div className='rw1'>
					<div className='rw1-cont'>
						<div className='rwgrd-cont'>
							<div className='cl1 cmn-hd-cl'>Scene {key + 1}</div>

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
										<input style={style} type="text"
								            rows="1"
								            maxLength="50"
											className={`cptxt15 ${size}`} name="pulse" value={data.pulse || ""}
											onChange={this.handleChange(episode_id, scene_id)}
											placeholder="Pulse"
										/>
									</span>
								</div>

								<div className='cl3-grid'>
									<div className='cl3-nn'>
										<button className='btn' onClick={() => this.props.openExpButtons(`scene_${scene_id}`)}>
											{
												summ_expand ?
													showExpndOneSumm[`scene_${scene_id}`] ? (
														<img src={chapter_selected_img} alt="BeatsModeimg..." />
													) : (
														<img src={summary_selected_img} alt="summary_view..." />
													)
												:
													(showOneSumm[`scene_${scene_id}`]) ? (
														<img src={summary_selected_img} alt="summary_view..." />
													) : (
														<img src={chapter_selected_img} alt="BeatsModeimg..." />
													)
											}
											<span className="fixed-hov-ob">Expand Beats Summary</span>
										</button>

										{
											expandButtons[`scene_${scene_id}`] && (
												<div className='exp-grp'>
													<button onClick={() => this.props.showSumm(`scene_${scene_id}`, false)}>
														{
															summ_expand ?
																showExpndOneSumm[`scene_${scene_id}`] ? (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																) : (
																	<img src={chapter_unselected_img} alt="summary_view..." />
																)
															:
																(showOneSumm[`scene_${scene_id}`]) ? (
																	<img src={chapter_unselected_img} alt="summary_view..." />
																) : (
																	<img src={chapter_selected_img} alt="BeatsModeimg..." />
																)
														}
													</button>

													<button onClick={() => this.props.showSumm(`scene_${scene_id}`, true)}>
														{
															summ_expand ?
																showExpndOneSumm[`scene_${scene_id}`] ? (
																	<img src={summary_unselected_img} alt="BeatsModeimg..." />
																) : (
																	<img src={summary_selected_img} alt="summary_view..." />
																)
															:
																(showOneSumm[`scene_${scene_id}`]) ? (
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

									<div className='cl13' onClick={() => this.openNotes(season_id, episode_id, scene_id, key + 1)}>
										<button className='btn'>
											{
												data.flag ? (
													<img src={notesflagged_img} alt="notesflagged..." />
												) : (
													<img src={notesblank_img} alt="notesflagged..." />
												)

											}
                                            {
                                                data.messages && data.messages > 0 && (
                                                    <div className='rnd-cnt'></div>
                                                )
                                            }
											<span className="fixed-hov-ob">Notes Board</span>
										</button>
									</div>

									{writeAccess && (
										<div className='cl13-fl' onClick={() => this.openChapterWindow(episode_id, scene_id)}>
											<button className='btn'>
												<img src={tearup_img} alt="BeatsModeimg..." />
												<span className="fixed-hov-ob">Pop Out as New Window</span>
											</button>
										</div>
									)}

									<div className='br-dt' ref={(node) => this.setElWrapperRef(scene_id, node)}>
										{
											writeAccess && (
												<button className='icn' onClick={() => this.openNextButtons(scene_id)}>
													<i className="fa fa-ellipsis-v"></i>
													<span className="fixed-hov-ob">Insert, Clone, or Delete Beat</span>
												</button>
											)
										}

										{
											this.state.nextButtons[scene_id] && (
												<div className='icn-bx'>
													<button disabled={!writeAccess} style={style} onClick={() => this.closeNextButtons(episode_id, key, "insert", true, scene_id)}>
														Insert
													</button>

													<button disabled={!writeAccess} style={style} onClick={() => this.closeNextButtons(episode_id, key, "clone", true, scene_id)}>
														Clone
													</button>

													<button disabled={!writeAccess} style={style} onClick={() => this.deleteItem(episode_id, scene_id)}>
														Delete
													</button>
												</div>
											)
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{
					summ_expand === "pov" && (
						<div className='rw3 pov-rw'>
							<div className='cmn-grp pov-grp'>
								<div className='cmn-prt cmn-hd-cl'>POV:</div>
								<div className='cmn-prt crd-grp'>
									{
										data.povField && (
											<div className='crd-grp-cmn crds'
											onClick={() => {if (writeAccess) this.addPov(episode_id, scene_id, "pov", data.povField)}}
											>
												{
													charFields && charFields[data.povField] && charFields[data.povField].cardAvatar ? (
														<img className='char-prf-avtr' style={
															{height: '47px', width: '47px', borderRadius: '50%'}
														} src={
															charFields[data.povField].cardAvatar.url
														} alt={
															charFields[data.povField].cardAvatar.name
														} />
													) : (
														<Avatar size="47px" style={
															{height: '47px', width: '47px', borderRadius: '150px'}
														} className='char-prf-avtr' name={charFields[data.povField] && charFields[data.povField].name.val} round={true} />
													)

												}
											</div>
										)
									}

									{
										!data.povField && writeAccess && (
											<div className='crd-grp-cmn add'>
												<Fab onClick={() => this.addPov(episode_id, scene_id, "pov")} color="primary" aria-label="Add" className="beat-add-pv"><AddIcon /></Fab>
											</div>
										)
									}
								</div>
							</div>

							<div className='cmn-grp cast-grp'>
								<div className='cmn-prt cmn-hd-cl'>Cast:</div>
								<div className='cmn-prt crd-grp'>
									{
										Object.entries(charFields)
										.map(([char_id, char], index_key) => {
											if (!char.appearance) return;

											const found = char.appearance.find(element => element.scene_id === scene_id);

											if (!found) return;

											return (
												<div key={index_key} className='crd-grp-cmn crds'>
													{
														char.cardAvatar ? (
															<img className='char-prf-avtr' style={
																{height: '47px', width: '47px', borderRadius: '50%'}
															} src={
																char.cardAvatar.url
															} alt={
																char.cardAvatar.name
															} />
														) : (
															<Avatar size="47px" style={
																{height: '47px', width: '47px', borderRadius: '150px'}
															} className='char-prf-avtr' name={char && char.name && char.name.val} round={true} />
														)
													}
												</div>
											)
										})
									}
								</div>
							</div>

							<div className='cmn-grp set-grp'>
								<div className='cmn-prt cmn-hd-cl'>Setting:</div>
								<div className='cmn-prt crd-grp'>
									{
										data.settingField && (
											<div className='crd-grp-cmn crds' 
											onClick={() => {if (writeAccess) this.addPov(episode_id, scene_id, "setting", data.settingField)}}
											>
												{
													settings && settings[data.settingField] && settings[data.settingField].cardAvatar ? (
														<img className='char-prf-avtr' style={
															{height: '47px', width: '47px', borderRadius: '50%'}
														} src={
															settings[data.settingField].cardAvatar.url
														} alt={
															settings[data.settingField].cardAvatar.name
														} />
													) : (
														<Avatar size="47px" style={
															{height: '47px', width: '47px', borderRadius: '150px'}
														} className='char-prf-avtr' name={settings[data.settingField] && settings[data.settingField].name} round={true} />
													)

												}
											</div>
										)
									}

									{
										!data.settingField && writeAccess && (
											<div className='crd-grp-cmn add'>
												<Fab onClick={() => this.addPov(episode_id, scene_id, "setting")} color="primary" aria-label="Add" className="beat-add-pv"><AddIcon /></Fab>
											</div>
										)
									}
								</div>
							</div>
						</div>
					)
				}

				{
					summ_expand ?
						(!showExpndOneSumm[`scene_${scene_id}`] || !summ_expand) && (
							<div className='rw2'>
								<div className='txt-rw1 cmn-hd-cl'>
									{/*General Description*/} Beat Summary
								</div>

								<span className='txt-pd ch-size'>
									<textarea style={style} ref={(node) => this.setTextareaWrapperRef("summary", scene_id, node)}
								        rows="1"
										className={`txt-rw2 ${size}`} name="summary" value={data.summary || ""}
										onChange={this.handleChange(episode_id, scene_id)}
									/>
								</span>
							</div>
						)
					:
						(showOneSumm[`scene_${scene_id}`]) && (
							<div className='rw2'>
								<div className='txt-rw1 cmn-hd-cl'>
									{/*General Description*/} Beat Summary
								</div>

								<span className='txt-pd ch-size'>
									<textarea style={style} ref={(node) => this.setTextareaWrapperRef("summary", scene_id, node)}
								        rows="1"
										className={`txt-rw2 ${size}`} name="summary" value={data.summary || ""}
										onChange={this.handleChange(episode_id, scene_id)}
									/>
								</span>
							</div>
						)
				}
			</div>
		)
	}

	getNextButtons(episode_id, sort) {
		const { appendNewEpisode, appendNewScene } = this.props;

		return (
			<div className='btns-pr'>
				<button className='bt-txt'
					onClick={() => appendNewEpisode(episode_id, sort)}
				>
					Add Chapter
				</button>

				<button className='bt-txt'
					onClick={() => appendNewScene(episode_id, sort)}
				>
					Add Scene
				</button>
			</div>
		)
	}

	renderBeats() {
		const { season_id, appendNewEpisode, appendNewScene, writeAccess, expand } = this.props;
		const { isLoading, beatsData } = this.state;

		const droppEpisode = `${season_id}`;
		const episodeType = `episode ${season_id}`;

		if (isLoading) {
			return (
				<center>
					<img src={loadingGF} alt="loading..." />
				</center>
			)
		}

		return (
			<Droppable droppableId={droppEpisode} type={episodeType} ignoreContainerClipping={true}>
			  {(provided, snapshot) => {
				return (
					<div ref={provided.innerRef}>
						{
							Object.entries(beatsData)
							.sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
							.map(([episode_id, epiData], index) => (
								<Draggable key={episode_id} draggableId={episode_id} index={index} type={episodeType}>
								  {(provided, snapshot) => {
								  	const droppScene = `${season_id} ${episode_id} ${episode_id}`;
								  	let sceneType = `scene ${season_id}`;

									return (
										<div className='main-chp-bx' ref={provided.innerRef}
										  {...provided.draggableProps}
										  {...provided.dragHandleProps} >
										  	<div className='cp-grp'>
										  		<button className='exp' onClick={() => this.props.expandScenes(index)}>
										  			{expand[index] ? (
										  				<span className='exp-ic'>
										  					<i className="fa fa-minus-square"></i>
										  				</span>
										  			) : (
										  				<span className='exp-ic'>
										  					<i className="fa fa-plus-square"></i>
										  				</span>

										  			)}

										  			{expand[index] ? (
										  				<span className="fixed-hov-ob">Collapse All Scene Beats</span>
										  			) : (
										  				<span className="fixed-hov-ob">Expand All Scene Beats</span>
										  			)}
										  			
										  		</button>

										  		{ this.getChapterBox(episode_id, epiData, index) }
										  	</div>

										  	{expand[index] && (
											<Droppable droppableId={droppScene} type={sceneType} ignoreContainerClipping={true}>
											  {(sceneProvided, sceneSnapshot) => {
												return (
													<div ref={sceneProvided.innerRef} className='main-sc-bx'>
														{
															epiData.scenes && Object.entries(epiData.scenes)
																.sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
																.map(([scene_id, scData], sc_index) => {
																	const draggScene = `${scene_id} ${scene_id}`;

																	return (
																		<Draggable key={scene_id} type={sceneType} draggableId={draggScene} index={sc_index}>
																		  {(sceneProvided, sceneSnapshot) => {
																			return (
																				<div ref={sceneProvided.innerRef}
																				  {...sceneProvided.draggableProps}
																				  {...sceneProvided.dragHandleProps}
																				>
																					{this.getSceneBox(sc_index, episode_id, scene_id, scData)}
																				</div>
																			)
																		  }}
																		</Draggable>
																	)
																})
														}
														{sceneProvided.placeholder}

														<div className='aln-cntr'>
															{writeAccess && (<Fab className='bt-new-btn ltl-grn' color="primary" aria-label="Add" onClick={() => appendNewScene(episode_id)}><AddIcon /><span className="fixed-hov-ob">Add Scene</span></Fab>) }
                              
														</div>
													</div>
												)
											  }}
											</Droppable>
											)}
										</div>
									)
								  }}
								</Draggable>

							))
						}
						{provided.placeholder}

						<div className='aln-cntr'>
							{writeAccess && (<Fab className='bt-new-btn' color="primary" aria-label="Add" onClick={appendNewEpisode}><AddIcon /><span className="fixed-hov-ob">Add Chapter</span></Fab>) }
           
						</div>
					</div>
				)
			  }}
			</Droppable>
		)
	}

	render() {
		const {
			handleBeatMode, world_name, seriesList,
			world_id, season_id, series_id, onBeatBarDragEnd, summ_expand,
			showOneSumm, showExpndOneSumm, charFields, settingFields
		} = this.props;

		const {
			setting_pop, notesPop, season_name, seasonWordCount,
			notesOf, type, size, anchorEl, addPovOpen, povFields, povPopData,
			povFieldsOf
		} = this.state;

		if (!seriesList) {
			return (
				<center>
					<img src={loadingGF} alt="loading..." />
				</center>
			)
		}

		const serie = seriesList[series_id];
		if (!serie) {
			return (
				<center>
					<img src={loadingGF} alt="loading..." />
				</center>
			)
		}

		const series_name = serie[1];

		let style = {
			"fontFamily": type
		}

		let dropSeries = [];

		seriesList && Object.entries(seriesList)
			.map(([se_id, [series_idd, sName, ss_id]], index) => {
				if (se_id !== series_id) {
					dropSeries.push({text: sName, value: se_id});
				}
		})

		return (
			<div className={`main-beat-mode ${size}`} style={style}>
				<div className='main-top'>
					<div className='side-btns'>
						<div ref={(node) => this.setWrapperRef('setting_pop', node)} className='stt-bx'>
							<div className='clk-stt' onClick={() => this.handlePop("setting_pop")}>
								<img src={getSettingIcon(setting_pop)} />
							</div>

							{
								setting_pop && (this.getSettingPop())
							}
						</div>

						<div className='b-mode' onClick={() => handleBeatMode("beatMode", false)}>
							<img src={enable_beatmode} alt="enable beat mode" />
							<span className="fixed-hov-ob">Exit Expanded Beats Mode</span>
						</div>
					</div>

					<div className='main-name-box'>

						<div className={`wrld-names cmn-hd-cl ${size}`} style={style}>{world_name}</div>

						<div className={`wds-names cmn-hd-cl ${size}`} style={style}>{series_name}</div>

						<div className='cnt-name'>
							<div className='rw1'>
								<button className={`expnd`}
								  onClick={() => this.props.expandBeat(false)}
								>
								{
									Object.entries(showOneSumm).length === 0 && !summ_expand ? (
										<img src={chapter_selected_img} alt="BeatsModeimg..." />
									) : (
										<img src={chapter_unselected_img} alt="BeatsModeimg..." />
									)

								}
								<span className="fixed-hov-ob">Pulse View</span>

								</button>

								<button className={`expnd2`}
								  onClick={() => this.props.expandBeat(true)}
								>
									{
										Object.entries(showExpndOneSumm).length === 0 && summ_expand === true ? (
										<img src={summary_selected_img} alt="summary_view..." />
										) : (
										<img src={summary_unselected_img} alt="summary_view..." />
										)
									}

									<span className="fixed-hov-ob">Summary View</span>
								</button>

								<button className={`expnd3`}
								  onClick={() => this.props.expandBeat("pov")}
								>
									{
										Object.entries(showExpndOneSumm).length === 0 && summ_expand === "pov" ? (
										<img src={pov_view_selected} style={{height: '25px', width: '25px'}} alt="summary_view..." />
										) : (
										<img src={pov_view_unselected} style={{height: '25px', width: '25px'}} alt="summary_view..." />
										)
									}

									<span className="fixed-hov-ob">POV View</span>
								</button>
							</div>

							<div className='rw2'>
								<span className='cnt-nm cmn-hd-cl'>{season_name}</span>
								<span className='cnt-book'>{numberWithCommas(seasonWordCount || 0)}<span>words</span></span>
							</div>
						</div>
					</div>
				</div>

				<DragDropContext onDragEnd={onBeatBarDragEnd}>
				{this.renderBeats()}
				</DragDropContext>

				<NotesPop
					open={notesPop}
					closeModal={this.closeNotes}
					notesOf={notesOf}
				/>

				<SelectPov
					open={addPovOpen}
					world_id={world_id}
					season_id={season_id}
					povFieldsOf={povFieldsOf}
					charFields={charFields}
					settingFields={settingFields}
					fields={povFields}
					povPopData={povPopData}
					handleChange={this.handlePovChange}
					closeModal={this.closePovModal}
					savePovFor={this.savePovFor}
					getAppearance={this.props.getAppearance}
				/>
			</div>
		)
	}
}

export default BeatsMode;
