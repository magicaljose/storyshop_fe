import React from 'react';
import {
  Grid
} from 'material-ui';
import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import { Link, Redirect } from 'react-router-dom';

import { dashboardStyle } from 'variables/styles';
import { Button, Menu } from 'material-ui';
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import MenuItem from 'material-ui/Menu/MenuItem';
import Writer from "views/Dashboard/Writer.jsx";
import Dashboardpop from "views/Dashboard/Dashboardpop.jsx";

import def from 'assets/img/daf.png';
import Edit from 'assets/img/edit.png';

import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';

class Seasons extends React.Component {
  	state = {
	    seasonDatabase: [],
		access_world_list: [],
	  	defaultSeasonDatabase: [],
	    world_name: '',
	    world_list: [],
		secondFilter: "All Roles",
		thirdFilter: "Newest",
  	};

  	componentWillMount = () => {
    	this.getWorldsList();
    	this.getAccessWorlds();

		this.verifyUserAccess();
		this.getSeasons();
  	}

  	componentDidUpdate = (prevProps, prevState) => {
		if (prevState.thirdFilter !== this.state.thirdFilter) {
		  	this.filterSeasonsBy(this.state.thirdFilter, this.state.secondFilter);
	  	}

    	if (prevState.secondFilter !== this.state.secondFilter) {
      		this.filterSeasonsBy(this.state.thirdFilter, this.state.secondFilter);
	  	}

	  	if (prevState.tempValue !== this.state.tempValue) {
		  	this.setState({world_op: "", season_op: "", worldKey: "", seasonKey: ""});
	  	}
  	}

  	componentWillUnmount = () => {
  		if (this.worldsUnsubscribe) {
  			this.worldsUnsubscribe();
  		}

  		if (this.accessUnsubscribe) {
  			this.accessUnsubscribe();
  		}

  		if (this.worldSeasons) {
  			this.worldSeasons()
  		}
  	}

