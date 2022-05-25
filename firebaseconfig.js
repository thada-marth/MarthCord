// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJ6LHAmxdU1Yv_HkPm-FQXTylx6zOYHpU",
  authDomain: "chat-app-13329.firebaseapp.com",
  projectId: "chat-app-13329",
  storageBucket: "chat-app-13329.appspot.com",
  messagingSenderId: "618640380773",
  appId: "1:618640380773:web:b123477e92e7eca3c5478c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth , db }