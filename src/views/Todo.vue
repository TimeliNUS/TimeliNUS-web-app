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
                      @click="dialog = true; getProjectMenu();"
                  >
                    Add New Todo
                  </v-btn>
                </template>
                <v-sheet outlined color="black">
                  <v-card >
                  <v-card-title>
                    <span class="headline">Add New Todo</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                              label="Todo Title"
                              required
                              v-model="myTodo"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select
                              :items="projects"
                              label="Module Project"
                              required
                              v-model="myProject"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" align="left">
                          Person In Charge
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
                    <v-btn color="blue darken-1" text @click="dialog = false; addTodo();">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
                </v-sheet>
              </v-dialog>
            </v-row>
          </div>

          <br>
          <br>

          <div>
            <v-container>
              <v-card outlined color="#FFE4CB" style="padding: 12px;">
                <div v-if="this.$store.getters.getTasks">
            <div v-for="task in this.$store.state.tasks" :key="task.id">
              <v-card outlined color="white"  style="margin: auto;"
              >
                <v-row style="margin:0px;">
                  <v-col cols="12" md="2" align="center" justify="center" class="centerAlign">
                    <span v-bind:class="{completed: task.complete}">{{ task.deadline }}</span>


                  </v-col>
                  <v-col cols="12" md="1">
                    <v-divider vertical>
                    </v-divider>
                  </v-col>
                  <v-col cols="12" md="5" align="left"  class="leftAlign">


                    <v-row style="margin:0px;">
                    <span v-bind:class="{completed: task.complete}">{{ task.task }}</span>
                    </v-row>
                    <v-row style="margin:0px;">

                    <span v-bind:class="{completed: task.complete}">{{ task.project }}</span>
                    </v-row>

                  </v-col>
                  <v-col col="12" md="1" align="right" class="centerAlign">
                    <v-dialog v-model="display[task.task]" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="#ff7200"
                            v-bind="attrs"
                            v-on="on"
                            outlined
                            small

                        >
                          <v-icon> mdi-pencil-outline</v-icon>

                        </v-btn>
                      </template>


                      <v-card>

                        <v-card-title>
                          <span class="headline">Edit Todo</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12">
                                <v-text-field
                                    label="Todo Title"
                                    required
                                    v-model="myTodo"

                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-select
                                    :items="projects"
                                    label="Module Project"
                                    required
                                    v-model="myProject"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" align="left">
                                Person In Charge
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
                          <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn color="blue darken-1" text @click="display[task.task] = false">
                            Close
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="display[task.task] = false; editTask(task);">

                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>

                    </v-dialog>
                  </v-col>
                  <v-col col="12" md="1" align="left" class="centerAlign">
                    <v-btn small outlined @click="deleteTask(task.id)">
                      <v-icon> mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </v-col>

                  <v-col cols="12" md="2" class="centerAlign" style="background-color: #ff9d66"  :class="`rounded-r`">
                    <v-card outlined color="#ff9d66">
                      <v-checkbox
                          class="v-input--selection-controls centerAlign"
                          color="white"
                          hide-details
                          v-model="task.complete"
                          @click="completeTask(task)"  />
                    </v-card>
                  </v-col>





                </v-row>

              </v-card>
              <br>

<!--              <v-card-->
<!--                  max-width="800px"-->
<!--                  class="mx-auto pa-6"-->
<!--                  outlined-->
<!--              >-->
<!--                <v-row>-->
<!--                  <v-col cols="12" md="3">-->
<!--                    <span v-bind:class="{completed: task.complete}">{{ task.deadline }}</span>-->
<!--                    <v-spacer></v-spacer>-->

<!--                  </v-col>-->
<!--                  <v-col cols="12" md="7" align="left">-->
<!--                    <span v-bind:class="{completed: task.complete}">{{ task.task }}</span>-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <span v-bind:class="{completed: task.complete}">{{ task.project }}</span>-->
<!--                    <v-spacer></v-spacer>-->

<!--                  </v-col>-->
<!--                  <v-col cols="12" md="2">-->
<!--                    <v-checkbox-->
<!--                        color="orange"-->
<!--                        hide-details-->
<!--                        v-model="task.complete"-->
<!--                        @click="completeTask(task)"  />-->
<!--                  </v-col>-->
<!--                </v-row>-->

<!--                <br/>-->

<!--                <v-row>-->
<!--                  <v-col col="12" md="6" align="right">-->
<!--                    <v-dialog v-model="display[task.task]" persistent max-width="600px">-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <v-btn-->
<!--                            color="primary"-->
<!--                            v-bind="attrs"-->
<!--                            v-on="on"-->


<!--                        >-->
<!--                          <v-icon> mdi-pencil-outline</v-icon>-->

<!--                        </v-btn>-->
<!--                      </template>-->


<!--                      <v-card>-->

<!--                        <v-card-title>-->
<!--                          <span class="headline">Edit Todo</span>-->
<!--                        </v-card-title>-->

<!--                        <v-card-text>-->
<!--                          <v-container>-->
<!--                            <v-row>-->
<!--                              <v-col cols="12">-->
<!--                                <v-text-field-->
<!--                                    label="Todo Title"-->
<!--                                    required-->
<!--                                    v-model="myTodo"-->

