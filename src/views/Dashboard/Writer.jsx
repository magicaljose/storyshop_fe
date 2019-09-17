import React from 'react';
import Popup from "reactjs-popup";
import autosize from "autosize";
import { Button, Grid, TextField } from 'material-ui';
import { ItemGrid } from 'components';
import FormControl from 'material-ui/es/Form/FormControl';
import { 
  NativeSelect, Radio, RadioGroup, FormControlLabel, Switch 
} from '@material-ui/core';
import def from 'assets/img/daf.png';
import Burger from 'assets/img/menu-dots.png';
import Files from 'react-files'
import { confirmAlert } from 'react-confirm-alert';
import { Scrollbars } from 'react-custom-scrollbars';

import loadingGF from 'assets/img/loding_loding.gif';

import {dbStorage} from 'config_db/firebase';

import realtimeGetQueries from 'queries/realtimeGetQueries';
import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import deleteQueries from 'queries/deleteQueries';
import setQueries from 'queries/setQueries';

class Writer extends React.Component{
  	ref = {};
    defaultState = {
        fields: {},
        file: '',
        open: false,
        progress: '',
        series_list: [],
        loading: true,
        isHovering: false
    }
  	state = {
	    fields: {},
	    file: '',
	    open: false,
		progress: '',
		series_list: [],
        loading: true,
        isHovering: false
  	}

  	componentDidUpdate = (prevProps, prevState) => {
        if (prevState.open !== this.state.open) {
            if (this.state.open) {
                if (this.ref) {
                    autosize(Object.values(this.ref));
                }

                this.getSeason();
            } else {
                if (this.ref) {
                    autosize.destroy(Object.values(this.ref));
                }

                if (this.season) {
                	this.season();
                }

                this.setState(this.defaultState);
            }
        }
  	}

  	componentDidCatch = (error, info) => {
    	console.log(error, info);
  	}

