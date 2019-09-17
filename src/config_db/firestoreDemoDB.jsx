import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDLO_YT_l53cUnR6Dw0WqDj9UZCLoU_dkQ",
	authDomain: "storyshop-reactjs-db.firebaseapp.com",
	databaseURL: "https://storyshop-reactjs-db.firebaseio.com",
	projectId: "storyshop-reactjs-db",
	storageBucket: "storyshop-reactjs-db.appspot.com",
	messagingSenderId: "988906568590",
	appId: "1:988906568590:web:a574a38a3680eb0d"
};

const fire = firebase.initializeApp(config, "firestoreDB");

const firestoreDb = fire.firestore();

export default firestoreDb;
