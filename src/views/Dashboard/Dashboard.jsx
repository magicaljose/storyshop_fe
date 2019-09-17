import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid
} from 'material-ui';
import PropTypes from 'prop-types';
import { ItemGrid } from 'components';
import { Redirect } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { dashboardStyle } from 'variables/styles';
import { Fab, Button } from '@material-ui/core';
import { Menu } from 'material-ui';
import { Link } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import MenuItem from 'material-ui/Menu/MenuItem';
import Writer from "views/Dashboard/Writer.jsx";
import Dashboardpop from "views/Dashboard/Dashboardpop.jsx";

import def from 'assets/img/daf.png'; 
import book from 'assets/img/book-icon-transparent-27.jpg'; 
import dry from 'assets/img/book_1.png'; 
import finan from 'assets/img/finan.png'; 
import dollar from 'assets/img/dollar.png';
import Edit from 'assets/img/edit.png';
import world from 'assets/img/Blue-World-Map.png'; 
import ss_forums from 'assets/img/icons/ss-forums-d.png';
import ss_uni from 'assets/img/icons/ss-uni-d.png';
import loadingGF from 'assets/img/loding_loding.gif';

import templates from '../templates.js';

import secureStorage from 'secureStorage';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';

class Dashboard extends React.Component {
	seasonWithWorldid = {}
	popCheck=null;
    state = {
    	seasonDatabase: {},
    	defaultSeasonDatabase: {},
    	notAuthSeasons: {},
    	defaultNotAuthSeasonDatabase: {},
    	worlds: {},
    	defaultWorlds: {},
    	notAuthWorlds: {},
    	defaultNotAuthWorlds: {},
        world_list: [],
		access_world_list: [],
	    secondFilter: "All Roles",
	    thirdFilter: "Newest",
        loading: true,
        slct_lnk: "uni_slt",
        isPopChecked: false,
        isHovering: {}
    }

    componentWillMount = () => {
      	if (!localStorage.getItem('storyShop_uid')) {
        	return;
      	}

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

    	if ((token.account_type === "Lite") && !token.doNotShowAgain) {
    		this.getLandingPop();
      		this.setState({ showLite: true });
    	}

      	this.getWorldsList();
      	this.getAccessWorlds();
    }

    componentDidCatch = (error, info) => {
			console.log(error, info);
		}

    componentDidUpdate = (prevProps, prevState) => {
	    if (prevState.thirdFilter !== this.state.thirdFilter) {
		    this.filterSeasonsBy(this.state.thirdFilter, this.state.secondFilter);
	    }

	    if (prevState.secondFilter !== this.state.secondFilter) {
            this.filterSeasonsBy(this.state.thirdFilter, this.state.secondFilter);
	    }
    }

    componentWillUnmount = () => {
    	if (this.worldsList) {
    		this.worldsList();
    	}

    	if (this.accessWorlds) {
    		this.accessWorlds();
    	}

    	if (this.seasonWithWorldid) {
    		Object.entries(this.seasonWithWorldid).map(([itemKey, itemDom]) => {
    			if (itemDom) {
    				itemDom();
    			}
    		});
    		this.seasonWithWorldid = {}
    	}
    }

