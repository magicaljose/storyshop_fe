import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';
import Avatar from 'react-avatar';

import getRelations from './Relations/getRelations';
import Files from 'react-files';
import fire from 'config_db/firebase';
import upload_background from 'assets/img/icons/back-chnge-dmmy.png';

// Images
import tearup_img from 'assets/img/icons/tearup.png';
import defaultPP from 'assets/img/icons/profile-icon-9-grey.png';

import updateQueries from 'queries/updateQueries';

class SocialCharacterCard extends React.Component {
	state = {
	}

	componentDidMount = () => {
	}

	componentWillUnmount = () => {
	}

	openPortal = () => {
		const { builder_id, world_id, series_id, season_id } = this.props;

		if (!builder_id || !world_id || !series_id || !season_id) return;

		window.open(`http://demodemo.cf:3000/portalbuilder/${builder_id}?forcard=character&forworld=${world_id}&forseries=${series_id}&forbook=${season_id}`, '', 'width=950,height=650,left=200,top=00');
	}

	onImageError = (event) => {
		event.target.src = defaultPP;
	}

	onFilesChange = files => {
		const item = files[0];
		
		if (!item) return

		const storage_ref = fire.storage().ref();
	    const image_child = storage_ref.child('builder_images');
	    const image = image_child.child(`${Date.now()}${item.name}`);

		const uploadTask = image.put(item);

	    uploadTask.on('state_changed', (snapshot) => {
		      let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
		      this.setState({progress});
		}, (error) => {console.log(error)}, () => {
			  uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				const data = {
					ss_background_image: downloadURL
				}

				this.setState({ new_image: downloadURL });

				updateQueries.updateBuilder(this.props.builder_id, data, (e, r) => {});
	         });
	    });
	  }

	  onFilesError = (error, file) => {
	  	alert("Maximum File Size 2 MB");
	    console.log("Error " + error.code);
	  }

	render() {
		const {
			builder_id, fields, enableCardEdit, disableTearup,
			charFields
		} = this.props;

		let backgroundStyles = {
		    "backgroundColor": `#acc7d8`
		}

		if (fields.ss_background_image) {
			backgroundStyles = {
		        "background": `url(${fields.ss_background_image}) no-repeat center`
		    }
		}

		if (this.state.new_image) {
			backgroundStyles = {
		        "background": `url(${this.state.new_image}) no-repeat center`
		    }
		}

		return (
			<div className='sc-profile'>
				<section className='prt-prf' style={backgroundStyles}>					
					<div className='frt-prf'>
						<div className='frt-lyr'>
							<div className='crd-nm'>
								{
									fields && fields.name && fields.name.val
								}
							</div>
							
							<div className='btn-pr'>
								<div style={{cursor: 'pointer'}} className='b1' onClick={() => enableCardEdit()}>
									<i style={{height: '20px', width: '20px'}} className="fas fa-pencil-alt"></i>
								</div>
								
								{
									disableTearup ? (
										<div className='b2'></div>
									) : (
										<div className='b2' onClick={this.openPortal}>
											<img style={{height: '20px', width: '20px'}} src={tearup_img} alt="tearup" />
										</div>
									)
								}
							</div>
						</div>
						
						<div className='prf-crl'>
							{
								fields && fields.photo && fields.photo.has && fields.photo.val && fields.photo.val[0] ? (
									<img className='prf-avtr' style={
										{height: '150px', width: '150px', borderRadius: '150px'}
									} src={
										fields.photo.val && fields.photo.val[0] && fields.photo.val[0].url
									} alt={
										fields.photo.val && fields.photo.val[0] && fields.photo.val[0].name
									} onError={this.onImageError} />
								) : (
									<img className='prf-avtr' style={
										{height: '150px', width: '150px', borderRadius: '150px'}
									} src={defaultPP} alt="Social Profile Picture" />
								)
							}
							
						</div>

						<Files
	        				className='chg-bck'
	        				onChange={this.onFilesChange}
	        				onError={this.onFilesError}
	        				accepts={['image/*']}
	        				maxFiles={20}
	        				maxFileSize={2097152}
	        				minFileSize={0}
	        				multiple={false}
	        			>
	        				<img src={upload_background} alt="Change Background Image" />
        				</Files>
					</div>
				</section>
				
				{/*<Scrollbars autoHide autoHideDuration={200} >*/}
				{/*<Scrollbars className='cmn-wb-crd prt-dtl' style={{height: '280px'}} autoHide autoHideDuration={200} >*/}
					<section className='cmn-sec p1-dt'>	
						{
							fields && fields.gender && fields.gender.has && (
								<div className='cmn-itm itm2'>
									<label className='cmn-clr-sz itm-ttl'>Gender</label>
									<div className='itm-vll'>
										{
											fields.gender.val
										}
									</div>
								</div>
							)
						}

						{
							fields && fields.birth && fields.birth.has && (
								<div className='cmn-itm itm3'>
									<label className='cmn-clr-sz itm-ttl'>Date of Birth</label>
									<div className='itm-vll'>
										{
											fields.birth.val
										}
									</div>
								</div>
							)
						}

						{
							fields && fields.death && fields.death.has && (
								<div className='cmn-itm itm4'>
									<label className='cmn-clr-sz itm-ttl'>Date of Death</label>
									<div className='itm-vll'>
										{
											fields.death.val
										}
									</div>
								</div>
							)
						}

						{
							fields && fields.availability && fields.availability.has && (
								<div className='cmn-itm itm5'>
									<label className='cmn-clr-sz itm-ttl'>Availability</label>
									<div className='itm-vll'>
										{
											fields.availability.val
										}
									</div>
								</div>
							)
						}

						{
							fields && fields.occupation && fields.occupation.has && (
								<div className='cmn-itm itm6'>
									<label className='cmn-clr-sz itm-ttl'>Occupation</label>
									<div className='itm-vll'>
										{
											fields.occupation.val
										}
									</div>
								</div>
							)
						}						

						{
							fields && fields.orientation && fields.orientation.has && (
								<div className='cmn-itm itm7'>
									<label className='cmn-clr-sz itm-ttl'>Orientation</label>
									<div className='itm-vll'>
										{
											fields.orientation.val
										}
									</div>
								</div>
							)
						}						

						{
							fields && fields.ethnicity && fields.ethnicity.has && (
								<div className='cmn-itm itm8'>
									<label className='cmn-clr-sz itm-ttl'>Ethnicity</label>
									<div className='itm-vll'>
										{
											fields.ethnicity.val
										}
									</div>
								</div>
							)
						}

						{
							fields && fields.marital && fields.marital.has && (
								<div className='cmn-itm itm9'>
									<label className='cmn-clr-sz itm-ttl'>Marital</label>
									<div className='itm-vll'>
										{
											fields.marital.val
										}
									</div>
								</div>
							)
						}
					</section>

					<section className='cmn-pdd cmn-sec p2-dt'>
						<div className='cmn-grp'>
							<label className='cmn-clr-sz'>Also Known As</label>

							<div className='itm-vll'>
								{
									fields && fields.realAliases && fields.realAliases.tags.map(alias => `"${alias}" `)
								}	
							</div>
						</div>
					</section>
					
					<section className='cmn-pdd cmn-sec p2-2-dt'>
						<div className='cmn-grp'>
							<label className='cmn-clr-sz'>Tags</label>

							<div className='itm-vll'>
								{
									fields && fields.aliases && fields.aliases.tags.map(alias => `"${alias}" `)
								}	
							</div>
						</div>
					</section>

					{
						fields && fields.description && fields.description.has && (
							<section className='cmn-pdd cmn-sec p3-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>General Description</label>

									<p className='itm-vll'>
										{fields.description.val}
									</p>
								</div>
							</section>
						)
					}

					{
						fields && fields.photo && fields.photo.has && (
							<section className='cmn-pdd cmn-sec p4-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Gallery</label>

									<Scrollbars className='itm-vll' style={{height: '100px'}} autoHide autoHideDuration={200} >
									<div className='itm-scroll'>
										{
											fields.photo.val && fields.photo.val.map(img => (
												<div className='glt-img'>
													<img src={img.url} alt={img.name} />
												</div>
											))
										}
									</div>
									</Scrollbars>
								</div>
							</section>
						)
					}

					{
						fields && fields.dna && fields.dna.has && (
							<section className='cmn-pdd cmn-sec p5-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>DNA</label>

									<div className='dna-grp'>
										{
											Object.entries(fields.dna.val).reverse().map(([key, dna]) => (
												<div className='dna-grp'>
													<p className='f-qq bb'>{dna.question}</p>
													<p className='f-ans itm-vll'>{dna.answer}</p>
												</div>
											))
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.habits && fields.habits.has && (
							<section className='cmn-pdd cmn-sec'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Habits</label>

									<div className='itm-vll'>
										{
											fields.habits.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.personality && fields.personality.has && (
							<section className='cmn-pdd cmn-sec'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Personality</label>

									<div className='itm-vll'>
										{
											fields.personality.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.working_notes && fields.working_notes.has && (
							<section className='cmn-pdd cmn-sec'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Working Notes</label>

									<div className='itm-vll'>
										{
											fields.working_notes.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.physical_description && fields.physical_description.has && (
							<section className='cmn-pdd cmn-sec'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Physical Description</label>

									<div className='itm-vll'>
										{
											fields.physical_description.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.relation && fields.relation.has && (
							<section className='cmn-pdd cmn-sec p6-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Relationships</label>

									<div className='rl-grp'>
										{
											fields.relation.val && Object.entries(fields.relation.val).map(([key, relation]) => {
												let whichFields = `${relation.type.toLowerCase()}Fields`;

												if (relation.type.toLowerCase() === "character") {
													whichFields = "charFields";
												}

												const card1 = this.props[whichFields][relation.charId];
												const card2 = charFields[builder_id];

												if (!card1 || !card2) return;

												const card1_name = card1.name.val;
												const card2_name = card2.name.val;
												const characterRel = getRelations.character[relation.type.toLowerCase()];
												if (!characterRel) return;
												const relation_type = characterRel[relation.relation];

												let splitRelation = "";

												if (relation_type) {
													splitRelation = relation_type.trim().split(" ");
												}

												if (!card1_name || !card2_name) return;

												return (
													<div className='rl-bx'>
														<div className='cmn-prsn prsn1'>
															{
																card1 && card1.photo && card1.photo.has && card1.photo.val && card1.photo.val[0] ? (
																	<img style={{
																		height: '50px', width: '50px', borderRadius: '50px'
																	  }} className='prsn-pp' src={
																		card1.photo.val && card1.photo.val[0] && card1.photo.val[0].url
																	} alt={
																		card1.photo.val && card1.photo.val[0] && card1.photo.val[0].name
																	} onError={this.onImageError} />
																) : (
																	<Avatar size="50px" style={{
																		height: '50px', width: '50px', borderRadius: '50px'
																	  }} className='prf-avtr' 
																	  name={fields && fields.name && fields.name.val} 
																	  round={true} 
																	/>
																)
															}
															<span className='prsn-nm bb'>{card1_name}</span>
														</div>

														<div className='cmn-dtls dtls'>
															<span className='cmn-txt'>is</span>
															<span className='rl-txt'>{splitRelation[0]}</span>
															<span className='cmn-txt'>{splitRelation[1]}</span>
														</div>

														<div className='cmn-prsn prsn2'>
															{
																card2 && card2.photo && card2.photo.has && card2.photo.val && card2.photo.val[0] ? (
																	<img style={{
																		height: '50px', width: '50px', borderRadius: '50px'
																	  }} className='prsn-pp' src={
																		card2.photo.val && card2.photo.val[0] && card2.photo.val[0].url
																	} alt={
																		card2.photo.val && card2.photo.val[0] && card2.photo.val[0].name
																	} onError={this.onImageError} />
																) : (
																	<Avatar size="50px" style={{
																		height: '50px', width: '50px', borderRadius: '50px'
																	  }} className='prf-avtr' 
																	  name={card2 && card2.name && card2.name.val} 
																	  round={true} 
																	/>
																)
															}
															<span className='prsn-nm bb'>{card2_name}</span>
														</div>
													</div>
												)
											})
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.internal_conflicts && fields.internal_conflicts.has && (
							<section className='cmn-pdd cmn-sec p7-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Internal Conflicts</label>

									<div className='itm-vll'>
										{
											fields.internal_conflicts.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.external_conflicts && fields.external_conflicts.has && (
							<section className='cmn-pdd cmn-sec p8-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>External Conflicts</label>

									<div className='itm-vll'>
										{
											fields.external_conflicts.val
										}
									</div>
								</div>
							</section>
						)
					}

					{
						fields && fields.appearance && (
							<section className='cmn-pdd cmn-sec p8-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Appearances</label>

									<div className='itm-vll'>
										{fields.appearance.map( appear => {
											return (
												<div className='appear-br'>
												  <div className='cmn-appr appear-app1'>{appear.episode_name}</div>
												  -
												  <div className='cmn-appr appear-app2'>{appear.scene_name}</div>
												</div>
											)
										})}
									</div>
								</div>
							</section>
						)
					}
				{/*</Scrollbars>*/}
			</div>
		)
	}
}

export default SocialCharacterCard;