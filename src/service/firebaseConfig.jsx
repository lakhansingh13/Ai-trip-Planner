// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, enableMultiTabIndexedDbPersistence} from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl_2aouDt7FtzvTMckQX5msom_M70MzNw",
  authDomain: "ai-trip-planner-bf6e5.firebaseapp.com",
  projectId: "ai-trip-planner-bf6e5",
  storageBucket: "ai-trip-planner-bf6e5.firebasestorage.app",
  messagingSenderId: "734499301844",
  appId: "1:734499301844:web:f2fbd75eed117614404e41",
  measurementId: "G-PZLGL30MN8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

// Enable offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        console.warn('Firestore persistence failed: Browser not supported');
    }
});
//const analytics = getAnalytics(app);