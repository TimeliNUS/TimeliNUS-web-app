import { Task } from "@/models/task.model";
import { Project } from "@/models/task.model";
import { TodayProject } from "@/models/task.model";
import { User } from "@/models/task.model";
import { MeetingInvitations } from "@/models/task.model";
import { ConfirmedMeetings } from "@/models/task.model";
import { MeetingPendings } from "@/models/task.model";
import { MeetingConfirmations } from "@/models/task.model";
import Store from "devextreme/data/abstract_store";
import dxPolarChart from "devextreme/viz/polar_chart";

import Vue from "vue";
import Vuex from "vuex";

import { vuexfireMutations } from "vuexfire";
import { db } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [] as Task[],
    projects: [] as Project[],
    user: {} as User,
    snapshot: {},
    allUser: [] as User[],
    projectInvitations: [] as Project[],
    meetingInvitations: [] as MeetingInvitations[],
    meetingPendings: [] as MeetingPendings[],
    meetingConfirmations: [] as MeetingConfirmations[],
    confirmedMeetings: [] as ConfirmedMeetings[],
    todayProjects: [] as TodayProject[],
    calendarProjects: [] as TodayProject[],
    displayUser: {} as User,
    meetingCalendar: [] as any[],
    todoDashboardCalendar: [] as any[],
  },
  getters: {
    todayRemaining(state) {
      let counter = 0;
      for (let i = 0; i < state.todayProjects.length; i++) {
        const todoArray = state.todayProjects[i].todos;
        console.log(todoArray);
        for (let j = 0; j < todoArray.length; j++) {
          if (todoArray[j].complete === false) {
            counter += 1;
          }
        }
      }
      console.log(state.todayProjects);

      console.log(counter);
      return counter;
    },

    todayTaskDone(state) {
      let counter = 0;
      for (let i = 0; i < state.todayProjects.length; i++) {
        const todoArray = state.todayProjects[i].todos;
        for (let j = 0; j < todoArray.length; j++) {
          if (todoArray[j].complete === true) {
            counter += 1;
          }
        }
      }
      console.log(counter);
      return counter;
    },

    todayTaskNumber(state, getters) {
      console.log(getters.todayTaskDone + getters.todayRemaining);
      return getters.todayTaskDone + getters.todayRemaining;
    },

    todayTaskProgress(state, getters) {
      console.log(getters.todayTaskDone / getters.todayTaskNumber);
      return getters.todayTaskDone / getters.todayTaskNumber;
    },

    remaining(state) {
      return state.tasks.filter((task) => !task.complete).length;
    },
    totalTask(state) {
      return state.tasks.length;
    },
    totalTaskDone(state) {
      return (
        state.tasks.length - state.tasks.filter((task) => !task.complete).length
      );
    },
    totalTaskProgress(state) {
      return (
        (state.tasks.length -
          state.tasks.filter((task) => !task.complete).length) /
        state.tasks.length
      );
    },

    getTasks: async (state) => {
      state.tasks = await getTasks(state);
    },

    getUser: (state) => {
      return state.user;
    },

    getProjects: async (state) => {
      state.projects = await getProjects(state);
    },

    getProjectInvitations: async (state) => {
      state.projectInvitations = await getProjectInvitations(state);
    },

    getMeetingPendings: async (state) => {
      state.meetingPendings = await getMeetingPendings(state);
    },
    getMeetingConfirmations: async (state) => {
      state.meetingConfirmations = await getMeetingConfirmations(state);
    },

    getConfirmedMeeting: async (state) => {
      state.confirmedMeetings = await getConfirmedMeeting(state);
    },

    getTodayProjects: async (state) => {
      state.todayProjects = await getTodayProjects(state);
    },

    getDisplayUser: async (state) => {
      state.displayUser = await getDisplayUser(state);
    },

    assignMeetingCalendar: async (state) => {
      state.meetingCalendar = await assignMeetingCalendar(state);
    },

    assignTodoDashboardCalendar: async (state) => {
      state.todoDashboardCalendar = await assignTodoDashboardCalendar(state);
    },
  },
  mutations: {
    setUser: (state, { user }) => {
      state.user = user;
      console.log("state user : " + JSON.stringify(state.user));
    },

    getTasks: (state, { tasks }) => {
      state.tasks = tasks;
      console.log(state.tasks);
    },

    getProjects: (state, { projects }) => {
      state.projects = projects;
      console.log(state.projects);
    },

    getProjectInvitations: (state, { projectInvitations }) => {
      state.projectInvitations = projectInvitations;
      console.log(state.projectInvitations);
    },

    getMeetingInvitations: (state, { meetingInvitations }) => {
      state.meetingInvitations = meetingInvitations;
      console.log(state.meetingInvitations);
    },

    getMeetingPendings: (state, { meetingPendings }) => {
      state.meetingPendings = meetingPendings;
      console.log(state.meetingPendings);
    },

    getMeetingConfirmations: (state, { meetingConfirmations }) => {
      state.meetingConfirmations = meetingConfirmations;
      console.log(state.meetingConfirmations);
    },

    getConfirmedMeeting: (state, { confirmedMeetings }) => {
      state.confirmedMeetings = confirmedMeetings;
      console.log(state.confirmedMeetings);
    },

    getTodayProjects: (state, { todayProjects }) => {
      state.todayProjects = todayProjects;
      console.log(state.todayProjects);
    },

    getCalendarProjects: (state, { calendarProjects }) => {
      state.calendarProjects = calendarProjects;
      console.log(state.calendarProjects);
    },

    getDisplayUser: (state, { displayUser }) => {
      state.displayUser = displayUser;
      console.log(state.displayUser);
    },

    assignMeetingCalendar: (state, { meetingCalendar }) => {
      state.meetingCalendar = meetingCalendar;
      console.log(state.meetingCalendar);
    },

    assignTodoDashboardCalendar: (state, { todoCalendar }) => {
      state.todoDashboardCalendar = todoCalendar;
      console.log(state.todoDashboardCalendar);
    },
    // setUser: state => {
    //   db.collection('user').orderBy('created_at').onSnapshot((snapshot) => {
    //     let user:User;
    //     snapshot.forEach((doc) => {
    //       user = {
    //         id: doc.data().id,
    //         project: doc.data().project,
    //         task: doc.data().task,
    //       }
    //     })
    //     state.user = user
    //   })
    // }
  },
  actions: {
    setItems: (context) => {
      context.commit("setItems");
    },

    getTasks: async (context, payload) => {
      console.log("start");
      const tasks = await getTasks(context.state);
      console.log(tasks);
      context.commit("getTasks", { tasks });
    },

    getProjects: async (context, payload) => {
      console.log("start");
      const projects = await getProjects(context.state);
      console.log(projects);
      context.commit("getProjects", { projects });
    },

    getProjectInvitations: async (context, payload) => {
      console.log("start");
      const projectInvitations = await getProjectInvitations(context.state);
      console.log(projectInvitations);
      context.commit("getProjectInvitations", { projectInvitations });
    },

    getMeetingInvitations: async (context, payload) => {
      console.log("start");
      const meetingInvitations = await getMeetingInvitations(context.state);
      console.log(meetingInvitations);
      context.commit("getMeetingInvitations", { meetingInvitations });
    },

    getMeetingPendings: async (context, payload) => {
      console.log("start");
      const meetingPendings = await getMeetingPendings(context.state);
      console.log(meetingPendings);
      context.commit("getMeetingPendings", { meetingPendings });
    },

    getMeetingConfirmations: async (context, payload) => {
      console.log("start");
      const meetingConfirmations = await getMeetingConfirmations(context.state);
      console.log(meetingConfirmations);
      context.commit("getMeetingConfirmations", { meetingConfirmations });
    },

    getConfirmedMeeting: async (context, payload) => {
      console.log("start");
      const confirmedMeetings = await getConfirmedMeeting(context.state);
      console.log(confirmedMeetings);
      context.commit("getConfirmedMeeting", { confirmedMeetings });
    },

    getTodayProjects: async (context, payload) => {
      console.log("start");
      const todayProjects = await getTodayProjects(context.state);
      context.commit("getTodayProjects", { todayProjects });
    },

    getCalendarProjects: async (context, payload) => {
      console.log("start");
      const calendarProjects = await getCalendarProjects(context.state);
      context.commit("getCalendarProjects", { calendarProjects });
    },

    getDisplayUser: async (context, payload) => {
      console.log("start");
      const displayUser = await getDisplayUser(context.state);
      context.commit("getDisplayUser", { displayUser });
    },

    assignMeetingCalendar: async (context, payload) => {
      console.log("start");
      const meetingCalendar = await assignMeetingCalendar(context.state);
      console.log(meetingCalendar);
      context.commit("assignMeetingCalendar", { meetingCalendar });
    },

    assignTodoDashboardCalendar: async (context, payload) => {
      console.log("start");
      const todoCalendar = await assignTodoDashboardCalendar(context.state);
      console.log(todoCalendar);
      context.commit("assignTodoDashboardCalendar", { todoCalendar });
    },

    setUser: (context, user) => {
      context.commit("setUser", { user });
    },
  },
  modules: {},
});

