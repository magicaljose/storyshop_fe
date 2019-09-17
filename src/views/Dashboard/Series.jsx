import React from 'react';
import Popup from "reactjs-popup";
import { Button } from 'material-ui';
import { Scrollbars } from 'react-custom-scrollbars';
import getQueries from 'queries/getQueries';
import setQueries from 'queries/setQueries';
class Series1 extends React.Component{
	state = {
		open: false,
		season_list: [],
	}
	
	getSeasonList = (world_key) => {
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
									
									let season_list = [[defId, "New"]];
									result.data.forEach((snap) => {
									   season_list.push([snap.id, snap.data().name]);
									})
									this.setState({season_list});
								}
								else
								{
									let season_list = [[defId, "New"]];
									this.setState({season_list});
								}
								
							}
						}
						return getQueries.getSeriesWithWorld_id(world_key, callback);
						
					}
				}
			}
			return setQueries.getSeriesAutoDoc(callbackWordKey);
	}
	
	componentDidUpdate = (prevProps) => {
		if (prevProps.world_key !== this.props.world_key) {
			const { world_key } = this.props;
			
			this.getSeasonList(world_key);
		}
	}
	
	openModal = () => {
		this.setState({open: true});
	}
	closeModal = () => {
		this.setState({open: false});
	}

  render(){
	const { season_list, open } = this.state;
	const { world_op, season_op, handleSelect } = this.props;
	
    return (
	<div className=''>
	<button className="button Seasons" onClick={this.openModal}>{season_op ? season_op : "Series"}</button>
		  <Popup open={open}
          onClose={this.closeModal} modal closeOnDocumentClick >
        <div className="lists">
		      <h3>Select Series</h3>
			  <Scrollbars className='cmn-writer cmn-wrld-slct' autoHide autoHideDuration={200}>
			  <div className='prnt-wrld-slct'>  
			  { 
				 season_list.map(([id, name]) => {
					 return (
					 <div id={id} key={id} className={name === season_op ? 'wrld-slct wrld-act' : 'wrld-slct'} 
						onClick={() => handleSelect(id, name)}>{name}</div>
					 )
				 }) 
			  }
			  </div>
			  </Scrollbars>
		    </div>
			{season_op ? 
			<button className="roll active-lnk" onClick={this.closeModal}>Okay</button> 
			: 
			<button className="roll">Okay</button>
			}
      </Popup>
	</div>
	
    );
  }
}

export default Series1;
