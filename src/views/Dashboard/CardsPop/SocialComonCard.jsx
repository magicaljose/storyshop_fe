import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';
import Avatar from 'react-avatar';

import getRelations from './Relations/getRelations';
import Files from 'react-files';
import {dbStorage} from 'config_db/firebase';

// Images
import tearup_img from 'assets/img/icons/tearup.png';
import defaultPP from 'assets/img/icons/profile-icon-9-grey.png';
import upload_background from 'assets/img/icons/back-chnge-dmmy.png';

import updateQueries from 'queries/updateQueries';

const BlackList = [
	"combat", "cuisine", "currency", "dimension", "economy", "energy",
	"event", "faction", "flora", "governments", "career",
	"magic", "medicine", "metric", "notes & reference", "race", "relic", "religion",
	"school", "species", "technology", "tradition", "vehicle", "weapon"
];

class SocialComonCard extends React.Component {
	state = {
		showAppearances: {}
	}

	componentDidMount = () => {
	}

	componentWillUnmount = () => {
	}

	openPortal = () => {
		if (!this.props.writeAccess) return;
		const { builder_id, world_id, series_id, season_id, whichCard } = this.props;

		if (!builder_id || !world_id || !series_id || !season_id || !whichCard) return;

		window.open(`https://app.storyshop.io/portalbuilder-cards/${builder_id}?forcard=${whichCard}&forworld=${world_id}&forseries=${series_id}&forbook=${season_id}`, '', 'width=950,height=650,left=200,top=00');
	}

