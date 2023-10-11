import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4crNanbtpqXRIsCehcz2CLadOjM9QV80",
    authDomain: "xwitter-9d7ce.firebaseapp.com",
    projectId: "xwitter-9d7ce",
    storageBucket: "xwitter-9d7ce.appspot.com",
    messagingSenderId: "747899509483",
    appId: "1:747899509483:web:fa7f0f103389b9fc95bcae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);