async function getDisplayUser(state: any): Promise<User> {
  const displayUser: User = {
    uid: "",
    name: "",
    email: "",
    task: [],
    project: [],
    avatar: "",
    calendar: "",
    zoomRefreshToken: "",
  };
  const data = await db.collection("user").doc(state.user.uid).get();
  (displayUser.uid = state.user.uid), (displayUser.name = data.get("name"));
  displayUser.email = data.get("email");
  (displayUser.avatar = data.get("photoURL")
    ? data.get("photoURL")
    : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1"),
    (displayUser.task = data.get("task"));
  displayUser.project = data.get("project");
  displayUser.calendar = data.get("calendar") ? data.get("calendar") : "No default calendar";
  displayUser.zoomRefreshToken =  data.get("zoomRefreshToken") ? data.get("zoomRefreshToken") : null

  console.log(state.user.photoURL);
  return displayUser;
}

async function getTasks(state: any): Promise<Task[]> {
  const querySnapshot = await db
    .collection("todo")
    .where("PIC", "array-contains",db.collection("user").doc(state.user.uid))
    .get();
  const tasks: Task[] = [];
  console.log(querySnapshot)

  await Promise.all(
  querySnapshot.docs.map(async (doc) => {
  console.log(doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString(): "00:00")
  let newDate = ""
  if(doc.data().deadline){

  
  const currLocalDate = doc.data().deadline
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newDate = currYear + "-" + currMonth + "-" + currDate;
  } 
  console.log(doc.data().task + " "+doc.data().includeTime)
    tasks.push({
      id: doc.id,
      task: doc.data().task ?? "",
      complete: doc.data().complete,
      _createdAt: doc.data().dateTime,
      note: doc.data().note,
      project: doc.data().project.reference ? await doc.data().project.reference.get() : await doc.data().project.get(),
      projectTitle: doc.data().project.reference ? await getTaskProject(doc.data().project.reference) : await getTaskProject(doc.data().project) ,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadline ? newDate : "",
      deadlineTime: doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString().substr(0,5) : "00:00",
      switchValue: doc.data().includeTime !== undefined ? doc.data().includeTime : doc.data().switchValue,
      dateSwitchValue: doc.data().deadline ? false : true,
      displayDeadline: doc.data().deadline ? newDate : "Someday",
      PIC: doc.data().PIC,
      PICavatar: await getGroupmatesAvatar(doc.data().PIC),
    });

  })
  )
  console.log(tasks)
  return tasks;
}


async function getTasksOriginal(state: any): Promise<Task[]> {
  const documentSnapshot = await db
    .collection("user")
    .doc(state.user.uid)
    .get();
  console.log(documentSnapshot);
  const data = await documentSnapshot.get("todo");
  const tasks: Task[] = [];
  console.log(data);
  console.log(state.user.uid);
  for (let i = 0; i < data.length; i++) {
    const doc = await data[i].get();
    console.log(state.user.uid);
    console.log(data);
    console.log(documentSnapshot);
    console.log(doc.id);
    console.log(doc.get("complete"));

    console.log(doc.data());
    const PICid = []
          for(let j=0; j< doc.data().PIC.length; j++){
            const pplID = doc.data().PIC[j].id
            console.log(pplID)
            PICid.push(pplID)
          }
          console.log(PICid)
    if(PICid.includes(state.user.uid)){
    

      tasks.push({
        id: doc.id,
        task: doc.data().task ?? "",
        complete: doc.data().complete,
        _createdAt: doc.data().dateTime,
        note: doc.data().note,
        project: doc.data().project,
        projectTitle: await getTaskProject(doc.data().project),
        deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
        deadlineDate: doc.data().deadline.toDate().substr(0,10),
        deadlineTime: doc.data().deadline.toDate().substr(12,5),
        switchValue: doc.data().switchValue,
        dateSwitchValue: doc.data().dateSwitchValue,
        displayDeadline: doc.data().displayDeadline,
        PIC: doc.data().PIC,
        PICavatar: await getGroupmatesAvatar(doc.data().PIC),
      });
    }
    
  }
  console.log(tasks);
  return tasks;
}

async function getProjectInvitations(state: any): Promise<Project[]> {
  const querySnapshot = await db
    .collection("project")
    .where("invitations", "array-contains",db.collection("user").doc(state.user.uid))
    .get();
  console.log(state);
  const projectInvitations: Project[] = [];
  await Promise.all(
  querySnapshot.docs.map(async (doc) => {
    let newDate = ""
  if(doc.data().deadline){

  
  const currLocalDate = doc.data().deadline
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newDate = currYear + "-" + currMonth + "-" + currDate;
  } 
    
    projectInvitations.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: doc.data().todos ?? [],
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().moduleCode ? doc.data().moduleCode : doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadline ? newDate : "",
      deadlineTime: doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString().substr(0,5) : "00:00",
      switchValue: doc.data().includeTime !== undefined ? doc.data().includeTime : doc.data().switchValue,
      dateSwitchValue: doc.data().deadline ? false : true,
      displayDeadline: doc.data().deadline ? newDate : "Someday",
      groupmates: doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates,
      groupmatesAvatar: await getGroupmatesAvatar(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
      groupmatesName: await getGroupmatesName(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
      confirmedMeetingLength: doc.data().meetings ? await findScheduledMeetingLength(doc.data().meetings) : 0,
      incompletedTodoLength:  doc.data().todos ? await findIncompletedTodoLength(doc.data().todos) : 0,
    });
  }))
  console.log(projectInvitations);
  return projectInvitations;
}

async function getTaskProject(project: any) {
  const docRef = await db.collection("project").doc(project.id).get();
  console.log(docRef);
  console.log(await docRef.get("title"));
  return await docRef.get("title");
}

async function getCreator(creator: any) {
  console.log(creator);
  const docRef = await creator.get();
  return docRef.get("name");
}

async function getProjects(state: any): Promise<Project[]> {
  const querySnapshot = await db
    .collection("project")
    .where("confirmedInvitations", "array-contains",db.collection("user").doc(state.user.uid))
    .get();
  console.log(state);
 
  const projects: Project[] = [];
  await Promise.all(
  querySnapshot.docs.map(async (doc) => {
    let newDate = ""
  if(doc.data().deadline){

  
  const currLocalDate = doc.data().deadline
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newDate = currYear + "-" + currMonth + "-" + currDate;
  } 

    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      confirmedMeetingLength: doc.data().meetings ? await findScheduledMeetingLength(doc.data().meetings) : 0,
      incompletedTodoLength:  doc.data().todos ? await findIncompletedTodoLength(doc.data().todos) : 0,
      todos: doc.data().todos ?? [],
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().moduleCode ? doc.data().moduleCode : doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadline ? newDate : "",
      deadlineTime: doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString().substr(0,5) : "00:00",
      switchValue: doc.data().includeTime !== undefined ? doc.data().includeTime : doc.data().switchValue,
      dateSwitchValue: doc.data().deadline ? false : true,
      displayDeadline: doc.data().deadline ? newDate : "Someday",
      groupmates: doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates,
      groupmatesAvatar: await getGroupmatesAvatar(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
      groupmatesName: await getGroupmatesName(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
    });
  }))
  console.log(projects);
  return projects;
}

async function getGroupmatesName(groupmates: any) {
  const groupmatesNameArray: string[] = [];
  for (let i = 0; i < groupmates.length; i++) {
    const docRef = await db.collection("user").doc(groupmates[i].id).get();
    groupmatesNameArray.push(docRef.get("name"));
  }
  return groupmatesNameArray;
}

async function getGroupmatesAvatar(groupmates: any) {
  const groupmatesAvatarArray: any[] = [];
  for (let i = 0; i < groupmates.length; i++) {
    const docRef = await db.collection("user").doc(groupmates[i].id).get();
    groupmatesAvatarArray.push(
      docRef.get("photoURL")
        ? docRef.get("photoURL")
        : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1"
    );
  }
  return groupmatesAvatarArray;
}

async function getProjectProgress(todos: any) {
  let counterCompleted = 0;
  let counterIncompleted = 0;
  if (todos == null || todos.length == 0) {
    return 0;
  } else {
    for (let i = 0; i < todos.length; i++) {
      const docRef = await db.collection("todo").doc(todos[i].id).get();
      console.log(docRef.get("complete"));
      if (docRef.get("complete") == false) {
        counterIncompleted += 1;
      } else {
        counterCompleted += 1;
      }
    }
    console.log(counterCompleted);
    console.log(counterIncompleted);
    return counterCompleted / (counterIncompleted + counterCompleted);
  }
}

async function getTodayProjects(state: any): Promise<TodayProject[]> {
  const querySnapshot = await db
    .collection("project")
    .where("confirmedInvitations", "array-contains",db.collection("user").doc(state.user.uid))
    .get();
  console.log(state);
  const projects: TodayProject[] = [];
  await Promise.all(
  querySnapshot.docs.map(async (doc) => {
    let newDate = ""
  if(doc.data().deadline){

  
  const currLocalDate = doc.data().deadline
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newDate = currYear + "-" + currMonth + "-" + currDate;
  } 
  
    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: await getTodayTodos(state, doc),
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().moduleCode ? doc.data().moduleCode : doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadline ? newDate : "",
      deadlineTime: doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString().substr(0,5) : "00:00",
      switchValue: doc.data().includeTime !== undefined ? doc.data().includeTime : doc.data().switchValue,
      dateSwitchValue: doc.data().deadline ? false : true,
      displayDeadline: doc.data().deadline ? newDate : "Someday",
      groupmates: doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates,
      groupmatesName: await getGroupmatesName(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
    });
  }))
  console.log(projects);
  return projects;
}

