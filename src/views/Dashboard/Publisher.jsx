import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';
import { Button, Switch } from '@material-ui/core';
import { TextField, Grid } from 'material-ui';
import { Table, ItemGrid } from 'components';
import Burger from 'assets/img/menu-dots.png';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import { Link } from 'react-router-dom';
import Files from 'react-files'
import { Scrollbars } from 'react-custom-scrollbars';
import UpgradePop from './UpgradePop';

import def from 'assets/img/daf.png';

import {dbStorage} from 'config_db/firebase';

import setQueries from 'queries/setQueries';
import updateQueries from 'queries/updateQueries';
import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import deleteQueries from 'queries/deleteQueries';

class Publisher extends React.Component {
	worldWithDoc = null;
	accessWithWorld_id = null;

	defaultState = {
		fields: {},
	    file: '',
	    open: false,
	  	errors: {},
	 	accessText: {},
	  	accessList: {},
	}
  	state = {
	    fields: {},
	    file: '',
	    open: false,
	  	errors: {},
	 	accessText: {},
	  	accessList: {},
  	};

  	componentDidCatch = (error, info) => {
    	console.log(error, info);
  	}

  	componentDidUpdate = (prevProps, prevState) => {
  		if (prevState.open !== this.state.open) {
  			if (this.state.open) {
  				const world_id = this.props.world;

	  			this.getWorld();
	  			this.appendInvite(world_id);
  			} else {
  				if (this.worldWithDoc) {
  					this.worldWithDoc();
  					this.worldWithDoc = null;
  				}

  				if (this.accessWithWorld_id) {
  					this.accessWithWorld_id();
  					this.accessWithWorld_id = null;
  				}

  				// this.setState(this.defaultState);
  			}
  		}

  		if (prevState.stateChange !== this.state.stateChange) {
      		const { fields } = this.state;
      		const world_id = this.props.world;

      		this.props.setWorld(fields, world_id);

      		this.setState({
      			fields: {}, 
      			success: !this.state.success
      		});
    	}

	  	if (Object.entries(this.state.accessList).length < 1) {
      		const { showLite } = this.props;

      		if (!showLite && !this.props.notHis) {
        		this.newAccess();
      		}
	  	}
  	}

