// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, enableMultiTabIndexedDbPersistence} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiw5NN0xpI2ucfY44RF1leb3rDNdtQuJs",
  authDomain: "ai-world-routh.firebaseapp.com",
  projectId: "ai-world-routh",
  storageBucket: "ai-world-routh.firebasestorage.app",
  messagingSenderId: "444740980143",
  appId: "1:444740980143:web:70b64fe9b96cc7ec2a335a",
  measurementId: "G-N9KCSFZ2EG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

// Enable offline persistence (Commented to prevent hangs in dev)
/*
enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        console.warn('Firestore persistence failed: Browser not supported');
    }
});
*/
export const analytics = getAnalytics(app);