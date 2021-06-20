<template>

  <div style="background-color:#FFF0DF; font-family:DM Sans, sans-serif;">

    <v-row>
      <v-col col="12" md="2">
        <v-navigation-drawer
            absolute
            permanent
            floating
            left
            align="center"
            class="v-navigation-drawer__border"
            style="padding: 18px; font-size:8px; font-weight:bold;
            border-color: white;
            text-align: left; font-color:#4b4b4b;
            display:flex; flex-direction: column; align-items: center; justify-content: center;
            "
        >
          <div style="display: flex; flex-direction: column; height: 100%;">
                <v-img
                    width="10vw"
                    src="@/assets/orbital_logo_latest.png"
                    alt=""
                    style="flex: none; top:20%;"
                ></v-img>
          <br>

          <v-list
              :class="`rounded-xl`"
              rounded
              nav
              style="display:flex; flex-direction: column; margin: auto;"
          >



            <v-list-item
                v-for="item in navItems"
                :key="item.title"
                link :to="item.href"
                color="#ff7200"
                style="display:flex;  justify-content: center; font-size: 12px; margin-top: 4px; margin-bottom: 4px;"
            >

              <v-list-item-icon style="display:flex;justify-content: center; margin:12px;">

                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title style="margin-right:5px; margin-top:5px; margin-bottom:5px;">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-btn color="#ff9d66" depressed large type="submit" v-on:click="signOut">
            <span style="color: #ffffff">Sign Out</span>
          </v-btn>
          </div>
        </v-navigation-drawer>
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>
            <v-container style="padding-bottom:0px;">
              <span style="margin-top: 10px; color:#4b4b4b; font-size: 32px; display:flex; align-items: flex-start;
               font-weight:bold">Todos</span>
            </v-container>
          </div>
          <div>
            <v-container style="padding-top:5px; ">
            <v-card color="#ff9d66" style=" margin-left:auto ; margin-right:auto" :class="`rounded-xl`" class="elevation-0">
              <v-img  style="padding:20px;" height="200px" src="@/assets/todo_dashboard.png">
              <v-card-title style="padding-bottom:0px;">
                <span style="color:white; font-size:28px; font-weight: bold;">Your Overall Todos Progress</span>
              </v-card-title>
              <v-card-content style="color:white; display:flex; font-weight: bold; font-size: 36px; font-family:MuseoModerno, sans-serif;">
                <v-col col="12" md="6" style="padding-bottom:16px; display:flex; justify-content: flex-end">
                <v-progress-circular
                    class="progress-circular v-progress-circular__underlay"
                    :rotate="-90"
                    :size="100"
                    :width="10"
                    :value="(this.totalTaskProgress)*100"
                    color="white"
                >
                  <span style="font-size: 28px;">{{Math.trunc((this.totalTaskProgress)*100) + "%"}}</span>
                </v-progress-circular>
                </v-col>

                <v-col col="12" md="6" style="display:flex; justify-content: center;  flex-direction: column">
                  <span style="display:flex; ">{{totalTaskDone}} / {{totalTask}}</span>
                  <span style="display:flex; font-family: DM Sans, sans-serif;
                  font-size: 18px; font-weight:bold;">Completed</span>
                </v-col>
              </v-card-content>
              </v-img>
            </v-card>
            </v-container>

          </div>

          <div>
            <v-container>
              <v-card outlined color="#FFE4CB" style="padding: 20px;" :class="`rounded-xl`">
                <v-virtual-scroll
                    :items="items"
                    :bench="100"
                    height="61vh"
                    item-height="80"
                >
                  <v-dialog v-model="dialog" persistent content-class="elevation-0" max-width="600px" :class="`rounded-lg`">
                    <template v-slot:activator="{ on, attrs }" :class="`rounded-xl`">
                      <v-card outlined color="white" style="margin-top: 10px;margin-left:16px; margin-right:16px; padding: 8px;" :class="`rounded-xl`">
                        <v-btn
                            :class="`rounded-xl`"
                            color="white"
                            block
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog = true; getProjectMenu();"
                        >
                          <span style="color: #ff9d66; font-weight: bold"> + Add New Todo</span>
                        </v-btn>
                      </v-card>
                    </template>
                    <v-sheet outlined color="#ff9d66" style="padding: 3px;" :class="`rounded-xl`">
                      <v-card outlined :class="`rounded-xl`">
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                          <v-card-title :class="`rounded-xl`">
                            <span class="headline">Add New Todo</span>
                          </v-card-title>

                          <v-card-text>

                            <v-container :class="`rounded-xl`">
                              <v-row>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Todo Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="myTodo"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-select
                                      :items="projects"
                                      label="Module Project*"
                                      required
                                      color="#ff9d66"
                                      v-model="myProject"
                                      :rules="[v => !!v || 'Project is required']"
                                  ></v-select>
                                </v-col>
                                <v-col cols="12" align="left" :class="`rounded-xl`">
                                  <span style="color: rgb(113,113,113)">Person In Charge</span>
                                  <br>

                                  <v-btn
                                      rounded
                                      color="#ff9d66"
                                      outlined
                                      class="my-2 mr-2"
                                  >
                                    Rounded Button
                                  </v-btn>
                                </v-col>

                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-menu
                                      v-model="menuAdd"
                                      :close-on-content-click="false"
                                      :nudge-right="40"
                                      transition="scale-transition"
                                      offset-y
                                      color="#ff9d66"
                                      min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                          v-model="myDeadline"
                                          label="Deadline"
                                          prepend-icon="mdi-calendar"
                                          readonly
                                          hide-details
                                          v-bind="attrs"
                                          v-on="on"
                                          color="#ff9d66"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        color="#ff9d66"
                                        v-model="myDeadline"
                                        @input="menuAdd = false"
                                    ></v-date-picker>
                                  </v-menu>
                                  <v-row style="padding-top:5px;">
                                    <v-col cols="12" md="6" style="display:flex; align-items: center;">
                                      <v-switch

                                          inset
                                          hide-details
                                          v-model="switchValue"
                                          color="#ff9d66"
                                          :label="`Include Time`"
                                      ></v-switch>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                      <v-menu
                                          ref="menu3"
                                          v-model="menu3"
                                          color="#ff9d66"
                                          :close-on-content-click="false"
                                          :nudge-right="40"
                                          :return-value.sync="myDeadlineTime"
                                          transition="scale-transition"
                                          offset-y
                                          max-width="290px"
                                          min-width="290px"
                                      >
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-text-field
                                              :disabled="switchValue == 0"
                                              v-model="myDeadlineTime"
                                              label="Time"
                                              color="#ff9d66"
                                              prepend-icon="mdi-clock-time-four-outline"
                                              readonly
                                              v-bind="attrs"
                                              v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            scrollable
                                            v-if="menu3"
                                            v-model="myDeadlineTime"
                                            full-width
                                            color="#ff9d66"
                                            format="24hr"
                                            @click:minute="$refs.menu3.save(myDeadlineTime)"
                                        ></v-time-picker>

                                      </v-menu>
                                    </v-col>
                                  </v-row>
                                </v-col>

                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-textarea
                                      name="input-7-1"
                                      label="Notes"
                                      rows="2"
                                      color="#ff9d66"
                                      v-model="myNote"
                                  ></v-textarea>
                                </v-col>

                              </v-row>
                            </v-container>
                            <!--                    <small>*indicates required field</small>-->
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn justify="center" color="#ff9d66" text @click="dialog = false; clearInfo()">
                              Cancel
                            </v-btn>
                            <v-btn color="#ff9d66" :disabled="!valid || this.myTodo == '' || this.myProject =='' "
                                   text @click="dialog = false;  checkTimeAdd();">
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-sheet>
                  </v-dialog>
                  <br>


                  <div v-if="this.$store.getters.getTasks">
                    <div v-for="(task,index) in orderedTasks" :key="task.id">
                      <template>
                        <v-list-item style="display: block;">
                          <v-card outlined color="white" style="margin: auto;" :class="`rounded-xl`"
                          >

                            <v-row style="margin:0px;">
                              <v-col cols="12" md="2" align="center" justify="center" class="centerAlign"
                                     style="padding-top: 20px;padding-bottom: 20px;font-weight: bold; font-size: 20px; flex-direction: column">

                                <span style="margin-left:3vw; " v-bind:class="{completed: task.complete}">{{
                                    task.deadline.toLocaleDateString("en-US", {
                                      month: 'short',
                                      day: "2-digit"
                                    })
                                  }}</span>


                                  <span  class="centerAlign" style="margin-left:3vw;font-size: 14px; " v-bind:class="{completed: task.complete}">{{
                                    task.deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  }}</span>




                              </v-col>
                              <v-col cols="12" md="1">
                                <v-divider vertical style="padding-top: 20px;padding-bottom: 20px;" class="leftAlign">
                                </v-divider>
                              </v-col>
                              <v-col cols="12" md="5" align="left" class="leftAlign"
                                     style="padding-top: 20px;padding-bottom: 20px;">


                                <v-row style="margin:0px;">
                                  <span style="font-weight: bold; font-size: 20px;"
                                        v-bind:class="{completed: task.complete}">{{ task.task }}</span>
                                </v-row>
                                <v-row style="margin:0px;">

                                  <span style="font-weight: normal;" v-bind:class="{completed: task.complete}">{{ task.project }}</span>
                                </v-row>
                                <v-row style="margin:0px;">
                                  <span style="font-weight: lighter; font-size: 14px;" v-bind:class="{completed: task.complete}">{{ task.note }}</span>
                                </v-row>

                              </v-col>
                              <v-col col="12" md="1" align="right" class="centerAlign">
                                <v-list-item-action>
                                  <v-dialog v-model="display[task.task]" content-class="elevation-0" persistent max-width="600px"
                                            :class="`rounded-lg`">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                          color="#ff9d66"
                                          v-bind="attrs"
                                          v-on="on"
                                          icon
                                          @click = "fillInfo(task); getProjectMenu();"
                                      >
                                        <v-icon> mdi-pencil-outline</v-icon>

                                      </v-btn>
                                    </template>
                                    <v-sheet outlined color="#ff9d66" style="padding: 3px;" :class="`rounded-xl`">

                                    <v-card outlined :class="`rounded-xl`">
                                      <v-form
                                          ref="form"
                                          v-model="valid"
                                          lazy-validation
                                      >
                                        <v-card-title :class="`rounded-xl`">
                                        <span class="headline">Edit Todo</span>
                                      </v-card-title>

                                      <v-card-text>
                                        <v-container>
                                          <v-row>
                                            <v-col cols="12">
                                              <v-text-field
                                                  label="Todo Title*"
                                                  required
                                                  value="task.task"
                                                  :rules="nameRules"
                                                  v-model="myTodo"
                                                  color="#ff9d66"

                                              ></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                              <v-select
                                                  :items="projects"
                                                  label="Module Project*"
                                                  required
                                                  color="#ff9d66"
                                                  v-model="myProject"
                                                  :rules="[v => !!v || 'Project is required']"
                                              ></v-select>
                                            </v-col>
                                            <v-col cols="12" align="left">
                                              <span style="color: rgb(113,113,113)">Person In Charge</span>
                                              <br>

                                              <v-btn
                                                  rounded
                                                  color="#ff9d66"
                                                  outlined
                                                  class="my-2 mr-2"
                                              >
                                                Rounded Button
                                              </v-btn>
                                            </v-col>

                                            <v-col cols="12">
                                              <v-menu
                                                  v-model="menu[task.task]"
                                                  :close-on-content-click="false"
                                                  :nudge-right="40"
                                                  transition="scale-transition"
                                                  offset-y
                                                  color="#ff9d66"
                                                  min-width="auto"
                                              >
                                                <template v-slot:activator="{ on, attrs }">
                                                  <v-text-field
                                                      v-model="myDeadline"
                                                      label="Deadline"
                                                      prepend-icon="mdi-calendar"
                                                      readonly
                                                      color="#ff9d66"
                                                      hide-details
                                                      v-bind="attrs"
                                                      v-on="on"
                                                  ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                    color="#ff9d66"
                                                    v-model="myDeadline"
                                                    @input="menu[task.task] = false"
                                                ></v-date-picker>
                                              </v-menu>
                                              <v-row style="padding-top:5px;">
                                                <v-col cols="12" md="6" style="display:flex; align-items: center;">
                                                  <v-switch
                                                      inset
                                                      hide-details
                                                      v-model="switchValue"
                                                      color="#ff9d66"
                                                      :label="`Include Time`"
                                                  ></v-switch>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                  <v-menu
                                                      :ref="'timeMenu'+index"
                                                      v-model="time[task.task]"
                                                      :close-on-content-click="false"
                                                      :nudge-right="40"
                                                      :return-value.sync="myDeadlineTime"
                                                      transition="scale-transition"
                                                      offset-y
                                                      style=" z-index:20"
                                                      max-width="290px"
                                                      color="#ff9d66"
                                                      min-width="290px"
                                                  >
                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-text-field
                                                          :disabled="switchValue == 0"
                                                          v-model="myDeadlineTime"
                                                          label="Time"
                                                          prepend-icon="mdi-clock-time-four-outline"
                                                          readonly
                                                          color="#ff9d66"
                                                          v-bind="attrs"
                                                          v-on="on"
                                                      ></v-text-field>
                                                    </template>
                                                    <v-time-picker
                                                        scrollable
                                                        v-model="myDeadlineTime"
                                                        color="#ff9d66"
                                                        full-width
                                                        format="24hr"
                                                        @click:minute="y = 'timeMenu'+index.toString(); a = $refs[y]; a[0].save(myDeadlineTime); time[task.task] = false">
                                                    </v-time-picker>
                                                  </v-menu>
                                                </v-col>
                                              </v-row>
                                            </v-col>
                                            <v-col cols="12" :class="`rounded-xl`">
                                              <v-textarea
                                                  name="input-7-1"
                                                  label="Notes"
                                                  rows="2"
                                                  color="#ff9d66"
                                                  v-model="myNote"
                                              ></v-textarea>
                                            </v-col>

                                          </v-row>
                                        </v-container>
