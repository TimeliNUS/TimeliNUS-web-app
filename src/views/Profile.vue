<template>
  <div style="background-color: #fff0df; font-family: DM Sans, sans-serif">
    <v-row>
      <v-col col="12" md="2">
        <v-navigation-drawer
          absolute
          permanent
          floating
          left
          align="center"
          class="v-navigation-drawer__border"
          style="
            padding: 18px;
            font-size: 8px;
            font-weight: bold;
            border-color: white;
            text-align: left;
            font-color: #4b4b4b;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <div style="display: flex; flex-direction: column; height: 100%">
            <v-img
              width="10vw"
              src="@/assets/orbital_logo_latest.png"
              alt=""
              style="flex: none; top: 20%"
            ></v-img>
            <br />

            <v-list
              :class="`rounded-xl`"
              rounded
              nav
              style="display: flex; flex-direction: column; margin: auto"
            >
              <v-list-item
                v-for="item in navItems"
                :key="item.title"
                link
                :to="item.href"
                color="#ff7200"
                style="
                  display: flex;
                  justify-content: center;
                  font-size: 12px;
                  margin-top: 4px;
                  margin-bottom: 4px;
                "
              >
                <v-list-item-icon
                  style="display: flex; justify-content: center; margin: 12px"
                >
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    style="
                      font-color: #4b4b4b;
                      margin-right: 5px;
                      margin-top: 5px;
                      margin-bottom: 5px;
                    "
                    >{{ item.title }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn
              color="#ff9d66"
              depressed
              large
              type="submit"
              v-on:click="signOut"
            >
              <span style="color: #ffffff">Sign Out</span>
            </v-btn>
          </div>
        </v-navigation-drawer>
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>
            
            <v-container style="padding-bottom: 0px">
              <span
                style="
                  margin-top: 10px;
                  color: #4b4b4b;
                  font-size: 32px;
                  display: flex;
                  align-items: flex-start;
                  font-weight: bold;
                "
                >Profile</span
              >
            </v-container>
          </div>
          <v-card> </v-card>

          <div></div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../main.ts";
import _ from "lodash";
import { extend } from "@syncfusion/ej2-base";
import { blockData } from "../services/dataSource";
import {
  SchedulePlugin,
  Day,
  TimelineViews,
  TimelineMonth,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-vue-schedule";

export default {
  name: "Profile.vue",
  //  resourceHeaderVue: Vue.component("resource-headerTemplate", {
  //     template: '<div className="template-wrap"><div class="employee-category"><div><img class="employee-image" :src="getImage" :alt="getImage"/></div><div class="employee-name">' +
  //               '{{getEmployeeName(data)}}</div><div class="employee-designation">{{getEmployeeDesignation(data)}}</div></div></div>',
  //     data() {
  //         return {
  //             data: {}
  //         };
  //     },
  //     computed: {
  //         getImage: function() {
  //             return './source/schedule/images/' + this.getEmployeeName(this.data).toLowerCase() + '.png';
  //         }
  //     },
  //     methods: {
  //         getEmployeeName: function (data) {
  //             let value = JSON.parse(JSON.stringify(data));
  //             return (value.resourceData) ? value.resourceData[value.resource.textField] : value.resourceName;
  //         },
  //         getEmployeeDesignation: function (data) {
  //             let value = JSON.parse(JSON.stringify(data));
  //             return value.resourceData.Designation;
  //         }
  //     }
  // }),
  data: () => ({
    eventSettings: {
      dataSource: extend([], blockData, null, true),
    },
    selectedDate: new Date(2018, 7, 1),
    currentView: "TimelineDay",
    cssClass: "block-events",
    group: {
      enableCompactView: false,
      resources: ["Employee"],
    },
    employeeDataSource: [
      {
        Text: "Alice",
        Id: 1,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Content writer",
      },
      {
        Text: "Nancy",
        Id: 2,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Designer",
      },
      {
        Text: "Robert",
        Id: 3,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Software Engineer",
      },
      {
        Text: "Robson",
        Id: 4,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Support Engineer",
      },
      {
        Text: "Laura",
        Id: 5,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Human Resource",
      },
      {
        Text: "Margaret",
        Id: 6,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Content Analyst",
      },
    ],
    // resourceHeaderTemplate: function (e) {
    //     return { template: resourceHeaderVue }
    // },
    dialog: false,
    nameRules: [(v) => !!v || "Todo title is required"],
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
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
    myProject: null,
    display: {},
    switchValue: false,
    myDeadlineTime: "00:00",
    displayDeadline: "Deadline",
    finalDeadline: new Date().toISOString().substr(0, 10),
    menuEdit: {},
    valid: true,
    time: [],
    menuAdd: false,
    dateSwitchValue: false,
    tempGroupmates: [],
    navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "groups" },
      { title: "Profile", href: "./profile", icon: "groups" },
    ],
    projects: [],
    input: {
      task: "", // or pre-fill with other default value like `lorem`
    },
    groupmatesChips: [],
    oldGroupmatesChips: [],
    varPIC: [],
    varPICId: [],
    groupmatesChipsId: [],
    today: "2021-07-05",
    events: [
      {
        name: "Weekly Meeting",
        start: "2021-07-05 09:00",
        end: "2021-07-05 10:00",
      },
      {
        name: `Thomas' Birthday`,
        start: "2021-07-05",
      },
      {
        name: "Mash Potatoes",
        start: "2021-07-05 12:30",
        end: "2021-07-05 15:30",
      },
    ],
    tracked: {
      "2021-07-04": [23, 45, 10],
      "2021-07-05": [10],
      "2021-07-06": [0, 78, 5],
      "2021-07-07": [0, 0, 50],
      "2021-07-08": [0, 10, 23],
      "2021-07-09": [2, 90],
      "2021-07-10": [10, 32],
    },
    colors: ["#1867c0", "#fb8c00", "#000000"],
    category: ["Development", "Meetings", "Slacking"],
  }),

  computed: {
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1);
    },
    length() {
      return this.$store.state.tasks.length;
    },
    orderedTasks: function () {
      return _.orderBy(
        this.$store.state.tasks,
        ["complete", "deadline"],
        ["asc", "asc"]
      );
    },

    remaining() {
      return this.$store.getters.remaining;
    },
    totalTask() {
      return this.$store.getters.totalTask;
    },
    totalTaskDone() {
      return this.$store.getters.totalTaskDone;
    },
    totalTaskProgress() {
      const progress = this.$store.getters.totalTaskProgress;
      console.log(progress);
      if (progress == null || progress == undefined || isNaN(progress)) {
        return 0;
      } else {
        return progress;
      }
    },
  },

  provide: {
    schedule: [Day, TimelineViews, TimelineMonth, Resize, DragAndDrop],
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
    // this.$store.dispatch('getTasks');
  },

  mounted() {
    // this.$store.dispatch("getTasks");
  },

  methods: {
    remove(item) {
      this.groupmatesChips.splice(this.groupmatesChips.indexOf(item), 1);
      this.groupmatesChips = [...this.groupmatesChips];
      console.log(this.groupmatesChips);
    },

    async fillInfo(task) {
      this.myTodo = task.task;
      this.myProject = task.project.id;
      this.oldMyProject = task.project.id;
      this.myDeadline = task.deadlineDate;
      this.myDeadlineTime = task.deadlineTime;
      this.myNote = task.note;
      this.complete = task.complete;
      this.switchValue = task.switchValue;
      this.finalDeadline = task.deadline;
      this.dateSwitchValue = task.dateSwitchValue;
      this.displayDeadline = task.displayDeadline;
      this.groupmatesChips = await this.getPIC(task.PIC);
      this.oldGroupmatesChipsObject = await this.getPIC(task.PIC);
      this.oldGroupmatesChips = await this.getPICId(task.PIC);
      console.log(this.oldGroupmatesChips);
      console.log(this.complete);
    },

    async getPIC(PIC) {
      console.log(PIC);
      this.varPIC = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();
        this.varPIC.push({
          id: docRef.id,
          name: docRef.get("name"),
          object: docRef,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }
      console.log(this.varPIC);
      return this.varPIC;
    },

    async getPICId(PIC) {
      this.varPICId = [];
      for (let i = 0; i < PIC.length; i++) {
        const docRef = await PIC[i].get();

        this.varPICId.push(docRef.id);
      }

      return this.varPICId;
    },

    clearInfo() {
      this.myTodo = "";
      this.myProject = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.myDeadlineTime = "00:00";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.myNote = "";
      this.switchValue = false;
      this.displayDeadline = "Deadline";
      this.dateSwitchValue = false;
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
      this.oldGroupmatesChips = [];
    },

    validate() {
      this.$refs.form.validate();
    },

    checkTimeAdd() {
      if (this.switchValue == false) {
        this.myDeadlineTime = "00:00";
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null;
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00+08:00")
        );
      }

      console.log(this.myProject);
      console.log(this.finalDeadline);
      console.log(this.displayDeadline);
      this.addTodo();
    },

    checkEdit(task) {
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime);
        this.myDeadlineTime = "00:00";
        console.log(this.myDeadlineTime);
      }
      if (this.displayDeadline == "Someday") {
        this.finalDeadline = null;
      } else {
        this.finalDeadline = firebase.firestore.Timestamp.fromDate(
          new Date(this.myDeadline + "T" + this.myDeadlineTime + ":00+08:00")
        );
      }
      this.editTask(task);
    },

    async getProjectMenu() {
      let data = await this.$store.getters.getProjects;
      data = this.$store.state.projects;
      console.log(this.$store.state.projects);
      for (let i = 0; i < data.length; i++) {
        const doc = await data[i];
        console.log(doc);
        this.projects.push({
          title: doc.title,
          id: doc.id,
        });
      }
      console.log(this.projects);
    },

    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({ name: "Login" });
        this.$store.state.snapshot.unsubscribe();
      } catch (err) {
        console.log(err);
      }
    },
    async addTodo() {
      this.errors = "";
      console.log(this.myProject);

      const response = await db.collection("todo").add({
        task: this.myTodo,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        complete: this.complete,
        deadlineTime: this.myDeadlineTime,
        deadlineDate: this.myDeadline,
        switchValue: this.switchValue,
        dateSwitchValue: this.dateSwitchValue,
        // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
        deadline: this.finalDeadline,
        displayDeadline: this.displayDeadline,
        PIC: [],
        note: this.myNote,
        project: db.collection("project").doc(this.myProject),
      });
      await this.addFinalPIC(response);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({ todo: firebase.firestore.FieldValue.arrayUnion(response) });

      await db
        .collection("project")
        .doc(this.myProject)
        .update({ todos: firebase.firestore.FieldValue.arrayUnion(response) })
        .catch((error) => console.log(error));

      await this.$store.dispatch("getProjects");
      await this.$store.dispatch("getTasks");

      this.myTodo = "";
      this.myProject = "";
      this.myNote = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.groupmatesChips = [];
      this.clearInfo();
    },

    async deleteTask(task) {
      console.log(this.$store.state.user.uid);
      console.log(task.id);
      console.log(task.project.id);
      await db
        .collection("user")
        .doc(this.$store.state.user.uid)
        .update({
          todo: firebase.firestore.FieldValue.arrayRemove(
            db.collection("todo").doc(task.id)
          ),
        });
      await db
        .collection("project")
        .doc(task.project.id)
        .update({
          todos: firebase.firestore.FieldValue.arrayRemove(
            db.collection("todo").doc(task.id)
          ),
        });
      await db.collection("todo").doc(task.id).delete();
      await this.$store.dispatch("getTasks");
    },

    completeTask: function (task) {
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      });
    },

    async editTask(task) {
      console.log(task.id);
      console.log(this.dateSwitchValue);
      const response = await db
        .collection("todo")
        .doc(task.id)
        .update({
          task: this.myTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.complete,
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          dateSwitchValue: this.dateSwitchValue,
          // deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          deadline: this.finalDeadline,
          displayDeadline: this.displayDeadline,
          note: this.myNote,
          project: db.collection("project").doc(this.myProject),
          PIC: [],
        });
      await this.addFinalPIC(task);
      if (this.oldMyProject !== this.myProject) {
        await db
          .collection("project")
          .doc(this.myProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayUnion(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
        await db
          .collection("project")
          .doc(this.oldMyProject)
          .update({
            todos: firebase.firestore.FieldValue.arrayRemove(
              db.collection("todo").doc(task.id)
            ),
          })
          .catch((error) => console.log(error));
      }

      this.$store.dispatch("getTasks");
      this.myTodo = "";
      this.myProject = "";
      this.myNote = "";
      this.myDeadlineTime = "00:00";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.switchValue = false;
      this.dateSwitchValue = false;
      this.displayDeadline = "Deadline";
      this.finalDeadline = new Date().toISOString().substr(0, 10);
      this.groupmatesChips = [];
      this.varPIC = [];
      this.varPICId = [];
    },

    changeDisplayDeadline() {
      if (this.dateSwitchValue == 1) {
        this.displayDeadline = "Someday";
        this.switchValue = false;
        this.myDeadlineTime = "00:00";
      } else {
        this.displayDeadline = this.myDeadline;
      }
    },

    async renderGroupmates() {
      this.tempGroupmates = [];
      this.groupmatesChips = [];
      const docRef = await db.collection("project").doc(this.myProject).get();
      const data = await docRef.get("groupmates");
      for (let i = 0; i < data.length; i++) {
        const currGroupmate = await data[i].get();
        this.tempGroupmates.push({
          id: currGroupmate.id,
          name: currGroupmate.get("name"),
          object: currGroupmate,
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        });
      }

      console.log(this.tempGroupmates);
      console.log(this.$store.state.user);
    },

    async addFinalPIC(task) {
      if (this.groupmatesChips.length == 0) {
        this.groupmatesChips = this.oldGroupmatesChipsObject;
      }
      this.groupmatesChipsId = [];
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        this.groupmatesChipsId.push(this.groupmatesChips[i].id);
      }
      console.log(this.groupmatesChipsId);

      for (let i = 0; i < this.groupmatesChipsId.length; i++) {
        if (this.oldGroupmatesChips.includes(this.groupmatesChipsId[i])) {
          console.log("groupmate has already in charge the todo");
        } else {
          db.collection("user")
            .doc(this.groupmatesChipsId[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayUnion(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.oldGroupmatesChips.length; i++) {
        if (this.groupmatesChipsId.includes(this.oldGroupmatesChips[i])) {
          console.log("this groupmate is still in charge of the todo");
        } else {
          console.log(this.oldGroupmatesChips[i]);
          db.collection("user")
            .doc(this.oldGroupmatesChips[i])
            .update({
              todo: firebase.firestore.FieldValue.arrayRemove(
                db.collection("todo").doc(task.id)
              ),
            });
        }
      }
      for (let i = 0; i < this.groupmatesChips.length; i++) {
        db.collection("todo")
          .doc(task.id)
          .update({
            PIC: firebase.firestore.FieldValue.arrayUnion(
              db.collection("user").doc(this.groupmatesChips[i].id)
            ),
          });
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");

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
  outline: 1px solid #1e5180;
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
  border: none;
}

.progress-circular >>> circle {
  stroke-linecap: round;
}

.v-navigation-drawer__border {
  background-color: rgba(255, 255, 255, 1);
  border-color: white;
  color: white;
}

.v-list--rounded .v-list-item,
.v-list--rounded .v-list-item::before,
.v-list--rounded .v-list-item > .v-ripple__container {
  border-radius: 20px !important;
}

.v-navigation-drawer > div {
  display: flex;
  flex-direction: column;
}

.center-me {
  transform: translate(-50%, 0);
}

.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}

@-moz-document url-prefix() {
  .dx-scheduler-work-space-month .dx-scheduler-date-table-cell {
    position: relative;
  }

  .dx-scheduler-work-space-month .dx-scheduler-date-table-cell .disable-date {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.disable-date,
.dinner {
  height: 100%;
  width: 100%;
}

.disable-date {
  background-image: repeating-linear-gradient(
    135deg,
    rgba(244, 67, 54, 0.1),
    rgba(244, 67, 54, 0.1) 4px,
    transparent 4px,
    transparent 9px
  );
  color: #9b6467;
}

.dx-scheduler-header-panel-cell .disable-date {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dinner {
  background: rgba(255, 193, 7, 0.2);
}

.dx-scheduler-time-panel-cell .dinner {
  color: rgba(255, 193, 7);
  font-weight: 400;
  background: transparent;
}

.dx-draggable {
  cursor: auto;
}

td.dx-scheduler-time-panel-cell .dinner .cafe {
  height: 200%;
  width: 100%;
  left: 50%;
  /* -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>');
    -webkit-mask-repeat: no-repeat; */
  -webkit-mask-position-y: 50%;
  -webkit-mask-position-x: 100%;
  margin-top: -4px;
  background-color: #ffc107;
}

.dx-scheduler-date-table-cell {
  padding: 0;
  opacity: 1;
}

.schedule-vue-sample .block-events.e-schedule .template-wrap {
  width: 100%;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-vertical-view
  .e-resource-cells {
  height: 58px;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-timeline-view
  .e-resource-left-td,
.schedule-vue-sample
  .block-events.e-schedule
  .e-timeline-month-view
  .e-resource-left-td {
  width: 170px;
}

.schedule-vue-sample
  .block-events.e-schedule
  .e-resource-cells.e-child-node
  .employee-category,
.schedule-vue-sample
  .block-events.e-schedule
  .e-resource-cells.e-child-node
  .employee-name {
  padding: 5px;
}

.schedule-vue-sample .block-events.e-schedule .employee-image {
  width: 45px;
  height: 40px;
  float: left;
  border-radius: 50%;
  margin-right: 10px;
}

.schedule-vue-sample .block-events.e-schedule .employee-name {
  font-size: 13px;
}

.schedule-vue-sample .block-events.e-schedule .employee-designation {
  font-size: 10px;
}

@media all and (-ms-high-contrast: none) {
  td.dx-scheduler-time-panel-cell .dinner .cafe {
    background-color: transparent;
  }
}
</style>
<style lang="sass">
@import './src/sass/variables.sass'

$progress-circular-underlay-stroke: #FFD5A5 !default
</style>
