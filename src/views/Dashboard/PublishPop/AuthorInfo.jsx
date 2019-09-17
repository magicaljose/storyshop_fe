import React from 'react';
import Popup from "reactjs-popup";
import cover from 'assets/img/pexels-photo-1020315.jpeg';
class AuthorPop extends React.Component {
	render() {
		const {
			open, closeModal
		} = this.props;

		return (
			<Popup className="" open={open} onClose={() => closeModal("authInfo")} modal closeOnDocumentClick >
				<div>
					<h1 className="info-model">Author Information</h1>
					<div className="text-center">
					  <img src={cover} className="rounded" alt="modelimg" width="106px" style={{height:"147px"}}/>
					</div>
					<div className="text-center">
					     <button type="submit" className="btn btn-dark">Change</button>
					</div>
					<form>
					  <div className="form-row name">
					    <div className="form-group col-md-4">
					      <label for="firstname">First Name</label>
					      <input type="text" className="form-control" id="firstname" placeholder="Jeremy"/>
					    </div>
					    <div className="form-group col-md-4">
					      <label for="lastname">Middle Name (Optional)</label>
					      <input type="text" className="form-control" id="lastname"/>
					    </div>
						<div className="form-group col-md-4">
					      <label for="lastname">Last Name</label>
					      <input type="text" className="form-control" id="lastname" placeholder="Aime"/>
					    </div>
					  </div>
					  <div className="form-group">
					    <label for="Summary">Public Bio</label>
					    <textarea className="form-control" id="summary" rows="4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
					     Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
					      but also the leap into electronic typesetting,</textarea>
					  </div>
					  <div className="form-row name">
						<div className="form-group col-md-6">
						   <label for="role">Country of Residence</label>
						   <select className="form-control" id="role">
						     <option>United States</option>
						   </select>
						</div>
					  </div>
					</form>
					<div class="text-center">
					    <button type="submit" className="btn btn-light">Save</button>
						<button type="submit" className="btn btn-light">Cancel</button>
					</div>
				</div>
			</Popup>
		)
	}
}

export default AuthorPop;