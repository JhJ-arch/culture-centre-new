// Fix: Use a namespace import to handle potential module resolution issues with "firebase/app".
import * as firebaseApp from "firebase/app";
import { getDatabase } from "firebase/database";
import firebaseConfig from "../firebaseConfig";

// Initialize Firebase
const app = !firebaseApp.getApps().length ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();


// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
