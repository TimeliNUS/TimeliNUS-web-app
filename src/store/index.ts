import { Task } from "@/models/task.model";
import { Project } from "@/models/task.model";
import { User } from "@/models/task.model";
import Vue from "vue";
import Vuex from "vuex";


import { vuexfireMutations } from "vuexfire";
import {db} from "../main"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [] as Task[],
    projects: [] as Project[],
    user: {} as User,
    snapshot: {},
    allUser: [] as User[],
  },
  getters:{
    remaining(state) {
      return state.tasks.filter(task => !task.complete).length
    },
    totalTask(state) {
      return state.tasks.length
    },
    totalTaskDone(state){
      return state.tasks.length - state.tasks.filter(task => !task.complete).length
    },
    totalTaskProgress(state){
      return (state.tasks.length - state.tasks.filter(task => !task.complete).length) / state.tasks.length
    },

    getTasks: async (state) => {
      state.tasks = await getTasks(state);
    },

    getUser: state => {
      return state.user
    },

    getProjects: async (state) => {
      state.projects = await getProjects(state);
    },
  },
  mutations: {
    setItems: state => {
      state.snapshot = db.collection('todo').orderBy('created_at').onSnapshot((snapshot) => {
        const tasks:Task[] = []
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
          })
        })
        state.tasks = tasks
      })
    },

    setUser: (state, {user}) => {
      state.user = user;
      console.log("state user : " + JSON.stringify(state.user));
    },

    getTasks: (state, {tasks}) => {
      state.tasks = tasks;
      console.log(state.tasks);
    },

    getProjects: (state, {projects}) => {
      state.projects = projects;
      console.log(state.projects);
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
    setItems: context => {
      context.commit('setItems')
    },


    getTasks: async (context, payload) => {
      console.log('start');
      const tasks = await getTasks(context.state);
      console.log(tasks);
      context.commit('getTasks', {tasks})
    },

    getProjects: async (context, payload) => {
      console.log('start');
      const projects = await getProjects(context.state);
      console.log(projects);
      context.commit('getProjects', {projects})
    },

    setUser: (context, user)  => {
      context.commit('setUser', {user})
    }
  },
  modules: {},
});

async function getTasks(state: any): Promise<Task[]>{
  const documentSnapshot = await db.collection('user').doc(state.user.uid).get();
  console.log(documentSnapshot);
  const data = await documentSnapshot.get('todo');
  const tasks:Task[] = [];
  console.log(data);
  console.log(state.user.uid);
  for(let i = 0; i < data.length; i++){
    const doc = await data[i].get();
    tasks.push({
      id: doc.id,
      task: doc.data().task ?? "",
      complete: doc.data().complete,
      _createdAt: doc.data().dateTime,
      note: doc.data().note,
      project: doc.data().project,
      projectTitle: await getTaskProject(doc.data().project),
      deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
      deadlineDate: doc.data().deadlineDate ,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,
      dateSwitchValue: doc.data().dateSwitchValue,
      displayDeadline: doc.data().displayDeadline,
      PIC: doc.data().PIC,

    })
  }
  console.log(tasks);
  return tasks;
}

async function getTaskProject(project: any){
  const docRef = await db.collection('project').doc(project.id).get()
  console.log(docRef)
  console.log(await docRef.get('title'))
  return await docRef.get('title')

}

async function getProjects(state: any): Promise<Project[]>{
  console.log(state);
  const documentSnapshot = await db.collection('user').doc(state.user.uid).get();
  console.log(documentSnapshot.exists)
  const data = await documentSnapshot.get('project');
  const projects:Project[] = [];
  console.log(data);
  console.log(state.user.uid);
  for(let i = 0; i < data.length; i++){
    const doc = await data[i].get();
    projects.push({
      id: doc.id,
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

    })
  }
  console.log(projects);
  return projects;
}

async function getGroupmatesName(groupmates: any){
  const groupmatesNameArray:string[] = [];
  for(let i = 0; i < groupmates.length; i++){
    const docRef = await db.collection('user').doc(groupmates[i].id).get();
    groupmatesNameArray.push(docRef.get('name'))
  }
  return groupmatesNameArray

}

async function getProjectProgress(todos: any){
  let counterCompleted = 0
  let counterIncompleted = 0
    if (todos == null || todos.length == 0){
      return 0
    } else {
      for (let i = 0; i < todos.length; i++) {
        const docRef = await db.collection('todo').doc(todos[i].id).get()
        console.log(docRef.get('complete'))
        if (docRef.get('complete') == false ){
          counterIncompleted += 1
        } else {
          counterCompleted += 1
        }
      }
      console.log(counterCompleted)
      console.log(counterIncompleted)
      return counterCompleted / (counterIncompleted + counterCompleted)

    }
}