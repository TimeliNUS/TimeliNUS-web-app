<template>
  <div>
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
            <br />
            
            
            Here would be a dashboard like this.
            <br />
          </div>

          <div>
            <v-img src="@/assets/Dashboard.png" alt=""></v-img>
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
      navItems: [
      { title: "Dashboard", href: "./secret", icon: "dashboard" },
      { title: "Todo", href: "./todo", icon: "done" },
      { title: "Project", href: "./project", icon: "work" },
      { title: "Meeting", href: "./meeting", icon: "work" },

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
