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
      <v-container color="#ff9d66">
      <v-combobox
          item-text="title"
          v-model="chips"
          item-color="#ff9d66"
          :items="groupmates"
          chips
          clearable
          label="Person In Charge"
          multiple
          color="#ff9d66"
      >
        <template v-slot:selection="{ attrs, item, parent, selected }" color="#ff9d66">
          <v-chip
              class="ma-2"
              color="#ff9d66"
              text-color="white"
              v-bind="attrs"
              :input-value="selected"
              close
              @click="parent.selectItem(item)"
              @click:close="remove(item)"
          >
            <v-avatar left  class="white--text">
<!--              <v-icon color="#ff9d66">mdi-account</v-icon>-->
              <v-img :src="item.avatar"></v-img>
            </v-avatar>
            <span>{{ item.title }}</span>
          </v-chip>
        </template>
      </v-combobox>
      </v-container>
      <br />
      <div>
        <v-text-field
        v-model="search"
        @input="getMatchedUserbyEmail(); getMatchedUserbyName(); onQueryChange(); ">
        </v-text-field>
        <div v-for="user in this.users" :key="user.id">
          {{user.id}}
          {{user.name}}
          {{user.email}}


        </div>
<!--        <v-card-->
<!--            max-width="450"-->
<!--            class="mx-auto"-->
<!--        >-->

<!--          <v-list three-line>-->
<!--            <template v-for="(user) in users">-->
<!--              <v-subheader-->
<!--                  v-if="user.id"-->
<!--                  :key="user.id"-->
<!--                  v-text="user.id"-->
<!--              ></v-subheader>-->

<!--              <v-list-item-->
<!--                  :key="user.id"-->
<!--              >-->
<!--                <v-list-item-avatar>-->
<!--                  <v-img :src="user.avatar"></v-img>-->
<!--                </v-list-item-avatar>-->

<!--                <v-list-item-content>-->
<!--                  <v-list-item-title>{{user.name}}</v-list-item-title>-->
<!--                  <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>-->
<!--                </v-list-item-content>-->
<!--              </v-list-item>-->
<!--            </template>-->
<!--          </v-list>-->
<!--        </v-card>-->
        <v-card
            max-width="450"
            class="mx-auto"
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
              <v-btn v-if="this.searchId"><v-icon>person_add</v-icon></v-btn>
            </v-list-item-action>
          </v-list>

        </v-card>
      </div>
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
import {db} from "../main.ts";


export default {
  name: "Secret.vue",

  data () {
    return {
      navItems: [
        { title: 'Login', href: "./login", icon: 'mdi-home-city' },
        { title: 'Register', href: "./",icon: 'mdi-account' },
        { title: 'Secret', href: "./secret", icon: 'mdi-account-group-outline' },
        { title: 'Todo', href: "./todo", icon: 'mdi-account-group-outline' },
        { title: 'Project', href: "./project", icon: 'mdi-account-group-outline' },

      ],
      chips: [],
      groupmates: [
        {title: "Jin 1", avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'},
        {title: "Jin 2", avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'},
        {title: "Jin 3", avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'},
        {title: "Jin 4", avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg'}
      ],
      search: "",
      users:[],
      usersNew:[],
      searchName:"",
      searchEmail:"",
      searchId:"",
      searchAvatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',

    }
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
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
    },
    onQueryChange(event) {
      // can be this.query.length === 0 as well
      if(this.search.length === 0 || this.search != this.searchName) {
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
      db.collection("user").where("email", '==' , this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName= doc.data().name,
              this.searchEmail = doc.data().email,
              this.searchId = doc.id


              this.users.push ({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
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
      db.collection("user").where("name", '==' , this.search)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.searchName= doc.data().name,
              this.searchEmail = doc.data().email,
              this.searchId = doc.id

              this.users.push ({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
              });
              console.log(this.users)
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
.checkboxCol{
   color: white;
  background-color: #ff7200;
}

.avatar-bg{
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
  outline: 1px solid #1e5180
}

</style>
