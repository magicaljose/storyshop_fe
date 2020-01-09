import firebase from 'firebase';
import firestoreDb from 'config_db/firestoreDemoDB.jsx';

import updateQueries from './updateQueries';

// Update Episodes orders after perticular episode_id
const updateEpisodesOrder = (season_id, startAfter_episodeId, startFrom_sortNo) => {
	firestoreDb.collection("episodes")
	.where("season_id", "==", season_id)
	.get().then(snapshot => {
		let startDoing = false;
		let index = startFrom_sortNo;

		snapshot.docs
		.sort((snap1, snap2) => (snap1.data().sort || 0) - (snap2.data().sort || 0))
		.map(snap => {
			if (snap.id === startAfter_episodeId) {
				startDoing = true;
			}

			if (startDoing) {
				startFrom_sortNo ++;
				let sort = startFrom_sortNo;

				updateQueries.updateEpisode(snap.id, {sort: sort}, () => {});
			}
		});
	});
}

// Update Scenes orders after perticular scene_id
const updateScenesOrder = (episode_id, startAfter_sceneId, startFrom_sortNo) => {
	firestoreDb.collection("scenes")
	.where("episode_id", "==", episode_id)
	.get().then(snapshot => {
		let startDoing = false;
		let index = startFrom_sortNo;

		snapshot.docs
		.sort((snap1, snap2) => (snap1.data().sort || 0) - (snap2.data().sort || 0))
		.map(snap => {
			if (snap.id === startAfter_sceneId) {
				startDoing = true;
			}

			if (startDoing) {
				startFrom_sortNo ++;
				let sort = startFrom_sortNo;

				updateQueries.updateScene(snap.id, {sort: sort}, () => {});
			}
		});
	});
}

// Update builder appearances
/*const updateBuilderAppearances = (builder_id, season_id, series_id, world_id, appear_texts) => {
	let appearances = [];
	let data = {};

	getEpisodesWithSeason_id(season_id, (error, results) => {
		if (results) {
			results.forEach(snap => {
				const episode_id = snap.id;

				data[episode_id] = {scenes: {}};

				getSceneWithEpisode_id(episode_id, (error, sc_results) => {
					if (sc_results) {

					}
				})
			})
		}
	})

	appear_texts.map(text => {

	});
}*/

export default {
	// Episodes order
	updateEpisodesOrder,
	// Scenes order
	updateScenesOrder
}