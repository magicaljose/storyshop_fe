import React from 'react';
import cover from 'assets/img/pexels-photo-1020315.jpeg';

import AuthorInfo from './PublishPop/AuthorInfo';
import BookInfo from './PublishPop/BookInfo';
import FinanInfo from './PublishPop/FinancialsInfo';
import ExportInfo from './PublishPop/ExportInfo';

class BookPublish extends React.Component {
	state = {
		authInfo: false,
		bookInfo: false,
		finanInfo: false,
		exportInfo: false,
	}

	openModal = (name) => {
		this.setState({ [name]: true });
	}

	closeModal = (name) => {
		this.setState({ [name]: false });
	}

	renderCoverbook() {
		return (
			<div className="build-check">
			  <div className="md-12">
				<div className="modif-img">
					<h2 className="m-13">Full Wrap Cover :</h2>
					<p><i>Required for print</i></p>
				</div>
				<div className="chk-img">
					<img src={cover} class="img-fluid" alt="Responsive image" width="190px"/>
				</div>
				<div className="lft-icon">
		      		<span><i className="fas fa-check-circle left"></i></span>
		      	</div>
				<div className="load">
					<div className="form-group">
					      <button type="submit" className="btn btn-dark">Reload</button>
					</div>
				</div>
				<div className="sml-img">
					<h3 className="m-13">Digital Cover :</h3>
					<p><i>Required for eBook</i></p>
				</div>
				<div className="chk-img">
					<img src={cover} class="img-fluid" alt="Responsive image" width="80px" style={{height:"150px"}}/>
				</div>
				<div className="lft-icon">
		      		<span><i className="fas fa-check-circle left"></i></span>
		      	</div>
				<div className="load-2">
					<div className="form-group">
					      <button type="submit" className="btn btn-dark">Reload</button>
					</div>
				</div>
			</div>
			</div>			
		)
	}

	renderTitlePage() {
		return (
			<div className="build-check">
				<div className="tit-head">
					<div className="modif-img">
						<h3 className="m-13">Title Header</h3>
					</div>
					<form>
					  <div className="form-row" style={{position:"initial"}}>
					    <div className="form-group col-md-10">
					      <select id="inputState" className="form-control">
					        <option selected>Palatino</option>
					        <option>...</option>
					      </select>
					    </div>
					    <div className="form-group col-md-2">
					      <select id="inputState" class="form-control">
					        <option selected></option>
					        <option></option>
					      </select>
					    </div>
					  </div>
					    <div className="form-group">
					      <select id="inputState" class="form-control" style={{width:"30%"}}>
					        <option selected>28pt</option>
					        <option>...</option>
					      </select>
					    </div>
					    <div className="form-group row">
						    <label for="inputEmail3" className="col-sm-5 col-form-label">Space Above</label>
						    <div className="col-sm-7">
						      <input type="range" className="custom-range" min="0" max="5" id="customRange2"/>
						    </div>
						</div>
						<div class="form-group row">
						    <label for="inputEmail3" className="col-sm-5 col-form-label">Letter Space</label>
						    <div className="col-sm-7">
						      <input type="range" className="custom-range" min="0" max="5" id="customRange2"/>
						    </div>
						</div>
						<div className="tick-text">
							<h3>By</h3>
						</div>
						<div className="rgt-icon">
				      		<span><i class="fas fa-check-square right"></i></span>
				      	</div>
				      	<div className="form-row" style={{position:"initial"}}>
					    <div className="form-group col-md-10">
					      <select id="inputState" className="form-control">
					        <option selected>Palatino</option>
					        <option>...</option>
					      </select>
					    </div>
					    <div className="form-group col-md-2">
					      <select id="inputState" class="form-control">
					        <option selected></option>
					        <option></option>
					      </select>
					    </div>
					  </div>
					  <div className="form-group">
					      <select id="inputState" class="form-control" style={{width:"30%"}}>
					        <option selected>8pt</option>
					        <option>...</option>
					      </select>
					    </div>
					  <div class="form-group">
					    <input type="text" class="form-control" id="short" placeholder="a short by"/>
					  </div>
					  <div className="form-group row">
						    <label for="inputEmail3" className="col-sm-5 col-form-label">Space Above</label>
						    <div className="col-sm-7">
						      <input type="range" className="custom-range" min="0" max="5" id="customRange2"/>
						    </div>
						</div>
						<div class="form-group row">
						    <label for="inputEmail3" className="col-sm-5 col-form-label">Author</label>
						    <div className="col-sm-7">
						      <input type="range" className="custom-range" min="0" max="5" id="customRange2"/>
						    </div>
						</div>
						<div className="form-row" style={{position:"initial"}}>
					    <div className="form-group col-md-10">
					      <select id="inputState" className="form-control">
					        <option selected>Palatino</option>
					        <option>...</option>
					      </select>
					    </div>
					    <div className="form-group col-md-2">
					      <select id="inputState" class="form-control">
					        <option selected></option>
					        <option></option>
					      </select>
					    </div>
					  </div>
					    <div className="form-group">
					      <select id="inputState" class="form-control" style={{width:"30%"}}>
					        <option selected>14pt</option>
					        <option>...</option>
					      </select>
					    </div>
					    <div className="tick-text">
							<h3>Publisher</h3>
						</div>
						<div className="rgt-icon">
				      		<span><i class="fas fa-check-square right"></i></span>
				      	</div>
				      	<div className="form-row">
				      	<div className="col-sm-6">
				      	<div className="logo-icon">
				      		<img src={cover} class="img-fluid" alt="Responsive image" style={{width:"47%"}}/>
				      	</div>
				      	</div>
				      	<div className="form-group">
				      	<div className="col-sm-6">
					      <button type="submit" className="btn btn-dark">Reload</button>
					    </div>
					    </div>
					    </div>
					</form>
				</div>
			</div>
		)
	}
copyright() {
		return (
			<div className="build-check">
				<div className="tit-head">
					<div class="row">
					    <div className="col-md-10">
					        <h3>Copyrighted By</h3>
					    </div>
					    <div className="col-md-2">
					      <span><i class="fas fa-check-circle"></i></span>
					    </div>
					</div>
					<div className="form-group">
					    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="David Mark Brown" data-kwimpalastatus="alive" data-kwimpalaid="1560498935431-2"/>
					  </div>
					  <div className="row">
					    <div className="col-md-10">
					        <h3>Text</h3>
					    </div>
					    <div className="col-md-2">
					      <span><i className="fas fa-check-circle"></i></span>
					    </div>
					</div>
					<div className="form-group">
					    <textarea className="form-control" id="exampleFormControlTextarea1" rows="4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s</textarea>
					  </div>
					  <div className="form-group row">
					    <div className="col-sm-10">
					      <button type="submit" className="btn btn-primary">Revert to default</button>
					    </div>
					  </div>
					  <div className="row">
					    <div className="col-md-10">
					        <h3>ISBN</h3>
					    </div>
					    <div className="col-md-2">
					      <span><i className="fas fa-check-circle"></i></span>
					    </div>
					</div>
					<div className="form-group">
					    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="162-3-39768-231-8" data-kwimpalastatus="alive" data-kwimpalaid="1560498935431-2"/>
					  </div>
					  <div className="form-group row">
					    <div className="col-sm-10">
					      <button type="submit" className="btn btn-primary">Generate a Free One </button><i class="fa fa-info-circle" aria-hidden="true"></i>
					    </div>
					  </div>
					  <div className="row">
					    <div className="col-md-10">
					        <h3>Editor Attribution (Optional)</h3>
					    </div>
					    <div className="col-md-2">
					      <span><i className="fas fa-check-circle"></i></span>
					    </div>
					</div>
					<div className="form-group">
					    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Kasey Boles" data-kwimpalastatus="alive" data-kwimpalaid="1560498935431-2"/>
					  </div>
					
				</div>
			</div>
		)
	}



