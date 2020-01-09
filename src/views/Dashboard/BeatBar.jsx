import React from 'react';
import {
	Button, ExpansionPanel, ExpansionPanelSummary,
	ExpansionPanelDetails , NativeSelect, Fab
} from '@material-ui/core';
import {
	ExpandMore as ExpandMoreIcon,
	Add as AddIcon
} from '@material-ui/icons';
import { Menu } from 'material-ui';
import MenuItem from 'material-ui/Menu/MenuItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import BeatCard from './BeatCard.jsx';
import NotesPop from './NotesPop.jsx';
import ExpandWindowPop from './ExpandWindowPop.jsx';

import loadingGF from 'assets/img/loding_loding.gif';
import notesblank_img from 'assets/img/icons/notesblank.png';
import notesflagged_img from 'assets/img/icons/notesflagged.png';
import notes_white_dng from 'assets/img/icons/notes_white_dng.png';
import notes_white from 'assets/img/icons/notes_white.png';
import enable_beatmode from 'assets/img/icons/enable_beatmode.png';
import expand_window from 'assets/img/icons/expand_window.png';
import expand_window_grey from 'assets/img/icons/expand_window_grey.png';

const getDeleteSrc = isDraggingOver => (
	isDraggingOver ?
		"data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iI0Q4MDAyNyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
		:
		"data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iIzQ1YmNjNCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
);

class BeatBar extends React.Component {
	state = {
	}

