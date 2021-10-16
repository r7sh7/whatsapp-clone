import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAZGao8ZMXZx9k91r-bGFKv0DzzlyNsVxk",
  authDomain: "whatsapp-clone-46c88.firebaseapp.com",
  projectId: "whatsapp-clone-46c88",
  storageBucket: "whatsapp-clone-46c88.appspot.com",
  messagingSenderId: "392789807394",
  appId: "1:392789807394:web:9b20a11577a44bb6e6957b",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
