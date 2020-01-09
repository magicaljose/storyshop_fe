import React from "react";
import Popup from "reactjs-popup";
import {
	Button, Checkbox
} from "@material-ui/core";

import loadingGF from 'assets/img/loding_loding.gif';

import getQueries from 'queries/getQueries';
import updateQueries from 'queries/updateQueries';

const numberWithCommas = (number) => {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return parts.join(".");
}

class WordCountPop extends React.Component {
	initState = {
		display: {
			bookCount: true, 
			todayCount: false, 
			goal: true
		},		
		goalEdit: {
			bookGoal: false,
			dailyGoal: false
		},
		data: {
			bookGoal: 0,
			dailyGoal: 0,
			worldTotal: 0,
			seriesTotal: 0,
			bookTotal: 0,
			todayTotal: 0,
		},
		isLoading: true
	}

	state = {
		display: {
			bookCount: true, 
			todayCount: false, 
			goal: true
		},		
		goalEdit: {
			bookGoal: false,
			dailyGoal: false
		},
		data: {
			bookGoal: 0,
			dailyGoal: 0,
			worldTotal: 0,
			seriesTotal: 0,
			bookTotal: 0,
			todayTotal: 0,
		},
		isLoading: true
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.open !== this.props.open) {
			if (this.props.open === true) {
				this.getWordCount();
			} else if (this.props.open === false) {
				this.setState({
					display: this.initState.display,
					goalEdit: this.initState.goalEdit,
					data: this.initState.data,
					isLoading: this.initState.isLoading
				});
			}
		}
	}

	getWordCount = () => {
		const { world_id, series_id, season_id } = this.props;

		const worldCB = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.status === 1) {
					this.setState(prevState => ({
						...prevState,
						data: {
							...prevState.data,
							worldTotal: result.data.count || 0
						}
					}));
				}
			}
		}

		const seriesCB = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.status===1) {
					this.setState(prevState => ({
						...prevState.data,
						data: {
							...prevState.data,
							seriesTotal: result.data.count || 0
						}
					}))
				}
			}
		}

		const seasonCB = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.status === 1) {
					let seasonCount_obj = result.data;

					if (seasonCount_obj.display) {
						const { 
							bookCount, todayCount, goal
						} = seasonCount_obj.display;

						this.setState(prevState => ({
							...prevState,
							display: {
								...prevState.display,
								bookCount,
								todayCount,
								goal
							}
						}));
					}

					let bookTotal = 0;
					let bookGoal = 0;
					let dailyGoal = 0;
					let todayTotal = 0;

					if (seasonCount_obj.count) {
						bookTotal = seasonCount_obj.count;
					}

					if (seasonCount_obj.bookGoal) {
						bookGoal = parseInt(seasonCount_obj.bookGoal);
					}

					if (seasonCount_obj.dailyGoal) {	
						dailyGoal = parseInt(seasonCount_obj.dailyGoal);
					}

					if (seasonCount_obj.dailyCount) {
						const today = new Date().toDateString();

						if (seasonCount_obj.dailyCount[today]) {
							todayTotal = seasonCount_obj.dailyCount[today];
						}
					}

					this.setState(prevState => ({
						...prevState,
						data: {
							...prevState.data,
							bookTotal,
							bookGoal,
							dailyGoal,
							todayTotal
						}
					}));
				}
			}
		}

		getQueries.getWorldWordCountDoc(world_id, worldCB);
		getQueries.getSeriesWordCountDoc(series_id, seriesCB);
		getQueries.getSeasonWordCountDoc(season_id, seasonCB);
	}

	handleCheckChange = (event) => {
		const { name, checked } = event.target;

		if (name === "bookCount") {
			this.setState(prevState => ({
				...prevState,
				display: {
					...prevState.display,
					bookCount: true, 
					todayCount: false
				}
			}));
		} else if (name === "todayCount") {
			this.setState(prevState => ({
				...prevState,
				display: {
					...prevState.display,
					bookCount: false, 
					todayCount: true
				}
			}));
		} else {
			this.setState(prevState => ({
				...prevState,
				display: {
					...prevState.display,
					[name]: checked
				}
			}));
		}
	}

	saveWordDetails = (save) => (event) => {
		if (save) {
			const { display, data } = this.state;
			const { world_id, series_id, season_id } = this.props;
			
			const data1 = { 
				display: display, 
				bookGoal: data.bookGoal, 
				dailyGoal: data.dailyGoal 
			}
			const callback = (error, results) => { 
				if (error) {
					console.log(error);
					this.props.closeModal();
				} else {
					this.props.closeModal();
				}
			}
		 	updateQueries.updateSeasonWordCount(season_id, data1, callback);
			
		} else {
			this.props.closeModal();
		}
	}

	changeText = (name, value) => {
		this.setState(prevState => ({
				...prevState,
				goalEdit: {
					...prevState.goalEdit,
					[name]: !value
				}
			}));
	}

	handleChange = (event) => {
		const { name, value } = event.target;

		this.setState(prevState => ({
			...prevState,
			data: {
				...prevState.data,
				[name]: value
			}
		}));
	}

	render() {
		const { open, closeModal, writeAccess } = this.props;
		const {
			display, goalEdit, data, isLoading
		} = this.state;

		return (
			<Popup className='word-cPop' open={open} onClose={closeModal} modal closeOnDocumentClick >
			 {/*
			 	isLoading && (
			 		<center>
						<img src={loadingGF} alt="loading..." />
					</center>
			 	)
			 */}

			 {
			 	// !isLoading && (
			 		<div className='pp-htc'>
						<div className='pp-hd drk cmn-hd-cl'>Word Count</div>

						<div className='dp-block'>
							<div className='dp-txt'>Display</div>

							<div className='dp-grp'>
								<div className='dp-btc'>
									<div className='c-btc'>Book Word Count</div>
									
									<div className='sd-count-chck chk-bt1'>
										<Checkbox
										  className=''
										  name="bookCount"
								          checked={display.bookCount}
								          onChange={this.handleCheckChange}
								        />
								        <span className='fixed-hov-ob'>Select/Deselect Total Book Word Count</span>
									</div>
								</div>
								
								<div className='dp-twc'>
									<div className='c-twc'>Today's Word Count</div>
									
									<div className='sd-count-chck chk-bt2'>
										<Checkbox
										  className=''
										  name="todayCount"
								          checked={display.todayCount}
								          onChange={this.handleCheckChange}
								        />
								        <span className='fixed-hov-ob'>Select/Deselect Daily Word Count</span>
									</div>
								</div>
								
								<div className='dp-ig'>
									<div className='c-ig'>Include Goal</div>
									
									<div className='sd-count-chck chk-bt3'>
										<Checkbox
										  className='chk-bt3'
										  name="goal"
								          checked={display.goal}
								          onChange={this.handleCheckChange}
								        />
								        <span className='fixed-hov-ob'>Select/Deselect Display Word Count Goal</span>
									</div>
								</div>
							</div>
						</div>

						<div className='stt-block'>
							<div className='stt-txt'>Book Stats</div>
							
							<div className='stt-grp'>
								<div className='stt-wc'>
									<div className='c-wc'>Word Count</div>
									<div className='sd-count'>{numberWithCommas(parseInt(data.bookTotal))}</div>
								</div>
								
								<div className='stt-twc'>
									<div className='c-twc'>Today's Word Count</div>
									<div className='sd-count'>{numberWithCommas(parseInt(data.todayTotal))}</div>
								</div>
							</div>
						</div>

						<div className='ttl-block'>
							<div className='ttl-st'>
								<div className=''>Series Total</div>
								<div className='sd-count'>{numberWithCommas(parseInt(data.seriesTotal))}</div>
							</div>

							<div className='ttl-wt'>
								<div className=''>World Total</div>
								<div className='sd-count'>{numberWithCommas(parseInt(data.worldTotal))}</div>
							</div>
						</div>

						<div className='gll-block'>
							<div className='gll-bwcg'>
								<div className=''>Book Word Count Goal</div>
								<div className='sd-count'>
									{
										goalEdit.bookGoal ? (
											<input type="number" name="bookGoal" value={data.bookGoal} onChange={this.handleChange} />
										) : (
											<span>{numberWithCommas(parseInt(data.bookGoal))}</span>
										)
									}
									
									<span className='chk-bt5' onClick={() => this.changeText("bookGoal", goalEdit.bookGoal)}>
										<i className="fas fa-pencil-alt"></i>
										<span className='fixed-hov-ob'>Edit Book Word Count Goal</span>
									</span>
								</div>
							</div>

							<div className='gll-dwcg'>
								<div className=''>Daily Word Count Goal</div>
								<div className='sd-count'>
									{
										goalEdit.dailyGoal ? (
											<input type="number" name="dailyGoal" value={data.dailyGoal} onChange={this.handleChange} />
										) : (
											<span>{numberWithCommas(parseInt(data.dailyGoal))}</span>
										)
									}
									
									<span className='chk-bt4' onClick={() => this.changeText("dailyGoal", goalEdit.dailyGoal)}>
										<i className="fas fa-pencil-alt"></i>
										<span className='fixed-hov-ob'>Edit Daily Word Count Goal</span>
									</span>
								</div>
							</div>
						</div>

						<div className='btt-block'>
							<div className='btt-save'>
								{writeAccess && (<Button className='btns btt-sv' onClick={this.saveWordDetails(true)}>Save</Button>)}
							</div>
							
							<div className='btt-cancel'>
								<Button className='btns btt-cc' onClick={this.saveWordDetails(false)}>Cancel</Button>
							</div>
						</div>
					 </div>
			 	// )
			 }
			</Popup>
		)
	}
}

export default WordCountPop;