	render() {
		const {
			authInfo,bookInfo,finanInfo,exportInfo
		} = this.state;


		return (
			<div className='main-bp'>
			<div className="container">
			    <div className="row">
					<div className="col-md-4">
						<div className="head-text">
							<h4>Build</h4>
						</div>
						<div className="build-check">
						  <div className="chk-item">
							<table class="table table-borderless">
							 <tbody>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Cover Image</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary" 
										      onClick={() => this.openModal("authInfo")}>Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Copyright</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary" 
										       onClick={() => this.openModal("bookInfo")}>Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Dadication</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary"
										      onClick={() => this.openModal("finanInfo")}>Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Foreword</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary"
										      onClick={() => this.openModal("exportInfo")}>Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Prologue</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Title Page</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Chapters</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Scenes</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Paragraphs</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Margins</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Epilogue</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Acknowledgements</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>About the Author</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Also By</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Cover Image</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Cover Image</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    <tr>
							      <td>
								    <div className="form-check">
									    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
									    <p>Cover Image</p>
									</div>
							      </td>
							      <td>
							      	<div className="rght-icon">
							      		<span><i className="fas fa-check-circle"></i></span>
							      	</div>
							      </td>
							      <td>
							      	<div className="lgt-btn">
							      		<div className="form-group">
										      <button type="submit" className="btn btn-primary">Click</button>
										</div>
							      	</div>
							      </td>
							    </tr>
							    
							 </tbody>
							</table>
						  </div>
						</div>
					</div>
					<div className="col-md-4">
					 	<div className="head-text">
							<h4>Modify</h4>
						</div>

						{this.copyright()}
					  
				</div>
				<div className="col-md-4">
					<div className="head-text">
						<h4>preview</h4>
					</div>
					  <div className="build-check"style={{padding:"4px"}}>
					  	<div className="form-row">
						    <div className="col">
						      <select className="form-control">
								  <option>iBook</option>
								</select>
						    </div>
						    <div className="col">
							     <span className="arow">
							  	<i className="fa fa-arrows-alt" aria-hidden="true"></i>
							  </span>
						    </div>
						</div>
						<div className="m12-1">
							<div className="view-scr">
								<div className="sml-img">
								  <img src={cover} class="img-fluid img-dsk" alt="Responsive image"/>
							    </div>
							</div>
						</div>
						<div  class="text-center">
		                    <button type="submit" className="btn btn-light"><i class="fas fa-chevron-left"></i></button>
		                    <button type="submit" className="btn btn-light"><i class="fas fa-chevron-right"></i></button>
		                </div>
					  </div>
				</div>
				</div>
			</div>

			<AuthorInfo open={authInfo} closeModal={this.closeModal} />
			<BookInfo open={bookInfo} closeModal={this.closeModal} />
			<FinanInfo open={finanInfo} closeModal={this.closeModal} />
			<ExportInfo open={exportInfo} closeModal={this.closeModal} />
			</div>
		)
	}
}

export default BookPublish;