import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 本番環境モード
const firebaseConfig = {
    apiKey: "AIzaSyB3btShK3336kp3bFzg3FnpPeFe8wtGK34",
    authDomain: "react-firebase-192b5.firebaseapp.com",
    databaseURL: "https://react-firebase-192b5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-firebase-192b5",
    storageBucket: "react-firebase-192b5.appspot.com",
    messagingSenderId: "308266685010",
    appId: "1:308266685010:web:76d2060e67c79f1e37858b"
  };

// Firebase
const app = initializeApp(firebaseConfig);

// Auth/Firestore/Storageをappで使用する。
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)