async function getCalendarProjects(state: any): Promise<TodayProject[]> {
  const querySnapshot = await db
    .collection("project")
    .where("confirmedInvitations", "array-contains",db.collection("user").doc(state.user.uid))
    .get();
  console.log(state);
  const projects: TodayProject[] = [];
  await Promise.all(
  querySnapshot.docs.map(async (doc) => {
    let newDate = ""
  if(doc.data().deadline){

  
  const currLocalDate = doc.data().deadline
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newDate = currYear + "-" + currMonth + "-" + currDate;
  } 
  
    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: await getCalendarTodos(state, doc),
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().moduleCode ? doc.data().moduleCode : doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadline ? newDate : "",
      deadlineTime: doc.data().deadline ? doc.data().deadline.toDate().toLocaleTimeString().substr(0,5) : "00:00",
      switchValue: doc.data().includeTime !== undefined ? doc.data().includeTime : doc.data().switchValue,
      dateSwitchValue: doc.data().deadline ? false : true,
      displayDeadline: doc.data().deadline ? newDate : "Someday",
      groupmates: doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates,
      groupmatesName: await getGroupmatesName(doc.data().confirmedInvitations ? doc.data().confirmedInvitations : doc.data().groupmates),
    });
  }))
  console.log(projects);
  return projects;
}

