import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import def from 'assets/img/daf.png';
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import Publisher from "views/Dashboard/Publisher.jsx";
import Edit from 'assets/img/planet-earth.png';

import Worldpop from "views/Dashboard/Worldpop.jsx";

import secureStorage from 'secureStorage';

import loadingGF from 'assets/img/loding_loding.gif';

import setQueries from 'queries/setQueries';
import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import updateQueries from 'queries/updateQueries';

class WorldPage extends React.Component{
	worldsUnsubscribe = null
	accessUnsubscribe = null
  	state = {
    	showLite: "",
    	worldDatabase: [],
	  	accessDatabase: [],
    	defualtWorldDatabase: [],
	  	defaultAccessDatabase: [],
    	name: "",
    	key: '',
    	openValue: false,
    	success: false,
	  	againRender: false,
	  	accessChange: false,
	  	secondFilter: "All Roles",
	  	thirdFilter: "Newest",
    	loading: true,
      isHovering: {}
  	};

  	componentWillMount = () => {
  		let token = secureStorage.getItem("storeToken");

	    if (!token) {
		    localStorage.clear();
		    secureStorage.clear();

		    this.setState({ showLite: true });
		    return;
	    }

	    if (localStorage.getItem("storyShop_uid") !== token.user_id) {
	      	localStorage.clear();
	      	secureStorage.clear();

	      	this.setState({ showLite: true });
	      	return;
	    }

	    if (token.account_type === "Lite" || token.account_type === "Trail") {
	      	this.setState({ showLite: true });
	    }

	    this.getWorlds();
  		this.getAccessWorlds();
  	}

  	componentDidCatch = (error, info) => {
    	console.log(error, info);
  	}

  	componentDidUpdate = (prevProps, prevState) => {

		if (prevState.secondFilter !== this.state.secondFilter) {
			// Change worlds order
      		this.filterWorldsBy(this.state.thirdFilter, this.state.secondFilter);
	  	}

    	if (prevState.thirdFilter !== this.state.thirdFilter) {
    		// Change worlds order
		 	this.filterWorldsBy(this.state.thirdFilter, this.state.secondFilter);
	  	}
  	}

  	componentWillUnmount = () => {
  		if (this.worldsUnsubscribe) {
  			this.worldsUnsubscribe();
  		}

  		if (this.accessUnsubscribe) {
  			this.accessUnsubscribe();
  		}
  	}

