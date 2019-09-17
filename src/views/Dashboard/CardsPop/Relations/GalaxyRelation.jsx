import React from 'react';
import {
  Fab, TextField, FormGroup, FormControlLabel,
  Checkbox, FormControl, NativeSelect
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

class GalaxyRelation extends React.Component {
	render() {
		const { fields, addRelation, writeAccess, charKey, handleRelationChange } = this.props;
		const { charFields, galaxyFields, systemFields, planetFields,
		  continentFields, countryFields, regionFields, stateFields, cityFields, districtFields,
		  locationFields, settingFields
		} = this.props;

		return (
		  <div className='prnt'>
            <div className='ttl'>
              <span className='cmn-hd-cl'>Relationships:</span>
              { writeAccess && (<Fab onClick={addRelation} color="primary" aria-label="Add"><AddIcon /></Fab>) }
            </div>

			{Object.keys(fields.relation.val).map(key => {
				const relation = fields.relation.val[key];

				return (
				<div key={key} className='rel-prnt'>
					<div className='rel-name'>
						<NativeSelect
							disabled={!writeAccess}
							value={relation.type}
							onChange={handleRelationChange(key)}
							name="type" >
								<option value="">Select Type</option>
								<option value='character'>Character</option>
								<option value='system'>System</option>
								<option value='planet'>Planet</option>
								<option value='setting'>Setting</option>
						</NativeSelect>
					</div>

					{relation.type === "character" && (<div className='rel-type'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.relation}
						  onChange={handleRelationChange(key)}
						  name="relation" >
							<option value="">Select Relation</option>
							<option value='1'>Home to </option>
							<option value='2'>Ruled by </option>
							<option value='3'>Discovered by </option>
							<option value='4'>Destroyed by </option>
							<option value='5'>Owned by </option>
							<option value='6'>Founded by</option>
							<option value='7'>Visited by</option>
							<option value='8'>Historic Home to</option>
							<option value='9'>Birthplace of</option>
							<option value='10'>Prison to</option>
						</NativeSelect>
					</div>) }

					{relation.type === "character" && (<div className='rel-name'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.charId}
						  onChange={handleRelationChange(key)}
						  name="charId" >
								<option value="">Select Character</option>
								{/*<option value="new">New</option>*/}
							{
								Object.keys(charFields).map(id => {
									const val = charFields[id].name.val;

									if (val) {
										return <option key={id} value={id}>{val}</option>;
									}
								})
							}
						</NativeSelect>
					</div>)}

					{relation.type && relation.type !== "character" && (
					<div className='rel-type'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.relation}
						  onChange={handleRelationChange(key)}
						  name="relation" >
							<option value="">Select Relation</option>
							<option value='1'>Contains</option>
						</NativeSelect>
					</div>
					) }

					{relation.type === "system" && (<div className='rel-name'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.charId}
						  onChange={handleRelationChange(key)}
						  name="charId" >
								<option value="">Select System</option>
								{/*<option value="new">New</option>*/}
							{
								Object.keys(systemFields).map(id => {
									const val = systemFields[id].name.val;

									if (val) {
										return <option key={id} value={id}>{val}</option>;
									}
								})
							}
						</NativeSelect>
					</div>)}

					{relation.type === "planet" && (<div className='rel-name'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.charId}
						  onChange={handleRelationChange(key)}
						  name="charId" >
								<option value="">Select Planet</option>
								{/*<option value="new">New</option>*/}
							{
								Object.keys(planetFields).map(id => {
									const val = planetFields[id].name.val;

									if (val) {
										return <option key={id} value={id}>{val}</option>;
									}
								})
							}
						</NativeSelect>
					</div>)}

					{relation.type === "setting" && (<div className='rel-name'>
						<NativeSelect
						  disabled={!writeAccess}
						  value={relation.charId}
						  onChange={handleRelationChange(key)}
						  name="charId" >
								<option value="">Select Setting</option>
								{/*<option value="new">New</option>*/}
							{
								Object.keys(settingFields).map(id => {
									const val = settingFields[id].name.val;

									if (val) {
										return <option key={id} value={id}>{val}</option>;
									}
								})
							}
						</NativeSelect>
					</div>)}

					{relation.charId === "new" && (
						<TextField
						  disabled={!writeAccess}
						  name="charIdNew"
						  className='tag-txt card-txt'
						  value={relation.charIdNew}
						  onChange={handleRelationChange(key)}
						  fullWidth
						/>
					)}
				</div>
			)})}
          </div>
		)
	}
}

export default GalaxyRelation;
