// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDeaX0ph9ON0RigX48F1-Z2h3tJAIL6r1I",
    authDomain: "placement-ai-auth.firebaseapp.com",
    projectId: "placement-ai-auth",
    storageBucket: "placement-ai-auth.firebasestorage.app",
    messagingSenderId: "220091111902",
    appId: "1:220091111902:web:6677590495997e08c3254f",
    measurementId: "G-E230VJP3FS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);