<!--                                        <small>*indicates required field</small>-->
                                      </v-card-text>
                                      <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn color="#ff9d66" text @click="display[task.task] = false; clearInfo();" >
                                          Close
                                        </v-btn>
                                        <v-btn color="#ff9d66" text :disabled="!valid "
                                               @click="display[task.task] = false; checkEdit(task);">

                                          Update
                                        </v-btn>
                                      </v-card-actions>
                                      </v-form>
                                    </v-card>
                                    </v-sheet>

                                  </v-dialog>
                                </v-list-item-action>

                              </v-col>
                              <v-col col="12" md="1" align="left" class="centerAlign">

                                <v-list-item-action>
                                  <v-btn color="#A5A5A5" icon @click="deleteTask(task.id)">
                                    <v-icon> mdi-trash-can-outline
                                    </v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-col>

                              <v-col cols="12" md="2" class="centerAlign" style="background-color: #ff9d66"
                                     :class="`rounded-r-xl`">
                                <v-card outlined color="#ff9d66">
                                  <v-checkbox
                                      class=" centerAlign"
                                      :class="`theme--light`"
                                      color="white"
                                      hide-details
                                      dark
                                      v-model="task.complete"
                                      @click="completeTask(task)"/>
                                </v-card>
                              </v-col>


                            </v-row>

                          </v-card>
                        </v-list-item>
                      </template>


                      <br>


                    </div>
                  </div>
                </v-virtual-scroll>
              </v-card>
            </v-container>

          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import {db} from "../main.ts"
