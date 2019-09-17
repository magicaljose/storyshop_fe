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
import setQueries from 'queries/setQueries';

const delete_img = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iIzQ1YmNjNCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

const liteFields = [
	"Picture", "Relationships", "DNA", "Appearances"
];

class CharCard extends React.Component {
  timeout = null
  dnaTimeout = null

  state = {
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
  }

  componentDidMount = () => {
    const { data } = this.props;
	const prevData = JSON.parse(JSON.stringify(data));

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

    this.setState({fields: data, prevFields: prevData});
  }

  componentDidCatch = (error, info) => {
    console.log(error, info)
  }

  componentDidUpdate = (prevProps, prevState) => {
	  if (prevProps.open !== this.props.open) {
		  if (this.props.open === true) {
		  	this.setState({ showSocialChar: this.props.showSocialChar });

        let token = secureStorage.getItem("storeToken");

        if (!token) {
          localStorage.clear();
          secureStorage.clear();

          this.setState({ showLite: true });
        }

        if (token.account_type === "Lite") {
          this.setState({ showLite: true });
        }

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
				getQueries.getDnaQuestions("character_dna", usDB);

			  const { data } = this.props;
			  const prevData = JSON.parse(JSON.stringify(data));

			  this.setState({ prevFields: prevData, fields: data });
		  } else if (this.props.open === false) {
		  	this.setState({ showSocialChar: this.props.showSocialChar });
        if (this.dnaTimeout) {
          clearTimeout(this.dnaTimeout);
          this.dnaTimeout = null;
        }

        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }

        this.setState({
          prevFields: {}, fields: {},
          imgIndex: 0, currentSlide: 0,
        	direction: null,
        });
      }
	  }

    if (prevProps.data !== this.props.data) {
      const { data } = this.props;
	  const prevData = JSON.parse(JSON.stringify(data));

      this.setState({ prevFields: prevData, fields: data });
    }

	if (this.state.fields && this.state.fields.dna && this.state.fields.dna.has && this.state.fields.dna.val &&
		Object.entries(this.state.fields.dna.val).length < 1
	) {
		if (this.props.open === true) {
			this.addDNA();
		}
	}

