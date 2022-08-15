import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
  
const firebaseConfig = {
    apiKey: "AIzaSyBbOZqg19S67nkfzis-7SXGvaQzN_GPGks",
    authDomain: "apps-2ee38.firebaseapp.com",
    databaseURL: "https://apps-2ee38.firebaseio.com",
    projectId: "apps-2ee38",
    storageBucket: "apps-2ee38.appspot.com",
    messagingSenderId: "545216665155",
    appId: "1:545216665155:web:5f5d97112ebe366c4566f6"
};
  
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const isProd = false;
