<template>
  <div style="background-color: #fff0df; font-family: DM Sans, sans-serif; min-height: 100vh">
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
                >Welcome! {{this.$store.state.user.displayName}}</span
              >
            </v-container>
            <v-row>
              <v-col col="12" md="8">
            <v-container
                  style="margin-right: auto; margin-left: auto; display: flex; justify-content: center"
                  
                  
                >
                  <v-card
                    max-width="51vw"
                    min-width="51vw"
                    
                    outlined
                    color="#FFE4CB"
                    style="padding: 14px; display: flex; flex-direction: column"
                    :class="`rounded-xl`"
                  >
                    <div
                      style="padding: 8px; display: flex; flex-direction: row; justify-content: space-between"
                    >
                    <span
                        style="
                          margin-top: 10px;
                          margin-left: 3vw;
                          color: #4b4b4b;
                          font-size: 20px;
                          display: flex;
                          align-items: flex-start;
                          font-weight: bold;
                        "
                        >Projects</span
                      >
                      <v-btn align="right" outlined 
                            style="
                          margin-top: 10px;
                          color: #4b4b4b;
                          font-size: 16px;
                          display: flex;
                          align-items: center;
                          font-weight: bold;
                          margin-right: 3vw;

                        "
                       >
                        View All
                      </v-btn>
                    </div>
                    <div
                      v-if="projectLength"
                      style="display: flex; flex-direction: row"
                    >
                      <v-sheet
                        :class="`rounded-xl`"
                        class="mx-auto"
                        elevation="0"
                        max-width="50vw"
                        style="background-color: #ffe4cb"
                      >
                        <v-slide-group
                          v-model="projectSlide"
                       
                          active-class="success"
                          show-arrows
                        >
                          <v-slide-item
                            v-for="(project) in this.$store.state.projects"
                            :key="project.id"
                            v-slot="{ active }"
                          >
                            <v-card
                              :class="`rounded-xl`"
                              :color="active ? undefined : 'white'"
                              class="ma-2"
                              height="200"
                              width="250"
                              outlined
                              
                              style="padding: 10px; padding-left:14px;"
                            >
                              <v-row style="padding: 5px">
                                <v-col
                                  col="12"
                                  md="12"
                                  style="display: flex; flex-direction: column"
                                >
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding-bottom: 0px !important;
                                      padding-top: 3px !important;
                                      padding-left: 3px !important;
                                      padding-right: 3px !important;
                                    "
                                  >
                                    {{ project.modCode }}
                                  </v-card-text>
                                  <v-card-title
                                    style="display:flex; padding-top: 0px !important; padding-bottom :3px !important;
                                 padding-left :3px !important; padding-right :3px !important; font-size:15px; !important"
                                  >
                                    {{ project.title }}
                                  </v-card-title>
                                  <v-card-text
                                    style="
                                      display: flex;
                                      padding: 2px !important;
                                    "
                                  >
                                    <div v-if="project.deadline !== null">
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;"
                                          >calendar_today</v-icon
                                        >
                                        {{
                                          project.deadline.toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "2-digit",
                                              year: "numeric",
                                            }
                                          )
                                        }}</span
                                      >
                                    </div>
                                    <div v-else>
                                      <span style="">
                                        <v-icon color="#ff9d66" width="20px;">
                                          calendar_today</v-icon
                                        >
                                        Someday
                                      </span>
                                    </div>
                                  </v-card-text>
                                </v-col>
                                
                              </v-row>
                              <span
                                style="
                                  display: flex;
                                  align-items: center;
                                  padding: 3px;
                                  font-size: 14px;
                                  color: #999999;
                                "
                                ><v-icon
                                  color="#999999"
                                  width="20px"
                                  
                                  style="padding: 3px; padding-right: 10px"
                                  >groups</v-icon
                                >
                                Scheduled Meeting</span
                              >

                              <div style="display:flex; justify-content: space-between">
                              <span
                                style="
                                  display: flex;
                                  padding: 3px;
                                  padding-bottom: 7px;
                                  font-size: 14px;
                                  align-items: center;
                                  color: #999999;
                                "
                                ><v-icon
                                  color="#999999"
                                  width="20px"
                                  style="padding: 3px; padding-right:10px;"
                                  >check_circle</v-icon
                                >
                                Incompleted Todo
                              </span>
                              
                              </div>
                              
                              <v-progress-linear
                                    style="
                                      display: flex;
                                      justify-content: center;
                                      align-item: center;
                                    "
                                    
                                    :rotate="-90"
                                    :size="60"
                                    :width="8"
                                    :value="project.progress * 100"
                                    color="#ff7200"
                                  >
                                    <!-- <span style="font-weight: bold">{{
                                      Math.trunc(project.progress * 100) + "%"
                                    }}</span> -->
                                  </v-progress-linear>
                              
                             
                            </v-card>
                          </v-slide-item>
                          
                        </v-slide-group>
                      </v-sheet>
                    </div>
                    
                    </v-card>
              </v-container>

            <v-row>
              <v-col col="12" md="6">
              <v-container
                  style="margin-right: auto; margin-left: auto; display: flex; justify-content: flex-start; flex-direction: column"
                  
                >
                  
                    <div
                      style="padding: 8px; display: flex; flex-direction: row; "
                    >
                    <span
                        style="
                          margin-top: 10px;
                          margin-left: 3vw;
                          color: #4b4b4b;
                          font-size: 20px;
                          display: flex;
                          align-items: flex-start;
                          font-weight: bold;
                        "
                        >Today's Meetings</span
                      >
                      
                    </div>
                    
                    <v-card color="white" outlined :class="`rounded-xl`">
                      <div v-for="meetingPendings in this.$store.state.meetingPendings" :key="meetingPendings.id">
                        <v-card outlined color="white">
                          {{meetingPendings.title}}
                          
                        </v-card>
                      </div>
                   
                    </v-card>
                    
                    
                   
              </v-container>
              </v-col>
              <v-col col="12" md="6">
              
              </v-col>
            </v-row>
              </v-col>
              <v-col col="12" md="4">
                <div style="margin-right: auto; margin-left: auto; display: flex; justify-content: flex-start" >
                
                <v-date-picker
                ref="picker"
                v-model="date"
                :events="events"
                  event-color="orange"
                  color="#ff9d66"
                  width="360"
                  height="100"
               
                ></v-date-picker>

              
              </div>
             
            </v-col>
            </v-row>
              
          </div>
            <v-card>
            </v-card>

          <div>

          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../main.ts";