async function getTodayTodos(state: any, project: any) {
  const pushTodos: Task[] = [];
  const querySnapshot = await db
    .collection("todo")
    .where("project.reference", "==",db.collection("project").doc(project.id))
    .where("PIC", "array-contains", db.collection("user").doc(state.user.uid))
    .get();
    await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      let newDate = ""
      if(doc.get("deadline")){
    
      
      const currLocalDate = doc.data().deadline
            .toDate()
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          newDate = currYear + "-" + currMonth + "-" + currDate;
      } 
      
    if (newDate === new Date().toISOString().substr(0, 10)) {
      pushTodos.push({
        id: doc.id,
        task: doc.get("task") ?? "",
        complete: doc.get("complete"),
        _createdAt: doc.get("dateTime"),
        note: doc.get("note"),
        project: doc.get("project").reference ? await doc.get("project").reference.get() : await doc.get("project").get(),
        projectTitle: doc.get("project").reference ? await getTaskProject(doc.get("project").reference) : await getTaskProject(doc.get("project")) ,
        deadline: doc.get("deadline") ? doc.get("deadline").toDate() : null,
        deadlineDate: doc.get("deadline") ? newDate : "",
        deadlineTime: doc.get("deadline") ? doc.get("deadline").toDate().toLocaleTimeString().substr(0,5) : "00:00",
        switchValue: doc.get("includeTime") !== undefined ? doc.get("includeTime") : doc.get("switchValue"),
      dateSwitchValue: doc.get("deadline") ? false : true,
      displayDeadline: doc.get("deadline")  ? newDate : "Someday",
        PIC: doc.get("PIC"),
        PICavatar: await getGroupmatesAvatar(doc.get("PIC")),
      });
    }
  }))
  console.log(pushTodos);
  return pushTodos;
}

