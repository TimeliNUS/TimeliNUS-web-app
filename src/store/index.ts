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
            deadline: doc.data().deadline,
            deadlineDate: doc.data().deadlineDate,
            deadlineTime: doc.data().deadlineTime,
            switchValue: doc.data().switchValue,
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
      deadline: doc.data().deadline.toDate(),
      deadlineDate: doc.data().deadlineDate,
      deadlineTime: doc.data().deadlineTime,
      switchValue: doc.data().switchValue,

    })
  }
  console.log(tasks);
  return tasks;
}

async function getProjects(state: any): Promise<Project[]>{
  const documentSnapshot = await db.collection('user').doc(state.user.uid).get();
  const data = await documentSnapshot.get('project');
  const projects:Project[] = [];
  console.log(data);
  console.log(state.user.uid);
  for(let i = 0; i < data.length; i++){
    const doc = await data[i].get();
    projects.push({
      id: doc.id,
      meetings: doc.data().meetings,
      todos: doc.data().todos ?? "",
      _createdAt: doc.data().dateTime,
      title: doc.data().title,
      deadline: doc.data().deadline,
      progress: doc.data().progess,
      modCode: doc.data().modCode,
    })
  }
  console.log(projects);
  return projects;
}

