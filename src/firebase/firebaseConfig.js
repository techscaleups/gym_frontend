import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChb4zsHiJ9iGuxmYHlWMM6U2hemNvxB44",
  authDomain: "otpsms-bbb25.firebaseapp.com",
  projectId: "otpsms-bbb25",
  storageBucket: "otpsms-bbb25.appspot.com",
  messagingSenderId: "828378358902",
  appId: "1:828378358902:web:f11ac3db3da96c03abab57",
  measurementId: "G-935540D9PZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
