import React from 'react';
import Popup from "reactjs-popup";
class financialsPop extends React.Component {
	render() {
		const {
			open, closeModal
		} = this.props;

		return (
			<Popup className="" open={open} onClose={() => closeModal("finanInfo")} modal closeOnDocumentClick >
				<div>
					<h1 className="info-model">Financials</h1>
					<div className="outer-scr">
						<div className="frame-text">
							<h4 className="frame-1">PublishDrive iFrames</h4>
							<p className="frame-1">Lorem Ipsum is simply dummy text of the printing and typesetting industry.
							 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
						</div>
					</div>
				</div>
			</Popup>
		)
	}
}

export default financialsPop;