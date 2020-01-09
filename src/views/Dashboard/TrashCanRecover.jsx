import React from 'react';
import Popup from "reactjs-popup";
import { Scrollbars } from 'react-custom-scrollbars';
import Avatar from 'react-avatar';
import appbaseRef from 'config_db/appbase';

import SocialCharacterCard from './CardsPop/SocialCharacterCard.jsx';
import SocialComonCard from './CardsPop/SocialComonCard.jsx';

import loadingGF from 'assets/img/loding_loding.gif';
import notes_white from 'assets/img/icons/notes_white.png';
import expand_window from 'assets/img/icons/expand_window.png';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import deleteQueries from 'queries/deleteQueries';
import backendProcessQuery from 'queries/backendProcessQuery';

class TrashCanRecover extends React.Component{
	state = {
		trash_items: {},
		loading: false,
		trash_content: {},
		display_content: {}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				const { season_id } = this.props;
				this.setState({ loading: true });

				const callback = (error, result) => {
					if (error) {
						console.log(error);
					} else {
						if (result.data.docs.length > 0) {
							result.data.forEach(snap => {
								const id = snap.id;
								const data = snap.data();

								if (data.isRestored) return;

								this.setState(prevState => ({
									...prevState,
									trash_items: {
										...prevState.trash_items,
										[id]: data
									}
								}));

								const callback = (error, result) => {
									if (error) {
										console.log(error);
									} else {
										if (result.status === 1) {
											this.setState(prevState => ({
												...prevState,
												trash_content: {
													...prevState.trash_content,
													[data.type_id]: result.data
												}
											}));
										}
									}
								}

								if (data.type === "episode") {
									const episode_id = data.type_id;

									getQueries.getEpisodeWithDoc(episode_id, callback);
								} else if (data.type === "scene") {
									const scene_id = data.type_id;

									getQueries.getSceneWithDoc(scene_id, callback);
								} else if (data.type === "builder") {
									const builder_id = data.type_id;

									getQueries.getBuilderWithDoc(builder_id, callback);
								}
							});

							this.setState({ loading: false });
						} else {
							this.setState({ loading: false });
						}
					}
				}

				getQueries.getTrashWithSeason_id(season_id, callback);
			}
		}
	}

	makeCharFields = (fields) => {
	      let obj = {};

	      fields.name ? obj['name'] = { has: true, val: fields.name } : obj['name'] = { has: false, val: "" };
	      fields.description ? obj['description'] = { has: true, val: fields.description } : obj['description'] = { has: false, val: "" };
	      fields.photo ? obj['photo'] = { has: true, val: fields.photo } : obj['photo'] = { has: false, val: [] };
	      fields.realAliases ? obj['realAliases'] = { has: true, tags: fields.realAliases, val: '' } : obj['realAliases'] = { has: false, tags: [], val: "" };
	      fields.aliases ? obj['aliases'] = { has: true, tags: fields.aliases, val: '' } : obj['aliases'] = { has: false, tags: [], val: "" };
	      fields.birth ? obj['birth'] = { has: true, val: fields.birth } : obj['birth'] = { has: false, val: "" };
	      fields.death ? obj['death'] = { has: true, val: fields.death } : obj['death'] = { has: false, val: "" };
	      fields.marital ? obj['marital'] = { has: true, val: fields.marital } : obj['marital'] = { has: false, val: "" };
	      fields.dna ? obj["dna"] = {has: true, val: fields.dna} : obj["dna"] = { has: false, val: {} };
	      fields.internal_conflicts ? obj['internal_conflicts'] = { has: true, val: fields.internal_conflicts } : obj['internal_conflicts'] = { has: false, val: "" };
	      fields.orientation ? obj['orientation'] = { has: true, val: fields.orientation } : obj['orientation'] = { has: false, val: "" };
	      fields.habits ? obj['habits'] = { has: true, val: fields.habits } : obj['habits'] = { has: false, val: "" };
	      fields.personality ? obj['personality'] = { has: true, val: fields.personality } : obj['personality'] = { has: false, val: "" };
	      fields.working_notes ? obj['working_notes'] = { has: true, val: fields.working_notes } : obj['working_notes'] = { has: false, val: "" };
	      fields.start ? obj['start'] = { has: true, val: fields.start } : obj['start'] = { has: false, val: "" };
	      fields.thnicity ? obj['thnicity'] = { has: true, val: fields.thnicity } : obj['thnicity'] = { has: false, val: "" };
	      fields.gender ? obj["gender"] = {has: true, val: fields.gender} : obj["gender"] = { has: false, val: "" };
	      fields.external_conflicts ? obj['external_conflicts'] = { has: true, val: fields.external_conflicts } : obj['external_conflicts'] = { has: false, val: "" };
	      fields.physical_description ? obj["physical_description"] = {has: true, val: fields.physical_description} : obj["physical_description"] = { has: false, val: "" };
	      fields.availability ? obj["availability"] = {has: true, val: fields.availability} : obj["availability"] = { has: false, val: "" };
	      fields.occupation ? obj["occupation"] = {has: true, val: fields.occupation} : obj["occupation"] = { has: false, val: "" };
	      fields.background ? obj["background"] = {has: true, val: fields.background} : obj["background"] = { has: false, val: "" };
	      fields.end ? obj["end"] = {has: true, val: fields.end} : obj["end"] = { has: false, val: "" };
	      fields.alignment ? obj["alignment"] = {has: true, val: fields.alignment} : obj["alignment"] = { has: false, val: {goods: '', evils: '', neutrals: ''} };
	      fields.ethnicity ? obj["ethnicity"] = {has: true, val: fields.ethnicity} : obj["ethnicity"] = { has: false, val: "" };
	      fields.relationship_list && fields.relationship_list.length > 0 ? obj["relation"] = {has: true, val: {}} : obj["relation"] = {has: false, val: {}};

	      obj["ss_background_image"] = fields.ss_background_image || "";

	      obj["category"] = fields.category;

	      return obj;
    }

    restoreData = () => {
    	const { display_content } = this.state;
    	const newFields = this.state.trash_content[display_content.type_id];
    	const trash_item = this.state.trash_items[display_content.trash_id];

    	if (!display_content || !display_content.type) return;

    	if (display_content.type === "episode") {
    		updateQueries.updateEpisode(display_content.type_id, {isDeleted: false}, (err, res) => {});
    		this.updateSeasonWordCount(trash_item.season_id, newFields.count);
    	} else if (display_content.type === "scene") {
    		backendProcessQuery.updateScenesOrder(newFields.episode_id, display_content.type_id, newFields.sort);
    		updateQueries.updateScene(display_content.type_id, {isDeleted: false}, (err, res) => {});
    		this.updateSeasonWordCount(trash_item.season_id, newFields.count);
    	} else if (display_content.type === "builder") {
    		appbaseRef.index({
				type: "builders",
				id: display_content.type_id,
				body: newFields
			}).then(response => {
				console.log(response);
			}).catch(error => {
				console.log(error);
			});

    		updateQueries.updateBuilder(display_content.type_id, {isDeleted: false}, (err, res) => {});
    	}

    	deleteQueries.removeTrash(display_content.trash_id, () => {});

    	/*updateQueries.updateTrash(display_content.trash_id, {
    		isRestored: true,
    		restoredAt: new Date(),
    		restoreTimestamp: new Date().getTime()
    	}, (err, res) => {});*/

    	let { trash_items } = this.state;
    	delete trash_items[display_content.trash_id];

    	this.setState({ display_content: {}, trash_items });
    }

    updateSeasonWordCount = (season_id, addCount) => {
    	getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
    		if (err) {
    			console.log(err);
    		} else {
    			if (res.status === 1) {
    				const newCount = parseInt(res.data.count) + parseInt(addCount);

    				updateQueries.updateSeasonWordCount(season_id, {count: newCount}, (e, r) => {});
    			}
    		}
    	});
    }

	changeTrashContent = (type, trash_id, type_id) => {
		this.setState({ display_content: {type, trash_id, type_id} });
	}

	chapterBox = (id, data, trash_id) => {
		return (
			<div key={id} className='episode-summary trsh-x'
			onClick={() => this.changeTrashContent("episode", trash_id, id)}>
				<div className="prnt-b">
					<div className="beat-episode">{data.name}</div>
					<div className="beat-summary epp">{data.pulse || ""}</div>
				</div>
				{/*<div className="br-nd">
					<div className="expnd b-br">
						<img src={expand_window} alt="expand window" />
					</div>
					<div className="cl3 nts b-br">
						<img src={notes_white} alt="notesflagged..." />
					</div>
				</div>*/}
			</div>
		)
	}

	sceneBox = (id, data, trash_id) => {
		return (
			<div key={id} className='scene-summary trash-x'
			onClick={() => this.changeTrashContent("scene", trash_id, id)}>
				<div className="scn-txt">
					<div className="beat-summary scc">{data.pulse}</div>
				</div>
				{/*<div className="mk-ps-rgt">
					<div className="cmn-br-nd br-nd rgt">
						<div className="expnd scc b-br">
							<img src={expand_window} alt="expand window" />
						</div>
						<div className="cl3 cd13 b-br">
							<img src={notes_white} alt="notesflagged..." />
						</div>
					</div>
				</div>*/}
			</div>
		)
	}

	cardBox = (id, data, trash_id) => {
		return (
			<div key={id} className='main-char crd-act'
			onClick={() => this.changeTrashContent("builder", trash_id, id)}>
				<div className="grd-cmnt">
					<div className="char-name_e cmn-hd-cl">{data.name}</div>
					<div className="char-short-name">{data.realAliases && data.realAliases.map(tg => `"` + tg + `" `)}</div>
				</div>

				<div className="char-prf-crl">
					{
						data && data.photo && data.photo[0] ? (
							<img className='char-prf-avtr' style={
								{height: '50px', width: '50px', borderRadius: '50%'}
							} src={
								data.photo && data.photo[0] && data.photo[0].url
							} alt={
								data.photo && data.photo[0] && data.photo[0].name
							} />
						) : (
							<Avatar size="50px" style={
								{height: '50px', width: '50px', borderRadius: '150px'}
							} className='char-prf-avtr' name={data.name} round={true} />
						)
					}
				</div>
			</div>
		)
	}

	chapterContent = (id, data) => {
		return (
			<div className=''>
				<div className='rst-tp'>
					<button className='rst' onClick={() => this.restoreData()}>
						Restore this
					</button>
				</div>

				<div className='main-content'>
					<div className='bx-hd'>

							<h2 className='chp-nm'>{data.name}</h2>
              <span className='cnt'>{data.count || 0} WORDS</span>



					</div>
					<div className='bx-dttl'>
						<div className='grp-rw'>
							<label className='cnt-lbl'>Pulse</label>
							<p>{data.pulse}</p>
						</div>
						<div className='grp-rw'>
							<label className='cnt-lbl'>Summary</label>
							<p>{data.summary}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	sceneContent = (id, data) => {
		return (
			<div className=''>
				<div className='rst-tp'>
					<button className='rst' onClick={() => this.restoreData()}>
						Restore this
					</button>
				</div>

				<div className='main-content'>
					<div className='bx-hd'>
             	<h2 className='chp-nm'>{data.name}</h2>
						<span className='cnt'>{data.count || 0} WORDS</span>



					</div>

					<div className='bx-dttl'>
						<div className='grp-rw'>
							<label className='cnt-lbl'>Pulse</label>
							<p>{data.pulse}</p>
						</div>

						<div className='grp-rw'>
							<label className='cnt-lbl'>Summary</label>
							<p>{data.summary}</p>
						</div>

						<div className='grp-rw'>
							<label className='cnt-lbl'>Story</label>
							<div className='st-dv' dangerouslySetInnerHTML={ {__html: data.story} } />
						</div>
					</div>
				</div>
			</div>
		)
	}

	builderContent = (id, data) => {
		const fields = this.makeCharFields(data);
		const { season_id, series_id, world_id } = this.props;

		let cnt;

		if (data.category === "character") {
			cnt = <SocialCharacterCard
				fields={fields}
				writeAccess={false}
				enableCardEdit={() => {}}
				builder_id={id}
				world_id={world_id}
				series_id={series_id}
				season_id={season_id}
			/>
		} else {
			cnt = <SocialComonCard
				fields={fields}
				writeAccess={false}
				enableCardEdit={() => {}} whichCard={data.category}
				builder_id={id}
				world_id={world_id}
				series_id={series_id}
				season_id={season_id}
			/>
		}

		return (
			<div className=''>
				<div className='rst-tp'>
					<button className='rst' onClick={() => this.restoreData()}>
						Restore this
					</button>
				</div>

				<div className='main-content'>
					{cnt}
				</div>
			</div>
		)
	}
	closeModal = () => {
		this.setState({ open: false });
	}

  	render() {
		const {
			open, closeModal
		} = this.props;

		const {
			trash_items, loading, trash_content, display_content
		} = this.state;

		if (loading) {
			return (
				<Popup open={open} className='trasg-pop prin-popup' onClose={() => closeModal()} modal closeOnDocumentClick >

             <img src={loadingGF} alt="loading..." />


				</Popup>
			)
		}

		let t_content;

		if (display_content) {
			let ty_id = display_content.type_id;

			if (display_content.type === "episode") {
				t_content = this.chapterContent(ty_id, trash_content[ty_id])
			} else if (display_content.type === "scene") {
				t_content = this.sceneContent(ty_id, trash_content[ty_id])
			} else if (display_content.type === "builder") {
				t_content = this.builderContent(ty_id, trash_content[ty_id])
			}
		}

    	return (
				<Popup open={open} className='trasg-pop prin-popup' onClose={() => closeModal()} modal closeOnDocumentClick >
				<div className="lists trash-lists">
				<div className='right-corner-bx'>
					<div className='cmn-bx cls-tn' style={{cursor: 'pointer'}} onClick={closeModal}>
						<i className="fa fa-times close-tb"></i>
                  
					</div>
				</div>
		      		<h3 className='trash-hd'>Recover Trash Can</h3>


			  		<div className='prn_intgrt trash-integr'>
			  		  	<Scrollbars className='prn-writer cc-trash' autoHide autoHideDuration={200}>
					    	<div className='prn_items custm-trash'>


					    		{
					    			Object.entries(trash_items).length > 0 ?
					    			Object.entries(trash_items)
					    			.map(([t_id, t_data]) => {
					    				if (t_data.type === "episode") {
					    					const data = trash_content[t_data.type_id];
					    					if (!data) return;

					    					return this.chapterBox(t_data.type_id, data, t_id)
					    				} else if (t_data.type === "scene") {
					    					const data = trash_content[t_data.type_id];
					    					if (!data) return;

					    					if (trash_content[t_data.episode_id]) return;

					    					return this.sceneBox(t_data.type_id, data, t_id)
					    				}else {
					    					const data = trash_content[t_data.type_id];

					    					if (!data) return;

					    					return this.cardBox(t_data.type_id, data, t_id)
					    				}
										}) :<h4 className='txt-msg-sm'>There is no item!</h4>
					    	}
					  		</div>
			  			</Scrollbars>

			 			<div className='prn_content trash-content'>
			 				<Scrollbars className='prn-writer cc-trash' autoHide autoHideDuration={200}>
			 					<div className='custm-trash-cntnt'>
			 					 {t_content}
			 					</div>
			 				</Scrollbars>
			  			</div>
			 		</div>
		   		</div>
      		</Popup>
    	);
  	}
}

export default TrashCanRecover;
