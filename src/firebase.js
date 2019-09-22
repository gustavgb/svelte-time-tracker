import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBRwiqi0EXaHIhnfOivS00XKdLIWE0HRKY",
  authDomain: "svelte-time-tracker.firebaseapp.com",
  databaseURL: "https://svelte-time-tracker.firebaseio.com",
  projectId: "svelte-time-tracker",
  storageBucket: "",
  messagingSenderId: "54771701063",
  appId: "1:54771701063:web:c5ba342977081df0462862"
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const db = firebase.firestore()
