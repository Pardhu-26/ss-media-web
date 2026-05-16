// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuknNcjMrCtCWzEIZ6rtbogyHJnVqfpcA",
  authDomain: "ssmedia-kkd.firebaseapp.com",
  projectId: "ssmedia-kkd",
  storageBucket: "ssmedia-kkd.firebasestorage.app",
  messagingSenderId: "66899150851",
  appId: "1:66899150851:web:3ec8d4638105b479f22636",
  measurementId: "G-X0PJFZKE73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);