import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRjrim47vAqZhPWKtsM06NBHPeqBiUmQE",
  authDomain: "expensezen-64f1c.firebaseapp.com",
  projectId: "expensezen-64f1c",
  storageBucket: "expensezen-64f1c.firebasestorage.app",
  messagingSenderId: "1064186686512",
  appId: "1:1064186686512:web:cff43b22f6b974d86351f5",
  measurementId: "G-FML2761KF6",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Always use initializeAuth for React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If already initialized, just getAuth
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