async function getCalendarTodos(state:any, project: any) {
  
  const pushTodos: Task[] = [];
  const querySnapshot = await db
    .collection("todo")
    .where("project.reference", "==",db.collection("project").doc(project.id))
    .where("PIC", "array-contains", db.collection("user").doc(state.user.uid))
    .get();
    await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      let newDate = ""
      if(doc.get("deadline")){
    
      
      const currLocalDate = doc.data().deadline
            .toDate()
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          newDate = currYear + "-" + currMonth + "-" + currDate;
      } 
  
      pushTodos.push({
        id: doc.id,
        task: doc.get("task") ?? "",
        complete: doc.get("complete"),
        _createdAt: doc.get("dateTime"),
        note: doc.get("note"),
        project: doc.get("project").reference ? await doc.get("project").reference.get() : await doc.get("project").get(),
        projectTitle: doc.get("project").reference ? await getTaskProject(doc.get("project").reference) : await getTaskProject(doc.get("project")) ,
        deadline: doc.get("deadline") ? doc.get("deadline").toDate() : null,
        deadlineDate: doc.get("deadline") ? newDate : "",
        deadlineTime: doc.get("deadline") ? doc.get("deadline").toDate().toLocaleTimeString().substr(0,5) : "00:00",
        switchValue: doc.get("includeTime") !== undefined ? doc.get("includeTime") : doc.get("switchValue"),
      dateSwitchValue: doc.get("deadline") ? false : true,
      displayDeadline: doc.get("deadline")  ? newDate : "Someday",
        PIC: doc.get("PIC"),
        PICavatar: await getGroupmatesAvatar(doc.get("PIC")),
      });

    }))

    const querySnapshotTwo = await db
    .collection("todo")
    .where("project", "==",db.collection("project").doc(project.id))
    .where("PIC", "array-contains", db.collection("user").doc(state.user.uid))
    .get();
    await Promise.all(
    querySnapshotTwo.docs.map(async (doc) => {
      let newDate = ""
      if(doc.get("deadline")){
    
      
      const currLocalDate = doc.data().deadline
            .toDate()
            .toLocaleDateString()
            .substr(0, 10);
          const currYear = currLocalDate.substr(6);
          const currMonth = currLocalDate.substr(3, 2);
          const currDate = currLocalDate.substr(0, 2);
          console.log(currLocalDate);
          console.log(currYear);
          console.log(currMonth);
          console.log(currDate);
          newDate = currYear + "-" + currMonth + "-" + currDate;
      } 
  
      pushTodos.push({
        id: doc.id,
        task: doc.get("task") ?? "",
        complete: doc.get("complete"),
        _createdAt: doc.get("dateTime"),
        note: doc.get("note"),
        project: doc.get("project").reference ? await doc.get("project").reference.get() : await doc.get("project").get(),
        projectTitle: doc.get("project").reference ? await getTaskProject(doc.get("project").reference) : await getTaskProject(doc.get("project")) ,
        deadline: doc.get("deadline") ? doc.get("deadline").toDate() : null,
        deadlineDate: doc.get("deadline") ? newDate : "",
        deadlineTime: doc.get("deadline") ? doc.get("deadline").toDate().toLocaleTimeString().substr(0,5) : "00:00",
        switchValue: doc.get("includeTime") !== undefined ? doc.get("includeTime") : doc.get("switchValue"),
      dateSwitchValue: doc.get("deadline") ? false : true,
      displayDeadline: doc.get("deadline")  ? newDate : "Someday",
        PIC: doc.get("PIC"),
        PICavatar: await getGroupmatesAvatar(doc.get("PIC")),
      });

    }))
    
  
  console.log(pushTodos);
  return pushTodos;
}

