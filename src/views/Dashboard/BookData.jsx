import React from 'react';
import cover from 'assets/img/pexels-photo-1020315.jpeg';
import world from 'assets/img/Blue-World-Map.png';
class BookData extends React.Component {
	render() {
		return (
			<div>
			<div className="container-fluid" style={{width:"90%"}}>
				<div className="row">
					<div className="col-md-4">
						<div className="data_img">
							 <img src={cover} className="rounded" alt="modelimg" width="106px" style={{height:"147px"}}/>
						</div>
						<div className="data_text">
							<p className="cover-details">Holly<br/>
							Release: 12/11/2019<br/>
							Total Units: 1,788<br/>
							Total Sales: $4,254</p>
						</div>
						<ul className="m16-1">
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By Country</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Units By Country</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By Vendors</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Units By Vendors</p>
								</a>
							</li>
						    <li>
						    	<a href="#" className="link">
								  	<p className="list_11">Sales By Day</p>
								</a>
						    </li>
						    <li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By week</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By Months</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By Quarter</p>
								</a>
							</li>
							<li>
								<a href="#" className="link">
								  	<p className="list_11">Sales By Year</p>
								</a>
							</li>
						</ul>
					</div>
					<div className="col-md-8">
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Amazon</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"100%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">100%</div>
							</div>
						</div>
						<div class="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Apple Books</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"90%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">90%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Google Play Books</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"85%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">85%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Kobo</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"80%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">80%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Kobo Plus</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"81%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">81%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Barnes & Bobble</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"75%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">75%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Scribd</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"71%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">71%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Overdrive</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"60%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">60%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">CNPeRedaing</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"57%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">57%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Playstar</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"51%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">51%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Odiloes</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"46%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">46%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Gardners</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"41%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">41%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Macking</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"37%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">37%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Perlego</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"33%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">33%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">Ciando</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"20%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">20%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">2 4 symbols</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"10%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">10%</div>
							</div>
						</div>
						<div className="form-group row">
						    <label for="vendor-1" className="col-sm-2 col-form-label vendor-1">bibiliotheco</label>
						    <div className="col-sm-10">
						    <div className="progress-bar" role="progressbar" style={{width:"5%"}}  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">5%</div>
							</div>
						</div>
						<div className="map-area">
					<div className="world-img">
						<img src={world} className="img-fluid" alt="Responsive image" />
					</div>
					<div className="row">
						<div className="col-md-4">
						<h4><u>Country</u></h4>
							<ul className="m9-2">
								<li>India</li>
								<li>China</li>
								<li>Russia</li>
								<li>Bangladesh</li>
								<li>United States</li>
								<li>Brazil</li>
								<li>Maxico</li>
							</ul>
						</div>
						<div className="col-md-4">
							<h4><u>Units Sold</u></h4>
							<ul className="m9-2">
								<li>206</li>
								<li>105</li>
								<li>50</li>
								<li>150</li>
								<li>82</li>
								<li>12</li>
								<li>51</li>
							</ul>
						</div>
						<div className="col-md-4">
							<h4><u>Share</u></h4>
							<ul className="m9-2">
								<li>10%</li>
								<li>5%</li>
								<li>12%</li>
								<li>7%</li>
								<li>8%</li>
								<li>2%</li>
								<li>5%</li>
							</ul>
						</div>
					</div>
				</div>
					</div>
				</div>
				</div>
			</div>
		)
	}
}

export default BookData;