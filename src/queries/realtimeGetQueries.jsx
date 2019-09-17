import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Functions of worlds table
const getWorldsWithUser_id = (user_id, cb) => {
	const worlds = firestoreDb.collection("worlds")
	  .where("user_id", "==", user_id).onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return worlds;
}

const getWorldWithDoc = (world_id, cb) => {
	const worlds = firestoreDb.collection("worlds")
	  .doc(world_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	});

	return worlds;
}

// Functions of access table
const getAccessWithUser_id = (user_id, cb) => {
	const access = firestoreDb.collection("access")
	  .where("user_id", "==", user_id).onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return access;
}

const getAccessWithWorld_id = (world_id, cb) => {
	const access = firestoreDb.collection("access")
	  .where("world_id", "==", world_id).onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return access;
}

// Functions of series
const getSeriesWithWorld_id = (world_id, cb) => {
	const series = firestoreDb.collection("series")
	  .where("world_id", "==", world_id).onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return series;
}

// Functions of seasons
const getSeasonWithWorld_id = (world_id, cb) => {
	const seasons = firestoreDb.collection("seasons")
	  .where("world_id", "==", world_id).onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return seasons;
}

const getSeasonWithDoc = (season_id, cb) => {
	const seasons = firestoreDb.collection("seasons")
	  .doc(season_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	});

	return seasons;
}

const getSeasonWithSeries_id = (series_id, cb) => {
	const seasons = firestoreDb.collection("seasons")
	  .where("series_id", "==", series_id)
	  .onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return seasons;
}

// Functions of background settings
const getBackgroundSettingWithUserid = (season_id, user_id, cb) =>{
	const seasons = firestoreDb.collection("seasons")
	  .doc(season_id).collection("backgroundSettings").doc(user_id)
	  .onSnapshot(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot.data()});
	  	} else {
	  		return cb(null, {status: 0, data: snapshot});
	  	}
	});

	return seasons;
}

// Functions of episodes
const getEpisodeWithDoc = (episode_id, cb) => {
	const episodes = firestoreDb.collection("episodes").doc(episode_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	});

	return episodes;
}

const getEpisodesWithSeason_id = (season_id, cb) => {
	const episodes = firestoreDb.collection("episodes")
	.where("season_id", "==", season_id)
	.onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return episodes;
}

const getEpisodeChats = (episode_id, cb) => {
	const episodes = firestoreDb.collection("episodes")
	  .doc(episode_id).collection("episode_chat").orderBy("timestamp").onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return episodes;
}

const getEpisodeReadRecip = (episode_id, user_id, cb) => {
	const episodes = firestoreDb.collection("episodes")
	  .doc(episode_id).collection("lastRead").doc(user_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	});

	return episodes;
}

// Functions of Scenes
const getSceneWithDoc = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	});

	return scenes;
}

const getSceneWithEpisode_id = (episode_id, cb) => {
	const scenes = firestoreDb.collection("scenes")
	.where("episode_id", "==", episode_id)
	.onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return scenes;
}

const getSceneChat = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes")
	  .doc(scene_id).collection("scene_chat").orderBy("timestamp").onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return scenes;
}

const getOldSceneChat = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes")
	  .doc(scene_id).collection("episode_chat").orderBy("timestamp").onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return scenes;
}

const getSceneReadRecip = (scene_id, user_id, cb) => {
	const scenes = firestoreDb.collection("scenes")
	  .doc(scene_id).collection("lastRead").doc(user_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, {status: 1, data: snapshot.data()});
		} else {
			cb(null, {status: 0, data: []});
		}
	});

	return scenes;
}

const getSceneComments = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id)
	.collection("comments")
	.orderBy("offset_position", "asc").orderBy("created_at", "asc")
	.onSnapshot(snapshot => {
		cb(null, {status: 1, data: snapshot});
	});

	return scenes;
}

const getSceneCommentChats = (scene_id, comment_id, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id)
	.collection("comments").doc(comment_id)
	.collection("comment_chats")
	.orderBy("timestamp", "asc")
	.onSnapshot(snapshot => {
		cb(null, {status: 1, data: snapshot});
	});

	return scenes;
}

const getScenePov = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id)
	.collection("beat_mode_pov").doc("pov")
	.onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, { status: 1, data: snapshot.data() });
		} else {
			cb(null, { status: 0, data: snapshot.data() });
		}
	});

	return scenes;
}

const getScenePovSetting = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id)
	.collection("beat_mode_pov").doc("setting")
	.onSnapshot(snapshot => {
		if (snapshot.exists) {
			cb(null, { status: 1, data: snapshot.data() });
		} else {
			cb(null, { status: 0, data: snapshot.data() });
		}
	});

	return scenes;
}

// Functions of word count
const getSeasonWordCountDoc = (season_id, cb) => {
	const season_word_count = firestoreDb.collection("season_word_count")
	  .doc(season_id).onSnapshot(snapshot => {
		if (snapshot.exists) {
			return cb(null, {status: 1, data: snapshot.data()});
		} else {
			return cb(null, {status: 0, data: []});
		}
	});

	return season_word_count;
}

// Builders
const getBuildersWithWorld_id = (category, world_id, cb) => {
	const builder = firestoreDb.collection("builder")
	.where("category", "==", category)
	.where("world_id", "==", world_id)
	.orderBy("name", "asc")
	.onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return builder;
}

const getBuildersWithSeries_id = (category, series_id, cb) => {
	const builder = firestoreDb.collection("builder")
	.where("category", "==", category)
	.where("series_id", "==", series_id)
	.orderBy("name", "asc")
	.onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return builder;
}

const getBuildersWithSeason_id = (category, season_id, cb) => {
	const builder = firestoreDb.collection("builder")
	.where("category", "==", category)
	.where("season_id", "==", season_id)
	.orderBy("name", "asc")
	.onSnapshot(snapshot => {
		return cb(null, {status: 1, data: snapshot});
	});

	return builder;
}

// Functions for Preen Integration Assistant
const getCardAssistant = (season_id, cb) => {
	const seasons = firestoreDb.collection("seasons").doc(season_id).collection("card_assistant")
	  .doc("assistant1").onSnapshot(snapshot => {
	  	if (snapshot.exists) {
	  		return cb(null, {status: 1, data: snapshot.data()});
	  	} else {
	  		return cb(null, {status: 0, data: {}});
	  	}
	});

	return seasons;
}

export default {
	// Worlds
	getWorldsWithUser_id, getWorldWithDoc,
	// Access
	getAccessWithUser_id, getAccessWithWorld_id,
	// Series
	getSeriesWithWorld_id,
	// Seasons
	getSeasonWithWorld_id, getSeasonWithDoc, getSeasonWithSeries_id,
	// Episodes
	getEpisodeWithDoc, getEpisodesWithSeason_id, getEpisodeChats, getEpisodeReadRecip,
	// Scenes
	getSceneWithDoc, getSceneWithEpisode_id, getSceneChat, getOldSceneChat, getSceneReadRecip,
	getSceneComments, getSceneCommentChats, getScenePov, getScenePovSetting,
	// Word Count
	getSeasonWordCountDoc,
	// Background Settings
	getBackgroundSettingWithUserid,
	// Builders
	getBuildersWithWorld_id, getBuildersWithSeries_id, getBuildersWithSeason_id,
	// Preen Integration Assistant
	getCardAssistant
}