// import { firebaseApp } from "@/firebaseConfig";
import { db } from "@/main";
import firebase from "firebase";
import axios from "axios";


// export const register = async (
//   email: string,
//   password: string
// ): Promise<firebase.User | null> => {
//   let user: firebase.User | null = null;
//   firebaseApp.auth().useEmulator("http://localhost:9099");
//   await firebaseApp
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       user = userCredential.user;
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });
//   return user;
// };

// export const signIn = async (
//   email: string,
//   password: string
// ): Promise<firebase.User | null> => {
//   let user: firebase.User | null = null;
//   firebaseApp.auth().useEmulator("http://localhost:9099");
//   await firebaseApp
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       user = userCredential.user;
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });
//   return user;
// };

export const googleSignIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  let user;
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential: firebase.auth.OAuthCredential = result.credential!;
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential.accessToken;
      // The signed-in user info.
      user = result.user;
      console.log('google sign in')
      console.log(user);
      db.collection("user")
          .doc(user!.uid)
          .set({
            email: user!.email,
            name: user!.displayName,
            todo: [],
            project: [],
            created_at: Date.now(),
          })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

export const findCommonTime = (link: string, startDateString: string, endDateString: string, 
  id: string, user: string) => {
  axios({
    url: "https://asia-east2-timelinus-2021.cloudfunctions.net/findNusModsCommon",
    data: {
      link: link,
      startDate: startDateString,
      endDate: endDateString,
      id: id,
      user: user,
    },
  });
} 
