// import { firebaseApp } from "@/firebaseConfig";
import { db } from "@/main";
import axios from "axios";
import firebase from "firebase";

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
      console.log("google sign in");
      console.log(user);
      db.collection("user").doc(user!.uid).set({
        email: user!.email,
        name: user!.displayName,
        todo: [],
        project: [],
        created_at: Date.now(),
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

export const findCommonTime = async (
  link: string,
  startDateString: string,
  endDateString: string,
  id: string,
  user: string
) => {
  const obj = {
    link: link,
    startDate: startDateString,
    endDate: endDateString,
    id: id,
    user: user,
  };
  await axios.post(
    "https://asia-east2-timelinus-2021.cloudfunctions.net/findNusModsCommon",
    obj
  );
};

export const findGoogleCommonTime = async (
  // googleToken: string,
  startDateString: string,
  endDateString: string,
  id: string,
  user: string
) => {
  const obj = {
    timeMin: startDateString,
    timeMax: endDateString,
    id: id,
    user: user,
  };
  await axios.post(
    "https://asia-east2-timelinus-2021.cloudfunctions.net/findCommon",
    obj
    // {
    //   headers: {
    //     "google-token": googleToken,
    //   },
    // }
  );
};

export const deleteProjectCloudFunctions = async (
  // googleToken: string,
  projectId: string,
  userId: string[]
) => {
  const obj = {
    projectId,
    userId,
  };
  await axios.post(
    "https://asia-east2-timelinus-2021.cloudfunctions.net/deleteProject",
    obj
  );
};

// https://zoom.us/oauth/authorize?response_type=code&client_id=5NM6HEpT4CWNO0zQ9s0fg&redirect_uri=http://localhost:5001/timelinus-2021/asia-east2/zoomAuth&state={"client":"web", "id": "j1JiHkaJkLNO2o19VtTKl76qhgi1"}

export const createZoomMeeting = async (
  startDateString: string,
  durationInMins: number,
  id: string,
  user: string,
  topic: string
) => {
  console.log(durationInMins);
  const obj = {
    topic: topic,
    startTime: startDateString,
    timeLength: durationInMins,
    id: id,
    user: user,
  };
  const res = await axios.post(
    "https://asia-east2-timelinus-2021.cloudfunctions.net/createZoomMeeting",
    obj
  );
  return res;
};

export const isLinkedToZoom = async (user: string): Promise<boolean> => {
  const doc = await firebase.firestore().collection("user").doc(user).get();
  return doc.get("zoomRefreshToken") != null;
};
