// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// (tùy chọn) chỉ dùng analytics nếu bạn cần
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAhc0bWbTL8zcnnMSoTSbG91uwPg5vCHJ0",
    authDomain: "ltht-5cc0f.firebaseapp.com",
    projectId: "ltht-5cc0f",
    storageBucket: "ltht-5cc0f.appspot.com",
    messagingSenderId: "154166899857",
    appId: "1:154166899857:web:a1def266e62bae17bf7b30",
    measurementId: "G-HD4RGKW21K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Kết nối Firestore
const db = getFirestore(app);

export { db };