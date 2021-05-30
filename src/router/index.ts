import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Secret from "../views/Secret.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Register",
    component: Register,
  },
  {
    path: "/secret",
    name: "Secret",
    component: Secret,
    meta: { requiresAuth: true },
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
