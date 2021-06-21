import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import vuetify from "./plugins/vuetify";

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

export const db = firebase.firestore()

let app;
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