<!--                                ></v-text-field>-->
<!--                              </v-col>-->
<!--                              <v-col cols="12">-->
<!--                                <v-select-->
<!--                                    :items="projects"-->
<!--                                    label="Module Project"-->
<!--                                    required-->
<!--                                    v-model="myProject"-->
<!--                                ></v-select>-->
<!--                              </v-col>-->
<!--                              <v-col cols="12" align="left">-->
<!--                                Person In Charge-->
<!--                                <br>-->

<!--                                <v-btn-->
<!--                                    rounded-->
<!--                                    color="#ff9d66"-->
<!--                                    outlined-->
<!--                                    class="my-2 mr-2"-->
<!--                                >-->
<!--                                  Rounded Button-->
<!--                                </v-btn>-->
<!--                              </v-col>-->

<!--                              <v-col cols="12">-->
<!--                                <v-menu-->
<!--                                    v-model="menu2"-->
<!--                                    :close-on-content-click="false"-->
<!--                                    :nudge-right="40"-->
<!--                                    transition="scale-transition"-->
<!--                                    offset-y-->
<!--                                    min-width="auto"-->
<!--                                >-->
<!--                                  <template v-slot:activator="{ on, attrs }">-->
<!--                                    <v-text-field-->
<!--                                        v-model="myDeadline"-->
<!--                                        label="Picker without buttons"-->
<!--                                        prepend-icon="mdi-calendar"-->
<!--                                        readonly-->
<!--                                        v-bind="attrs"-->
<!--                                        v-on="on"-->
<!--                                    ></v-text-field>-->
<!--                                  </template>-->
<!--                                  <v-date-picker-->
<!--                                      v-model="myDeadline"-->
<!--                                      @input="menu2 = false"-->
<!--                                  ></v-date-picker>-->
<!--                                </v-menu>-->
<!--                              </v-col>-->
<!--                            </v-row>-->
<!--                          </v-container>-->
<!--                          <small>*indicates required field</small>-->
<!--                        </v-card-text>-->
<!--                        <v-card-actions>-->
<!--                          <v-spacer></v-spacer>-->

<!--                          <v-btn color="blue darken-1" text @click="display[task.task] = false">-->
<!--                            Close-->
<!--                          </v-btn>-->
<!--                          <v-btn color="blue darken-1" text @click="display[task.task] = false; editTask(task);">-->

<!--                            Save-->
<!--                          </v-btn>-->
<!--                        </v-card-actions>-->
<!--                      </v-card>-->

<!--                    </v-dialog>-->
<!--                  </v-col>-->
<!--                  <v-col col="12" md="6" align="left">-->
<!--                    <v-btn @click="deleteTask(task.id)">-->
<!--                      <v-icon> mdi-trash-can-outline-->
<!--                      </v-icon>-->
<!--                    </v-btn>-->
<!--                  </v-col>-->
<!--                </v-row>-->

<!--              </v-card>-->

            </div>
          </div>

              </v-card>
            </v-container>

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
  name: "Todo.vue",
  data: () => ({
    dialog: false,
    dialogEdit: false,
    myDeadline: new Date().toISOString().substr(0, 10),
    myDeadline2: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    myTodo: "",
    errors: "",
    complete: false,
    myNote: "",
    myProject: "",
    display:{},
    menuEdit:{},
    styleObject: { background: 'red', border: '3px solid green'},
    navItems: [
      {title: 'Login', href: "./login", icon: 'mdi-home-city'},
      {title: 'Register', href: "./", icon: 'mdi-account'},
      {title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline'},
      {title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline'},
      {title: 'Project', href: "./project", icon: 'mdi-account-group-outline'},

    ],
    projects: [],
  }),
  beforeCreate: function () {
    this.$store.getters.getTasks
  },

  getProjectsForMenu: function(){
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

    async getProjectMenu(){
      let data= await this.$store.getters.getProjects
      data=this.$store.state.projects;
      console.log(this.$store.state.projects);
      for(let i = 0; i < data.length; i++){
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
        db.collection('todo').add({
          task: this.myTodo,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          complete: this.complete,
          deadline: firebase.firestore.Timestamp.fromDate(new Date(this.myDeadline)),
          note: this.myNote,
          project: this.myProject,
        }).then((response) => {
          if (response) {
            db.collection('user').doc(this.$store.state.user.uid).update({todo: firebase.firestore.FieldValue.arrayUnion(response)})
                .then((resp) => this.$store.dispatch('getTasks').then(

            db.collection('project').doc(projectFound.docs[0].id).
            update({todos: firebase.firestore.FieldValue.arrayUnion(response)})
                    )
                )
                .catch((error) => console.log(error));
            this.myTodo = '';
          }
        }).catch((error) => {
          this.errors = error}
       )
      } else {
        this.errors = "Please enter your todo title"
      }
      this.myTodo = ''
      this.myProject= ""
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
    editTask: function(task) {
      this.errors = ""
      if (this.myTodo !== "") {
        db.collection("todo").doc(task.id).update({
          task: this.myTodo,
          complete: task.complete,
          deadline: this.myDeadline,
          note: this.myNote,
          project: this.myProject,
        }).then((response) => {
          if (response) {
            this.myTodo = ''
            this.myProject= ""
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
      this.myProject= ""
    },

  },
};

</script>


<style scoped>
.todo-item {
  margin-bottom: 12px;
  justify-content: space-between;
  align-items: center;
  display:flex;
}

.v-input--selection-controls {
   margin-top: 0px;
   padding-top: 0px;
}


.checkboxCol{
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

.v-card {
  color: #ff9d66;
}
</style>