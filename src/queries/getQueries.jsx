import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Functions of user table
const users = firestoreDb.collection("users");

const getUserWithDoc = (user_id, cb) => {
	users.doc(user_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 15"}, null);
	});
}

const getUserWithEmail_id = (email_id, cb) => {
	users.where("email_id", "==", email_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 27"}, null);
	});
}

// Functions of worlds table
const worlds = firestoreDb.collection("worlds");

const getWorldsWithUser_id = (user_id, cb) => {
	worlds.where("user_id", "==", user_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 39"}, null);
	});
}

const getWorldWithDoc = (world_id, cb) => {
	worlds.doc(world_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 51"}, null);
	});
}


// Functions of access table
const access = firestoreDb.collection("access");

const getAccessWithDoc = (access_id, cb) => {
	access.doc(access_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 63"}, null);
	});
}

const getAccessWithUser_id = (user_id, cb) => {
	access.where("user_id", "==", user_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 75"}, null);
	});
}

const getAccessWithWorld_id = (world_id, cb) => {
	access.where("world_id", "==", world_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line NO. 87"}, null);
	});
}

// Functions of series table
const series = firestoreDb.collection("series");

const getSeriesWithDoc = (series_id, cb) => {
	series.doc(series_id).get().then().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 108"}, null);
	});
}

const getSeriesWithWorld_id = (world_id, cb) => {
	series.where("world_id", "==", world_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 120"}, null);
	});
}

const getSeriesWithUser_id = (user_id, cb) => {
	series.where("user_id", "==", user_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 120"}, null);
	});
}

// Functions of seasons table
const seasons = firestoreDb.collection("seasons");

const getSeasonWithDoc = (season_id, cb) => {
	seasons.doc(season_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 148"}, null);
	});
}

const getSeasonWithWorld_id = (world_id, cb) => {
	seasons.where("world_id", "==", world_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 160"}, null);
	});
}

const getSeasonWithSeries_id = (series_id, cb) => {
	seasons.where("series_id", "==", series_id)
	  .get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 160"}, null);
	});
}

const getLimitSeasonWithSeries_id = (series_id, cb) => {
	seasons.where("series_id", "==", series_id).limit(1).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 160"}, null);
	});
}

const getSeasonBeatModeSettings = (season_id, cb) => {
	seasons.doc(season_id).collection("beatModeSettings").doc(season_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query! Line No. 148"}, null);
	});
}

// Functions for Background Settings
const getBackgroundSettingWithUserid = (season_id, user_id, cb) =>{
	seasons.doc(season_id).collection("backgroundSettings").doc(user_id)
	  .get().then(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot.data()});
	  	} else {
	  		return cb(null, {status: 0, data: snapshot});
	  	}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Function get beat templates
const templates = firestoreDb.collection("templates");
const template_episodes = firestoreDb.collection("template_episodes");