import _ from 'lodash';




export default {
  name: "Todo.vue",
  data: () => ({
    dialog: false,
    nameRules: [
      v => !!v || 'Todo title is required',
    ],
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
    myDeadline2: new Date().toISOString().substr(0, 10),
    menu: [],
    modal: false,
    menu2: false,
    menu3: false,
    menu4: false,
    timeMenu: false,
    value: 0,
    myTodo: "",
    errors: "",
    complete: false,
    myNote: "",
    myProject: "",
    display: {},
    switchValue: false,
    myDeadlineTime: "00:00",
    menuEdit: {},
    valid: true,
    time: [],
    menuAdd: false,
    styleObject: {background: 'red', border: '3px solid green'},
    navItems: [
      {title: 'Secret', href: "./secret", icon: 'dashboard'},
      {title: 'Todo', href: "./todo", icon: 'done'},
      {title: 'Project', href: "./project", icon: 'work'},

    ],
    projects: [],
    input: {
      task: "", // or pre-fill with other default value like `lorem`

    },
  }),

  computed: {
    items() {
      return Array.from({length: 1}, (k, v) => v + 1)
    },
    length() {
      this.$store.getters.getTasks
      return this.$store.state.tasks.length
    },
    orderedTasks: function () {
      return _.orderBy(this.$store.state.tasks, ['complete','deadline'],['asc','asc'])
    },
    remaining(){
      return this.$store.getters.remaining
    },
    totalTask(){
      return this.$store.getters.totalTask
    },
    totalTaskDone(){
      return this.$store.getters.totalTaskDone
    },
    totalTaskProgress(){
      return this.$store.getters.totalTaskProgress
    }
  },
  beforeCreate: function () {
    this.$store.getters.getTasks
  },

  getProjectsForMenu: function () {
    this.$store.getters.getProjects
  },

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = !!user;
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });


  },

  methods: {
    fillInfo(task) {
      this.myTodo = task.task;
      this.myProject = task.project;
      this.myDeadline = task.deadlineDate;
      this.myDeadlineTime = task.deadlineTime;
      this.myNote=task.note;
      this.switchValue = task.switchValue;
    },
    console: function(val){
      console.log(val);
    },
    clearInfo() {
      this.myTodo = "";
      this.myProject = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.myDeadlineTime = "00:00";
      this.myNote= "";
      this.switchValue = false;
    },

    validate () {
      this.$refs.form.validate()
    },

    checkTimeAdd(){
      if (this.switchValue == false) {
        this.myDeadlineTime = "00:00"
      }
      this.addTodo()
    },

    checkEdit(task){
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime)
        this.myDeadlineTime = "00:00"
        console.log(this.myDeadlineTime)
      }
      if (this.myTodo == ""){
        this.myTodo = task.task
      }
      if(this.myProject == ""){
        this.myProject= task.project
      }
      this.editTask(task)
    },

    async getProjectMenu() {
      let data = await this.$store.getters.getProjects
      data = this.$store.state.projects;
      console.log(this.$store.state.projects);
      for (let i = 0; i < data.length; i++) {
        const doc = await data[i];
        console.log(doc);
        this.projects.push(doc.title)

      }
      console.log(this.projects)
    },


    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({name: "Login"});
        this.$store.state.snapshot.unsubscribe()
      } catch (err) {
        console.log(err);
      }
    },
    async addTodo() {
      this.errors = "";
      const projectFound = await db.collection("project").where("title", "==", this.myProject).get();

      if (this.myTodo !== "") {
        console.log(new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00Z"));
        db.collection('todo').add({
          task: this.myTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.complete,
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00")),
          note: this.myNote,
          project: this.myProject,
        }).then((response) => {
          if (response) {
            db.collection('user').doc(this.$store.state.user.uid).update({todo: firebase.firestore.FieldValue.arrayUnion(response)})
                .then((resp) => this.$store.dispatch('getTasks').then(
                    db.collection('project').doc(projectFound.docs[0].id).update({todos: firebase.firestore.FieldValue.arrayUnion(response)})
                    )
                )
                .catch((error) => console.log(error));
            this.myTodo = '';
          }
        }).catch((error) => {
              this.errors = error
            }
        )
      } else {
        this.errors = "Please enter your todo title"
      }
      this.myTodo = ''
      this.myProject = ""
      this.myNote =""
      this.myDeadlineTime = "00:00"
      this.myDeadline= new Date().toISOString().substr(0, 10)
      this.switchValue = false
    },

    deleteTask: function (id) {
      if (id) {
        db.collection("user").doc(this.$store.state.user.uid).update({
          todo: firebase.firestore.FieldValue.arrayRemove(db.collection("todo").doc(id))
        }).then((response) => db.collection("todo").doc(id).delete().then(
            this.$store.dispatch('getTasks'))
            .catch(function (error) {
              this.error = error
            }))
      } else {
        this.error = 'Invalid ID'
      }
    },
    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      })
    },
    editTask: function (task) {
      this.errors = ""
      if (this.myTodo !== "") {
        db.collection("todo").doc(task.id).update({
          task: this.myTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.complete,
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00")),
          note: this.myNote,
          project: this.myProject,
        }).then((response) => {
          if (response) {
            this.myTodo = ''
            this.myProject = ""
          }
        }).catch((error) => {
          this.errors = error
        }).then(
            this.$store.dispatch('getTasks'))
            .catch(function (error) {
              this.error = error
            })
      } else {
        this.errors = "Please enter your todo title"
      }
      this.myTodo = ''
      this.myProject = ""
      this.myNote =""
      this.myDeadlineTime = "00:00"
      this.myDeadline= new Date().toISOString().substr(0, 10)
      this.switchValue = false
    },

  },
};

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