  	getSeason = () => {
  		const { season_id } = this.props;

  		if (!season_id) return;

  		const callback = (error, result) => {            
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
                    let fields = result.data;

  					this.getSeries(fields.world_id);

  					const cb = (err, res) => {
  						if (err) {
  							console.log(err);
  						} else {
  							if (res.status === 1) {
  								fields["series_name"] = res.data.name;

  								this.setState({ fields: fields, loading: false });
  							} else {
  								this.setState({ fields: fields, loading: false });
  							}
  						}
  					}

  					getQueries.getSeriesWithDoc(fields.series_id, cb);
  				} else {
  					this.setState({ fields: [], loading: false });
  				}
  			}
  		}

  		this.seasons = realtimeGetQueries.getSeasonWithDoc(season_id, callback);
  	}

  	getSeries = (world_id, change=false) => {
  		const callback = (error, results) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (results.data.docs.length > 0) {
  					let series_list = [];

  					results.data.forEach(snap => {
  						series_list.push([snap.id, snap.data().name]);
  					});

  					if (change && series_list.length === 0) {
               			const created_date = new Date().toISOString();

               			const data = {
               				world_id, created_date, 
               				update_date: created_date, 
               				name: "UNKNOWN"
               			}

               			const cb = (err, res) => {
               				if (err) {
               					console.log(err)
               				} else {
               					if (res.status === 1) {
               						const new_sei = res.key;

               						series_list.push([ new_sei, "UNKNOWN" ]);

               						this.setState(prevState => ({
				  						...prevState,
				  						series_list,
				  						fields: {
				  							...prevState.fields,
				  							series_id: series_list[0] ? series_list[0][0] : "",
				                   			series_name: series_list[0] ? series_list[0][1] : ""
				  						}
				  					}));
               					}
               				}
               			}

               			setQueries.insertSeries(data, cb);
             		} else {
             			if (change) {
		  					this.setState(prevState => ({
		  						...prevState,
		  						fields: {
		  							...prevState.fields,
		  							series_id: series_list[0] ? series_list[0][0] : "",
		                   			series_name: series_list[0] ? series_list[0][1] : ""
		  						}
		  					}));
		  				}

             			this.setState({ series_list });
             		}
  				}
  			}
  		}

  		getQueries.getSeriesWithWorld_id(world_id, callback);
  	}

  	saveSeries = series_id => {
      if (!this.props.write) return;
  		const { fields } = this.state;

  		if (!fields.series_name) return;
	  	if (fields && fields.series_name && !fields.series_name.trim()) return;

	  	const data = {
	  		name: fields.series_name
	  	}

        let series_list = this.state.series_list;
        let change_index = series_list.findIndex(item => item[0] === series_id);

        series_list[change_index] = [series_id, data.name];

	  	const callback = (error, result) => {
	  		if (error) {
	  			console.log(error);
	  		} else {
	  			if (result.status === 1) {
	  				this.setState(prevState => ({
			        	...prevState,
			        	changeSeries: false,
                        series_list: series_list,
			        	fields: {
			          		...prevState.fields,
			          		series_name: fields.series_name
			        	}
			      	}));
	  			}
	  		}
	  	}

	  	updateQueries.updateSeries(series_id, data, callback);
  	}

  	handleSubmit = (event) => {
    	event.preventDefault();
    	const { fields } = this.state;

    	const file = this.state.file;

    	const { season_id } = this.props;

    	if (!season_id) return;

    	if (file) {
			const storage_ref = dbStorage.ref();
	      	const image_child = storage_ref.child('season_images');
	      	const image = image_child.child(file.name);

      		image.getDownloadURL().then((url) => {
        		fields['img'] = url;

        		this.setState({ fields });

        		this.saveSeason(fields, season_id);
      		}).catch((error) => {
        		const uploadTask = image.put(file);

        		uploadTask.on('state_changed', (snapshot) => {
		      		let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
		      		this.setState({progress});
	      		}, (error) => {console.log(error)}, () => {
          			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            			fields['img'] = downloadURL;

            			this.setState({ fields });
            			this.saveSeason(fields, season_id);
          			});
        		});
      		})
    	} else {
      		this.saveSeason(fields, season_id);
    	}
  	}

  	saveSeason = (fields, season_id) => {
  		fields["update_date"] = new Date().toISOString();

  		const worldsCB = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					if (result.data.name === "UNKNOWN") {
  						const data = {
  							name: fields.name
  						}

  						updateQueries.updateWorld(fields.world_id, data, (err, res) => {})
  					}
  				}
  			}
  		}

  		const seriesCB = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					if (result.data.name === "UNKNOWN") {
  						const data = {
  							name: fields.name
  						}

  						updateQueries.updateSeries(fields.world_id, data, (err, res) => {})
  					}
  				}
  			}
  		}

  		getQueries.getWorldWithDoc(fields.world_id, worldsCB);
  		getQueries.getSeriesWithDoc(fields.series_id, seriesCB);

  		const callback = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					this.closeModal();
  				}
  			}
  		}

  		delete fields["series_name"];

  		updateQueries.updateSeason(season_id, fields, callback);
    }

    delete = (world_id, series_id) => {
    	const { name } = this.state.fields;

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
          				const { season_id } = this.props;

          				if (!season_id) return;

          				const callback = (error, result) => {
          					if (error) {
          						console.log(error);
          					}
          				}

          				this.updateWordCount(season_id);
                        this.props.removeFromView(season_id, this.props.notHis);
          				deleteQueries.removeSeason(season_id, callback);
		       		}
		    	}
      		]
    	});
  	}

  	updateWordCount = (season_id) => {
  		const seasonWordCB = (error, result) => {
          	if (error) {
          		console.log(error);
          	} else {
          		if (result.status === 1) {
          			const data = result.data;

          			const sCount = data.count;
          			const count_series_id = data.series_id;
          			const count_world_id = data.world_id;

          			getQueries.getSeriesWordCountDoc(count_series_id, (err, res) => {
          				if (err) {
          					console.log(err);
          				} else {
          					if (res.status === 1) {
          						const serData = res;

          						const serCount = data.count;

          						const up = {
          							count: parseInt(serCount) - parseInt(sCount)
          						}

          						updateQueries.updateSeriesWordCount(count_series_id, up, (err,res) => {})
          					}
          				}
          			});

          			getQueries.getWorldWordCountDoc(count_world_id, (err, res) => {
          				if (err) {
          					console.log(err);
          				} else {
          					if (res.status === 1) {
          						const wrdData = res.data;

          						const wrdCount = wrdData.count;

          						const up = {
          							count: parseInt(wrdCount) - parseInt(sCount)
          						}

          						updateQueries.updateWorldWordCount(count_world_id, up, (err,res) => {})
          					}
          				}
          			});
          		}
          	}
        }

  		getQueries.getSeasonWordCountDoc(season_id, seasonWordCB);
  	}

  	setWrapperRef = (key, node) => {
        this.ref[key] = node;
    }

  	handleTextChange = (event) => {
	    const { name, value } = event.target;
	    let { fields } = this.state;

		if (name === "world_id") {
			this.getSeries(value, true);
		}

    	fields[name] = value;

    	this.setState({fields});
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

    handleMouseEnter = name => (event) => {
      this.setState({ isHovering: {[name]: true} })
    }

    handleMouseLeave = name => (event) => {
      this.setState({ isHovering: {[name]: false} })
    }

    renderPopContent() {
        const { world_list, write, notHis, access_world_list } = this.props;
        const { fields, file, progress, series_list, changeSeries } = this.state;

        return (
             <div className="wrld-wrt writer">
                <form className="container myform" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <div>
                        <div className="container_grid">
                            <div className="item_grid1">
                                {
                                    write ?
                                        <Files
                                          className='res_pop'
                                          onChange={this.onFilesChange}
                                          onError={this.onFilesError}
                                          accepts={['image/*']}
                                          maxFileSize={2097152}
                                          minFileSize={0}
                                          clickable
                                        >
                                            <img className="res_pop" alt="World Image" src={fields.img ? fields.img : def} />
                                        </Files> 
                                    : 
                                        <img className="res_pop" alt="World Image" src={fields.img ? fields.img : def} /> 
                                }
                            </div>

                            <div className="item_grid2">
                                <div className='pop-prnt_til'>
                                    <div className='p-ttl cmn-hd-cl'>Title</div>
                                        <input type="text"
                                          disabled={!write}
                                          name="name"
                                          value={fields.name || ""}
                                          onChange={this.handleTextChange}
                                          className="textField mf"
                                          margin="normal"
                                    />
                                </div>

                                <div className='pop-prnt_til'>
                                    <div className='p-ttl cmn-hd-cl'>World</div>

                                    <div className='cmn-drp-grp world-ms-grp'>
                                      <select style={{cursor: "pointer"}}
                                        className='textField mf'
                                        disabled={!write && notHis}
                                        value={fields.world_id || ""}
                                        onChange={this.handleTextChange}
                                        name="world_id"
                                      >                                           
                                          {
                                              world_list.map(([id, wrld]) => {
                                                  return <option key={id} value={id}>{ wrld }</option>
                                              })
                                          }

                                          {
                                              access_world_list && access_world_list.map(([id, wrld]) => {
                                                  return <option key={id} value={id}>{ wrld }</option>
                                              })
                                          }
                                      </select>

                                     <span className="fixed-hov-ob">Move to Different World</span>
                                    </div>
                                </div>
                                        
                                <div className='pop-prnt_til'>
                                    <div className='p-ttl cmn-hd-cl'>Series</div>
                                        {
                                            !changeSeries ?
                                                <div className='textGroup'>
                                                    <div className='cmn-drp-grp series-ms-grp'>
                                                        <select style={{ cursor: "pointer" }}
                                                        className="textField mf"
                                                        disabled={!write && notHis}
                                                        value={fields.series_id || ""}
                                                        onChange={this.handleTextChange}
                                                        name="series_id"
                                                      >
                                                          {
                                                              series_list.map(([id, series]) => {
                                                                  return <option key={id} value={id}>{ series }</option>
                                                              })
                                                          }
                                                      </select>

                                                      <span className="fixed-hov-ob">Move to Different Series</span>
                                                    </div>
                                                    

                                                    <div className='pen-grp'>
                                                      <div               
                                                      className='edit-ttl' onClick={() => this.setState({ changeSeries: true })}>
                                                        <i className="material-icons pencil">create</i>
                                                      </div>
                                                      <span className="fixed-hov-ob">Edit Series Name</span>
                                                    </div>
                                                    
                                                </div> 
                                            :
                                                <div className='textGroup'>
                                                    <input type="text"
                                                      disabled={!write}
                                                      name="series_name"
                                                      value={fields.series_name || ""}
                                                      onChange={this.handleTextChange}
                                                      onKeyPress={e => {if (e.key === "Enter") this.saveSeries(fields.series_id)}}
                                                      className="textField mf"
                                                      margin="normal"
                                                    />

                                                    <div className='edit-ttl' onClick={() => this.saveSeries(fields.series_id)}>
                                                        <i className="material-icons s-done">done</i>
                                                    </div>
                                                </div>
                                        }   
                                </div>

                                <div className='pop-prnt_til'>
                                    <div className='p-ttl cmn-hd-cl'>Pen Name</div>

                                    <input type="text"
                                      disabled={!write}
                                      name="pen_name"
                                      className="textField mf"
                                      value={fields.pen_name || ""}
                                      onChange={this.handleTextChange}
                                    />
                                </div>

                                <div className='pop-prnt_til'>
                                    <div className='p-ttl cmn-hd-cl'>Created</div>

                                    <input type="text"
                                      disabled
                                      name="author"
                                      className="textField mf"
                                      value={new Date(fields.created_date).toLocaleDateString()}
                                    />
                                </div>
                            </div>
                        </div>
                                
                        <div className='grid_pop'>
                                {/*<div className='pop-prnt bk-acs'>
                                    <div className='p-ttl'>
                                        <div>Book Access & Availability</div>

                                         <div>
                                            <div
                                              name="availability"
                                              className="radio_bn"
                                            >
                                                <label>
                                                    <input type="radio"
                                                      value="private"
                                                      checked={fields.availability === "private"}
                                                    />
                                                    Private
                                                </label>
                                                <label>
                                                    <input type="radio"
                                                      value="single author"
                                                      checked={fields.availability === "single author"}
                                                    />
                                                    Single Author
                                                </label>
                                                <label>
                                                    <input type="radio"
                                                      value="multi-author"
                                                      checked={fields.availability === "single author"}
                                                    />
                                                    Single Author
                                                </label>
                                            </div>
 
                                            {
                                                fields.availability === "multi-author" && (
                                                    <div>
                                                        <FormControlLabel
                                                          control={
                                                            <Switch
                                                              checked=""
                                                              onChange=""
                                                              value=""
                                                            />
                                                          }
                                                          label="Jeremy Schofield"
                                                        />

                                                        <FormControlLabel
                                                          control={
                                                            <Switch
                                                              checked=""
                                                              onChange=""
                                                              value=""
                                                            />
                                                          }
                                                          label="David Mark Brown"
                                                        />

                                                        <FormControlLabel
                                                          control={
                                                            <Switch
                                                              checked=""
                                                              onChange=""
                                                              value=""
                                                            />
                                                          }
                                                          label="Corine Kunz"
                                                        />

                                                        <FormControlLabel
                                                          control={
                                                            <Switch
                                                              checked={true}
                                                              onChange=""
                                                              value=""
                                                            />
                                                          }
                                                          label="Kasey Boles"
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className='p-ttl'>
                                        <div>Desktop Offline Mode</div>
                                        <div>
                                            <Button>Unavailable</Button>
                                        </div>
                                    </div>
                                </div>*/}

                            <div className='pop-prnt'>
                                <div className='p-ttl cmn-hd-cl'>Tagline</div>

                                <textarea ref={(node) => this.setWrapperRef("tagline", node)}
                                  disabled={!write}
                                  name="tagline"
                                  value={fields.tagline || ""}
                                  onChange={this.handleTextChange}
                                  rowsmax="8"
                                  rows="2"
                                  className="textField mf tx"
                                  margin="normal"
                                />
                            </div>

                            <div className='pop-prnt'>
                                <div className='p-ttl cmn-hd-cl'>Summary</div>

                                <textarea ref={(node) => this.setWrapperRef("summary", node)}
                                  disabled={!write}
                                  name="summary"
                                  value={fields.summary || ""}
                                  onChange={this.handleTextChange}
                                  rowsmax="8"
                                  rows="4"
                                  className="textField mf txs"
                                  margin="normal"
                                />
                            </div>
                        </div>
                                
                        <div className="grid_btnss">
                            { 
                                write && (
                                    <div className="grid_btn1">
                                        <button type="submit" className="btns">{progress ? `Saving ${progress}%` : "Save"}</button>
                                    </div>
                                )
                            }
                    
                            <div className="grid_btn2">
                                <button onClick={this.closeModal} className="btns">Cancel</button>
                            </div>
                        </div>

                        { 
                            write && !notHis && (
                                <div className='dlt'>
                                    <div onClick={() => this.delete(fields.world_id, fields.series_id)} className="dlt-lnk">Delete Book</div>
                                </div>
                            )
                        }
                    </div>
                </form>
            </div>
        )
    }

    render() {
        const { open, loading } = this.state;

        return (
            <div className='prnt-write'>
              <div className='dashboard-three-grp'>
                <button 
                className="button img_pop brr" onClick={this.openModal}><img className="img_brr" alt="World Writer" src={Burger}/></button>
                <span className="fixed-hov-ob">Edit book details</span>
              </div>
		          
                <Popup open={open} onClose={this.closeModal} closeOnDocumentClick >
                    <Scrollbars className='cmn-writer-pop' autoHide autoHideDuration={200}>
                        {
                            loading ? (
                                <center className='load-cntr'>
                                    <img src={loadingGF} alt="loading..." />
                                </center>
                            ) : this.renderPopContent()
                        }
                    </Scrollbars>
        	</Popup>
      	</div>
    );
  }
}

export default Writer;