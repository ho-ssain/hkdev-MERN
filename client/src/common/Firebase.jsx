/* eslint-disable no-unused-vars */

import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDprss6z_PX_K862IPIZUXzSTyYXxvigkI",
  authDomain: "hkdev-ea2eb.firebaseapp.com",
  projectId: "hkdev-ea2eb",
  storageBucket: "hkdev-ea2eb.appspot.com",
  messagingSenderId: "315194151869",
  appId: "1:315194151869:web:2f8cbd0716e8cc8d64b8d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((res) => {
      user = res.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
