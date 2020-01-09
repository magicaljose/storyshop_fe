import firestoreDb from 'config_db/firestoreDemoDB.jsx';

// Functions of word count
const updateSeasonWordCount = (season_id, data, cb) => {
	const word_count = firestoreDb.collection("season_word_count");

	word_count.doc(season_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "Season Word Count updated"});
	}).catch(error => {
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateSeriesWordCount = (series_id, data, cb) => {
	const series_count = firestoreDb.collection("series_word_count");

	series_count.doc(series_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "Series Word Count updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

const updateWorldWordCount = (world_id, data, cb) => {
	const world_count = firestoreDb.collection("worlds_word_count");

	world_count.doc(world_id).set(data, { merge: true }).then(() => {
		cb(null, {status: 1, message: "World Word Count updated"});
	}).catch(error => {
		console.log(error);
		cb({status: 0, message: "Error in query!"}, null);
	});
}

export default {
	// Word Count
	updateSeasonWordCount, updateWorldWordCount, updateSeriesWordCount
}