import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAFz7ysn36dt18Vlxq39TySjaY1NfaCsjw",
    authDomain: "fire-demo-7dc54.firebaseapp.com",
    projectId: "fire-demo-7dc54",
    storageBucket: "fire-demo-7dc54.firebasestorage.app",
    messagingSenderId: "434719333290",
    appId: "1:434719333290:web:10396896cf9782a525a9d3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };