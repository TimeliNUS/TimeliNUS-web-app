import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

export interface Task {
  id: string;
  task: string;
  complete: boolean;
  _createdAt: firebase.firestore.Timestamp;
  deadline: firebase.firestore.Timestamp;
  note: string;
  project: Project;
}

export interface Project {
  id: string;
  title: string;
  todos: [];
  meetings: [];
  _createdAt: Date;
  deadline: Date;
  progress: Number;
  modCode: string;
}

export interface User {
  uid: string;
  email: string;
  task: [];
  project: [];
}
