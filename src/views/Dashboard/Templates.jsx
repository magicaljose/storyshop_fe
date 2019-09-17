import React from 'react';
import Popup from "reactjs-popup";
import { Button } from 'material-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Redirect } from 'react-router-dom';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

class Templates extends React.Component{
	defaultState = {
		tempKey: "",
		tempName: "",
		template_list: [],
		redirectWithSeason: false,
	}
	state = {
		tempKey: "",
		tempName: "",
		template_list: [],
		redirectWithSeason: false,
	}

	componentWillUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open === true) {
				this.setState(this.defaultState);
			} else {
				this.getTemplates();
			}
		}
	}

	getTemplates = () => {
		let template_list = [];

		const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.data.docs.length > 0) {
	    			results.data.forEach(snap => {
						const key = snap.id;
						const name = snap.data().name;

						template_list.push([key, name]);
					});

					this.setState({ template_list });
	    		}
	    	}
	    }

		return getQueries.getTemplates(callback);
	}

	handleSelect = (key, name) => {
		this.setState({ tempKey: key, tempName: name });
	}

	saveBeat = () => {
		const { world_id, world_op, season_id, season_op, user_name } = this.props;
		const { tempKey } = this.state;

		if (!tempKey) return;

		this.openWithTemplate(tempKey, user_name, world_id, world_op, season_id, season_op);
	}

	openWithTemplate = (tempKey, user_name, world_id, world_op, series_id, series_op) => {
		const created_date = new Date().toISOString();
		const user_id = localStorage.getItem("storyShop_uid");

		if (world_op === "New") {
			const fields = {
				name:"UNKNOWN", 
				created_date, 
				user_id
			};

			updateQueries.updateWorld(world_id, fields, (err, res) => {});
		}

		if (series_op === "New") {
			const fields = {
				name:"UNKNOWN", 
				created_date, 
				user_id, 
				world_id 
			};

			updateQueries.updateSeries(series_id, fields, (err, res) => {});
		}

        const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			const key = result.key;
						
					const tempCB = (tempErr, tempRes) => {
						if (tempErr) {
							console.log(tempErr);
						} else {
							if (tempRes.data.docs.length > 0) {
								tempRes.data.forEach(snap => {
									const epiName = snap.data().name;
									const epiSumm = snap.data().summary;
									const sort = snap.data().sort;
										
									const data ={
										season_id: key, created_date,
										name: epiName, summary: epiSumm, sort
									};

									this.insertEpisode(data);
								});

								this.setState({
									redirectWithSeason: true, seriesKey: series_id, seasonKey: key
								})
							}
						}
					}

	    			getQueries.getEpisodesOfTemplate(tempKey, tempCB);
	    		}
	    	}
	    }
			
		const fields ={
			created_date, world_id, series_id,
			pen_name: user_name, created_by: user_id
		};
			
		return setQueries.insertSeason(fields, callback);
	}

	insertEpisode = (data) => {
		const callback = (error, result) =>{
			if (error) {
				console.log(error);
			}
		}

		setQueries.insertEpisode(data, callback);
	}

  	render() {
		const { template_list, tempKey, redirectWithSeason, seriesKey, seasonKey } = this.state;
		const { open, world_id, closeModal } = this.props;

		if (redirectWithSeason) {
			return <Redirect to={`/${world_id}/${seriesKey}/${seasonKey}`} />;
		}

    	return (
			<Popup open={open} onClose={closeModal} modal closeOnDocumentClick >
				<div className="lists">
		      		<h3>Select Template</h3>
			  		
			  		<Scrollbars className='cmn-writer cmn-wrld-slct' autoHide autoHideDuration={200}>
						<div className='prnt-wrld-slct'>
							{
								template_list.map(([id, name]) => {
									return (
										<div id={id} key={id} className={id === tempKey ? 'wrld-slct wrld-act' : 'wrld-slct'}
							  			  onClick={() => this.handleSelect(id, name)}>{name}</div>
									)
								})
							}
						</div>
			  		</Scrollbars>
		   		</div>

		   		<button className={`"roll" ${tempKey ? "active-lnk" : ""}`} onClick={() => this.saveBeat()}>Okay</button>
      		</Popup>
    	)
  	}
}

export default Templates;