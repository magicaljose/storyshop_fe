import React from 'react';
import Popup from "reactjs-popup";
import { Button } from 'material-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import { Redirect } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import preenTest from './preenTest.json';

import info_demo from 'assets/img/info-dmo.png';
import info_demo2 from 'assets/img/info-dmo2.png';

import axios from 'axios';
import {
	NODE_API, PREEN_API
} from 'views/constant';

import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar";

import UpgradePop from './UpgradePop';

class ImportProjectPop extends React.Component{
	state = {
		redirectWithSeason: false,
		seasonKey: "",
		totalEpisodes: 0,
		totalScenes: 0,
		scenes: [],
		elementNames: [],
		isChecked:false,
		episodeDedected:0,
		scencesDedected:0,
		fileNames:"", 
		fileTypes:"",
		disabled:true,
		timer:0
	}
	
	/**********************************************
			function used for checkbox
	**********************************************/
	toggleCheckbox = (event) => {
		this.setState({
			isChecked: !this.state.isChecked
		});
	}
	
	/**********************************************
			function used upload file
	**********************************************/
	uploadFile = (event) => {
		let file = event.target.files[0];

        if (!file) return;

        this.setState({
			content_title: "", 
			timer: 0, 
			disabled: true,
			totalScenes: 0,
			elementNames: [],
			content: [{title: "", scenes: []}],
			totalEpisodes: 0,
			scenes: [],
		});

		this.loadingTimmer = setInterval(() => {
			this.setState({timer: this.state.timer+5});
		}, 500);

		let fN = file.name;
		let lastIndex = fN.lastIndexOf(".");
		let fileName = fN.substring(0, lastIndex); 
		let fileType = fN.substring(lastIndex + 1); 

        this.setState({ 
			fileNames: fileName,
			fileTypes: fileType
		});

        if (file) {
          	let data = new FormData();
          	data.append('filetoupload', file);

			let headers = {
				'Accept': '*/*',
				'Content-Type': 'multipart/form-data'
			}
			
			axios.post(`${NODE_API}/auth/upload`, 
				data, {
				headers:headers
			}).then((response)=> {
				//handle success
				console.log(response);
				var path = response.data.url;
				
				axios.post(`${PREEN_API}/preen/getdocdata`, {
					"edict" : {
						"userWords":[
							{
								"text":"hello"
							}
						]
					},
					"path":`http://167.99.23.31:4000/${path}`
				}, {
					headers: {'Content-Type': 'application/json'}
				}).then((response) => {
					const resp_data = response.data;
					
					if (resp_data && !resp_data.errors) {
						let scenes = resp_data.scenes;
						
						let content_title = "";
						let content = [{title: "", scenes: []}];
						
						let start_count = 0;
						
						scenes && scenes.map((scene, index) => {
							let scene_div = document.createElement("div");
							scene_div.innerHTML = scene;
							
							let scene_comments = [];
							
							scene_div.querySelector("div").childNodes.forEach(child => {
								if (child.nodeType === 8) scene_comments.push(child.nodeValue);
							});
							
							if (start_count === 0) {
								content_title = scene_comments[1];
							}

							if (scene_comments.length > 2) {
								if (start_count === 0) {
									content.push({title: scene_comments[2], scenes: []});
								} else {
									content.push({title: scene_comments[1], scenes: []});
								}
							}
							
							start_count++;
							
							content[content.length-1].scenes.push(scene);
						});
						
						let totalEpisodes = content.length;
						
						if (content[0].scenes.length === 0 && totalEpisodes === 1) {
							totalEpisodes = 0;
						}
			
						let elementNames = [];

						if (resp_data.elementNames) {
							elementNames = resp_data.elementNames.trim().split("\n");

							elementNames = elementNames.map(item => item.trim());
						}

						if (resp_data.unknowns) {
							resp_data.unknowns.map(item => {
								elementNames.push(item);
							});
						}

						this.setState({ 
							disabled: false,
							content_title,
							totalScenes: scenes.length || 0, 
							scenes: scenes,
							totalEpisodes,
							content,
							elementNames: elementNames,
							timer: 100
						});
						
						if (this.loadingTimmer) {
							clearInterval(this.loadingTimmer);
							this.loadingTimmer = null;
						}
					} else {
						this.setState({
							timer: 100
						})
						
						if (this.loadingTimmer) {
							clearInterval(this.loadingTimmer);
							this.loadingTimmer = null;
						}
					}
				}).catch((error) => {
					console.log(error);

					this.setState({
						timer: 100
					});
						
					if (this.loadingTimmer) {
						clearInterval(this.loadingTimmer);
						this.loadingTimmer = null;
					}
				});
			}).catch((error) => {
				console.log(error);

				this.setState({
					timer: 100
				});

				if (this.loadingTimmer) {
					clearInterval(this.loadingTimmer);
					this.loadingTimmer = null;
				}
			});
        }
    }
	
