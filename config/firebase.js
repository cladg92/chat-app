import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJHjsORopJVjEyJMuq7pvo5CkRo8xZ9ag",
  authDomain: "chat-app-c17b0.firebaseapp.com",
  projectId: "chat-app-c17b0",
  storageBucket: "chat-app-c17b0.appspot.com",
  messagingSenderId: "1048447866445",
  appId: "1:1048447866445:web:ded2142d20612edae62e04",
  measurementId: "G-WCQ4T06P63",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service (db)
export const db = getFirestore(app);
