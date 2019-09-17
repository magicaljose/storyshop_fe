import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Worlds Functions
const removeWorld = (world_id, cb) => {
	const worlds = firestoreDb.collection("worlds");

	worlds.doc(world_id).delete().then(() => {
		cb(null, {status: 1, message: "World Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Access Functions
const removeAccess = (access_id, cb) => {
	const access = firestoreDb.collection("access");

	access.doc(access_id).delete().then(() => {
		cb(null, {status: 1, message: "Access Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Series Functions
const removeSeries = (series_id, cb) => {
	const series = firestoreDb.collection("series");

	series.doc(series_id).delete().then(() => {
		cb(null, {status: 1, message: "Series Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Season Functions
const removeSeason = (season_id, cb) => {
	const seasons = firestoreDb.collection("seasons");

	seasons.doc(season_id).delete().then(() => {
		cb(null, {status: 1, message: "Season Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Epiosde Functions
const removeEpisode = (episode_id, cb) => {
	const episodes = firestoreDb.collection("episodes");

	episodes.doc(episode_id).delete().then(() => {
		cb(null, {status: 1, message: "Episode Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Scene Functions
const removeScene = (scene_id, cb) => {
	const scenes = firestoreDb.collection("scenes");

	scenes.doc(scene_id).delete().then(() => {
		cb(null, {status: 1, message: "Scene Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

// Builder functions
const removeBuilder = (builder_id, cb) => {
	const builder = firestoreDb.collection("builder");

	builder.doc(builder_id).delete().then(() => {
		cb(null, {status: 1, message: "Builder Deleted"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"});
	});
}

const removeBuilderRelation = (builder_id, relation_id, cb) => {
	const builder = firestoreDb.collection("builder");

	builder.doc(builder_id).collection("relationships").doc(relation_id).delete().then(() => {
		cb(null, {status: 1, message: "Builder Relation Deleted"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"});
	});
}

// Trash
const removeTrash = (trash_id, cb) => {
	const trash = firestoreDb.collection("TRASH");

	trash.doc(trash_id).delete().then(() => {
		cb(null, {status: 1, message: "Trash removed"});
	}).catch(error => {
		console.log(error);
		cb({ status: 0, message: "error" }, null);
	})
}

export default {
	// Worlds
	removeWorld,
	// Access
	removeAccess,
	// Series
	removeSeries,
	// Seasons
	removeSeason,
	// Episodes
	removeEpisode,
	// Scenes
	removeScene,
	// Builder
	removeBuilder, removeBuilderRelation,
	// Trash
	removeTrash
}