  	// Get world details
  	getWorld = () => {
  		const world_id = this.props.world;

  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.status === 1) {
  					let fields = results.data;
  					fields["author"] = "";

  					this.setState({ fields});

  					getQueries.getUserWithDoc(fields.user_id, (err, result) => {
  						if (err) {
  							console.log(err);
  						} else {
  							if (result.status === 1) {
  								let user_data = result.data;

  								fields["author"] = user_data.user_name || "";

  								this.setState({ fields });
  							}
  						}
  					});
  				}
  			}
  		}

  		this.worldWithDoc = realtimeGetQueries.getWorldWithDoc(world_id, callback);
  	}

  	// Show world access list
  	appendInvite = (world_id) => {
  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.status === 1) {
  					let access_data = results.data;
  					const user_id = localStorage.getItem("storyShop_uid");

  					let count = 0;
  					let accessText = this.state.accessText;

  					access_data.forEach(accesss => {
  						let key = accesss.id;
  						let data = accesss.data();

  						const email_id = data.email_id;
  						const author = data.auth;
  						const accUser = data.user_id;
  						const acc = data.write || false;
  						let notHis = true;

                        if (email_id === "defaultForAll" && accUser === "defaultForAll") return;

  						if (user_id === author) {
  							notHis = false;
  						}

  						let a = count;
  						count++;

  						const id = `accessEmail${a}`;
	  					const swit = `switch${a}`;

	  					accessText[id] = email_id;
	  					accessText[swit] = acc;

  						let access = [
							email_id,
							<div className="switc_h">
								Read

                                <label class="custom-switch">
									<input type="checkbox" value={acc} checked={acc} onChange={this.handleRealtimeSwitchChange(key, notHis)} />
									<span class="slider round"></span>
								</label>
								
								Write
							</div>,
							"Active",
							!notHis ?
								<Button className="btns tab" onClick={() => this.removeAccess(key)}>Remove</Button>
							:
								user_id === accUser ?
									<Button className="btns tab" onClick={() => this.removeAccess(key, true)}>Remove Self</Button>
								: 
							"",
							!notHis &&
								<Button className="btns tab own-bt" onClick={() => this.makeOwner(key)}>Make World Owner</Button>,
						];

						this.setState(prevState => ({
							...prevState,
							accessList: {
								...prevState.accessList,
								[key]: access
							}
						}))

						/*accessList.push(access);
						this.setState({ accessList, accessText });*/
  					});
  				}
  			}
  		}

  		this.accessWithWorld_id = realtimeGetQueries.getAccessWithWorld_id(world_id, callback);
  	}

  	deleteWorld = (world_id) => {
  		deleteQueries.removeWorld(world_id, (error, result) => {
	        if (error) {
	          	console.log(error);
	        } else {
	        }
	    });
  	}

  	delete = () => {
    	const { name } = this.state.fields;
	  	const world_id = this.props.world;

    	this.setState({open: false});

    	confirmAlert({
	      	title: 'Are you sure?',
	      	message: `You want to delete ${name}?`,
	      	buttons: [
		        {
	    	      	label: 'No',
	        	  	onClick: () => this.setState({open: true})
	        	},
	        	{
	          		label: 'Yes, Delete it!',
	          		onClick: () => {
	          			const callback = (error, results) => {
	          				if (error) {
	          					console.log(error);
	          				} else {
	          					if (results.data.docs.length > 0) {
	          						let res_data = results.data;

	          						res_data.forEach(access => {
	          							this.removeAccess(access.id);
	          						});

	          						this.deleteWorld(world_id);
	          					} else {
	          						this.deleteWorld(world_id);
	          					}
	          				}
	          			}

	          			return getQueries.getAccessWithWorld_id(world_id, callback);
				    }
			    }
	      	]
    	});
  	};

  	handleSubmit = (event) => {
    	event.preventDefault();
    	let { fields } = this.state;
    	const file = this.state.file;
    	const world_id = this.props.world;

    	if (file) {
      		const storage_ref = dbStorage.ref();
      		const image_child = storage_ref.child('world_images');
      		const image = image_child.child(file.name);

      		image.getDownloadURL().then((url) => {
        		fields['img'] = url;

      			this.changeWorld(fields, world_id);
        		this.setState({ fields });
      		}).catch((error) => {
        		const uploadTask = image.put(file);

        		uploadTask.on('state_changed', (snapshot) => {
		      		let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
		      		this.setState({progress});
	      		}, (error) => {console.log(error)}, () => {
          			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
	            		fields['img'] = downloadURL;

	            		this.changeWorld(fields, world_id);

	            		this.setState({ fields });
          			});
        		});
      		})
    	} else {
      		this.changeWorld(fields, world_id);
    	}
  	}

  	changeWorld = (fields, world_id) => {
		const callback = (error, results) => {
			if (error) {
				console.log("error " + error);
			} else {
				this.closeModal();
			}
		}

		fields["update_date"] = new Date().toISOString();

		updateQueries.updateWorld(world_id, fields, callback);
	}

  	updateWorldName = (world_id, name) => {
  		const data = {
  			name: name
  		}

  		updateQueries.updateWorld(world_id, data, (error, result) => {});
  	}

  	updateSeriesName = (series_id, name) => {
  		const data = {
  			name: name
  		}

		updateQueries.updateSeries(series_id, data, (error, result) => {});
  	}

  	appendSceneContent = (episode_id, new_episode_id) => {
  		const created_date = new Date().toISOString();

  		getQueries.getSceneWithEpisode_id(episode_id, (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					results.data.forEach(scene => {
  						const sceKey = scene.id;
  						let newScene = scene.data();

  						newScene["created_date"] = created_date;
                        newScene["update_date"] = created_date;
                        newScene["episode_id"] = new_episode_id;

                        setQueries.insertScene(newScene, (err, res) => {
                        	if (err) {
                        		console.log(err);
                        	} else {
                        		deleteQueries.removeScene(sceKey, (e, r) => {});
                        	}
                        });
  					});
  				}
  			}
  		});
  	}

  	appendEpisodeContent = (season_id, new_season_id) => {
  		const created_date = new Date().toISOString();

  		getQueries.getEpisodeWithSeason_id(season_id, (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					results.data.forEach(episode => {
  						const epiKey = episode.id;
  						let newEpisode = episode.data();

  						newEpisode["created_date"] = created_date;
                        newEpisode["update_date"] = created_date;
                        newEpisode["season_id"] = new_season_id;

                        setQueries.insertEpisode(newEpisode, (err, res) => {
                        	if (err) {
                        		console.log(err);
                        	} else {
                        		const newEpiKey = res.key;

                        		deleteQueries.removeEpisode(epiKey, (e, r) => {});

                        		this.appendSceneContent(epiKey, newEpiKey);
                        	}
                        });
  					});
  				} else {
  					let d_data = {
  						created_date: created_date,
  						update_date: created_date,
                        season_id: new_season_id,
                        name: "",
                        sort: 0
  					}

  					setQueries.insertEpisode(d_data, (e, r) => {});
  				}
  			}
  		});
  	}

  	appendSeasonContent = (series_id, new_series_id, new_world_id) => {
  		const created_date = new Date().toISOString();

  		getQueries.getSeasonWithSeries_id(series_id, (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					let i = 0;

  					results.data.forEach(season => {
  						const seaKey = season.id;
  						let newSeason = season.data();

  						if (i === 0) {
  							this.updateWorldName(new_world_id, newSeason.name);
  							this.updateSeriesName(new_series_id, newSeason.name);
  						}

  						i++;

  						newSeason["created_date"] = created_date;
						newSeason["update_date"] = created_date;
						newSeason["world_id"] = new_world_id;
						newSeason["series_id"] = new_series_id;

						setQueries.insertSeason(newSeason, (err, res) => {
							if (err) {
								console.log(err);
							} else {
								const newSeaKey = res.key;

								deleteQueries.removeSeason(seaKey, (e, r) => {});

								this.appendEpisodeContent(seaKey, newSeaKey);
							}
						})
  					});        
  				}
  			}
  		});
  	}

  	appendSeriesContent = (world_id, new_world_id, user_id) => {
  		const created_date = new Date().toISOString();

  		getQueries.getSeriesWithWorld_id(world_id, (ser_err, ser_res) => {
			if (ser_res) {
				console.log(ser_res);
			} else {
				if (ser_res.data.docs.length > 0) {
					ser_res.data.forEach(series => {
						const serKey = series.id;
						let newSeries = series.data();

						newSeries["name"] = "UNKNOWN";
                        newSeries["created_date"] = created_date;
					    newSeries["update_date"] = created_date;
					    newSeries["user_id"] = user_id;
					    newSeries["world_id"] = new_world_id;

					    setQueries.insertSeries(newSeries, (error, result) => {
					    	if (error) {
					    		console.log(error);
					    	} else {
					    		const newSerKey = result.key;

					    		this.appendSeasonContent(serKey, newSerKey, new_world_id);
					    	}
					    })
					});   
				}
			}
		});
  	}

  	appendWorldContent = (world_id, user_id) => {
  		const created_date = new Date().toISOString();

  		const world_callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.status === 1) {
  					let newWorld = results.data;

          			newWorld["name"] = "UNKNOWN";
				  	newWorld["created_date"] = created_date;
				  	newWorld["update_date"] = created_date;
				  	newWorld["user_id"] = user_id;

				  	setQueries.insertWorld(newWorld, (err, res) => {
				  		if (err) {
				  			console.log(err);
				  		} else {
				  			if (res.status === 1) {
				  				const newWKey = res.key;

				  				this.appendSeriesContent(world_id, newWKey, user_id);
				  			}
				  		}
				  	});
  				}
  			}
  		}

  		getQueries.getWorldWithDoc(world_id, world_callback);			
  	}

  	removeAccess = (key, self=false) => {
  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.status === 1) {
  					const data = results.data;

  					const { write, world_id, user_id } = data;

  					if (write) {
  						this.appendWorldContent(world_id, user_id);
  					}

  					deleteQueries.removeAccess(key, (err, done) => {
  						if (err) {
  							console.log(err);
  						} else {
  							try {
				        		if (self) {
				  					this.closeModal();
				  				} else {
				        		}
				    		} catch (e) {
				        		console.log(e);
				    		}
  						}
  					})
  				}

  				document.body.style.cursor='default';
  			}
  		}

  		return getQueries.getAccessWithDoc(key, callback);
	}

  	makeOwner = key => {
	  	this.setState({open: false});

	  	confirmAlert({
      		title: 'Are you sure?',
      		message: `You want to change world owner?`,
      		buttons: [
        		{
          			label: 'No',
          			onClick: () => this.setState({open: true})
        		},
        		{
          			label: 'Yes, Make Owner!',
          			onClick: () => {
          				return getQueries.getAccessWithDoc(key, (error, results) => {
          					if (error) {
          						console.log(error);
          					} else {
          						if (results.status === 1) {
          							const val = results.data;

          							const auth = val.auth;
								  	const user_id = val.user_id;
								  	const world_id = val.world_id;

								  	getQueries.getUserWithDoc(auth, (err, res) => {
								  		if (error) {
								  			console.log(error);
								  		} else {
								  			if (res.status === 1) {
								  				const email_id = res.data.email_id;

								  				const data = {
													user_id: auth,
													auth: user_id,
													email_id
											  	}

											  	const cb = (e, r) => {
											  		if (e) {
											  			console.log(e);
											  		} else {
											  			const dd = {
											  				user_id: user_id
											  			}

											  			updateQueries.updateWorld(world_id, dd, (ee, rr) => {
											  				if (ee) {
											  					console.log(ee);
											  				} else {
											  				}
											  			})
											  		}
											  	}

								  				updateQueries.updateAccess(key, data, cb);
								  			}
								  		}
								  	});
          						}
          					}
          				});
			    	}
		    	}
      		]
    	});
  	}

  	NextClick = () => {
	  	const world_id = this.props.world;
	  	const { fields } = this.state;
    	const file = this.state.file;

    	if (file) {
      		const storage_ref = dbStorage.ref();
      		const image_child = storage_ref.child('world_images');
      		const image = image_child.child(file.name);

      		image.getDownloadURL().then((url) => {
        		fields['img'] = url;

        		this.closeModal();

        		this.setState({ fields });
      		}).catch((error) => {
        		const uploadTask = image.put(file);

        		uploadTask.on('state_changed', (snapshot) => {
		      		let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
		      		this.setState({progress});
	      		}, (error) => {console.log(error)}, () => {
          			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            			fields['img'] = downloadURL;

			      		updateQueries.updateWorld(world_id, fields, (err, res) => {});
          			});
        		});
      		})
    	} else {
     		updateQueries.updateWorld(world_id, fields, (err, res) => {});
    	}
  	}

  	inviteFriend = id => {
	  	let { accessList } = this.state;
	  	let already_user = false;

	  	const name = `accessEmail${id}`;
	  	const swit = `switch${id}`;

	  	const world_id = this.props.world;
	  	const email_id = this.state.accessText[name];
	  	let write = this.state.accessText[swit];

	  	if (!write) {
		  	write = false;
	  	}

	  	Object.entries(accessList).map(([id, l]) => {
		  	if (l[0] === email_id) {
			  	already_user = true;
			  	return;
		  	}
	  	});

	  	if (already_user) {
		  	return;
	  	}

	  	if (this.isValid(email_id) && email_id) {
		  	const auth = localStorage.getItem("storyShop_uid");

		  	const callback = (error, results) => {
		  		if (error) {
		  			console.log(error);
		  		} else {
		  			if (results.data.docs.length > 0) {
		  				results.data.forEach(user => {
		  					const user_id = user.id;

                            if (user_id === localStorage.getItem("storyShop_uid")) {
                                alert("You can't give access to yourself!");

                                return;
                            }

		  					const data = {
		  						world_id, 
		  						email_id, 
		  						write, 
		  						auth, 
		  						user_id
		  					}

		  					setQueries.insertAccess(data, (er, res) => {
		  						if (er) {
		  							console.log(er);
		  						} else {
		  						}
		  					})
		  				})
		  			}
		  		}
		  	}

		  	return getQueries.getUserWithEmail_id(email_id, callback);
	  	}
  	}

  	onFilesChange = (files) => {
	    let { fields } = this.state;
	    let file = files[files.length-1];

	  	if (!file) return;

	    fields['img'] = file.preview.url;

	    this.setState({file, fields});
  	}

  	onFilesError = (error, file) => {
    	alert("Maximum File Size 2 MB");
  	}

  	openModal = () => {
    	this.setState({ open: true });
  	}

  	closeModal = () => {
    	this.setState({ open: false });
  	}

  	isValid = (id) => {
	  	const { accessText, errors } = this.state;
	  	let formIsValid = true;

	  	if (typeof accessText[id] !== "undefined") {
      		let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      		
      		if (!pattern.test(accessText[id])) {
        		formIsValid = false;
		    	errors[id] = "*Please enter valid email-ID.";
      		}
    	}

	  	return formIsValid;
  	}

  	newAccess = () => {
	  	let { accessList } = this.state;

	  	const count = Object.entries(accessList).length;
	  	const id = `accessEmail${count}`;
	  	const swit = `switch${count}`;

	  	let access = [
		  	<input type="email"
		      type="email"
         	  name={id}
		      placeholder="Email ID"
        	  className="textField mf clb"
        	  value={this.state.accessText[id]}
        	  onChange={this.handleAccessChange}
        	  margin="normal" />,
		  	<div className="switc_h">
			  	Read
			  	<label class="custom-switch">
					<input type="checkbox" value={swit} checked={this.state.accessText[swit]} onChange={this.handleSwitchChange(swit)} />
					<span class="slider round"></span>
				</label>
			 	Write
		  	</div>,
		  	"Active",
		  	<Button className="btns tab" onClick={() => this.inviteFriend(count)}>Invite</Button>,
		  	""
	  	];

	  	this.setState(prevState => ({
	  		...prevState,
	  		accessList: {
	  			...prevState.accessList,
	  			[id]: access
	  		}
	  	}));

	  	/*accessList.push(access);

	  	this.setState({ accessList });*/
  	}

  	handleTextChange = (event) => {
    	const { name, value } = event.target;
    	let { fields } = this.state;

    	fields[name] = value;

    	this.setState({fields});
  	}

  	handleAccessChange = (event) => {
	  	const { name, value } = event.target;
	  	let { accessText } = this.state;

	  	accessText[name] = value;

	  	this.setState({ accessText });
  	}

  	handleSwitchChange = name => event => {
	  	const { checked } = event.target;
	  	let { accessText } = this.state;

	  	accessText[name] = checked;

	  	this.setState({ accessText });
  	}

  	handleRealtimeSwitchChange = (access_id, notHis) => event => {
	  	const { checked } = event.target;

	  	if (notHis) return;

	  	let data = {
	  		write: checked
	  	}

	  	updateQueries.updateAccess(access_id, data, (err, res) => {if (err) console.log(err)});
  	}

    handleMouseEnter = (event) => {
      this.setState({ isHovering: true });
    }

    handleMouseLeave = (event) => {
      this.setState({ isHovering: false });
    }


  	render() {
        const { fields, open, accessList } = this.state;
        const world_id = this.props.world;
    	const { write, access_key, notHis, showLite } = this.props;

        return (
            <div className='prnt-pub'>
            <div className='dashboard-three-grp ex-wrld'>
            <button 
            className="button img_pop brr wrld" onClick={() => this.openModal()}><img className="img_brr wrld" alt="World Writer" src={Burger}/></button>
                
                <span className="fixed-hov-ob">Edit book details</span>
              </div>
                

                <Popup open={open} onClose={this.closeModal} closeOnDocumentClick >
			 		<Scrollbars className='cmn-writer-pop' autoHide autoHideDuration={200}>
			      		<div className="wrld-wrt writer">
			        		<form className="container myform" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
		            			<div>
									<div className='wrdres_popgrid1'>
			            				<div>
					          				{write && !notHis ?<Files
	                                         className='res_pop'
	                                         onChange={this.onFilesChange}
	                                         onError={this.onFilesError}
	                                         accepts={['image/*']}
	                                         maxFileSize={2097152}
	                                         minFileSize={0}
	                                         clickable >
					            				<img className="res_pop" alt="Season" src={fields.img ? fields.img : def} />
					          				</Files> :
					           				<img className="res_pop" alt="Season" src={fields.img ? fields.img : def} />}
			            				</div>

			            				<div>
				            				<div className='pop-prnt_til'>
						          				<div className='p-ttl cmn-hd-cl'>Title</div>

						          				<input type="text"
					            					disabled={!write && notHis}
							                        name="name"
							                        className="textField mf"
							                        value={fields.name}
							                        onChange={this.handleTextChange}
							                        margin="normal" />
				            				</div>

					          				<div className='pop-prnt_til'>
						          				<div className='p-ttl cmn-hd-cl'>Author</div>

						          				<input type="text"
					            					disabled={!write && notHis}
							                        name="author"
							                        className="textField mf"
							                        value={fields.author}
							                        onChange={this.handleTextChange}
							                        margin="normal" />
				            				</div>

                    						<div className='pop-prnt_til'>
						          				<div className='p-ttl cmn-hd-cl'>Created</div>

						          				<input type="text"
					            					disabled
							                        name="author"
							                        className="textField mf"
							                        value={new Date(fields.created_date).toLocaleDateString()}
							                        margin="normal" />
				            				</div>
				          				</div>
						  			</div>
						  

			            			<div>
				            			<div className='pop-prnt'>
						          			<div className='p-ttl cmn-hd-cl'>Tagline</div>

						          			<textarea
					            				disabled={!write && notHis}
						                        name='tagline'
						                        value={fields.tagline}
						                        onChange={this.handleTextChange}
								                multiline={true}
								                rowsmax="8"
								                rows="2"
								                className="textField mf tx"
								                margin="normal" >
											</textarea>
				            			</div>


					          			<div className='pop-prnt'>
						          			<div className='p-ttl cmn-hd-cl'>Summary</div>

						          			<textarea
									            disabled={!write && notHis}
								                name="summary"
				                        		onChange={this.handleTextChange}
				                        		value={fields.summary}
								                multiline
								                rowsMax="8"
								                rows="1"
								                className="textField mf txs"
								                margin="normal">
											</textarea>
				            			</div>

                    					<div className='pop-prnt'>
				              				<div className={`p-tt3${showLite ? " bld-pro" : ""} cmn-hd-cl`}>Manage Collaborators {showLite && (<UpgradePop />)}
					                			{ 
					                				write && !notHis && (
					                					<Button disabled={showLite} className="add-access" 
					                					  variant="fab" color="primary" aria-label="Add" 
					                					  onClick={() => this.newAccess()}>
						               						<AddIcon />
					                					</Button>
					                				) 
					                			}
				              				</div>
				            			</div>

		                				<Table
							                tableHeaderColor="warning"
							                tableData={Object.values(accessList)} />
                  					</div>
                  
				  					<div className="wrldgrid_btns">
                  						{ write && !notHis && ( 
                  							<div>
								                <Button type='submit' className="btns">Save</Button>
								            </div>
								        ) }

                  						<div>
		                					<Button className="btns" onClick={this.closeModal}>Cancel</Button>
		          						</div>
				  					</div>

                  					{ write && !notHis && (
                  						<div className='dlt'>
                    						<div onClick={this.delete} className="dlt-lnk">Delete World</div>
                  						</div>
                  					) }
		            			</div>
		          			</form>
	          			</div>
			    	</Scrollbars>
        		</Popup>
      		</div>
    	);
  	}
}

export default Publisher;