  	// Get worlds list of user
  	getWorldsList = () => {
		const user_id = localStorage.getItem("storyShop_uid");

		if (!user_id) return;

		// Callback function for get worlds query
  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					let world_list = [];

  					let worlds = results.data;

  					worlds.forEach((snap) => {
               			world_list.push(
               				[snap.id, snap.data().name]
               			);
             		});

             		this.setState({ world_list });
  				} else {
  					this.setState({ world_list: [] });
  				}
  			}
  		}

		this.worldsUnsubscribe = realtimeGetQueries.getWorldsWithUser_id(user_id, callback);
  	}

  	getAccessWorlds = () => {
  		const user_id = localStorage.getItem("storyShop_uid");

  		if (!user_id) return;

  		// Callback function for access query
  		const callback = (error, results) => {
  			if (error) {
  				console.log("access error");
  			} else {
  				if (results.data.docs.length > 0) {
  					let access_world_list = [];
  					let access = results.data;

  					access.forEach(snap => {
						let wid = snap.data().world_id;

						const cb = (error, wResults) => {
  							if (error) {
  								console.log(error);
  							} else {
  								if (wResults.status === 1) {
  									let obj = wResults.data;

									access_world_list.push([wid, obj.name]);
  								} else {
  									return
  								}
  							}
  						}

  						getQueries.getWorldWithDoc(wid, cb); 
  					});	

  					this.setState({ access_world_list });				
  				} else {
  					this.setState({ 
  						access_world_list: []
  					});
  				}
  			}
  		}

  		this.accessUnsubscribe = realtimeGetQueries.getAccessWithUser_id(user_id, callback);
  	}

  	verifyUserAccess = () => {
  		const { world_id } = this.props.match.params;
  		const user_id = localStorage.getItem("storyShop_uid");

  		if (!world_id || !user_id) return;

  		const accessCB = (accErr, accRes) => {
  			if (accErr) {
  				console.log(accErr);
  			} else {
  				if (accRes.data.docs.length > 0) {
  					let unknown = true;

  					accRes.data.forEach(snap => {
  						const key = snap.id;
  						let val = snap.data();

  						if (val.auth !== user_id && val.user_id !== user_id) {
				        	this.setState({ world_data: false });

							return;
						} else if (val.auth !== user_id && val.user_id === user_id) {
						    unknown = false;
						    this.getAccess(key);
						} else if (val.auth === user_id) {
							unknown = false;
						}
	  				});

	  				const worldCB = (worldErr, worldRes) => {
				  		if (worldErr) {
				  			console.log(worldErr);
				  		} else {
				  			if (worldRes.status === 1) {
				  				if (worldRes.data.user_id !== user_id && unknown) {
									this.setState({ world_data: false });
								}
				  			} else {
				  				this.setState({ world_data: false });
				  			}
				  		}
				  	}

					getQueries.getWorldWithDoc(world_id, worldCB);
  				}
  			}
  		}

  		getQueries.getAccessWithWorld_id(world_id, accessCB);

	  	this.setState({ writeAccess: true });
  	}

  	getSeasons = () => {
  		const { world_id } = this.props.match.params;

  		if (!world_id) return;

	    const user_id = localStorage.getItem("storyShop_uid");
	    let world_name = "";

	    const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.data.docs.length > 0) {
	    			let seasonDatabase = [];

		            results.data.forEach(snap => {
		                let obj = snap.data();
		                
		                obj['key'] = snap.id;
		                obj['world_id'] = world_id;

		                seasonDatabase.push(obj);
		            });

		            this.setState({
		            	defaultSeasonDatabase: seasonDatabase, 
		            	seasonDatabase, world_id
		            });
	    		} else {
	    			this.setState({
		            	defaultSeasonDatabase: [], 
		            	seasonDatabase: [], world_id
		            });
	    		}
	    	}
	    }

	    this.worldSeasons = realtimeGetQueries.getSeasonWithWorld_id(world_id, callback);

	    const wdDB = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			this.setState({ 
	    				world_name: result.data.name 
	    			});
	    		}
	    	}
	    }

	    getQueries.getWorldWithDoc(world_id, wdDB);
  	}

  	getAccess = (access_key) => {
  		const callback = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					this.setState({
				    	writeAccess: result.data.write,
				    	notHis: true
			    	});
  				}
  			}
  		}

  		getQueries.getAccessWithDoc(access_key, callback);
  	}

  	handleClick = (name, event) => {
    	this.setState({ [name]: event.currentTarget });
  	};

  	handleClose = name => {
    	this.setState({ [name]: null });
  	};

  	ChangeFilter = (type, value, name) => {
	  	this.setState({ [type]: value, [name]: null })
  	}

  	handleTempCheck = (value) => {
    	this.setState({tempValue: value});
  	}

  	getSortby = (type, data) => {
    	if (type === "Last Updated") {
      		data.sort((a, b) => {
			  	return new Date(b.update_date) - new Date(a.update_date)
		  	});
    	} else {
      		data.sort(function(a, b) {
			  	return new Date(b.created_date) - new Date(a.created_date)
		  	});

	      	if (type === "Oldest") {
	        	data = data.reverse();
	      	}
    	}

    	return data;
  	}

  	filterSeasonsBy = (type1, type2) => {
	  	const { defaultSeasonDatabase } = this.state;

    	const updateDatabase = this.getSortby(type1, defaultSeasonDatabase.slice());

    	if (type2 === "Author") {
	      	this.setState({
	        	seasonDatabase: updateDatabase,
	      	});
    	} else if (type2 === "Peer") {
      		this.setState({
        		seasonDatabase: [],
      		});
    	} else {
      		this.setState({
        		seasonDatabase: updateDatabase,
      		});
   		}
  	}

  	handleSelect = (key, name) => {
    	this.setState({worldKey: key, world_op: name});
  	}

	handleSeasonSelect = (key, name) => {
		this.setState({seasonKey: key, season_op: name});
	}

  	handleDropChange = (event, { name, value }) => {
	  	if (name === "filter1") {
		  	if (value.toLowerCase() === "All Books".toLowerCase()) {
			  	this.props.history.push('/dashboard');
		  	} else if (value.toLowerCase() === "All Worlds".toLowerCase()) {
			  	this.props.history.push('/world');
		  	}
	  	} else {
		  	this.setState({ [name]: value })
	  	}
  	}

  	render() {
	  	const { 
	  		world_name, seasonDatabase, world_list, writeAccess, secondFilter,
		    thirdFilter, notHis, access_world_list 
		} = this.state;

    	if (!localStorage.getItem('storyShop_uid')) {
      		return <Redirect to='/login' />
    	}

    	return (
      		<div className="Gri_d">
			  	<div className="Gri_dcon">

          		<div className="drop">
				    <Dropdown selection
				      className='menu-db'
				      icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
				      name="filter1"
				      text={`${world_name} Books`}
				      options={[
					      {text: `${world_name} Books`, value: `${world_name} Books`},
				        {text: "All Books", value: "All Books"},
					      {text: "All Worlds", value: "All Worlds"}
				      ]}
				      onChange={this.handleDropChange}
				    />
          		</div>

          		<div className="drop">
				    <Dropdown selection
				      className='menu-db'
				      icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
				      name="secondFilter"
				      value={this.state.secondFilter}
				      options={[
					      {text: "All Roles", value: "All Roles"},
					      {text: "Author", value: "Author"},
					      {text: "Peer", value: "Peer"},
					      {text: "World Owner", value: "World Owner"}
				      ]}
				      onChange={this.handleDropChange}
				    />
          		</div>

          		<div className="drop">
				    <Dropdown selection
				      className='menu-db'
				      icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
				      name="thirdFilter"
				      value={this.state.thirdFilter}
				      options={[
					      {text: "Last Updated", value: "Last Updated"},
					      {text: "Newest", value: "Newest"},
					      {text: "Oldest", value: "Oldest"}
				      ]}
				      onChange={this.handleDropChange}
				    />
          		</div>
		    </div>

        	{
          		seasonDatabase.length === 0 ?
          			<div className='empty-msg'>
            			Looks like your World is empty. Click the + in the bottom right to create a new project!
          			</div>
          		:
          			<div className="main_grds">
            			{
            				secondFilter !== "Peer" && seasonDatabase.map((season, index_key) => {
               					return (
                 					<div key={index_key} className="inner_main_grds">
					         			<div className="laye_r">
                     						<img className="res_pon" alt="Season" src={season.img ? season.img : def} />
						         			
						         			<span>
						           				<Writer season_id={season.key} write={writeAccess} notHis={notHis}
						           				  access_world_list={access_world_list}
								       			  world_list={world_list}/>

							         			<Link className="" to={`/${season.world_id}/${season.series_id}/${season.key}`}>
								          			<img className="img_pop edit_s" alt="Edit with Publisher" src={Edit}/>
							          			</Link>
						         			</span>
						       			</div>
						       			
						       			<h2 className='cmn-hd-cl'>{season.name}</h2>
                 					</div>
               					)
            				})
            			}
          			</div>
        	}
				<div className="footer">
          			<div className="container">
            			<div className="Gri_foot">
			        		{ writeAccess && (<Dashboardpop />) }
		        		</div>
          			</div>
        		</div>
      		</div>
    	)
  	}
}

export default Seasons;