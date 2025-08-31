// Fix: Change to Firebase v8 style imports for compatibility.
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../firebaseConfig";

// Initialize Firebase
// Fix: Use v8 initialization syntax. The check prevents re-initialization.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


// Initialize Realtime Database and get a reference to the service
// Fix: Use v8 database access syntax.
export const db = firebase.database();
