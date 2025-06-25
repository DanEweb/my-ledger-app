// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgx-DR6tOrWsnFydcbT4nSnvFAc1iVhs0",
  authDomain: "household-account-book-485a3.firebaseapp.com",
  projectId: "household-account-book-485a3",
  storageBucket: "household-account-book-485a3.firebasestorage.app",
  messagingSenderId: "316389723557",
  appId: "1:316389723557:web:a0b486316f3814aadb6c4c",
  measurementId: "G-BF0Q2HV8KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };