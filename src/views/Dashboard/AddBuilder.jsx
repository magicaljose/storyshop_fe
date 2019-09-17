import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from 'react-router-dom';
import { Fab, Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import UpgradePop from './UpgradePop';
import worldBuilders from '../worldBuilders.js';

import secureStorage from 'secureStorage';

const liteWorldBuilders = [
  "Character", "Setting", "Notes & Reference"
];

class AddBuilder extends React.Component {
  state = {
    user_redirect: false,
    showLite: false,
  }

  componentDidMount = () => {
    let token = secureStorage.getItem("storeToken");
    const account_type = localStorage.getItem("storyShop_account_type");

    if (!token) {
      localStorage.clear();
      secureStorage.clear();

      this.setState({ user_redirect: true });
      return;
    }

    if (token.account_type === "Lite") {
      this.setState({ showLite: true });
    }
  }

  render() {
    const { open, openModal, closeModal, handleFieldSave,
      handleChange, builderChecks, cancelBuilderModal
    } = this.props;

    const { showLite } = this.state;

    if (this.state.user_redirect) {
      return <Redirect to='/login' />
    }

    return (
      <div>
        <Fab className="bt-new-btn" color="primary" aria-label="Add" onClick={openModal}>
          <AddIcon />
        </Fab>

		    <Popup className='rgt-side-fst-pop' open={open} onClose={closeModal} modal closeOnDocumentClick >
			<Scrollbars className='cmn-lsts' autoHide autoHideDuration={200}>
			<div className="lists">
            <FormGroup>
            {
              showLite && liteWorldBuilders.map((type, index) => (
                <FormControlLabel
                  className="wb-fld list_lbl"
        					key={index}
        					control={
        					  <Checkbox
				   className="list_chck"
        						checked={builderChecks[type.toLowerCase()]}
        						onChange={handleChange}
        						value={type.toLowerCase()}
        					  />
        					}
        					label={type.toLowerCase() !== "notes & reference" ? type : "Notes/Reference"}
							labelPlacement="start"
        				  />
              ))
            }

            {
              showLite ? worldBuilders.map((type, index) => {
                if (!liteWorldBuilders.includes(type)) {
                  return (
                  <FormControlLabel
                    className={`wb-fld list_lbl${showLite && !liteWorldBuilders.includes(type) ? " bld-pro" : ""}`}
                    disabled={showLite ? !liteWorldBuilders.includes(type) : false}
          					key={index}
          					control={
          					  <Checkbox
				   className="list_chck"
          						checked={builderChecks[type.toLowerCase()]}
          						onChange={handleChange}
          						value={type.toLowerCase()}
          					  />
          					}
          					label={<span>
                      {type.toLowerCase() !== "notes & reference" ? type : "Notes/Reference"} 
                      {showLite && !liteWorldBuilders.includes(type) && (<UpgradePop />)} 
                      </span>}
							labelPlacement="start"
          				  />
                  )
                }
              }) : worldBuilders.map((type, index) => (
      				<FormControlLabel
                className={`wb-fld list_lbl${showLite && !liteWorldBuilders.includes(type) ? " bld-pro" : ""}`}
                disabled={showLite ? !liteWorldBuilders.includes(type) : false}
      					key={index}
      					control={
      					  <Checkbox
				   className="list_chck"
      						checked={builderChecks[type.toLowerCase()]}
      						onChange={handleChange}
      						value={type.toLowerCase()}
      					  />
      					}
      					label={`${type.toLowerCase() !== "notes & reference" ? type : "Notes/Reference"} ${showLite && !liteWorldBuilders.includes(type) ? "PRO" : ""}`}
							labelPlacement="start"
      				  />
      				))
            }
			  {/*worldBuilders.map((type, index) => (
				<FormControlLabel
          className={`wb-fld${showLite && !liteWorldBuilders.includes(type) ? " bld-pro" : ""}`}
          disabled={showLite ? !liteWorldBuilders.includes(type) : false}
					key={index}
					control={
					  <Checkbox
						checked={builderChecks[type.toLowerCase()]}
						onChange={handleChange}
						value={type.toLowerCase()}
					  />
					}
					label={`${type} ${showLite && !liteWorldBuilders.includes(type) ? "PRO" : ""}`}
				  />
				))*/  }
            </FormGroup>

		      </div>
			</Scrollbars>
		      <Button className="btns" onClick={handleFieldSave}>Save</Button>
          <Button className="btns" onClick={cancelBuilderModal}>Cancel</Button>
        </Popup>
      </div>
    );
  }
}

export default AddBuilder;
