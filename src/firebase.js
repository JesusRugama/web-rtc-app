import firebase from "firebase/app";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBMmevKuu0uJqhNA4lFSP2j5Ur01LLqxZA",
  authDomain: "webrtc-4793f.firebaseapp.com",
  projectId: "webrtc-4793f",
  storageBucket: "webrtc-4793f.appspot.com",
  messagingSenderId: "527102153863",
  appId: "1:527102153863:web:5e25710c5e3d30296f1422",
  measurementId: "G-H0HV7KY1YV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const firestore = firebase.firestore();