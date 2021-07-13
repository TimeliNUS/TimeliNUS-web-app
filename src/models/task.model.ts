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
  PIC: any[];
  PICavatar: any[];
}

export interface Project {
  id: string;
  creator: User;
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
  groupmatesAvatar: any[];
  displayDeadline: string | Date;
  dateSwitchValue: boolean;
  confirmedMeetingLength: Number;
  incompletedTodoLength: Number;
}

export interface TodayProject {
  id: string;
  creator: User;
  title: string;
  todos: Task[];
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
  name: string;
  email: string;
  task: [];
  project: [];
  avatar: string;
  calendar: string;
}

export interface MeetingInvitations {
  id: string;
  title: string;
  invited_groupmates: User[];
  project: Project;
  projectTitle: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeLength: number;
  venue: string;
  creator: User;
  displayMeetingDateRange: string;
  groupmates: User[];
}

export interface MeetingPendings {
  id: string;
  title: string;
  invited_groupmates: User[];
  confirmed_groupmates: User[];
  project: Project;
  projectTitle: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeLength: number;
  venue: string;
  creator: User;
  groupmates: User[];
}

export interface MeetingConfirmations {
  id: string;
  title: string;
  invited_groupmates: User[];
  project: Project;
  projectTitle: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeLength: number;
  venue: string;
  creator: User;
  groupmates: User[];
  creatorID: string;
}

export interface ConfirmedMeetings {
  id: string;
  title: string;
  invited_groupmates: User[];
  project: Project;
  projectTitle: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  timeLength: number;
  venue: string;
  creator: User;
  selectedStartDate: Date;
  selectedEndDate: Date;
  groupmates: User[];
  meetingLink: string;
}
