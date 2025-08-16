// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ1ToFxOfA-1d5fnD9lhtHxOJQ8SoLLr4",
  authDomain: "community-notice-board-15e9d.firebaseapp.com",
  projectId: "community-notice-board-15e9d",
  storageBucket: "community-notice-board-15e9d.firebasestorage.app",
  messagingSenderId: "1044974892715",
  appId: "1:1044974892715:web:ebc8a2ac25169e5d2669ee",
  measurementId: "G-6JDJZ34WCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);