export default {
  name: "Secret.vue",

  data() {
    return {
      projectSlide: null,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      events:null,
      navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "groups" },

    ],
      chips: [],
      groupmates: [
        {
          title: "Jin 1",
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        },
        {
          title: "Jin 2",
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        },
        {
          title: "Jin 3",
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        },
        {
          title: "Jin 4",
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        },
      ],
      search: "",
      users: [],
      usersNew: [],
      searchName: "",
      searchEmail: "",
      searchId: "",
      searchAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    };
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

  computed: {
    projectLength() {
      return this.$store.state.projects.length;
    },
  },

mounted() {
    this.events = [...Array(6)].map(() => {
        const day = Math.floor(Math.random() * 30)
        const d = new Date()
        d.setDate(day)
        return d.toISOString().substr(0, 10)
      })
    // this.$store.dispatch("getTasks");
  },


  methods: {
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if (this.search.length === 0 || this.search != this.searchName) {
        this.searchName = "";
        this.searchId = "";
        this.searchEmail = "";
      }
    },
    async signOut() {
      try {
        const data = await firebase.auth().signOut();
        console.log(data);
        this.$router.replace({ name: "Login" });
      } catch (err) {
        console.log(err);
      }
    },

    async getMatchedUserbyEmail() {
      db.collection("user")
        .where("email", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            this.users.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.users);
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    async getMatchedUserbyName() {
      db.collection("user")
        .where("name", "==", this.search)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            (this.searchName = doc.data().name),
              (this.searchEmail = doc.data().email),
              (this.searchId = doc.id);

            this.users.push({
              id: doc.id,
              name: doc.data().name,
              email: doc.data().email,
              avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
            });
            console.log(this.users);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
  },
};
</script>

<style scoped>
.checkboxCol {
  color: white;
  background-color: #ff7200;
}

.avatar-bg {
  background-color: white;
  border-color: white;
}

.centerAlign {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftAlign {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.input-group--disabled.checkbox .input-group__input {
  color: white !important;
  outline: 1px solid #1e5180;
}
</style>