const getTemplates = (cb) => {
	templates.get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getEpisodesOfTemplate = (template_id, cb) => {
	template_episodes.where("template_id", "==", template_id)
	.orderBy("sort", "asc")
	.get()
	.then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of Episodes table
const episodes = firestoreDb.collection("episodes");

const getEpisodeWithDoc = (episode_id, cb) => {
	episodes.doc(episode_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getEpisodesWithSeason_id = (season_id, cb) => {
	episodes.where("season_id", "==", season_id).orderBy("sort").orderBy("created_date", "desc")
	  .get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of Scenes table
const scenes = firestoreDb.collection("scenes");

const getSceneWithDoc = (scene_id, cb) => {
	scenes.doc(scene_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getSceneWithEpisode_id = (episode_id, cb) => {
	scenes.where("episode_id", "==", episode_id).orderBy("sort")
	  .get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of word count
const season_word_count = firestoreDb.collection("season_word_count");

const getSeasonWordCountDoc = (season_id, cb) => {
	season_word_count.doc(season_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getSeasonWordCount = (season_id, cb) => {
	season_word_count.where("season_id", "==", season_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const series_word_count = firestoreDb.collection("series_word_count");

const getSeriesWordCountDoc = (series_id, cb) => {
	series_word_count.doc(series_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}		
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getSeriesWordCount = (series_id, cb) => {
	series_word_count.where("series_id", "==", series_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const world_word_count = firestoreDb.collection("worlds_word_count");

const getWorldWordCountDoc = (world_id, cb) => {
	world_word_count.doc(world_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getWorldWordCount = (world_id, cb) => {
	world_word_count.where("world_id", "==", world_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of builder
const builder = firestoreDb.collection("builder");

const getBuilderWithDoc = (builder_id, cb) => {
	builder.doc(builder_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: snapshot});
		}
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuildersWithWorld_id = (category, world_id, cb) => {
	builder.where("category", "==", category).where("world_id", "==", world_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuildersWithSeries_id = (category, series_id, cb) => {
	builder.where("category", "==", category).where("series_id", "==", series_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuildersWithSeason_id = (category, season_id, cb) => {
	builder.where("category", "==", category).where("season_id", "==", season_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuilderRelationships = (builder_id, cb) => {
	builder.doc(builder_id).collection("relationships").get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error)
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuilderRelation = (builder_id, relation_id, cb) => {
	builder.doc(builder_id).collection("relationships").doc(relation_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: snapshot});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getBuilderAppearances = (builder_id, season_id, cb) => {
	builder.doc(builder_id).collection("appearances").doc(season_id).get().then(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: snapshot});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Function to get DNA Questions
const dna_questions = firestoreDb.collection("DNA_Questions");

const getDnaQuestions = (category, cb) => {
	dna_questions.where("category", "==", category).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions for chat notes
const episode_chat = firestoreDb.collection("episode_chat");

const getEpisodeChatsDoc = (episode_id, doc_id, cb) => {
	episodes.doc(episode_id).collection("episode_chat").doc(doc_id)
	  .get().then(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot});
	  	} else {
	  		return cb(null, {status: 0, data: snapshot});
	  	}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getEpisodeChats = (episode_id, cb) => {
	episodes.doc(episode_id).collection("episode_chat").get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getEpisodeReadRecip = (episode_id, user_id, cb) => {
	episodes.doc(episode_id).collection("lastRead").doc(user_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const scene_chat = firestoreDb.collection("scene_chat");

const getSceneChatDoc = (scene_id, doc_id, cb) => {
	scenes.doc(scene_id).collection("scene_chat").doc(doc_id)
	  .get().then(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot});
	  	} else {
	  		return cb(null, {status: 0, data: []});
	  	}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getSceneChat = (scene_id, cb) => {
	scenes.doc(scene_id).collection("scene_chat").get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getSceneReadRecip = (scene_id, user_id, cb) => {
	scenes.doc(scene_id).collection("lastRead").doc(user_id).get().then(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	}).catch(error => {
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions for Background Images
const background_images = firestoreDb.collection("background_images");

const getBackgroundImagesUserid = (user_id, cb) => {
	background_images.where("user_id", "==", user_id).get().then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions for Preen Integration Assistant
const getCardAssistant = (season_id, cb) => {
	seasons.doc(season_id).collection("card_assistant")
	  .doc("assistant1").get().then(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot.data()});
	  	} else {
	  		return cb(null, {status: 0, data: {}});
	  	}
	}).catch(error => {
		console.log(error);
		return cb({status: 0, message: "Error in query!"}, null);
	});
}

const getTrashWithSeason_id = (season_id, cb) => {
	const trash = firestoreDb.collection("TRASH");

	trash.where("season_id", "==", season_id).get()
	.then(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	}).catch(error => {
		console.log(error);
		return cb({ status: 0, message: "Error in query!" }, null);
	})
}

export default {
	// Users
	getUserWithDoc, getUserWithEmail_id, 
	// Worlds
	getWorldsWithUser_id, getWorldWithDoc, 
	// Access
	getAccessWithDoc, getAccessWithUser_id, getAccessWithWorld_id,
	// Series
	getSeriesWithDoc, getSeriesWithWorld_id, getSeriesWithUser_id,
	// Seasons
	getSeasonWithDoc, getSeasonWithWorld_id, getSeasonWithSeries_id, getLimitSeasonWithSeries_id,
	getSeasonBeatModeSettings, 
	// Beat Templates
	getTemplates, getEpisodesOfTemplate,
	// Episodes
	getEpisodeWithDoc, getEpisodesWithSeason_id,
	// Scenes
	getSceneWithDoc, getSceneWithEpisode_id,
	// Word Count
	getSeasonWordCountDoc, getSeasonWordCount, 
	getSeriesWordCountDoc, getSeriesWordCount, 
	getWorldWordCountDoc, getWorldWordCount,
	// Builders
	getBuilderWithDoc, getBuildersWithWorld_id, getBuildersWithSeries_id, getBuildersWithSeason_id,
	getBuilderRelationships, getBuilderRelation, getBuilderAppearances,
	// DNA Questions
	getDnaQuestions,
	// Chats
	getEpisodeChatsDoc, getEpisodeChats, getEpisodeReadRecip, getSceneChatDoc, getSceneChat, getSceneReadRecip, 
	// Background Settings
	getBackgroundSettingWithUserid, 
	// Backgroudn Images
	getBackgroundImagesUserid,
	// Preen Integration Assistant 
	getCardAssistant,
	// Get TRash data
	getTrashWithSeason_id
}