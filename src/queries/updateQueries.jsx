import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Users Functions
const updateUser = (user_id, data, cb) => {
	const users = firestoreDb.collection("users");

	users.doc(user_id).update(data).then(() => {
		cb(null, {status: 1, message: "User updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of worlds
const updateWorld = (world_id, data, cb) => {
	const worlds = firestoreDb.collection("worlds");

	worlds.doc(world_id).update(data).then(() => {
		cb(null, {status: 1, message: "World updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of access
const updateAccess = (access_id, data, cb) => {
	const access = firestoreDb.collection("access");

	access.doc(access_id).update(data).then(() => {
		cb(null, {status: 1, message: "Access updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of series
const updateSeries = (series_id, data, cb) => {
	const series = firestoreDb.collection("series");

	series.doc(series_id).update(data).then(() => {
		cb(null, {status: 1, message: "Series updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of seasons
const updateSeason = (season_id, data, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.doc(season_id).update(data).then(() => {
		cb(null, {status: 1, message: "Season updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateBeatSettings = (season_id, data, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.doc(season_id).collection("beatModeSettings")
	  .doc(season_id).set(data, {merge: true}).then(() => {
		cb(null, {status: 1, message: "Beat Mode Settings updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of word count
const updateSeasonWordCount = (season_id, data, cb) => {
	const word_count = firestoreDb.collection("season_word_count");

	word_count.doc(season_id).update(data).then(() => {
		cb(null, {status: 1, message: "Season Word Count updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateSeriesWordCount = (series_id, data, cb) => {
	const series_count = firestoreDb.collection("series_word_count");

	series_count.doc(series_id).update(data).then(() => {
		cb(null, {status: 1, message: "Series Word Count updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateWorldWordCount = (world_id, data, cb) => {
	const world_count = firestoreDb.collection("worlds_word_count");

	world_count.doc(world_id).update(data).then(() => {
		cb(null, {status: 1, message: "World Word Count updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of episodes
const updateEpisode = (episode_id, data, cb) => {
	const episodes = firestoreDb.collection("episodes");

	episodes.doc(episode_id).update(data).then(() => {
		cb(null, {status: 1, message: "Episode updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateEpisodeChat = (episode_id, chat_id, data, cb) => {
	const episodes = firestoreDb.collection("episodes").doc(episode_id);
	const episode_chat = episodes.collection("episode_chat");

	episode_chat.doc(chat_id).update(data).then(() => {
		cb(null, {status: 1, message: "Episode Chat updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateEpisodeChatReadRecip = (episode_id, user_id, data, cb) => {
	const episode_chat = firestoreDb.collection("episodes").doc(episode_id);

	episode_chat.collection("lastRead").doc(user_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "Episode Read Recip updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of scenes
const updateScene = (scene_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes");

	scenes.doc(scene_id).update(data).then(() => {
		cb(null, {status: 1, message: "Scene updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateSceneChat = (scene_id, chat_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_chat = scenes.collection("scene_chat");

	scene_chat.doc(chat_id).update(data).then(() => {
		cb(null, {status: 1, message: "Scene Chat updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateOldSceneChat = (scene_id, chat_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_chat = scenes.collection("episode_chat");

	scene_chat.doc(chat_id).update(data).then(() => {
		cb(null, {status: 1, message: "Scene Chat updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateSceneChatReadRecip = (scene_id, user_id, data, cb) => {
	const scene_chat = firestoreDb.collection("scenes").doc(scene_id);

	scene_chat.collection("lastRead").doc(user_id).update(data).then(() => {
		cb(null, {status: 1, message: "Scene Read Recip updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateSceneComments = (scene_id, comment_id, data, cb) => {
	const scene_chat = firestoreDb.collection("scenes").doc(scene_id);

	scene_chat.collection("comments").doc(comment_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "Scene Comment updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertScenePov = (scene_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_pov = scenes.collection("beat_mode_pov").doc("pov");

	scene_pov.set(data).then(() => {
		cb(null, {status: 1, message: "Scene Pov added"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	})
}

const insertScenePovSetting = (scene_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_pov = scenes.collection("beat_mode_pov").doc("setting");

	scene_pov.set(data).then(() => {
		cb(null, {status: 1, message: "Scene Pov Setting added"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	})
}

const updateBuilder = (builder_id, data, cb) => {
	const builder = firestoreDb.collection("builder");

	builder.doc(builder_id).set(data, {merge: true}).then(() => {
		cb(null, {status: 1, message: "Builder updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateRelationBuilder = (builder_id, relation_id, data, cb) => {
	const builder = firestoreDb.collection("builder").doc(builder_id);

	builder.collection("relationships").doc(relation_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "Builder Relationship updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateBuilderAppearances = (builder_id, season_id, data, cb) => {
	const builder = firestoreDb.collection("builder").doc(builder_id);
	const appearances = builder.collection("appearances");

	appearances.doc(season_id).set(data)
	  .then(() => {
	  	cb(null, {status: 1, message: "Card Appearances updated"});
	}).catch(error => {
	  	cb({status: 0, message: "Error in query!"}, null);
	});
}

// Background Settings
const updateBackgroundSettings = (season_id, user_id, data, cb) => {
	const seasons = firestoreDb.collection("seasons").doc(season_id)
	  .collection("backgroundSettings").doc(user_id).set(data, {merge: true}).then(() => {
	  	cb(null, {status: 1, message: "Background Settings updated"});
	  }).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions for Preen Integration Assistant
const updateCardAssistant = (season_id, data, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.doc(season_id).collection("card_assistant").doc("assistant1")
	  .set(data, {merge: true}).then(() => {
	  	cb(null, {status: 1, message: "Card assistant updated"});
	}).catch(error => {
	  	cb({status: 0, message: "Error in query!"}, null);
	});
}

// Trash
const updateTrash = (trash_id, data, cb) => {
	const trash = firestoreDb.collection("TRASH");

	trash.doc(trash_id).set(data, {merge: true}).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Trash updated"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

export default {
	// Users
	updateUser,
	// Worlds
	updateWorld, 
	// Access
	updateAccess,
	// Series
	updateSeries, 
	// Seasons
	updateSeason, updateBeatSettings,
	// Word Counts
	updateSeasonWordCount, updateSeriesWordCount, updateWorldWordCount,
	// Episodes
	updateEpisode, updateEpisodeChat, updateEpisodeChatReadRecip,
	// Scenes
	updateScene, updateSceneChat, updateOldSceneChat, updateSceneChatReadRecip, 
	updateSceneComments, insertScenePov, insertScenePovSetting,
	// Builder
	updateBuilder, updateRelationBuilder, updateBuilderAppearances,
	// Background settings
	updateBackgroundSettings,
	// Preen Integration Assistant
	updateCardAssistant,
	// Trash
	updateTrash
}