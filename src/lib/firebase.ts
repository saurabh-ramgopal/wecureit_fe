// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVMeW90XIanJtvdVzByOPUH90r8VllPLU",
  authDomain: "fir-authenticator-2e23b.firebaseapp.com",
  projectId: "fir-authenticator-2e23b",
  storageBucket: "fir-authenticator-2e23b.firebasestorage.app",
  messagingSenderId: "302388488314",
  appId: "1:302388488314:web:90b18cbf0e80abdedd33c3",
  measurementId: "G-FSN1YXYQN5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig): getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export {auth};