	if (prevProps.showSocialChar !== this.props.showSocialChar) {
		this.setState({ showSocialChar: this.props.showSocialChar });
	}
  }

  componentWillUnmount = () => {
    if (this.dnaTimeout) {
      clearTimeout(this.dnaTimeout);
      this.dnaTimeout = null;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
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
	  return () => {
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

	  if (name === "type") {
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
							  [name]: value,
							  ["relation"]: "",
							  ["charId"]: ""
						  }
					  }
				  }
			  }
		  }));

		  return;
	  }

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
	  const { fields } = this.state;
	  const realtions = fields.relation.val;

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
							[relation_key]: { charId: "", relation: "" }
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
        currentSlide: index
      });
    }
  }

  enableCardEdit = () => {
  	if (!this.props.writeAccess) return;

  	this.setState({ showSocialChar: false });
  }

  	render(){
	    const { 
	    	open, openModal, closeModal, openField, handleFieldSave,
	       	data, charKey, charCardSave, writeAccess, world_id, series_id, 
	       	season_id 
	    } = this.props;
    	const { 
    		fields, tags, desc, charVal, relType, birthD, deathD, showSocialChar,
			prevFields, progress, imgIndex, direction, rndm, rolling, showLite 
		} = this.state;

		const {
			charFields, galaxyFields, systemFields, planetFields,
		  	continentFields, countryFields, regionFields, stateFields, cityFields, districtFields,
			locationFields, settingFields
		} = this.props;

		if (showSocialChar) {
			return (
				<Popup className='sp-sc' open={open} onClose={closeModal("openCharCard")} modal closeOnDocumentClick >
					<Scrollbars className='cmn-wb-crd' autoHide autoHideDuration={200} >
						<SocialCharacterCard
						  fields={fields}
						  writeAccess={writeAccess}
						  charFields={charFields} galaxyFields={galaxyFields}
						  systemFields={systemFields} planetFields={planetFields} continentFields={continentFields} countryFields={countryFields}
						  regionFields={regionFields} stateFields={stateFields} cityFields={cityFields} districtFields={districtFields}
						  locationFields={locationFields} settingFields={settingFields} 
						  enableCardEdit={this.enableCardEdit}
						  builder_id={charKey}
						  world_id={world_id}
						  series_id={series_id}
						  season_id={season_id}
						/>
					</Scrollbars>
				</Popup>
			)
		}

    	return (
		  <Popup open={open} onClose={closeModal("openCharCard")} modal closeOnDocumentClick >
		  <Scrollbars className='cmn-wb-crd' autoHide autoHideDuration={200} >
			<div className="main-cards-pop">
		{ writeAccess && (<CharUpdateFields open={openField}
            openModal={openModal}
            closeModal={closeModal}
			handleFieldSave={handleFieldSave}
			data={fields} charKey={charKey} />
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

          {fields.realAliases && fields.realAliases.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Aliases:</div>
			<TextField
			  disabled={!writeAccess}
			  name="realAliases"
			  className='tag-txt card-txt'
			  value={fields.realAliases ? fields.realAliases.val : ''}
			  onChange={this.handleChange}
			  onKeyDown={this.handleInputKeyDown}
			  placeholder="Separate each with a comma"
			  fullWidth
			  />
			<div className='tags-sec'>
				<ul>
					{fields.realAliases && fields.realAliases.tags.map((item, index) =>
						<li key={index} onClick={this.removeAliasesItem("realAliases", index)}>
							{item}
							<span>X</span>
						</li>
					)}
				</ul>
			</div>
            {/*<TextField
			  disabled={!writeAccess}
              name="aliases"
              className='tag-txt card-txt'
              value={fields.aliases ? fields.aliases.val : ''}
              onChange={this.handleChange}
              fullWidth
            />*/}
          </div>)}

          {fields.aliases && fields.aliases.has &&
          (<div className='prnt'>
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
            {/*<TextField
			  disabled={!writeAccess}
              name="aliases"
              className='tag-txt card-txt'
              value={fields.aliases ? fields.aliases.val : ''}
              onChange={this.handleChange}
              fullWidth
            />*/}
          </div>)}

		  {fields.photo && fields.photo.has &&
          (<div className='prnt'>
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
              (writeAccess && !showLite) ?
              (<div>

              {fields.photo.val.length > 0 && (
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
          							<Button className='sml-crss' onClick={() => this.removeFile(index)}>
          								<img alt="delete" src={delete_img} />
          							</Button>
          						</div>
          					))
          				}
          			</Carousel>
              )}
        			</div>) :
              (<Carousel
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
        			</Carousel>)
            }

          </div>)}

          {fields.description && fields.description.has &&
          (<div className='prnt'>
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
          </div>)}

		  {fields.relation && fields.relation.has && (
				<CharRelation
					fields={fields} writeAccess={(writeAccess || showLite) ? true : false} charFields={charFields} galaxyFields={galaxyFields}
					systemFields={systemFields}	planetFields={planetFields} continentFields={continentFields} countryFields={countryFields}
					regionFields={regionFields} stateFields={stateFields} cityFields={cityFields} districtFields={districtFields}
					locationFields={locationFields} settingFields={settingFields} charKey={charKey}
					addRelation={this.addRelation} handleRelationChange={this.handleRelationChange}
				  />
		  )}

		  {fields.dna && fields.dna.has && (
			<div className='prnt'>
				<div className='ttl dna cmn-hd-cl'>
				  <span className='cmn-hd-cl'>Character DNA:</span>
				  {/* writeAccess && (<Button variant="fab" onClick={this.addDNA} color="primary" aria-label="Add"><AddIcon /></Button>) */}

				  {(writeAccess && !showLite) && (
					<div className='click-dna' onClick={this.addDNA}>
						<i className={`${rolling && "mdi-spin "}random-gene mdi mdi-24px mdi-dice-${rndm}`}></i>
					</div>
				  ) }

				  {/* writeAccess && (<img src={dice_1} />) */}
				</div>

				{Object.entries(fields.dna.val).reverse().map(([key, dna]) => {
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
				)})}
          </div>
		  )}

			{fields.availability && fields.availability.has &&
          (<div className='prnt'>
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
          </div>)}
		  {fields.occupation && fields.occupation.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Occupation:</div>
            <TextField
			  disabled={!writeAccess}
              name="occupation"
              className='tag-txt card-txt'
              value={fields.occupation ? fields.occupation.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.external_conflicts && fields.external_conflicts.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>External Conflicts:</div>
            <TextField
			  disabled={!writeAccess}
              name="external_conflicts"
              className='tag-txt card-txt'
              value={fields.external_conflicts ? fields.external_conflicts.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.internal_conflicts && fields.internal_conflicts.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Internal Conflicts:</div>
            <TextField
			  disabled={!writeAccess}
              name="internal_conflicts"
              className='tag-txt card-txt'
              value={fields.internal_conflicts ? fields.internal_conflicts.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.background && fields.background.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Background:</div>
            <TextField
			  disabled={!writeAccess}
              name="background"
              className='tag-txt card-txt'
              value={fields.background ? fields.background.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.habits && fields.habits.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Habits:</div>
            <TextField
			  disabled={!writeAccess}
              name="habits"
              className='tag-txt card-txt'
              value={fields.habits ? fields.habits.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.personality && fields.personality.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Personality:</div>
            <TextField
			  disabled={!writeAccess}
              name="personality"
              className='tag-txt card-txt'
              value={fields.personality ? fields.personality.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.physical_description && fields.physical_description.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Physical Description:</div>
            <TextField
			  disabled={!writeAccess}
              name="physical_description"
              className='tag-txt card-txt'
              value={fields.physical_description ? fields.physical_description.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}
		  {fields.orientation && fields.orientation.has &&
          (<div className='prnt'>
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
          </div>)}

		  {fields.working_notes && fields.working_notes.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Working Notes:</div>
            <TextField
			  disabled={!writeAccess}
              name="working_notes"
              className='tag-txt card-txt'
              value={fields.working_notes ? fields.working_notes.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}

		  {fields.alignment && fields.alignment.has &&
          (<div className='prnt'>
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
          </div>)}

		   {fields.gender && fields.gender.has &&
          (<div className='prnt'>
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
          </div>)}

		  {fields.ethnicity && fields.ethnicity.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Ethnicity:</div>
            <TextField
			  disabled={!writeAccess}
              name="ethnicity"
              className='tag-txt card-txt'
              value={fields.ethnicity ? fields.ethnicity.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}

		  {fields.marital && fields.marital.has &&
          (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Marital:</div>
            <TextField
			  disabled={!writeAccess}
              name="marital"
              className='tag-txt card-txt'
              value={fields.marital ? fields.marital.val : ''}
              onChange={this.handleChange}
              fullWidth
            />
          </div>)}

          <div className='prnt_tt'>
            {fields.birth && fields.birth.has &&
            (<div className='date-ttl'>
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
            </div>)}

            {fields.death && fields.death.has &&
            (<div className='date-ttl'>
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
            </div>)}
          </div>

          {(fields.appearance && !showLite) && (<div className='prnt'>
            <div className='ttl cmn-hd-cl'>Appearances:</div>

			{fields.appearance.map( (appear, index_key) => {
				return (
					<div key={index_key} className='appear'>
					  <div className='app1'>{appear.episode_name}</div>
					  -
					  <div className='app2'>{appear.scene_name}</div>
					</div>
				)
			})}
          </div>)}
		    </div>
		  </Scrollbars>
		  <div className='crd-btn sv-cn'>
			{ writeAccess && (<Button className="btns" onClick={() => charCardSave("character", charKey, fields)}>Save</Button>) }
			<Button className="btns" onClick={() => charCardSave("character", charKey, prevFields, true)}>Cancel</Button>
		  </div>
      </Popup>
    );
  }
}

export default CharCard;
