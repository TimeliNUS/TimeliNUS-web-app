import Vue from "vue";
import Vuex from "vuex";

export interface Task {
  id: string;
  task: string;
  complete: boolean;
  _createdAt: Date;
  deadline: Date;
  note: string;
  project: Project;
}

export interface Project {
  id: string;
  task: string;
  complete: boolean;
  deadline: Date;
  groupmates: User;
}

export interface User {
  id: string;
  task: string;
  project: string;
}
