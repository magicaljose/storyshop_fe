import React from 'react';
import { Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import Popup from "reactjs-popup";
import { Scrollbars } from 'react-custom-scrollbars';

class SelectPov extends React.Component {
	render() {
		const { open, closeModal, handleChange, savePovFor, charFields, settingFields, fields, povPopData, povFieldsOf } = this.props;

		let listContent = [];

		let noContentMessage = <center className='empty-msg'>There is no content to select!</center>;

		if (povFieldsOf === "pov") {
			if (charFields && Object.entries(charFields).length > 0) {
				Object.entries(charFields).map(([char_id, char_data]) => {
					listContent.push(<FormControlLabel key={char_id}
	                	control={
	                  		<Checkbox
	          					className="list_chck list_chck-pv"
	                    		checked={fields[char_id] || false}
	                    		onChange={handleChange(char_id)}
	                    		value={char_data.name.val}
	                  		/>
	                	}
	                	label={char_data.name.val}
	        			className="list_lbl list_lbl-pv"
	        			labelPlacement="start"
	              	/>)
				})
			}
		} else {
			if (settingFields && Object.entries(settingFields).length > 0) {
				Object.entries(settingFields).map(([char_id, char_data]) => {
					listContent.push(<FormControlLabel key={char_id}
	                	control={
	                  		<Checkbox
	          					className="list_chck list_chck-pv"
	                    		checked={fields[char_id] || false}
	                    		onChange={handleChange(char_id)}
	                    		value={char_data.name.val}
	                  		/>
	                	}
	                	label={char_data.name.val}
	        			className="list_lbl list_lbl-pv"
	        			labelPlacement="start"
	              	/>)
				})
			}
		}

		return (
			<Popup className='pov-list popup-content-t' open={open} onClose={() => closeModal()} modal closeOnDocumentClick >
				{
					listContent.length > 0 ? (
						<Scrollbars className='cmn-lsts cmn-lsts-pv' autoHide autoHideDuration={200}>
							<div className="lists pv-lists">
								<FormGroup>
									{listContent.map(item => (item))}
								</FormGroup>
							</div>					
						</Scrollbars>
					) : (noContentMessage)
				}

				<Button className="btns" onClick={() => savePovFor(povPopData, povFieldsOf)}>Save</Button>
          		<Button className="btns" onClick={() => savePovFor(povPopData, povFieldsOf, true)}>Cancel</Button>
			</Popup>
		)
	}
}

export default SelectPov;