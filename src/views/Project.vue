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
                  <v-list-item-title style="font-color:#4b4b4b; margin-right:5px; margin-top:5px; margin-bottom:5px;">
                    {{ item.title }}
                  </v-list-item-title>
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
               font-weight:bold">Project</span>
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
                  <v-dialog v-model="dialog" persistent content-class="elevation-0" max-width="600px"
                            :class="`rounded-lg`">
                    <template v-slot:activator="{ on, attrs }" :class="`rounded-xl`">
                      <v-card outlined color="white"
                              style="margin-top: 10px;margin-left:16px; margin-right:16px; padding: 8px;"
                              :class="`rounded-xl`">
                        <v-btn
                            :class="`rounded-xl`"
                            color="white"
                            block
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog = true; "
                        >
                          <span style="color: #ff9d66; font-weight: bold"> + Add New Project</span>
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
                            <span class="headline">Add New Project</span>
                          </v-card-title>

                          <v-card-text>

                            <v-container :class="`rounded-xl`">
                              <v-row>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Project Title*"
                                      required
                                      :rules="nameRules"
                                      color="#ff9d66"
                                      v-model="title"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" :class="`rounded-xl`">
                                  <v-text-field
                                      label="Module code"
                                      color="#ff9d66"
                                      v-model="modCode"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" align="left">
                                  <span>Groupmates</span>
                                  <div v-if="tempGroupmates.length !==0">
                                    <div v-for="(user,index) in tempGroupmates" :key="user.id">
                                    <v-chip
                                        class="ma-2"
                                        color="#ff9d66"
                                        text-color="white"
                                        :input-value="user.id"
                                        v-if="user.chipValue"
                                        close
                                        @click:close="remove(user,index)"
                                    >
                                      <v-avatar left class="white--text">
                                        <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                        <v-img :src="user.avatar"></v-img>
                                      </v-avatar>
                                      <span>{{ user.name }}</span>
                                    </v-chip>
                                  </div>
                                  </div>
                                  <v-dialog v-model="dialogPerson" persistent max-width="600px">
                                    <template v-slot:activator="{ on, attrs }">

                                      <v-btn
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="dialogPerson = true">
                                        <v-icon>person_add</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-card>
                                      <v-card-actions>
                                        <v-text-field
                                            v-model="search"
                                            @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
                                        </v-text-field>
                                        {{search}}
                                      </v-card-actions>
                                      <v-card-text>
                                        <div v-for="user in this.users" :key="user.id">
                                          {{ user.id }}
                                          {{ user.name }}
                                          {{ user.email }}


                                        </div>
                                      </v-card-text>
                                      <v-card
                                          max-width="450"
                                          class="mx-auto"
                                          outlined
                                      >
                                        <v-list>
                                          <v-list-item-avatar
                                              v-if="searchName">
                                            <v-img :src="searchAvatar"></v-img>
                                          </v-list-item-avatar>
                                          {{ searchName }}
                                          <br>
                                          {{ searchEmail }}
                                          <br>
                                          {{ searchId }}
                                          <v-list-item-action>
                                            <v-btn v-if="searchId" @click="addGroupmates();">
                                              <v-icon>person_add</v-icon>
                                            </v-btn>
                                          </v-list-item-action>
                                        </v-list>
                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn color="blue darken-1" text @click="dialogPerson = false">
                                            Close
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>
                                    </v-card>
                                  </v-dialog>
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

                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn justify="center" color="#ff9d66" text @click="dialog = false; clearInfo()">
                              Cancel
                            </v-btn>
                            <v-btn color="#ff9d66" :disabled="!valid || this.title == '' || this.modCode =='' "
                                   text @click="dialog = false;  checkTimeAdd(); ">
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-sheet>
                  </v-dialog>
                  <br>


                  <div v-if="length">
                    <div v-for="(project,index) in this.$store.state.projects" :key="project.id">
                      <template>
                        <v-list-item style="display: block;">
                          <v-card outlined color="white" style="margin: auto;" :class="`rounded-xl`"
                          >

                            <v-row style="margin:0px;">
                              <v-col cols="12" md="2" align="center" justify="center" class="centerAlign"
                                     style="padding-top: 20px;padding-bottom: 20px;font-weight: bold; font-size: 20px; flex-direction: column">

                                <span style="margin-left:3vw; ">{{
                                    project.deadline.toLocaleDateString("en-US", {
                                      month: 'short',
                                      day: "2-digit"
                                    })
                                  }}</span>


                                <span class="centerAlign" style="margin-left:3vw;font-size: 14px; ">{{
                                    project.deadline.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
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
                                  >{{ project.title }}</span>
                                </v-row>
                                <v-row style="margin:0px;">

                                  <span style="font-weight: normal;">{{ project.modCode }}</span>
                                </v-row>
                                <v-row style="margin:0px;">
                                  <span style="font-weight: lighter; font-size: 14px;">{{ project.groupmatesName }}</span>
                                </v-row>

                              </v-col>
                              <v-col col="12" md="1" align="right" class="centerAlign">
                                <v-list-item-action>
                                  <v-dialog v-model="display[project.title]" content-class="elevation-0" persistent
                                            max-width="600px"
                                            :class="`rounded-lg`">

                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                          color="#ff9d66"
                                          v-bind="attrs"
                                          v-on="on"
                                          icon
                                          @click="fillInfo(project);"
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
                                            <span class="headline">Edit Project</span>
                                          </v-card-title>

                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12">
                                                  <v-text-field
                                                      label="Project Title*"
                                                      required
                                                      value="project.title"
                                                      :rules="nameRules"
                                                      v-model="title"
                                                      color="#ff9d66"

                                                  ></v-text-field>
                                                </v-col>
                                                <v-col cols="12">
                                                  <v-text-field
                                                      label="Module code"
                                                      color="#ff9d66"
                                                      v-model="modCode"
                                                  >
                                                  </v-text-field>
                                                </v-col>
                                                <v-col cols="12" align="left">
                                                  <span>Groupmates</span>
                                                  <div  v-if="tempGroupmates.length !==0">
                                                    <div v-for="(user,index) in tempGroupmates" :key="user.id">
                                                    <v-chip
                                                        class="ma-2"
                                                        color="#ff9d66"
                                                        text-color="white"
                                                        :input-value="user.id"
                                                        v-if="user.chipValue"
                                                        close
                                                        @click:close="remove(user,index)"
                                                    >
                                                      <v-avatar left class="white--text">
                                                        <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                                        <v-img :src="user.avatar"></v-img>
                                                      </v-avatar>
                                                      <span>{{ user.name }}</span>
                                                    </v-chip>
                                                    </div>
                                                  </div>
                                                  <v-dialog v-model="dialogPerson" persistent max-width="600px">
                                                    <template v-slot:activator="{ on, attrs }">

                                                      <v-btn
                                                          v-bind="attrs"
                                                          v-on="on"
                                                          @click="dialogPerson = true">
                                                        <v-icon>person_add</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <v-card>
                                                      <v-card-actions>
                                                        <v-text-field
                                                            v-model="search"
                                                            @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
                                                        </v-text-field>
                                                      </v-card-actions>
                                                      <v-card
                                                          max-width="450"
                                                          class="mx-auto"
                                                          outlined
                                                      >
                                                        <v-list>
                                                          <v-list-item-avatar
                                                              v-if="searchName">
                                                            <v-img :src="searchAvatar"></v-img>
                                                          </v-list-item-avatar>
                                                          {{ searchName }}
                                                          <br>
                                                          {{ searchEmail }}
                                                          <br>
                                                          {{ searchId }}
                                                          <v-list-item-action>
                                                            <v-btn v-if="searchId" @click="addGroupmates();">
                                                              <v-icon>person_add</v-icon>
                                                            </v-btn>
                                                          </v-list-item-action>
                                                        </v-list>
                                                        <v-card-actions>
                                                          <v-spacer></v-spacer>
                                                          <v-btn color="blue darken-1" text
                                                                 @click="dialogPerson = false">
                                                            Close
                                                          </v-btn>
                                                        </v-card-actions>
                                                      </v-card>
                                                    </v-card>
                                                  </v-dialog>
                                                </v-col>

                                                <v-col cols="12">
                                                  <v-menu
                                                      v-model="menu[project.title]"
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
                                                        @input="menu[project.title] = false"
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
                                                          v-model="time[project.title]"
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
                                                            @click:minute="y = 'timeMenu'+index.toString(); a = $refs[y]; a[0].save(myDeadlineTime); time[project.title] = false">
                                                        </v-time-picker>
                                                      </v-menu>
                                                    </v-col>
                                                  </v-row>
                                                </v-col>

                                              </v-row>
                                            </v-container>
                                            <!--                                        <small>*indicates required field</small>-->
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn color="#ff9d66" text
                                                   @click="display[project.title] = false; clearInfo();">
                                              Close
                                            </v-btn>
                                            <v-btn color="#ff9d66" text :disabled="!valid "
                                                   @click="display[project.title] = false; checkEdit(project);">

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
                                  <v-btn color="#A5A5A5" icon @click="deleteProject(project.id)">
                                    <v-icon> mdi-trash-can-outline
                                    </v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-col>

                              <v-col cols="12" md="2" class="centerAlign" style="background-color: #ff9d66"
                                     :class="`rounded-r-xl`">

                              </v-col>


                            </v-row>

                          </v-card>
                        </v-list-item>
                      </template>


                      <br>


                    </div>
                  </div>
<!--                  <div v-else>-->
<!--                    You have no project.-->
<!--                  </div>-->
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

export default {
  name: "Project.vue",
  data: () => ({
    dialog: false,
    dialogPerson: false,
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
    myDeadline2: new Date().toISOString().substr(0, 10),
    title: "",
    menu: false,
    modal: false,
    switchValue: false,
    menu2: false,
    menu3: false,
    menu4: false,
    value: 0,
    passingFinalGroupmates: [],
    modCode: "",
    errors: "",
    nameRules: [
      v => !!v || 'Project title is required',
    ],
    valid: true,
    display: {},
    menuEdit: {},
    myDeadlineTime: "00:00",
    search: "",
    users: [],
    usersNew: [],
    searchName: "",
    searchEmail: "",
    searchId: "",
    tempGroupmates: [],
    finalGroupmates: [],
    time: [],
    menuAdd: false,
    tempUser: null,
    chips: [],
    searchAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',

    navItems: [
      {title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline'},
      {title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline'},
      {title: 'Project', href: "./project", icon: 'mdi-account-group-outline'},

    ],
  }),

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.loggedIn = !!user;
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
    // this.$store.dispatch('getProjects');
  },

  mounted(){
    console.log("hello")
      this.$store.dispatch('getProjects');

  },
  computed: {
    items() {
      return Array.from({length: 1}, (k, v) => v + 1)
    },
    length() {
      return this.$store.state.projects.length
    },
  },

  // beforeMount(){
  //   this.$store.getters.getProjects
  // },


  methods: {
    checkEdit(project) {
      if (this.switchValue == false) {
        console.log(this.myDeadlineTime)
        this.myDeadlineTime = "00:00"
        console.log(this.myDeadlineTime)
      }
      if (this.title == "") {
        this.title = project.title
      }
      if (this.modCode == "") {
        this.modCode = project.modCode
      }
      this.editProject(project)
    },

    fillInfo(project) {
      this.title = project.title;
      this.modCode = project.modCode;
      this.myDeadline = project.deadlineDate;
      this.myDeadlineTime = project.deadlineTime;
      this.switchValue = project.switchValue;
    },
    async checkTimeAdd() {
      if (this.switchValue == false) {
        this.myDeadlineTime = "00:00"
      }
      await this.passGroupmates();
      this.addProject();
    },
    clearInfo() {
      this.title = "";
      this.modCode = "";
      this.myDeadline = new Date().toISOString().substr(0, 10);
      this.finalGroupmates = [];
      this.myDeadlineTime = "00:00";
      this.switchValue = false;
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
    async addProject() {
      this.errors = ""

      if (this.title !== "") {
        const response = await db.collection('project').add({
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          title: this.title,
          todos: [],
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          groupmates: [],
          deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00")),
          modCode: this.modCode,
        }).catch((error) => console.log(error));
        console.log(response)
        if (response) {
          console.log(response);
          await this.addGroupmatesToProject(response);
          await this.addForGroupmates(response);
          await db.collection('user').doc(this.$store.state.user.uid)
                  .update({project: firebase.firestore.FieldValue.arrayUnion(response)})
          await this.$store.dispatch('getProjects')
        }
      }
      this.title = ''
      this.modCode = ""
      this.myDeadlineTime = "00:00"
      this.myDeadline = new Date().toISOString().substr(0, 10)
      this.switchValue = false
      this.finalGroupmates = []
      this.tempGroupmates = []
    },

    deleteProject: function (id) {
      if (id) {
        db.collection("user").doc(this.$store.state.user.uid).update({
          project: firebase.firestore.FieldValue.arrayRemove(db.collection("project").doc(id))
        }).then((response) => db.collection("project").doc(id).delete().then(
            this.$store.dispatch('getProjects'))
            .catch(function (error) {
              this.error = error
            }))
      } else {
        this.error = 'Invalid ID'
      }
    },

    editProject: function (project) {
      this.errors = ""
      if (this.title !== "") {
        db.collection("project").doc(project.id).update({
          title: this.title,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          deadlineTime: this.myDeadlineTime,
          deadlineDate: this.myDeadline,
          switchValue: this.switchValue,
          groupmates: this.finalGroupmates,
          deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline + "T" + (this.myDeadlineTime) + ":00+08:00")),
        }).then((response) => {
          if (response) {
            this.title = ''
          }
        }).catch((error) => {
          this.errors = error
        }).then(
            this.$store.dispatch('getProjects'))
            .catch(function (error) {
              this.error = error
            })
      } else {
        this.errors = "Please enter your todo title"
      }
      this.title = ''
      this.modCode = ""
      this.myDeadlineTime = "00:00"
      this.myDeadline = new Date().toISOString().substr(0, 10)
      this.switchValue = false
      this.finalGroupmates = []
    },

    async getMatchedUserbyEmail() {
      console.log("getMatchedUserbyEmail")
      db.collection("user").where("email", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id


              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },
    async getMatchedUserbyName() {
      console.log("getMatchedUserbyName")
      db.collection("user").where("name", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id

              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },


    async addGroupmates() {
      db.collection("user").where("email", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(this.tempGroupmates)
              this.tempGroupmates.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                chipValue: true,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.tempGroupmates)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

      db.collection("user").where("name", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(this.tempGroupmates)
              this.tempGroupmates.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                chipValue: true,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.tempGroupmates)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },

    async addForGroupmates(response) {
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        console.log(this.finalGroupmates[i])
        db.collection('user').doc(this.finalGroupmates[i])
            .update({project: firebase.firestore.FieldValue.arrayUnion(response)})
      }
      console.log("check")
    },

    async passGroupmates(response) {
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          console.log(this.tempGroupmates[i].id)
          this.finalGroupmates.push(this.tempGroupmates[i].id);
        }
      }
      console.log(this.tempGroupmates)
      console.log(this.finalGroupmates)
      this.searchId = ""
      this.searchEmail = ""
      this.searchName = ""
      this.search=""
      this.tempGroupmates = []
    },

    async addGroupmatesToProject(response){
      console.log(response);
      for (let i = 0; i < this.finalGroupmates.length; i++) {
        db.collection('project').doc(response.id)
            .update({groupmates: firebase.firestore.FieldValue
                  .arrayUnion(db.collection('user').doc(this.finalGroupmates[i]))})
      }
    },

    async remove(user, index) {
      this.chips.splice(this.chips.indexOf(user), 1)
      this.chips = [...this.chips]
      this.$delete(this.tempGroupmates, index)
      this.tempGroupmates.push({
        id: user.id,
        name: user.name,
        email: user.email,
        object: user.doc,
        chipValue: false,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
      });
      console.log(this.tempGroupmates)
    },

    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if (this.search.length === 0 || this.search != this.searchName) {
        this.searchName = "";
        this.searchId = "";
        this.searchEmail = "";
      }
    },
  },
};
</script>

<style lang="scss">
.todo-item {
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  //display:flex;
}

.remove-item {
  cursor: pointer;
  margin-left: 14px;

  &:hover {
    color: black;
  }
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

.v-card {
  border-left: 5px solid red;
  color: orange;
}
</style>