import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_87-C-Hgehd5OXwGt-zS5O_ZiZpqpclM",
  authDomain: "rpll-portal.firebaseapp.com",
  projectId: "rpll-portal",
  storageBucket: "rpll-portal.appspot.com", 
  messagingSenderId: "491181655301",
  appId: "1:491181655301:web:8ef7f93640ef0aff13e36c",
  measurementId: "G-60JJ7GPD5Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 


