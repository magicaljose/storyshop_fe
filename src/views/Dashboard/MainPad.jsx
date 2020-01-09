import React from 'react';
import { Redirect } from 'react-router-dom';
import {
	  Button, ExpansionPanel, ExpansionPanelSummary,
	  ExpansionPanelDetails, TextField, Switch
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import NativeSelect from '@material-ui/core/NativeSelect';

import throttledQueue from 'throttled-queue';

import axios from 'axios';
import { NODE_API, CLEAN_HTML, EXPORT_DOCX_API, PREEN_API_STRING} from 'views/constant';

import htmlDocx from 'html-docx-js/dist/html-docx';
// import htmlDocx from 'views/html-docx-js/dist/html-docx';
import { saveAs } from 'file-saver';

import CharCard from './CardsPop/CharCard';
import ComonCard from './CardsPop/ComonCard';
import WordCountPop from './WordCountPop';
import { confirmAlert } from 'react-confirm-alert';
import { Scrollbars } from 'react-custom-scrollbars';
import MediumEditor from 'medium-editor';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Fullscreen from "react-full-screen";

import AddBuilder from './AddBuilder';
import AddShortcutBuilder from './AddShortcutBuilder';
import BackgroundPop from './BackgroundPop';

import Avatar from 'react-avatar';

import SeasonView from './SeasonView';

import left_btn from 'assets/img/left-btn.png';
import right_btn from 'assets/img/right-btn.png';
import grn_edit from 'assets/img/grn-edit.png';
import gear_edit from 'assets/img/gear-edit.png';
import close_lft_btn from 'assets/img/close-lft-btn.png';
import close_rgt_btn from 'assets/img/close-rgt-btn.png';
import expand_screen from 'assets/img/expand-arrows.png';

import book_filter_icon from "assets/img/icons/book_icon.jpg";
import series_filter_icon from "assets/img/icons/series_icon.jpg";
import world_filter_icon from "assets/img/icons/world_icon.jpg";

import expand_close from 'assets/img/expand_close.png';
import expand_open from 'assets/img/expand_open.png';
import setting_close from 'assets/img/settings_close.png';
import setting_open from 'assets/img/settings_open.png';
import export_close from 'assets/img/export-file_close.png';
import export_open from 'assets/img/export-file_open.png';

import cmnt_toggle from 'assets/img/icons/cmnt-tggl.png';
import exit_tool from 'assets/img/icons/exit_tool.png';

import {db} from 'config_db/firebase';
import appbaseRef from 'config_db/appbase';
import secureStorage from 'secureStorage';
import * as jsPDF from 'jspdf';
import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";
import worldBuilders from '../worldBuilders.js';

import BeatBar from './BeatBar.jsx';
import BeatsMode from './BeatsMode.jsx';

import getCardHTML from './CardsPop/getCardHTML';
import getRelations from './CardsPop/Relations/getRelations';

import loadingGF from 'assets/img/loding_loding.gif';

import PrinIntegration from "./PrinIntegration.jsx";
import TrashCanRecover from './TrashCanRecover.jsx';
import UpgradePop from './UpgradePop';

import getQueries from 'queries/getQueries';
import realtimeGetQueries from 'queries/realtimeGetQueries';
import setQueries from 'queries/setQueries';
import updateQueries from 'queries/updateQueries';
import mergeQueries from 'queries/mergeQueries';
import deleteQueries from 'queries/deleteQueries';
import backendProcessQuery from 'queries/backendProcessQuery';

const numberWithCommas = (number) => {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
}

const getExpandIcon = (expand) => {
	if (expand) return expand_open;

	return expand_close
}

const getSettingIcon = (setOn) => {
	if (setOn) return setting_open;

	return setting_close
}

const getExportIcon = (exportOn) => {
	if (exportOn) return export_open;

	return export_close;
}

const remove = (source, droppableSource) => {
    const result = Array.from(source);

    result.splice(droppableSource.index, 1);

    result[droppableSource.droppableId] = result;

    return result;
};

const reorderBeat = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const getDeleteSrc = isDraggingOver => (
	  isDraggingOver ?
		"data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiNEODAwMjciLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iI0Q4MDAyNyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
		:
		"data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDc3NC4yNjYgNzc0LjI2NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc0LjI2NiA3NzQuMjY2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTY0MC4zNSw5MS4xNjlINTM2Ljk3MVYyMy45OTFDNTM2Ljk3MSwxMC40NjksNTI2LjA2NCwwLDUxMi41NDMsMGMtMS4zMTIsMC0yLjE4NywwLjQzOC0yLjYxNCwwLjg3NSAgICBDNTA5LjQ5MSwwLjQzOCw1MDguNjE2LDAsNTA4LjE3OSwwSDI2NS4yMTJoLTEuNzRoLTEuNzVjLTEzLjUyMSwwLTIzLjk5LDEwLjQ2OS0yMy45OSwyMy45OTF2NjcuMTc5SDEzMy45MTYgICAgYy0yOS42NjcsMC01Mi43ODMsMjMuMTE2LTUyLjc4Myw1Mi43ODN2MzguMzg3djQ3Ljk4MWg0NS44MDN2NDkxLjZjMCwyOS42NjgsMjIuNjc5LDUyLjM0Niw1Mi4zNDYsNTIuMzQ2aDQxNS43MDMgICAgYzI5LjY2NywwLDUyLjc4Mi0yMi42NzgsNTIuNzgyLTUyLjM0NnYtNDkxLjZoNDUuMzY2di00Ny45ODF2LTM4LjM4N0M2OTMuMTMzLDExNC4yODYsNjcwLjAwOCw5MS4xNjksNjQwLjM1LDkxLjE2OXogICAgIE0yODUuNzEzLDQ3Ljk4MWgyMDIuODR2NDMuMTg4aC0yMDIuODRWNDcuOTgxeiBNNTk5LjM0OSw3MjEuOTIyYzAsMy4wNjEtMS4zMTIsNC4zNjMtNC4zNjQsNC4zNjNIMTc5LjI4MiAgICBjLTMuMDUyLDAtNC4zNjQtMS4zMDMtNC4zNjQtNC4zNjNWMjMwLjMyaDQyNC40MzFWNzIxLjkyMnogTTY0NC43MTUsMTgyLjMzOUgxMjkuNTUxdi0zOC4zODdjMC0zLjA1MywxLjMxMi00LjgwMiw0LjM2NC00LjgwMiAgICBINjQwLjM1YzMuMDUzLDAsNC4zNjUsMS43NDksNC4zNjUsNC44MDJWMTgyLjMzOXoiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSI0NzUuMDMxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIzNjMuMzYxIiB5PSIyODYuNTkzIiB3aWR0aD0iNDguNDE4IiBoZWlnaHQ9IjM5Ni45NDIiIGZpbGw9IiM0NWJjYzQiLz4KCQk8cmVjdCB4PSIyNTEuNjkiIHk9IjI4Ni41OTMiIHdpZHRoPSI0OC40MTgiIGhlaWdodD0iMzk2Ljk0MiIgZmlsbD0iIzQ1YmNjNCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
);

const getCardItemStyle = (draggingOver, draggableStyle, isEqual="delete") => ({
	  background: draggingOver === isEqual ? "red" : "white",
	  color: draggingOver === isEqual ? "white" : "black",

	  ...draggableStyle
});

const liteWorldBuilders = [
  "Character", "Setting", "Notes & reference"
];

const searchBlackList = [
	  "dna", "photo", "alignment"
];

let enter_count = 0;

var cancelScrollEvent = function (e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  e.returnValue = false;
  return false;
};

const offset = (el) => {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

class MainPad extends React.Component {
	backgroundSettings = null
	seriesSeasons = {}
	seasonEpisodes = {}
	episodeScenes = {}
	firebaseOn = {}
	firestoreEditor = {}
	commenents = {}
    ref = [];
    initCommonFields = {
	      name: {
            has: true,
            val: ''
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
        description: {
            has: true,
            val: ''
        },
        photo: {
            has: false,
            val: []
        },
	      relation: {
            has: false,
            val: {},
		    relation_id: ''
        },
	    dna: {
		    has: true,
		    val: {}
	    },
	    start: {
            has: false,
            val: ''
        },
	    end: {
            has: false,
            val: ''
        },
	    working_notes: {
            has: false,
            val: ''
        },
	    availability: {
            has: false,
            val: ''
        },
    }
    initFields = {
        name: {
            has: true,
            val: ''
        },
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
            val: {},
		    relation_id: ''
        },
	    dna: {
		    has: true,
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
	    start: {
            has: false,
            val: ''
        },
	    end: {
            has: false,
            val: ''
        },
	    availability: {
            has: true,
            val: ''
        },
	    ethnicity: {
            has: true,
            val: ''
        },
	    orientation: {
            has: false,
            val: ''
        },
	    working_notes: {
            has: false,
            val: ''
        },
	    gender: {
            has: true,
            val: ''
        },
	    physical_description: {
            has: false,
            val: ''
        },
	    personality: {
            has: false,
            val: ''
        },
	    habits: {
            has: false,
            val: ''
        },
	    background: {
            has: false,
            val: ''
        },
	    internal_conflicts: {
            has: false,
            val: ''
        },
	    external_conflicts: {
            has: false,
            val: ''
        },
	    occupation: {
            has: false,
            val: ''
        },
	    alignment: {
		    has: false,
		    val: {
			    goods: '',
			    neutrals: '',
			    evils: ''
		    }
	    }
    }
    initWordCount = {
		displayBookCount: true,
		displayTodayCount: false,
		includeGoal: true,
		bookTotal: 0,
		todayTotal: 0,
		bookGoal: 0,
		dailyGoal: 0,
	}

	state= {
		writeAccess: true,
		world: {seasons: {}},
		test_world: {seasons: {}},
		background_settings: {},
		showLite: false,
		isFull: false,
        open: false,
		openBeats: false,
		openBuilder: false,
		openBeatCard: false,
		beatSaved: false,
		beatOpenType: "",
        builderChecks: {},
	    beatStyles: {
		    fontType: "",
		    fontSize: "",
		    indentCheck: false,
	    },
	    elementNames: [],
	    showComments: false,
		loadExports: false,
		sceneCounts: {},
        upadteData: false,
	    worldBuilders: [],
        charFields: {},
	    galaxyFields: {},
	    systemFields: {},
	    planetFields: {},
	    continentFields: {},
	    countryFields: {},
	    regionFields: {},
	    stateFields: {},
	    cityFields: {},
	    districtFields: {},
	    locationFields: {},
		"specific locationFields": {},
	    settingFields: {},
	    weaponsFields: {},
	    vehiclesFields: {},
	    showOneSumm: {},
	    showExpndOneSumm: {},
	    expandButtons: {},
	    SSExpanded: {},
	    EEExpanded: {},
	    itemExpand: {},
	    expandBeatsMode: {},
        charKey: '',
        charCardData: {},
        realChecks: {},
        openCharUpdate: false,
	    openCharCard: false,
	    openComonCard: false,
        openBuilderPop: false,
        world_data: true,
        season_data: true,
	    type: "tisa of regular",
	    indentCheck: false,
		comments: {},
		wordCount: {
			displayBookCount: true,
			displayTodayCount: false,
			includeGoal: true,
			bookTotal: 0,
			todayTotal: 0,
			bookGoal: 0,
			dailyGoal: 0,
		},
		filterLoading: true,
		commentProOpen: false,
		commentsList: {},
		commentsList_newItem: {},
		suggestorState: {},
		worldBarFilter: {
			showInWorlds: {
				id: "",
				name: ""
			},
			showInSeries: {
				id: "",
				name: ""
			},
			showInSeason: {
				id: "",
				name: ""
			},
			showInBroke: {
				id: "",
				name: "Going for Broke"
			},
			selectedFilter: "showInWorlds"
		}
	}

	componentWillMount = () => {
		this.mounted = true;
		// Check subscription and valid user
		let token = secureStorage.getItem("storeToken");
		const user_id = localStorage.getItem("storyShop_uid");

		if (!token) {
		    localStorage.clear();
		    secureStorage.clear();

		    return this.setState({ showLite: true, world_data: false });
		}

		if (localStorage.getItem("storyShop_uid") !== token.user_id) {
			localStorage.clear();

			return this.setState({ showLite: true, world_data: false });
		}

		if (token.account_type === "Lite") {
		    this.setState({ showLite: true });
		}

		const { world_id, series_id, season_id, } = this.props.match.params;

		if (!world_id || !series_id || !season_id) {
			this.setState({ world_data: false });
		}

		// This is for old feature
        // We no need to remove this
        this.setState(prevState => ({
			...prevState,
			newSeasonId: season_id,
			seasonExpanded: season_id,
			SSExpanded: {
				...prevState.SSExpanded,
				[season_id]: true
			}
		}));

		this.verifyUserPage(world_id, user_id);
		this.getBeatStyles(world_id);
		this.verifySeason(season_id);

		// Series list for beat bar and beat mode
	    this.getSeries(world_id);

		// Get Season Word Count
        this.getWordCount(season_id);
        this.getSeasons(series_id, season_id);
		this.getBackgroundSettings(user_id, season_id);
	}

    componentDidMount = () => {
    	// Controll popup functionality to close
    	let main_pg = document.querySelector("#main-pg");
        if (main_pg) {
        	main_pg.classList.add("rm-pd");
        }

        document.addEventListener('mouseup', this.handleClickOutside);

        const { world_id, series_id, season_id } = this.props.match.params;

        // World Bar Filter Feature Functions
        this.saveWorldBarFilterIDS(world_id, series_id, season_id);
        this.saveSeriesWorldBarFilter(series_id);
        this.saveSeasonWorldBarFilter(season_id);

	    // Get World Builders
	    let builderChecks = {};

	    worldBuilders.map(type => {
		    builderChecks[type.toLowerCase()] = false;
		    this.getBuilders(type.toLowerCase(), "showInWorlds", world_id);
	    });

	    this.setState({ builderChecks });

	    if (this.props.location && this.props.location.state && this.props.location.state.prenIntegration) {
			this.setState({
				prinIntegration: true,
				openBuilder: true,
				elementNames: this.props.location.state.elementNames
			});
		}
    }

    componentDidUpdate = (prevProps, prevState) => {
	      if (prevState.saveText !== this.state.saveText) {
		        if (this.state.saveText) {
			          setTimeout(() => {
				            this.setState(() => ({saveText: false}))
			          }, 1000);
			      }
	      }

	    if ((prevProps.match.params.series_id !== this.props.match.params.series_id) ||
	    (prevProps.match.params.season_id !== this.props.match.params.season_id)) {
	    	const { world_id, series_id, season_id } = this.props.match.params;

	    	this.verifySeason(season_id);
	    	this.saveWorldBarFilterIDS(world_id, series_id, season_id);
	    	this.getWordCount(season_id);

	    	if (this.firestoreEditor) {
	        	Object.entries(this.firestoreEditor).map(([key, subs]) => subs());

	        	this.firestoreEditor = {};
	        }

	        if (this.cardAssistant) {
	        	this.cardAssistant();
	        	this.cardAssistant = null;
	        }

	        this.saveSeasonWorldBarFilter(season_id);

	        const selectedFilter = this.state.worldBarFilter.selectedFilter;
	        if (selectedFilter === "showInSeason") {
		    	worldBuilders.map(type => {
			        // builderChecks[type.toLowerCase()] = false;
			        this.getBuilders(type.toLowerCase(), selectedFilter, season_id);
		      	});
	        }
	    }

	      	if (prevProps.match.params.series_id !== this.props.match.params.series_id) {
		        const { world_id, series_id, season_id } = this.props.match.params;

		        this.saveSeriesWorldBarFilter(series_id);

		        this.getSeasons(series_id, season_id);
	      	}

	      	if ((prevProps.match.params.series_id === this.props.match.params.series_id) &&
	      		(prevProps.match.params.season_id !== this.props.match.params.season_id)
	      	) {
	      		const { world_id, series_id, season_id } = this.props.match.params;

	      		this.getEpisodes(season_id);
	      	}

	      	if (prevProps.match.params.season_id !== this.props.match.params.season_id) {
	      		const { world_id, series_id, season_id } = this.props.match.params;
	      		const newSeasonId = season_id;

	      		this.setState(prevState => ({
			          ...prevState,
			          newSeasonId: season_id,
			          seasonExpanded: season_id,
			          SSExpanded: {
				            ...prevState.SSExpanded,
				            [newSeasonId]: true
			          }
		        }))
	      	}

	      if (prevState.openBeats !== this.state.openBeats) {
		        if (this.state.openBeats === false) {
		        	if (this.beatScrollBar) {
			        	this.beatScrollBar.view.removeEventListener('wheel', this.onBeatScrollHandler, false);
			        }

			          const { newSeasonId, showEpisode } = this.state;

			          this.setState({
				            SSExpanded: {[newSeasonId]: true},
				            EEExpanded: {[showEpisode]: true}
			          })
		        } else {
		        	if (this.beatScrollBar) {
			        	this.beatScrollBar.view.addEventListener('wheel', this.onBeatScrollHandler, false);
			        }
		        }
	      }

	      if (prevState.openBeatCard !== this.state.openBeatCard) {
	      	if (this.state.openBeatCard) {
	      		this.beatScrollBar.view.removeEventListener('wheel', this.onBeatScrollHandler, false);
	      	} else {
	      		this.beatScrollBar.view.addEventListener('wheel', this.onBeatScrollHandler, false);
	      	}
	      }

	      if (prevState.openBuilder !== this.state.openBuilder) {
		        if (this.state.openBuilder === false) {
		        	if (this.builderScrollBar) {
			        	this.builderScrollBar.view.removeEventListener('wheel', this.onBuilderScrollHandler, false);
			        }

			          this.setState({ itemExpand: {} });
		        } else {
		        	if (this.builderScrollBar) {
			        	this.builderScrollBar.view.addEventListener('wheel', this.onBuilderScrollHandler, false);
			        }
		        }
	      }

	      if (prevState.openCharCard !== this.state.openCharCard ||
	      	prevState.openComonCard !== this.state.openComonCard ||
	      	prevState.openBuilderPop !== this.state.openBuilderPop) {
	      	if (this.state.openCharCard || this.state.openComonCard || this.state.openBuilderPop) {
	      		if (this.builderScrollBar) {
	      			this.builderScrollBar.view.removeEventListener('wheel', this.onBuilderScrollHandler, false);
	      		}
			} else {
				if (this.builderScrollBar) {
					this.builderScrollBar.view.addEventListener('wheel', this.onBuilderScrollHandler, false);
				}
			}
	      }

	    if (prevState.worldBarFilter.selectedFilter !== this.state.worldBarFilter.selectedFilter) {
	    	// console.log(this.state.worldBarFilter);
	    	const selectedFilter = this.state.worldBarFilter.selectedFilter;
	    	const id = this.state.worldBarFilter[selectedFilter].id;

	    	this.setState({ search: "" });

	    	worldBuilders.map(type => {
		        // builderChecks[type.toLowerCase()] = false;
		        this.getBuilders(type.toLowerCase(), selectedFilter, id);
	      	})
	    }
    }

    componentWillUnmount() {
    	this.mounted = false;
        document.removeEventListener('mouseup', this.handleClickOutside);

        let main_pg = document.querySelector("#main-pg");
        if (main_pg) {
        	main_pg.classList.remove("rm-pd");
        }

        if (this.getAccessWithWorld_id) {
        	this.getAccessWithWorld_id();
        	this.getAccessWithWorld_id = null;
        }

    	if (this.verifySeason) {
    		this.verifySeason();
    		this.verifySeason = null;
    	}

    	if (this.getWorldWithDoc) {
    		this.getWorldWithDoc();
    		this.getWorldWithDoc = null;
    	}

    	if (this.seriesWithWorld) {
    		this.seriesWithWorld();
    		this.seriesWithWorld = null;
    	}

    	if (this.seasonWordCount) {
    		this.seasonWordCount();
    		this.seasonWordCount = null;
    	}

    	if (this.BuilderWithType) {
    		this.BuilderWithType();
    		this.BuilderWithType = null
    	}

        if (this.backgroundSettings) {
        	this.backgroundSettings();
        }

        if (this.firestoreEditor) {
        	Object.entries(this.firestoreEditor).map(([key, subs]) => subs());

        	this.firestoreEditor = {};
        }

        if (this.firestoreOn) {
        	Object.entries(this.firestoreOn).map(([key, subs]) => subs());

        	this.firestoreOn = {};
        }

        if (this.cardAssistant) {
        	this.cardAssistant();
        	this.cardAssistant = null;
        }

        if (this.builderAppearance) {
        	this.builderAppearance();
        	this.builderAppearance = null;
        }
    }

    handleClickOutside = (event) => {
		try {
			if (this.ref.setting_pop_div && this.ref.setting_pop_div.contains(event.target)) {
		        return;
	      	}

	      	if (this.ref.showWBFilter && this.ref.showWBFilter.contains(event.target)) {
	      		return;
	      	}

	      	if (this.ref.export_pop_div && this.ref.export_pop_div.contains(event.target)) {
		        return;
	      	}

	      	if (this.ref.showWBFilter && !this.ref.showWBFilter.contains(event.target)) {
	      		if (this.state.showWBFilter) this.setState({ showWBFilter: false });
	      	}

	      	if (this.ref.setting_pop && !this.ref.setting_pop.contains(event.target)) {
		        if (this.state.setting_pop) this.setState({ setting_pop: false });
	      	}

	      	if (this.ref.export_pop && !this.ref.export_pop.contains(event.target)) {
		        if (this.state.export_pop) this.setState({ export_pop: false });
	      	}

	      	if (this.ref.remove_pop && !this.ref.remove_pop.contains(event.target)) {
	      		if (this.state.trash_recover) this.setState({ trash_recover: false });
	      	}
		} catch (e) {
			console.log(e);
		}
    }

    verifyUserPage = (world_id, user_id) => {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				let unknown = true;

    				results.data.forEach(snap => {
    					const key = snap.id;
    					const val = snap.data();

    					if (val.auth === user_id) {
    						unknown = false;
    					} else if (val.user_id === user_id ||
    					(val.email_id === "defaultForAll" &&
    					val.user_id === "defaultForAll")) {
    						unknown = false;

    						this.setState({
								writeAccess: val.write,
								notHis: true
							});
    					}
    				});

    				if (unknown) {
    					getQueries.getWorldWithDoc(world_id, (err, result) => {
							if (err) {
								console.log(err);
							} else {
								if (result.status === 1) {
									if (result.data.user_id !== user_id) {
										return this.setState({ world_data: false });
									}
								} else {
									return this.setState({ world_data: false });
								}
							}
						});
    				}
    			}
    		}
    	}

    	this.getAccessWithWorld_id = realtimeGetQueries.getAccessWithWorld_id(world_id, callback);
    }

    verifySeason = (season_id) => {
    	// If season deleted redirect it
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 0) {
    				alert("Season is deleted by someone!");
    				this.setState({ world_data: false });
    			}
    		}
    	}

    	this.verifySeason = realtimeGetQueries.getSeasonWithDoc(season_id, callback);
    }

    getBeatStyles = (world_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				const beatStyles = result.data.beatStyles;

    				if (beatStyles) {
    					this.setState({
							beatStyles,
							size: beatStyles.fontSize,
							type: beatStyles.fontType,
							indentCheck: beatStyles.indentCheck || false,
							lineSpacing: beatStyles.lineSpacing || ""
						});
    				} else {
    					this.setState({ size: "font-size-11" });
    				}

    				this.setState(prevState => ({
				        ...prevState,
				        world_name: result.data.name || "",
				        worldBarFilter: {
				            ...prevState.worldBarFilter,
				            showInWorlds: {
				              	...prevState.worldBarFilter.showInWorlds,
				              	name: result.data.name || ""
				            }
				        }
				    }));
    			} else {
    				this.setState({ size: "font-size-11" });
    			}
    		}
    	}

    	this.getWorldWithDoc = realtimeGetQueries.getWorldWithDoc(world_id, callback);
    }

    getSeries = (world_id) => {
    	const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					let seriesList = {};

					results.data.forEach(snap => {
						const series_id = snap.id;
						const seriesName = snap.data().name;

						const clback = (err, result) => {
							if (err) {
								console.log(err);
							} else {
								if (result.data.docs.length > 0 ) {
									const seasonKey = result.data.docs[0].id;

									seriesList[series_id] = [series_id,  seriesName, seasonKey];
								}
							}
						}

                        getQueries.getLimitSeasonWithSeries_id(series_id, clback);
					});

					this.setState({ seriesList });
				} else {
					this.setState({ seriesList: [] });
				}
			}
		}

    	this.seriesWithWorld = realtimeGetQueries.getSeriesWithWorld_id(world_id, callback);
	}

    getWordCount = (season_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			console.log(result);
    			if (result.status === 1) {
    				let seasonCount_obj = result.data;

				  	let displayBookCount = true;
					let displayTodayCount = false;
					let includeGoal = true;
					let bookTotal = 0;
					let todayTotal = 0;
					let bookGoal = 0;
					let dailyGoal = 0;

				  	if (seasonCount_obj.display) {
				  		displayBookCount = seasonCount_obj.display.bookCount;
				  		displayTodayCount = seasonCount_obj.display.todayCount;
				  		includeGoal = seasonCount_obj.display.goal;
				  	}

				  	if (seasonCount_obj.count) {
				  		bookTotal = parseInt(seasonCount_obj.count);
				 	} else {
				 		this.setState({ isNoBookCount: true });
				 	}

					if (seasonCount_obj.bookGoal) {
					  	bookGoal = parseInt(seasonCount_obj.bookGoal);
					}

					if (seasonCount_obj.dailyGoal) {
				  		dailyGoal = parseInt(seasonCount_obj.dailyGoal);
				  	}

				  	if (seasonCount_obj.dailyCount) {
				  		let today = new Date().toDateString();

				  		if (seasonCount_obj.dailyCount[today]) {
				  			todayTotal = parseInt(seasonCount_obj.dailyCount[today]);
				  		}
				  	}

				  	this.setState(prevState => ({
				  		...prevState,
				  		wordCount: {
				  			...prevState.wordCount,
				  			displayBookCount, displayTodayCount, includeGoal,
				  			bookTotal, todayTotal, bookGoal, dailyGoal
				  		}
				  	}));
    			} else {
    				this.setState({
    					isNoBookCount: true,
    					wordCount: this.initWordCount
    				});
    			}
    		}
    	}

    	this.seasonWordCount = realtimeGetQueries.getSeasonWordCountDoc(season_id, callback);
    }

    getSeasons = (series_id, season_o_id) => {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			let world = {
					seasons: {}
				};

    			if (results.data.docs.length > 0) {
    				this.setState({ world });

    				results.data.forEach(snap => {
    					const season_id = snap.id;
						let sobj = snap.data();

						sobj["key"] = season_id;

						if (sobj.name) {
							sobj['edit'] = false;
						} else {
							sobj['edit'] = true;
						}

						sobj["count"] = 0;

						sobj["episodes"] = {};

						this.setState(prevState => ({
							...prevState,
							world: {
								...prevState.world,
								seasons: {
									...prevState.world.seasons,
									[season_id]: sobj
								}
							}
						}));

						if (season_id === season_o_id) {
							this.getEpisodes(season_id);
						}
    				});
    			} else {
    				this.setState({ world, filterLoading: false });
    			}
    		}
    	}

    	getQueries.getSeasonWithSeries_id(series_id, callback);
    }

    getEpisodes = (season_id) => {
    	try {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				let season_count = 0;

    				let episode_count_check = 0;

    				results.data.docChanges().forEach(change => {
    					const snap = change.doc;

    					const episode_id = snap.id;

						let episodeData = snap.data();

						if (episodeData.isDeleted === true) return;

    					if (change.type === "modified") {
    						if (!this.state.world.seasons[season_id].episodes[episode_id] && episodeData.isDeleted === false) {} else {
    							try {
									this.setState(prevState => ({
										...prevState,
										world: {
											...prevState.world,
											seasons: {
												...prevState.world.seasons,
												[season_id]: {
													...prevState.world.seasons[season_id],
													episodes: {
														...prevState.world.seasons[season_id].episodes,
														[episode_id]: {
															...prevState.world.seasons[season_id].episodes[episode_id],
															name: episodeData.name || "",
															pulse: episodeData.pulse || "",
															summary: episodeData.summary || ""
														}
													}
												}
											}
										}
									}));
								} catch (cErr) {console.log(cErr)};

								return;
    						}
						}

						if (change.type === "removed") return;

						if (episodeData.name) {
							episodeData['edit'] = false;
						} else {
							episodeData['edit'] = true;
						}

						const a = episode_count_check;
						episode_count_check++;

						episodeData["key"] = episode_id;
						episodeData['open'] = false;
						episodeData['showEpisode'] = true;
						episodeData["scenes"] = {};
						episodeData["count"] = 0;

						this.getScenes(season_id, episode_id, results.data.docs.length, a);
						this.getMessagesDetails(season_id, episode_id);

						this.setState(prevState => ({
							...prevState,
							world: {
								...prevState.world,
								seasons: {
									...prevState.world.seasons,
									[season_id]: {
										...prevState.world.seasons[season_id],
										episodes: {
											...prevState.world.seasons[season_id].episodes,
											[episode_id]: episodeData
										}
									}
								}
							}
						}));
    				});

    				this.setState({ filterLoading: false });
    			} else {
    				this.setState({ filterLoading: false });
    				setQueries.insertEpisode({
    					name: "",
    					created_date: new Date().toISOString(),
    					season_id: season_id,
    					sort: 0
    				}, (err, result) => {
    					if (err) {
    						console.log(err);
    					}
    				});
    			}
    		}
    	}


    		this.firestoreEditor[`episode_${season_id}`] = realtimeGetQueries.getEpisodesWithSeason_id(season_id, callback);
    	} catch (e) {
    		console.log(e);
    	}
	}

	getScenes = (season_id, episode_id, totalEpisodes, nowEpisode) => {
		if (!this.mounted) return;

		const callback = (error, results) => {
			if (error) {
				console.log(error);
			} else {
				if (results.data.docs.length > 0) {
					results.data.docChanges().forEach(change => {
						const snap = change.doc;

						const scene_id = snap.id;
						let scene_data = snap.data();

						if (scene_data.isDeleted) return;

						if (change.type === "added") {
							this.getCommentsList(scene_id);
						}

						if (change.type === "modified") {
							try {
								if (!this.state.world.seasons[season_id].episodes[episode_id]) {return;
								} else if (!this.state.world.seasons[season_id].episodes[episode_id].scenes[scene_id] && 
								scene_data.isDeleted === false) {} else {
									if (this.state.world.seasons[season_id].episodes[episode_id].scenes[scene_id].story !== scene_data.story) {
									// document.getElementById(scene_id).innerHTML = scene_data.story;

										this.setState(prevState => ({
											...prevState,
											world: {
												...prevState.world,
												seasons: {
													...prevState.world.seasons,
													[season_id]: {
														...prevState.world.seasons[season_id],
														episodes: {
															...prevState.world.seasons[season_id].episodes,
															[episode_id]: {
																...prevState.world.seasons[season_id].episodes[episode_id],
																scenes: {
																	...prevState.world.seasons[season_id].episodes[episode_id].scenes,
																	[scene_id]: {
																		...prevState.world.seasons[season_id].episodes[episode_id].scenes[scene_id],
																		story: scene_data.story
																	}
																}
															}
														}
													}
												}
											}
										}));

										return;
									}

									this.setState(prevState => ({
											...prevState,
											world: {
												...prevState.world,
												seasons: {
													...prevState.world.seasons,
													[season_id]: {
														...prevState.world.seasons[season_id],
														episodes: {
															...prevState.world.seasons[season_id].episodes,
															[episode_id]: {
																...prevState.world.seasons[season_id].episodes[episode_id],
																scenes: {
																	...prevState.world.seasons[season_id].episodes[episode_id].scenes,
																	[scene_id]: {
																		...prevState.world.seasons[season_id].episodes[episode_id].scenes[scene_id],
																		pulse: scene_data.pulse || "",
																		summary: scene_data.summary || "",
																		sort: scene_data.sort || 0
																	}
																}
															}
														}
													}
												}
											}
										}));
										return;
								}
							} catch (scErr) {console.log(scErr)};
						}

						if (change.type === "removed") return;

						if (scene_data.story) {
							scene_data['edit'] = false;
						} else {
							scene_data['edit'] = true;
						}

						scene_data["key"] = scene_id;
						scene_data['hideScene'] = true;

						this.getMessagesDetails(season_id, episode_id, scene_id);

						const story_count = scene_data.story || "";

						const sceneHTML = document.createElement("div");
						sceneHTML.innerHTML = story_count;

						let cc = 0;

						if (sceneHTML) {
							Array.from(sceneHTML.children).forEach(ele => {
								if (ele.innerText.trim()) {
									cc += ele.innerText.trim().split(/\s+/g).length;
								}
							});
						}

						scene_data["count"] = cc;

						updateQueries.updateScene(scene_id, {count: cc}, () => {});
						updateQueries.updateEpisode(episode_id, {
							count: parseInt(this.state.world.seasons[season_id].episodes[episode_id].count) + parseInt(cc)
						}, () => {});

						this.setState(prevState => ({
							...prevState,
							commentsList: {
								...prevState.commentsList,
								[scene_id]: {}
							},
							world: {
								...prevState.world,
								seasons: {
									...prevState.world.seasons,
									[season_id]: {
										...prevState.world.seasons[season_id],
										count: parseInt(prevState.world.seasons[season_id].count) + parseInt(cc),
										episodes: {
											...prevState.world.seasons[season_id].episodes,
											[episode_id]: {
												...prevState.world.seasons[season_id].episodes[episode_id],
												count: parseInt(prevState.world.seasons[season_id].episodes[episode_id].count) + parseInt(cc),
												scenes: {
													...prevState.world.seasons[season_id].episodes[episode_id].scenes,
													[scene_id]: scene_data
												}
											}
										}
									}
								}
							}
						}));
					});

					if (totalEpisodes === nowEpisode + 1) {
						if (this.state.isNoBookCount) {
							const { world_id, series_id } = this.props.match.params;
							const cc_count_cc = this.state.world.seasons[season_id].episodes[episode_id].count;

							mergeQueries.updateSeasonWordCount(season_id, {count: cc_count_cc}, () => {});

							getQueries.getSeriesWordCountDoc(series_id, (err, res) => {
								if (err) {
									console.log(err);
								} else {
									let s_count = cc_count_cc;

									if (res.status === 1 && res.data.count) {
										s_count = parseInt(res.data.count) + cc_count_cc;

										updateQueries.updateSeriesWordCount(series_id, {count:s_count}, () => {});
									} else {
										mergeQueries.updateSeriesWordCount(series_id, {count:s_count}, () => {});
									}
								}
							})

							getQueries.getWorldWordCountDoc(world_id, (err, res) => {
								if (err) {
									console.log(err);
								} else {
									let w_count = cc_count_cc;

									if (res.status === 1 && res.data.count) {
										w_count = parseInt(res.data.count) + cc_count_cc;

										updateQueries.updateWorldWordCount(world_id, {count:w_count}, () => {});
									} else {
										mergeQueries.updateWorldWordCount(world_id, {count:w_count}, () => {});
									}
								}
							});

							this.setState({ isNoBookCount: false })
						}
					}
				} else {
					this.setState({ filterLoading: false });
				}
			}
		}

		this.firestoreEditor[`episode_${episode_id}`] = realtimeGetQueries.getSceneWithEpisode_id(episode_id, callback);
	}

	getMessagesDetails = (season_id, episode_id, scene_id) => {
    	const user_id = localStorage.getItem("storyShop_uid");

    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				const cb = (err, res) => {
    					if (err) {
    						console.log(err);
    					} else {
    						let data = {};

    						if (res.status === 1) {
    							data = this.countMessages(user_id, results.data, res.data.chat_id);
    						} else {
    							data = this.countMessages(user_id, results.data, "startFrom");
    						}

    						let newMessages = data.newMessages;
    						let flag = data.flag;

    						if (scene_id) {
    							this.setState(prevState => ({
									...prevState,
									world: {
										...prevState.world,
										seasons: {
											...prevState.world.seasons,
											[season_id]: {
												...prevState.world.seasons[season_id],
												episodes: {
													...prevState.world.seasons[season_id].episodes,
													[episode_id]: {
														...prevState.world.seasons[season_id].episodes[episode_id],
														scenes: {
															...prevState.world.seasons[season_id].episodes[episode_id].scenes,
															[scene_id]: {
																...prevState.world.seasons[season_id].episodes[episode_id].scenes[scene_id],
																messages: newMessages,
																flag: flag
															}
														}
													}
												}
											}
										}
									}
								}));
    						} else {
    							this.setState(prevState => ({
									...prevState,
									world: {
										...prevState.world,
										seasons: {
											...prevState.world.seasons,
											[season_id]: {
												...prevState.world.seasons[season_id],
												episodes: {
													...prevState.world.seasons[season_id].episodes,
													[episode_id]: {
														...prevState.world.seasons[season_id].episodes[episode_id],
														messages: newMessages,
														flag: flag
													}
												}
											}
										}
									}
								}));
    						}
    					}
    				}

    				if (scene_id) {
    					getQueries.getSceneReadRecip(scene_id, user_id, cb);
    				} else {
    					getQueries.getEpisodeReadRecip(episode_id, user_id, cb);
    				}
    			}
    		}
    	}

    	if (scene_id) {
    		this.firebaseOn[`chat-${scene_id}`] = realtimeGetQueries.getSceneChat(scene_id, callback);
    	} else {
    		this.firebaseOn[`chat-${episode_id}`] = realtimeGetQueries.getEpisodeChats(episode_id, callback);
    	}
    }

    countMessages = (user_id, data, startFrom) => {
    	let messages = 0;
    	let flag = false;

    	data.forEach(snap => {
    		const chat_id = snap.id;
    		const chatData = snap.data();

    		if (chatData.deleted) return;

    		if (!flag && chatData.flag) {
    			flag = true;
    		}

    		if (chatData.user_id !== user_id) {
    			messages++;

    			if (chat_id === startFrom) {
    				messages = 0;
    			}
    		}
    	});

    	return {
    		newMessages: messages || "",
    		flag: flag
    	};
    }

    getCommentsList = (scene_id) => {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				const data = results.data;

    				data.docChanges().forEach(change => {
    					const snap = change.doc;
    					const comment_id = snap.id;
    					let comment_inf = snap.data();

    					if (change.type === "modified") {
    						if (comment_inf.deleted) {
    							let commentsList = this.state.commentsList;

    							delete commentsList[scene_id][comment_id];

    							return this.setState({ commentsList });
    						}
    					}

    					if (change.type === "removed") {
    						let commentsList = this.state.commentsList;

    						delete commentsList[scene_id][comment_id];

    						return this.setState({ commentsList });
    					}

    					// if (comment_inf.isResolved) return;
    					if (comment_inf.deleted) return;

    					let new_msg = this.checkNewCommentChat(comment_inf);

    					comment_inf["new_msg"] = new_msg;

    					this.setState(prevState => ({
    						...prevState,
    						commentsList: {
    							...prevState.commentsList,
    							[scene_id]: {
    								...prevState.commentsList[scene_id],
    								[comment_id]: comment_inf
    							}
    						},
    						commentsList_newItem: {
	    						...prevState.commentsList_newItem,
	    						[scene_id]: {
	    							...prevState.commentsList_newItem[scene_id],
	    							new_msg: new_msg
	    						}
	    					}
    					}));
    				})
    			} else {
    				this.setState(prevState => ({
    					...prevState,
    					commentsList: {
    						...prevState.commentsList,
    						[scene_id]: {}
    					}
    				}));
    			}
    		}
    	}

    	this.commenents[scene_id] = realtimeGetQueries.getSceneComments(scene_id, callback);
    }

    checkNewCommentChat = (comment_inf) => {
    	let new_msg = false;
    	const user_id = localStorage.getItem("storyShop_uid");

    	if (comment_inf.last_chat_comment_by !== user_id) {
    		if (!comment_inf[user_id]) {
    			new_msg = true;
    		} else if (comment_inf[user_id] !== comment_inf.last_chat_comment) {
    			new_msg = true;
    		}
    	}

    	return new_msg;
    }

    getBackgroundSettings = (user_id, season_id) => {
    	const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (result.status === 1) {
					const val = result.data;

					const {
						background_image, background_color, background, image_url
					} = val;

					let isColorChecked = true;
					let isPicChecked = false;

					if (background === "picture") {
						isColorChecked = false;
						isPicChecked = true;
					}

					this.setState(prevState => ({
						...prevState,
						background_settings: {
							...prevState.background_settings,
							background_image: background_image,
							background_color: background_color,
							isColorChecked: isColorChecked,
							isPicChecked: isPicChecked,
							image_url: image_url
						}
					}));
				} else {
					this.setState(prevState => ({
						...prevState,
						background_settings: {
							...prevState.background_settings,
							background_image: "",
							background_color: "#f4f4f4",
							isColorChecked: true,
							isPicChecked: false,
							image_url: ""
						}
					}));
				}
			}
		}

    	this.backgroundSettings = realtimeGetQueries.getBackgroundSettingWithUserid(season_id, user_id, callback);
	}

	getBuilders = (type, selectedFilter, id) => {
		let whichFields = `${type}Fields`;
	    let whichInitFields = `${type}InitFields`;

	    if (type === "character") {
		    whichFields = "charFields";
		    whichInitFields = "charInitFields";
	    }

	    const callback = (error, results) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (results.data.docs.length > 0) {
	    			let cardFields = {};
					let cOpen = false;

					if (this.state.builderChecks[type] && this.state.realChecks[type]) {
						cOpen = true;
					}

					let { worldBuilders } = this.state;

					results.data.forEach(snap => {
						cOpen = true;

						let cardKey = snap.id;

						const card_data = snap.data();

						if (card_data.isDeleted) return;

						if (selectedFilter === "showInSeason") {
							let got_appearance = false;

							if (card_data.name) {
								const appearance = this.getAppearance(card_data.name);

								if (appearance.length > 0) {
									got_appearance = true;
								}
							}

							if (!got_appearance && card_data.realAliases) {
								card_data.realAliases.map(tag => {
									if (got_appearance) return;

									const appearance = this.getAppearance(tag);

									if (appearance.length > 0) {
										got_appearance = true;
									}
								});
							}

							if (got_appearance) {
								const obj = this.handleBuilderCommon(card_data, cardKey, whichFields, whichInitFields);

								worldBuilders.push(snap.data().name);

								cardFields[cardKey] = obj;
							}
						} else {
							const obj = this.handleBuilderCommon(card_data, cardKey, whichFields, whichInitFields);

							worldBuilders.push(snap.data().name);

							cardFields[cardKey] = obj;
						}
					});

					this.setState(prevState => ({
						...prevState,
						worldBarLoading: false,
						builderChecks: {
							...prevState.builderChecks,
							[type]: cOpen
						},
						realChecks: {
							...prevState.realChecks,
							[type]: cOpen
						},
						[whichFields]: cardFields,
						[whichInitFields]: cardFields,
						worldBuilders: worldBuilders
					}));
	    		}
	    	}
	    }

	    if (selectedFilter === "showInSeries") {
	      	this.BuilderWithType = realtimeGetQueries.getBuildersWithSeries_id(type, id, callback);
	    } else {
	    	const { world_id } = this.props.match.params;
			this.BuilderWithType = realtimeGetQueries.getBuildersWithWorld_id(type, world_id, callback);
	    }
    }

    handleBuilderCommon = (card_data, cardKey, whichFields, whichInitFields) => {
    	if (card_data.relationship_list) {
			this.getCardRelationships(cardKey, whichFields, whichInitFields);
		}

		this.getBuilderAppearances(cardKey, whichFields, whichInitFields);

		let obj = this.makeCharFields(card_data);

		return JSON.parse(JSON.stringify(obj));
    }

    getCardRelationships = (builder_id, whichFields, whichInitFields) => {
    	const callback = (error, results) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (results.data.docs.length > 0) {
    				results.data.forEach(snap => {
    					const id = snap.id;
    					const rel_data = snap.data();

    					let data = {
    						type: rel_data.type,
    						charId: rel_data.card_1_id,
    						relation: rel_data.relationship_type
    					}

    					if (this.state[whichFields] && this.state[whichFields][builder_id]) {
    						this.setState(prevState => ({
								...prevState,
								[whichFields]: {
									...prevState[whichFields],
									[builder_id]: {
										...prevState[whichFields][builder_id],
										relation: {
											...prevState[whichFields][builder_id].relation,
											val: {
												...prevState[whichInitFields][builder_id].relation.val,
												[id]: data
											}
										}
									}
								}
							}));
    					}

    					if (this.state[whichInitFields] && this.state[whichInitFields][builder_id]) {
    						this.setState(prevState => ({
								...prevState,
								[whichInitFields]: {
									...prevState[whichInitFields],
									[builder_id]: {
										...prevState[whichInitFields][builder_id],
										relation: {
											...prevState[whichInitFields][builder_id].relation,
											val: {
												...prevState[whichInitFields][builder_id].relation.val,
												[id]: data
											}
										}
									}
								}
							}));
    					}
    				});
    			}
    		}
    	}

    	getQueries.getBuilderRelationships(builder_id, callback);
    }

    getBuilderAppearances = (builder_id, whichFields, whichInitFields) => {
  		const callback = (error, result) => {
  			if (error) {
  				console.log(error);
  			} else {
  				if (result.status === 1) {
  					this.setState(prevState => ({
						...prevState,
						[whichFields]: {
							...prevState[whichFields],
							[builder_id]: {
								...prevState[whichFields][builder_id],
								appearance: result.data.appearances || []
							}
						},
						[whichInitFields]: {
							...prevState[whichInitFields],
							[builder_id]: {
								...prevState[whichInitFields][builder_id],
								appearance: result.data.appearances || []
							}
						}
					}));
  				}
  			}
  		}

  		const { season_id } = this.props.match.params;

  		this.builderAppearance = realtimeGetQueries.getBuilderAppearances(builder_id, season_id, callback);
  	}

    onBeatScrollHandler = (e) => {
	    var elem =	this.beatScrollBar.view
	    // var elem = this.scrollElem;
	    var scrollTop = elem.scrollTop;
	    var scrollHeight = elem.scrollHeight;
	    var height = elem.clientHeight;
	    var wheelDelta = e.deltaY;
	    var isDeltaPositive = wheelDelta > 0;

	    if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
	      elem.scrollTop = scrollHeight;
	      return cancelScrollEvent(e);
	    }
	    else if (!isDeltaPositive && -wheelDelta > scrollTop) {
	      elem.scrollTop = 0;
	      return cancelScrollEvent(e);
	    }
    }

    onBuilderScrollHandler = (e) => {
	    var elem =	this.builderScrollBar.view
	    // var elem = this.scrollElem;
	    var scrollTop = elem.scrollTop;
	    var scrollHeight = elem.scrollHeight;
	    var height = elem.clientHeight;
	    var wheelDelta = e.deltaY;
	    var isDeltaPositive = wheelDelta > 0;

	    if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
	      elem.scrollTop = scrollHeight;
	      return cancelScrollEvent(e);
	    }
	    else if (!isDeltaPositive && -wheelDelta > scrollTop) {
	      elem.scrollTop = 0;
	      return cancelScrollEvent(e);
	    }
    }

	componentDidCatch = (error, info) => {
	    console.log(error, info)
	}

    saveSeriesWorldBarFilter = (series_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				this.setState(prevState => ({
    					...prevState,
    					worldBarFilter: {
    						...prevState.worldBarFilter,
    						showInSeries: {
    							...prevState.worldBarFilter.showInSeries,
    							name: result.data.name || ""
    						}
    					}
    				}));
    			} else {
    				this.setState(prevState => ({
    					...prevState,
    					worldBarFilter: {
    						...prevState.worldBarFilter,
    						showInSeries: {
    							...prevState.worldBarFilter.showInSeries,
    							name: ""
    						}
    					}
    				}));
    			}
    		}
    	}

    	getQueries.getSeriesWithDoc(series_id, callback);
    }

    saveSeasonWorldBarFilter = (season_id) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
    				this.setState(prevState => ({
    					...prevState,
    					worldBarFilter: {
    						...prevState.worldBarFilter,
    						showInSeason: {
    							...prevState.worldBarFilter.showInSeason,
    							name: result.data.name || ""
    						}
    					}
    				}));
    			} else {
    				this.setState(prevState => ({
    					...prevState,
    					worldBarFilter: {
    						...prevState.worldBarFilter,
    						showInSeason: {
    							...prevState.worldBarFilter.showInSeason,
    							name: ""
    						}
    					}
    				}));
    			}
    		}
    	}

    	getQueries.getSeasonWithDoc(season_id, callback);
    }

    saveWorldBarFilterIDS = (world_id, series_id, season_id) => {
    	this.setState(prevState => ({
        	...prevState,
        	worldBarFilter: {
        		...prevState.worldBarFilter,
        		showInWorlds: {
        			...prevState.worldBarFilter.showInWorlds,
        			id: world_id
        		},
        		showInSeries: {
        			...prevState.worldBarFilter.showInSeries,
        			id: series_id
        		},
        		showInSeason: {
        			...prevState.worldBarFilter.showInSeason,
        			id: season_id
        		},
        	}
        }));
    }

    changeBeatSave = (fields, type, season_id, episode_id="", scene_id="") => {
	      if (type === "scene") {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                episodes: {
							                  ...prevState.world.seasons[season_id].episodes,
							                  [episode_id]: {
								                    ...prevState.world.seasons[season_id].episodes[episode_id],
								                    scenes: {
									                      ...prevState.world.seasons[season_id].episodes[episode_id].scenes,
									                      [scene_id]: {
										                        ...prevState.world.seasons[season_id].episodes[episode_id].scenes[scene_id],
										                        name: fields.name,
										                        summary: fields.summary || "",
										                        notes: fields.notes || "",
										                        pulse: fields.pulse || ""
									                      }
								                    }
							                  }
						                }
					              }
				            }
			          },
			          openBeatCard: false
		        }));
	      } else if (type === "episode") {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                episodes: {
							                  ...prevState.world.seasons[season_id].episodes,
							                  [episode_id]: {
								                    ...prevState.world.seasons[season_id].episodes[episode_id],
								                    name: fields.name,
								                    summary: fields.summary || "",
								                    notes: fields.notes || "",
								                    pulse: fields.pulse || ""
							                  }
						                }
					              }
				            }
			          },
			          openBeatCard: false
		        }));
	      } else if (type === "season") {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                name: fields.name || "",
						                summary: fields.summary || "",
						                notes: fields.notes || ""
					              }
				            }
			          },
			          openBeatCard: false
		        }));
	      }
    }

    replaceAppearance = text => {
	    // this.state.worldBuilders.forEach(item => console.log(item))
	    const { season_id } = this.props.match.params;

	    const seasons = this.state.world.seasons;
	    console.log(seasons);return;
	    const season = seasons[season_id];
	    const episodes = season.episodes;

	    console.log(episodes);return;

	    Object.entries(episodes).map( ([episodeKey, episode]) => {
		    const { scenes } = episode;

		    Object.entries(scenes).map( ([sceneKey, scene]) => {
			    let newText = `<a>${text}</a>`
			    let ss = scene.story;

			    let index = ss.indexOf(text);
			    let first = ss.substring(0, index);
			    let last = ss.substring(index+text.length, ss.length);

			    let up = first + newText + last;

			    console.log(up);
		    });
	    });
    }

    makeCharFields = (fields) => {
	      let obj = {};

	      fields.name ? obj['name'] = { has: true, val: fields.name } : obj['name'] = { has: false, val: "" };
	      fields.description ? obj['description'] = { has: true, val: fields.description } : obj['description'] = { has: false, val: "" };
	      fields.photo ? obj['photo'] = { has: true, val: fields.photo } : obj['photo'] = { has: false, val: [] };
	      fields.realAliases ? obj['realAliases'] = { has: true, tags: fields.realAliases, val: '' } : obj['realAliases'] = { has: false, tags: [], val: "" };
	      fields.aliases ? obj['aliases'] = { has: true, tags: fields.aliases, val: '' } : obj['aliases'] = { has: false, tags: [], val: "" };
	      fields.birth ? obj['birth'] = { has: true, val: fields.birth } : obj['birth'] = { has: false, val: "" };
	      fields.death ? obj['death'] = { has: true, val: fields.death } : obj['death'] = { has: false, val: "" };
	      fields.marital ? obj['marital'] = { has: true, val: fields.marital } : obj['marital'] = { has: false, val: "" };
	      fields.dna ? obj["dna"] = {has: true, val: fields.dna} : obj["dna"] = { has: false, val: {} };
	      fields.internal_conflicts ? obj['internal_conflicts'] = { has: true, val: fields.internal_conflicts } : obj['internal_conflicts'] = { has: false, val: "" };
	      fields.orientation ? obj['orientation'] = { has: true, val: fields.orientation } : obj['orientation'] = { has: false, val: "" };
	      fields.habits ? obj['habits'] = { has: true, val: fields.habits } : obj['habits'] = { has: false, val: "" };
	      fields.personality ? obj['personality'] = { has: true, val: fields.personality } : obj['personality'] = { has: false, val: "" };
	      fields.working_notes ? obj['working_notes'] = { has: true, val: fields.working_notes } : obj['working_notes'] = { has: false, val: "" };
	      fields.start ? obj['start'] = { has: true, val: fields.start } : obj['start'] = { has: false, val: "" };
	      fields.thnicity ? obj['thnicity'] = { has: true, val: fields.thnicity } : obj['thnicity'] = { has: false, val: "" };
	      fields.gender ? obj["gender"] = {has: true, val: fields.gender} : obj["gender"] = { has: false, val: "" };
	      fields.external_conflicts ? obj['external_conflicts'] = { has: true, val: fields.external_conflicts } : obj['external_conflicts'] = { has: false, val: "" };
	      fields.physical_description ? obj["physical_description"] = {has: true, val: fields.physical_description} : obj["physical_description"] = { has: false, val: "" };
	      fields.availability ? obj["availability"] = {has: true, val: fields.availability} : obj["availability"] = { has: false, val: "" };
	      fields.occupation ? obj["occupation"] = {has: true, val: fields.occupation} : obj["occupation"] = { has: false, val: "" };
	      fields.background ? obj["background"] = {has: true, val: fields.background} : obj["background"] = { has: false, val: "" };
	      fields.end ? obj["end"] = {has: true, val: fields.end} : obj["end"] = { has: false, val: "" };
	      fields.alignment ? obj["alignment"] = {has: true, val: fields.alignment} : obj["alignment"] = { has: false, val: {goods: '', evils: '', neutrals: ''} };
	      fields.ethnicity ? obj["ethnicity"] = {has: true, val: fields.ethnicity} : obj["ethnicity"] = { has: false, val: "" };
	      fields.relationship_list && fields.relationship_list.length > 0 ? obj["relation"] = {has: true, val: {}} : obj["relation"] = {has: false, val: {}};

	      obj["ss_background_image"] = fields.ss_background_image || "";
	      obj["category"] = fields.category;
	      obj["cardAvatar"] = fields.cardAvatar;
	      obj["world_id"] = fields.world_id;
	      obj["series_id"] = fields.series_id;
	      obj["season_id"] = fields.season_id;

	      return obj;
    }

    setWrapperRef = (key, node) => {
        this.ref[key] = node;
    }

    getAccess = (access_key) => {
		const callback = (error, Results) => {
			if (error) {
				console.log(error);
			} else {
				if (Results.status === 1 ) {

					this.setState({
						writeAccess: Results.data.write,
						notHis: true
					})

				}
			}
		}
		getQueries.getAccessWithDoc(access_key, callback);
    }

    scrollToBottom = () => {
	      setTimeout(() => {
		        window.scrollTo(0, window.pageYOffset + 100);
	      }, 200);
    }

    appendNewEpisode = (episode_id, sort) => {
	    let season_id = this.state.newSeasonId;
	    if (!season_id) return;
	    const season = this.state.world.seasons[season_id];
        const { episodes } = season;

	    const created_date = new Date().toISOString();
	    let dbsort = 0

	    if (episodes) {
	    	dbsort = Object.keys(episodes).length;
	    }

	    if (sort !== undefined) {
	      	dbsort = sort;
	    }

	    const data = {
	    	created_date,
	    	season_id,
	    	sort: dbsort
	    }

	    const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			const key = result.key;

	    			if  (sort !== undefined) {
						backendProcessQuery.updateEpisodesOrder(season_id, key, dbsort);
					}

					let episode = {
			            name: "",
				        key,
				        season_id,
			            edit: true,
				        notes: "",
				        summary: "",
				        created_date,
				        showEpisode: true,
			            scenes: {},
						sort: dbsort
			        };

					if (JSON.stringify(this.state.EEExpanded) !== "{}") {
						episode["showEpisode"] = false;
					}

			        this.setState(prevState => ({
			            ...prevState,
				          world: {
					            ...prevState.world,
					            seasons: {
						              ...prevState.world.seasons,
						              [season_id]: {
							                ...prevState.world.seasons[season_id],
							                episodes: {
								                ...prevState.world.seasons[season_id].episodes,
								                [key]: episode
							                }
						              }
					            }
				          }
			        }));

				    this.scrollToBottom();
	    		}
	    	}
	    }

	    return setQueries.insertEpisode(data, callback);
    }

    cloneNewEpisode = (episode_id, sort) => {
	    let season_id = this.state.newSeasonId;
	    if (!season_id) return;

	    const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			let data = result.data;

	    			const season = this.state.world.seasons[season_id];
        			const { episodes } = season;

	    			const created_date = new Date().toISOString();
				    let dbsort = 0

				    if (episodes) {
				    	dbsort = Object.keys(episodes).length;
				    }

				    if (sort !== undefined) {
				      	dbsort = sort;
				    }

	    			data["created_date"] = created_date;
	      			data["update_date"] = created_date;
	      			data["sort"] = dbsort;

	      			getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
			    		if (err) {
			    			console.log(err);
			    		} else {
			    			if (res.status === 1) {
			    				const newCount = res.data.count + data.count;

			    				updateQueries.updateSeasonWordCount(season_id, {count: newCount}, (e, r) => {});
			    			}
			    		}
			    	});

	      			const cb = (err, res) => {
	      				if (err) {
	      					console.log(err);
	      				} else {
	      					if (res.status === 1) {
	      						const key = res.key;

	      						if  (sort !== undefined) {
	      							backendProcessQuery.updateEpisodesOrder(season_id, key, dbsort);
	      						}

	      						/*const episode = {
						            name: data.name || "",
							        key,
							        season_id,
						            open: false,
						            edit: true,
							        notes: data.notes || "",
							        summary: data.summary || "",
							        created_date,
							        pulse: data.pulse || "",
							        showEpisode: true,
						            scenes: data.scenes || {},
									sort: dbsort
						        };

						        this.setState(prevState => ({
						            ...prevState,
							        world: {
								        ...prevState.world,
								        seasons: {
									        ...prevState.world.seasons,
									        [season_id]: {
										        ...prevState.world.seasons[season_id],
										        episodes: {
											        ...prevState.world.seasons[season_id].episodes,
											        [key]: episode
										        }
									        }
								        }
							        }
						        }));*/

	      						getQueries.getSceneWithEpisode_id(episode_id, (err1, res1) => {
	      							if (err1) {
	      								console.log(err1);
	      							} else {
	      								if (res1.data.docs.length > 0) {
	      									let cc = 0;

	      									res1.data.forEach(scene_snap => {
	      										let scene_data = scene_snap.data();

	      										const sc_index = cc;
	      										cc++;

	      										scene_data["created_date"] = created_date;
								      			scene_data["update_date"] = created_date;
								      			scene_data["episode_id"] = key;
								      			scene_data["sort"] = sc_index;

								      			setQueries.insertScene(scene_data, (e, r) => {
								      				const sc_key = r.key;

									    			/*const scene = {
											            edit: true,
												        key: sc_key,
												        episode_id: key,
												        created_date,
											            name: "Scene",
											            story: "",
												        notes: "",
												        summary: "",
												        hideScene: true,
														sort: sc_index
											        }

											        this.setState(prevState => ({
															...prevState,
															  world: {
																	...prevState.world,
																	seasons: {
																		  ...prevState.world.seasons,
																		  [season_id]: {
																				...prevState.world.seasons[season_id],
																				episodes: {
																					  ...prevState.world.seasons[season_id].episodes,
																					  [key]: {
																							...prevState.world.seasons[season_id].episodes[key],
																							open: false,
																							scenes: {
																								...prevState.world.seasons[season_id].episodes[key].scenes,
																								[sc_key]: scene
																							}
																					  }
																				}
																		  }
																	}
															  }
														}));*/
								      			});
	      									});
	      								}
	      							}
	      						});

	      						this.scrollToBottom();
	      					}
	      				}
	      			}

	      			setQueries.insertEpisode(data, cb);
	    		}
	    	}
	    }

	    getQueries.getEpisodeWithDoc(episode_id, callback);
    }

    appendNewScene = (episodeKey, sort) => {
	    let season_id = this.state.newSeasonId;
	    if (!season_id) return;
	    const season = this.state.world.seasons[season_id];
        const episode = season.episodes[episodeKey];
	    const episode_id = episode.key;
        const scenes = episode.scenes;

	    const created_date  = new Date().toISOString();
	    let dbsort = 0;

	    if (scenes) {
	    	dbsort = Object.keys(scenes).length;
	    }

		if (sort !== undefined) {
			dbsort = sort;
		}

	    const data = {
	    	name: "Scene",
	    	created_date,
	    	episode_id: episodeKey,
	    	sort: dbsort
	    }

	    const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			const key = result.key;

	    			if (sort !== undefined) {
	    				backendProcessQuery.updateScenesOrder(episodeKey, key, dbsort);
	    			}

	    			const scene = {
			            edit: true,
				        key,
				        episode_id: episodeKey,
				        created_date,
			            name: "Scene",
			            story: "",
				        notes: "",
				        summary: "",
				        hideScene: true,
						sort: dbsort
			        }

			        this.setState(prevState => ({
							...prevState,
							  world: {
									...prevState.world,
									seasons: {
										  ...prevState.world.seasons,
										  [season_id]: {
												...prevState.world.seasons[season_id],
												episodes: {
													  ...prevState.world.seasons[season_id].episodes,
													  [episodeKey]: {
															...prevState.world.seasons[season_id].episodes[episodeKey],
															open: false,
															scenes: {
																...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
																[key]: scene
															}
													  }
												}
										  }
									}
							  }
						}));

	    			this.scrollToBottom();
	    		}
	    	}
	    }

	    setQueries.insertScene(data, callback);
    }

    cloneNewScene = (episodeKey, scene_id, sort) => {
	    let season_id = this.state.newSeasonId;
	    if (!season_id) return;

	    const callback = (error, result) => {
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		if (result.status === 1) {
	    			let data = result.data;

	    			const season = this.state.world.seasons[season_id];
        			const episode = season.episodes[episodeKey];
        			const scenes = episode.scenes;

	    			const created_date = new Date().toISOString();
				    let dbsort = 0;

				    if (scenes) {
				    	dbsort = Object.keys(scenes).length;
				    }

					if (sort !== undefined) {
						dbsort = sort;
					}

	    			data["created_date"] = created_date;
					data["update_date"] = created_date;
					data["sort"] =  dbsort;

					getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
			    		if (err) {
			    			console.log(err);
			    		} else {
			    			if (res.status === 1) {
			    				const newCount = res.data.count + data.count;

			    				updateQueries.updateSeasonWordCount(season_id, {count: newCount}, (e, r) => {});
			    			}
			    		}
			    	});

					const cb = (err, res) => {
						if (err) {
							console.log(err);
						} else {
							if (res.status === 1) {
								const key = res.key;

								if (sort !== undefined) {
									backendProcessQuery.updateScenesOrder(episodeKey, key, dbsort);
								}

								const scene = {
						            edit: true,
							        key,
							        episode_id: episodeKey,
							        created_date,
						            name: "Scene",
						            story: data.story || "",
							        notes: data.notes || "",
							        summary: data.summary || "",
							        pulse: data.pulse || "",
							        hideScene: true,
									sort: dbsort
						        }

						        this.setState(prevState => ({
										...prevState,
										  world: {
												...prevState.world,
												seasons: {
													  ...prevState.world.seasons,
													  [season_id]: {
															...prevState.world.seasons[season_id],
															episodes: {
																  ...prevState.world.seasons[season_id].episodes,
																  [episodeKey]: {
																		...prevState.world.seasons[season_id].episodes[episodeKey],
																		open: false,
																		count: prevState.world.seasons[season_id].episodes[episodeKey] + data.count,
																		scenes: {
																			...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
																			[key]: scene
																		}
																  }
															}
													  }
												}
										  }
									}));

								this.scrollToBottom();
							}
						}
					}

					setQueries.insertScene(data, cb);
	    		}
	    	}
	    }

	    getQueries.getSceneWithDoc(scene_id, callback);
    }

    removeEpisode = (season_id, episode_id) => {
    	const { world_id, series_id } = this.props.match.params;
    	const trashData = {
    		type: "episode",
    		type_id: episode_id,
    		world_id,
    		series_id,
    		season_id,
    		episode_id: episode_id,
    		trash_at: new Date(),
    		trash_timestamp: new Date().getTime()
    	}

    	updateQueries.updateEpisode(episode_id, {isDeleted: true}, (err, res) => {});
    	updateQueries.updateTrash(episode_id, trashData, (err, res) => {});

    	let world = this.state.world;
    	let seasons = world.seasons;
    	if (!seasons) return;
    	let season = seasons[season_id];
    	if (!season) return;
    	let episodess = season.episodes;
    	if (!episodess) return;
    	let episodee = episodess[episode_id];

    	season["count"] = season.count - episodee.count;

    	getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
    		if (err) {
    			console.log(err);
    		} else {
    			if (res.status === 1) {
    				const newCount = res.data.count - episodee.count;

    				updateQueries.updateSeasonWordCount(season_id, {count: newCount}, (e, r) => {});
    			}
    		}
    	});

    	delete episodess[episode_id];

    	this.setState({world});

    	/*if (Object.entries(episodess).length === 0) {
    		this.appendNewEpisode();
    	}*/
    }

    removeScene = (season_id, episode_id, scene_id) => {
    	let world = this.state.world;
    	let seasons = world.seasons;
    	if (!seasons) return;
    	let season = seasons[season_id];
    	if (!season) return;
    	let episodes = season.episodes;
    	if (!episodes) return;
    	let episode = episodes[episode_id];
    	if (!episode) return;
    	let sceness = episode.scenes;
    	if (!sceness) return;
    	let scene = sceness[scene_id];
    	if (!scene) return;

    	season["count"] = season.count - parseInt(scene.count || 0);

    	const { world_id, series_id } = this.props.match.params;
    	const trashData = {
    		type: "scene",
    		type_id: scene_id,
    		world_id,
    		series_id,
    		season_id,
    		episode_id: episode_id,
    		scene_id,
    		trash_at: new Date(),
    		trash_timestamp: new Date().getTime()
    	}

    	updateQueries.updateScene(scene_id, {isDeleted: true}, (err, res) => {});
    	updateQueries.updateTrash(scene_id, trashData, (err, res) => {});

    	updateQueries.updateEpisode(episode_id, {
    		count: parseInt(episode.count || 0) - parseInt(scene.count || 0)
    	}, (e, r) => {});

    	episode["count"] = parseInt(episode.count || 0) - parseInt(scene.count || 0);

    	getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
    		if (err) {
    			console.log(err);
    		} else {
    			if (res.status === 1) {
    				const newCount = res.data.count - parseInt(scene.count || 0);

    				updateQueries.updateSeasonWordCount(season_id, {
    					count: newCount
    				}, (e, r) => {});
    			}
    		}
    	});

    	delete sceness[scene_id];

    	this.setState({world});
    }

    handleBtnOpen = (episodeKey) => {
	      let season_id = this.state.newSeasonId;

	      if (!season_id) return;

	      const season = this.state.world.seasons[season_id];
        const episode = season.episodes[episodeKey];
	      let open = episode.open;

        this.setState(prevState => ({
            ...prevState,
	          world: {
		            ...prevState.world,
		            seasons: {
			              ...prevState.world.seasons,
			              [season_id]: {
				                ...prevState.world.seasons[season_id],
				                episodes: {
					                  ...prevState.world.seasons[season_id].episodes,
					                  [episodeKey]: {
						                    ...prevState.world.seasons[season_id].episodes[episodeKey],
						                    open: !open
					                  }
					              }
			              }
		            }
	          }
        }))
    }

    handleChange = (id, event) => {
		try {
			const { value } = event.target;
	    	let season_id = this.state.newSeasonId;

	    	if (!season_id || !id) return;

        	let obj = JSON.parse(id);

        	if (obj.sceneId) {
            	this.setState(prevState => ({
		       		...prevState,
		       		 world: {
			            ...prevState.world,
			            seasons: {
				            ...prevState.world.seasons,
				            [season_id]: {
					            ...prevState.world.seasons[season_id],
					            episodes: {
						            ...prevState.world.seasons[season_id].episodes,
						            [obj.episodeId]: {
						                ...prevState.world.seasons[season_id].episodes[obj.episodeId],
						                scenes: {
							                ...prevState.world.seasons[season_id].episodes[obj.episodeId].scenes,
							                [obj.sceneId]: {
							                    ...prevState.world.seasons[season_id].episodes[obj.episodeId].scenes[obj.sceneId],
							                    name: value
							                }
						                }
						            }
					            }
				            }
			            }
		            }
            	}))
        	} else if (obj.episodeId) {
		        this.setState(prevState => ({
		            ...prevState,
		            world: {
			            ...prevState.world,
			            seasons: {
				            ...prevState.world.seasons,
				            [season_id]: {
					            ...prevState.world.seasons[season_id],
					            episodes: {
						            ...prevState.world.seasons[season_id].episodes,
						            [obj.episodeId]: {
						                ...prevState.world.seasons[season_id].episodes[obj.episodeId],
						                name: value
						            }
					            }
				            }
			            }
		            }
            	}))
        	} else {
		        this.setState(prevState => ({
		            ...prevState,
		            world: {
			            ...prevState.world,
			            seasons: {
				            ...prevState.world.seasons,
				            [season_id]: {
					            ...prevState.world.seasons[season_id],
					            name: value
				            }
			            }
		            }
            	}))
        	}
		} catch (e) {
			console.log(e);

			db.ref().child("error_log")
			  .push({
				user_id: localStorage.getItem("storyShop_uid") || "",
				ErrorFunction: "handleChange",
				Date: new Date(),
				WorldID: this.props.match.params.world_id,
				SeasonID: this.props.match.params.season_id,
				error_message: e || ""
			});
		}
    }

    handleEditorChange = (id, text, medium) => {
		try {
			let state = this.state;
        	const storyText = medium.origElements.innerText;
        	const obj = JSON.parse(id);
	      	let season_id = this.state.newSeasonId;

	      	if (!season_id) return;

			if (this.editorTimmer) {
				clearTimeout(this.editorTimmer);
				this.editorTimmer = null;
			}

			if (this.state.showCardList) {
				//console.log(text, medium);
			}

	      	if (!this.state.saveText) {
		        this.editorTimmer = setTimeout(() => {
					try {
						if (!obj.episodeId) return;
						if (!this.state.world) return;
						if (!this.state.world.seasons) return;
						if (!this.state.world.seasons[season_id]) return;
						if (!this.state.world.seasons[season_id].episodes) return;
						if (!this.state.world.seasons[season_id].episodes[obj.episodeId]) return;
						if (!this.state.world.seasons[season_id].episodes[obj.episodeId].scenes[obj.sceneId]) return;

			          	if (this.state.world.seasons[season_id].episodes[obj.episodeId].scenes[obj.sceneId].key) {
				            this.handleSceneEdit(obj.episodeId, obj.sceneId);
			          	}
					} catch (e) {
						console.log(e);

						db.ref().child("error_log")
						.push({
							user_id: localStorage.getItem("storyShop_uid") || "",
							Date: new Date(),
							WorldID: this.props.match.params.world_id,
							SeasonID: this.props.match.params.season_id,
							ErrorFunction: "editorTimmer",
							error_message: e || ""
						});
					}
		        }, 1000);
	      	}

        	this.setState(prevState => ({
		        ...prevState,
		        world: {
			          ...prevState.world,
			          seasons: {
				            ...prevState.world.seasons,
				            [season_id]: {
					              ...prevState.world.seasons[season_id],
					              episodes: {
						                ...prevState.world.seasons[season_id].episodes,
						                [obj.episodeId]: {
							                  ...prevState.world.seasons[season_id].episodes[obj.episodeId],
							                  scenes: {
							                      ...prevState.world.seasons[season_id].episodes[obj.episodeId].scenes,
							                      [obj.sceneId]: {
								                        ...prevState.world.seasons[season_id].episodes[obj.episodeId].scenes[obj.sceneId],
								                        story: text,
								                        ['storyText']: storyText
							                      }
							                  }
						                }
					              }
				            }
			          }
		        }
        	}))
		} catch (e) {
			console.log(e);

			db.ref().child("error_log")
			.push({
				user_id: localStorage.getItem("storyShop_uid") || "",
				Date: new Date(),
				WorldID: this.props.match.params.world_id,
				SeasonID: this.props.match.params.season_id,
				ErrorFunction: "handleEditorChange",
				error_message: e || ""
			});
		}
    }

    handleSeasonEdit = () => {
    	this.setState({ saveText: true });

    	let season_id = this.state.newSeasonId;
    	const { writeAccess } = this.state;
    	if (!writeAccess) return;
	    if (!season_id) return;

	    const { world_id, series_id } = this.props.match.params;
	    const user_id = localStorage.getItem("storyShop_uid");
	    let season = this.state.world.seasons[season_id];
        const name = season.name || "";

        if (!name) return;

        const valid = this.isValid(name.trim());

        if (valid) {
	        const update_date = new Date().toISOString();

	        const worldCB = (error, result) => {
	        	if (error) {
	        		console.log(error);
	        	} else if (result.status === 1) {
	        		const world_name = result.data.name;

	        		if (world_name && world_name === "UNKNOWN") {
	        			const data = {
	        				name,
				            user_id,
				            update_date
	        			}

	        			updateQueries.updateWorld(world_id, data, (err, res) => {});
	        		}
	        	}
	        }

	        const seriesCB = (error, result) => {
	        	if (error) {
	        		console.log(error);
	        	} else if (result.status === 1) {
	        		const series_name = result.data.name;

	        		if (series_name && series_name === "UNKNOWN") {
	        			const data = {
	        				name,
	        				user_id,
	        				world_id,
				            update_date
	        			}

	        			updateQueries.updateSeries(series_id, data, (err, res) => {});
	        		}
	        	}
	        }

	        const data = {
	        	name, update_date
	        }

	        const callback = (error, result) => {
	        	if (error) {
	        		console.log(error);
	        	} else {
	        		this.setState((prevState) => ({
			            ...prevState,
			            world: {
				              ...prevState.world,
				              seasons: {
					                ...prevState.world.seasons,
					                [season_id]: {
						                  ...prevState.world.seasons[season_id],
						                  edit: false,
					                }
				              }
			            }
           	 		}))
	        	}
	        }

	        getQueries.getWorldWithDoc(world_id, worldCB);
	        getQueries.getSeriesWithDoc(series_id, seriesCB);
            updateQueries.updateSeason(season_id, data, callback);
        } else {
            this.setState({ open: true });
        }
    }

    handleSeasonClick = () => {
	      let season_id = this.state.newSeasonId;
	      if (!season_id) return;

        let { writeAccess } = this.state;

	      if (writeAccess) {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                edit: true
					              }
				            }
			          }
		        }))
	      }
    }

    handleEpisodeEdit = (episodeKey) => {
    	this.setState({saveText: true});
    	let season_id = this.state.newSeasonId;
    	const { writeAccess } = this.state;

    	if (!season_id) return;
    	if (!writeAccess) return;

    	let season = this.state.world.seasons[season_id];
    	if (!season) return;
    	let episode = season.episodes[episodeKey];
    	if (!episode) return;
    	const name = episode.name || "";

    	if (!name) return;

    	const valid = this.isValid(name.trim());
    	const update_date = new Date().toISOString();

    	if (valid) {
    		const data = {
    			name, update_date, season_id
    		}

    		const callback = (error, result) => {
    			if (error) {
    				console.log(error);
    			} else if (result.status === 1) {
    				this.setState(prevState => ({
			            ...prevState,
			            world: {
				              ...prevState.world,
				              seasons: {
					                ...prevState.world.seasons,
					                [season_id]: {
						                  ...prevState.world.seasons[season_id],
						                  episodes: {
							                    ...prevState.world.seasons[season_id].episodes,
							                    [episodeKey]: {
							                        ...prevState.world.seasons[season_id].episodes[episodeKey],
							                        edit: false
							                    }
						                  }
					                }
				              }
			            }
	            	}));

    				if (episode.scenes && Object.entries(episode.scenes).length < 1) {
				        this.appendNewScene(episodeKey);
			        }
    			}
    		}

    		updateQueries.updateEpisode(episodeKey, data, callback);
    	} else {
    		this.setState({open: true});
    	}
    }

    handleEpisodeClick = (episodeKey) => {
	      let season_id = this.state.newSeasonId;
	      if (!season_id) return;

        let { writeAccess } = this.state;

	      if (writeAccess) {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                episodes: {
							                  ...prevState.world.seasons[season_id].episodes,
							                  [episodeKey]: {
								                    ...prevState.world.seasons[season_id].episodes[episodeKey],
								                    edit: true
							                  }
							              }
					              }
				            }
			          }
		        }))
	      }
    }

    handleSceneEdit = (episodeKey, sceneKey, outclick=false) => {
    	this.setState({saveText: true});
    	let season_id = this.state.newSeasonId;
    	const { writeAccess } = this.state;

    	const { world_id, series_id } = this.props.match.params;

    	if (!season_id) return;
    	if (!writeAccess) return;

    	let season = this.state.world.seasons[season_id];
    	if (!season) return;
    	let seasonCount = season.count || 0;
    	const episode = season.episodes[episodeKey];
    	if (!episode) return;
    	let episodeCount = episode.count || 0;
    	const scene = episode.scenes[sceneKey];
    	if (!scene) return;
    	let sceneCount = scene.count || 0;

    	const name = scene.name || "Scene";
        let story = scene.story || "";

        const testingStory = /<p|<br|<div/.test(story);

        if (!testingStory) {
        	story = `<p>${story}</p>`;
        }

		// Removing old count of episode from season
		let newSeasonCount = (this.state.wordCount.bookTotal || seasonCount) - episodeCount;
		// Removing old count of scene from episode
		let newEpisodeCount = episodeCount - sceneCount;

		this.setState({ isNoBookCount: false });

		const sceneHTML = document.createElement("div");
		sceneHTML.innerHTML = story;

		if (sceneHTML) {
			sceneCount = 0;

			Array.from(sceneHTML.children).forEach(ele => {
				if (ele.innerText.trim()) {
					sceneCount += ele.innerText.trim().split(/\s+/g).length;
				}
			});
		}

		// Adding new count of scene
		newEpisodeCount = newEpisodeCount + sceneCount;
		// Adding new count of scene
		newSeasonCount = newSeasonCount + newEpisodeCount;

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			}
		}

		const seasonWordCB = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				const today = new Date().toDateString();
				const NewCount = newSeasonCount;

				if (result.status === 1) {
					let seasonWord = result.data;

					const OldCount = seasonWord.count || 0;
					let oldDailyCount = 0;

					// Get Today Previous Count
					if (seasonWord.dailyCount) {
						if (seasonWord.dailyCount[today]) {
							oldDailyCount = seasonWord.dailyCount[today];
						}
					}

					this.updateWorldSeriesCount(world_id, series_id, OldCount, NewCount);

					const todayCount = parseInt(NewCount) - parseInt(OldCount);

					let countData = {
						count: NewCount,
						season_id: season_id,
						world_id: world_id,
						series_id: series_id
					}

					if (todayCount > 0) {
						countData[`dailyCount.${today}`] = todayCount + parseInt(oldDailyCount);
					}

					updateQueries.updateSeasonWordCount(season_id, countData, callback);
				} else {
					let countData = {
						count: NewCount,
						season_id: season_id,
						world_id: world_id,
						series_id: series_id
					}

					countData[`dailyCount.${today}`] = NewCount;

					mergeQueries.updateSeasonWordCount(season_id, countData, callback);

					this.updateWorldSeriesCount(world_id, series_id, 0, NewCount);
				}
			}
		}

		const update_date = new Date().toISOString();

		const episodeData = {
			count: newEpisodeCount
		}

		const sceneData = {
			count: sceneCount,
			name,
			story,
			episode_id: episodeKey,
			update_date
		}

		const sceneCallback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				if (outclick) {
						                   this.setState(prevState => ({
							                     ...prevState,
							                     world: {
								                       ...prevState.world,
								                       seasons: {
									                         ...prevState.world.seasons,
									                         [season_id]: {
										                           ...prevState.world.seasons[season_id],
																							 count: newSeasonCount,
										                           episodes: {
											                             ...prevState.world.seasons[season_id].episodes,
											                             [episodeKey]: {
											                                 ...prevState.world.seasons[season_id].episodes[episodeKey],
																											 count: newEpisodeCount,
											                                 scenes: {
												                                   ...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
												                                   [sceneKey]: {
												                                       ...prevState.world.seasons[season_id].episodes[episodeKey].scenes[sceneKey],
												                                       edit: false,
																															 count: sceneCount
												                                   }
											                                 }
											                             }
										                           }
									                         }
								                       }
							                     }
						                   }));
					                 }
					                 else {
						                   this.setState(prevState => ({
							                     ...prevState,
							                     world: {
								                       ...prevState.world,
								                       seasons: {
									                         ...prevState.world.seasons,
									                         [season_id]: {
										                           ...prevState.world.seasons[season_id],
																							 count: newSeasonCount,
										                           episodes: {
											                             ...prevState.world.seasons[season_id].episodes,
											                             [episodeKey]: {
											                                 ...prevState.world.seasons[season_id].episodes[episodeKey],
																											 count: newEpisodeCount,
											                                 scenes: {
												                                   ...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
												                                   [sceneKey]: {
												                                       ...prevState.world.seasons[season_id].episodes[episodeKey].scenes[sceneKey],
																															 count: sceneCount
												                                   }
											                                 }
											                             }
										                           }
									                         }
								                       }
							                     }
						                   }));
					                 }
			}
		}

		getQueries.getSeasonWordCountDoc(season_id, seasonWordCB);
		updateQueries.updateEpisode(episodeKey, episodeData, callback);
		updateQueries.updateScene(sceneKey, sceneData, sceneCallback);
    }

    updateWorldSeriesCount = (world_id, series_id, OldCount, NewCount) => {
    	const callback = (error, result) => {
    		if (error) {
    			console.log(error);
    		}
    	}

    	const worldCB = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
	    			const countData = {
	    				count: (parseInt(result.data.count || 0) - parseInt(OldCount)) + parseInt(NewCount),
	    				world_id: world_id
	    			}

	    			updateQueries.updateWorldWordCount(world_id, countData, callback);
	    		} else {
	    			const countData = {
	    				count: parseInt(NewCount),
	    				world_id: world_id
	    			}

	    			mergeQueries.updateWorldWordCount(world_id, countData, callback);
	    		}
	    	}
    	}

    	const seriesCB = (error, result) => {
    		if (error) {
    			console.log(error);
    		} else {
    			if (result.status === 1) {
	    			const countData = {
	    				count: (parseInt(result.data.count || 0) - parseInt(OldCount)) + parseInt(NewCount),
	    				world_id: world_id,
	    				series_id: series_id
	    			}

	    			updateQueries.updateSeriesWordCount(series_id, countData, callback);
	    		} else {
	    			const countData = {
	    				count: parseInt(NewCount)
	    			}

	    			mergeQueries.updateSeriesWordCount(series_id, countData, callback);
	    		}
	    	}
    	}

    	getQueries.getWorldWordCountDoc(world_id, worldCB);
    	getQueries.getSeriesWordCountDoc(series_id, seriesCB);
    }

    handleSceneShowChange = (episodeKey, sceneKey, event) => {
	      let season_id = this.state.newSeasonId;
	      if (!season_id) return;

	      const val = event.target.checked;

        this.setState(prevState => ({
		        ...prevState,
		        world: {
			          ...prevState.world,
			          seasons: {
				            ...prevState.world.seasons,
				            [season_id]: {
					              ...prevState.world.seasons[season_id],
					              episodes: {
						                ...prevState.world.seasons[season_id].episodes,
						                [episodeKey]: {
							                  ...prevState.world.seasons[season_id].episodes[episodeKey],
							                  scenes: {
								                    ...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
								                    [sceneKey]: {
									                      ...prevState.world.seasons[season_id].episodes[episodeKey].scenes[sceneKey],
									                      hideScene: val
								                    }
							                  }
						                }
					              }
				            }
			          }
		        }
	      }));
    };

    isValid = (text) => {
        if (text) return true;

        return false;
    }

    handleSceneClick = (episodeKey, sceneKey) => {
	      let season_id = this.state.newSeasonId;
	      if (!season_id) return;

	      let season = this.state.world.seasons[season_id];
        let { writeAccess } = this.state;
        let scene = season.episodes[episodeKey].scenes[sceneKey];

	      if (writeAccess) {
		        this.setState(prevState => ({
			          ...prevState,
			          world: {
				            ...prevState.world,
				            seasons: {
					              ...prevState.world.seasons,
					              [season_id]: {
						                ...prevState.world.seasons[season_id],
						                episodes: {
						                    ...prevState.world.seasons[season_id].episodes,
						                    [episodeKey]: {
							                      ...prevState.world.seasons[season_id].episodes[episodeKey],
							                      scenes: {
							                          ...prevState.world.seasons[season_id].episodes[episodeKey].scenes,
							                          [sceneKey]: {
								                            ...prevState.world.seasons[season_id].episodes[episodeKey].scenes[sceneKey],
								                            edit: true
							                          }
							                      }
						                    }
						                }
					              }
				            }
			          }
		        }))
	      }
    }

    handleBeatMode = (name, value) => {
    	this.setState({ [name]: value });
    }

	  showBeats = () => {
		    this.setState({
		    	openBeats: !this.state.openBeats,
		    	beatMode: false
		    });
	  }

	  showWorldBuilder = () => {
		    this.setState({openBuilder: !this.state.openBuilder})
	  }

    handleErrorClose = () => {
        this.setState({ open: false });
    };

    openBackgroundModal = () => {
    	this.setState({ background_pop: true, setting_pop: false });
    }

    closeBackgroundModal = () => {
    	this.setState({ background_pop: false });
    }

	  openModals = name => event => {
		    this.setState({ [name]: true });
	  }

	  closeModals = name => event => {
		    this.setState({ [name]: false });
	  }

	  closeCommentProModal = () => {
	  	this.setState({ commentProOpen: false });
	  }

	handleFieldSave = (type, fields, key) => {
		const ref = db.ref();

		let whichFields = `${type}Fields`;
		let whichInitFields = `${type}InitFields`;
		let openWhichField = `open${type.charAt(0).toUpperCase() + type.slice(1)}Field`;
		let openWhichCard = 'openComonCard';
		let whichKey = 'charKey';
		let whichCardData = "charCardData"
		let openWhichUpdate = `openComonUpdate`;

		if (type === "character") {
			whichFields = "charFields";
			whichInitFields = "charInitFields";
			openWhichField = "openCharField";
			openWhichCard = "openCharCard";
			whichKey = "charKey";
			whichCardData = "charCardData";
			openWhichUpdate = "openCharUpdate";
		}

		const callback = (error, result) => {
		    if (error) {
		    	console.log(error);
		    } else {
		    	let newKey = key;

		    	if (!key) {
		    		newKey = result.key;
		    	}

		    	fields.relation.relation_id = result.key;

		    	this.setState(prevState => ({
				    ...prevState,
				    [whichFields]: {
				         ...prevState[whichFields],
				        [newKey]: fields
				    },
				    [whichInitFields]: {
				        ...prevState[whichInitFields],
				        [newKey]: fields
				    },
				    [openWhichUpdate]: false,
				    [openWhichField]: false,
				    [openWhichCard]: true,
				    [whichKey]: newKey,
				    [whichCardData]: fields
			    }));
		    }
		}

		setQueries.getBuilderAutoDoc(callback);
	  }

	getUpdateCharFields = (fields) => {
		let charFields = {};

		if (fields.aliases && fields.aliases.has === true) charFields['aliases'] = fields.aliases.tags;
		if (fields.realAliases && fields.realAliases.has === true) charFields['realAliases'] = fields.realAliases.tags;
		if (fields.birth && fields.birth.has === true) charFields['birth'] = fields.birth.val;
		if (fields.death && fields.death.has === true) charFields['death'] = fields.death.val;
		if (fields.description && fields.description.has === true) charFields['description'] = fields.description.val;
		if (fields.marital && fields.marital.has === true) charFields['marital'] = fields.marital.val;
		if (fields.name && fields.name.has === true) charFields['name'] = fields.name.val;
		if (fields.photo && fields.photo.has === true) charFields['photo'] = fields.photo.val;
		if (fields.alignment && fields.alignment.has === true) charFields['alignment'] = fields.alignment.val;
		if (fields.gender && fields.gender.has === true) charFields['gender'] = fields.gender.val;
		if (fields.thnicity && fields.thnicity.has === true) charFields['thnicity'] = fields.thnicity.val;
		if (fields.start && fields.start.has === true) charFields['start'] = fields.start.val;
		if (fields.end && fields.end.has === true) charFields['end'] = fields.end.val;
		if (fields.working_notes && fields.working_notes.has === true) charFields['working_notes'] = fields.working_notes.val;
		if (fields.personality && fields.personality.has === true) charFields['personality'] = fields.personality.val;
		if (fields.habits && fields.habits.has === true) charFields['habits'] = fields.habits.val;
		if (fields.orientation && fields.orientation.has === true) charFields['orientation'] = fields.orientation.val;
		if (fields.internal_conflicts && fields.internal_conflicts.has === true) charFields['internal_conflicts'] = fields.internal_conflicts.val;
		if (fields.external_conflicts && fields.external_conflicts.has === true) charFields['external_conflicts'] = fields.external_conflicts.val;
		if (fields.physical_description && fields.physical_description.has === true) charFields['physical_description'] = fields.physical_description.val;
		if (fields.availability && fields.availability.has === true) charFields['availability'] = fields.availability.val;
		if (fields.occupation && fields.occupation.has === true) charFields['occupation'] = fields.occupation.val;
		if (fields.background && fields.background.has === true) charFields['background'] = fields.background.val;
		if (fields.ethnicity && fields.ethnicity.has === true) charFields['ethnicity'] = fields.ethnicity.val;

		if (fields.relation && fields.relation.has === true) {
			charFields['relationship_list'] = Object.keys(fields.relation.val);
		}

		if (fields.dna && fields.dna.has === true) {
			charFields['dna'] = fields.dna.val;
		}

		if (fields.cardAvatar) charFields["cardAvatar"] = fields.cardAvatar;

		return charFields;
	}

	  checkValidation = (relation, fields) => {
		    let valid = true;

		    if (relation) {
			      Object.entries(fields).forEach( ([key, value]) => {
				        if (valid && !value.type) {
					          valid = false;

					          return valid;
				        }
				        if (valid && !value.charId) {
					          valid = false;

					          return valid;
				        }
				        if (valid && !value.relation) {
					          valid = false;

					          return valid;
				        }
			      });
		    }
		    else {
			      Object.entries(fields).forEach( ([key, value]) => {
				        if (key !== "relations" && key!== "dna" && key !== "alignment" && key !== "photo" && key !== "aliases") {
					          if (!this.isValid(value.trim())) {
						            valid = false;

						            return valid;
					          }
				        }});
		    }

		    return valid;
	  }

	CardSave = (type, key, fields, cancel=false) => {
		let whichFields = `${type}Fields`;
		let whichInitFields = `${type}InitFields`;
		let openWhichCard = "openComonCard";

		if (type === "character") {
			whichFields = "charFields";
			whichInitFields = "charInitFields";
			openWhichCard = "openCharCard";
		}

		// Function will create builder fields
		let newFields = this.getUpdateCharFields(fields);

		if (cancel) {
			if (!newFields.name)  {
			    this.setState(prevState => ({
				    ...prevState,
				    [openWhichCard]: false
			    }));

			    return;
			}

			this.setState(prevState => ({
				...prevState,
				[whichFields]: {
					...prevState[whichFields],
					[key]: fields,
				},
				[whichInitFields]: {
					...prevState[whichInitFields],
					[key]: fields,
				},
				[openWhichCard]: false
			}));

			return;
		}

		let season_id = this.state.newSeasonId;
		let { world_id, series_id } = this.props.match.params;

		newFields["category"] = type;
		if (!fields.season_id) {
			newFields["season_id"] = season_id;
		}
		if (!fields.series_id) {
			newFields["series_id"] = series_id;
		}
		if (!fields.world_id) {
			newFields["world_id"] = world_id;
		}		

		this.handleRelationships(key, fields, newFields, type);

		if (!newFields.name) {
			this.setState({ open: true });

			return;
		} else if (newFields.name && !newFields.name.trim()) {
			this.setState({ open: true });

			return;
		} else if (newFields.dna && Object.entries(newFields.dna)[0] && !Object.entries(newFields.dna)[0][1].answer) {
			delete newFields.dna;
		}

		let appearances = [];

		if (newFields.name) {
			const appearance = this.getAppearance(newFields.name);

			if (appearance.length > 0) {
				appearances = appearance.slice();
			}
		}

		if (newFields.realAliases) {
			newFields.realAliases.map(tag => {
				const appearance = this.getAppearance(tag);

			    if (appearance.length > 0) {
				    if (appearance.length > 0) {
					    appearance.slice().map(appear => {
						    if (!appearance.includes(appear)) {
							    appearances.push(appear);
							}
						});
					} else {
						appearances = appearance.slice();
					}
				}
			});
		}

		this.updateBuilderAppearances(key, appearances);

		const callback = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				this.setState(prevState => ({
				    ...prevState,
				    [whichFields]: {
					    ...prevState[whichFields],
					    [key]: fields,
				    },
				    [whichInitFields]: {
					    ...prevState[whichInitFields],
					    [key]: fields,
				    },
				    [openWhichCard]: false,
			    }));
			}
		}

		appbaseRef.index({
			type: "builders",
			id: key,
			body: newFields
		}).then(response => {
			console.log(response);
		}).catch(error => {
			console.log(error);
		});

		updateQueries.updateBuilder(key, newFields, callback);
	}

	handleRelationships = (builder_id, fields, newFields, inverseType) => {
		// Handle Relationships of card
		if (newFields.relationship_list !== undefined) {
			const user_id = localStorage.getItem("storyShop_uid");

			// Relationships in object (View part)
			const relations_obj = fields.relation.val;

			// Loop on every relationships of card
			Object.entries(relations_obj).map( ([relActKey, value], index) => {
				// relActKey relationship key;
				// value => object of charId, relation, type
				if (value.type && value.charId && value.relation) {
					// Relationship with which card (inverse card type)
					const relActType = value.type || "";
					// Relationship card id (inverse card id)
					let relActType_id = value.charId || "";
					// Relationship id => child of, parent of etc.
					const relAct_relation = value.relation || "";

					const card2CB = (error, result) => {
						if (error) {
							console.log(error);
						} else {
							let data = {
								type: relActType,
								last_modified_user_id: user_id,
								card_1_id: relActType_id,
								card_2_id: builder_id,
								relationship_type: relAct_relation
							}

							const callback = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							if (result.status === 1) {
								const oldRelation = result.data;

								if (oldRelation.card_1_id !== data.card_1_id) {
									deleteQueries.removeBuilderRelation(oldRelation.card_1_id, relActKey, callback);

									getQueries.getBuilderWithDoc(oldRelation.card_1_id, (err, res) => {
										if (err) {
											console.log(err);
										} else {
											if (res.status === 1) {
												if (res.data.relationship_list) {
													const upateData = {
														relationship_list: res.data.relationship_list.filter(item => item !== relActKey)
													}

													updateQueries.updateBuilder(oldRelation.card_1_id, upateData, (e, r) => {});
												}
											}
										}
									});
								}

								updateQueries.updateRelationBuilder(builder_id, relActKey, data, callback);
							} else {
								data["created_user_id"] = user_id;

								updateQueries.updateRelationBuilder(builder_id, relActKey, data, callback);
							}
						}
					}

					const card1CB = (error, result) => {
						if (error) {
							console.log(error);
						} else {
							// Inverse relationship only for character type
							let inverseRelation = relAct_relation;

							if (relActType.toLowerCase() === "character") {
								if (parseInt(inverseRelation) === 8) {
									inverseRelation = 9;
								} else if (parseInt(inverseRelation) === 9) {
									inverseRelation = 8;
								} else if (parseInt(inverseRelation) === 11) {
									inverseRelation = 12;
								} else if (parseInt(inverseRelation) === 12) {
									inverseRelation = 11;
								} else {
									inverseRelation = inverseRelation;
								}
		 					}

							let data = {
								type: inverseType,
								last_modified_user_id: user_id,
								card_1_id: builder_id,
								card_2_id: relActType_id,
								relationship_type: inverseRelation
							}

							if (result.status === 0) {
								data["created_user_id"] = user_id;
							}

							getQueries.getBuilderWithDoc(relActType_id, (err, res) => {
								if (err) {
									console.log(err);
								} else {
									if (res.status === 1) {
										let relationship_list = res.data.relationship_list || [];

										if (!relationship_list.includes(relActKey)) {
											relationship_list.push(relActKey);

											const upateData = {
												relationship_list: relationship_list
											}

											updateQueries.updateBuilder(relActType_id, upateData, (e, r) => {});
										}
									} else {
										// updateQueries.updateBuilder(relActType_id, {relationship_list: [relActKey]}, (e, r) => {});
									}
								}
							});

							const callback = (err, res) => {
								if (err) {
									console.log(err);
								}
							}

							updateQueries.updateRelationBuilder(relActType_id, relActKey, data, callback);
						}
					}

					getQueries.getBuilderRelation(builder_id, relActKey, card2CB);
					getQueries.getBuilderRelation(relActType_id, relActKey, card1CB);
				}
			});
		}
	}

    CardClick = (type, key, data, socialChar) => {
		data["appearance"] = [];
		data["worldAppearance"] = [];
		let appearances = [];

		if (data.name.val) {
			const appearance = this.getAppearance(data.name.val);

			if (appearance.length > 0) {
				data["appearance"] = appearance.slice();
				appearances = appearance.slice();
			}
		}

		if (data.realAliases.has && data.realAliases.tags) {
			data.realAliases.tags.map(tag => {
				const appearance = this.getAppearance(tag);

			    if (appearance.length > 0) {
				    if (data["appearance"] && data["appearance"].length > 0) {
					    appearance.slice().map(appear => {
						    if (!data["appearance"].includes(appear)) {
							    data["appearance"].push(appear);
							    appearances.push(appear);
							}
						});
					} else {
						data["appearance"] = appearance.slice();
						appearances = appearance.slice();
					}
				}
			});
		}

		this.updateBuilderAppearances(key, appearances);

		const { season_id } = this.props.match.params;

		this.getWorldAppearance(season_id, key);

		if (type === "character") {
			this.setState({
				charCardData: data,
				openCharCard: true,
				whichCard: type,
				charKey: key,
				showSocialChar: socialChar
			});
		} else {
			const openWhichCard = `open${type.charAt(0).toUpperCase() + type.slice(1)}Card`;
			const whichKey = `${type}Key`;
			const whichCardData = `${type}CardData`;

			this.setState({
				charCardData: data,
				openComonCard: true,
				whichCard: type,
				charKey: key,
				showSocialChar: socialChar
			});
		}
	}

	updateBuilderAppearances = (builder_id, appearances) => {
		const appear_cb = (error, result) => {
			if (error) {
				console.log(error);
			}
		}

		const {
			season_id, series_id, world_id
		} = this.props.match.params;
		const season = this.state.world.seasons[season_id];
	    const season_name = season.name;

		const appear_data = {
			season_id,
			series_id,
			world_id,
			season_name,
			appearances: appearances.slice() || []
		}

		updateQueries.updateBuilderAppearances(builder_id, season_id, appear_data, appear_cb);
	}

	getWorldAppearance = (currentSeason_id, cardKey) => {
		const { world_id } = this.props.match.params;

		const cb = (error, result) => {
			if (error) {
				console.log(error);
			} else {
				result.data.forEach(data => {
					this.setState(prevState => ({
						...prevState,
						charCardData: {
							...prevState.charCardData,
							worldAppearance: {
								...prevState.charCardData.worldAppearance,
								[data.data().season_id]: {
									appearances: data.data().appearances, 
									season_name: data.data().season_name
								}
							}
						}
					}));
				})
			}								
		}

		getQueries.getBuilderAppearancesWithWorld(cardKey, world_id, cb);
	}

	getAppearance = text => {
	    let season_id = this.state.newSeasonId;
		let appearance = [];

	    if (!season_id) return appearance;
		if (!this.state.world) return appearance;
		if (!this.state.world.seasons) return appearance;

	    const { episodes } = this.state.world.seasons[season_id];
		if (!episodes) return appearance;

	    Object.entries(episodes)
	    .sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
	    .map( ([episodeKey, episode]) => {
		    const { scenes } = episode;
		    let count = 0;

			if (!scenes) return appearance;

		    Object.entries(scenes)
		    .sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
		    .map( ([sceneKey, scene]) => {
			    count++;

				let regE = null;

				try {
					regE = new RegExp('(^|\\W)' + text.toLowerCase().trim() + '($|\\W)');
				} catch(error) {
					regE = null;

					db.ref().child("error_log")
					.push({
						user_id: localStorage.getItem("storyShop_uid") || "",
						Date: new Date(),
						WorldID: this.props.match.params.world_id,
						SeasonID: this.props.match.params.season_id,
						ErrorFunction: "getAppearance",
						error_message: error || ""
					});
				}

	          	if (scene.story && regE && scene.story.toLowerCase().match(regE)) {
		            const episodeName = episode.name;
		            const sceneName = `${scene.name} ${count}`;

		            const found = appearance.slice().find(element => 
		            	element.episode_id === episodeKey && 
		            	element.scene_id === sceneKey && 
		            	element.text === text
		            )

		            if (!found) {
		            	appearance.push({
		            		episode_name: episodeName,
		            		scene_name: sceneName,
		            		episode_id: episodeKey,
		            		scene_id: sceneKey,
		            		text: text
		            	});
		            }
	          	}
		    });
	    });

	    return appearance.slice();
    }

	openCardClick = (type) => {
		    const ref = db.ref();

		    const dbField = ref.child(type);
		    let newKey = newKey = dbField.push().key;

				const { showLite } = this.state;

				if (showLite) {
					this.initCommonFields.dna.has = false;
					this.initFields.dna.has = false;
					this.initFields.photo.has = false;
				} else {
					this.initCommonFields.dna.has = true;
					this.initFields.dna.has = true;
					this.initFields.photo.has = true;
				}

				const a = JSON.parse(JSON.stringify(this.initCommonFields));
				const b = JSON.parse(JSON.stringify(this.initFields));

		    this.CardClick(type, newKey,
		                   type !== "character" ? a : b);
	}

    openBuilderModal = () => {
        this.setState({ openBuilderPop: true });
    }

    openSBuilderModal = () => {
        this.setState({ openShortcutBuilder: true });
    }

    closeBuilderModal = () => {
        this.setState({ openBuilderPop: false });
    }

    closeSBuilderModal = () => {
        this.setState({ openShortcutBuilder: false });
    }

    cancelBuilderModal = () => {
        const { realChecks } = this.state;
        const data = Object.assign({}, realChecks);

        this.setState({openBuilderPop: false,
                       builderChecks: data});
    }

    handleBuilderSave = () => {
        const { builderChecks } = this.state;
        const data = Object.assign({}, builderChecks);
				// const data = JSON.parse(JSON.stringify(data))
		    // console.log(data);
        this.setState({
            openBuilderPop: false,
            realChecks: data
        });
    }

    handleSBuilderSave = (saved, builder, name) => {
    	if (saved) {
    		Object.entries(builder).map(([key, value]) => {
	        	if (value) {
	        		const { world_id, series_id, season_id } = this.props.match.params;
	        		if (value) {
	        			const data = {
		        			world_id: world_id, series_id: series_id, season_id: season_id,
		        			name: name, category: key
		        		}

		        		const callback = (error, result) => {
		        			if (error) {
		        				console.log(error);
		        			}
		        		}

		        		setQueries.insertBuilder(data, callback);
	        		}
	        	}
	        });

	        this.setState({ shortcutName: "", openShortcutBuilder: false });
    	} else {
    		this.setState({ shortcutName: "", openShortcutBuilder: false });
    	}
    }

    handlePreenBuilderSave = (save, category, name, aliases, cb) => {
    	const { world_id, series_id, season_id } = this.props.match.params;

    	const data = {
		    world_id: world_id, series_id: series_id, season_id: season_id,
		    name: name, category: category, aliases: aliases
		}

		const callback = (error, result) => {
		    if (error) {
		        console.log(error);
		    } else {
		    	console.log(result);

		    	appbaseRef.index({
					type: "builders",
					id: result.key,
					body: data
				}).then(response => {
					console.log(response);
				}).catch(error => {
					console.log(error);
				});
		    }
		}

		setQueries.insertBuilder(data, callback);
    }

    addBuilderChange = (event) => {
        const { checked, value } = event.target;
        const { builderChecks } = this.state;

	      // console.log(checked, value);

        // builderChecks[value] = checked;

				this.setState(prevState => ({
					...prevState,
					builderChecks: {
						...prevState.builderChecks,
						[value]: checked
					}
				}))

        // this.setState({	builderChecks	});
    }

    printDocument = (type) => {
	    let season_id = this.state.newSeasonId;
	    if (!season_id) return;

	    const season = this.state.world.seasons[season_id];

	    const season_name = season.name;
	    let source = document.querySelector("#main-season-id").cloneNode(true);

	    if (type === "PDF") {
					try {
						source.classList.remove("main-season-container");

		        let doc = new jsPDF();

		        let margins = {
				        top: 15,
				        bottom: 15,
				        left: 15,
				        width: 170,
				        right: 15
		        };

		        doc.fromHTML(
			          source,
			          margins.left,
			          margins.top, {
				            'width': margins.width
			          },
			          (dispose) => {
				            doc.save(`${season_name}.pdf`);
			          },
			          margins
		        );
					} catch (e) {
						console.log(e);

						db.ref().child("error_log")
							.push({
								user_id: localStorage.getItem("storyShop_uid") || "",
								Date: new Date(),
								WorldID: this.props.match.params.world_id,
								SeasonID: this.props.match.params.season_id,
								ErrorFunction: "printDocument",
								DocumentType: "PDF",
								error_message: e || ""
							});
					}
	    } else if (type === "TXT") {
			try {
				let text = "";
		        const { episodes } = season;

		        text = text + season_name + "\r\n";

		        Object.entries(episodes).map(([episodeKey, episode]) => {
			          text = text + episode.name + "\r\n";

			          Object.entries(episode.scenes).map(([sceneKey, scene]) => {
				            text = text + scene.name + "\r\n";

				            let sceneElement = document.createElement("div");
				            sceneElement.innerHTML = scene.story;

				            text = text + sceneElement.innerText + "\r\n";
			          })
		        })

		        let element = document.createElement('a');
		        element.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodeURIComponent(text) );

		        element.setAttribute('download', `${season_name}.txt`);

		        element.style.display = 'none';
		        document.body.appendChild(element);

		        element.click();

		        document.body.removeChild(element);
			} catch (e) {
						console.log(e);

						db.ref().child("error_log")
							.push({
								user_id: localStorage.getItem("storyShop_uid") || "",
								Date: new Date(),
								WorldID: this.props.match.params.world_id,
								SeasonID: this.props.match.params.season_id,
								ErrorFunction: "printDocument",
								DocumentType: "TXT",
								error_message: e || ""
							});
			}
	    } else if (type === "DOCX") {
			try {
				let middle_html_content = "";

				if (document.querySelectorAll(".episode-container")) {
					const all_episodes = document.querySelectorAll(".episode-container");

					Array.from(all_episodes).forEach(_episode_dom => {
						middle_html_content += "<p align=\"center\" style='text-align:center'>";

						if (_episode_dom.querySelector(".episode-txt")) {
							middle_html_content += _episode_dom.querySelector(".episode-txt").innerText.replace(new RegExp("&", "g"), "and") || "";
						}

						middle_html_content += "</p>";

						if (_episode_dom.querySelectorAll(".scene-container")) {
							Array.from(_episode_dom.querySelectorAll(".scene-container")).forEach(_scene_dom => {
								if (!_scene_dom) return;

								if (_scene_dom.querySelector(".html-edit")) {
									if (_scene_dom.querySelector(".html-edit").querySelectorAll("p")) {
										_scene_dom.querySelector(".html-edit")
										.querySelectorAll("p").forEach(_para => {
											// middle_html_content += `<p>${_para.innerText.replace(new RegExp("&amp;", "g"), "").replace(new RegExp("&", "g"), "and")}</p>`;
											middle_html_content += `<p>${_para.innerHTML.replace(new RegExp("&amp;", "g"), "").replace(new RegExp("&", "g"), "and")}</p>`;
										})
									}
								}

								if (_scene_dom.querySelector(".three-dots")) {
									middle_html_content += `<p align=\"center\" style='text-align:center'>&bull;&bull;&bull;</p>`;
								}
							});
						}
					});
				}

				const start_html_content = `<html><head><style>{font: 12.0px Palatino}</style></head><body><div class=Section1><p align=\"center\" style='text-align:center'>${season_name}</p>`;
				const end_html_content = "</div></body></html>";

				const data = {
					data: start_html_content + middle_html_content + end_html_content
				}

				let headers = {
					'Content-Type': 'application/json'
				}

				axios.post(CLEAN_HTML, data, {
					headers: headers
				}).then((response) => {
					axios.post(`${NODE_API}/auth/uploadHTML`, {
						htmlString: response.data.retData
					}, {
						headers: headers
					}).then(res => {
						axios.post(EXPORT_DOCX_API, {
							html: "http://167.99.23.31:4000/" + res.data.url
						}, {
							headers: headers
						}).then(response => {
							console.log(response)

							let element = document.createElement('a');
							element.setAttribute("href", response.data.target );

							element.setAttribute('download', `${season_name}-${new Date().getTime()}.docx`);

							element.style.display = 'none';
							document.body.appendChild(element);

							element.click();

							document.body.removeChild(element);
						}).catch(error => {
							console.log("Error ", error);

							alert("There is an error in export please try after sometime!");
						});

					}).catch(error => {
						console.log("Error ", error);

						alert("There is an error in export please try after sometime!");
					});
				}).catch(error => {
					console.log("Error ", error);

					alert("There is an error in export please try after sometime!");
				});

				// const converted = htmlDocx.asBlob(contentHTML);

				// console.log(converted); return;

				// saveAs(converted, `${season_name}-${new Date().getTime()}.docx`);
			} catch (e) {
				console.log(e);

				db.ref().child("error_log")
				.push({
					user_id: localStorage.getItem("storyShop_uid") || "",
					Date: new Date(),
					WorldID: this.props.match.params.world_id,
					SeasonID: this.props.match.params.season_id,
					ErrorFunction: "printDocument",
					DocumentType: "DOCX",
					error_message: e || ""
				});
			}
	    }
    }

	printBars = (bar) => {
		if (bar === "beat_bar") {
			try {
				const { season_id } = this.props.match.params;

				if (!season_id) return;

				// let newDiv = document.createElement("div");
				const world = this.state.world;
				if (!world) return;
				const seasons = world.seasons;
				if (!seasons) return;
				const season = seasons[season_id];
				if (!season) return;
				const episodes = season.episodes;

				let html_html = `<html><head><style>{font: 12.0px Palatino}</style></head><body><div class=Section1><p align=\"center\" style='text-align:center'><strong>${season.name}</strong></p>`;

				episodes && Object.entries(episodes).length > 0 && Object.entries(episodes)[0][1].key &&
					Object.entries(episodes)
					.sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
					.map(([episodeKey, episode], index) => {
						const epiActualKey = episode.key;

						if (!epiActualKey) return;

						let hTag = `<p align=\"center\" style='text-align:center'><strong>${episode.name || ""}</strong></p>`;

						if (episode.summary) {
							hTag += `<h3>Chapter Summary</h3>`;
							hTag += `<p>${episode.summary}</p>`;
						}

						if (episode.pulse) {
							hTag += `<h3>Chapter Pulse</h3>`
							hTag += `<p>${episode.pulse}</p>`;
						}

						const scenes = episode.scenes;

						if (scenes && Object.entries(scenes).length > 0 && Object.entries(scenes)[0][1].key) {
							Object.entries(scenes)
							.sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0))
							.map(([sceneKey, scene], index) => {
									const scActualKey = scene.key;

									if (!scActualKey) return;

									let sTag = ``;

									if (scene.title) {
										sTag = `<p align=\"center\" style='text-align:center'><strong>${scene.title || (parseInt(index)+1)}</strong></p>`;
									} else {
										sTag = `<p align=\"center\" style='text-align:center'><strong>${scene.name + ' ' + (parseInt(index)+1) || "Scene " + (parseInt(index)+1)}</strong></p>`;
									}

									if (scene.summary) {
										sTag += `<h3>Scene Summary</h3>`;
										sTag += `<p>${scene.summary}</p>`;
									}

									if (scene.pulse) {
										sTag += `<h3>Scene Pulse</h3>`;
										sTag += `<p>${scene.pulse}</p>`;
									}

									hTag += sTag;
								});
							}

							html_html += hTag;
							html_html += `</div></body></html>`;
					});

					const data = {
						data: html_html
					}

					let headers = {
						'Content-Type': 'application/json'
					}

					axios.post(CLEAN_HTML, data, {
						headers: headers
					}).then((response) => {
						axios.post(`${NODE_API}/auth/uploadHTML`, {
							htmlString: response.data.retData
						}, {
							headers: headers
						}).then(res => {
							axios.post(EXPORT_DOCX_API, {
								html: "http://167.99.23.31:4000/" + res.data.url
							}, {
								headers: headers
							}).then(response => {
								console.log(response)

								let element = document.createElement('a');
								element.setAttribute("href", response.data.target );

								element.setAttribute('download', `beats-${new Date().getTime()}.docx`);

								element.style.display = 'none';
								document.body.appendChild(element);

								element.click();

								document.body.removeChild(element);
							}).catch(error => {
								console.log("Error ", error);

								alert("There is an error in export please try after sometime!");
							});

						}).catch(error => {
							console.log("Error ", error);

							alert("There is an error in export please try after sometime!");
						});
					}).catch(error => {
						console.log("Error ", error);

						alert("There is an error in export please try after sometime!");
					});
				} catch (e) {
					console.log(e);

					db.ref().child("error_log")
						.push({
							user_id: localStorage.getItem("storyShop_uid") || "",
							Date: new Date(),
							WorldID: this.props.match.params.world_id,
							SeasonID: this.props.match.params.season_id,
							ErrorFunction: "printBars",
							BarType: "beat_bar",
							error_message: e || ""
						});
				}
			} else if (bar === "world_bar") {
				try {
					const { realChecks, world_name } = this.state;

					if (!realChecks) return;

					this.setState({ loadExports: true });

					let world_HTML = `<div>`;

					world_HTML += `<h1>${world_name}</h1>`;

					realChecks && Object.keys(realChecks).map((item) => {
						if (realChecks[item]) {
							let whichFields = `${item}Fields`;

							if (item === "character") {
									whichFields = "charFields";
							}

							world_HTML += `<br /><h2>${item.charAt(0).toUpperCase() + item.slice(1)}</h2>`;

							const getCardName = (type, id) => {
								let whichRelationFields = `${type}Fields`;

								if (type === "character") {
									whichRelationFields = "charFields";
								}

								let result = "";

								const getName = this.state[whichRelationFields];

								if (getName && getName[id]) {
									if (getName[id].name && getName[id].name.has) {
										result = getName[id].name.val;
									}
								}

								return result;
							}

							const getRelationName = (of, ofwith, code) => {
								let result = "";

								if (getRelations[of] && getRelations[of][ofwith] && getRelations[of][ofwith][code]) {
										result = getRelations[of][ofwith][code];
								}

								return result;
							}

							Object.entries(this.state[whichFields])
								.map(([charKey, char], index) => {
									world_HTML += getCardHTML(item, char, getCardName, getRelationName);
								});
						}
					});

					world_HTML += `</div>`;

					let doc = new jsPDF();

					let margins = {
							top: 15,
							bottom: 15,
							left: 15,
							width: 170,
							right: 15
					};

					doc.fromHTML(
							world_HTML,
							margins.left,
							margins.top, {
									'width': margins.width
							},
							(dispose) => {
									doc.save(`worldbar-${new Date().getTime()}.pdf`);
									this.setState({ loadExports: false });
							},
							margins
					);
				} catch (e) {
					console.log(e);
					this.setState({ loadExports: false });

					db.ref().child("error_log")
						.push({
							user_id: localStorage.getItem("storyShop_uid") || "",
							Date: new Date(),
							WorldID: this.props.match.params.world_id,
							SeasonID: this.props.match.params.season_id,
							ErrorFunction: "printBars",
							BarType: "world_bar",
							error_message: e || ""
						});
				}
			}
		}

    handlePop = name => {
	      if (name === "export_pop" || name === "setting_pop") {
	      		this.setState({ openBuilder: false });
	      }

	      this.setState({ [name]: !this.state[name] });
    }

    handleSettingChange = name => event => {
	      this.setState({[name]: event.target.value});
    }

    handleColorClose = name => {
	      this.setState({[name]: false});
    }

    handleColorChange = name => color => {
	      this.setState({[name]: color.hex});
    }

    handleWorldExpansion = item => (event, expanded) => {
	      this.setState(prevState => ({
		        ...prevState,
		        itemExpand: {
			          ...prevState.itemExpand,
			          [item]: expanded
		        }
	      }));
    }

    handleSeriesChange = id => {
		    const { world_id } = this.props.match.params;
		    const { seriesList } = this.state;

		    const [series_id, sName, ssId] = seriesList[id];

		    this.props.history.push(`/${world_id}/${series_id}/${ssId}`);
    }

    handleExpansionPanel = (no, type, id, season_id="") => (event, expanded) => {
	      const expan_summ = document.querySelectorAll(".cmn-expan-summ")[no];
	      const episode_summary = document.querySelectorAll(".cmn-episode-summary")[no];

	      if (type === "season") {
		        if (type === "season" && !expan_summ.children[1].contains(event.target)) {
					  if (this.state.seasonExpanded !== id) return;

					  this.setState(prevState => ({
				            ...prevState,
				            showEpisode: "",
				            EEExpanded: {},
			          }));

					  Object.entries(this.state.world.seasons[id].episodes)
							.map(([epiKey, epiVal]) => {
								this.setState(prevState => ({
									...prevState,
									world: {
										...prevState.world,
										seasons: {
											...prevState.world.seasons,
											[id]: {
												...prevState.world.seasons[id],
												episodes: {
													...prevState.world.seasons[id].episodes,
													[epiKey]: {
														...prevState.world.seasons[id].episodes[epiKey],
														showEpisode: true
													}
												}
											}
										}
									}
								}))
							});
		        }
		        else {
							const { world_id, series_id } = this.props.match.params;
							this.props.history.push(`/${world_id}/${series_id}/${id}`);

			          this.setState(prevState => ({
				            ...prevState,
							newSeasonId: id,
							showEpisode: "",
				            seasonExpanded: expanded ? id : false,
				            episodeExpanded: expanded ? id : false,
				            SSExpanded: {
					              ...prevState.SSExpanded,
					              [id]: expanded
				            }
			          }));
		        }
	      }
	      else {
		        if (type === "episode" && episode_summary.children[1] && !episode_summary.children[1].contains(event.target)) {
					  return;
					  this.setState(prevState => ({
				            ...prevState,
				            newSeasonId: season_id,
				            showEpisode: id,
				            episodeExpanded: id,
				            EEExpanded: {
					              ...prevState.EEExpanded,
					              [id]: expanded
				            }
			          }));
		        }
		        else {
					const { seasons } = this.state.world;
					if (!seasons) return;

					const season = seasons[season_id];
					if (!season) return;

					const episodes = season.episodes;
					const episode = episodes[id];
					if (!episode) return;

					const showEpisodeE = episode.showEpisode;

					if (this.state.EEExpanded[id]) {
						let eeee = this.state.EEExpanded;

						delete eeee[id];

						this.setState({ EEExpanded: eeee });
					} else {
						this.setState(prevState => ({
							...prevState,
							EEExpanded: {
					            ...prevState.EEExpanded,
					            [id]: expanded
				            },
						}));
					}

					  this.setState(prevState => ({
				            ...prevState,
							newSeasonId: season_id,
				            showEpisode: id,
				            episodeExpanded: expanded ? id : false,
							world: {
								...prevState.world,
								seasons: {
									...prevState.world.seasons,
									[season_id]: {
										...prevState.world.seasons[season_id],
										episodes: {
											...prevState.world.seasons[season_id].episodes,
											[id]: {
												...prevState.world.seasons[season_id].episodes[id],
												showEpisode: !showEpisodeE
											}
										}
									}
								}
							}
			          }));
		        }
	      }
    }

    handleExpansion = (type, season_id, episode_id="", scene_id="") => {
	      let fields = {};
	      let beatFields = {};

	      if (scene_id) {
		        const episode = this.state.world.seasons[season_id].episodes[episode_id];
		        const scene = episode.scenes[scene_id];

		        fields = JSON.parse(JSON.stringify(scene));
	      }
	      else if (episode_id) {
		        const episode = this.state.world.seasons[season_id].episodes[episode_id];
		        fields = JSON.parse(JSON.stringify(episode));
	      }
	      else {
		        const season = this.state.world.seasons[season_id];
		        fields = JSON.parse(JSON.stringify(season));
	      }

	      beatFields["name"] = fields.name;
	      beatFields["key"] = fields.key;
	      beatFields["created_date"] = fields.created_date;
	      beatFields["notes"] = fields.notes || "";
	      beatFields["summary"] = fields.summary || "";

	      this.setState({
		        openBeatCard: true,
		        beatFields,
		        beatOpenType: type,
		        beatSeasonId: season_id,
		        beatEpisodeId: episode_id,
		        beatSceneId: scene_id
	      });
    }

  	handleSceneExpension = (sceneId) => {
    	let a = '';

    	if (this.ref[sceneId]) {
    		window.scrollTo(0, offset(this.ref[sceneId]).top-150);
    	}

    	/*(
    		this.ref[sceneId] &&
    		this.ref["main-season-id"]
    	) ?
    		window.scrollTo(0, this.ref[sceneId].offsetTop-this.ref[sceneId].offsetHeight-50)
    	:
    		a = "";*/

	    // this.ref[sceneId] ? this.ref[sceneId].scrollIntoView({ behavior: "auto" }) : a = "";
    }

    onWorldBarDragEnd = (result) => {
	    const { writeAccess } = this.state;
	    // console.log(result);

	    if (!writeAccess) {
		    return;
	    }

	    this.setState({ worldBarDelete: false });

	    const { source, destination, draggableId, reason } = result;

	    const type = source.droppableId;

	    let whichFields = `${type}Fields`;
		let whichInitFields = `${type}InitFields`

	    if (type === "character") {
			whichInitFields = "charInitFields";
		    whichFields = "charFields";
	    }

				// dropped outside the list
		if (!destination) {
		    return;
		}

		if (source.droppableId === destination.droppableId) {
			return;
		} else if (destination.droppableId.split(" ")[0] === "delete") {
			confirmAlert({
				title: 'Are you sure?',
				message: `You want to delete this?`,
				buttons: [
					{
						label: 'No'
					},
					{
						label: 'Yes, Delete it!',
						onClick: () => {
							const items = remove(
								Object.entries(this.state[whichFields]),
								source
							);

							let a = {};

							items.map(item => {
								a[item[0]] = item[1]
							});

							const { world_id, series_id, season_id } = this.props.match.params;

							let crd_season = season_id;

					    	if (this.state[whichFields] && this.state[whichFields][draggableId]) {
					    		crd_season = this.state[whichFields][draggableId].season_id || season_id;
					    	}

					    	const trashData = {
					    		type: "builder",
					    		type_id: draggableId,
					    		world_id,
					    		series_id,
					    		season_id: crd_season,
					    		orignal_season_id: season_id,
					    		trash_at: new Date(),
    							trash_timestamp: new Date().getTime()
					    	}

					    	updateQueries.updateBuilder(draggableId, {isDeleted: true, relationship_list: []}, (err, res) => {});
					    	updateQueries.updateTrash(draggableId, trashData, (err, res) => {});

							// deleteQueries.removeBuilder(draggableId, (err, res) => {});

							appbaseRef.delete({
								type: "builders",
								id: draggableId
							}).then(function(res) {
								console.log("successfully deleted: ", res)
							}).catch(function(err) {
								console.log("deletion error: ", err)
							})

							this.setState({
								[whichInitFields]: a,
								[whichFields]: a
							});

							const callback = (error, results) => {
								if (error) {
									console.log(error);
								} else {
									if (results.data.docs.length > 0) {
										results.data.forEach(snap => {
											const id = snap.id;
											const data = snap.data();

											const card_id = data.card_1_id;

											getQueries.getBuilderWithDoc(card_id, (err, res) => {
												if (err) {
													console.log(err);
												} else {
													if (res.status === 1) {
														let relationship_list = res.data.relationship_list;

														if (relationship_list) {
															if (relationship_list.includes(id)) {
																const upateData = {
																	relationship_list: relationship_list.filter(item => item !== id)
																}

																updateQueries.updateBuilder(card_id, upateData, (e, r) => {});
																deleteQueries.removeBuilderRelation(card_id, id, (e, r) => {});
															}
														}
													}
												}
											});
										});
									}
								}
							}

							getQueries.getBuilderRelationships(draggableId, callback);
						}
					}
				]
			});
		} else if (source.droppableId !== destination.droppableId) {
			let sourceL = source.droppableId;
			let destinationL = destination.droppableId;

			let whichSourceFields = `${sourceL}Fields`;
			let whichInitSourceFields = `${sourceL}InitFields`;
			let whichDestinationFields = `${destinationL}Fields`;
			let whichInitDestinationFields = `${destinationL}InitFields`;

			if (sourceL === "character") {
				whichSourceFields = 'charFields';
				whichInitSourceFields = `$charInitFields`;
			} else if (destinationL === "character") {
				whichDestinationFields = 'charFields';
				whichInitDestinationFields = `$charInitFields`;
			}

			const sourceList = Object.entries(this.state[whichSourceFields]);
			const destinationList = Object.entries(this.state[whichDestinationFields]);

			const items = move(
				sourceList,
				destinationList,
				source,
				destination
			);

			const newSource = Object.entries(items)[0];
			const newDestination = Object.entries(items)[1];

			let sourceFields = {};
			let destinationFields = {};

			newSource[1].map(([key, value]) => {
				sourceFields[key] = value;
			});

			newDestination[1].map(([key, value]) => {
				destinationFields[key] = value;
			});

			updateQueries.updateBuilder(draggableId, {category: destinationL}, (err, res) => {});

			appbaseRef.update({
				type: "builders",
				id: draggableId,
				body: {
					doc: {category: destinationL}
				}
			}).then(function(res) {
				// console.log("successfully updated: ", res)
			}).catch(function(err) {
				console.log("update document error: ", err)
			})

			const callback = (error, results) => {
				if (error) {
					console.log(error);
				} else {
					if (results.data.docs.length > 0) {
						results.data.forEach(snap => {
							const id = snap.id;
							const data = snap.data();

							const card_id = data.card_1_id;

							const upateData = {
								type: destinationL
							}

							updateQueries.updateRelationBuilder(card_id, id, upateData, (e, r) => {});
						});
					}
				}
			}

			getQueries.getBuilderRelationships(draggableId, callback);

			// removeDB.child(draggableId).remove();

			// this.CardSave(destinationL, draggableId, destinationFields[draggableId]);

			this.setState({
				[whichSourceFields]: sourceFields,
				[whichInitSourceFields]: sourceFields,
				[whichDestinationFields]: destinationFields,
				[whichInitDestinationFields]: destinationFields
			});
		}
    }

    onWorldBarDragStart = result => {
	      const { writeAccess } = this.state;

	      if (!writeAccess) {
		        return;
	      }
	      this.setState({ worldBarDelete: true });
    }

    onBeatBarDragStart = result => {
	      const { writeAccess } = this.state;

	      if (!writeAccess) {
		        return;
	      }

				const { source, draggableId, type } = result;
				const type_list = type.split(" ");
			  const actType = type_list[0];

			  if (actType === "season") {
					const whichBeatDelete = `seasonBeatDelete`;

					this.setState({ [whichBeatDelete]: true });
			  } else if (actType === "episode") {
				  const season_id = source.droppableId;

				  const whichBeatDelete = `${type_list[1]}BeatDelete`;
				  this.setState({ [whichBeatDelete]: true });
			  } else if (actType === "scene") {
				  const ids = source.droppableId.split(" ");
				  const season_id = ids[0];
				  const episodeId = ids[1];

				  const whichBeatDelete = `${type_list[1]}SceneBeatDelete`;

				  this.setState({ [whichBeatDelete]: true });
			  }
    }

	onBeatBarDragUpdate = result => {
		// console.log(result);
	}

    onBeatBarDragEnd = result => {
	      const { writeAccess, notHis } = this.state;

	      if (!writeAccess) {
		        return;
	      }

        const { source, destination, draggableId, type, reason } = result;
	      const type_list = type.split(" ");
	      const actType = type_list[0];

				if (actType === "season") {
					const whichBeatDelete = `seasonBeatDelete`;

					this.setState({ [whichBeatDelete]: false });
				} else if (actType === "episode") {
					  const season_id = source.droppableId;
					  const episode_id = draggableId;

					  const whichBeatDelete = `${type_list[1]}BeatDelete`;

					  this.setState({ [whichBeatDelete]: false });
				} else if (actType === "scene") {
					  const ids = source.droppableId.split(" ");
					  const season_id = ids[0];
					  const episodeId = ids[1];
					  const epiActualId = ids[2];

					  const whichBeatDelete = `${type_list[1]}SceneBeatDelete`;

					  this.setState({ [whichBeatDelete]: false });
				}

				// dropped outside the list
		    if (!destination) {
		      return;
		    }

				if (source.droppableId === destination.droppableId) {
					if (actType === "season") {
							if (!this.state.world.seasons) return;

			          const list = Object.entries(this.state.world.seasons);

			          const items = reorderBeat(
				            list,
				            source.index,
				            destination.index
			          );

			          let a = {};

			          items.map(item => {
				            a[item[0]] = item[1]
			          });

			          this.setState(prevState => ({
				            ...prevState,
				            world: {
					              ...prevState.world,
					              seasons: a
				            }
			          }));
		        }

		        if (actType === "scene") {
			        const ids = source.droppableId.split(" ");
			        const season_id = ids[0];
			        const episodeId = ids[1];
			        const epiActualId = ids[2];

			        const list = Object.entries(this.state.world.seasons[season_id].episodes[episodeId].scenes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

			        const items = reorderBeat(
                    	list,
                    	source.index,
                    	destination.index
                	);

			        let last_index = items.length - 1;

			        if (destination.index === last_index) {
				        let last_item = items[last_index];
				        let change_item = items[source.index];
			        } else if (source.index === last_index) {
				        let last_item = items[last_index];
				        let change_item = items[destination.index];
			        }

                	let a = {};
					let push_item = {};

			        items.map((item, index) => {
						item[1]["sort"] = index;

				        a[item[0]] = item[1]

				        const data = {
							created_date: item[1].created_date || "",
							episode_id: epiActualId || "",
							name: item[1].name || "",
							story: item[1].story || "",
							update_date: item[1].update_date || "",
							summary: item[1].summary || "",
							storyText: item[1].storyText || "",
							notes: item[1].notes || "",
							pulse: item[1].pulse || "",
							sort: index,
						}

				        updateQueries.updateScene(item[0], data, (err, res) => {});

						/*push_item[item[0]] = {
							created_date: item[1].created_date || "",
							episode_id: epiActualId || "",
							name: item[1].name || "",
							story: item[1].story || "",
							update_date: item[1].update_date || "",
							summary: item[1].summary || "",
							storyText: item[1].storyText || "",
							notes: item[1].notes || "",
							pulse: item[1].pulse || "",
							sort: index,
						}*/
			        });

					// const ref = fire.database().ref();
					// Pending
					// ref.child("test_episode").child(season_id).child(epiActualId).child("scenes").update(push_item);

			        this.setState(prevState => ({
				        ...prevState,
				        world: {
					        ...prevState.world,
					        seasons: {
						        ...prevState.world.seasons,
						        [season_id]: {
							        ...prevState.world.seasons[season_id],
							        episodes: {
								        ...prevState.world.seasons[season_id].episodes,
								        [episodeId]: {
									        ...prevState.world.seasons[season_id].episodes[episodeId],
									        scenes: a
								        }
							        }
						        }
					        }
				        }
			        }));
		        }

		        if (actType === "episode") {
					if (source.droppableId !== destination.droppableId) return;

			        const ssseason_id = source.droppableId;

					if (!this.state.world.seasons[ssseason_id]) return;
					if (!this.state.world.seasons[ssseason_id].episodes) return;

			        let list = Object.entries(this.state.world.seasons[ssseason_id].episodes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

			        const items = reorderBeat(
	                    list,
	                    source.index,
	                    destination.index
                	);

			        let last_index = items.length - 1;

			        if (destination.index === last_index) {
				        let last_item = items[last_index];
				        let change_item = items[source.index];
			        } else if (source.index === last_index) {
				        let last_item = items[last_index];
				        let change_item = items[destination.index];
			        }

                	let a = {};

			        items.map((item, index) => {
						item[1]["sort"] = index;

				        a[item[0]] = item[1];

				        const data = {
							created_date: item[1].created_date || "",
							season_id: ssseason_id || "",
							name: item[1].name || "",
							update_date: item[1].update_date || "",
							summary: item[1].summary || "",
							notes: item[1].notes || "",
							pulse: item[1].pulse || "",
							sort: index,
						}

				        updateQueries.updateEpisode(item[0], data, (err, res) => {});
			        });

			        this.setState(prevState => ({
				        ...prevState,
				        world: {
					        ...prevState.world,
					        seasons: {
						        ...prevState.world.seasons,
						        [ssseason_id]: {
							        ...prevState.world.seasons[ssseason_id],
							        episodes: a
						        }
					        }
				        }
			        }));
		        }
	      	} else if (destination.droppableId.split(" ")[0] === "delete") {
				confirmAlert({
					title: 'Are you sure?',
					message: `You want to delete this?`,
					buttons: [
						{
							label: 'No'
						},
						{
							label: 'Yes, Delete it!',
							onClick: () => {
								const ref = db.ref();

								if (actType === "season") {
									if (notHis) {
										alert("You didn't have access to delete Season");

										return;
									}

									const list = Object.entries(this.state.world.seasons);

									let items = remove(
										list,
										source
									);

									let a = {};

									items.map(item => {
										a[item[0]] = item[1]
									});

									// const season = ref.child("season");
									// const episode = ref.child("test_episode");

									const user_id = localStorage.getItem("storyShop_uid");
									const { world_id, series_id } = this.props.match.params;

									if (!user_id || !world_id || !series_id) {
										return;
									}

									// draggableId === season_id //
									// const child = season.child(draggableId);
									// const beat = ref.child("beats").child(world_id).child(series_id).child(draggableId);
									// const wordCount = ref.child("word_count");
									// const seasonCount = wordCount.child("season_count").child(world_id).child(series_id).child(draggableId);
									// const seriesCount = wordCount.child("series_count").child(world_id).child(series_id);
									// const worldCount = wordCount.child("world_count").child(world_id);

									// episode.child(draggableId).remove();
									// draggableId === season_id //

									deleteQueries.removeSeason(draggableId, (err, res) => {});
									// child.remove();
									// beat.remove();

									getQueries.getSeasonWordCountDoc(draggableId, (error, result) => {
										if (error) {
											console.log(error);
										} else {
											if (result.status === 1) {
												const sCount = result.data.count;

												if (!sCount) return;

												getQueries.getSeriesWordCountDoc(series_id, (err, res) => {
													if (err) {
														console.log(err);
													} else {
														if (res.status === 1 && res.data.count) {
															const serCount = res.data.count;

															const dd = {
																count: parseInt(serCount) - parseInt(sCount)
															}

															updateQueries.updateSeriesWordCount(series_id, dd, (err, res) => {});
														}
													}
												});

												getQueries.getWorldWordCountDoc(world_id, (err, res) => {
													if (err) {
														console.log(err);
													} else {
														if (res.status === 1 && res.data.count) {
															const serCount = res.data.count;

															const dd = {
																count: parseInt(serCount) - parseInt(sCount)
															}

															updateQueries.updateWorldWordCount(world_id, dd, (err, res) => {});
														}
													}
												});
											}
										}
									})

									/*seasonCount.child("count").once('value').then(seaSnapshot => {
										if (seaSnapshot.val()) {
											const sCount = seaSnapshot.val();

											seriesCount.child("count").once('value').then(serSnapshot => {
												if (serSnapshot.val()) {
													const serCount = serSnapshot.val();

													seriesCount.update({ count: parseInt(serCount) - parseInt(sCount) });
												}
											});

											worldCount.child("count").once('value').then(wrldSnapshot => {
												if (wrldSnapshot.val()) {
													worldCount.update({ count: parseInt(wrldSnapshot.val()) - parseInt(sCount) });
												}
											});
										}
									});*/

									this.setState(prevState => ({
										...prevState,
										world: {
											...prevState.world,
											seasons: a
										}
									}));
								}

								if (actType === "scene") {
									const ids = source.droppableId.split(" ");
									const season_id = ids[0];
									const episodeId = ids[1];
									const epiActualId = ids[2];

									const sceIDS = draggableId.split(" ");
									const scene_id = sceIDS[0];
									const sceActualId = sceIDS[1];

									let seasonss = this.state.world.seasons;
									if (!seasonss) return;
									let seasonn = seasonss[season_id];
									if (!seasonn) return;
									let episodess = seasonn.episodes;
									if (!episodess) return;
									let episodee = episodess[episodeId];
									if (!episodee) return;
									let sceness = episodee.scenes;
									if (!sceness) return;
									let scenee = sceness[sceActualId];
									if (!scenee) return;

									let list = Object.entries(this.state.world.seasons[season_id].episodes[episodeId].scenes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

									let items = remove(
										list,
										source
									);

									if (source.index === list.length - 1) {
										let last_index = items.length - 1;
									}

									let a = {};

									items.map((item, index) => {
										item[1]["sort"] = index;

										a[item[0]] = item[1];
									});

									// const scene = ref.child("test_episode").child(season_id).child(epiActualId).child("scenes").set(push_item);
									// const child = scene.child(sceActualId);

									// child.remove();

							    	getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
							    		if (err) {
							    			console.log(err);
							    		} else {
							    			if (res.status === 1) {
							    				const newCount = res.data.count - parseInt(scenee.count || 0);

							    				updateQueries.updateSeasonWordCount(season_id, {
							    					count: newCount
							    				}, (e, r) => {});
							    			}
							    		}
							    	});

							    	const epppp_count = parseInt(episodee.count || 0) - parseInt(scenee.count || 0);

							    	updateQueries.updateEpisode(episodeId, {
							    		count: epppp_count
							    	}, (e, r) => {});

							    	const { world_id, series_id } = this.props.match.params;
							    	const trashData = {
							    		type: "scene",
							    		type_id: sceActualId,
							    		world_id,
							    		series_id,
							    		season_id,
							    		episode_id: episodeId,
							    		scene_id: sceActualId,
							    		trash_at: new Date(),
		    							trash_timestamp: new Date().getTime()
							    	}

							    	updateQueries.updateScene(sceActualId, {isDeleted: true}, (err, res) => {});
							    	updateQueries.updateTrash(sceActualId, trashData, (err, res) => {});

									// deleteQueries.removeScene(sceActualId, (err, res) => {});

									this.setState(prevState => ({
										...prevState,
										world: {
											...prevState.world,
											seasons: {
												...prevState.world.seasons,
												[season_id]: {
													...prevState.world.seasons[season_id],
													count: parseInt(seasonn.count) - parseInt(scenee.count || 0),
													episodes: {
														...prevState.world.seasons[season_id].episodes,
														[episodeId]: {
															...prevState.world.seasons[season_id].episodes[episodeId],
															count: epppp_count,
															scenes: a
														}
													}
												}
											}
										}
									}));
									return;
								}

								if (actType === "episode") {
									const season_id = source.droppableId;
									const episode_id = draggableId;

									if (!this.state.world.seasons) return;
									if (!this.state.world.seasons[season_id]) return;
									if (!this.state.world.seasons[season_id].episodes) return;
									const episodes = this.state.world.seasons[season_id].episodes;

									let list = Object.entries(this.state.world.seasons[season_id].episodes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

									const items = remove(
										list,
										source
									);

                            		let nothing = "";

									if (source.index === list.length - 1) {
										let last_index = items.length - 1;
									}

									let a = {};

									items.map((item, index) => {
										if (!item) return;
										item[1]["sort"] = index;

										a[item[0]] = item[1];
									});

									getQueries.getSeasonWordCountDoc(season_id, (err, res) => {
							    		if (err) {
							    			console.log(err);
							    		} else {
							    			if (res.status === 1) {
							    				if (episodes[episode_id]) {
							    					const newCount = res.data.count - episodes[episode_id].count;

							    					updateQueries.updateSeasonWordCount(season_id, {count: newCount}, (e, r) => {});
							    				}
							    			}
							    		}
							    	});

							    	const { world_id, series_id } = this.props.match.params;
							    	const trashData = {
							    		type: "episode",
							    		type_id: episode_id,
							    		world_id,
							    		series_id,
							    		season_id,
							    		episode_id: episode_id,
							    		trash_at: new Date(),
		    							trash_timestamp: new Date().getTime()
							    	}

							    	updateQueries.updateEpisode(episode_id, {isDeleted: true}, (err, res) => {});
							    	updateQueries.updateTrash(episode_id, trashData, (err, res) => {});

									// deleteQueries.removeEpisode(episode_id, (err, res) => {});

									// const episode = ref.child("test_episode").child(season_id).set(push_item);
									// const child = episode.child(episode_id);

									// child.remove();

									this.setState(prevState => ({
										...prevState,
										world: {
											...prevState.world,
											seasons: {
												...prevState.world.seasons,
												[season_id]: {
													...prevState.world.seasons[season_id],
													count: parseInt(this.state.world.seasons[season_id].count) - parseInt(episodes[episode_id].count),
													episodes: a
												}
											}
										}
									}));

									/*if (Object.entries(a).length === 0) {
										this.appendNewEpisode();
									}*/
								}
							}
						}
					]
				});
			} else if (source.droppableId !== destination.droppableId) {
		        const ref = db.ref();

		        if (actType === "episode") {
					return;
			        const source_season_id = source.droppableId;
			        const destination_season_id = destination.droppableId;

					if (!this.state.world.seasons[source_season_id]) return;
					if (!this.state.world.seasons[source_season_id].episodes) return;
					if (!this.state.world.seasons[destination_season_id]) return;
					if (!this.state.world.seasons[destination_season_id].episodes) return;

			        let sourceList = Object.entries(this.state.world.seasons[source_season_id].episodes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));
			        let destinationList = Object.entries(this.state.world.seasons[destination_season_id].episodes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

			        const items = move(
                    	sourceList,
				        destinationList,
                    	source,
                    	destination
                	);

			        let sourceItems = Object.entries(items)[0];
			        let destinationItems = Object.entries(items)[1];

			        let sourceId = sourceItems[0];
                	let sourceA = {};
			        let destinationId = destinationItems[0];
			        let destinationA = {};

			        sourceItems[1].map(item => {
				        let d = item[1];

				        d ? d.season_id = source_season_id : item[1] = item[1];

				        sourceA[item[0]] = d;
			        });

			        destinationItems[1].map(item => {
				        let d = item[1];

				        d ? d.season_id = destination_season_id : item[1] = item[1];

				        destinationA[item[0]] = d;
			        });

			        let source_last_index = sourceList.length - 1;
			        let destination_last_index = destinationList.length - 1;

			        if (source.index === source_last_index) {
				        let keys = Object.keys(sourceA);
			        }
			        if (destination.index > destination_last_index) {
				        let keys = Object.keys(destinationA);
			        } else {
				        let keys = Object.keys(destinationA);
			        }

					// ref.child("episode").child(draggableId).update({season_id: destinationId});
					console.log(sourceId, sourceA)
					console.log(destinationId, destinationA)
					// ref.child("test_episode").child(sourceId).
					// ref.child("test_episode").child(destinationId).

			        // ref.child("episode").child(draggableId).update({season_id: destinationId});

			        if (Object.entries(sourceA).length < 1) {
				        sourceA = {
					        episode0: {
							    name: "",
							    edit: false,
							    showEpisode: true,
							    open: false,
							    scenes: {}
						    }
				        }
			        }
			        if (Object.entries(destinationA).length < 1) {
				        destinationA = {
					        episode0: {
							    name: "",
							    edit: false,
							    showEpisode: true,
							    open: false,
							    scenes: {}
						    }
				        }
			        }

			        this.setState(prevState => ({
				        ...prevState,
				        world: {
					        ...prevState.world,
					        seasons: {
						        ...prevState.world.seasons,
						        [sourceId]: {
							        ...prevState.world.seasons[sourceId],
							        episodes: sourceA
						        },
						        [destinationId]: {
							        ...prevState.world.seasons[destinationId],
							        episodes: destinationA
						        }
					        }
				        }
			        }));
		        } else if (actType === "scene") {
			        const ids = source.droppableId.split(" ");
			        const season_id = ids[0];
			        const episodeId = ids[1];
			        const epiActualId = ids[2];

			        const destinationIDS = destination.droppableId.split(" ");
			        const destination_season_id = destinationIDS[0];
			        const destination_episodeId = destinationIDS[1];
			        const destination_epiActualId = destinationIDS[2];

			        const sourceList = Object.entries(this.state.world.seasons[season_id].episodes[episodeId].scenes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));
			        const destinationList = Object.entries(this.state.world.seasons[destination_season_id].episodes[destination_episodeId].scenes).sort(([epi_id1, epi_data1], [epi_id2, epi_data2]) => (epi_data1.sort || 0) - (epi_data2.sort || 0));

			        const items = move(
                    	sourceList,
				        destinationList,
                    	source,
                    	destination
                	);

			        let sourceItems = Object.entries(items)[0];
			        let destinationItems = Object.entries(items)[1];

			        let sourceSeasonId = sourceItems[0].split(" ")[0];
			        let sourceId = sourceItems[0].split(" ")[1];
			        let sourceActId = sourceItems[0].split(" ")[2];
                	let sourceA = {};
			        let destinationSeasonId = destinationItems[0].split(" ")[0];
			        let destinationId = destinationItems[0].split(" ")[1];
			        let destinationActId = destinationItems[0].split(" ")[2];
			        let destinationA = {};

			        if (sourceSeasonId !== destinationSeasonId) return;

			        sourceItems[1].map(item => {
				        let d = item[1];
				        item[1] ? d.episode_id = sourceActId : item[1] = item[1];

				        sourceA[item[0]] = d;
			        });

			        destinationItems[1].map(item => {
				        let d = item[1];

				        item[1] ? d.episode_id = destinationActId : item[1] = item[1];
				        destinationA[item[0]] = d;
			        });

			        let source_last_index = sourceList.length - 1;
			        let destination_last_index = destinationList.length - 1;

			        if (source.index === source_last_index) {
				        let keys = Object.keys(sourceA);
			        }
			        if (destination.index > destination_last_index) {
				        let keys = Object.keys(destinationA);
			        } else {
				        let keys = Object.keys(destinationA);
			        }

					if (Object.entries(sourceA).length < 1) {
						// ref.child("test_episode").child(sourceSeasonId).child(sourceId).child("scenes").remove();
					} else {
						let s_data = {};

						Object.entries(sourceA).map(([scene_id, scene_data], index) => {
							scene_data["sort"] = index;

							sourceA[scene_id] = scene_data;

							const d_scene = {
					        	episode_id: sourceId || "",
					        	sort: index,
					        }

					        updateQueries.updateScene(scene_id, d_scene, (err, res) => {});
						});

						// ref.child("test_episode").child(sourceSeasonId).child(sourceId).child("scenes").set(s_data);
					}

					if (Object.entries(destinationA).length < 1) {
						// ref.child("test_episode").child(sourceSeasonId).child(destinationId).child("scenes").remove();
					} else {
						let d_data = {};

						Object.entries(destinationA).map(([scene_id, scene_data], index) => {
							scene_data["sort"] = index;

							destinationA[scene_id] = scene_data;

							const d_scene = {
					        	episode_id: destinationId || "",
					        	sort: index,
					        }

					        updateQueries.updateScene(scene_id, d_scene, (err, res) => {});
						});

						// ref.child("test_episode").child(sourceSeasonId).child(destinationId).child("scenes").set(d_data);
					}

			        // ref.child("scene").child(draggableId.split(" ")[1]).update({episode_id: destinationActId});

			        /*const d_scene = {
			        	episode_id: destinationActId
			        }

			        updateQueries.updateScene(draggableId.split(" ")[1], d_scene, (err, res) => {});*/

			        this.setState(prevState => ({
				        ...prevState,
				        world: {
					        ...prevState.world,
					        seasons: {
						        ...prevState.world.seasons,
						        [sourceSeasonId]: {
							        ...prevState.world.seasons[sourceSeasonId],
							        episodes: {
								        ...prevState.world.seasons[sourceSeasonId].episodes,
								        [sourceId]: {
									        ...prevState.world.seasons[sourceSeasonId].episodes[sourceId],
									        scenes: sourceA
								        },
								        [destinationId]: {
									        ...prevState.world.seasons[sourceSeasonId].episodes[destinationId],
									        scenes: destinationA
								        }
							        }
						        }
					        }
				        }
			        }));
		        }
	      }
    }

    keyFoundAssistant = () => {
		this.setState({ showCardList: true });
	}

    toggleSuggestor = (metaInformation, sceneKey) => {
	    const { hookType, cursor } = metaInformation;

	    console.log(hookType, cursor);

	    if (hookType === 'start') {
	      	this.setState(prevState => ({
	      		...prevState,
	      		suggestorState: {
	      			...prevState.suggestorState,
	      			[sceneKey]: {
	      				showSuggestor: true,
			        	left: cursor.left,
			        	top: cursor.top + cursor.height, // we need to add the cursor height so that the dropdown doesn't overlap with the `@`.
			        	startPosition: cursor.selectionStart,
	      			}
	      		}
	      	}));
	    }

	    if (hookType === 'cancel') {
	      	// reset the state

	      	this.setState(prevState => ({
	      		...prevState,
	      		suggestorState: {
	      			...prevState.suggestorState,
	      			[sceneKey]: {
	      				showSuggestor: false,
				        left: null,
				        top: null,
				        text: null,
				        startPosition: null,
	      			}
	      		}
	      	}));
	    }
  	}

  	handleInput = (metaInformation, sceneKey) => {
  		let cmp = this.searchFromBuilders(metaInformation.text);

  		this.setState(prevState => ({
	      	...prevState,
	      	suggestorState: {
	      		...prevState.suggestorState,
	      		[sceneKey]: {
	      			...prevState.suggestorState[sceneKey],
				    text: metaInformation.text,
				    cmp: cmp
	      		}
	      	}
	    }));
  	}

  	suggestorSelection = (sceneKey, id) => {
  		this.setState(prevState => ({
	      	...prevState,
	      	suggestorState: {
	      		...prevState.suggestorState,
	      		[sceneKey]: {
	      			...prevState.suggestorState[sceneKey],
				    selected_item: id
	      		}
	      	}
	    }));
  	}

  	handleKeyDown = (sceneKey) => event => {
  		const { which } = event;

  		if (which === 27) {
  			const handler = this.ref[`${sceneKey}-trigger`];

  			if (handler) {
  				handler();
  			}
  		}
  	}

  	searchFromBuilders = (text) => {
  		let cmp = {};

  		try {
  			worldBuilders.map(type => {
			    let whichInitFields = `${type.toLowerCase()}InitFields`;
			    let whichFields = `${type.toLowerCase()}Fields`;

			    if (type === "Character") {
				    whichInitFields = "charInitFields";
				    whichFields = "charFields";
			    }

			    if (this.state[whichInitFields]) {
				    Object.entries(this.state[whichInitFields]).filter( ([key, item]) => {
					    // Loop on world bar categories (i.e charFields, galaxyFields)
					    // item => charFields

					    Object.entries(item).filter(([itemKey, itemName]) => {
						    if (itemKey === "relation") {
							    if (itemName.has) {
								    Object.entries(itemName.val).forEach(([relKey, relVal]) => {
									    let relWhichInitFields = `${relVal.type}InitFields`;
									    let relWhichFields = `${relVal.type}Fields`;

									    if (relVal.type === "character") {
										    relWhichInitFields = "charInitFields";
										    relWhichFields = "charFields";
									    }

									    const relationFind = this.state[relWhichInitFields][relVal.charId];

									    if (!relationFind) return;

									    if (relationFind.name.val.toLowerCase().search(text.toLowerCase()) !== -1) {
										    if (cmp[whichFields]) {
											    cmp[whichFields][key] = item;
										    } else {
											    cmp[whichFields] = {[key]: item};
										    }
									    }
								    })
							    }
						    } else if (itemKey === "aliases") {
							    if (itemName.has) {
								     Object.entries(itemName.tags).forEach(( [itemKey, tagVal] ) => {
									    if (tagVal.toLowerCase().search(text.toLowerCase()) !== -1) {
										    if (cmp[whichFields]) {
											    cmp[whichFields][key] = item;
										    } else {
											    cmp[whichFields] = {[key]: item};
										    }
									    }
								    })
							    }
						    } else if (itemKey === "realAliases") {
							    if (itemName.has) {
								     Object.entries(itemName.tags).forEach(( [itemKey, tagVal] ) => {
									    if (tagVal.toLowerCase().search(text.toLowerCase()) !== -1) {
										    if (cmp[whichFields]) {
											    cmp[whichFields][key] = item;
										    } else {
											    cmp[whichFields] = {[key]: item};
										    }
									    }
								    })
							    }
						    }
						    else if (searchBlackList.includes(itemKey)) { /* Do nothing if itemKey in black list */ }
						    else if (itemKey === "") {}
						    else if (itemName.has && itemName.val) {
							    if (itemName.val && itemName.val.toLowerCase().search(text.toLowerCase()) !== -1 ) {
								    if (cmp[whichFields]) {
									    cmp[whichFields][key] = item;
								    } else {
									    cmp[whichFields] = {[key]: item};
								    }
							    }
						    }
					    })
				    })
			    }
		    });
  		} catch(e) {
  			console.log(e);
  		}

	    return cmp;
  	}

    handleSearch = event => {
	    const { name, value } = event.target;

	    if (this.worldBuilderSearchTimmer) {
	    	clearTimeout(this.worldBuilderSearchTimmer);
	    	this.worldBuilderSearchTimmer = null;
	    }

	    if (!value || !value.trim()) {
	    	worldBuilders.map(type => {
				let whichFields = `${type.toLowerCase()}Fields`;
				let whichInitFields = `${type.toLowerCase()}InitFields`;

				if (type === "Character") {
					whichFields = "charFields";
					whichInitFields = "charInitFields";
				}

				this.setState({
					[whichFields]: this.state[whichInitFields] || {}
				});
			});

			return this.setState({ [name]: value });
	    }

	    const { worldBarFilter } = this.state;

	    let matchWith = {
	    	world_id: this.props.match.params.world_id
	    }

	    if (worldBarFilter.selectedFilter === "showInSeries") {
	    	matchWith = {
		    	series_id: worldBarFilter[worldBarFilter.selectedFilter].id
		    }
	    }

	    this.worldBuilderSearchTimmer = setTimeout(() => {
	    	appbaseRef.search({
		    	type: "builders",
		    	body: {
				  	"query": {
					    "bool": {
					      	"filter": [
						        {
						          	"match": matchWith
						        },
						        {
						          	"multi_match": {
						            	"query": value,
										"type":  "phrase_prefix",
						            	"fields": [
						              		"name", "realAliases", "aliases", "description", "birth",
											"death", "marital", "internal_conflicts", "orientation",
											"habits", "personality", "working_notes", "start", "end",
											"thnicity", "gender", "external_conflicts", "physical_description",
											"availability", "occupation", "background", "ethnicity", "alignment.goods",
											"alignment.evils", "alignment.neutrals"
						            	],
										"operator" : "and"
						          	}
						        }
					      	]
					    }
				  	}
				}
		    }).then(res => {
		    	if (res.hits.hits.length > 0) {
		    		let cmp = {}

		    		res.hits.hits.map(item => {
		    			const crd_id = item._id;
		    			const crd_data = item._source || {};

		    			let whichFields = `${crd_data.category.toLowerCase()}Fields`;
					    let whichInitFields = `${crd_data.category.toLowerCase()}InitFields`;

					    if (crd_data.category.toLowerCase() === "character") {
						    whichFields = "charFields";
						    whichInitFields = "charInitFields";
					    }

					    if (cmp[whichFields]) {
					    	if (this.state[whichInitFields][crd_id]) {
					    		cmp[whichFields][crd_id] = this.state[whichInitFields][crd_id] || {};
					    	}
						} else {
							if (this.state[whichInitFields][crd_id]) {
								cmp[whichFields] = {[crd_id]: this.state[whichInitFields][crd_id]} || {};
							}
						}
		    		});

		    		worldBuilders.map(type => {
					    let whichFields = `${type.toLowerCase()}Fields`;
					    let whichInitFields = `${type.toLowerCase()}InitFields`;

					    if (type === "Character") {
						    whichFields = "charFields";
						    whichInitFields = "charInitFields";
					    }

					    this.setState({
						    [whichFields]: cmp[whichFields] ? cmp[whichFields] : {}
					    });
				    });
		    	} else {
		    		worldBuilders.map(type => {
					    let whichFields = `${type.toLowerCase()}Fields`;
					    let whichInitFields = `${type.toLowerCase()}InitFields`;

					    if (type === "Character") {
						    whichFields = "charFields";
						    whichInitFields = "charInitFields";
					    }

					    this.setState({
						    [whichFields]: {}
					    });
				    });
		    	}
		    }).catch(err => {
		    	console.log(err);
		    });
	    }, 500);

	    return this.setState({ [name]: value });
    }

    expandScenes = (index) => {
		this.setState(prevState => ({
			...prevState,
			expandBeatsMode: {
				...prevState.expandBeatsMode,
				[index]: !prevState.expandBeatsMode[index]
			}
		}))
	}

	expandBeat = value => {
		if (value === "pov" && this.state.showLite) {
			return this.setState({ commentProOpen: true });
		}
		this.setState({ summ_expand: value, showOneSumm: {}, showExpndOneSumm: {} });
	}

	showSumm = (id, value) => {
		if (this.state.summ_expand) {
			if (value) {
	    		let { showExpndOneSumm, expandButtons } = this.state;

	    		delete showExpndOneSumm[id];

	    		this.setState(prevState => ({
	    			...prevState,
	    			expandButtons: {},
	    			showExpndOneSumm: showExpndOneSumm
	    		}));
	    	} else {
	    		this.setState(prevState => ({
	    			...prevState,
	    			expandButtons: {},
	    			showExpndOneSumm: {
	    				...prevState.showExpndOneSumm,
	    				[id]: true
	    			}
	    		}));
	    	}
		} else {
			if (value) {
	    		this.setState(prevState => ({
	    			...prevState,
	    			expandButtons: {},
	    			showOneSumm: {
	    				...prevState.showOneSumm,
	    				[id]: true
	    			}
	    		}));
	    	} else {
	    		let { showOneSumm, expandButtons } = this.state;

	    		delete showOneSumm[id];

	    		this.setState(prevState => ({
	    			...prevState,
	    			expandButtons: {},
	    			showOneSumm: showOneSumm
	    		}));
	    	}
		}
    }

    openExpButtons = (id) => {
    	this.setState(prevState => ({
    		...prevState,
    		expandButtons: {
    			...prevState.expandButtons,
    			[id]: !this.state.expandButtons[id]
    		}
    	}));
    }

    showTrashRecover = () => {
    	this.setState({ trashRecover: true });
    }

    showWorldWizard = () => {
    	this.setState({ elementNames: [] });

    	const { showLite } = this.state;
    	const { world_id } = this.props.match.params;
    	if (showLite) return;

    	const { season_id } = this.props.match.params;

		////////////////////////
		let data = {
			"bookString": document.querySelector('#main-season-id').innerText
		};

		let headers = {
			'Content-Type': 'application/json'
		}

		axios.post(PREEN_API_STRING, data, {
			headers: headers
		}).then(response => {
			const resp_data = response.data;
			let throttle = throttledQueue(15, 1000);

			if (resp_data.elementNames) {
				const elementNames = resp_data.elementNames.trim().split("\n");

				elementNames.map(item => {
					throttle(() => {
					   this.callAppbaseAPI(world_id, item.trim());
					});
				});
			}

			if (resp_data.unknowns) {
				resp_data.unknowns.map(item => {
					throttle(() => {
					   this.callAppbaseAPI(world_id, item.trim());
					});
				});
			}

			this.setState({ prinIntegration: true });

		}).catch(error => {
			console.log("Error ", error);
			alert("There is an error in export please try after sometime!");
		});
		////////////////////////
    }

    callAppbaseAPI = (world_id, item) => {
    	appbaseRef.search({
			type: "builders",
				body: {
					"query": {
						"bool": {
							"filter": [
								{
								    "match": {
								        "world_id": world_id
								    }
								},
								{
								    "multi_match": {
								    "query": item,
								    "fields": [
								        "name", "realAliases", "aliases"
								    ],
									"operator" : "and"
								}
							}
						]
					}
				},
				"size": 1
			}
		}).then(res => {
			if (res.hits.total === 0) {
				const joined = this.state.elementNames.concat(item);
				this.setState({ elementNames: joined });
			}
		}).catch(err => {
			console.log(err);
		});
    }

    onWorldWizardClose = () => {
    	this.setState({ prinIntegration: false });
    }

    onTrashRecoverClose = () => {
    	this.setState({ trashRecover: false });
    }

    saveBeatSettings = (cancel = false) => {
	      if (cancel) {
	          const { beatStyles } = this.state;

	          this.setState({
		            size: beatStyles.fontSize, type: beatStyles.fontType,
		            indentCheck: beatStyles.indentCheck,
		            setting_pop: false,
		            lineSpacing: ""
	          })

	          return;
	      }

	      const { type, size, indentCheck, lineSpacing } = this.state;

	      let { world_id } = this.props.match.params;

	      if (!world_id) {
		        this.setState({setting_pop: false});
		        return;
	      }

	      let beatStyles = {
		        fontSize: size ? size : "",
		        fontType: type ? type : "",
		        indentCheck: indentCheck ? indentCheck : "",
		        lineSpacing: lineSpacing ? lineSpacing : "",
	      }

	    const callback = (error, result) => {
	      	if (error) {
	      		console.log(error);
	      	} else {
	      		this.setState({ beatStyles, setting_pop: false });
	      	}
	    }

	      updateQueries.updateWorld(world_id, {beatStyles}, callback);
    }

		expandScreen = () => {
			this.setState({ isFull: !this.state.isFull });
		}

	openWordCount = () => {
		this.setState({ openWordCountPop: true });
	}

	closeWordCount = () => {
		this.setState({ openWordCountPop: false });
	}

	handleWorldLink = event => {
		const card_name = MediumEditor.selection.getSelectionRange(document).toString();

		this.setState({ shortcutName: card_name, openShortcutBuilder: true });
	}

	changeWorldBar = type => {
		this.setState(prevState => ({
			...prevState,
			showWBFilter: false,
			worldBarFilter: {
				...prevState.worldBarFilter,
				selectedFilter: type
			}
		}));
	}

	toggleComment = () => {
		if (this.state.showLite) {
			this.setState({ commentProOpen: true });
			return;
		}

		this.setState({ showComments: !this.state.showComments });
	}

    renderRight() {
        const {
        	openBuilderPop, builderChecks, realChecks, world, worldBarFilter, showWBFilter,
		    newSeasonId, writeAccess, search, world_name, showLite, worldBarLoading, filterLoading
		} = this.state;

	    let season = {name: ""};

	    if (world && world.seasons) {
		    season = world.seasons[newSeasonId];
	    }

	    if (worldBarLoading) {
	      	return (
	      		<center>
					<img src={loadingGF} alt="loading..." />
				</center>
	      	)
	    }

        return (
		    <Droppable droppableId="world_bar" type="XYZ">
		        {(pprovided, snapshot) => {
			        return (
				        <div ref={pprovided.innerRef} {...pprovided.droppableProps} className='right-pad-content'>
				            {/*<div className='season-name cmn-hd-cl'>{world_name}</div>*/}

					        <div ref={(node) => this.setWrapperRef('showWBFilter', node)} className='season-name'>
		                   		<div className='main-slt-name' onClick={() => this.setState({ showWBFilter: !showWBFilter })}>
		                   			<span className='icn-name'>
		                   				{
		                   					worldBarFilter.selectedFilter === "showInWorlds" && (
		                   						<img src={world_filter_icon} alt="worldBar icon" />
		                   					)
		                   				}

		                   				{
		                   					worldBarFilter.selectedFilter === "showInSeries" && (
		                   						<img src={series_filter_icon} alt="worldBar icon" />
		                   					)
		                   				}

		                   				{
		                   					worldBarFilter.selectedFilter === "showInSeason" && (
		                   						<img src={book_filter_icon} alt="worldBar icon" />
		                   					)
		                   				}
		                   			</span>

		                   			<div className='rel-name'>
		                   				{
		                   					worldBarFilter[worldBarFilter.selectedFilter].name
		                   				}
										<span className="fixed-hov-ob">Filter World Bar</span>
		                   			</div>

		                   			<span className='drp-icn'>
		                   				{
		                   					showWBFilter ? (
		                   						<i className="fa fa-angle-up"></i>
		                   					) : (
		                   						<i className="fa fa-angle-down"></i>
		                   					)
		                   				}
		                   			</span>
		                   		</div>

		                   		{
		                   			showWBFilter ? filterLoading ? (
		                   				<center>
				          					<img src={loadingGF} alt="loading..." />

				          					<h4>Please wait while we are filtering your content. It may take time than usual. Thanks for your patience.</h4>
				        				</center>
		                   			)
		                   			:
		                   			(
		                   				<div className='drp-lst'>
				                   			<div className='slt-name' onClick={() => this.changeWorldBar("showInWorlds")}>
					                   			<span className='wld-icn icn-name'>
					                   				<img src={world_filter_icon} alt="worldBar icon" />
					                   				<span className="fixed-hov-ob">Filter World Bar by Entire World</span>
					                   			</span>
					                   			<span className='rel-name'>
					                   				{
					                   					worldBarFilter["showInWorlds"].name
					                   				}
					                   			</span>
					                   		</div>

					                   		<div className='slt-name' onClick={() => this.changeWorldBar("showInSeries")}>
					                   			<span className='sr-icn icn-name'>
					                   				<img src={series_filter_icon} alt="worldBar icon" />
					                   				<span className="fixed-hov-ob">Filter World Bar by Current Series</span>
					                   			</span>
					                   			<span className='rel-name'>
					                   				{
					                   					worldBarFilter["showInSeries"].name
					                   				}
					                   			</span>
					                   		</div>

					                   		<div className='slt-name' onClick={() => this.changeWorldBar("showInSeason")}>
					                   			<span className='bk-icn icn-name'>
					                   				<img src={book_filter_icon} alt="worldBar icon" />
					                   				<span className="fixed-hov-ob">Filter World Bar by Current Book</span>
					                   			</span>
					                   			<span className='rel-name'>
					                   				{
					                   					worldBarFilter["showInSeason"].name
					                   				}
					                   			</span>
					                   		</div>

					                   		{/*<div className='slt-name' onClick={() => this.changeWorldBar("showInBroke")}>
					                   			<span className='icn-name'>
					                   				<img src={dummay} alt="worldBar icon" />
					                   			</span>
					                   			<span className='rel-name'>
					                   				{
					                   					worldBarFilter["showInBroke"].name
					                   				}
					                   			</span>
					                   		</div>*/}
				                   		</div>
		                   			) : null
		                   		}
					        </div>

					        <div className='world-war-search'>
						        <TextField name="search" placeholder="Search"
						            value={search} onChange={this.handleSearch}/>
					        </div>

					        <div className='world-builder-cards'>
					            {realChecks && Object.keys(realChecks).map((item, index_key) => {
						            // console.log(item)
						            // console.log(realChecks[item]);
						            if (realChecks[item]) {
							            let whichFields = `${item}Fields`;

							            if (item === "character") {
								            whichFields = "charFields";
							            }

							            return (
							                <Droppable key={index_key} droppableId={item} type={this.state.itemExpand[item] ? "ABC" : "typeChange"} ignoreContainerClipping={true}>
							                    {(provided, snapshot) => {
								                    return (
								                        <div ref={provided.innerRef} {...provided.droppableProps} style={{width: '100%', 'minHeight': '20px'}}>
									                        <ExpansionPanel onChange={this.handleWorldExpansion(item)}>
										                        <ExpansionPanelSummary className={`${this.state.itemExpand[item] ? "wb-card grn-card" : "wb-card"}`} expandIcon={<ExpandMoreIcon />}>
											                        <div className='builder'>
											                            {
											                                item.toLowerCase() !== "notes & reference" ?
											                                	item.charAt(0).toUpperCase() + item.slice(1)
											                                :
											                                    "Notes/Reference"
											                            }
											                        </div>

											                        <div className='b-cnt'>
											                        	{
											                                this.state[whichFields] ?
											                                    Object.keys(this.state[whichFields]).length
											                                :
											                                    0
											                            }
											                        </div>
										                        </ExpansionPanelSummary>

										                        <ExpansionPanelDetails className='builder-card'>
										                            {/*<Droppable droppableId={item} type="ABC">
											                            {(provided, snapshot) => {
												                            return (
													                            <div ref={provided.innerRef} {...provided.droppableProps} style={{width: '100%', 'min-height': '10px'}}>
											                        */}{
											                        	this.state[whichFields] && Object.entries(this.state[whichFields])
											                        	.sort(([charKey1, char1], [charKey2, char2]) => {
											                        		if (char1 && char1.name && char1.name.val.toLowerCase() < char2 && char2.name && char2.name.val.toLowerCase()) return -1;
																			if (char1 && char1.name &&char1.name.val.toLowerCase() > char2 && char2.name && char2.name.val.toLowerCase()) return 1;
																			return 0;
											                        	})
											                        	.map(([charKey, char], index) => {
																			const dd = JSON.parse(JSON.stringify(char));
																			if (!dd) return null;
																			return (
															                    <Draggable key={charKey} draggableId={charKey} type={this.state.itemExpand[item] ? "ABC" : "typeChange"} index={index}>
															                        {(provided, snapshot) => {
																                        return (
																	                        <div ref={provided.innerRef}
																	                            {...provided.draggableProps}
																	                            {...provided.dragHandleProps}
																	                            style={getCardItemStyle(
																		                            snapshot.draggingOver,
																		                            provided.draggableProps.style
																	                            )} data={charKey}
																	                            className={`main-char ${this.state.charKey === charKey ? "crd-act" : ""}`}
																	                            onClick={() => this.CardClick(item, charKey, dd, true)}>
																	                            	<div className='grd-cmnt'>
																	                            		<div className='char-name_e cmn-hd-cl'>{char.name.val}</div>
																		                            	<div className='char-short-name'>{char.realAliases.tags.map(tg => `"` + tg + `" `)}</div>
																	                            	</div>

																	                            	<div className='char-prf-crl'>
																										{
																											char && char.cardAvatar ? (
																												<img className='char-prf-avtr' style={
																													{height: '50px', width: '50px', borderRadius: '50%'}
																												} src={
																													char.cardAvatar.url
																												} alt={
																													char.cardAvatar.name
																												} />
																											) : (
																												<Avatar size="50px" style={
																													{height: '50px', width: '50px', borderRadius: '150px'}
																												} className='char-prf-avtr' name={char && char.name && char.name.val} round={true} />
																											)
																										}
																									</div>
																	                        </div>
																                        )
															                        }}
															                    </Draggable>
														                    )
													                    })
											                        }
													                {provided.placeholder}
														            {/*</div>
												                     )
											                        }}
							                                        </Droppable>*/}
											                        {
											                        	writeAccess && (
												                        	showLite ?
												                        		liteWorldBuilders.includes(`${item.charAt(0).toUpperCase() + item.slice(1)}`)
												                        	:
												                        		true
												                        ) && (
											                        		<div className='fields-pop'>
												                                <Button className="bt-new-btn ltl-grn" color="primary"
												                                    aria-label="Add" onClick={() => this.openCardClick(item)}>
													                                    <AddIcon />
																															<span className="fixed-hov-ob">Add New World Card</span>
												                                </Button>

											                                </div>
											                            )
												                    }
										                        </ExpansionPanelDetails>
									                        </ExpansionPanel>
									                    </div>
									                )
							                    }}
							                    </Droppable>
											)
						                }
					                })}
					            </div>

                             	{
                             		writeAccess && (
                             			<div className='add-pad'>
                                 			<AddBuilder open={openBuilderPop}
                                             openModal={this.openBuilderModal}
                                             closeModal={this.closeBuilderModal}
                                             handleFieldSave={this.handleBuilderSave}
                                             builderChecks={builderChecks}
                                             handleChange={this.addBuilderChange}
                                             cancelBuilderModal={this.cancelBuilderModal} />
                            			</div>
                            		)
                             	}

		                        <Droppable droppableId="delete delete" type="ABC" ignoreContainerClipping={true}>
				                    {(provided, snapshot) => {
										return (
											<div ref={provided.innerRef}
												className='aln-beat-dlt cmn-dlt_t fields-pop aln-dlt'
												{...provided.droppableProps}>
													{
														this.state.worldBarDelete ?
															<img alt="delete" src={getDeleteSrc(snapshot.isDraggingOver)} />
														:
															""
													}
											</div>
										)
				                    }}
		                        </Droppable>
                            	{this.renderCards()}
                        	</div>
	                   	)}}
	          	</Droppable>
        )
    }

    renderCards() {
        const { openCharCard, openComonCard, whichCard, openComonUpdate, openCharUpdate,
                charCardData, writeAccess, showSocialChar,
	              charFields, galaxyFields, systemFields, planetFields,
	              continentFields, countryFields, regionFields, stateFields, cityFields, districtFields,
	              settingFields, charKey
        } = this.state;

        const { world_id, series_id, season_id } = this.props.match.params;

		const locationFields = this.state["specific locationFields"];

        return (
            <div className='cards-pop'>
                <CharCard open={openCharCard} openModal={this.openModals} closeModal={this.closeModals}
                          openField={openCharUpdate} charKey={charKey} data={charCardData} showSocialChar={showSocialChar}
                          season_id={season_id} series_id={series_id} world_id={world_id}
                          handleFieldSave={this.handleFieldSave} charCardSave={this.CardSave}
		                      writeAccess={writeAccess} charFields={charFields} galaxyFields={galaxyFields}
		                      systemFields={systemFields} planetFields={planetFields} continentFields={continentFields}
		                      countryFields={countryFields} regionFields={regionFields} stateFields={stateFields}
		                      cityFields={cityFields} districtFields={districtFields}
		                      locationFields={locationFields} settingFields={settingFields}/>

		            <ComonCard open={openComonCard} openModal={this.openModals} closeModal={this.closeModals} data={charCardData}
                           openField={openComonUpdate} writeAccess={writeAccess} showSocialChar={showSocialChar}
                           season_id={season_id} series_id={series_id} world_id={world_id}
                           charCardSave={this.CardSave} charKey={charKey} handleFieldSave={this.handleFieldSave}
		                       charFields={charFields} galaxyFields={galaxyFields}
		                       systemFields={systemFields} planetFields={planetFields} continentFields={continentFields}
		                       countryFields={countryFields} regionFields={regionFields} stateFields={stateFields}
		                       cityFields={cityFields} districtFields={districtFields}
		                       locationFields={locationFields} settingFields={settingFields} whichCard={whichCard}
                />
            </div>
        )
    }

	render() {
        const { world_id, season_id, series_id } = this.props.match.params;
		const { open, openBeats, openBuilder, writeAccess, beatStyles, season, showEpisode, openBuilderPop, openCharCard, openComonCard,
			world_data, season_data, setting_pop, export_pop, newSeasonId, world, seriesList, openBeatCard, comments, isFull, openWordCountPop,
			wordCount, openShortcutBuilder, shortcutName, beatMode, world_name, background_pop, background_settings,
			prinIntegration, trashRecover, elementNames, showLite, expandBeatsMode, notHis, realChecks, commentsList, showComments, suggestorState,
			commentsList_newItem, commentProOpen, charFields, settingFields
		} = this.state;

		if (!world_data || !season_data) {
            return <Redirect to='/' />
        }

        if (!localStorage.getItem('storyShop_uid')) {
            return <Redirect to='/login' />
        }

	    const popover = {
            position: 'absolute',
            zIndex: '2',
        }
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }

        let countStatus = 0;
        let countGoalStatus = 0;
        let dailyGoal = 0;

        if (wordCount.displayBookCount) {
        	countStatus = wordCount.bookTotal;
        	dailyGoal = wordCount.bookGoal;
        } else if (wordCount.displayTodayCount) {
        	countStatus = wordCount.todayTotal;
        	dailyGoal = wordCount.dailyGoal;
        }

        if (wordCount.includeGoal && dailyGoal !== 0) {
        	countGoalStatus = ((parseInt(countStatus) / parseInt(dailyGoal)) * 100) || 0;

        	countGoalStatus > 100 ? countGoalStatus = 100 : countGoalStatus = countGoalStatus;
        }

        let backgroundStyles = {
        	"backgroundColor": background_settings.background_color || "#f4f4f4"
        }

        if (background_settings.isPicChecked) {
        	backgroundStyles = {
	        	"background": `url(${background_settings.image_url}) no-repeat fixed center`
	        }
        }

		return (
			<Fullscreen
			  className='main-pad'
			  enabled={isFull}
			  onChange={isFull => this.setState({ isFull })}>
				<div className={`${isFull ? "full-screen " : ""}cvr-pad-bar`}>
					<div className='pad-bar'>
						<div className='grp-txt cmn-hd-cl'>
							<div className='pad-save'>{this.state.saveText ? "Saving... " : "Saved "}</div>
							<span>|</span>
							<div className='w-count' onClick={() => this.openWordCount()}>
								{
									wordCount.includeGoal ? numberWithCommas(parseInt(countStatus)) + ' (' + parseInt(countGoalStatus) + '%)' : numberWithCommas(parseInt(countStatus))
								}
								<span className='fixed-hov-ob'>View Word Count Settings</span>
							</div>
							<div></div>
						</div>

						<div className='cover-pad-set'>
							<div ref={(node) => this.setWrapperRef("remove_pop", node)}
							className='pad-setting pad-recover'>
								<div className='rm-btn' onClick={() => this.handlePop("trash_recover")}>
									<img src={exit_tool} />
									<span className='fixed-hov-ob'>Tools</span>
								</div>

								{
									this.state.trash_recover && (
										<div className="setting-pop trash">
											<div className='cmn-trash-bx trash-box' onClick={() => this.showTrashRecover()}>
												<span className='bx-icn'><i className="fas fa-trash-alt"></i></span>
												<span className='bx-txt'>Recover Trash Can</span>
											</div>

											<div className='cmn-trash-bx wizard-box' onClick={() => this.showWorldWizard()}>
												<span className='bx-icn'><i className="fas fa-globe-africa"></i></span>
												<span className='bx-txt'>World Wizard</span>
												{showLite && (<UpgradePop />)}
											</div>
										</div>
									)
								}
							</div>

							<div className='pad-setting pad-expand' onClick={this.expandScreen}>
								<img src={getExpandIcon(isFull)} />
								<span className='fixed-hov-ob'>{isFull ? "Exit Full Screen Mode" : "Full Screen Mode" }</span>
							</div>

				            <div ref={(node) => this.setWrapperRef('setting_pop', node)} className='pad-setting' onClick={() => this.handlePop("setting_pop")}>
					            <img src={getSettingIcon(setting_pop)} />
					            <span className='fixed-hov-ob'>Change Settings</span>
				            </div>

							<div ref={(node) => this.setWrapperRef('export_pop', node)} className='pad-export'>
								<img onClick={() => this.handlePop("export_pop")} src={getExportIcon(export_pop)}/>
								<span className='fixed-hov-ob'>Export Your Story</span>
									{
										export_pop && (
											<div className="setting-pop exp-pop">
									  			{
									  				!this.state.loadExports && (
									  					<div>
									  						<Button className='export-lt' onClick={() => this.printDocument("DOCX")}>Export to DOCX</Button>
										  					{/*<Button className='export-lt' onClick={() => this.printDocument("PDF")}>Export to PDF</Button>*/}
															<Button className='export-lt' onClick={() => this.printDocument("TXT")}>Export to TXT</Button>
															<Button className='export-lt' onClick={() => this.printBars("beat_bar")}>Export Beats</Button>
															<Button className='export-lt' onClick={() => this.printBars("world_bar")}>Export World</Button>
									  					</div>
									  					)
									  			}

									  			{
									  				this.state.loadExports && (
														<center>
								          					<img src={loadingGF} alt="loading..." />

								          					<h4>Please wait while we are exporting your content into doc format. It may take time than usual. Thanks for your patience.</h4>
								        				</center>
													)
									  			}
											</div>
										)
									}
							</div>

		                		{
		                			setting_pop && (
		                				<div ref={(node) => this.setWrapperRef('setting_pop_div', node)} className="setting-pop">
			                  				<div className="fnt bld">
			                  					<div className='main-sh'>
			                  						<div className='st-nm'>Font</div>

			                  						<div className='fnt-type-sh'>
					                      				<label className='lb'>Type </label>
					                      				<NativeSelect
					                      				  className='lb-op'
					                          			  value={this.state.type}
					                          			  onChange={this.handleSettingChange('type')}
					                      				>
									                        <option value="Palatino">Palatino</option>
									                        <option value="tisa of regular">Tisa OT Regular</option>
									                        <option value="Garamond">Garamond</option>
									                        <option value="Cochin">Cochin</option>
									                        <option value="Helvetica">Helvetica</option>
									                        <option value="Times New Roman">Times New Roman</option>
									                        <option value="Arial">Arial</option>
					                      				</NativeSelect>
				                    				</div>

				                    				<div className='fnt-type-sh'>
					                      				<label className='lb'>Size </label>
					                      				<NativeSelect
					                      				  className='lb-op'
					                          			  value={this.state.size}
					                          			  onChange={this.handleSettingChange('size')}
					                      				>
															<option value="">Select Font Size</option>
									                        <option value="font-size-9">Small</option>
									                        <option value="font-size-11">Medium</option>
									                        <option value="font-size-13">Large</option>
									                        <option value="font-size-15">Extra Large</option>
					                      				</NativeSelect>
				                    				</div>
			                  					</div>

			                  					<div className='main-sh'>
			                  						<div className='st-nm'>Paragraphs</div>

			                  						<div className='fnt-type-sh'>
					                    				<label className='lb' style={{"fontSize": "16px"}}>Indents</label>
					                    				<Switch
											              checked={this.state.indentCheck}
											              onChange={() => this.setState({ indentCheck: !this.state.indentCheck })}
											              value="checkedB"
									         			/>
					                    			</div>

					                    			<div className='fnt-type-sh'>
					                    				<label className='lb'>Line Spacing</label>
						                    			<NativeSelect
								                    	  className='lb-op'
								                          value={this.state.lineSpacing}
								                          onChange={this.handleSettingChange('lineSpacing')}
						                    			>
															<option value="">Select Line Spacing</option>
										                    <option value="line-space-1-0">1.0</option>
										                    <option value="line-space-1-2">1.2</option>
										                    <option value="line-space-1-5">1.5</option>
						                    			</NativeSelect>
					                    			</div>
			                  					</div>

			                  					<div className='main-sh'>
			                  						<div className='st-nm'>Background</div>

			                  						<div className='fnt-type-sh'>
			                  							<label className='lb'>Current</label>
				                  						<div className='lb-op'>
				                  							<div className='sm-bx'>
							                  					{
							                  						background_settings.isColorChecked && (
							                  							<div className='c-bx' style={{backgroundColor: background_settings.background_color}}></div>
							                  						)
							                  					}

							                  					{
							                  						background_settings.isPicChecked && (
							                  							<img className='c-bx' alt="20X20" src={background_settings.image_url} />
							                  						)
							                  					}

							                  					{
							                  						!background_settings.isColorChecked && !background_settings.isPicChecked && (
							                  							<div className='default-c c-bx'></div>
							                  						)
							                  					}
							                  				</div>

							                  				<span className="p-hnd">
							                  					<button disabled={showLite} className='ch-bt' onClick={() => this.openBackgroundModal()}>Change</button>
							                  					{showLite && (<UpgradePop />)}
							                  				</span>
							                  			</div>
						                  			</div>
						                  		</div>

						                  		{/*<div className='main-sh ww-ass'>
						                  								                  			<div className='st-nm'></div>

						                  								                  			<div className='fnt-type-sh'>
						                  								                  				<label style={{cursor: 'pointer'}} className='lb' onClick={() => this.showWorldWizard()}>World Wizard</label>

						                  								                  				<div  className='lb-op'>
						                  								                  				</div>
						                  								                  			</div>
						                  								                  		</div>*/}
						                  	</div>

						                 	<div className="fnt btns_s">
							                    <Button className='btn-cncl' onClick={() => this.saveBeatSettings(true)}>Cancel</Button>
							                    {writeAccess && (<Button className='btn-cncl' onClick={() => this.saveBeatSettings()}>Save</Button>) }
						                  	</div>
		                				</div>
		                			)
								}
			          		</div>
			          	</div>
				</div>

				<div className={`cmnt-toggle ${showComments ? '' : 'md-12'}`} onClick={() => this.toggleComment()}>
					<img src={cmnt_toggle} alt="toggle comment" />
					<span className='fixed-hov-ob'>Turn In-Line Comments On/Off</span>
				</div>

				<div ref={(node) => this.setWrapperRef('beats', node)} className='beats left-aln'>
					<div className='float-lft-btn' onClick={() => this.showBeats()}>
						<img className='img-left' alt="Left Open Tag" src={left_btn} />
						<span className='fixed-hov-ob'>Beats Bar</span>
					</div>

					{
					    openBeats && (
					    	<div>
						        <Scrollbars ref={scrollbar => this.beatScrollBar = scrollbar } className={`${isFull ? "full-screen " : ""}cmn-bar lft-scrl ${openBeatCard ? "over-pop-open" : ""} ${beatMode ? 'beat-on' : ''}`} autoHide
							      autoHideTimeout={800}
							      autoHideDuration={200} >
							        {
							            beatMode ? (
							               	<BeatsMode
							               	  handleBeatMode={this.handleBeatMode}
							               	  world_id={world_id}
											  series_id={series_id}
											  season_id={season_id}
											  world_name={world_name}
											  seriesList={seriesList}
											  getAppearance={this.getAppearance}
											  appendNewScene={this.appendNewScene}
											  appendNewEpisode={this.appendNewEpisode}
											  cloneNewScene={this.cloneNewScene}
											  cloneNewEpisode={this.cloneNewEpisode}
											  changeBeatSave={this.changeBeatSave}
											  onBeatBarDragEnd={this.onBeatBarDragEnd}
										      history={this.props.history}
											  writeAccess={writeAccess}
											  removeEpisode={this.removeEpisode}
											  removeScene={this.removeScene}
											  beatScrollBar={this.beatScrollBar}
											  onBeatScrollHandler={this.onBeatScrollHandler}
											  expand={expandBeatsMode}
											  expandScenes={this.expandScenes}
											  openExpButtons={this.openExpButtons}
											  showSumm={this.showSumm} expandBeat={this.expandBeat}
											  summ_expand={this.state.summ_expand}
											  showOneSumm={this.state.showOneSumm}
											  showExpndOneSumm={this.state.showExpndOneSumm}
											  expandButtons={this.state.expandButtons}
											  charFields={charFields}
											  settingFields={settingFields}
											  state={this.state}
							                />
							               ) : (
							               		<BeatBar
											      state={this.state}
											      world_id={world_id}
											      series_id={series_id}
											      season_id={season_id}
											      writeAccess={writeAccess}
											      seriesList={seriesList}
											      showComments={showComments}
											      commentsList={commentsList}
											      commentsList_newItem={commentsList_newItem}
											      onBeatBarDragStart={this.onBeatBarDragStart}
												  onBeatBarDragUpdate={this.onBeatBarDragUpdate}
											      onBeatBarDragEnd={this.onBeatBarDragEnd}
											      handleExpansionPanel={this.handleExpansionPanel}
											      handleExpansion={this.handleExpansion}
											      handleSceneExpension={this.handleSceneExpension}
											      appendNewScene={this.appendNewScene}
											      appendNewEpisode={this.appendNewEpisode}
											      closeModals={this.closeModals}
											      changeBeatSave={this.changeBeatSave}
											      handleSeriesChange={this.handleSeriesChange}
											      history={this.props.history}
											      handleBeatMode={this.handleBeatMode}
											      beatScrollBar={this.beatScrollBar}
											      onBeatScrollHandler={this.onBeatScrollHandler}
										        />
							            )
							        }
					            </Scrollbars>

								<div className={`${isFull ? "full-screen " : ""}close-lft-btn ${beatMode ? 'beat-on' : ''}`} onClick={() => this.showBeats()}>
									<img className='img-right-close' alt="Right Open Tag" src={close_lft_btn} />
									  <span className='fixed-hov-ob'>Close Beats Bar</span>
								</div>

							</div>
						)
					}
				</div>

               	<div ref={(node) => this.setWrapperRef('builder', node)} className='world-builder right-aln'>
                    <div className='float-rgt-btn' onClick={() => this.showWorldBuilder()}>
                        <img className='img-right' alt="Right Open Tag" src={right_btn} />
                        <span className='fixed-hov-ob'>World Bar</span>
                    </div>

                    {
                    	openBuilder && (
			                <DragDropContext onDragStart={this.onWorldBarDragStart} onDragEnd={this.onWorldBarDragEnd}>
				                <Scrollbars ref={scrollbar => this.builderScrollBar = scrollbar } className={`${isFull ? "full-screen " : ""}cmn-bar rgt-scrl ${openBuilderPop || openComonCard || openCharCard ? "over-pop-open" : ""}`} autoHide
				                      autoHideTimeout={800}
				                      autoHideDuration={200} >
					                {this.renderRight()}
				                </Scrollbars>

								<div className={`${isFull ? "full-screen " : ""}close-rgt-btn`} onClick={() => this.showWorldBuilder()}>
									<img className='img-right-close' alt="Right Open Tag" src={close_rgt_btn} />
									<span className="fixed-hov-ob">Close World Bar</span>
								</div>
			                </DragDropContext>
		                )
                    }
                </div>

		        <div style={backgroundStyles} className='season-view'>
                    	<SeasonView world={world} beatStyles={beatStyles} showLite={showLite}
                          appendNewEpisode={this.appendNewEpisode}
                          appendNewScene={this.appendNewScene}
                          handleBtnOpen={this.handleBtnOpen}
                          handleChange={this.handleChange}
                          handleEditorChange={this.handleEditorChange}
                          handleSeasonEdit={this.handleSeasonEdit}
                          handleSeasonClick={this.handleSeasonClick}
                          handleEpisodeEdit={this.handleEpisodeEdit}
                          handleEpisodeClick={this.handleEpisodeClick}
                          handleScene={this.handleScene} handleWorldLink={this.handleWorldLink}
                          handleSceneEdit={this.handleSceneEdit} isFull={isFull}
                          handleSceneClick={this.handleSceneClick} showEpisode={showEpisode}
                          world_id={world_id} season_id={season_id} newSeasonId={newSeasonId}
			              writeAccess={writeAccess} setScrollRef={this.setWrapperRef}
			              commentsList={commentsList} comments={comments} showComments={showComments}
			              keyFoundAssistant={this.keyFoundAssistant} suggestorState={suggestorState}
			              toggleSuggestor={this.toggleSuggestor} handleInput={this.handleInput}
			              suggestorSelection={this.suggestorSelection} handleKeyDown={this.handleKeyDown}
			              toggleComment={this.toggleComment}
			            />

			            <div className="scrl-down" style={{ float:"left", clear: "both" }}
				          ref={(el) => { this.seasonViewEnd = el; }}></div>
                </div>

                <div className='cmnt-pro'>
					{showLite && (<UpgradePop openManual={true} open={commentProOpen} closeModal={this.closeCommentProModal} />)}
				</div>

                <WordCountPop open={openWordCountPop} closeModal={this.closeWordCount}
                	writeAccess={writeAccess}
                  	world_id={world_id} series_id={series_id} season_id={season_id}
                />

                <AddShortcutBuilder open={openShortcutBuilder}
                      closeModal={this.closeSBuilderModal}
                      handleFieldSave={this.handleSBuilderSave}
                      name={shortcutName} />

                <BackgroundPop
                	  open={background_pop}
                	  closeModal={this.closeBackgroundModal}
                	  season_id={season_id}
                	  series_id={series_id}
                	  world_id={world_id}
                	  writeAccess={writeAccess}
                	  saveBeatSettings={this.saveBeatSettings}
                />

                <Snackbar
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      open={open}
                      autoHideDuration={1000}
                      onClose={this.handleErrorClose}
                      ContentProps={{
                        'aria-describedby': 'message-id',
                      }}
                      message={<span id="message-id">Fields Required</span>}
                />

                <PrinIntegration
                	  open={prinIntegration}
                	  closeModal={this.onWorldWizardClose}
                	  elementNames={elementNames}
                	  handleFieldSave={this.handlePreenBuilderSave}
                	  writeAccess={writeAccess}
                	  season_id={season_id}
                	  realChecks={realChecks}
                	  searchFromBuilders={this.searchFromBuilders}
                />

                <TrashCanRecover
                	open={trashRecover}
                	season_id={season_id}
                	world_id={world_id}
                	series_id={series_id}
                	closeModal={this.onTrashRecoverClose}
                	writeAccess={writeAccess}
                />

			</Fullscreen>
		)
	}
}

export default MainPad;