async function getMeetingInvitations(
  state: any
): Promise<MeetingInvitations[]> {
  console.log(state);
  const meetingInvitations: MeetingInvitations[] = [];

  const querySnapshot = await db
    .collection("meeting")
    .where(
      "invitations",
      "array-contains",
      db.collection("user").doc(state.user.uid)
    )
    .get();
  console.log(querySnapshot);
  querySnapshot.forEach(async (doc) => {
    let newStartDate = ""
    let newEndDate = ""
    const currLocalDate = doc.data().startDate
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      newStartDate = currYear + "-" + currMonth + "-" + currDate;

      const currLocalDateEnd = doc.data().endDate
      .toDate()
      .toLocaleDateString()
      .substr(0, 10);
    const currYearEnd = currLocalDateEnd.substr(6);
    const currMonthEnd = currLocalDateEnd.substr(3, 2);
    const currDateEnd = currLocalDateEnd.substr(0, 2);
    console.log(currLocalDate);
    console.log(currYear);
    console.log(currMonth);
    console.log(currDate);
    newEndDate = currYearEnd + "-" + currMonthEnd + "-" + currDateEnd;

  
    meetingInvitations.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: doc.data().invitations,
      project: doc.data().project.reference ? await doc.data().project.reference.get() : await doc.data().project.get(),
        projectTitle: doc.data().project.reference ? await getTaskProject(doc.data().project.reference) : await getTaskProject(doc.data().project) ,
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
      displayMeetingDateRange: newStartDate + "~" + newEndDate,
      groupmates: await getPendingGroupmates(doc.data().groupmates),
    });
  });
  console.log(meetingInvitations);
  return meetingInvitations;
}

