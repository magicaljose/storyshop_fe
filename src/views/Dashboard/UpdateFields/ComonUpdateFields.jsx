import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';
import { Fab, Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';

import UpgradePop from '../UpgradePop';
import secureStorage from 'secureStorage';

const BlackList = [
	"combat", "cuisine", "currency", "dimension", "economy", "energy",
	"event", "faction", "flora", "governments", "career",
	"magic", "medicine", "metric", "notes & reference", "race", "relic", "religion",
	"school", "species", "technology", "tradition", "vehicle", "weapon", "organization"
];

const liteFields = [
	"Picture", "Relationships", "DNA", "Appearances"
];

class ComonUpdateFields extends React.Component {
  state = {
    fields: {
      name: {
        has: true,
        val: ''
      },
      description: {
        has: false,
        val: ''
      },
      photo: {
        has: false,
        val: []
      },
      realAliases: {
        has: false,
    tags: [],
        val: ''
      },
      aliases: {
        has: false,
		tags: [],
        val: ''
      },
      relation: {
        has: false,
        val: ''
      },
	  dna: {
		  has: false,
		  val: ''
	  },
      start: {
        has: false,
        val: ''
      },
      end: {
        has: false,
        val: ''
      },
	  working_notes: {
        has: false,
        val: ''
      },
      availability: {
        has: false,
        val: ''
      }
    },
  }

  componentDidMount = () => {
    const { data, charKey } = this.props;

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

    if (data && charKey && Object.keys(data).length > 0 ) {
      this.setState({fields: data});
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { data, charKey } = this.props;

    if (data && charKey && Object.keys(data).length > 0 ) {
      if (prevProps.data !== this.props.data) {
				let token = secureStorage.getItem("storeToken");

		    if (!token) {
		      localStorage.clear();
		      secureStorage.clear();

		      this.setState({ showLite: true });
		    }

		    if (token.account_type === "Lite") {
		      this.setState({ showLite: true });
		    }

        this.setState({fields: data});
      }
    }
  }

  handleChange = event => {
    const { checked, value } = event.target;

    this.setState(prevState => ({
      ...prevState,
      fields: {
        ...prevState.fields,
        [value]: {
          ...prevState.fields[value],
          has: checked
        }
      }
    }));
  };

  render(){
    const { open, openModal, closeModal, handleFieldSave, charKey, dnaName } = this.props;
    const { fields, showLite } = this.state;
	const openWhichUpdate = `openComonUpdate`;

    return (
      <div>
        <Fab aria-label="Add" className="bt-new-btn lgt-shadow" onClick={openModal(openWhichUpdate)}><AddIcon />
           <span className="fixed-hov-ob">Add/Remove World Card Fields</span>
				</Fab>

		    <Popup className='popup-content-t' open={open} onClose={closeModal(openWhichUpdate)} modal closeOnDocumentClick >
			<Scrollbars className='cmn-lsts' autoHide autoHideDuration={200}>
				<div className="lists">
		  <FormGroup>
              {/*<FormControlLabel
                control={
                  <Checkbox
                    checked={fields.name.has}
                    onChange={this.handleChange}
                    value="name"
                  />
                }
                label="Name"
			/>*/}
              <FormControlLabel
                control={
                  <Checkbox
           className="list_chck"
                    checked={fields && fields.realAliases ? fields.realAliases.has : ""}
                    onChange={this.handleChange}
                    value="realAliases"
                  />
                }

                label="Aliases"
        className="list_lbl"
        labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Checkbox
				   className="list_chck"
                    checked={fields && fields.aliases ? fields.aliases.has : ""}
                    onChange={this.handleChange}
                    value="aliases"
                  />
                }

                label="Tags"
				className="list_lbl"
				labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.description ? fields.description.has : ""}
                    onChange={this.handleChange}
                    value="description"
                  />
                }
                label="General Description"
				className="list_lbl"
				labelPlacement="start"
              />
			  <FormControlLabel
					disabled={showLite}
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.photo ? fields.photo.has : ""}
                    onChange={this.handleChange}
                    value="photo"
                  />
                }
                label={<span>Picture {showLite && (<UpgradePop />)} </span>}
				className={`list_lbl${showLite ? " bld-pro" : ""}`}
				labelPlacement="start"
              />
              {!BlackList.includes(dnaName.toLowerCase()) && (<FormControlLabel
								disabled={showLite}
				className="list_lbl"
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.relation ? fields.relation.has : ""}
                    onChange={this.handleChange}
                    value="relation"
                  />
                }
                label={<span>Relationships {showLite && (<UpgradePop />)} </span>}
				className={`list_lbl${showLite ? " bld-pro" : ""}`}
				labelPlacement="start"
              />)}
			  {!BlackList.includes(dnaName.toLowerCase()) && (<FormControlLabel
								disabled={showLite}
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.dna ? fields.dna.has : ""}
                    onChange={this.handleChange}
                    value="dna"
                  />
                }
                label={<span>{dnaName} DNA {showLite && (<UpgradePop />)} </span>}
				className={`list_lbl${showLite ? " bld-pro" : ""}`}
				labelPlacement="start"
              />)}
              {!BlackList.includes(dnaName.toLowerCase()) && (<FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.start ? fields.start.has : ""}
                    onChange={this.handleChange}
                    value="start"
                  />
                }
                label="Start Date"
				className="list_lbl"
				labelPlacement="start"
              />)}
              {!BlackList.includes(dnaName.toLowerCase()) && (<FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.end ? fields.end.has : ""}
                    onChange={this.handleChange}
                    value="end"
                  />
                }
                label="End Date"
				className="list_lbl"
				labelPlacement="start"
              />   )}

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.working_notes ? fields.working_notes.has : ""}
                    onChange={this.handleChange}
                    value="working_notes"
                  />
                }
                label="Working Notes"
				className="list_lbl"
				labelPlacement="start"
              />
              {!BlackList.includes(dnaName.toLowerCase()) && (<FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.availability ? fields.availability.has : ""}
                    onChange={this.handleChange}
                    value="availability"
                  />
                }
                label="Availability"
				className="list_lbl"
				labelPlacement="start"
              />)}
            </FormGroup>

		      </div>
			</Scrollbars>

		      <Button className="btns" onClick={() => handleFieldSave(dnaName.toLowerCase(), fields, charKey)}>Save</Button>
          <Button className="btns" onClick={closeModal(openWhichUpdate)}>Cancel</Button>
        </Popup>
      </div>
    );
  }
}

export default ComonUpdateFields;
