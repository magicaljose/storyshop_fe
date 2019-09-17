import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Function of worlds
const getWorldAutoDoc = (cb) => {
	const worlds = firestoreDb.collection("worlds");

	worlds.add({}).then(doc => {
		cb(null, {status: 1, key: doc.id});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertWorld = (data, cb) => {
	const worlds = firestoreDb.collection("worlds");

	worlds.add(data).then((doc) => {
		cb(null, {status: 1, key: doc.id, message: "World inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

//Functions of access
const insertAccess = (data, cb) => {
	const access = firestoreDb.collection("access");

	access.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Access inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of series
const getSeriesAutoDoc = (cb) => {
	const series = firestoreDb.collection("series");

	series.add({}).then(doc => {
		cb(null, {status: 1, key: doc.id});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertSeries = (data, cb) => {
	const series = firestoreDb.collection("series");

	series.add(data).then((doc) => {
		cb(null, {status: 1, key: doc.id, message: "Series inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of seasons
const getSeasonAutoDoc = (cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.add({}).then(doc => {
		cb(null, {status: 1, key: doc.id});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertSeason = (data, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.add(data).then((doc) => {
		cb(null, {status: 1, key: doc.id, message: "Season inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of episodes
const getEpisodeAutoDoc = (cb) => {
	const episodes = firestoreDb.collection("episodes");

	episodes.add({}).then(doc => {
		cb(null, {status: 1, key: doc.id});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertEpisode = (data, cb) => {
	const episodes = firestoreDb.collection("episodes");

	episodes.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Epiosde inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertEpisodeChat = (episode_id, data, cb) => {
	const episodes = firestoreDb.collection("episodes").doc(episode_id);
	const episode_chat = episodes.collection("episode_chat");

	episode_chat.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Episode chat inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions of scenes
const insertScene = (data, cb) => {
	const scenes = firestoreDb.collection("scenes");

	scenes.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Scene inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertSceneChat = (scene_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_chat = scenes.collection("scene_chat");

	scene_chat.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Episode chat inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertSceneComment = (scene_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_comment = scenes.collection("comments");

	scene_comment.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Comment Inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertSceneCommentChats = (scene_id, comment_id, data, cb) => {
	const scenes = firestoreDb.collection("scenes").doc(scene_id);
	const scene_comment = scenes.collection("comments");

	scene_comment.doc(comment_id).collection("comment_chats").add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Comment Chat Inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Builder Functions
const getBuilderAutoDoc = (cb) => {
	const builder = firestoreDb.collection("builder");

	builder.add({}).then(doc => {
		cb(null, {status: 1, key: doc.id});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertBuilder = (data, cb) => {
	const builder = firestoreDb.collection("builder");

	builder.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Builder inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertRelationBuilder = (builder_id, data, cb) => {
	const builder = firestoreDb.collection("builder").doc(builder_id);

	builder.collection("relationships").add(data).then(doc => {
		cb(null, {status: 2, key: doc.id, message: "Builder Relation inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertBackgroundImage = (data, cb) => {
	const background_images = firestoreDb.collection("background_images");
	
	background_images.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Background images inserted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

// Functions for Preen Integration Assistant
const insertCardAssistant = (season_id, data, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.doc(season_id).collection("card_assistant").doc("assistant1")
	  .set(data, {merge: true}).then(() => {
	  	cb(null, {status: 1, message: "Card Assistant inserted"});
	}).catch(error => {
	  	cb({status: 0, message: "Error in query!"}, null);
	});
}

const insertTrash = (data, cb) => {
	const trash = firestoreDb.collection("TRASH");

	trash.add(data).then(doc => {
		cb(null, {status: 1, key: doc.id, message: "Trash created for file"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

export default {
	// Worlds
	getWorldAutoDoc, insertWorld,
	// access
	insertAccess,
	// Series
	getSeriesAutoDoc, insertSeries,
	// Seasons
	getSeasonAutoDoc, insertSeason,
	// Episodes
	getEpisodeAutoDoc, insertEpisode, insertEpisodeChat,
	// Scenes
	insertScene, insertSceneChat, insertSceneComment, insertSceneCommentChats,
	// Builder
	getBuilderAutoDoc, insertBuilder, insertRelationBuilder,
	// Background Images
	insertBackgroundImage,
	// Preen Integration Assistant
	insertCardAssistant,
	// Add file in TRASH
	insertTrash
}