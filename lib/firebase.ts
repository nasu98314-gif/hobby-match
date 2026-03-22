import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLsbM3EX8ZXD3hGO5q0EEqr-rsrnonIdQ",
  authDomain: "hobby-match-b69ab.firebaseapp.com",
  projectId: "hobby-match-b69ab",
  storageBucket: "hobby-match-b69ab.firebasestorage.app",
  messagingSenderId: "524417522794",
  appId: "1:524417522794:web:9a73769abddb432ef63e13",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);