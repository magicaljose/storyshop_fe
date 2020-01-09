import React from 'react';
import { Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import Popup from "reactjs-popup";
import { Scrollbars } from 'react-custom-scrollbars';
import loadingGF from 'assets/img/loding_loding.gif';

//////////////// Queries /////////////////
import getQueries from 'queries/getQueries';
////////////////////////////////////////////

class SelectPov extends React.Component {
	state = {
		charFields: {},
		settingFields: {},
		loading: true
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				this.setState({ loading: true });
				this.getBuilders();
			}
		}
	}

	getBuilders = () => {
		const { povFieldsOf, world_id } = this.props;

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				let fields = {};

				result.data.forEach(snap => {
					const cardKey = snap.id;
					const card_data = snap.data();

					if (card_data.isDeleted) return;

					if (povFieldsOf !== "pov" && card_data.category === "character") return;

					let got_appearance = false;

					if (card_data.name) {
						const appearance = this.props.getAppearance(card_data.name);

						if (appearance.length > 0) {
							got_appearance = true;
						}
					}

					if (!got_appearance && card_data.realAliases) {
						card_data.realAliases.map(tag => {
							if (got_appearance) return;

							const appearance = this.props.getAppearance(tag);

							if (appearance.length > 0) {
								got_appearance = true;
							}
						});
					}

					if (card_data.category !== "character") {
						const obj = this.makeCharFields(card_data);

						fields[cardKey] = obj;
					} else if (got_appearance) {
						const obj = this.makeCharFields(card_data);

						fields[cardKey] = obj;
					}
				});

				if (povFieldsOf === "pov") {
					this.setState({ charFields: fields, loading: false });
				} else {
					this.setState({ settingFields: fields, loading: false });
				}
			}
		}

		if (povFieldsOf === "pov") {
			getQueries.getBuildersWithWorld_id("character", world_id, callback);
		} else {
			getQueries.getAllBuildersWithWorld_id(world_id, callback);
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
	      obj["cardAvatar"] = fields.cardAvatar;
	      obj["world_id"] = fields.world_id;
	      obj["series_id"] = fields.series_id;
	      obj["season_id"] = fields.season_id;

	      return obj;
    }

	render() {
		const { open, closeModal, handleChange, savePovFor, fields, povPopData, povFieldsOf } = this.props;
		const { charFields, settingFields, loading } = this.state;

		if (loading) {
			return (
				<Popup className='pov-list popup-content-t' open={open} onClose={() => closeModal()} modal closeOnDocumentClick >
					<center>
						<img src={loadingGF} alt="loading..." />
					</center>
				</Popup>
			)
		}

		let listContent = [];

		let noContentMessage = <center className='empty-msg'>There is no content to select!</center>;

		if (povFieldsOf === "pov") {
			if (charFields && Object.entries(charFields).length > 0) {
				Object.entries(charFields).map(([char_id, char_data]) => {
					listContent.push(<FormControlLabel key={char_id}
	                	control={
	                  		<Checkbox
	          					className="list_chck list_chck-pv"
	                    		checked={fields[char_id] || false}
	                    		onChange={handleChange(char_id)}
	                    		value={char_data.name.val}
	                  		/>
	                	}
	                	label={char_data.name.val}
	        			className="list_lbl list_lbl-pv"
	        			labelPlacement="start"
	              	/>)
				})
			}
		} else {
			if (settingFields && Object.entries(settingFields).length > 0) {
				Object.entries(settingFields).map(([char_id, char_data]) => {
					listContent.push(<FormControlLabel key={char_id}
	                	control={
	                  		<Checkbox
	          					className="list_chck list_chck-pv"
	                    		checked={fields[char_id] || false}
	                    		onChange={handleChange(char_id)}
	                    		value={char_data.name.val}
	                  		/>
	                	}
	                	label={char_data.name.val}
	        			className="list_lbl list_lbl-pv"
	        			labelPlacement="start"
	              	/>)
				})
			}
		}

		return (
			<Popup className='pov-list popup-content-t' open={open} onClose={() => closeModal()} modal closeOnDocumentClick >
				{
					listContent.length > 0 ? (
						<Scrollbars className='cmn-lsts cmn-lsts-pv' autoHide autoHideDuration={200}>
							<div className="lists pv-lists">
								<FormGroup>
									{listContent.map(item => (item))}
								</FormGroup>
							</div>					
						</Scrollbars>
					) : (noContentMessage)
				}

				<Button className="btns" onClick={() => savePovFor(povPopData, povFieldsOf)}>Save</Button>
          		<Button className="btns" onClick={() => savePovFor(povPopData, povFieldsOf, true)}>Cancel</Button>
			</Popup>
		)
	}
}

export default SelectPov;