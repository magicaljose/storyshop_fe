import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  	apiKey: "AIzaSyDtiHrzRj6EpTmg2dx4_O4K1TpKmofJYXs",
    authDomain: "storyshop-production.firebaseapp.com",
    databaseURL: "https://storyshop-production.firebaseio.com",
    projectId: "storyshop-production",
    storageBucket: "storyshop-production.appspot.com",
    messagingSenderId: "818298195959",
    appId: "1:818298195959:web:42c203f0f260dd2b"
};

const fire = firebase.initializeApp(config, "oldDB");

const db = fire.database();

export default db;