	componentDidUpdate = (prevProps, prevState) => {
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

	handleClick = (name, event) => {
		this.setState({ [name]: event.currentTarget });
	};

	handleClose = name => {
		this.setState({ [name]: null });
	};

	handleSeriesChange = id => {
		const { world_id } = this.props;
		const { seriesList } = this.props.state;

		const [series_id, sName, ssId] = seriesList[id];

		this.setState({ ["anchorEl"]: null });

		this.props.history.push(`/${world_id}/${series_id}/${ssId}`);
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

    openExpandWindow = (season_id, episode_id, scene_id, sceneNumber) => {
    	if (scene_id) {
    		this.setState({
    			windowOf: {
    				season_id,
    				episode_id,
    				scene_id,
    				sceneNumber
    			},
    			expandWindowPop: true
    		})
    	} else {
    		this.setState({
    			windowOf: {
    				season_id,
    				episode_id,
    			},
    			expandWindowPop: true
    		})
    	}
    }

    closeNotes = () => {
    	this.setState({ notesPop: false });
    }

    closeExpandWindow = () => {
    	this.setState({ expandWindowPop: false });
    }

	renderSeason(seasons, season_id) {
		const {
			seasonExpanded
		} = this.props.state;

		const {
			handleExpansion, handleExpansionPanel, writeAccess
		} = this.props;

		let seasonCount = 0;
		let episodeCount = 0;

		////
		// const season = seasons[season_id];
		// if (!season) return <div></div>
		// const droppEpisode = `${season_id}`;
		// const episodeType = `episode episode`;
		// const episodes = season.episodes;
		////

		// return this.renderEpisode(season_id, episodes, droppEpisode, episodeType, episodeCount);

		return (
			<Droppable droppableId="season" type="season season" ignoreContainerClipping={true}>
			  {(seasonProvided, seasonSnapshot) => {
				return (
					<div ref={seasonProvided.innerRef}>
					  {seasons && Object.entries(seasons).length > 0 && Object.entries(seasons)[0][1].key &&
					  Object.entries(seasons).map(([seasonKey, season], index) => {
						const droppEpisode = `${seasonKey}`;
						const episodeType = `episode ${seasonKey}`;
						// const episodeType = `episode episode`;
						const deleteEpi = `delete ${seasonKey}`;
						const episodes = season.episodes;
						const no = seasonCount;

						seasonCount++;

						let cc = 0;

						/*Object.entries(episodes).map(([episodeKey, episode], index) => {
							const epiActualKey = episode.key;

							if (!epiActualKey) return;

							const p = episode.count || 0;

							cc += p;
						})*/

						return (
							<Draggable key={seasonKey} draggableId={seasonKey} index={index} type="season season">
							  {(seasonProvided, seasonSnapshot) => {
								return (
									<div ref={seasonProvided.innerRef}
									  {...seasonProvided.draggableProps}
									  {...seasonProvided.dragHandleProps}
									  className={`beat-cards bar${seasonKey}`} >
										<ExpansionPanel expanded={seasonExpanded === seasonKey} onChange={handleExpansionPanel(no, 'season', seasonKey)}>
											<ExpansionPanelSummary className={`cmn-expan-summ ${seasonExpanded === seasonKey ? "expan-summ" : "out-expan-summ"}`} expandIcon={<ExpandMoreIcon />}>
												<div className='prnt-b'>
													<div className='beat-season'>{season.name}</div>
													<div className='beat-summary sea'>{season.summary}</div>
												</div>
												{/*<div className='beat-episode-cnt'>{season.count || 0}</div>
												writeAccess && (<div className='scn-acc sea-acc' onClick={() => handleExpansion("season", seasonKey)}>
													<i class="material-icons pencil">more_vert</i>
												</div>) */}
											</ExpansionPanelSummary>
											<ExpansionPanelDetails className='beats-episodes'>
												{this.renderEpisode(seasonKey, episodes, droppEpisode, episodeType, episodeCount)}

												<Droppable droppableId={deleteEpi} type={episodeType} ignoreContainerClipping={true} >
												  {(provided, snapshot) => {
												  		let style = {
												  			visibility: 'hidden'
												  		}

												  		if (this.props.state[`${seasonKey}BeatDelete`]) {
												  			style = {
												  				visibility: 'unset'
												  			}
												  		}

														return (
															<div ref={provided.innerRef} className='aln-beat-dlt'
																style={seasonExpanded === seasonKey ? {zIndex: "999", ...style} : {zIndex: "99", ...style}}
																{...provided.droppableProps} >
																{this.props.state[`${seasonKey}BeatDelete`] && (
																	<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
																)}
															</div>
														)
												  }}
												</Droppable>
											</ExpansionPanelDetails>
										</ExpansionPanel>
									</div>
								)
							  }}
							</Draggable>
						)
					  })}
					  {seasonProvided.placeholder}
					</div>
				)
			  }}
			</Droppable>
		)
	}

	renderEpisode(season_id, episodes, droppEpisode, episodeType, episodeCount) {
		const {
			handleExpansion, handleExpansionPanel, handleSceneExpension, appendNewEpisode, appendNewScene, writeAccess
		} = this.props;

		const { episodeExpanded, showEpisode } = this.props.state;

		return (
			<Droppable droppableId={droppEpisode} type={episodeType} ignoreContainerClipping={true}>
			  {(provided, snapshot) => {
				const seasonKey = season_id;

				return (
					<div ref={provided.innerRef} className={Object.keys(episodes).length > 0 ? "dnt" : "gv-spc"}>
					  {episodes && Object.entries(episodes).length > 0 && Object.entries(episodes)[0][1].key &&
					  Object.entries(episodes)
					  .sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
					  .map(([episodeKey, episode], index) => {
						const scenes = episode.scenes;
						const epiActualKey = episode.key;

						if (!epiActualKey) return;
						const epi_no = episodeCount;

						episodeCount++;

						const droppScene = `${seasonKey} ${episodeKey} ${epiActualKey}`;
						let sceneType = `scene ${epiActualKey}`;
						// const sceneType = `scene scene`;
						const deleteScene = `delete ${seasonKey} ${epiActualKey}`;

						if (!episode.showEpisode) {
							sceneType = `scene ${seasonKey}`;
						}

						return (
							<Draggable key={episodeKey} draggableId={epiActualKey} index={index} type={episodeType}>
							  {(provided, snapshot) => {
								const idEEExpand = `${episodeKey}EEExpanded`;

								return (
									<div ref={provided.innerRef}
									  {...provided.draggableProps}
									  {...provided.dragHandleProps} >
										<ExpansionPanel expanded={!episode.showEpisode} className={episode.showEpisode ? "episode-panel" : "episode-panel-hide"} onChange={handleExpansionPanel(epi_no, 'episode', episodeKey, seasonKey)}>
											<ExpansionPanelSummary className={`cmn-episode-summary ${!episode.showEpisode ? "episode-summary" : "out-episode-summary"}`} >
												<div className='prnt-b'>
													<div className='beat-episode'>{ episode.name }</div>
													<div className='beat-summary epp'>{episode.pulse || ""}</div>
												</div>
												{/*<div className='beat-episode-cnt'>
													{episode.count || 0}
												</div>*/}
												<div className='br-nd'>
													{/*writeAccess && (<div className='scn-acc epi-acc' onClick={() => handleExpansion("episode", seasonKey, episodeKey)}>
														{/*<i className="material-icons pencil">create</i>*//*}
														<i class="material-icons pencil">more_vert</i>
													</div>) */}

													<div className='expnd b-br' onClick={() => this.openExpandWindow(season_id, epiActualKey)}>
														{
															!episode.showEpisode ? (
																<img src={expand_window} alt="expand window" />
															) : (
																<img src={expand_window_grey} alt="expand window" />
															)
														}
													</div>

													<div className='cl3 nts b-br' onClick={() => this.openNotes(season_id, epiActualKey)}>
														{
															episode.messages && episode.messages > 0 && (
																<span className='rnd-cnt'></span>
															)
														}

														{
															episode.flag ?
																!episode.showEpisode ? (
																	<img src={notes_white_dng} alt="notesflagged..." />
																) : (
																	<img src={notesflagged_img} alt="notesflagged..." />
																)
															 :
																!episode.showEpisode ? (
																	<img src={notes_white} alt="notesflagged..." />
																) : (
																	<img src={notesblank_img} alt="notesflagged..." />
																)

														}
													</div>
												</div>

											</ExpansionPanelSummary>
											<ExpansionPanelDetails className='beats-scenes'>
												{this.renderScene(seasonKey, episodeKey, scenes, droppScene, sceneType)}

												<Droppable droppableId={deleteScene} type={sceneType} ignoreContainerClipping={true} >
												  {(provided, snapshot) => {
												  		let style = {
												  			visibility: 'hidden'
												  		}

												  		if (this.props.state[`${seasonKey}SceneBeatDelete`]) {
												  			style = {
												  				visibility: 'unset'
												  			}
												  		}

														return (
															<div ref={provided.innerRef} className='aln-beat-dlt'
																style={snapshot.isDraggingOver ? {zIndex: "995", ...style} : {zIndex: "99", ...style}}
																{...provided.droppableProps} >
																{this.props.state[`${seasonKey}SceneBeatDelete`] && (
																	<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
																)}

															</div>
														)
												  }}
												</Droppable>
											</ExpansionPanelDetails>
										</ExpansionPanel>
									</div>
								)
							  }}
							</Draggable>
						)
					  })}
					  {provided.placeholder}
						<div className='aln-cntr'>
							{writeAccess && (
								<Fab className='bt-new-btn' color="primary" aria-label="Add" 
								onClick={appendNewEpisode}>
									<AddIcon />
									<span className="fixed-hov-ob">Add Episode</span>
								</Fab>
							) }
						</div>
					</div>
				)
			  }}
			</Droppable>
		)
	}

	renderScene(seasonKey, episodeKey, scenes, droppScene, sceneType) {
		const {
			handleExpansion, handleSceneExpension, appendNewScene, writeAccess, commentsList, showComments, commentsList_newItem
		} = this.props;

		return (
			<Droppable droppableId={droppScene} type={sceneType} ignoreContainerClipping={true}>
			  {(sceneProvided, sceneSnapshot) => {
				return (
					<div ref={sceneProvided.innerRef}>
					  {scenes && Object.entries(scenes).length > 0 && Object.entries(scenes)[0][1].key &&
					  Object.entries(scenes)
					  .sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
					  .map(([sceneKey, scene], index) => {
						const scActualKey = scene.key;

						if (!scActualKey) return;
						const draggScene = `${sceneKey} ${scActualKey}`;

						return (
							<Draggable key={sceneKey} type={sceneType} draggableId={draggScene} index={index}>
							  {(sceneProvided, sceneSnapshot) => {
								return (
									<div ref={sceneProvided.innerRef}
									  {...sceneProvided.draggableProps}
									  {...sceneProvided.dragHandleProps}
									  onClick={() => handleSceneExpension(sceneKey)}
									  className='scene-summary'>
										<div className='scn-txt'>
											<div className='-beat-scene'>{/*scene.name*/}{index + 1}</div>
											<div className='beat-summary scc'>{scene.pulse}</div>
										</div>
										{/*<div className='scn-cnt'>
											{scene.count}
										</div>*/}
										<div className='mk-ps-rgt'>
											{
												showComments && Object.entries(commentsList[sceneKey])
												.filter(([cmnt_id, cmnt_dd]) => !cmnt_dd.isResolved)
												.length > 0 && (
													<div className='cmn-br-nd br-nd-cmnt lft'>
														{
															commentsList_newItem[sceneKey] &&
															commentsList_newItem[sceneKey].new_msg && (
																<span className='cmnt-rnd rnd-cnt'></span>
															)
														}

														<div className='cmnt-nmbr'>
															{
																Object.entries(commentsList[sceneKey])
																.filter(([cmnt_id, cmnt_dd]) => !cmnt_dd.isResolved)
																.length
															}
														</div>
													</div>
												)
											}

											<div className='cmn-br-nd br-nd rgt'>
												{/*writeAccess && (<div className='scn-acc' onClick={() => handleExpansion("scene", seasonKey, episodeKey, sceneKey)}>
													{/*<i className="material-icons pencil">create</i>*//*}
													<i class="material-icons pencil">more_vert</i>
												</div>)*/}

												<div className='expnd scc b-br' onClick={() => this.openExpandWindow(seasonKey, episodeKey, scActualKey, index + 1)}>
													<img src={expand_window} alt="expand window" />
												</div>

												<div className='cl3 cd13 b-br' onClick={() => this.openNotes(seasonKey, episodeKey, scActualKey, index + 1)}>
													{
														scene.messages && scene.messages > 0 && (
															<span className='rnd-cnt'></span>
														)
													}

													{
														scene.flag ? (
															<img src={notes_white_dng} alt="notesflagged..." />
														) : (
															<img src={notes_white} alt="notesflagged..." />
														)
													}
												</div>
											</div>
										</div>
									</div>
								)
							  }}
							</Draggable>
						)
					  })}
						{sceneProvided.placeholder}
						<div className='aln-cntr'>
							{writeAccess && (
								<Fab className='bt-new-btn ltl-grn' color="primary" aria-label="Add" 
								onClick={() => appendNewScene(episodeKey)}>
									<AddIcon />
									<span className="fixed-hov-ob">Add Scene</span>
								</Fab>
							) }
						</div>

					</div>
				)
			  }}
			</Droppable>
		)
	}

	render() {
		const { world, world_name, openBeatCard, beatFields, beatSeasonId, beatEpisodeId, beatSceneId,
			series_cnt, beatOpenType, seasonExpanded, episodeExpanded, newSeasonId } = this.props.state;

		const {
			onBeatBarDragStart, onBeatBarDragEnd, handleExpansionPanel, handleExpansion, handleSceneExpension, showBeats,
			appendNewScene, appendNewEpisode, closeModals, changeBeatSave, series_id, seriesList, handleSeriesChange,
			handleBeatMode, writeAccess
		} = this.props;

		const { notesPop, notesOf, expandWindowPop, windowOf } = this.state;

		const { anchorEl } = this.state;

		let seasons = {};

		if (world) {
			seasons = world.seasons;
		}

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

		let season_id = newSeasonId;

		if (!season_id) {
			return (
				<center>
					<img src={loadingGF} alt="loading..." />
				</center>
			)
		}

		let seasonCount = 0;
		let episodeCount = 0;
		let deleteSea = "delete season";

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

		let style = {
	  		visibility: 'hidden'
	  	}

	  	if (this.props.state[`seasonBeatDelete`]) {
	  		style = {
	  			visibility: 'unset'
	  		}
	  	}

		return (
				<div className='left-pad-content'>
					<div className='icn-beat-mode' onClick={() => handleBeatMode("beatMode", true)}>
						<img src={enable_beatmode} alt="enable beat mode" />
						<span className="fixed-hov-ob">Expand Beats Mode</span>
					</div>
					
					<div className='season-name cmn-hd-cl'>{world_name}</div>

					{/*seriesList && Object.keys(seriesList).length > 0 && (<select
						className='series-drop'
						value={series_id}
						onChange={handleSeriesChange}>
						{
							seriesList && Object.entries(seriesList).map(([se_id, [series_id, sName, ss_id]], index) => {
								return <option key={series_id} value={se_id}>{sName}</option>
							})
						}
					</select>)*/}

					  {/*<NativeSelect
					  className='series-drop'
					  value={series_id}
					  onChange={handleSeriesChange}>
						{
							seriesList && Object.entries(seriesList).map(([se_id, [series_id, sName, ss_id]], index) => {
								return <option key={series_id} value={se_id}>{sName}</option>
							})
						}
					  </NativeSelect>*/}

					{seriesList && Object.entries(seriesList).length > 1 ?
					(<Button className='series-drop cmn-hd-cl'
					  aria-owns={anchorEl ? 'simple-menu' : null}
					  aria-haspopup="true"
					  onClick={(event) => this.handleClick("anchorEl", event)}>
						<span className='sd-drop'>{series_name}</span> &nbsp;<i className="fa fa-angle-down" aria-hidden="true"></i>
					</Button>) : (
						<Button className='series-drop cmn-hd-cl'>{series_name}</Button>
					)}
					<Menu
					  id="beat-menu"
					  anchorEl={anchorEl}
					  open={Boolean(anchorEl)}
					  onClose={() => this.handleClose("anchorEl")}>
						{
							seriesList && Object.entries(seriesList).map(([se_id, [series_idd, sName, ss_id]], index) => {
								if (se_id !== series_id) {
									return <MenuItem key={series_idd} onClick={() => this.handleSeriesChange(se_id)}>{sName}</MenuItem>
								}
							})
						}
					</Menu>
					<DragDropContext onDragStart={onBeatBarDragStart} onDragEnd={onBeatBarDragEnd}>

					{this.renderSeason(seasons, season_id)}

					<Droppable droppableId="delete season" type="season season" ignoreContainerClipping={true} >
					  {(provided, snapshot) => {
					  	return (
							<div ref={provided.innerRef} className='aln-beat-dlt' style={style}>
								{this.props.state[`seasonBeatDelete`] && (
									<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
								)}
							</div>
						)
					  }}
					</Droppable>

					

					{/*}<Droppable droppableId="delete episode" type="episode episode" ignoreContainerClipping={true} >
					  {(provided, snapshot) => {
							return (
								<div ref={provided.innerRef} className='aln-beat-dlt'>
									{this.props.state[`episodeBeatDelete`] && (
										<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
									)}

								</div>
							)
					  }}
					</Droppable>*/}

					{/*}<Droppable droppableId="delete scene" type="scene scene" ignoreContainerClipping={true} >
					  {(provided, snapshot) => {
							return (
								<div ref={provided.innerRef} className='aln-beat-dlt'>
									{this.props.state[`sceneBeatDelete`] && (
										<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
									)}

								</div>
							)
					  }}
					</Droppable>*/}

					</DragDropContext>

					<BeatCard open={openBeatCard} closeModal={closeModals("openBeatCard")}
					  seasonId={beatSeasonId} episodeId={beatEpisodeId} sceneId={beatSceneId}
					  fields={beatFields} changeBeatSave={changeBeatSave} type={beatOpenType} />

					<NotesPop
						open={notesPop}
						closeModal={this.closeNotes}
						notesOf={notesOf}
					/>

					<ExpandWindowPop
						open={expandWindowPop}
						closeModal={this.closeExpandWindow}
						windowOf={windowOf}
						changeBeatSave={changeBeatSave}
						writeAccess={writeAccess}
					/>
				</div>

		)
	}
}

export default BeatBar;
