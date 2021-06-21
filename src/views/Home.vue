<template>

  <div>

    <v-row>
      <v-col col="12" md="2">
        <v-navigation-drawer
            absolute
            permanent
            left
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                <v-img
                    src="@/assets/orbital_logo_latest.png"
                    alt=""
                ></v-img>
              </v-list-item-title>

            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list
              dense
              nav
          >
            <v-list-item
                v-for="item in navItems"
                :key="item.title"
                link :to="item.href"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-btn color="#ff9d66" depressed large type="submit" v-on:click="signOut">
            <span style="color: #ffffff">Sign Out</span>
          </v-btn>
        </v-navigation-drawer>
      </v-col>

      <v-col col="12" md="10">
        <div>
          <div>

            <br/>


          </div>
          <br/>

          <div>
            <v-row justify="center">
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="dialog = true"
                  >
                    Add New Project
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="headline">Add New Project</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                              label="Project Title"
                              required
                              v-model="title"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                              label="Module code">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" align="left">
                          <span>Groupmates</span>
                          <div v-for="(user,index) in this.tempGroupmates" :key="user.id">
                            <v-chip
                                class="ma-2"
                                color="#ff9d66"
                                text-color="white"
                                :input-value="user.id"
                                v-if="user.chipValue"
                                close
                                @click:close="remove(user,index)"
                            >
                              <v-avatar left  class="white--text">
                                <!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
                                <v-img :src="user.avatar"></v-img>
                              </v-avatar>
                              <span>{{ user.name }}</span>
                            </v-chip>
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
                              <v-card-text>
                                <div v-for="user in this.users" :key="user.id">
                                  {{user.id}}
                                  {{user.name}}
                                  {{user.email}}


                                </div>
                              </v-card-text>
                              <v-card
                                  max-width="450"
                                  class="mx-auto"
                                  outlined
                              >
                                <v-list>
                                  <v-list-item-avatar
                                      v-if="this.searchName"><v-img :src="this.searchAvatar"></v-img>
                                  </v-list-item-avatar>
                                  {{this.searchName}}
                                  <br>
                                  {{this.searchEmail}}
                                  <br>
                                  {{this.searchId}}
                                  <v-list-item-action>
                                    <v-btn v-if="this.searchId" @click="addGroupmates();">
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

                        <v-col cols="12">
                          <v-menu
                              v-model="menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                  v-model="myDeadline"
                                  label="Picker without buttons"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="myDeadline"
                                @input="menu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                      Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false; addProject(); passGroupmates();">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </div>

          <br>
          <br>

          <div v-if="this.$store.getters.getProjects">
            <div v-for="project in this.$store.state.projects" :key="project.title">
              <v-card
                  max-width="800px"
                  class="mx-auto pa-6"
                  outlined
              >
                <v-row>
                  <v-col cols="12" md="3">
                    <span >{{ project.deadline }}</span>
                    <v-spacer></v-spacer>

                  </v-col>
                  <v-col cols="12" md="7" align="left">
                    <span >{{ project.title }}</span>
                    <v-spacer></v-spacer>

                  </v-col>
                  <v-col cols="12" md="2">
                  </v-col>
                </v-row>

                <br/>

                <v-row>
                  <v-col col="12" md="6" align="right">
                    <v-dialog v-model="display[project.title]" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"


                        >
                          <v-icon> mdi-pencil-outline</v-icon>

                        </v-btn>
                      </template>


                      <v-card>

                        <v-card-title>
                          <span class="headline">Edit Project</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                    label="Project Title"
                                    required
                                    v-model="title"

                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-select
                                    :items="[
                        'CS2103',
                        'CS2101',
                      ]"
                                    label="Module"
                                    required
                                    v-model="modCode"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" align="left">

                              </v-col>

                              <v-col cols="12">
                                <v-menu
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="myDeadline"
                                        label="Picker without buttons"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                      v-model="myDeadline"
                                      @input="menu2 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn color="blue darken-1" text @click="display[project.title] = false">
                            Close
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="display[project.title] = false; editProject(project);">

                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>

                    </v-dialog>
                  </v-col>
                  <v-col col="12" md="6" align="left">
                    <v-btn @click="deleteProject(project.id)">
                      <v-icon> mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

              </v-card>

            </div>
          </div>

          <br/>
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
    menu2: false,
    modCode: "",
    errors: "",
    display:{},
    menuEdit:{},
    search: "",
    users:[],
    usersNew:[],
    searchName:"",
    searchEmail:"",
    searchId:"",
    tempGroupmates: [],
    finalGroupmates: [],
    tempUser: null,
    chips:[],
    searchAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',

    navItems: [
      {title: 'Login', href: "./login", icon: 'mdi-home-city'},
      {title: 'Register', href: "./", icon: 'mdi-account'},
      {title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline'},
      {title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline'},
      {title: 'Project', href: "./project", icon: 'mdi-account-group-outline'},

    ],
  }),
  beforeCreate: function () {
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
    addProject() {
      this.errors = ""

      if (this.title !== "") {
        db.collection('project').add({
          _createdAt: Date.now(),
          title: this.title,
          deadline: this.myDeadline,
          todos: [],
        }).then((response) => {
          if (response) {
            db.collection('user').doc(this.$store.state.user.uid).update({project: firebase.firestore.FieldValue.arrayUnion(response)})
                .then((resp) => this.$store.dispatch('getProjects'))
                .catch((error) => console.log(error));
            this.title = ''
          }
        }).catch((error) => {
          this.errors = error
        })
      } else {
        this.errors = "Please enter your project title"
      }
      this.title = ''
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
          deadline: this.myDeadline,
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
    },

    async getMatchedUserbyEmail() {
      db.collection("user").where("email", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id
              this.tempUser = doc


              this.users.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.users)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },
    async getMatchedUserbyName() {
      db.collection("user").where("name", '==', this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName = doc.data().name,
                  this.searchEmail = doc.data().email,
                  this.searchId = doc.id
              this.tempUser = doc


              this.users.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.users)
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

              this.tempGroupmates.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                object: doc,
                chipValue: true,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.tempGroupmates)
              console.log(this.users)
              console.log(doc.id, " => ", doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
    },

    async passGroupmates() {
      for (let i = 0; i < this.tempGroupmates.length; i++) {
        if (this.tempGroupmates[i].chipValue == true) {
          console.log(this.tempGroupmates[i].object)
          this.finalGroupmates.push(this.tempGroupmates[i].object);
        }
      }
      console.log(this.tempGroupmates)
      console.log(this.finalGroupmates)
      this.searchId = ""
      this.searchEmail = ""
      this.searchName = ""
      this.finalGroupmates = ""
      this.tempGroupmates = ""
    },

    async remove(user,index) {
      this.chips.splice(this.chips.indexOf(user), 1)
      this.chips = [...this.chips]
      this.$delete(this.tempGroupmates,index)
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
      if(this.search.length === 0 || this.search != this.searchName) {
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

</style>