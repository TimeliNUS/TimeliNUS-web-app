import { firebaseApp } from "@/firebaseConfig";
import firebase from "firebase";

export const register = async (
  email: string,
  password: string
): Promise<firebase.User | null> => {
  let user: firebase.User | null = null;
  firebaseApp.auth().useEmulator("http://localhost:9099");
  await firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  return user;
};

export const signIn = async (
  email: string,
  password: string
): Promise<firebase.User | null> => {
  let user: firebase.User | null = null;
  firebaseApp.auth().useEmulator("http://localhost:9099");
  await firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  return user;
};

export const googleSignIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebaseApp
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential: firebase.auth.OAuthCredential = result.credential!;

      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};
