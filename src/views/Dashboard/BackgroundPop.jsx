import React from 'react';
import Popup from "reactjs-popup";
import { ChromePicker } from 'react-color';
import {db, dbStorage} from 'config_db/firebase';
import { Scrollbars } from 'react-custom-scrollbars';
import Files from 'react-files';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';
import setQueries from 'queries/setQueries';

class BackgroundPop extends React.Component {
	defaultState = {
		background: "grey",
		background_image: "",
		image_url: "",
		isColorChecked: true,
		isPicChecked: false,
		displayColorPicker: false,
		background_images: {}
	}

	state = {
		background: "grey",
		background_image: "",
		image_url: "",
		isColorChecked: true,
		isPicChecked: false,
		displayColorPicker: false,
		background_images: {}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				const user_id = localStorage.getItem("storyShop_uid");
				const { season_id } = this.props;
				const ref = db.ref();

				this.getBackgroundSettings(ref, user_id, season_id);
				this.getBackgroundDefaultImages(ref);
				this.getUserBackgroundImages(ref, user_id);
			} else {
				this.setState(this.defaultState);
			}	
		}
	}

	getBackgroundSettings = (ref, user_id, season_id) => {
		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			const val = result.data;

					const {
						background_image, background_color, background, image_url
					} = val;

					let isColorChecked = true;
					let isPicChecked = false;

					if (background === "picture") {
						isColorChecked = false;
						isPicChecked = true;
					}

					this.setState({
						background_image: background_image || "",
						background: background_color || this.defaultState.background,
						isColorChecked: isColorChecked,
						isPicChecked: isPicChecked,
						image_url: image_url || ""
					});
	    		}
	    	}
	    }

	    getQueries.getBackgroundSettingWithUserid(season_id, user_id, callback);
	}

	getBackgroundDefaultImages = (ref) => {
		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.data.docs.length > 0) {
					result.data.forEach(snap => {
						
						const key = snap.id;
						const value = snap.data();

						this.setState(prevState => ({
							...prevState,
							background_images: {
								...prevState.background_images,
								[key]: value
							}
						}));
					});
	    		}
			}
	    }

		getQueries.getBackgroundImagesUserid("default", callback);
	}

	getUserBackgroundImages = (ref, user_id) => {
		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.data.docs.length > 0) {
					result.data.forEach(snap => {
						
						const key = snap.id;
						const value = snap.data();

						this.setState(prevState => ({
							...prevState,
							background_images: {
								...prevState.background_images,
								[key]: value
							}
						}));
						
					});
	    			
	    		}
				
	    	}
	    }
		getQueries.getBackgroundImagesUserid(user_id, callback);
	}

	handleChangeComplete = (color) => {
	    this.setState({ background: color.hex });
	};

	changeBackground = (event) => {
		const { name, checked } = event.target;

		if (name === "color") {
			this.setState({
				isColorChecked: true,
				isPicChecked: false
			});
		} else if (name === "picture") {
			this.setState({
				isColorChecked: false,
				isPicChecked: true
			});
		}
	}

	handlePicker = () => {
    	this.setState({ displayColorPicker: !this.state.displayColorPicker })
  	};

  	handleClose = () => {
    	this.setState({ displayColorPicker: false })
  	};

  	selectImage = (key, url) => {
  		this.setState({ background_image: key, image_url: url });
  	}

  	saveBackgroundSettings = () => {
  		const user_id = localStorage.getItem("storyShop_uid");

  		const {
  			background, background_image, isColorChecked, image_url
  		} = this.state;

  		const {
  			season_id, series_id, world_id
  		} = this.props;

  		let data = {
  			user_id: user_id,
  			season_id: season_id,
  			world_id: world_id,
  			series_id: series_id,
  			background_image: background_image,
  			background_color: background,
  			background: isColorChecked ? "color" : "picture",
  			image_url: image_url
  		}

  		if (!isColorChecked && background_image === "") {
  			return alert("No image seleted!");
  		} 

		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		this.props.saveBeatSettings();
	    		this.props.closeModal();
	    	}
	    }

		updateQueries.updateBackgroundSettings(season_id, user_id, data, callback);
  	}

  	onFilesChange = (files) => {
	    let file = files[files.length-1];

	  	if (!file) return;

	  	const file_name = file.name;
	  	const timestemp = new Date().getTime();

	  	const storage_ref = dbStorage.ref();
      	const image_child = storage_ref.child('editor__background_images');
      	const image = image_child.child(`${timestemp}-${file_name}`);

      	const uploadTask = image.put(file);

        uploadTask.on('state_changed', (snapshot) => {

	    }, (error) => {console.log(error)}, () => {
          	uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
	            this.uploadBackgroundImage(file_name, downloadURL);
          	});
        });
  	}

  	uploadBackgroundImage = (name, url) => {
  		const user_id = localStorage.getItem("storyShop_uid");

  		const { season_id, series_id, world_id } = this.props;

  		const data = {
  			user_id: user_id,
  			season_id: season_id,
  			series_id: series_id,
  			world_id: world_id,
  			name: name,
  			url: url
  		}
		
		const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} 
			else
			{
				if (result.status === 1) {
	    			const i_key = result.key;
					this.setState(prevState => ({
						...prevState,
						background_images: {
							...prevState.background_images,
							[i_key]: data
						}
					}));
	    		}
			}
	    }

		setQueries.insertBackgroundImage(data, callback);
  	}

  	onFilesError = (error, file) => {
    	alert("Maximum File Size 2 MB");
  	}

	render() {
		const { background, isColorChecked, isPicChecked, background_image, background_images } = this.state;
		const { open, closeModal, writeAccess } = this.props;

		const popover = {
      		position: 'absolute',
      		zIndex: '2',
    	}
    	const cover = {
      		position: 'fixed',
      		top: '0px',
      		right: '0px',
      		bottom: '0px',
      		left: '0px',
    	}
    	const buttonS = {
    		color: background,
    		backgroundColor: background,
    		height: '12px',
    		width: '12px'
    	}

		return (
			<Popup className="bg-chg" open={open} onClose={() => closeModal()} modal closeOnDocumentClick >
				<div className='main-pr'>
					<div className='bld'>Background</div>

					<div className='mm-pr'>
						<div className='clr'>
							<input type="checkbox" checked={isColorChecked} name="color" onChange={this.changeBackground} />
							Color:
							<button className='bt-stl' style={buttonS} onClick={this.handlePicker}></button>

							{ this.state.displayColorPicker && (<div style={ popover }>
					          	<div style={ cover } onClick={ this.handleClose } />
					          	<ChromePicker color={background}
						     		onChange={this.handleChangeComplete} />
				        	</div>)}
						</div>

						<div className='pic'>
							<div className='ch-bx'>
								<input type="checkbox" checked={isPicChecked} name="picture" onChange={this.changeBackground} />
								Picture:
							</div>

							<Scrollbars className="chs" autoHide
							    autoHideTimeout={800}
							    autoHideDuration={200} >
									<div className="img-grp">
										<div className='add-img'>
											<button className='add-bt'>
												<Files
												  className='btn-im up-img'
												  onChange={this.onFilesChange}
												  onError={this.onFilesError}
												  accepts={['image/*']}
												  maxFileSize={2097152}
												  minFileSize={0}
												  maxFiles={1}
												  clickable 
												>
													<i className="fa fa-plus-circle"></i>
												</Files>
											</button>
										</div>
										{
											Object.entries(background_images).reverse().map(([key, data]) => (
												<div key={key} className='img-btns'>
													<button onClick={() => this.selectImage(key, data.url)}
														className={`btn-im ${(isPicChecked && background_image === key) ? 'active-im' : ''}`}
													>
														<img alt="background image" src={data.url} />
													</button>
												</div>
											))
										}
									</div>
							</Scrollbars>
						</div>
					</div>
				</div>

				<div className='bt-pr'>
					{writeAccess && (<button onClick={() => this.saveBackgroundSettings()}>Save</button>) }
					<button onClick={() => closeModal()}>Cancel</button>
				</div>
			</Popup>
		)
	}
}

export default BackgroundPop;