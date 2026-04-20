// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAC06evWHqwbp33C4hgij-6JquzKHMe9N0",
  authDomain: "zinglee-3af9a.firebaseapp.com",
  projectId: "zinglee-3af9a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();