async function getMeetingPendings(state: any): Promise<MeetingPendings[]> {
  console.log(state);
  const meetingPendings: MeetingPendings[] = [];

  const querySnapshot = await db
    .collection("meeting")
    .where(
      "confirmedInvitations",
      "array-contains",
      db.collection("user").doc(state.user.uid)
    )
    .where("invitations", "!=", [])
    .get();
  console.log(querySnapshot);
  querySnapshot.forEach(async (doc) => {
    
  
    meetingPendings.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: await getPendingGroupmates(doc.data().invitations),
      confirmed_groupmates: await getPendingGroupmates(
        doc.data().confirmedInvitations
      ),
      project: doc.data().project.reference ? await doc.data().project.reference.get() : await doc.data().project.get(),
        projectTitle: doc.data().project.reference ? await getTaskProject(doc.data().project.reference) : await getTaskProject(doc.data().project) ,
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
      groupmates: await getPendingGroupmates(doc.data().groupmates),
    });
  });
  console.log(meetingPendings);
  return meetingPendings;
}

async function getMeetingConfirmations(
  state: any
): Promise<MeetingConfirmations[]> {
  console.log(state);
  const meetingConfirmations: MeetingConfirmations[] = [];

  const querySnapshot = await db
    .collection("meeting")
    .where(
      "confirmedInvitations",
      "array-contains",
      db.collection("user").doc(state.user.uid)
    )
    .where("invitations", "==", [])
    .where("isConfirmed", "==", false)
    .get();
  console.log(querySnapshot);
  querySnapshot.forEach(async (doc) => {
    meetingConfirmations.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: doc.data().invitations,
      project: doc.data().project.reference ? await doc.data().project.reference.get() : await doc.data().project.get(),
        projectTitle: doc.data().project.reference ? await getTaskProject(doc.data().project.reference) : await getTaskProject(doc.data().project) ,
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
      groupmates: await getPendingGroupmates(doc.data().groupmates),
      creatorID: doc.data().author.id
    });
    console.log(doc.data().author.id)
  });

  console.log(meetingConfirmations);
  return meetingConfirmations;
}

async function getConfirmedMeeting(state: any): Promise<ConfirmedMeetings[]> {
  console.log(state);
  const ConfirmedMeetings: ConfirmedMeetings[] = [];

  const querySnapshot = await db
    .collection("meeting")
    .where(
      "confirmedInvitations",
      "array-contains",
      db.collection("user").doc(state.user.uid)
    )
    .where("invitations", "==", [])
    .where("isConfirmed", "==", true)
    .get();
  await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      console.log(doc.data());
      console.log(doc.data().project)
      const test = {
      
        id: doc.id,
        title: doc.data().title,
        invited_groupmates: doc.data().invitations,
        project: doc.data().project.reference ? await doc.data().project.reference.get() : await doc.data().project.get(),
        projectTitle: doc.data().project.reference ? await getTaskProject(doc.data().project.reference) : await getTaskProject(doc.data().project) ,
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        startTime: doc.data().startTime,
        endTime: doc.data().endTime,
        timeLength: doc.data().timeLength,
        venue: doc.data().meetingVenue,
        isOnlineVenue: doc.data().isOnlineVenue ? doc.data().isOnlineVenue : null,
        creator: await getCreator(doc.data().author),
        selectedStartDate: doc.data().selectedStartDate,
        selectedEndDate: doc.data().selectedEndDate,
        groupmates: await getPendingGroupmates(doc.data().confirmedInvitations),
        meetingLink: doc.data().meetingLink ? doc.data().meetingLink : "No meeting link"
      };
      // console.log("test: " + JSON.stringify(test));
      ConfirmedMeetings.push(test);
    })
  );
  console.log(ConfirmedMeetings);

  return ConfirmedMeetings;
}

