// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence} from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey:process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATBASEURL,
  projectId: process.env.PROJECTID,
  storageBucket:process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGESENDERID,
  appId:process.env.APPID,
  measurementId:process.env.MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app)
