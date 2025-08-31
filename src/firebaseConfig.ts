// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZfD7Km0ZAw7uoJf_v84MlxKeafRBlizc",
  authDomain: "culturecentre-3cbf2.firebaseapp.com",
  projectId: "culturecentre-3cbf2",
  storageBucket: "culturecentre-3cbf2.firebasestorage.app",
  messagingSenderId: "1013628629820",
  appId: "1:1013628629820:web:c1058c2015192acd2ea439",
  measurementId: "G-MCECBR5RRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig; //
