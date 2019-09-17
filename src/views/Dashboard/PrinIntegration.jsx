import React from 'react';
import Popup from "reactjs-popup";
import { Button } from 'material-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import worldBuilders from '../worldBuilders.js';

import { confirmAlert } from 'react-confirm-alert';
import 'assets/css/react-confirm-alert.css';

import updateQueries from 'queries/updateQueries';
import getQueries from 'queries/getQueries';

import appbaseRef from 'config_db/appbase';

class PrinIntegration extends React.Component{
	state = {
		elementNames: [],
		selectedItem: 0,
		do_for_card: "new_card",
		createItem: [],
		searchList: [],
		selectedAlias: -1
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open) {
				let { elementNames } = this.props;

				this.setState({ elementNames });
			}
		}
	}

	selectBuilder = (item_key) => {
		this.setState({ selectedItem: item_key });
	}

	dorForCard = value => {
		const {searchFromBuilders } = this.props;
		const cmp = searchFromBuilders('');
		//this.setState({searchList: cmp });
		this.setState({ do_for_card: value,searchList: cmp });
	}

	addBuilderToCreate = (item_key) => {
		// Only Single Selection
		this.setState({ createItem: [item_key] });
		return;

		// For Multiple Selections
		let createItem = this.state.createItem;

		if (createItem.includes(item_key)) {
			createItem.splice(createItem.indexOf(item_key), 1);

			this.setState({ createItem });
			return;
		}

		createItem.push(item_key);

		this.setState({ createItem });
	}

	createBuilder = (withAliases) => {
		const {
			elementNames, handleFieldSave, season_id
		} = this.props;
		const {
			createItem, selectedItem, searchList, selectedCard, selectedCardName
		} = this.state;

		const callback = (error, result) => {
		    if (error) {
		        console.log(error);
		    } else {
		    	console.log(result);
		    }
		}

		const name = elementNames[selectedItem];

		if (withAliases) {
			const cb = (error, result) => {
				if (error) {
					console.log(error);
				} else {
					if (result.status === 1) {
						let oldAliases = result.data.realAliases || [];

						oldAliases.push(name);

						const data = {
							realAliases: oldAliases
						}

						appbaseRef.update({
							type: "builders",
							id: selectedCard,
							body: {
								doc: data
							}
						}).then(function(res) {
							console.log("successfully updated: ", res)
						}).catch(function(err) {
							console.log("update document error: ", err)
						})

						updateQueries.updateBuilder(selectedCard, data, callback);
					}
				}
			}

			getQueries.getBuilderWithDoc(selectedCard, cb);
		} else {
			createItem.map(item_key => {
				const category = worldBuilders[item_key];

				handleFieldSave(true, category.toLowerCase(), name, [], callback);
			});
		}

		let ele = elementNames;
		ele.splice(selectedItem, 1);

		this.setState({
			selectedItem: 0,
			createItem: [],
			searchList: [],
			selectedCardName: "",
			selectedCard: "",
			search: ""
		});
	}

	handleSearch = event => {
		const { elementNames, searchFromBuilders } = this.props;
		const { value } = event.target;

		const cmp = searchFromBuilders(value);

		this.setState({ search: value, searchList: cmp });
	}

	selectAlias = (item_key, charName) => {
		this.setState({ selectedCard: item_key, selectedCardName: charName });
	}

	cancelAlias = () => {
		this.setState({ selectedCard: "", selectedCardName: "" });
	}

	showIntroduction = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='react-confirm-alert-body custom-ui editor'>
						<div className='c-grp'>
							<p>Welcome to the World Wizard! It’s a work in progress, but we hope it makes your life more magical.</p>
							<p>The Wizard scans your document for nouns that it doesn’t recognize. Most of them will be proper nouns you want to turn into characters, places, factions, technologies, etc. OR they will be slang words or English words our Wizard just doesn’t recognize yet!</p>
							<p>In the case that it is a proper noun or a word unique to your story, a couple clicks can turn that word into a World Card. The Wizard is here to help you catalogue much of your world in just a few minutes.</p>
							<p>First, choose a word from the list on the left. Then, decide whether you want that to be a primary card (New Card), or an “Alias” for an already existing card. If you know it’s an alias but haven’t made the primary card yet, just skip it!</p>
							<p>If you choose New Card, select the category it belongs to and then click “Create”. Presto! Your card is created and ready for you to add details to later.</p>
							<p>If you choose Alias, search for the card you want to attach it to, select it, and click “Attach”. Now any time that character (place, school, weapon, etc.) is referenced by that name, your World Bar will pick up on it.</p>
							<p>If you want to close the Wizard and come back to it later, you can find a link in the Settings menu in the top right of the Editor.</p>
							<p>Happy World Building!</p>
						</div>
						
						<button className='react-confirm-alert-button-group' onClick={() => onClose()}>OK</button>
					</div>
				)
			}
		});
	}

  	render() {
		const { 
			open, world_id, closeModal, elementNames, realChecks, writeAccess
		} = this.props;

		const {
			selectedItem, do_for_card, createItem, search, searchList, selectedCard, selectedCardName
		} = this.state;

    	return (
			<Popup open={open} className='prin-popup' onClose={() => closeModal()} modal closeOnDocumentClick >
				<div className="lists">
					<div className='right-corner-bx'>
						<div className='cmn-bx info-bx' style={{cursor: 'pointer'}} onClick={() => this.showIntroduction()}>
							<i className="fa fa-info-circle info-icc"></i>
						</div>

						<div className='cmn-bx cls-tn' style={{cursor: 'pointer'}} onClick={() => closeModal()}>
							<i className="fa fa-times close-tb"></i>
						</div>
					</div>
					

		      		<h3 className='prin-hd'>World Builder Card Assistant</h3>
			  		
			  		<div className='prn-sml'>{ elementNames ? elementNames.length : 0 } Items Found</div>
			  		
			  		<div className='prn_intgrt'>			  
			  		  	<Scrollbars className='prn-writer' autoHide autoHideDuration={200}>
					    	<div className='prn_items'>
					  			{
					  				
									elementNames && elementNames.map((item, index) => {
										return (
											<div key={index} className={`prn_scrlitm ${selectedItem === index ? 'active' : ''}`} 
											  onClick={() => this.selectBuilder(index)}>{item}</div>
										)
					  				})
					  			}
					  		</div>
			  			</Scrollbars>
			 
			 			<div className='prn_content'>
			 				<h4 className='cmn-hd-cl'>{elementNames && elementNames[selectedItem]}</h4>
			  
			  				<div className='prn_btn'>
			  					<button className={`prn_crd ${do_for_card === "new_card" ? 'active' : ''}`} 
			  					  onClick={() => this.dorForCard("new_card")}>New Card</button>
			  					<button className={`prn_crd ${do_for_card === "alias" ? 'active' : ''}`} 
			  					  onClick={() => this.dorForCard("alias")}>Alias</button>
			  				</div>

			  				{
			  					do_for_card === "new_card" ? (
			  						<div className='main-ncard'>
			  							<Scrollbars className='prn-wtr' autoHide autoHideDuration={200}>
						  					<div className='prn_wdt'>
						  						{
						  							worldBuilders.map((type, index) => (
						  								<div key={index} className={`prn-st1 ${createItem.includes(index) ? 'active' : ''}`}
						  								  onClick={() => this.addBuilderToCreate(index)}>{type.toLowerCase()}</div>
						  							))
						  						}
						  					</div>
						  				</Scrollbars>

						  				<div className='prncrt-btn'>
						  					{ writeAccess && (
						  						<button className="prn-crt" onClick={() => this.createBuilder()}>Create</button>
						  					)}
						  				</div>
			  						</div>
			  					) : (
			  						<div className='main-alias'>
			  							{
			  								(selectedCard && selectedCardName) ? (
			  									<div className='prn_fnl'>
			  										<div className='prn-info-grp'>
			  											<div className='cmn-gd cmn-itm prn_fnllbl1'>Add</div>
													  	<div className='cmn-gd cmn-itm prn_fnlitm1'>{elementNames && elementNames[selectedItem]}</div>
													  	<div className='cmn-gd cmn-itm prn_fnllbl2'>as an alias for</div>
													  	<div className='cmn-gd cmn-itm prn_fnlitm2'>{selectedCardName}</div>
			  										</div>
								 					
												   	<div className='prn-cnclbtn'>
												   		<button className="prn-cncl" onClick={() => this.cancelAlias()}>Cancel</button>
												   	</div>
								  				</div>
			  								) : (
			  									<div className='ali-sr-grp'>
			  										<div className='prn_srch'>
									  					<input className='prnsrc_inp' type='text' placeholder="search" 
									  					  value={search} onChange={this.handleSearch} />
									  					
									  					<div className="prnsrch_img">
									  						<i className="fa fa-search" aria-hidden="true"></i>
									  					</div>
									  				</div>

									  				<Scrollbars className='prn_alias-scrl' autoHide autoHideDuration={200}>
									  					<div className='prn_alias'>
									  						{
									  							realChecks && Object.keys(realChecks).map(item => {
									  								let whichFields = `${item}Fields`;

														            if (item === "character") {
															            whichFields = "charFields";
														            }

														            return searchList[whichFields] && 
														              Object.entries(searchList[whichFields])
														              .map(([charKey, char], index) => (
														              	<div key={index} className={`prn-als1 ${selectedCard === charKey ? "active" : ""}`} 
																 	  	  onClick={() => this.selectAlias(charKey, char.name.val)}>{char.name.val}</div>
														            ))
									  							})
									  						}
									  					</div>
									  				</Scrollbars>
			  									</div>
			  								)
			  							}
						  
						  				<div className='prncrt-btn'>
						  					{writeAccess && (<button disabled={!selectedCard} 
						  					  className={`prn-alsbtn ${(selectedCard) ? "active" : ""}`}
						  					  onClick={() => this.createBuilder(true)}
						  					>Add</button>) }
						  				</div>
			  						</div>
			  					)
			  				}
			  			</div>
			 		</div>
		   		</div>
      		</Popup>
    	);
  	}
}

export default PrinIntegration;
