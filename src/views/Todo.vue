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

      <v-col col="12" md="10" >
        <div>
          <div>

            <br />


          </div>
          <br />

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
                    Add New Todo
                  </v-btn>
                </template>

                <v-card>
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
                              :items="[
                        'CS2103 Software Engineering Project',
                        'CS2101 Random Project',
                      ]"
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
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="myDeadline"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                  v-model="myDeadline"
                                  label="Deadline"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="myDeadline" no-title scrollable>
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="menu = false">
                                Cancel
                              </v-btn>
                              <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(myDeadline)"
                              >
                                OK
                              </v-btn>
                            </v-date-picker>
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
              </v-dialog>
            </v-row>
          </div>

          <br>
          <br>

          <div v-if="this.$store.getters.getTasks && this.$store.getters.getTasks.length > 0">

            <div v-for="task in this.$store.getters.getTasks" :key="task.id">
              <v-card
                  max-width="800px"
                  class="mx-auto pa-6"
                  outlined
              >
                <v-row>
                  <v-col cols="12" md="3" >
                    <span v-bind:class="{completed: task.complete}">{{ task.deadline }}</span>
                    <v-spacer></v-spacer>

                  </v-col>
                  <v-col cols="12" md="7" align="left">
                    <span v-bind:class="{completed: task.complete}">{{ task.task }}</span><v-spacer></v-spacer>
                    <span v-bind:class="{completed: task.complete}">{{ task.project }}</span>
                    <v-spacer></v-spacer>

                  </v-col>
                  <v-col cols="12" md="2">
                    <v-checkbox

                        color="orange"

                        hide-details
                        v-on:change="completeTask(task)" v-bind:checked="task.complete"/>
                  </v-col>
                </v-row>

                <br />

                <v-row>
                  <v-col col="12" md="6" align="right">
                    <v-dialog v-model="dialog" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"

                            @click="dialog = true"

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
                                    value="this"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-select
                                    :items="[
                        'CS2103 Software Engineering Project',
                        'CS2101 Random Project',
                      ]"
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
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="myDeadline"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="myDeadline"
                                        label="Deadline"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker v-model="myDeadline" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu = false">
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(myDeadline)"
                                    >
                                      OK
                                    </v-btn>
                                  </v-date-picker>
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
                          <v-btn color="blue darken-1" text @click="dialog = false; editTask(task.id);">
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col col="12" md="6" align="left">
                    <v-btn  @click="deleteTask(task.id)">
                      <v-icon> mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

              </v-card>

            </div>
          </div>

          <br />
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
    myDeadline: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    myTodo: "",
    errors: "",
    complete: false,
    myNote:"",
    myProject: "",
    navItems: [
      { title: 'Login', href: "./login", icon: 'mdi-home-city' },
      { title: 'Register', href: "./",icon: 'mdi-account' },
      { title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline' },
      { title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline' },
    ],
  }),

    beforeCreate: function(){
      this.$store.dispatch("setItems")
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
        this.$router.replace({ name: "Login" });
      } catch (err) {
        console.log(err);
      }
    },

    addTodo() {
      this.errors = ""

      if (this.myTodo !== "") {
        db.collection('todo').add({
          task: this.myTodo,
          created_at: Date.now(),
          complete: this.complete,
          deadline: this.myDeadline,
          note: this.myNote,
          project: this.myProject,

        }).then((response) => {
          if (response) {
            this.myTodo = ''
          }
        }).catch((error) => {
          this.errors = error
        })
      } else{
        this.errors = "Please enter your todo title"
      }
      console.log("myTodo: " + this.myTodo)

    },

    deleteTask: function (id) {
      if (id) {
        db.collection("todo").doc(id).delete().then(function() {
          console.log('Document successfully deleted')
        }).catch(function(error) {
          this.error = error
        })
      } else {
        this.error = 'Invalid ID'
      }
    },

    completeTask: function(task){
      task.complete = !task.complete
      db.collection("todo").doc(task.id).update({
        complete: task.complete,
      })
    },

    editTask: function(id) {
      db.collection("todo").doc(id).update({
        task: this.myTodo,
        complete: this.complete,
        deadline: this.myDeadline,
        note: this.myNote,
        project: this.myProject,
      })

    }
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

.v-card{
  border-left: 5px solid red;
  color: orange;

}
</style>