	onFilesChange = files => {
		const item = files[0];

		if (!item) return

		const storage_ref = dbStorage.ref();
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

	  toggleAppearance = (season_id) => {
		this.setState(prevState => ({
			...prevState,
			showAppearances: {
				...prevState.showAppearances,
				[season_id]: !prevState.showAppearances[season_id]
			}
		}))
	}

	render() {
		const {
			builder_id, charFields, fields, enableCardEdit, disableTearup, whichCard, writeAccess
		} = this.props;

		const { showAppearances } = this.state;

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
				<section className='frt-lyr'>
					<div className='crd-nm'>
						{
							fields && fields.name && fields.name.val
						}
					</div>

					<div className='btn-pr'>
						<div style={{cursor: 'pointer'}} className='b1' onClick={() => enableCardEdit()}>
							<i style={{height: '20px', width: '20px'}} className="fas fa-pencil-alt"></i>
								<span className="fixed-hov-ob">Edit Card</span>
						</div>

						{
							disableTearup ? (
								<div className='b2'></div>
							) : (
								<div className='b2' onClick={this.openPortal}>
									<img style={{height: '20px', width: '20px'}} src={tearup_img} alt="tearup" />
										<span className="fixed-hov-ob">Pop Out as New Window</span>
								</div>
							)
						}
					</div>
				</section>
				<section className='prt-prf' style={backgroundStyles}>
					<div className='frt-prf'>
						<div className='prf-crl'>
							{
								fields && fields.cardAvatar && fields.cardAvatar ? (
									<img className='prf-avtr' style={
										{height: '150px', width: '150px', borderRadius: '150px'}
									} src={
										fields.cardAvatar.url
									} alt={
										fields.cardAvatar.name
									} onError={this.onImageError} />
								) : (
									<img className='prf-avtr' style={
										{height: '150px', width: '150px', borderRadius: '150px'}
									} src={defaultPP} alt="Social Profile Picture" />
								)
							}

						</div>

						{writeAccess && (<Files
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
									<span className="fixed-hov-ob">Add/Change Background Image</span>
        				</Files>)}

					</div>
				</section>

				{/*<Scrollbars autoHide autoHideDuration={200} >*/}
				{/*<Scrollbars className='cmn-wb-crd prt-dtl' style={{height: '280px'}} autoHide autoHideDuration={200} >*/}
				{
					!BlackList.includes(whichCard) && (
						<section className='cmn-sec p1-dt'>
							{
								fields && fields.start && fields.start.has && (
									<div className='cmn-itm itm3'>
										<label className='cmn-clr-sz itm-ttl'>Start Date</label>
										<div className='itm-vll'>
											{
												fields.start.val
											}
										</div>
									</div>
								)
							}

							{
								fields && fields.end && fields.end.has && (
									<div className='cmn-itm itm4'>
										<label className='cmn-clr-sz itm-ttl'>End Date</label>
										<div className='itm-vll'>
											{
												fields.end.val
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
						</section>
					)
				}

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

								<div className='itm-scroll'>
									{
										fields.photo.val && fields.photo.val.map((img, index_key) => (
											<div key={index_key} className='glt-img'>
												<img src={img.url} alt={img.name} />
											</div>
										))
									}
								</div>
							</div>
						</section>
					)
				}

				{
					!BlackList.includes(whichCard) && fields && fields.dna && fields.dna.has && (
						<section className='cmn-pdd cmn-sec p5-dt'>
							<div className='cmn-grp'>
								<label className='cmn-clr-sz'>DNA</label>

								<div className='dna-grp'>
									{
										Object.entries(fields.dna.val).reverse().map(([key, dna], index_key) => (
											<div key={index_key} className='dna-grp-inn'>
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
					fields && fields.working_notes && fields.working_notes.has && (
						<section className='cmn-pdd cmn-sec p8-dt'>
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
					fields && fields.relation && fields.relation.has && (
						<section className='cmn-pdd cmn-sec p6-dt'>
							<div className='cmn-grp'>
								<label className='cmn-clr-sz'>Relationships</label>

								<div className='rl-grp'>
									{
										fields.relation.val && Object.entries(fields.relation.val).map(([key, relation], index_key) => {
											let whichFields = `${relation.type.toLowerCase()}Fields`;

											if (relation.type.toLowerCase() === "character") {
												whichFields = "charFields";
											}

											const propsWhich1 = this.props[whichFields];
											const propsWhich2 = this.props[`${whichCard.toLowerCase()}Fields`];

											if (!propsWhich1 || !propsWhich2) return;

											const card1 = propsWhich1[relation.charId];
											const card2 = propsWhich2[builder_id];

											if (!card1 || !card2) return;

											const card1_name = card1.name.val;
											const card2_name = card2.name.val;
											const whichCardRel = getRelations[whichCard.toLowerCase()];
											if (!whichCardRel) return;
											const cardCardRel = whichCardRel[relation.type.toLowerCase()];
											if (!cardCardRel) return;
											const relation_type = cardCardRel[relation.relation];

											let splitRelation = "";

											if (relation_type) {
												splitRelation = relation_type.trim().split(" ");
											}

											if (!card1_name || !card2_name) return;

											return (
												<div key={index_key} className='rl-bx'>
													<div className='cmn-prsn prsn1'>
														{
															card2 && card2.cardAvatar ? (
																<img style={{
																	height: '50px', width: '50px', borderRadius: '50px'
																  }} className='prsn-pp' src={
																	card2 && card2.cardAvatar.url
																} alt={
																	card2 && card2.cardAvatar.name
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

													<div className='cmn-dtls dtls'>
														<span className='cmn-txt'>is</span>
														<span className='rl-txt'>{splitRelation[0]}</span>
														<span className='cmn-txt'>{splitRelation[1]}</span>
													</div>

													<div className='cmn-prsn prsn2'>
														{
															card1 && card1.cardAvatar ? (
																<img style={{
																	height: '50px', width: '50px', borderRadius: '50px'
																  }} className='prsn-pp' src={
																	card1 && card1.cardAvatar.url
																} alt={
																	card1 && card1.cardAvatar.name
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
						fields && fields.worldAppearance && (
							<section className='cmn-pdd cmn-sec p8-dt'>
								<div className='cmn-grp'>
									<label className='cmn-clr-sz'>Appearances</label>

									{
										Object.entries(fields.worldAppearance).map(([season_id, data]) => {
											return (
												<div className='main-app-vll'>
													<div className='itm-vll main-ss' onClick={() => this.toggleAppearance(season_id)}>
														<div key={season_id} className={`appear-br ${showAppearances[season_id] ? 'active' : ''}`}>
															<div className='app-nm'>{data.season_name || "Book"}</div>
															<div className='app-lng rnd'>{data.appearances.length}</div>
														</div>
													</div>

													{
														showAppearances[season_id] && (
															<div className='itm-vll appear-itm'>
																{data.appearances.map((appear, index_key) => {
																	return (
																		<div key={index_key} className='appear-br'>
																		  <div className='cmn-appr appear-app1'>{appear.episode_name}</div>
																		  -
																		  <div className='cmn-appr appear-app2'>{appear.scene_name}</div>
																		  -
																		  <div className='cmn-appr appear-app3'>{appear.text}</div>
																		</div>
																	)
																})}
															</div>
														)
													}													
												</div>
											)
										})
									}
								</div>
							</section>
						)
					}
				{/*</Scrollbars>*/}
			</div>
		)
	}
}

export default SocialComonCard;