    giveProAccess = (onclose) => {
    	let token = secureStorage.getItem("storeToken");

    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			onclose();
    			
				secureStorage.setItem("storeToken", {
					user_id: token.user_id,
					user_name: token.user_name,
					account_type: token.account_type,
					expire_date: token.expire_date,
					account_created_date: token.created_date,
					isNewUser: false,
					doNotShowAgain: this.popCheck && this.popCheck.checked
				});
    		}
    	}

    	const fields = {
			account_type: "Pro",
			expire_date: new Date(Date.now() + 12096e5),
			isNewUser: false,
			doNotShowAgain: this.popCheck && this.popCheck.checked
		};
		
		updateQueries.updateUser(token.user_id, fields, callback);
    }

    getWorldsList = () => {
    	const user_id = localStorage.getItem("storyShop_uid");

    	if (!user_id) return;

    	const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					let world_list = [];

					results.data.forEach(snap => {
						const world_id = snap.id;

						if (!snap.data()) {
							return this.setState({ loading: false });
						}

						const world_name = snap.data().name || "";

						world_list.push([world_id, world_name]);

						this.getWorldSeasons(world_id, world_name);
					});
				
					this.setState({ world_list });
				} else {
					this.setState({ loading: false });
				}
			}
		}

    	this.worldsList = realtimeGetQueries.getWorldsWithUser_id(user_id, callback);
    }

    getWorldSeasons = (world_id, world_name) => {
    	const cb = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					results.data.docChanges().forEach(change => {
						const snap = change.doc;

						if (change.type === "removed") {
							let ss_database = this.state.seasonDatabase;
							let d_ss_database = this.state.defaultSeasonDatabase;

							if (!ss_database || !d_ss_database) return;

							delete ss_database[snap.id];
							delete d_ss_database[snap.id];

							this.setState({ seasonDatabase: ss_database, defaultSeasonDatabase: d_ss_database });
							return;
						}

						let obj = snap.data();
									
						obj['key'] = snap.id;
						obj['world_id'] = world_id;
						obj['world_name'] = world_name;

						this.setState(prevState => ({
    						...prevState,
    						loading: false,
    						seasonDatabase: {
    							...prevState.seasonDatabase,
    							[snap.id]: obj
    						},
    						defaultSeasonDatabase: {
    							...prevState.defaultSeasonDatabase,
    							[snap.id]: obj
    						}
    					}));
					});
				} else {
					this.setState({ loading: false });
				}
			}
		}

		this.seasonWithWorldid[world_id] = realtimeGetQueries.getSeasonWithWorld_id(world_id, cb);
    }

    getAccessWorlds = () => {
    	const user_id = localStorage.getItem("storyShop_uid");

    	if (!user_id) return;

    	const callback = (error, results) => {
			if (error) {
				console.log("access error");
			} else {
				if (results.data.docs.length > 0) {
					let access_world_list = [];
					
					results.data.forEach(snap => {
						let access_key = snap.id;
						let wid = snap.data().world_id;
						let write = snap.data().write;
						const notHis = true;
						
						this.getAccessWorldSeasons(wid, access_key, write, notHis);

						const cb = (error, result) => {
							if (error) {
								console.log(error);
							} else {
								if (result.status===1) {
									access_world_list.push([wid, result.data.name]);

									this.setState({ access_world_list });
								}
							}
						}
						getQueries.getWorldWithDoc(wid, cb); 
					});

					this.setState({ access_world_list });
				} else {
					this.setState({ loading: false });
				}
			}
		}

    	this.accessWorlds = realtimeGetQueries.getAccessWithUser_id(user_id, callback);
    	
    	this.getAccessWorldSeasons("hluIYEVG4LM6OHv78pyT", "3Twr37S8At7aZqUnfNuL", false, true);
    }

    getAccessWorldSeasons = (world_id, access_key, write, notHis) => {
    	const cb = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					results.data.docChanges().forEach(change => {
						const snap = change.doc;

						if (change.type === "removed") {
							let ss_database = this.state.notAuthSeasons;
							let d_ss_database = this.state.defaultNotAuthSeasonDatabase;

							if (!ss_database || !d_ss_database) return;

							delete ss_database[snap.id];
							delete d_ss_database[snap.id];

							this.setState({ notAuthSeasons: ss_database, defaultNotAuthSeasonDatabase: d_ss_database });
							return;
						}
						
						let obj = snap.data();

						obj['key'] = snap.id;;
						obj['access_key'] = access_key;
						obj['wid'] = world_id;
						obj['write'] = write;
						obj['notHis'] = notHis;
						obj['world_name'] = "";

						this.setState(prevState => ({
    						...prevState,
    						loading: false,
    						notAuthSeasons: {
    							...prevState.notAuthSeasons,
    							[snap.id]: obj
    						},
    						defaultNotAuthSeasonDatabase: {
    							...prevState.defaultNotAuthSeasonDatabase,
    							[snap.id]: obj
    						}
    					}));
					});
				} else {
					this.setState({ loading: false });
				}
			}
		}

		this.seasonWithWorldid[world_id] = realtimeGetQueries.getSeasonWithWorld_id(world_id, cb);
    }

    getSortby = (type, data) => {
        if (type === "Last Updated") {
            data.sort(([a_id, a], [b_id, b]) => {
			    return new Date(b.update_date) - new Date(a.update_date)
		    });
        } else {
            data.sort(([a_id, a], [b_id, b]) => {
			    return new Date(b.created_date) - new Date(a.created_date)
		    });

            if (type === "Oldest") {
                data = data.reverse();
            }
        }

        return data;
    }

    filterSeasonsBy = (type1, type2) => {
	    const { defaultSeasonDatabase, defaultNotAuthSeasonDatabase } = this.state;

        let updateDatabase = this.getSortby(type1, Object.entries(defaultSeasonDatabase).slice());
        let updateNotAuth = this.getSortby(type1, Object.entries(defaultNotAuthSeasonDatabase).slice());

        updateDatabase = updateDatabase.reduce((result, item) => {result[item[0]] = item[1]; return result}, {});
        updateNotAuth = updateNotAuth.reduce((result, item) => {result[item[0]] = item[1]; return result}, {});

        if (type2 === "Author") {
            this.setState({
                seasonDatabase: updateDatabase,
                notAuthSeasons: []
            });
        } else if (type2 === "Peer") {
            this.setState({
                seasonDatabase: [],
                notAuthSeasons: updateNotAuth
            });
        } else {
            this.setState({
                seasonDatabase: updateDatabase,
                notAuthSeasons: updateNotAuth
            });
        }
    }

    handleClick = (name, event) => {
        this.setState({ [name]: event.currentTarget });
    };

    handleClose = name => {
        this.setState({ [name]: null });
    };

    ChangeFilter = (type, value, name) => {
	      this.setState({ [type]: value, [name]: null })
    };

    handleDropChange = (event, { name, value }) => {
      	if (name === "filter1") {
	        if (value.toLowerCase() === "All Worlds".toLowerCase()) {
		          this.props.history.push('/World');
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

    openLink = (key, link) => {
    	window.open(link, '_blank');

    	this.setState({ slct_lnk: key });
    }

    removeFromView = (season_id, notHis) => {
    	let ss_database = this.state.seasonDatabase;
		let d_ss_database = this.state.defaultSeasonDatabase;

		if (notHis) {
			ss_database = this.state.notAuthSeasons;
			d_ss_database = this.state.defaultNotAuthSeasonDatabase;
		}

		if (!ss_database || !d_ss_database) return;

		delete ss_database[season_id];
		delete d_ss_database[season_id];

		this.setState({ seasonDatabase: ss_database, defaultSeasonDatabase: d_ss_database });
    }

    showIntroduction = () => {
    	const { slct_lnk } = this.state;

		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='react-confirm-alert-body dashboard custom-ui'>
						<div className='pp-head'>Learn More</div>
						<section className='cmn-grp pp-vid-grp'>
							<div className='pp-vid sm-txt'>
								Jump Right in and learn the basics about how to get the most out of StoryShop
							</div>
							
							<div className='pp-vid sm-lnk'>
								<iframe className='pp-vid-fr' src="https://www.youtube.com/embed/W4EUQA-w0gE"> </iframe>
							</div>
						</section>
						
						<section className='cmn-grp pp-oth-grp'>
							<div className='pp-oth sm-txt'>
								Or Dive Deeper with these resources
							</div>
							
							<div className='pp-oth sm-lnk'>
								<div className='dashpop-grditm1'>
					          		<div className="cmn-grp uni-grp">
					          			<div className={`blk ${slct_lnk === "uni_slt" ? "blk-active" : ""}`} onClick={() => this.openLink("uni_slt", "https://university.storyshop.io/courses/course-one-pre-writing/")}>
					          				<img className="sm-uni-lnk" alt="StoryShop University" src={ss_forums}/>
					          				<h4 className='cmn-hd-cl'>StoryShop University</h4>
					          			</div>
										
										<div className='sm-uni-txt'>In-Depth courses from cool people on a variety of writing subjects</div>
							  		</div>
							
						          	<div className="cmn-grp frm-grp">
						          		<div className={`blk ${slct_lnk === "frm_slt" ? "blk-active" : ""}`} onClick={() => this.openLink("frm_slt", "https://university.storyshop.io/forums/")}>
					          				<img className="sm-uni-lnk" alt="StoryShop Forums" src={ss_uni}/>
					          				<h4 className='cmn-hd-cl'>StoryShop Forums</h4>
					          			</div>
										
										<div className="sm-uni-txt">Great for Q & A on specific features, product timelines and more</div>
								  	</div>
								</div>
							</div>
						</section>
					</div>
				)
			}
		});
	}

	getLandingPop = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='react-confirm-alert-body dashboard-landing custom-ui'>
						<div className='right-corner-bx'>
							<div className='cmn-bx cls-tn' style={{cursor: 'pointer'}} onClick={() => this.giveProAccess(onClose)}>
								<i className="fa fa-times close-tb"></i>
							</div>
						</div>

						<section className='cmn-rw rw1'>
							<div className='txt-grp'>
								<p className='pppp'>Follow us down the rabbit hole</p>
								<p className='pppp-1'>and receive 
									<span className='fr-wk'>2 FREE Weeks</span>
								of StoryShop Pro</p>
							</div>
						</section>

						<section className='cmn-rw rw2'>
							<div className='stp-grp'>step <span className='st-rnd'>1</span></div>
							
							<div className='stps'>
								<div className='hh-grp'>
									<div className='lnd-img-grp'>
										<img className="res_pon" alt="Season Default" src="https://firebasestorage.googleapis.com/v0/b/storyshop-reactjs-db.appspot.com/o/alice_in_wonderland.jpg?alt=media&token=169ed11b-db6a-4928-97c2-e25ab990cf1a" />
										<span className='stp1-txt'>Explore Alice in Wonderland</span>
									</div>

									<div className='rr-grp'>Or</div>
								</div>

								<div className='hh-grp'>
									<div className='lnd-img-grp'>
										<img className="res_pon" alt="Season Default" src={def}/>
										<span className='stp1-txt'>Create A New Book</span>
									</div>
									
									<div className='rr-grp'>Or</div>
								</div>								

								<div className='lnd-img-grp exx'>
									<div className='exx-hht'>
										<div className='ex-uni'>
											<i className="fa fa-graduation-cap"></i>
										</div>
									</div>
									
									<span className='stp1-txt'>Explore University</span>
								</div>
							</div>
						</section>

						<section className='cmn-rw rw3'>
							<div className='stp-grp'>step <span className='st-rnd'>2</span></div>
							<div className='cmb-txt'>Come back and visit us again!</div>
						</section>

						<section className='cmn-rw rw4'>
							<div className="imprt-chk">
				   				<input ref={(node) => this.popCheck = node} type='checkbox' 
				   				name="isPopChecked" className="imprt-chkbx" /> 
				   				<div className='imp-ch-txt'>Don't show me this again</div>
				   			</div>
						</section>
					</div>
				)
			},
			closeOnEscape: false,
  			closeOnClickOutside: false,
		});
	}

    render() {
		const { 
			world_list, access_world_list,
			secondFilter, thirdFilter, loading 
		} = this.state;

		let {
			seasonDatabase, notAuthSeasons
		} = this.state;

		seasonDatabase = Object.entries(seasonDatabase);
		notAuthSeasons = Object.entries(notAuthSeasons);

        if (!localStorage.getItem('storyShop_uid')) {
            return <Redirect to='/app' />
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
			        <div className='drop'>
				        <Dropdown selection
				          className='menu-db'
				          icon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
				          name="filter1"
				          text="All Books"
				          options={[
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
                	seasonDatabase.length === 0 && notAuthSeasons.length === 0 ?
                 		<div className='empty-msg'>
                     		Looks like your Dashboard is empty. Click the + in the bottom right to create a new project!
                 		</div> 
                 	:
                 		<div className="main_grds">
                     		{
                     			seasonDatabase.map(([season_id, season]) => {
                     				return (
                     					<div key={season.key} className="inner_main_grds">
											<div className="laye_r">
												<img className="res_pon" alt="Season Default" src={season.img ? season.img : def}/>
						            			
						            			<span>
													<Writer season_id={season.key} write={true} world_list={world_list}
										   			  access_world_list={access_world_list} removeFromView={this.removeFromView} />

										   			<div className="lnk-grp-hv">
										   				<Link
										   				className="edit-book-ancr" to={`/${season.world_id}/${season.series_id}/${season.key}`}>
										          			<img className="img_pop edit_s" alt="Edit With Publisher" src={Edit}/>
										          			<span className="fixed-hov-ob">Open Book in Writer</span>
									         			</Link>
									         			
										   			</div>
								         		</span>
								         		<span>
								         			<Link className="" to={`/dashboard/book-publish`}>
									          			<div className="img_pop edit_s src-1"> <i className="fas fa-book"></i></div>
								         			</Link>
													
								         		</span>

								         		<span>
								         		<Link className="" to={`/dashboard/book-data`}>
									          			<div className="img_pop edit_s src-2"><i className="fas fa-line-chart"></i></div>
								         			</Link>
													
								         		</span>

								         		<span>
								         		<Link className="" to="#">
									          			<div className="img_pop edit_s src-3"><i className="fas fa-dollar-sign"></i></div>
								         			</Link>
													
								         		</span>


						         			</div>
						         			
						         			<h2 className='cmn-hd-cl'>{season.name}</h2>
                              			</div>
                     				)
                     			})
                     		}
		                 
		                 	{
		                 		notAuthSeasons.map(([season_id, season]) => {
		                 			return (
                              			<div key={season.key} className="inner_main_grds">
					                        <div className="laye_r">
                                      			<img className="res_pon" alt="Season Default" src={season.img ? season.img : def}/>
						                        <span>
						                            <Writer access_key={season.access_key}
								                      season_id={season.key} world_list={world_list} write={season.write}
								                      notHis={season.notHis} access_world_list={access_world_list} removeFromView={this.removeFromView} />

								                      <div className="lnk-grp-hv">
								                      	<Link
								                      	className="edit-book-ancr" to={`/${season.world_id}/${season.series_id}/${season.key}`}>
							                            	<img className="img_pop edit_s" alt="Edit With Publisher" src={Edit}/>
							                            	<span className="fixed-hov-ob">Open Book in Writer</span>
							                        	</Link>
										   			</div>

						                            

						                        </span>
						                        <span>
													<div className="img_pop edit_s src-1"> <i className="fas fa-book"></i></div>
								         		</span>

								         		<span>
													<div className="img_pop edit_s src-2"><i className="fas fa-line-chart"></i></div>
								         		</span>

								         		<span>
													<div className="img_pop edit_s src-3"><i className="fas fa-dollar-sign"></i></div>
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
                    	<div className='hv-grp'>
                    		<Fab  color="primary"
	                          className="button Season strt-b" onClick={() => this.showIntroduction()}>
	                        	<i className="fa fa-graduation-cap"></i>
	                       	</Fab>

	                       	<span className="fixed-hov-ob">Go to StoryShop University</span>
                    	</div>
                        
                        <div className="Gri_foot">
		                    <Dashboardpop />
		                </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;