  	// get worlds of user
  	getWorlds = () => {
  		const user_id = localStorage.getItem("storyShop_uid");

  		// Callback function for get worlds query
  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					let worldDatabase = [];

  					let worlds = results.data;

  					worlds.forEach(world => {
  						const world_id = world.id;
  						let world_data = world.data();

  						world_data['key'] = world_id;

  						worldDatabase.push(world_data);

             			this.setState({
             				defualtWorldDatabase: worldDatabase,
             				worldDatabase: worldDatabase,
             				loading: false
             			});
  					});
  				} else {
  					this.setState({
  						defualtWorldDatabase: [],
  						worldDatabase: [],
  						loading: false
  					});
  				}
  			}
  		}

  		this.worldsUnsubscribe = realtimeGetQueries.getWorldsWithUser_id(user_id, callback);
  	}

  	// Get worlds from access
  	getAccessWorlds = () => {
  		const user_id = localStorage.getItem("storyShop_uid");

  		// Callback function for access query
  		const callback = (error, results) => {
  			if (error) {
  				console.log("access error");
  			} else {
  				if (results.data.docs.length > 0) {
  					let access = results.data;
  					let accessDatabase = [];

  					access.forEach(access_item => {
  						const access_id = access_item.id;
  						const access_data = access_item.data();

  						const world_id = access_data.world_id;
  						const write = access_data.write;
  						const notHis = true;

  						let obj = {}

  						// Callback function for world data query
  						const cb = (error, wResults) => {
  							if (error) {
  								console.log(error);
  							} else {
  								if (wResults.status === 1) {
  									let obj = wResults.data;

  									obj['access_key'] = access_id;
									obj['key'] = world_id;
									obj['write'] = write;
									obj['notHis'] = notHis;

									accessDatabase.push(obj);

                                    this.setState({
                                        accessDatabase: accessDatabase,
                                        defaultAccessDatabase: accessDatabase
                                    });
  								}
  							}
  						}

  						getQueries.getWorldWithDoc(world_id, cb);
  					});

  					// Set timeout because firebase functions return value after loop complete
  					// So we have to wait until firebase completes his process
  					/*setTimeout(() => {
					  	this.setState({
					  		accessDatabase: accessDatabase,
					  		defaultAccessDatabase: accessDatabase
					  	});
				  	}, 1000);*/
  				} else {
  					this.setState({
  						accessDatabase: [],
  						defaultAccessDatabase: []
  					});
  				}
  			}
  		}

  		this.accessUnsubscribe = realtimeGetQueries.getAccessWithUser_id(user_id, callback);
        getQueries.getAccessWithUser_id("defaultForAll", callback);
  	}

	// Function to save world
	changeWorld = (fields, world_id) => {
		const callback = (error, results) => {
			if (error) {
				console.log("error " + error);
			} else {
				this.setState({
					success: !this.state.success
				});
			}
		}

		fields["update_date"] = new Date().toISOString();

		updateQueries.updateWorld(world_id, fields, callback);
	}

  	getAuthWorlds = (list, authEqual) => {
  		let updateDatabase = [];
  		const user_id = localStorage.getItem("storyShop_uid");

  		list.map(world => {
  			const callback = (error, results) => {
	  			if (error) {
	  				console.log(error);
	  			} else {
	  				let oneFound = false;

	  				let data = results.data;

	  				data.forEach(item => {
	  					const sKey = item.id;
	  					let sVal = item.data();

	  					if (oneFound) return;

	  					if ((sVal.created_by === user_id) === authEqual) {
							oneFound = true;
						}
	  				});

	  				if (oneFound) {
						updateDatabase.push(world);
					}
	  			}
	  		}

  			getQueries.getSeasonWithWorld_id(world.key, callback);
  		});

  		return updateDatabase;
  	}

  	// Create new world
  	handlePopSubmit = (event) => {
  		// This will be used in world pop in realtime mode
    	event.preventDefault();

	    const { name } = this.state;
	    const user_id = localStorage.getItem('storyShop_uid');
	    const author = localStorage.getItem("storyShop_user_name");
	    const date = new Date();

	    const data = {
	    	name: name,
	    	author: author,
      		created_date: date.toISOString(),
      		user_id: user_id,
	    	updated_date: date.toISOString()
	    }

	    const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.status === 1) {
	    			const key = results.key;

	    			this.setState({
			    		name: "",
			    		key: key,
			    		openValue: false
			    	});
	    		}
	    	}
	    }

		return setQueries.insertWorld(data, callback);
  	}

  	openModal = () => {
    	this.setState({ openValue: true });
  	}

  	closeModal = () => {
    	this.setState({ openValue: false });
  	}

  	getSortby = (type, data) => {
    	if (type === "Last Updated") {
      		data.sort((a, b) => {
			  	return new Date(b.update_date) - new Date(a.update_date)
		  	});
    	} else {
      		data.sort(function(a, b) {
			  	return new Date(b.created_date) - new Date(a.created_date)
		  	})

	      	if (type === "Oldest") {
	        	data = data.reverse();
	      	}
	    }

    	return data;
  	}

  	filterWorldsBy = (type1, type2) => {
    	const { defualtWorldDatabase, defaultAccessDatabase } = this.state;

    	const updateDatabase = this.getSortby(type1, defualtWorldDatabase.slice());
    	const updateAccess = this.getSortby(type1, defaultAccessDatabase.slice());

	    if (type2.toLowerCase() === "author") {
		  	this.setState({
	        	worldDatabase: this.getAuthWorlds(updateDatabase, true),
	        	accessDatabase: this.getAuthWorlds(updateAccess, true)
	      	});
	    } else if (type2.toLowerCase() === "peer") {
	     	this.setState({
		        worldDatabase: this.getAuthWorlds(updateDatabase, false),
		        accessDatabase: this.getAuthWorlds(updateAccess, false)
	      	});
	    } else if (type2.toLowerCase() === "world owner") {
			this.setState({
				worldDatabase: updateDatabase,
				accessDatabase: []
			});
		} else {
	      	this.setState({
	        	worldDatabase: updateDatabase,
	        	accessDatabase: updateAccess
	      	});
	    }
  	}

  	handleChange = name => event => {
	  	this.setState({ [name]: event.target.value })
  	}

  	handlePopChange = (event) => {
    	const { name, value } = event.target;

    	this.setState({ [name]: value });
  	}

  	handleDropChange = (event, { name, value }) => {
	  	if (name === "filter1") {
		 	 if (value.toLowerCase() === "All Books".toLowerCase()) {
			  	this.props.history.push('/dashboard');
		  	}
	 	} else {
		  	this.setState({ [name]: value })
	  	}
  	}

    handleMouseEnter = name => (event) => {
      this.setState(prevState => ({
        ...prevState,
        isHovering: {
          ...prevState.isHovering,
          [name]: true
        }
      }));
    }

    handleMouseLeave = name => (event) => {
      this.setState(prevState => ({
        ...prevState,
        isHovering: {
          ...prevState.isHovering,
          [name]: false
        }
      }));
    }

  render() {
		const { worldDatabase, accessDatabase, name, openValue, secondFilter, thirdFilter, showLite, loading } = this.state;

    if (!localStorage.getItem("storyShop_uid")) {
      return <Redirect to='/login' />
    }

    if (loading) {
      return (
        <center className='load-cntr'>
          <img src={loadingGF} alt="loading..." />
        </center>
      )
    }

    return (
      <div className="Gri_d">
			  <div className="Gri_dcon">

          <div className="drop">
				    <Dropdown selection
				      className='menu-db'
				      icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
				      name="filter1"
				      text="All Worlds"
				      options={[
					      {text: "All Worlds", value: "All Worlds"},
				        {text: "All Books", value: "All Books"}

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
					      {text: "All Roles", value: "All Roles", id: "roll", label: "View All Books"},
					      {text: "Author", value: "Author", id: "auth", label: "View Your Books"},
					      {text: "Peer", value: "Peer", id: "peer", label: "View your Collaborators Books"},
					      {text: "World Owner", value: "World Owner", id: "wown", label: "View Books in the Worlds You Own"}
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
          worldDatabase.length === 0 && accessDatabase.length === 0 ?
          <div className='empty-msg'>
            There is no world to show please create new World
          </div>
          :
          <div className="main_grds_word">
          {worldDatabase.map((world, index) => (
            <div key={index} className="inner_main_word">
				<div className="laye_r landscape">
					<img className="res_pon_tt" alt="World" src={world.img ? world.img : def}/>
					<span>
						<Publisher
						   world={world.key} write={true} showLite={showLite} notHis={false} />

               <div className="lnk-grp-hv">
               <Link
               className="lnk-wrld edit-book-ancr" to={`/${world.key}/seasons`}>
              <img className="img_pop edit_s" alt="World Edit" src={Edit}/>
              <span className="fixed-hov-ob">Go to World</span>
            </Link>

                            </div>

					</span>
				</div>
				<h2 className='cmn-hd-cl'>{world.name}</h2>
            </div>
          ))}

		  {accessDatabase.map((world, index) => {
            return (
				<div key={index} className="inner_main_word">
					<div className="laye_r landscape">
						<img className="res_pon_tt" alt="World Image" src={world.img ? world.img : def}/>
						<span>
							<Publisher world={world.key} access_key={world.access_key}
							  write={world.write} showLite={showLite}
							  notHis={world.notHis} />

                <div className="lnk-grp-hv">

                <Link
                className="lnk-wrld edit-book-ancr" to={`/${world.key}/seasons`}>
                <img className="img_pop edit_s wrld" alt="World Edit" src={Edit}/>
                  <span className="fixed-hov-ob">Go to World</span>
              </Link>
                            </div>


						</span>
					</div>
					<h2 className='cmn-hd-cl'>{world.name}</h2>
				</div>
            )
          })}
          </div>
        }

        <div className="footer">
          <div className="container">
            <div className="Gri_foot">
		          <Worldpop
                handleChange={this.handlePopChange}
                handleSubmit={this.handlePopSubmit}
                name={name}
                open={openValue}
                openModal={this.openModal}
                closeModal={this.closeModal}
              />
		        </div>

          </div>
        </div>

      </div>
    );
  }
}

export default WorldPage;
