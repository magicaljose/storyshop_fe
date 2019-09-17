import React from 'react';
import Popup from "reactjs-popup";
import cover from 'assets/img/pexels-photo-1020315.jpeg';
class Bookpop extends React.Component {
	render() {
		const {
			open, closeModal
		} = this.props;

		return (
			<Popup className="" open={open} onClose={() => closeModal("authInfo")} modal closeOnDocumentClick >
				<div>
					<h1 className="info-model">Book Information</h1>
				<div class="text-center">
				  <img src={cover} class="rounded" alt="modelimg" width="106px" style={{height:"147px"}}/>
				</div>
					<form>
					  <div className="form-row name">
					    <div className="form-group col-md-8">
					      <label for="title">Title</label>
					      <input type="text" className="form-control" id="text" placeholder="Holly"/>
					    </div>
					  </div>
					  <div className="form-group">
					    <label for="subtitle">Subtitle</label>
					    <input type="text" className="form-control" id="subtitle" placeholder="Never Bring a Gun to an Axe Fight"/>
					  </div>
					  <div className="form-group">
					    <label for="Summary">Summary</label>
					    <textarea className="form-control" id="summary" rows="3">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,</textarea>
					  </div>
					  <h3>Contributors</h3>
					  <div className="form-row name">
					    <div className="form-group col-md-4">
					      <label for="firstname">First Name</label>
					      <input type="text" className="form-control" id="firstname" placeholder="Jeremy"/>
					    </div>
					    <div className="form-group col-md-4">
					      <label for="lastname">Last Name</label>
					      <input type="text" className="form-control" id="lastname" placeholder="Schofield"/>
					    </div>
					  
					  <div className="form-group col-md-4">
					    <label for="role">Role</label>
					    <select className="form-control" id="role">
					      <option>Editor</option>
					    </select>
					  </div>
					  </div>
					</form>
					<div class="text-center">
						<span className="plus-blue">
						<i className="fas fa-plus-circle"></i>
					</span>
					</div>
					<p>Series Name</p>
				</div>
			</Popup>
		)
	}
}

export default Bookpop;