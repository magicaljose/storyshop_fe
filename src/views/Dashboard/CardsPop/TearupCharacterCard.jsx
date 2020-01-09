import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';
import {
  Button, TextField, FormGroup, FormControlLabel,
  Checkbox, FormControl, NativeSelect, Fab
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Files from 'react-files';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import CharUpdateFields from '../UpdateFields/CharUpdateFields';
import SocialCharacterCard from './SocialCharacterCard';
import {dbStorage} from 'config_db/firebase';
import { Scrollbars } from 'react-custom-scrollbars';
import CharRelation from './Relations/CharRelation';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import dice_1 from 'assets/img/dices/dice-1.png';

import secureStorage from 'secureStorage';

import '@mdi/font/css/materialdesignicons.css';
import '@mdi/font/css/materialdesignicons.css.map';
import '@mdi/font/css/materialdesignicons.min.css';
import '@mdi/font/css/materialdesignicons.min.css.map';

import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import setQueries from 'queries/setQueries';
import updateQueries from 'queries/updateQueries';
import deleteQueries from 'queries/deleteQueries';

import worldBuilders from 'views/worldBuilders.js';
import loadSpin from 'assets/img/icons/loadSpin.gif';

import queryString from 'query-string';

const delete_img = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iIzQ1YmNjNCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

const liteFields = [
	"Picture", "Relationships", "DNA", "Appearances"
];

const relationshipWhiteList = [
	"character", "galaxy", "system", "planet", "continent", "country",
	"region", "state", "city", "district", "specific location", "setting"
];

class TearupCharacterCard extends React.Component {
  	timeout = null
  	dnaTimeout = null

 	state = {
 		charFields: {},
 		writeAccess: true,
	    showLite: false,
		prevFields: {},
	    fields: {},
	    tags: '',
	    desc: '',
	    charVal: '',
	    relType: '',
	    birthD: '',
	    deathD: '',
		imgIndex: 0,
		direction: null,
		rndm: 1,
		rolling: "",
	  	currentSlide: 0,
	  	showSocialChar: true,
	  	cropStartOn: null,
	  	defaultCrop: {
	  		unit: 'px',
	  	 	x: 0,
	     	y: 0,
	      	width: 180,
	      	height: 200,
	  	}
  	}

  	componentDidMount = () => {
  		const mainpg_doc = document.querySelector("#main-pg");
  		mainpg_doc.classList.add("tearup-bldr");

  		const { builder_id } = this.props.match.params;
  		const query = queryString.parse(this.props.location.search);

  		const season_id = query.forbook;
  		const series_id = query.forseries;
  		const world_id = query.forworld;

  		if (!builder_id || !season_id || !series_id || !world_id) {
  			alert("You are at wrong place");
  			return;
  		}

    	let token = secureStorage.getItem("storeToken");

  		if (!token) {
		    localStorage.clear();
		    secureStorage.clear();

    		this.setState({ showLite: true });
    		return;
  		}

  		if (token.account_type === "Lite") {
    		this.setState({ showLite: true });
  		}

  		this.getBuilderCards(world_id);

  		const usDB = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.data.docs.length > 0) {
					let dna_questions = {};

					result.data.forEach(snap => {
						dna_questions[snap.id] = snap.data();
					})
					
					this.setState({ dna_questions })
				}
			}
		}

		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			if (result.data.relationship_list && result.data.relationship_list.length > 0) {
						this.getCardRelationships(builder_id);
					}

					let obj = this.makeCharFields(result.data);

					obj['appearance'] = [];

	    			this.setState({
	    				fields: obj,
	    				prevFields: obj
	    			});
	    		}
	    	}
	    }
				
		getQueries.getDnaQuestions("character_dna", usDB);
		getQueries.getBuilderWithDoc(builder_id, callback);

		this.getBuilderAppearances(builder_id, world_id, season_id);
  	}

  	shouldComponentUpdate = () => {
  		const { builder_id } = this.props.match.params;
  		const query = queryString.parse(this.props.location.search);
  		const season_id = query.forbook;
  		const series_id = query.forseries;
  		const world_id = query.forworld;

  		if (!builder_id || !season_id || !series_id || !world_id) {
  			return false;
  		}

  		return true;
  	}

  	componentDidCatch = (error, info) => {
    	console.log(error, info)
  	}

  	componentDidUpdate = (prevProps, prevState) => {
		if (this.state.fields && this.state.fields.dna && this.state.fields.dna.has && this.state.fields.dna.val &&
			Object.entries(this.state.fields.dna.val).length < 1
		) {
			this.addDNA();
		}
  	}

  	componentWillUnmount = () => {
  		const mainpg_doc = document.querySelector("#main-pg");
  		mainpg_doc.classList.remove("tearup-bldr");

    	if (this.dnaTimeout) {
      		clearTimeout(this.dnaTimeout);
      		this.dnaTimeout = null;
    	}

    	if (this.timeout) {
      		clearTimeout(this.timeout);
      		this.timeout = null;
    	}
  	}

  	getBuilderAppearances = (builder_id, world_id, season_id) => {
  		const callback = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					this.setState(prevState => ({
  						...prevState,
  						fields: {
  							...prevState.fields,
  							appearance: result.data.appearances || []
  						}
  					}))
  				}
  			}
  		}

  		getQueries.getBuilderAppearances(builder_id, season_id, callback);

  		this.getWorldAppearance(builder_id, world_id);
  	}

  	getWorldAppearance = (builder_id, world_id) => {
		const cb = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				result.data.forEach(data => {
					this.setState(prevState => ({
  						...prevState,
  						fields: {
  							...prevState.fields,
  							worldAppearance: {
								...prevState.fields.worldAppearance,
								[data.data().season_id]: {
									appearances: data.data().appearances, 
									season_name: data.data().season_name
								}
							}
  						}
  					}));
				})
			}								
		}

		getQueries.getBuilderAppearancesWithWorld(builder_id, world_id, cb);
	}

  	getBuilderCards = (world_id) => {
  		worldBuilders.map(type => {
  			if (relationshipWhiteList.includes(type.toLowerCase())) {
  				this.getBuilders(type.toLowerCase(), "showInWorlds", world_id);
  			}
	    });
  	}

  	getBuilders = (type, selectedFilter, world_id) => {
  		let whichFields = `${type}Fields`;

	    if (type === "character") {
		    whichFields = "charFields";
	    } else if (type === "specific location") {
	    	whichFields = "locationFields";
	    }

	    const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.data.docs.length > 0) {
	    			let cardFields = {};

					results.data.forEach(snap => {
						let cardKey = snap.id;

						const card_data = snap.data();

						if (card_data.relationship_list) {
							// this.getCardRelationships(cardKey, whichFields, whichInitFields);
						}

						let obj = this.makeCharFields(card_data);

						cardFields[cardKey] = obj;
					});

					this.setState(prevState => ({
						...prevState,
						[whichFields]: cardFields,
					}));
	    		}
	    	}
	    }

	    this.BuilderWithType = realtimeGetQueries.getBuildersWithWorld_id(type, world_id, callback);
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
	    obj["series_id"] = fields.series_id;
	    obj["season_id"] = fields.season_id;
	    obj["world_id"] = fields.world_id;
	    obj["worldAppearance"] = {};

	    return obj;
    }

    getCardRelationships = (builder_id, cb) => {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				results.data.forEach(snap => {
    					const id = snap.id;
    					const rel_data = snap.data();

    					const data = {
    						type: rel_data.type,
    						charId: rel_data.card_1_id,
    						relation: rel_data.relationship_type
    					}

    					this.setState(prevState => ({
    						...prevState,
    						fields: {
    							...prevState.fields,
    							relation: {
    								...prevState.fields.relation,
    								val: {
    									...prevState.fields.relation.val,
    									[id]: data
    								}
    							}
    						}
    					}));
    				});
    			}
    		}
    	}

    	getQueries.getBuilderRelationships(builder_id, callback);
    }

  	handleChange = (event) => {
    	const { name, value } = event.target;

    	this.setState(prevState => ({
      		...prevState,
      		fields: {
        		...prevState.fields,
        		[name]: {
          			...prevState.fields[name],
          			val: value
        		}
      		}
    	}));
  	}

  	handleInputKeyDown = event => {
		const { name, value } = event.target;

		if ( event.keyCode === 188 ) {
	  		event.preventDefault();

	  		if (!value) {
		  		return;
	  		} else if (!value.trim()) {
		  		return;
	  		}

      		this.setState(prevState => ({
				...prevState,
				fields: {
					...prevState.fields,
					[name]: {
			  			...prevState.fields[name],
			  			tags: [...prevState.fields[name].tags, value],
			  			val: ''
					}
		  		}
	  		}));
    	}
  	}

  	removeAliasesItem = (name, index) => {
	  	return() => {
		  	this.setState(prevState => ({
			  	...prevState,
			  	fields: {
				  	...prevState.fields,
				  	[name]: {
					  	...prevState.fields[name],
					  	tags: prevState.fields[name].tags.filter((item, i) => i !== index)
				  	}
			  	}
		  	}))
	  	}
  	}

 	handleRadioChange = which => event => {
	  	const { name, value } = event.target;

	  	this.setState(prevState => ({
		  	...prevState,
		  	fields: {
			  	...prevState.fields,
			  	[which]: {
				  	...prevState.fields[which],
				  	val: {
					  	...prevState.fields[which].val,
					  	[name]: value
				  	}
			  	}
		  	}
	  	}));
  	}

  	handleRelationChange = key => event => {
	  	const { name, value } = event.target;

	  	this.setState(prevState => ({
		  	...prevState,
		  	fields: {
			  	...prevState.fields,
			  	relation: {
				  	...prevState.fields.relation,
				  	val: {
					  	...prevState.fields.relation.val,
					  	[key]: {
						  	...prevState.fields.relation.val[key],
						  	[name]: value
					  	}
				  	}
			  	}
		  	}
	  	}));
  	}

  	handleDnaChange = key => event => {
	 	const { name, value } = event.target;

	  	this.setState(prevState => ({
		  	...prevState,
		  	fields: {
			 	...prevState.fields,
			  	dna: {
				  	...prevState.fields.dna,
				  	val: {
					  	...prevState.fields.dna.val,
					  	[key]: {
						  	...prevState.fields.dna.val[key],
						  	[name]: value
					  	}
				  	}
			  	}
		  	}
	  	}))
  	}

  	addRelation = () => {
	  	const callback = (error, result) => {
	  		if (error) {
	  			console.log(error);
	  		} else {
	  			const relation_key = result.key;

	  			this.setState(prevState => ({
					...prevState,
					fields: {
						...prevState.fields,
						relation: {
							...prevState.fields.relation,
							val: {
								...prevState.fields.relation.val,
								[relation_key]: { type: "character", charId: "", relation: "" }
							}
						}
					}
				}));
	  		}
	  	}

	  	setQueries.getBuilderAutoDoc(callback);
  	}

  	handleUploadChange = event => {
	  	const { name, value } = event.target;

	  	this.setState({[name]: value});
  	}

  	addDNA = () => {
	  	if (!this.state.dna_questions) return;

	  	this.setState({ rolling: "rolling" });

	  	this.dnaTimeout = setTimeout(() => {
		  	this.setState({ rolling: null });
	  	}, 500);

	  	const rndm = Math.floor(Math.random() * 6) + 1;

	  	const que_keys = Object.keys(this.state.dna_questions);
	  	const questions = Object.keys(this.state.fields.dna.val);

	  	let selected_que = "";

	  	if (que_keys.length === questions.length) return;

	  	do {
		  	selected_que = que_keys[Math.floor(Math.random()*que_keys.length)];
	  	} while(questions.includes(selected_que));

	  	let question_obj = this.state.dna_questions[selected_que];

	  	question_obj["answer"] = "";

	  	let check_list = Object.entries(this.state.fields.dna.val);

	  	if (check_list.length > 0) {
		  	let newObj = {};

		  	for (let i = 0; i < check_list.length; i++) {
			  	if (check_list[i][1].answer !== "") {
				  	newObj[check_list[i][0]] = check_list[i][1];
			  	}
		  	}

		  	newObj[selected_que] = question_obj;

		  	this.setState(prevState => ({
			  	...prevState,
			  	rndm,
			  	fields: {
				  	...prevState.fields,
				  	dna: {
					  	...prevState.fields.dna,
					  	val: newObj
				  	}
			  	}
		  	}));

		  	return;
	  	}

	  	this.setState(prevState => ({
		  	...prevState,
		  	rndm,
		  	fields: {
			  	...prevState.fields,
			  	dna: {
				  	...prevState.fields.dna,
				  	val: {
					  	...prevState.fields.dna.val,
					  	[selected_que]: question_obj
				  	}
			  	}
		  	}
	  	}));
  	}

  	onFilesChange = files => {
		let stateFiles = this.state.fields.photo.val;
		const item = files[0];
	
		if (!item) return;

		if (stateFiles.length === 20) {
			alert("Max 20 images");

			return;
		}

		let file = {name: item.name}

		const storage_ref = dbStorage.ref();
    	const image_child = storage_ref.child('builder_images');
    	const image = image_child.child(`${Date.now()}${item.name}`);

		const uploadTask = image.put(item);

    	uploadTask.on('state_changed', (snapshot) => {
	      	let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
	      	this.setState({progress});
		}, (error) => {console.log(error)}, () => {
		  	uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            	file["url"] = downloadURL;

				stateFiles.push(file);

				this.setState(prevState => ({
					...prevState,
					fields: {
						...prevState.fields,
						photo: {
							...prevState.fields.photo,
							val: stateFiles
						}
					}
				}));
         	});
    	});
  	}

  	onFilesError = (error, file) => {
  		alert("Maximum File Size 2 MB");
    	console.log("Error " + error.code);
  	}

  	removeFile = index => {
		let files = this.state.fields.photo.val;

		files.splice(index, 1);

  		let slide = index;

  		if (files.length === index) {
    		slide = index - 1;
 		}

		this.setState(prevState => ({
			...prevState,
    		currentSlide: slide,
			fields: {
				...prevState.fields,
				photo: {
					...prevState.fields.photo,
					val: files
				}
			}
		}));
  	}

  	handleSelect = (selectedIndex, e) => {
    	this.setState({
      		imgIndex: selectedIndex,
      		direction: e.direction
    	});
  	}

  	updateCurrentSlide = (index) => {
    	const { currentSlide } = this.state;

    	if (currentSlide !== index) {
      		this.setState({
        		currentSlide: index,
        		cropStartOn: null
      		});
    	}
  	}

  	enableCardEdit = () => {
  		if (!this.state.writeAccess) return;

  		this.setState({ showSocialChar: false });
  	}

  	// Fields edit
  	handleFieldSave = (type, fields, key) => {
		const callback = (error, result) => {
		    if (error) {
		    	console.log(error);
		    } else {
		    	let newKey = key;

		    	if (!key) {
		    		newKey = result.key;
		    	}

		    	fields.relation.relation_id = result.key;

		    	this.setState(prevState => ({
		    		...prevState,
		    		charFields: {
		    			...prevState.charFields,
		    			[newKey]: fields
		    		},
		    		fields: fields,
		    		openField: false
		    	}));
		    }
		}

		setQueries.getBuilderAutoDoc(callback);
	}

	// Save card fields
	CardSave = (cancel=false) => {
		// Function will create builder fields
		const { fields, prevFields } = this.state;
		let newFields = this.getUpdateCharFields(fields);

		if (cancel) {
			return this.setState({ showSocialChar: true, fields: prevFields });
		}

		const { builder_id } = this.props.match.params;
  		const query = queryString.parse(this.props.location.search);

  		const season_id = query.forbook;
  		const series_id = query.forseries;
  		const world_id = query.forworld;

		newFields["category"] = "character";
		if (!fields.season_id) newFields["season_id"] = season_id;
		if (!fields.series_id) newFields["series_id"] = series_id;
		if (!fields.world_id) newFields["world_id"] = world_id;

		// Handle relationship fields
		this.handleRelationships(builder_id, fields, newFields, "character");

		if (!newFields.name) {
			return;
		} else if (newFields.name && !newFields.name.trim()) {
			return;
		} else if (newFields.dna && Object.entries(newFields.dna)[0] && !Object.entries(newFields.dna)[0][1].answer) {
			delete newFields.dna;
		}

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			}
		}

		updateQueries.updateBuilder(builder_id, newFields, callback);
	}

	getUpdateCharFields = (fields) => {
		let charFields = {};

		if (fields.realAliases && fields.realAliases.has === true) charFields['realAliases'] = fields.realAliases.tags;
		if (fields.aliases && fields.aliases.has === true) charFields['aliases'] = fields.aliases.tags;
		if (fields.birth && fields.birth.has === true) charFields['birth'] = fields.birth.val;
		if (fields.death && fields.death.has === true) charFields['death'] = fields.death.val;
		if (fields.description && fields.description.has === true) charFields['description'] = fields.description.val;
		if (fields.marital && fields.marital.has === true) charFields['marital'] = fields.marital.val;
		if (fields.name && fields.name.has === true) charFields['name'] = fields.name.val;
		if (fields.photo && fields.photo.has === true) charFields['photo'] = fields.photo.val;
		if (fields.alignment && fields.alignment.has === true) charFields['alignment'] = fields.alignment.val;
		if (fields.gender && fields.gender.has === true) charFields['gender'] = fields.gender.val;
		if (fields.thnicity && fields.thnicity.has === true) charFields['thnicity'] = fields.thnicity.val;
		if (fields.start && fields.start.has === true) charFields['start'] = fields.start.val;
		if (fields.end && fields.end.has === true) charFields['end'] = fields.end.val;
		if (fields.working_notes && fields.working_notes.has === true) charFields['working_notes'] = fields.working_notes.val;
		if (fields.personality && fields.personality.has === true) charFields['personality'] = fields.personality.val;
		if (fields.habits && fields.habits.has === true) charFields['habits'] = fields.habits.val;
		if (fields.orientation && fields.orientation.has === true) charFields['orientation'] = fields.orientation.val;
		if (fields.internal_conflicts && fields.internal_conflicts.has === true) charFields['internal_conflicts'] = fields.internal_conflicts.val;
		if (fields.external_conflicts && fields.external_conflicts.has === true) charFields['external_conflicts'] = fields.external_conflicts.val;
		if (fields.physical_description && fields.physical_description.has === true) charFields['physical_description'] = fields.physical_description.val;
		if (fields.availability && fields.availability.has === true) charFields['availability'] = fields.availability.val;
		if (fields.occupation && fields.occupation.has === true) charFields['occupation'] = fields.occupation.val;
		if (fields.background && fields.background.has === true) charFields['background'] = fields.background.val;
		if (fields.ethnicity && fields.ethnicity.has === true) charFields['ethnicity'] = fields.ethnicity.val;

		if (fields.relation && fields.relation.has === true) {
			charFields['relationship_list'] = Object.keys(fields.relation.val);
		}

		if (fields.dna && fields.dna.has === true) {
			charFields['dna'] = fields.dna.val;
		}

		if (fields.cardAvatar) charFields["cardAvatar"] = fields.cardAvatar;

		return charFields;
	}

	handleRelationships = (builder_id, fields, newFields, inverseType) => {
		// Handle Relationships of card
		if (newFields.relationship_list !== undefined) {
			const user_id = localStorage.getItem("storyShop_uid");

			// Relationships in object (View part)
			const relations_obj = fields.relation.val;

			// Loop on every relationships of card
			Object.entries(relations_obj).map( ([relActKey, value], index) => {
				// relActKey relationship key;
				// value => object of charId, relation, type
				if (value.type && value.charId && value.relation) {
					// Relationship with which card (inverse card type)
					const relActType = value.type || "";
					// Relationship card id (inverse card id)
					let relActType_id = value.charId || "";
					// Relationship id => child of, parent of etc.
					const relAct_relation = value.relation || "";

					const card2CB = (error, result) => {
						if (error) {
							console.log(error);
						} else {
							let data = {
								type: relActType,
								last_modified_user_id: user_id,
								card_1_id: relActType_id,
								card_2_id: builder_id,
								relationship_type: relAct_relation
							}

							const callback = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							if (result.status === 1) {
								const oldRelation = result.data;

								if (oldRelation.card_1_id !== data.card_1_id) {
									deleteQueries.removeBuilderRelation(oldRelation.card_1_id, relActKey, callback);

									getQueries.getBuilderWithDoc(oldRelation.card_1_id, (err, res) => {
										if (err) {
											console.log(err);
										} else {
											if (res.status === 1) {
												if (res.data.relationship_list) {
													const upateData = {
														relationship_list: res.data.relationship_list.filter(item => item !== relActKey)
													}

													updateQueries.updateBuilder(oldRelation.card_1_id, upateData, (e, r) => {});
												}
											}
										}
									});
								}

								updateQueries.updateRelationBuilder(builder_id, relActKey, data, callback);
							} else {
								data["created_user_id"] = user_id;

								updateQueries.updateRelationBuilder(builder_id, relActKey, data, callback);
							}
						}
					}

					const card1CB = (error, result) => {
						if (error) {
							console.log(error);
						} else {
							// Inverse relationship only for character type
							let inverseRelation = relAct_relation;

							if (relActType.toLowerCase() === "character") {
								if (parseInt(inverseRelation) === 8) {
									inverseRelation = 9;
								} else if (parseInt(inverseRelation) === 9) {
									inverseRelation = 8;
								} else if (parseInt(inverseRelation) === 11) {
									inverseRelation = 12;
								} else if (parseInt(inverseRelation) === 12) {
									inverseRelation = 11;
								} else {
									inverseRelation = inverseRelation;
								}
		 					}

							let data = {
								type: inverseType,
								last_modified_user_id: user_id,
								card_1_id: builder_id,
								card_2_id: relActType_id,
								relationship_type: inverseRelation
							}

							if (result.status === 0) {
								data["created_user_id"] = user_id;
							}

							getQueries.getBuilderWithDoc(relActType_id, (err, res) => {
								if (err) {
									console.log(err);
								} else {
									if (res.status === 1) {
										let relationship_list = res.data.relationship_list || [];

										if (!relationship_list.includes(relActKey)) {
											relationship_list.push(relActKey);

											const upateData = {
												relationship_list: relationship_list
											}

											updateQueries.updateBuilder(relActType_id, upateData, (e, r) => {});
										}
									} else {
										// updateQueries.updateBuilder(relActType_id, {relationship_list: [relActKey]}, (e, r) => {});
									}
								}
							});

							const callback = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							updateQueries.updateRelationBuilder(relActType_id, relActKey, data, callback);
						}
					}

					getQueries.getBuilderRelation(builder_id, relActKey, card2CB);
					getQueries.getBuilderRelation(relActType_id, relActKey, card1CB);
				}
			});
		}
	}

	handleAvatarChange = index => event => {
  		let files = this.state.fields.photo.val;

  		if (!files[index]) return;

  		let cardChanged = files[index];

  		cardChanged["photoIndex"] = index;

  		this.updateBuilder(cardChanged);

  		this.setState(prevState => ({
  			...prevState,
  			fields: {
  				...prevState.fields,
  				cardAvatar: cardChanged
  			}
  		}));
  	}

  	saveCropPart = (index) => {
  		let files = this.state.fields.photo.val;

  		if (!files[index]) return;

  		let cardChanged = JSON.parse(JSON.stringify(files[index]));
		cardChanged["photoIndex"] = index;
		cardChanged["crop"] = this.state.defaultCrop;

  		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				const { downloadURL } = result;

				this.setState({ uploadingAvatar: false });
			  	cardChanged["url"] = downloadURL;

			  	files[index]["url"] = downloadURL;

			  	if (this.state.fields.cardAvatar && this.state.fields.cardAvatar.photoIndex === index) {
			  		this.updateBuilder({ photo: files, cardAvatar: cardChanged });
			  	} else {
			  		this.updateBuilder({ photo: files });
			  	}

		  		this.setState(prevState => ({
		  			...prevState,
		  			cropStartOn: null,
		  			defaultCrop: {
				  		unit: 'px',
				  	 	x: 0,
				     	y: 0,
				      	width: 180,
				      	height: 200,
				  	},
		  			fields: {
		  				...prevState.fields,
		  				cardAvatar: cardChanged
		  			}
		  		}));
			}
		}

		this.setState({ uploadingAvatar: true });

		this.uploadBlob(this.refs.cropper.getCroppedCanvas().toDataURL(), callback);
  	}

  	uploadBlob = (blob, callback) => {
  		const storage_ref = dbStorage.ref();
	    const image_child = storage_ref.child('social_profile');
	    const image = image_child.child(`${Date.now()}`);

		const uploadTask = image.putString(blob, 'data_url');

	    uploadTask.on('state_changed', (snapshot) => {
		}, (error) => {callback(error, null)}, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
			  	callback(null, {downloadURL});
	        });
	    });
  	}

  	updateBuilder = (data) => {
  		const { builder_id } = this.props.match.params;
  		updateQueries.updateBuilder(builder_id, data, () => {});
  	}

  	cropStart = (index) => {
  		this.setState({ cropStartOn: index });
  	}

  	onCropChange = crop => {
  		this.setState({ defaultCrop: crop });
  	}

	openModal = name => (event) => {
		this.setState({ openField: true });
	}

	closeModal = name => (event) => {
		this.setState({ openField: false });
	}

  	render() {
  		const { builder_id } = this.props.match.params;
  		const query = queryString.parse(this.props.location.search);

  		const season_id = query.forbook;
  		const series_id = query.forseries;
  		const world_id = query.forworld;

  		const { 
    		openField, writeAccess, fields, tags, desc, charVal, relType, birthD, deathD, showSocialChar,
			prevFields, progress, imgIndex, direction, rndm, rolling, showLite, defaultCrop, cropStartOn,
			uploadingAvatar
		} = this.state;

		const {
			charFields, galaxyFields, systemFields, planetFields, continentFields, countryFields,
			regionFields, stateFields, cityFields, districtFields, locationFields, settingFields
		} = this.state;

  		const charKey = builder_id;

		if (showSocialChar) {
			return (
				<div className='sng-crd'>
					<SocialCharacterCard
					  fields={fields}
					  charFields={charFields} galaxyFields={galaxyFields}
					  systemFields={systemFields} planetFields={planetFields} continentFields={continentFields} countryFields={countryFields}
					  regionFields={regionFields} stateFields={stateFields} cityFields={cityFields} districtFields={districtFields}
					  locationFields={locationFields} settingFields={settingFields} 
					  enableCardEdit={this.enableCardEdit}
					  disableTearup={true}
					  builder_id={charKey}
					  world_id={world_id}
					  series_id={series_id}
					  season_id={season_id}
					/>
				</div>
			)
		}

    	return (
		  	<div className='main-portal-builder'>
					<div className="main-cards-pop">
						{writeAccess && (
							<CharUpdateFields open={openField}
					            openModal={this.openModal}
					            closeModal={this.closeModal}
								handleFieldSave={this.handleFieldSave}
								data={fields} charKey={charKey} 
							/>
						)}

			          	<div className="prnt-char">
				            <TextField
							  autoFocus
							  required
							  disabled={!writeAccess}
				              name="name"
				              className='tag-txt card-txt char-name'
				              value={fields.name ? fields.name.val : ''}
				              onChange={this.handleChange}
							  placeholder="Card Name"
				              fullWidth
				            />
				            <div className='char-title cmn-hd-cl'>Character Card</div>
			          	</div>

			          	{
			          		fields.realAliases && fields.realAliases.has && (
			          			<div className='prnt'>
			            			<div className='ttl cmn-hd-cl'>Tags:</div>
									<TextField
									  disabled={!writeAccess}
									  name="realAliases"
									  className='tag-txt card-txt'
									  value={fields.aliases ? fields.aliases.val : ''}
									  onChange={this.handleChange}
									  onKeyDown={this.handleInputKeyDown}
									  placeholder="Separate each with a comma"
									  fullWidth
						  			/>
										<div className='tags-sec'>
											<ul>
												{fields.aliases && fields.aliases.tags.map((item, index) =>
													<li key={index} onClick={this.removeAliasesItem("realAliases", index)}>
														{item}
														<span>X</span>
													</li>
												)}
											</ul>
										</div>
			          			</div>
			          		)
			          	}	

			          	{
			          		fields.aliases && fields.aliases.has && (
			          			<div className='prnt'>
			            			<div className='ttl cmn-hd-cl'>Tags:</div>
									<TextField
									  disabled={!writeAccess}
									  name="aliases"
									  className='tag-txt card-txt'
									  value={fields.aliases ? fields.aliases.val : ''}
									  onChange={this.handleChange}
									  onKeyDown={this.handleInputKeyDown}
									  placeholder="Separate each with a comma"
									  fullWidth
						  			/>
										<div className='tags-sec'>
											<ul>
												{fields.aliases && fields.aliases.tags.map((item, index) =>
													<li key={index} onClick={this.removeAliasesItem("aliases", index)}>
														{item}
														<span>X</span>
													</li>
												)}
											</ul>
										</div>
			          			</div>
			          		)
			          	}

					    {
					    	fields.photo && fields.photo.has && (
					    		<div className='prnt'>
			            			<div className='ttl cmn-hd-cl ext-fr-ig'>Photo:
			            				{
						            		(writeAccess && !showLite) && (<Files
						        				className='tag-txt card-txt'
						        				onChange={this.onFilesChange}
						        				onError={this.onFilesError}
						        				accepts={['image/*']}
						        				maxFiles={20}
						        				maxFileSize={2097152}
						        				minFileSize={0}
						        				multiple={false}
						        			  >
						        				<Fab color="primary" aria-label="Add"><AddIcon /></Fab>
						        			</Files>)
						            	}
			            			</div>
			            
			            			{
			              				(writeAccess && !showLite) ?  (
			              					<div>

			                					{
			              							fields.photo.val.length > 0 && (
										                <Carousel
										                  infiniteLoop
										                  activeIndex={imgIndex}
										          		  direction={direction} showThumbs={false}
										          		  onSelect={this.handleSelect}
										                  selectedItem={this.state.currentSlide}
										                  onChange={this.updateCurrentSlide} >
			          										{
									          					fields.photo.val.map((file, index) => (
									          						<div className='cmn-crs' key={index}>
									          							{
									          								cropStartOn === index ? (
									          									<Cropper
																			        ref='cropper'
																			        src={file.url}
																			        style={{height: 200, width: '100%', maxWidth: '100%'}}
																			        // Cropper.js options
																			        background={false}
																			        movable={false}
																			        rotatable={false}
																			        zoomable={false}
																			        zoomOnTouch={false}
																			        zoomOnWheel={false}
																			        guides={false}
																			        viewMode={1}
																			        minCropBoxWidth={90}
																			        minCropBoxHeight={100}
																			    />
									          								) : (
									          									<img className='crs-img' width={"100%"} height={200} alt="400x200" src={file.url} />
									          								)
									          							}
									          							<div className='sml-crss'>
									          								{
									          									fields.cardAvatar && fields.cardAvatar.photoIndex === index && 
									          									cropStartOn !== null && cropStartOn === index && (
									          										<button className='crp-sve' onClick={() => this.saveCropPart(index)}>
									          											Save { uploadingAvatar && (<span><img src={loadSpin} alt="loading" /></span>)}
									          										</button>
									          									)
									          								}

									          								{
									          									fields.cardAvatar && fields.cardAvatar.photoIndex === index && (
									          										<button className='crp-btn' onClick={() => this.cropStart(index)}>
											          									<i className="fa fa-crop"></i>
											          								</button>
									          									)
									          								}

									          								<input className='chk-bxx' type='checkbox' 
									          								  name="cardAvatar" checked={fields.cardAvatar ? fields.cardAvatar.photoIndex === index : false} 
									          								  onChange={this.handleAvatarChange(index)} 
									          								/>

									          								<button className='ddl-btn' onClick={() => this.removeFile(index)}>
										          								<img alt="delete" src={delete_img} />
										          							</button>
									          							</div>
									          						</div>
									          					))
									          				}
			          									</Carousel>
			              							)
			              						}
			        						</div>
			        					) : (
			        						<Carousel
						                	  infiniteLoop
						        			  activeIndex={imgIndex}
						        			  direction={direction} showThumbs={false}
						        			  onSelect={this.handleSelect}
						                	  selectedItem={this.state.currentSlide}
						                	  onChange={this.updateCurrentSlide} >
			        				 			{
						        					fields.photo.val.map((file, index) => (
						        						<div className='cmn-crs' key={index}>
						        							<img className='crs-img' width={"100%"} height={200} alt="400x200" src={file.url} />
						        						</div>
						        					))
			        							}
			        						</Carousel>
			        					)
			            			}
			          			</div>
			          		)
					    }

          				{
          					fields.description && fields.description.has && (
          						<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>General Description:</div>
						            
						            <TextField
									  disabled={!writeAccess}
						              multiline
						              rows="5"
						              name="description"
						              className='desc-txt card-txt'
						              value={fields.description ? fields.description.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						              InputLabelProps={{
						                shrink: true,
						              }}
						            />
						        </div>
						    )
          				}

          				{fields.relation && fields.relation.has && (
							<CharRelation
								fields={fields} writeAccess={(writeAccess || showLite) ? true : false} charFields={charFields} galaxyFields={galaxyFields}
								systemFields={systemFields}	planetFields={planetFields} continentFields={continentFields} countryFields={countryFields}
								regionFields={regionFields} stateFields={stateFields} cityFields={cityFields} districtFields={districtFields}
								locationFields={locationFields} settingFields={settingFields} charKey={charKey}
								addRelation={this.addRelation} handleRelationChange={this.handleRelationChange}
							/>
					 	)}

		  				{
		  					fields.dna && fields.dna.has && (
								<div className='prnt'>
									<div className='ttl dna cmn-hd-cl'>
				  						<span className='cmn-hd-cl'>Character DNA:</span>
				  						{/* writeAccess && (<Button variant="fab" onClick={this.addDNA} color="primary" aria-label="Add"><AddIcon /></Button>) */}

				 	 					{
				 	 						(writeAccess && !showLite) && (
												<div className='click-dna' onClick={this.addDNA}>
													<i className={`${rolling && "mdi-spin "}random-gene mdi mdi-24px mdi-dice-${rndm}`}></i>
												</div>
				  							)
				  						}

				  						{/* writeAccess && (<img src={dice_1} />) */}
									</div>

									{
										Object.entries(fields.dna.val).reverse().map(([key, dna]) => {
											return (
												<div key={key} className='dna-qq rel-prnt'>
													<div className='ttl qq rel-name'>{dna.question}</div>
													<div className='rel-type'>
														<TextField
														  multiline
														  rows="3"
														  disabled={!writeAccess}
														  name="answer"
														  className='tag-txt card-txt'
														  value={dna.answer}
														  onChange={this.handleDnaChange(key)}
														  fullWidth
														  InputLabelProps={{
															shrink: true,
														  }}
														/>
													</div>
												</div>
											)
										})
									}
          						</div>
		  					)
		  				}

						{
							fields.availability && fields.availability.has && (
								<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Availability:</div>
									<RadioGroup
									  	className='tag-txt_t card-txt_t'
										aria-label="Availability"
										name="availability"
										value={fields.availability ? fields.availability.val : ''}
										onChange={this.handleChange}
									>
										<FormControlLabel value="Available" control={<Radio />} label="Available" />
										<FormControlLabel value="Locked" control={<Radio />} label="Locked" />
										<FormControlLabel value="By Request" control={<Radio />} label="By Request" />
									</RadioGroup>
          						</div>
          					)
						}

		  				{
		  					fields.occupation && fields.occupation.has && (
		  						<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Occupation:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="occupation"
						              className='tag-txt card-txt'
						              value={fields.occupation ? fields.occupation.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
					          	</div>
					        )
		  				}

					  	{
					  		fields.external_conflicts && fields.external_conflicts.has && (
					  			<div className='prnt'>
			            			<div className='ttl cmn-hd-cl'>External Conflicts:</div>
			            			<TextField
									  disabled={!writeAccess}
						              name="external_conflicts"
						              className='tag-txt card-txt'
						              value={fields.external_conflicts ? fields.external_conflicts.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			         			</div>
			         		)
					  	}

					  	{
					  		fields.internal_conflicts && fields.internal_conflicts.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Internal Conflicts:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="internal_conflicts"
						              className='tag-txt card-txt'
						              value={fields.internal_conflicts ? fields.internal_conflicts.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.background && fields.background.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Background:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="background"
						              className='tag-txt card-txt'
						              value={fields.background ? fields.background.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.habits && fields.habits.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Habits:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="habits"
						              className='tag-txt card-txt'
						              value={fields.habits ? fields.habits.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.personality && fields.personality.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Personality:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="personality"
						              className='tag-txt card-txt'
						              value={fields.personality ? fields.personality.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.physical_description && fields.physical_description.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Physical Description:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="physical_description"
						              className='tag-txt card-txt'
						              value={fields.physical_description ? fields.physical_description.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.orientation && fields.orientation.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Orientation:</div>
									<RadioGroup
									  	className='tag-txt_t card-txt_t'
										aria-label="Orientation"
										name="orientation"
										value={fields.orientation ? fields.orientation.val : ''}
										onChange={this.handleChange}
									>
										<FormControlLabel value="Straight" control={<Radio />} label="Straight" />
										<FormControlLabel value="Gay" control={<Radio />} label="Gay" />
										<FormControlLabel value="Lesbian" control={<Radio />} label="Lesbian" />
										<FormControlLabel value="Bisexual" control={<Radio />} label="Bisexual" />
										<FormControlLabel value="Demi" control={<Radio />} label="Demi" />
										<FormControlLabel value="Pan" control={<Radio />} label="Pan" />
										<FormControlLabel value="Asexual" control={<Radio />} label="Asexual" />
										<FormControlLabel value="Non-Sexual" control={<Radio />} label="Non-Sexual" />
										<FormControlLabel value="Other" control={<Radio />} label="Other" />
									</RadioGroup>
			          			</div>
			          		)
					  	}

					  	{
					  		fields.working_notes && fields.working_notes.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Working Notes:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="working_notes"
						              className='tag-txt card-txt'
						              value={fields.working_notes ? fields.working_notes.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

					  	{
					  		fields.alignment && fields.alignment.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Alignment:</div>
									<RadioGroup
									className='tag-txt_t card-txt_t'
										aria-label="Good"
										name="goods"
										value={fields.alignment ? fields.alignment.val.goods : ''}
										onChange={this.handleRadioChange("alignment")}
									  >
										<FormControlLabel value="Lawful Good" control={<Radio />} label="Lawful Good" />
										<FormControlLabel value="Neutral Good" control={<Radio />} label="Neutral Good" />
										<FormControlLabel value="Chaotic Good" control={<Radio />} label="Chaotic Good" />
										<FormControlLabel value="Lawful Neutral" control={<Radio />} label="Lawful Neutral" />
										<FormControlLabel value="True Neutral" control={<Radio />} label="True Neutral" />
										<FormControlLabel value="Chaotic Neutral" control={<Radio />} label="Chaotic Neutral" />
										<FormControlLabel value="Lawful Evil" control={<Radio />} label="Lawful Evil" />
										<FormControlLabel value="Neutral Evil" control={<Radio />} label="Neutral Evil" />
										<FormControlLabel value="Chaotic Evil" control={<Radio />} label="Chaotic Evil" />
									 </RadioGroup>
			          			</div>
			          		)
					  	}

					   	{
					   		fields.gender && fields.gender.has && (
					   			<div className='prnt'>
			            			<div className='ttl cmn-hd-cl'>Gender:</div>
									
									<RadioGroup
									  	className='tag-txt_t card-txt_t'
										aria-label="Gender"
										name="gender"
										value={fields.gender ? fields.gender.val : ''}
										onChange={this.handleChange}
									>
										<FormControlLabel value="Male" control={<Radio />} label="Male" />
										<FormControlLabel value="Female" control={<Radio />} label="Female" />
										<FormControlLabel value="Transgender M to F" control={<Radio />} label="Transgender M to F" />
										<FormControlLabel value="Transgender F to M" control={<Radio />} label="Transgender F to M" />
										<FormControlLabel value="Intersex" control={<Radio />} label="Intersex" />
										<FormControlLabel value="Gender Fluid" control={<Radio />} label="Gender Fluid" />
										<FormControlLabel value="Non-Gendered" control={<Radio />} label="Non-Gendered" />
									</RadioGroup>
			          			</div>
			          		)
					   	}

					 	{
					 		fields.ethnicity && fields.ethnicity.has && (
					 			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Ethnicity:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="ethnicity"
						              className='tag-txt card-txt'
						              value={fields.ethnicity ? fields.ethnicity.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					 	}

					  	{
					  		fields.marital && fields.marital.has && (
					  			<div className='prnt'>
						            <div className='ttl cmn-hd-cl'>Marital:</div>
						            <TextField
									  disabled={!writeAccess}
						              name="marital"
						              className='tag-txt card-txt'
						              value={fields.marital ? fields.marital.val : ''}
						              onChange={this.handleChange}
						              fullWidth
						            />
			          			</div>
			          		)
					  	}

			          	<div className='prnt_tt'>
				            {
				            	fields.birth && fields.birth.has && (
				            		<div className='date-ttl'>
						              <span className='cmn-hd-cl'>Birth Date:</span>
						              <TextField
									    disabled={!writeAccess}
						                type="date"
						                className='date-field'
						                name="birth"
						                value={fields.birth ? fields.birth.val : ''}
						                onChange={this.handleChange}
						                InputLabelProps={{
						                  shrink: true,
						                }}
						              />
				            		</div>
				            	)
				            }

				            {
				            	fields.death && fields.death.has && (
				            		<div className='date-ttl'>
							            <span className='cmn-hd-cl'>Death Date:</span>
							            <TextField
											disabled={!writeAccess}
							                type="date"
							                className='date-field'
							                name="death"
							                value={fields.death ? fields.death.val : ''}
							                onChange={this.handleChange}
							                InputLabelProps={{
							                  shrink: true,
							                }}
							              />
				           			 </div>
				           		)
				            }

				            {
				            	(fields.appearance && !showLite) && (
				            		<div className='prnt'>
							            <div className='ttl cmn-hd-cl'>Appearances:</div>

										{
											fields.appearance.map( (appear, index_key) => {
												return (
													<div key={index_key} className='appear'>
													  <div className='app1'>{appear.episode_name}</div>
													  -
													  <div className='app2'>{appear.scene_name}</div>
													</div>
												)
											})
										}
							        </div>
					          	)
				            }
			          	</div>
		    		</div>
		  
		  		<div className='crd-btn sv-cn'>
					{ writeAccess && (
						<Button className="btns" onClick={() => this.CardSave()}>Save</Button>
					) }
			
					<Button className="btns" onClick={() => this.CardSave(true)}>Cancel</Button>
		  		</div>
      		</div>
    	);
  	}
}

export default TearupCharacterCard;
