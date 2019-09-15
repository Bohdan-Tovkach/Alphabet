import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDzVf230Np8uuGr1k_4oB64okRtuU5KRD0",
  authDomain: "alphabet-800d9.firebaseapp.com",
  databaseURL: "https://alphabet-800d9.firebaseio.com",
  projectId: "alphabet-800d9",
  storageBucket: "alphabet-800d9.appspot.com",
  messagingSenderId: "400720402808",
  appId: "1:400720402808:web:8fa4792fbadb1878"
}

  export const firebaseApp = firebase.initializeApp(config) 