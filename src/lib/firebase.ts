
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAzb-KWWBbKmds_-OhtI92coeGp5iRHFY8",
  authDomain: "dairyfarmmonitor.firebaseapp.com",
  projectId: "dairyfarmmonitor",
  storageBucket: "dairyfarmmonitor.firebasestorage.app",
  messagingSenderId: "197118535905",
  appId: "1:197118535905:web:5a032ba2609aea87086fa0",
  measurementId: "G-HE1JB5CWJ8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Initialize with some data for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  // Optional: Connect to Firebase emulator if you're using it
  // connectFirestoreEmulator(db, 'localhost', 8080);
}