	importProject = () => {
		const { world_id, world_op, series_op, series_id, user_name } = this.props;
		let { content, content_title } = this.state;
		
		if (!content) return;

		if (!content_title) content_title = "";

		const created_date = new Date().toISOString();
		const user_id = localStorage.getItem("storyShop_uid");

		if (world_op === "New") {			
			const fields ={ 
				name:content_title || "UNKNOWN", 
				created_date,
				user_id 
			};

			updateQueries.updateWorld(world_id, fields, (err, res) => {});
		}

		if (series_op === "New") {
			const fields = {
				name:content_title || "UNKNOWN", 
				created_date, 
				user_id, 
				world_id 
			};

			updateQueries.updateSeries(series_id, fields, (err, res) => {});
		}
		
		const fields ={
			created_date, world_id, series_id, name:content_title,
			pen_name: user_name, created_by: user_id
		};

		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			const key = result.key;
					
					let epiCount = 0;
					
					content.map(ct => {
						if (ct.scenes.length !== 0) {
							const episodeData = {
								created_date,
								season_id: key,
								update_date: created_date,
								name: ct.title,
								sort: epiCount
							}
							
							const cb = (epiErr, epiRes) => {
								if (epiErr) {
									console.log(epiErr);
								} else {
									if (epiRes.status === 1) {
										const epikey = epiRes.key;
										
										const scenes = ct.scenes;
										
										scenes.map((scene, index) => {
											let sceneData = {
												created_date,
												update_date: created_date,
												sort: index,
												name: "Story",
												story: scene,
												episode_id: epikey
											}
											const scenecb = (scErr, scRes) => {
												if (scErr) {
													console.log(scErr);
												} else {
													if (scRes.status === 1) {
														const scenekey = scRes.key;
														
													}
												}
											}
											setQueries.insertScene(sceneData, scenecb); 
										})
									}
								}
							}
					
							setQueries.insertEpisode(episodeData, cb);
							epiCount++;
						}
					});

	    			setTimeout(() => {
	    				this.setState({ redirectWithSeason: true, seasonKey: key });
	    			}, 1000);
	    		}
	    	}
		}			

		setQueries.insertSeason(fields, callback);
	}

	showIntroduction = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='react-confirm-alert-body custom-ui'>
						<Scrollbars className='c-grp' autoHide autoHideDuration={200}>
							<p>Welcome to the Project Loader! It’s a work in progress, but we hope it makes your life more magical.</p>
							<p>The Loader scans your document for the Title of your story, Chapter Breaks, and Scene Breaks while creating a new project for you. No copy and pasting. No manually inserting dozens of breaks!</p>
							<p>To ensure that your document is imported correctly, there are a few guidelines to follow:
								<ul>
									<li>Center justify your Title.</li>
									<li>Center justify your Chapter Headers.</li>
									<li>Include a “###” between every scene, including between the last scene of one chapter and the first scene of the next chapter (place the “###” AFTER the Chapter Header and BEFORE the first scene).</li>
									<li>The file name should not contain whitespaces</li>
								</ul>
							</p>
							<p>Book Title and your first Chapter should look something like this:</p>
							<p><img src={info_demo} alt="Demo Image" /></p>
							<p>And Chapters after that can look like this:</p>
							<p><img src={info_demo2} alt="Demo Image" /></p>
							<p>It works best with docx files. So try converting to that if the first time through doesn't work. If anything fails you can always delete the project and load again.</p>
							<p>Last but not least is the World Wizard checkbox. Click this box if you'd like to immediately run World Wizard after your book is loaded. It will help you catalogue your World by converting nouns to characters, places, events, technologies, religions, and more!</p>
							<p>Happy Loading!</p>
						</Scrollbars>
						
						<button className='react-confirm-alert-button-group' onClick={() => onClose()}>OK</button>
					</div>
				)
			}
		});
	}

  	render() {
  		const { isChecked, redirectWithSeason, seasonKey, totalScenes, elementNames, disabled } = this.state;
		const { open, world_id, series_id, closeModal, showLite } = this.props;

		if (redirectWithSeason && seasonKey) {
			return <Redirect push to={{
				pathname: `/${world_id}/${series_id}/${seasonKey}`,
				state: { 
					prenIntegration: isChecked, 
					elementNames: elementNames
				}
			}} />;
		}

	    return (
			<Popup className='im-pp' open={open} onClose={closeModal} modal closeOnDocumentClick >
				<div className="lists">
					<div className='right-corner-bx' style={{cursor: 'pointer'}} onClick={() => this.showIntroduction()}>
						<i className="fa fa-info-circle info-icc"></i>
					</div>

			    	<h3>Import Your Project</h3>
				    
			   		<div className="import-lst">
			     		<div className='imprt-upld'>
				 			<input type='file' className='imprt-inpt'
								required
								placeholder="File Name"
								name='filename'
								accept=".docx"
								onChange={this.uploadFile}/>
								<ProgressBar
								percent={this.state.timer}
								filledBackground="linear-gradient(to right, #45bcc4, #2d8d93)"
								/>
								
				  		</div>
						<div className="imprt-error"> {this.state.errors} </div>
			   			<div className="import-pnl">
			      			<div className="import-cont">
			          			<div className="imprt-hd cmn-hd-cl"> Doc Type :</div>
			          			<div className="imprt-hdtxt">{this.state.fileTypes}</div>
				 			</div>
				  
				   			<div className="import-cont">
			          			<div className="imprt-hd cmn-hd-cl"> Chapters Detected :</div>
			          			<div className="imprt-hdtxt">{this.state.totalEpisodes}</div>
				  			</div>
				  
				  			<div className="import-cont">
			          			<div className="imprt-hd cmn-hd-cl"> Title :</div>
			          			<div className="imprt-hdtxt">{this.state.content_title}</div>
				  			</div>
				  
				  			<div className="import-cont">
			          			<div className="imprt-hd cmn-hd-cl"> Scenes Detected :</div>
			          			<div className="imprt-hdtxt">{totalScenes}</div>
				  			</div>
			   			</div>
			   			
			   			<div className="imprt-chk">
			   				<input type='checkbox' disabled={showLite} checked={isChecked} className="imprt-chkbx" onChange={this.toggleCheckbox}/> 
			   				<div className='imp-ch-txt'>World Builder Card Assistant</div> 
			   				{showLite && (<UpgradePop />)}
			   			</div>
			   		</div>
			 	</div>

			   	<button className={`import-btn ${disabled ? "" : "active"}`} disabled={disabled} onClick={() => this.importProject()}>Import</button>
	      	</Popup>
	    );
  	}
}

export default ImportProjectPop;
