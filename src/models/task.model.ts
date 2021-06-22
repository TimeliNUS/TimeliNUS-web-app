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
  projectTitle:string;
  deadlineTime: string;
  deadlineDate: string;
  switchValue: boolean;
  displayDeadline: string | Date;
  dateSwitchValue: boolean;

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
  deadlineTime: string;
  deadlineDate: string;
  switchValue: boolean;
  groupmates: [];
  groupmatesName: string[];
}

export interface User {
  uid: string;
  email: string;
  task: [];
  project: [];
}
