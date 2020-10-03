import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcYHj5FN67lMBsRNJS3hit8pkOptXzkb0",
  authDomain: "movies-9d4f7.firebaseapp.com",
  databaseURL: "https://movies-9d4f7.firebaseio.com",
  projectId: "movies-9d4f7",
  storageBucket: "movies-9d4f7.appspot.com",
  messagingSenderId: "550611858054",
  appId: "1:550611858054:web:49341510adb0c52d681707",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Referencia a la Base datos
const db = firebase.firestore();

//Para autentificarme con google
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);


export { db, googleAuthProvider, firebase };
