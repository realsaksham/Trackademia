import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyD5CIo8ZT1VFKAO3vBWNNZWeDG71q8S6g4",

  authDomain: "trackademia-13586.firebaseapp.com",

  projectId: "trackademia-13586",

  storageBucket: "trackademia-13586.firebasestorage.app",

  messagingSenderId: "84354763879",

  appId: "1:84354763879:web:f07364ca51df39f70258c2",

  measurementId: "G-97J769EFT0"

}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app); // Initialize Firestore

export { auth, googleProvider, githubProvider , db };
