import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Secret from "../views/Secret.vue";
import Meeting from "../views/Meeting.vue";
import Project from "../views/Project.vue";
import Profile from "../views/Profile.vue";
import BlockEvent from "../views/block-event.vue";

import Login from "../views/Login.vue";
import Todo from "../views/Todo.vue";
import Register from "../views/Register.vue";
import firebase from "firebase";
import store from "../store/index";

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
  {
    path: "/todo",
    name: "Todo",
    component: Todo,
    meta: { requiresAuth: true },
  },
  {
    path: "/project",
    name: "Project",
    component: Project,
    meta: { requiresAuth: true },
  },
  {
    path: "/meeting",
    name: "Meeting",
    component: Meeting,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/block-event",
    name: "Block-event",
    component: BlockEvent,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  store.dispatch("getTasks");
  store.dispatch("getProjects");
  store.dispatch("getProjectInvitations");
  store.dispatch("getMeetingInvitations");
  store.dispatch("getMeetingPendings");
  store.dispatch("getMeetingConfirmations");
  store.dispatch("getConfirmedMeeting");

  store.dispatch("getTodayProjects");
  store.dispatch("getCalendarProjects");
  store.dispatch("getDisplayUser");
  store.dispatch("assignMeetingCalendar");
  store.dispatch("assignTodoDashboardCalendar");

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
