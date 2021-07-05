import { Task } from "@/models/task.model";
import { Project } from "@/models/task.model";
import { TodayProject } from "@/models/task.model";
import { User } from "@/models/task.model";
import { MeetingInvitations } from "@/models/task.model";
import { MeetingPendings } from "@/models/task.model";
import { MeetingConfirmations } from "@/models/task.model";

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
    todayProjects: [] as TodayProject[],
    calendarProjects: [] as TodayProject[]

  },
  getters: {
    todayRemaining(state){
      let counter = 0
      for(let i=0; i<state.todayProjects.length; i++){
        const todoArray = state.todayProjects[i].todos
        console.log(todoArray)
        for(let j=0; j<todoArray.length; j++){
          if(todoArray[j].complete === false){
            counter += 1
          }
        }
      }
      console.log(state.todayProjects)
      
      console.log(counter)
      return counter;
        
    },

    todayTaskDone(state){
      let counter = 0
      for(let i=0; i<state.todayProjects.length; i++){
        const todoArray = state.todayProjects[i].todos
        for(let j=0; j<todoArray.length; j++){
          if(todoArray[j].complete === true){
            counter += 1
          }
        }
      }
      console.log(counter)
      return counter;
        
    },

    todayTaskNumber(state,getters){
      console.log(getters.todayTaskDone + getters.todayRemaining)
      return getters.todayTaskDone + getters.todayRemaining
    },

    todayTaskProgress(state,getters){
      console.log( getters.todayTaskDone /getters.todayTaskNumber)
      return getters.todayTaskDone /getters.todayTaskNumber

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
      state.meetingPendings = await getMeetingConfirmations(state);
    },

    getTodayProjects: async (state) => {
      state.todayProjects = await getTodayProjects(state);
    },
  },
  mutations: {
    setItems: (state) => {
      state.snapshot = db
        .collection("todo")
        .orderBy("created_at")
        .onSnapshot((snapshot) => {
          const tasks: Task[] = [];
          snapshot.forEach((doc) => {
            tasks.push({
              id: doc.id,
              task: doc.data().task,
              complete: doc.data().complete,
              _createdAt: doc.data().dateTime,
              note: doc.data().note,
              project: doc.data().project,
              projectTitle: doc.data().project.data().title,
              deadline: doc.data().deadline,
              deadlineDate: doc.data().deadlineDate,
              deadlineTime: doc.data().deadlineTime,
              switchValue: doc.data().switchValue,
              dateSwitchValue: doc.data().dateSwitchValue,
              displayDeadline: doc.data().displayDeadline,
              PIC: doc.data().PIC,
            });
          });
          state.tasks = tasks;
        });
    },

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
      console.log(state.projectInvitations)
    },

    getMeetingInvitations: (state, { meetingInvitations }) => {
      state.meetingInvitations = meetingInvitations;
      console.log(state.meetingInvitations)
    },

    getMeetingPendings: (state, { meetingPendings }) => {
      state.meetingPendings = meetingPendings;
      console.log(state.meetingPendings)
    },

    getMeetingConfirmations: (state, { meetingConfirmations }) => {
      state.meetingConfirmations = meetingConfirmations;
      console.log(state.meetingConfirmations)
    },

    getTodayProjects: (state, { todayProjects }) => {
      state.todayProjects = todayProjects;
      console.log(state.todayProjects)
    },

    getCalendarProjects: (state, { calendarProjects }) => {
      state.calendarProjects = calendarProjects;
      console.log(state.calendarProjects)
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


    setUser: (context, user) => {
      context.commit("setUser", { user });
    },
  },
  modules: {},
});

async function getTasks(state: any): Promise<Task[]> {
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
    console.log(state.user.uid)
    console.log(data)
    console.log(documentSnapshot);
    console.log(doc.id)
    console.log(doc.get("complete"))


    console.log(doc.data())
    tasks.push({
      id: doc.id,
      task: doc.data().task ?? "",
      complete: doc.data().complete,
      _createdAt: doc.data().dateTime,
      note: doc.data().note,
      project: doc.data().project,
      projectTitle: await getTaskProject(doc.data().project),
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      PIC: doc.data().PIC,
    });
  }
  console.log(tasks);
  return tasks;
}

