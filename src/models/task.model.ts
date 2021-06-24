import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

export interface Task {
  id: string;
  task: string;
  complete: boolean;
  _createdAt: firebase.firestore.Timestamp;
  deadline: Date | null;
  note: string;
  project: Project;
  projectTitle: string;
  deadlineTime: string;
  deadlineDate: string;
  switchValue: boolean;
  displayDeadline: string | Date;
  dateSwitchValue: boolean;
  PIC: User;
}

export interface Project {
  id: string;
  title: string;
  todos: [];
  meetings: [];
  _createdAt: firebase.firestore.Timestamp;
  deadline: Date | null;
  progress: number;
  modCode: string;
  deadlineTime: string;
  deadlineDate: string;
  switchValue: boolean;
  groupmates: [];
  groupmatesName: string[];
  displayDeadline: string | Date;
  dateSwitchValue: boolean;
}

export interface User {
  uid: string;
  email: string;
  task: [];
  project: [];
}