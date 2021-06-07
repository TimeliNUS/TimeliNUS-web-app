<template>
  <div>
    <div>
      <br />
      <v-btn color="#ff9d66" depressed large type="submit" v-on:click="signOut">
        <span style="color: #ffffff">Sign Out</span>
      </v-btn>
      <br />
      Todo
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
                    <v-text-field label="Todo Title" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="[
                        'CS2103 Software Engineering Project',
                        'CS2101 Random Project',
                      ]"
                      label="Module Project"
                      required
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Deadline"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(date)"
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
              <v-btn color="blue darken-1" text @click="dialog = false">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>

    <br />
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Todo.vue",

  data: () => ({
    dialog: false,
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
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
  //text-decoration: line-through;
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
