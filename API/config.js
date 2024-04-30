// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, initializeAuth, getReactNativePersistence} from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCBg3yJ4bQ2Uvzi_3Ac7wCm95UND3VIas8",
  authDomain: "mynet-4fb72.firebaseapp.com",
  databaseURL: "https://mynet-4fb72.firebaseio.com",
  projectId: "mynet-4fb72",
  storageBucket: "mynet-4fb72.appspot.com",
  messagingSenderId: "595732435481",
  appId: "1:595732435481:web:15fefe948130e89b461088",
  measurementId: "G-1ZG1C31ZKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app)