async function getPendingGroupmates(groupmates: any): Promise<User[]> {
  const groupmatesArray: User[] = [];
  for (let i = 0; i < groupmates.length; i++) {
    const docRef = await db.collection("user").doc(groupmates[i].id).get();
    groupmatesArray.push({
      uid: docRef.id,
      name: docRef.get("name"),
      email: docRef.get("email"),
      task: docRef.get("todo"),
      project: docRef.get("project"),
      avatar: docRef.get("photoURL")
        ? docRef.get("photoURL")
        : "https://firebasestorage.googleapis.com/v0/b/timelinus-2021.appspot.com/o/default_profile_pic.jpg?alt=media&token=093aee02-56ad-45b8-a937-ab337cf145f1",
      calendar: docRef.get("calendar") ? docRef.get("calendar") : "No default calendar",
      zoomRefreshToken: docRef.get("zoomRefreshToken") ? docRef.get("zoomRefreshToken") : null
      });
  }
  return groupmatesArray;
}

async function assignMeetingCalendar(state: any) {
  await getConfirmedMeeting(state);
  const meetingCalendar: any[] = [];
  console.log(state.confirmedMeetings);
  state.confirmedMeetings.map((meeting: any) => {
    if (meeting !== null) {
      const currLocalDate = meeting.selectedStartDate
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      const newDate = currYear + "-" + currMonth + "-" + currDate;
      console.log(newDate);
      meetingCalendar.push(newDate);
    }
  });
  console.log(meetingCalendar);
  return meetingCalendar;
}

async function assignTodoDashboardCalendar(state: any) {
  const todoCalendar: any[] = [];
  await getTasks(state);
  console.log(state.tasks)
  console.log(state.tasks.length)
  state.tasks.map((todo: any) => {
    console.log(todo.deadline)
    console.log(todo)
    if (todo !== null && todo.deadline !== null) {
      console.log(todo);
      console.log(todo.deadline);
      console.log(todo.deadline.toLocaleDateString().substr(0, 10));

      const currLocalDate = todo.deadline.toLocaleDateString().substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      const newDate = currYear + "-" + currMonth + "-" + currDate;
      console.log(newDate);
      console.log(todo.PIC.includes(db.collection('user').doc(state.user.uid)))
      const PICid = []
          for(let j=0; j< todo.PIC.length; j++){
            const pplID = todo.PIC[j].id
            console.log(pplID)
            PICid.push(pplID)
          }
          console.log(PICid)
      if(PICid.includes(state.user.uid)){
        todoCalendar.push({
          date: newDate,
          type: "todo",
        });
      }

    }
  });

  console.log(todoCalendar);

  await getConfirmedMeeting(state);
  console.log(state.confirmedMeetings);
  state.confirmedMeetings.map((meeting: any) => {
    if (meeting !== null) {
      const currLocalDate = meeting.selectedStartDate
        .toDate()
        .toLocaleDateString()
        .substr(0, 10);
      const currYear = currLocalDate.substr(6);
      const currMonth = currLocalDate.substr(3, 2);
      const currDate = currLocalDate.substr(0, 2);
      console.log(currLocalDate);
      console.log(currYear);
      console.log(currMonth);
      console.log(currDate);
      const newDate = currYear + "-" + currMonth + "-" + currDate;
      console.log(newDate);
      todoCalendar.push({
        date: newDate,
        type: "meeting",
      });
    }
  });
  return todoCalendar;
}

async function findScheduledMeetingLength(meetings: any){
  let counter = 0
  console.log(meetings)
  console.log(meetings.length)
  
  for(let i=0; i<meetings.length; i++){
    const meeting = await meetings[i].get()
    const data = meeting.data()
    if(data !== undefined){
      if(data.isConfirmed == true){
        counter += 1
      }
    }
    

  }
  console.log(counter)
  return counter
  // meetings.forEach((meeting) => await meeting.get()).filter('isConfirmed' == true)
}

async function findIncompletedTodoLength(todos: any){
  let counter = 0
  
  for(let i=0; i<todos.length; i++){
    const todo = await todos[i].get()
    const data = todo.data()
    if(data !== undefined) {
      if(data.complete == false){
        counter += 1
      }
    }


  }
  console.log(counter)
  return counter
  // meetings.forEach((meeting) => await meeting.get()).filter('isConfirmed' == true)
}