async function getProjectInvitations(state: any): Promise<Project[]> {
  const documentSnapshot = await db
    .collection("user")
    .doc(state.user.uid)
    .get();
  console.log(documentSnapshot);
  const data = await documentSnapshot.get("project_invited");
  const projectInvitations: Project[] = [];
  for (let i = 0; i < data.length; i++) {
    const doc = await data[i].get();
    console.log(doc.data().creator)
    projectInvitations.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: doc.data().todos ?? [],
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      groupmates: doc.data().groupmates ?? "",
      groupmatesName: await getGroupmatesName(doc.data().groupmates),

    });
  }
  console.log(projectInvitations)
  return projectInvitations
}

async function getTaskProject(project: any) {
  const docRef = await db.collection("project").doc(project.id).get();
  console.log(docRef);
  console.log(await docRef.get("title"));
  return await docRef.get("title");
}

async function getCreator(creator: any){
  console.log(creator)
  const docRef = await creator.get();
  return docRef.get('name');
}

async function getProjects(state: any): Promise<Project[]> {
  console.log(state);
  const documentSnapshot = await db
    .collection("user")
    .doc(state.user.uid)
    .get();
  console.log(documentSnapshot.exists);
  const data = await documentSnapshot.get("project");
  const projects: Project[] = [];
  console.log(data);
  console.log(state.user.uid);
  for (let i = 0; i < data.length; i++) {
    const doc = await data[i].get();
    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: doc.data().todos ?? [],
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      groupmates: doc.data().groupmates ?? "",
      groupmatesName: await getGroupmatesName(doc.data().groupmates),
    });
  }
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
  console.log(state);
  const documentSnapshot = await db
    .collection("user")
    .doc(state.user.uid)
    .get();
  console.log(documentSnapshot.exists);
  const data = await documentSnapshot.get("project");
  const projects: TodayProject[] = [];
  console.log(data);
  console.log(state.user.uid);
  for (let i = 0; i < data.length; i++) {
    const doc = await data[i].get();
    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: await getTodayTodos(doc),
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      groupmates: doc.data().groupmates ?? "",
      groupmatesName: await getGroupmatesName(doc.data().groupmates),
    });
  }
  console.log(projects);
  return projects;
}

async function getCalendarProjects(state: any): Promise<TodayProject[]> {
  console.log(state);
  const documentSnapshot = await db
    .collection("user")
    .doc(state.user.uid)
    .get();
  console.log(documentSnapshot.exists);
  const data = await documentSnapshot.get("project");
  const projects: TodayProject[] = [];
  console.log(data);
  console.log(state.user.uid);
  for (let i = 0; i < data.length; i++) {
    const doc = await data[i].get();
    projects.push({
      id: doc.id,
      creator: doc.data().creator ? await getCreator(doc.data().creator) : null,
      meetings: doc.data().meetings,
      todos: await getCalendarTodos(doc),
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      progress: await getProjectProgress(doc.data().todos),
      modCode: doc.data().modCode,
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      groupmates: doc.data().groupmates ?? "",
      groupmatesName: await getGroupmatesName(doc.data().groupmates),
    });
  }
  console.log(projects);
  return projects;
}