.todo-item {
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  display: flex;
}

.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}

/*.dialogCSS {*/
/* border-radius: 4px;*/
/* margin: 24px;*/
/* overflow-y: auto;*/
/* pointer-events: auto;*/
/* transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);*/
/* width: 100%;*/
/* z-index: inherit;*/
/* !* box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%); *!*/
/*}*/
.elevation-0 div {
  box-shadow: none !important;
}

.checkboxCol {
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centerAlign {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftAlign {
  /*display: flex;*/
  justify-content: flex-start;
  align-items: center;
}

.input-group--disabled.checkbox .input-group__input {
  color: white !important;
  outline: 1px solid #1e5180
}

.completed {
  text-decoration: line-through;
  color: grey;
}

.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
}

.theme--dark {
  color: #ffffff;
}

.theme--light.v-checkbox {
  color: #ffffff;
}

.v-card {
  color: #ff9d66;
}

.progress-circular >>> circle {
  stroke-linecap: round;
}

.v-progress-circular__underlay{
  stroke: rgb(255,255,0);
  z-index:10;
}

.v-navigation-drawer__border{
  background-color: rgba(255,255,255,1);
  border-color: white;
  color:white;
}

.v-list--rounded .v-list-item, .v-list--rounded .v-list-item::before, .v-list--rounded .v-list-item > .v-ripple__container {
  border-radius: 20px !important;
}

.v-navigation-drawer > div{
  display: flex;
  flex-direction: column;
}

.center-me {
  transform: translate(-50%, 0);
}

</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
</style>