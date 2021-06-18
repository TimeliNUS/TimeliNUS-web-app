<template>
  <div class="background centerAlign">
    <v-container class="align-center mb-6 fill-height centerAlign">
      <v-card class="test" rounded="xl">
        <v-row class="test">
          <v-col
            align="center"
            justify="center"
            cols="6"
            class="orangeorange centerAlign"
          >
            <div class="image-container">
              <v-img
                src="@/assets/65.png"
                class="image-container"
                alt=""
              ></v-img>
            </div>
          </v-col>

          <v-col cols="6" class="blueblue leftAlign">
            <div style="max-height: 100%; max-width: 100%">
              <div>
                <h1 style="color: #ff6f1e">Get started.</h1>
                <p style="color: #979797">
                  Already have an account?
                  <router-link style="color: #ff9d66" to="/login"
                    >Login</router-link
                  >
                </p>

                <br />
              </div>
              <div>
                <v-row>
                  <v-col>
                    <v-btn
                      class="order-1 ma-2"
                      outlined
                      color="#ff9d66"
                      @click="googleSignIn; addUser"
                    >
                      Sign up with Google
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn class="order-2 ma-2" outlined color="#ff9d66">
                      Sign up with NUS Email
                    </v-btn>
                  </v-col>
                </v-row>

                <br /><br />
              </div>
              <div>
                <v-row>
                  <v-divider class="divider"></v-divider>
                  <span style="color: #e0e0e0">OR </span>
                  <v-divider class="divider"></v-divider>
                </v-row>
              </div>
              <div>
                <form @submit.prevent="pressed">
                  <v-row>
                    <v-col>
                      <div class="error" v-if="error">
                        {{ error }}
                      </div>
                      <div>
                        <v-text-field
                          prepend-inner-icon="email"
                          outlined
                          type="email"
                          placeholder="Email address"
                          v-model="email"
                          hide-details="auto"
                          color="#ff9d66"
                        />
                      </div>
                      <div class="v-text-field">
                        <v-text-field
                          prepend-inner-icon="email"
                          outlined
                          type="password"
                          placeholder="Password"
                          v-model="password"
                          color="#ff9d66"
                          hide-details="auto"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="my-2 centerAlign">
                        <v-btn color="#ff9d66" depressed large type="submit">
                          <span style="color: #ffffff">Register</span>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </form>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import firebase from "firebase";
import {db} from "../main.ts"

export default {

  data: () => ({
    alignments: ["start", "center", "end"],
    email: "",
    password: "",
    error: "",
  }),

  methods: {
    async pressed() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password).then((userCredential) => {

              const user = userCredential.user;
            console.log(firebase.auth().currentUser);
            this.$store.getters.getProjects
            });
        // console.log(user);
        this.$store.dispatch("setUser", firebase.auth().currentUser)
        this.addUser();
        this.$router.replace({ name: "Secret" });
      } catch (err) {
        console.log(err);
        this.error = "This email has already been used in other account.";
      }
    },

    googleSignIn: function () {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$router.replace({ name: "Secret" });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addUser() {
      if (this.email !== "") {
        db.collection('user').doc(this.$store.state.user.uid).set({
          email: this.email,
          todo: [],
          project:[],
          created_at: Date.now(),
        }).then((response) => {
          if (response) {
            this.email = ''
          }
        }).catch((error) => {
          this.errors = error
        })
      } else {
        this.errors = "Please enter your email"
      }
      this.email = ''
      this.password= ""

    },
  },
};
</script>

<style scoped>
.test {
  /*width: 80vw;*/
  height: 60vh;
  margin: auto;
}

.v {
  min-width: 0;
  padding: 0px;
}

.error {
  color: red;
  font-size: 18px;
}

.orangeorange {
  width: 40vw;
  height: 60vh;
  background-color: #ffd0a5;
}

.blueblue {
  width: 40vw;
  height: 60vh;
  background-color: white;
}

.image-container {
  width: 80%;
  /*height:80%;*/
  justify-content: center;
  align-content: center;
  vertical-align: middle;
  align-items: center;
  display: block;
}

.background {
  background-color: #ff9d66;
  min-height: 100vh;
  align-items: center;
}

.centerAlign {
  display: flex;
  justify-content: center;
  align-items: center;
}

.leftAlign {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 5%;
}

.divider {
  padding: 10px;
  margin: 10px;
}
</style>
