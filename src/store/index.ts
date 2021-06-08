import { Task } from "@/models/task.model";
import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";
import {db} from "../main"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [] as Task[]
  },
  getters:{
    getTasks: state=> {
      return state.tasks
    }
  },
  mutations: {
    setItems: state => {
      db.collection('todo').orderBy('created_at').onSnapshot((snapshot) => {
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
          })
        })
        state.tasks = tasks
      })
    }
  },
  actions: {
    setItems: context => {
      context.commit('setItems')
    }
  },
  modules: {},
});
