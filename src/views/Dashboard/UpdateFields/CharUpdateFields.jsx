import React from 'react';
import Popup from "reactjs-popup";
import AddIcon from '@material-ui/icons/Add';
import { Fab, Button, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';

import UpgradePop from '../UpgradePop';
import secureStorage from 'secureStorage';

const liteFields = [
	"Picture", "Relationships", "DNA", "Appearances"
];

class CharUpdateFields extends React.Component {
  state = {
    showLite: false,
    fields: {
      description: {
        has: true,
        val: ''
      },
      photo: {
        has: true,
        val: []
      },
      realAliases: {
        has: true,
    tags: [],
        val: ''
      },
      aliases: {
        has: true,
		tags: [],
        val: ''
      },
      relation: {
        has: false,
        val: ''
      },
	  dna: {
		has: false,
		val: {}
	  },
      birth: {
        has: false,
        val: ''
      },
      death: {
        has: false,
        val: ''
      },
      marital: {
        has: false,
        val: ''
      },
	  alignment: {
		has: true,
		val: {
			goods: '',
			neutrals: '',
			evils: ''
		}
	  },
	  gender: {
		  has: true,
		  val: ''
	  },
	  ethnicity: {
		  has: true,
		  val: ''
	  },
	  availability: {
		  has: true,
		  val: ''
	  },
	  working_notes: {
		  has: false,
		  val: ''
	  },
	  orientation: {
		  has: false,
		  val: ''
	  },
	  occupation: {
		  has: false,
		  val: ''
	  },
	  external_conflicts: {
		  has: false,
		  val: ''
	  },
	  internal_conflicts: {
		  has: false,
		  val: ''
	  },
	  background: {
		  has: false,
		  val: ''
	  },
	  habits: {
		  has: false,
		  val: ''
	  },
	  personality: {
		  has: false,
		  val: ''
	  },
	  physical_description: {
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
    const { open, openModal, closeModal, handleFieldSave, charKey } = this.props;
    const { fields, showLite } = this.state;

    return (
      <div>
        <Fab className="bt-new-btn lgt-shadow" onClick={openModal("openCharUpdate")} color="primary" aria-label="Add"> <AddIcon />
				<span className="fixed-hov-ob">Add/Remove World Card Fields</span>
				 </Fab>

		    <Popup className='popup-content-t' open={open} onClose={closeModal("openCharUpdate")} modal closeOnDocumentClick >
			<Scrollbars className='cmn-lsts' autoHide autoHideDuration={200}>
				<div className="lists">
            <FormGroup>
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
			   <FormControlLabel
          disabled={showLite}
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.dna ? fields.dna.has : ""}
                    onChange={this.handleChange}
                    value="dna"
                  />
                }
                label={<span>Character DNA {showLite && (<UpgradePop />)} </span>}
				className={`list_lbl${showLite ? " bld-pro" : ""}`}
				labelPlacement="start"
              />
			  <FormControlLabel
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
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.ethnicity ? fields.ethnicity.has : ""}
                    onChange={this.handleChange}
                    value="ethnicity"
                  />
                }
                label="Ethnicity"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.gender ? fields.gender.has : ""}
                    onChange={this.handleChange}
                    value="gender"
                  />
                }
                label="Gender"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.birth ? fields.birth.has : ""}
                    onChange={this.handleChange}
                    value="birth"
                  />
                }
                label="Birth Date"
				className="list_lbl"
				labelPlacement="start"
              />
              <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.death ? fields.death.has : ""}
                    onChange={this.handleChange}
                    value="death"
                  />
                }
                label="Death Date"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
          disabled={showLite}
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
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.occupation ? fields.occupation.has : ""}
                    onChange={this.handleChange}
                    value="occupation"
                  />
                }
                label="Occupation"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.external_conflicts ? fields.external_conflicts.has : ""}
                    onChange={this.handleChange}
                    value="external_conflicts"
                  />
                }
                label="External Conflicts"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.internal_conflicts ? fields.internal_conflicts.has : ""}
                    onChange={this.handleChange}
                    value="internal_conflicts"
                  />
                }
                label="Internal Conflicts"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.background ? fields.background.has : ""}
                    onChange={this.handleChange}
                    value="background"
                  />
                }
                label="Background"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.habits ? fields.habits.has : ""}
                    onChange={this.handleChange}
                    value="habits"
                  />
                }
                label="Habits"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.personality ? fields.personality.has : ""}
                    onChange={this.handleChange}
                    value="personality"
                  />
                }
                label="Personality"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.physical_description ? fields.physical_description.has : ""}
                    onChange={this.handleChange}
                    value="physical_description"
                  />
                }
                label="Physical Description"
				className="list_lbl"
				labelPlacement="start"
              />

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.orientation ? fields.orientation.has : ""}
                    onChange={this.handleChange}
                    value="orientation"
                  />
                }
                label="Orientation"
				className="list_lbl"
				labelPlacement="start"
              />

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

			  <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.alignment ? fields.alignment.has : ""}
                    onChange={this.handleChange}
                    value="alignment"
                  />
                }
                label="Alignment"
				className="list_lbl"
				labelPlacement="start"
              />

              <FormControlLabel
                control={
                  <Checkbox
				  className="list_chck"
                    checked={fields && fields.marital ? fields.marital.has : ""}
                    onChange={this.handleChange}
                    value="marital"
                  />
                }
                label="Marital Status"
				className="list_lbl"
				labelPlacement="start"
              />
            </FormGroup>

		      </div>
			  </Scrollbars>

		      <Button className="btns" onClick={() => handleFieldSave("character", fields, charKey)}>Save</Button>
          <Button className="btns" onClick={closeModal("openCharUpdate")}>Cancel</Button>

        </Popup>
      </div>
    );
  }
}

export default CharUpdateFields;
