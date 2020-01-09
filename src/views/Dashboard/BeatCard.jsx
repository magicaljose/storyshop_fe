import React from 'react';
import Popup from "reactjs-popup";
import { Button, Grid, TextField } from 'material-ui';
import { ItemGrid } from 'components';
import { Scrollbars } from 'react-custom-scrollbars';

import {db} from 'config_db/firebase';

import updateQueries from 'queries/updateQueries';

class BeatCard extends React.Component {
	initFields = {
		name: "",
		summary: "",
		notes: ""
	};
  state = {
    fields: {
		name: "",
		summary: "",
		notes: ""
	},
    open: false,
  };

	componentDidMount = () => {
	  if (this.props.open === true) {
		  const { fields } = this.props;

		  this.setState({ fields });

		  // this.updateSeason();
	  }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.open !== this.props.open) {
			if (this.props.open === true) {
				const { fields } = this.props;

				this.setState({ fields });

				// this.updateSeason();
			} else if (this.props.open === false) {
				this.setState({ fields: this.initFields });
			}
    }
  }

  handleTextChange = (event) => {
    const { name, value } = event.target;
    let { fields } = this.state;

    fields[name] = value;

    this.setState({fields});
  }

  handleSubmit = (event) => {
    event.preventDefault();

	const { type, seasonId, episodeId, sceneId } = this.props;
	const { fields } = this.state;
	const id = fields.key;
	fields.notes = fields.notes ? fields.notes : "";
	fields.summary = fields.summary ? fields.summary : "";

	fields.key = "";

	const ref = db.ref();
	let ref_type = "";

	let updateFields = {};

	const callback = (error, result) => {
		if (error) {
			console.log(error);
		} else {
			const f = JSON.parse(JSON.stringify(fields))
			
			this.props.changeBeatSave(f, type, seasonId, episodeId, sceneId);
		}
	}
	
	updateFields["name"] = fields.name || "";
	updateFields["summary"] = fields.summary || "";
	updateFields["notes"] = fields.notes || "";
	updateFields["update_date"] = new Date().toISOString();
	
	if (type === "season") {
		//ref_type = ref.child(type);
		updateQueries.updateSeason(id, updateFields, callback);
	} else if (type === "episode") {
		//ref_type = ref.child("test_episode").child(seasonId);
		updateQueries.updateEpisode(id, updateFields, callback);
	} else {
		//ref_type = ref.child("test_episode").child(seasonId).child(episodeId).child("scenes");
		updateQueries.updateScene(id, updateFields, callback);
	}

	

	/* const child = ref_type.child(id);

	child.update(updateFields);

	const f = JSON.parse(JSON.stringify(fields))

	this.props.changeBeatSave(f, type, seasonId, episodeId, sceneId); */
  }

  updateSeason = () => {
    const { type, id } = this.props;

	if (!type || !id) return;

	const ref = db.ref();
	const ref_type = ref.child(type);
	const child = ref_type.child(id);

	let name = '', summary = '', notes = "";

	child.once('value', snapshot => {
		const val = snapshot.val();

		if (!val) {
			return;
		}

    let a = '';

		val.name !== undefined ? name = val.name : a = null;
		val.summary !== undefined ? summary = val.summary : a = null;
		val.notes !== undefined ? notes = val.notes : a = null;

		this.setState(prevState => ({
			...prevState,
			fields: {
				...prevState.fields,
				name,
				summary,
				notes
			}
		}));
	});
  }

  render() {
    const { open, closeModal } = this.props;
    const { fields } = this.state;

    return (
      <div className='prnt-write'>
		    <Popup open={open} onClose={closeModal} closeOnDocumentClick >
			<Scrollbars className='cmn-bb-crd'>
			<div className="writer">
		        <form className="container myform" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
		          <Grid container >
			          <ItemGrid xs={12} sm={12} md={12}>

					  <div className='pop-prnt'>
						<div className='p-ttl cmn-hd-cl'>Title</div>

						<TextField
						required
                    name="name"
                    value={fields.name}
                    onChange={this.handleTextChange}
                    className="textField mf"
                    margin="normal"
                  />
					  </div>



				  <div className='pop-prnt'>
						<div className='p-ttl cmn-hd-cl'>Summary</div>

						<TextField
				            name="summary"
                    value={fields.summary || ""}
                    onChange={this.handleTextChange}
				            multiline
				            rowsMax="8"
				            rows="1"
				            className="textField mf txs"
				            margin="normal"
				          />
					  </div>

						  <div className='pop-prnt'>
						<div className='p-ttl cmn-hd-cl'>Notes</div>

						<TextField
				            name="notes"
                    value={fields.notes}
                    onChange={this.handleTextChange}
				            multiline
				            rowsMax="8"
				            rows="2"
				            className="textField mf tx"
				            margin="normal"
				          />
					  </div>



                </ItemGrid>
		            <ItemGrid xs={12} sm={6} md={6}>
						{fields.name && (<Button type="submit" className="btns">Save</Button>)}
		            </ItemGrid>
		            <ItemGrid xs={12} sm={6} md={6}>
		              <Button onClick={closeModal} className="btns">Cancel</Button>
		            </ItemGrid>
              </Grid>
				    </form>
		      </div>
			</Scrollbars>
        </Popup>
      </div>
    );
  }
}

export default BeatCard;
