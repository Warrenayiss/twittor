import firebase from "firebase/app"
import "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyAEllusRWV_B-vonn7qBBjSjmFJiuydVQU",
  authDomain: "twittor-d51a3.firebaseapp.com",
  projectId: "twittor-d51a3",
  storageBucket: "twittor-d51a3.appspot.com",
  messagingSenderId: "641727059276",
  appId: "1:641727059276:web:991669a01dc9bffc416be9"
}


firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db