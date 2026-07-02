/* 青山 Peak Tea — Firebase 初始化（Firestore 揪團訂單同步用） */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuJivEh06ahae7vicgJLEpWZNaIcBr0JI",
  authDomain: "drinks-order-43f90.firebaseapp.com",
  projectId: "drinks-order-43f90",
  storageBucket: "drinks-order-43f90.firebasestorage.app",
  messagingSenderId: "748518969039",
  appId: "1:748518969039:web:246244b406cdcc7048f1ba",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
