import React from 'react';
import Popup from "reactjs-popup";

import { Fab as MaterialButton, TextField } from '@material-ui/core';
import { Button } from 'material-ui';
import AddIcon from '@material-ui/icons/Add';
import { ItemGrid } from 'components';
import { Grid } from 'material-ui';
import { Redirect } from 'react-router-dom';

import blank from 'assets/img/blank_temp.jpg';
import beat from 'assets/img/beat_temp.jpg';
import imported from 'assets/img/import_temp.jpg';


import StoryVerse1 from "views/Dashboard/StoryVerse.jsx";
import Series1 from "views/Dashboard/Series.jsx";
import Templates from "./Templates.jsx";
import ImportProjectPop from "./ImportProjectPop.jsx";

import UpgradePop from './UpgradePop';

import secureStorage from 'secureStorage';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

class Seasonpop extends React.Component {
  	state = {
    	user_redirect: false,
    	showLite: false,
	  	author: '',
    	tempValue: "blank",
    	worldKey: "",
    	world_op: "",
	  	seasonKey: "",
	  	seriesKey: "",
	  	series_op: "",
	  	redirectWithSeason: false,
	  	openImported: false
  	}

  	componentDidMount = () => {
    	let token = secureStorage.getItem("storeToken");

    	if (!token) {
      		localStorage.clear();
      		secureStorage.clear();

      		this.setState({ showLite: true, user_redirect: true });
      		return;
    	}

    	if (localStorage.getItem("storyShop_uid") !== token.user_id) {
      		localStorage.clear();

      		this.setState({ showLite: true, user_redirect: true });
      		return;
    	}

    	if (token.account_type === "Lite") {
      		this.setState({ showLite: true });
    	}

    	this.getUserName();
  	}

  	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.worldKey !== this.state.worldKey) {
			this.setState({
				seriesKey: "",
				series_op: ""
			});
		}
  	}

  	getUserName = () => {
  		const usDB = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			this.setState({ 
	    				author: result.data.user_name 
	    			});
	    		}
	    	}
	    }

	    getQueries.getUserWithDoc(localStorage.getItem("storyShop_uid"), usDB);
  	}

  	handleCheck = (value) => {
    	const { showLite } = this.state;

    	if (showLite && value === "beat") return;

    	this.setState({tempValue: value});
  	}

  	handleChange = (event) => {
    	const { value } = event.target;

    	this.setState({worldKey: value})
  	}

  	handleTextChange = (event) => {
	  	const {name, value} = event.target;

	  	this.setState({[name]: value});
  	}

	handleSelect = (key, name) => {
		this.setState({worldKey: key, world_op: name});
	}

	handleMouseEnter = (event) => {
      this.setState({ isHovering: true });
    }

    handleMouseLeave = (event) => {
      this.setState({ isHovering: false });
    }

	handleSeasonSelect = (key, name) => {
		this.setState({series_id: key, series_op: name});
	}

	handleRollClick = () => {
		const user_name = this.state.author;
		const { series_op, series_id, tempValue, world_op } = this.state;
		let world_id = this.state.worldKey;

		localStorage.setItem("pen_name", user_name);
		const user_id = localStorage.getItem("storyShop_uid");

		if (tempValue === "blank") {
			const created_date = new Date().toISOString();

			if (world_op === "New") {
				const fields ={
					name: "UNKNOWN", 
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

	    				this.setState({
							redirectWithSeason: true, seriesKey: series_id, seasonKey: key
						});
	    			}
	    		}
	    	}
			
			const fields ={
				created_date, world_id, series_id,
				pen_name: user_name, created_by: user_id
			};
			
			setQueries.insertSeason(fields, callback);
		} else if (tempValue === "beat") {
			this.setState({ openTemplate: true });
		} else if (tempValue === "imported") {
			this.setState({ openImported: true });
		}
	}

	closeTemplate = () => {
		this.setState({ openTemplate: false });
	}

	closeImported = () => {
		this.setState({ openImported: false });
	}

	openModal = () => {
		this.setState({ open: true });
	}

	closeModal = () => {
		this.setState({ open: false });
	}

  	render() {
    	const { 
    		tempValue, worldKey, seriesKey, seasonKey, author, world_op, user_redirect,
      		series_op, series_id, redirect, redirectWithSeason, openTemplate, openImported, showLite 
      	} = this.state;

	  	if (redirectWithSeason) {
		 	return <Redirect push to={`/${worldKey}/${seriesKey}/${seasonKey}`} />;
	  	}

    	if (user_redirect) {
      		return <Redirect to="/" />;
    	}

    	return (
    		<div>
    			<div className='grp-hv-add'>
    				<MaterialButton
    				onClick={this.openModal} color="primary" aria-label="Add" className="button Season"><AddIcon /></MaterialButton>
    				<span className="fixed-hov-ob">Add Book</span>
    			</div>
    			
    			<Popup open={this.state.open} onClose={this.closeModal} modal closeOnDocumentClick >
				<div>
					<div className='right-corner-bx'>
						<div className='cmn-bx cls-tn' style={{cursor: 'pointer'}} onClick={this.closeModal}>
							<i className="fa fa-times close-tb"></i>
						</div>
					</div>

		      		<h3>Create New Book</h3>
		      		<div className="Gri_pop Gri-pop">
		        		<div className='main-grd' >
							<div className='dashpop-grd' >
								<div>
									<div className='dashpop-grditm1'>
					          			<div className={tempValue === "blank" ? 'blk-active blk' : 'blk'} onClick={() => this.handleCheck("blank")} >
											<img className="res_pop" alt="blank template" src={blank}/><h4 className='cmn-hd-cl'>Blank Template</h4>
							  			</div>
							
							
						          		<div className={tempValue === "beat" ? 'blk-active blk' : 'blk'} onClick={() => this.handleCheck("beat")} >
											<img className="res_pop" alt="beat template" src={beat}/><h4 className={`${showLite ? "bld-pro" : ""} cmn-hd-cl`}>Beat Template {showLite && (<UpgradePop />)} </h4>
								  		</div>
								  
									   	<div className={tempValue === "imported" ? 'blk-active blk' : 'blk'} onClick={() => this.handleCheck("imported")} >
											<img className="res_pop" alt="imported template" src={imported}/><h4 className='cmn-hd-cl'>Import Project</h4>
									  	</div>
									</div>
							</div>
						    
						    <div className='dashpop-grditm2'>
						        <StoryVerse1 world_op={world_op} worldKey={worldKey}
								  handleSelect={this.handleSelect} />
							</div>
						
							<div className='dashpop-grditm3'>
						  		<Series1 world_key={worldKey} world_op={world_op}
							 	  season_op={series_op} tempValue={tempValue}
							 	  handleSelect={this.handleSeasonSelect} />
							</div>
					    
					    	<div className='dashpop-grditm4'>
					        	<input type="text" className='txt button'
								  required
								  placeholder="Pen Name"
								  name='author' value={author}
								  onChange={this.handleTextChange}/>
							</div>
					    
					    	<div className='dashpop-grditm5'>
					        	{
					        		world_op && series_op && tempValue ?
										<button className="roll active-lnk" onClick={this.handleRollClick}>Let's Roll</button> 
									:
										<button className="roll">Let's Roll</button>
					        	}
							</div>
						</div>
					</div>
		     	</div>
		  	</div>
		  
		  	<Templates open={openTemplate}
			  user_name= {author}
			  world_id={worldKey}
			  world_op={world_op}
			  season_id={series_id}
			  season_op={series_op}
			  closeModal={this.closeTemplate}/>
			
		  	<ImportProjectPop open={openImported}
			  user_name= {author}
			  world_id={worldKey}
			  world_op={world_op}
			  series_id={series_id}
			  series_op={series_op}
			  closeModal={this.closeImported}
			  showLite={showLite} />
      	</Popup>
    		</div>
			
    );
  }
}

export default Seasonpop;