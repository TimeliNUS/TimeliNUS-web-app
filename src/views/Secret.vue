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

      <br />
      Here would be a dashboard like this.
      <br />
    </div>

<!--        <v-card-->

<!--            max-width="1400"-->
<!--            class="mx-auto"-->
<!--        >-->
<!--          <v-virtual-scroll-->
<!--              :items="items"-->
<!--              height="1200"-->
<!--              item-height="64"-->
<!--          >-->
<!--            <template>-->
<!--              <v-list-item>-->
<!--                <v-list-item-content>-->
<!--                  Date-->
<!--                </v-list-item-content>-->
<!--                <v-list-item-content>-->
<!--                  <v-list-item-title>-->
<!--                    Landing Page-->
<!--                    <br>-->
<!--                    CS2103 Software Engineering Project-->
<!--                  </v-list-item-title>-->
<!--                </v-list-item-content>-->

<!--                <v-list-item-action>-->
<!--                  <v-checkbox color="white"></v-checkbox>-->
<!--                </v-list-item-action>-->
<!--              </v-list-item>-->

<!--              <v-divider></v-divider>-->
<!--            </template>-->
<!--          </v-virtual-scroll>-->
<!--        </v-card>-->
    <br />

        <div>
          <v-container>
          <v-card color="#FFE4CB" style="padding: 8px;">
            <v-virtual-scroll
                :items="items"
                height="1200"
                item-height="80"
            >
              <template>
                <v-list-item>

<!--            <v-card outlined color="white"  style="margin: auto;"-->
<!--            >-->
<!--              <v-row>-->
<!--                <v-col cols="12" md="2" align="center" justify="center" class="centerAlign">-->
<!--                  Date-->

<!--                </v-col>-->
<!--                <v-col cols="12" md="1">-->
<!--                  <v-divider vertical>-->
<!--                  </v-divider>-->
<!--                </v-col>-->
<!--                <v-col cols="12" md="7" align="left"  class="leftAlign">-->
<!--                  Landing Page-->
<!--                  <br>-->
<!--                  CS2103 Software Engineering Project-->

<!--                </v-col>-->
<!--                <v-col cols="12" md="2" >-->
<!--                  <v-card outlined color="#ff9d66" class="centerAlign">-->
<!--                    <v-checkbox color="white"></v-checkbox>-->
<!--                    <br>-->
<!--                  </v-card>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card>-->
<!--                </v-list-item>-->


            <br>
            <v-card outlined color="white"  style="margin: auto;"
            >
              <v-row>
                <v-col cols="12" md="2" align="center" justify="center" class="centerAlign">
                  Date

                </v-col>
                <v-col cols="12" md="1">
                  <v-divider vertical>
                  </v-divider>
                </v-col>
                <v-col cols="12" md="7" align="left"  class="leftAlign">
                  Landing Page
                  <br>
                  CS2103 Software Engineering Project

                </v-col>
                <v-col cols="12" md="2" >
                  <v-list-item-action>
                  <v-card outlined color="#ff9d66" class="centerAlign">
                    <v-checkbox color="white"></v-checkbox>
                    <br>
                  </v-card>
                  </v-list-item-action>

                </v-col>
              </v-row>
            </v-card>
                </v-list-item>
              </template>

            </v-virtual-scroll>
          </v-card>
          </v-container>


        <v-img src="@/assets/Dashboard.png" alt=""></v-img>
        </div>

  </div>
    </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from "firebase";

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
    }
  },

  computed: {
    items () {
      return Array.from({ length: this.length }, (k, v) => v + 1)
    },
    length () {
      this.$store.getters.getTasks
      return this.$store.state.tasks.length
    },
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
  },
};
</script>

<style scoped>
.checkboxCol{
   color: white;
  background-color: #ff7200;
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
