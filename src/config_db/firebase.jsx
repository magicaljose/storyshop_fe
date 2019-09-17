import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

const config = {
	apiKey: "AIzaSyDLO_YT_l53cUnR6Dw0WqDj9UZCLoU_dkQ",
	authDomain: "storyshop-reactjs-db.firebaseapp.com",
	databaseURL: "https://storyshop-reactjs-db.firebaseio.com",
	projectId: "storyshop-reactjs-db",
	storageBucket: "storyshop-reactjs-db.appspot.com",
	messagingSenderId: "988906568590",
	appId: "1:988906568590:web:a574a38a3680eb0d"
};

const fire = firebase.initializeApp(config);

/*var config = {
  apiKey: "AIzaSyCyFSnZRU0xDi1zEleu8RxRs7PNIih4f54",
  authDomain: "fir-demo-e6389.firebaseapp.com",
  databaseURL: "https://fir-demo-e6389.firebaseio.com",
  projectId: "fir-demo-e6389",
  storageBucket: "fir-demo-e6389.appspot.com",
  messagingSenderId: "486554836391"
};

var fire = firebase.initializeApp(config);*/

const db = fire.database();
const auth = fire.auth();
const dbStorage = fire.storage();

export {
  db, auth, dbStorage
};
