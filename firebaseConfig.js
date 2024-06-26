// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore, collection } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBi8S1JJTuEOOkkz0mSOVsTb1JFvaux2os',
  authDomain: 'yapper-app-47865.firebaseapp.com',
  projectId: 'yapper-app-47865',
  storageBucket: 'yapper-app-47865.appspot.com',
  messagingSenderId: '294040603179',
  appId: '1:294040603179:web:c06875b2c2b49b763cf86e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
export const postsRef = collection(db, 'posts');
