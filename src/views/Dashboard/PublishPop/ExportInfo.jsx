import React from 'react';
import Popup from "reactjs-popup";
import cover from 'assets/img/pexels-photo-1020315.jpeg';
class exportpop extends React.Component {
	render() {
		const {
			open, closeModal
		} = this.props;

		return (
			<Popup className="" open={open} onClose={() => closeModal("exportInfo")} modal closeOnDocumentClick >
				<div>
					<h1 className="info-model">Export</h1>
					<div className="row">
					<div className="col-md-3">
						<div className="export_img">
							   <img src={cover} className="rounded" alt="modelimg" width="106px" style={{height:"147px"}}/>
						</div>
					</div>
					<div className="col-md-9">
						<table class="table table-borderless">
						  <tbody>
						    <tr>
						      <th>
						      	<div className="form-group form-check">
								    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
								    <label className="form-check-label" for="exampleCheck1">Distribute through Publish Drive</label>
							 	</div>
						      </th>
						      <td>
						      <span className="exp-check">
								  <i class="fas fa-check-circle"></i>
							    </span>
						      </td>
						    </tr>
						    <tr>
						     <th>
						        <div className="form-group form-check">
								    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
								    <label className="form-check-label" for="exampleCheck1">Distribute through Publish Drive</label>
								</div>
						    </th>
						      <td>
						      	<span className="exp-check">
								  <i class="fas fa-check-circle"></i>
							    </span>
						      </td>
						    </tr>
						  </tbody>
						</table>	
					</div>
					</div>
				</div>
			</Popup>
		)
	}
}

export default exportpop;