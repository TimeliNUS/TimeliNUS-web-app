import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCwuGzAlwVdmvnxvaumZKCA9OAbph04Qms",
  authDomain: "timelinus-2021.firebaseapp.com",
  projectId: "timelinus-2021",
  storageBucket: "timelinus-2021.appspot.com",
  messagingSenderId: "114066663509",
  appId: "1:114066663509:web:343682da3ba6a668600cdc",
  measurementId: "G-VM2EZ21140",
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
//firebase.auth().useEmulator("http://localhost:9099");
//export const firebaseAuth = firebase;
