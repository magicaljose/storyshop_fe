import React from 'react';
import Popup from "reactjs-popup";
import { Button } from 'material-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import getQueries from 'queries/getQueries';
import setQueries from 'queries/setQueries';

class StoryVerse1 extends React.Component {
	state = {
		open: false,
		world_list: [],
		access_list: [],
	}
	
	componentDidMount = () => {
		this.getWorlds();
		this.getAccessWorlds();
	}
	
	openModal = () => {
		this.setState({open: true});
	}
	closeModal = () => {
		this.setState({open: false});
	}
	
	getWorlds = () => {
		const user_id = localStorage.getItem("storyShop_uid");
			
		const callbackWordKey = (error, results) => {
			if (error) {
	    		console.log(error);
			} else {
				if (results.status === 1) {
					const defId = results.key;
					
					const callback = (error, result) => {
						if (error) {
							console.log(error);
						} else {
							if (result.data.docs.length > 0) {
								let world_list = [[defId, "New"]];
								
								result.data.forEach((snap) => {
									world_list.push([snap.id, snap.data().name]);
								})
								
								this.setState({world_list});
							} else {
								let world_list = [[defId, "New"]];

								this.setState({world_list});
							}
						}
					}
					
					return getQueries.getWorldsWithUser_id(user_id, callback);
				}
			}
		}
		
		return setQueries.getWorldAutoDoc(callbackWordKey);			 
	}
	
	getAccessWorlds = () => {
		const user_id = localStorage.getItem("storyShop_uid");

		const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					let access_list = [];
					
					results.data.forEach((snap) => {
						if (snap.data().write) {
							getQueries.getWorldWithDoc(snap.data().world_id, (err, res) => {
								if (err) {
									console.log(err);
								} else {
									if (res.status === 1) {
										access_list.push([snap.data().world_id, res.data.name]);

										this.setState({ access_list });
									}
								}
							});
						}
					});
				}
			}
		}
		
		return getQueries.getAccessWithUser_id(user_id, callback);
	}

  render(){
	const { world_list, access_list, open } = this.state;
	const { worldKey, world_op, handleSelect } = this.props;
  
    return (
	<div className=''>
	<button className="button Seasons" onClick={this.openModal}>{world_op ? world_op : "Select World"}</button>
		  <Popup open={open}
          onClose={this.closeModal} modal closeOnDocumentClick >
        <div className="lists">
		      <h3>Select World</h3>
			  <Scrollbars className='cmn-writer cmn-wrld-slct' autoHide autoHideDuration={200}>
			  <div className='prnt-wrld-slct'>
			  { 
				 world_list.map(([id, name]) => {
					 return (
					 <div id={id} key={id} className={id === worldKey ? 'wrld-slct wrld-act' : 'wrld-slct'} 
						onClick={() => handleSelect(id, name)}>{name}</div>
					 )
				 }) 
			  }
			  { 
				 access_list.map(([id, name]) => {
					 return (
					 <div id={id} key={id} className={id === worldKey ? 'wrld-slct wrld-act' : 'wrld-slct'} 
						onClick={() => handleSelect(id, name)}>{name}</div>
					 )
				 }) 
			  }
			  </div>
			   
			  </Scrollbars>
		    </div>
			{world_op ? 
			<button className="roll active-lnk" onClick={this.closeModal}>Okay</button> 
			: 
			<button className="roll">Okay</button>
			}
      </Popup>
	</div>
	
    );
  }
}

export default StoryVerse1;