async function getTodayTodos(project: any){
  const docRef = await db
    .collection("project").doc(project.id).get()
  const data = await docRef.get('todos')
  const pushTodos: Task[] = [];
  for(let i=0; i<data.length; i++){
    const doc = await db.collection('todo').doc(data[i].id).get()
    if (doc.get('deadlineDate') === new Date().toISOString().substr(0, 10)){
      pushTodos.push({
        id: doc.id,
        task: doc.get("task") ?? "",
        complete: doc.get("complete"),
        _createdAt: doc.get("dateTime"),
        note: doc.get("note"),
        project: doc.get("project"),
        projectTitle: await getTaskProject(doc.get("project")),
        deadline: doc.get("deadline") ? doc.get("deadline").toDate() : null,
        deadlineDate: doc.get("deadlineDate"),
        deadlineTime: doc.get("deadlineTime"),
        switchValue: doc.get("switchValue"),
        dateSwitchValue: doc.get("dateSwitchValue"),
        displayDeadline: doc.get("displayDeadline"),
        PIC: doc.get("PIC"),
      });
    }
  }
  console.log(pushTodos)
  return pushTodos
    
}

async function getCalendarTodos(project: any){
  const docRef = await db
    .collection("project").doc(project.id).get()
  const data = await docRef.get('todos')
  const pushTodos: Task[] = [];
  for(let i=0; i<data.length; i++){
    const doc = await db.collection('todo').doc(data[i].id).get()
    
      pushTodos.push({
        id: doc.id,
        task: doc.get("task") ?? "",
        complete: doc.get("complete"),
        _createdAt: doc.get("dateTime"),
        note: doc.get("note"),
        project: doc.get("project"),
        projectTitle: await getTaskProject(doc.get("project")),
        deadline: doc.get("deadline") ? doc.get("deadline").toDate() : null,
        deadlineDate: doc.get("deadlineDate"),
        deadlineTime: doc.get("deadlineTime"),
        switchValue: doc.get("switchValue"),
        dateSwitchValue: doc.get("dateSwitchValue"),
        displayDeadline: doc.get("displayDeadline"),
        PIC: doc.get("PIC"),
      });
    
  }
  console.log(pushTodos)
  return pushTodos
    
}

async function getMeetingInvitations(state: any): Promise<MeetingInvitations[]> {
  console.log(state);
  const meetingInvitations: MeetingInvitations[] = [];
  
  const querySnapshot = await db
    .collection("meeting")
    .where('invitations', 'array-contains', db.collection("user").doc(state.user.uid)).get();
    console.log(querySnapshot)
  querySnapshot.forEach(async (doc) => {
    meetingInvitations.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: doc.data().invitations,
      project: doc.data().project.get(),
      projectTitle: await getTaskProject(doc.data().project),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
      displayMeetingDateRange: doc.data().displayMeetingDateRange 
    })
  })
  console.log(meetingInvitations)
  return meetingInvitations;
}

async function getMeetingPendings(state: any): Promise<MeetingPendings[]> {
  console.log(state);
  const meetingPendings: MeetingPendings[] = [];
  
  const querySnapshot = await db
    .collection("meeting")
    .where('confirmedInvitations', 'array-contains', db.collection("user").doc(state.user.uid)).where('invitations', "!=", []).get();
    console.log(querySnapshot)
  querySnapshot.forEach(async (doc) => {
    meetingPendings.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: doc.data().invitations,
      project: doc.data().project.get(),
      projectTitle: await getTaskProject(doc.data().project),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
    })
  })
  console.log(meetingPendings)
  return meetingPendings;
}

async function getMeetingConfirmations(state: any): Promise<MeetingConfirmations[]> {
  console.log(state);
  const meetingConfirmations: MeetingConfirmations[] = [];
  
  const querySnapshot = await db
    .collection("meeting")
    .where('confirmedInvitations', 'array-contains', db.collection("user").doc(state.user.uid)).where('invitations', "==", []).get();
    console.log(querySnapshot)
  querySnapshot.forEach(async (doc) => {
    meetingConfirmations.push({
      id: doc.id,
      title: doc.data().title,
      invited_groupmates: doc.data().invitations,
      project: doc.data().project.get(),
      projectTitle: await getTaskProject(doc.data().project),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      timeLength: doc.data().timeLength,
      venue: doc.data().meetingVenue,
      creator: await getCreator(doc.data().author),
    })
  })
  console.log(meetingConfirmations)
  return meetingConfirmations;
}
    
 