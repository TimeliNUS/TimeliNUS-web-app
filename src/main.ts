import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import vuetify from "./plugins/vuetify";
import { SchedulePlugin } from "@syncfusion/ej2-vue-schedule";
import GAuth from "vue-google-oauth2";

const gauthOption = {
  clientId: "114066663509-j11htpbtn3u1p7dulr22bpjldopg3d11.apps.googleusercontent.com",
  scope: "profile email https://www.googleapis.com/auth/calendar",
  prompt: "consent",
};

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyCwuGzAlwVdmvnxvaumZKCA9OAbph04Qms",
  authDomain: "timelinus-2021.firebaseapp.com",
  projectId: "timelinus-2021",
  storageBucket: "timelinus-2021.appspot.com",
  messagingSenderId: "114066663509",
  appId: "1:114066663509:web:343682da3ba6a668600cdc",
  measurementId: "G-VM2EZ21140",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

let app;
Vue.use(SchedulePlugin);
Vue.use(GAuth, gauthOption);
firebase.auth().onAuthStateChanged((user) => {
  console.log(user);
  store.dispatch("setUser", user);

  // if (!app) {
  app = new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
  // }
});
