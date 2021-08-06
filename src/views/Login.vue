<template>
  <div class="background centerAlign">
    <v-container class="align-center mb-6 fill-height centerAlign">
      <v-card class="test">
        <v-row class="test">
          <v-col
            align="center"
            justify="center"
            cols="6"
            class="login__image centerAlign"
          >
            <div class="image-container">
              <v-img
                src="@/assets/65.png"
                class="image-container"
                alt=""
              ></v-img>
              <br />
              <span style="font-size: 24px; color: #001847; font-weight: bold">Slick without Panic</span>
              <br />
              
              
            </div>
          </v-col>

          <v-col cols="6" class="login__form leftAlign">
            <div style="max-height: 100%">
              <div>
                <h1 style="color: #ff6f1e">Login.</h1>
                <p style="color: #979797">
                  Don't have an account?
                  <router-link style="color: #ff9d66" to="/"
                    >Register</router-link
                  >
                </p>
                <br />
              </div>
              <div>
                <v-row>
                  <v-col col="6">
                    <v-btn
                      class=""
                      outlined
                      large
                      color="#ff9d66"
                      @click="googleSignIn"
                    >
                      <v-icon dark left> mdi-google </v-icon>
                      Login with Google
                    </v-btn>
                  </v-col>

                  
                </v-row>

                <br />
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
                      <div class="login__form--error" v-if="error">
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
                          prepend-inner-icon="mdi-lock"
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
                          <span style="color: #ffffff">Login</span>
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
import { db } from "../main.ts";
import axios from "axios";

export default {
  name: "Login.vue",

  data: () => ({
    alignments: ["start", "center", "end"],
    email: "",
    password: "",
    error: "",
  }),

  methods: {
    async pressed() {
      try {
        const val = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        console.log(val);
        console.log(firebase.auth().currentUser);
        // this.$store.dispatch("setUser", firebase.auth().currentUser)
        this.$router.replace({ name: "Secret" });
      } catch (err) {
        console.log(err);
        this.error = "Invalid username/password.";
      }
    },

    async googleSignIn() {
      const authCode = await this.$gAuth.getAuthCode();
      const response = await axios.post(
        "https://asia-east2-timelinus-2021.cloudfunctions.net/getGoogleToken",
        {},
        {
          headers: {
            auth_code: authCode,
          },
        }
      );
      const credential = firebase.auth.GoogleAuthProvider.credential(
        response.data.id_token,
        response.data.access_token
      );
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          this.$router.replace({ name: "Secret" });
          const credential = result.credential;
          const user = result.user;
          console.log("google sign in");
          console.log(user);
          console.log(user.uid);
          if (result.additionalUserInfo.isNewUser) {
            db.collection("user")
              .doc(user.uid)
              .set({
                email: user.email,
                name: user.displayName,
                todo: [],
                project: [],
                created_at: Date.now(),
                photoURL: user.photoURL,
                googleRefreshToken: response.data["refresh_token"],
                googleAccessTokenExpiry:
                  firebase.firestore.Timestamp.fromMillis(
                    Date.now() + response.data["expires_in"] * 1000 - 5
                  ),
                googleAccessToken: response.data["access_token"],
              });
          } else {
            db.collection("user")
              .doc(user.uid)
              .update({
                googleRefreshToken: response.data["refresh_token"],
                googleAccessTokenExpiry:
                  firebase.firestore.Timestamp.fromMillis(
                    Date.now() + response.data["expires_in"] * 1000 - 5
                  ),
                googleAccessToken: response.data["access_token"],
              });
          }
        });
    },
  },
};
</script>

<style scoped>
.test {
  /*width: 80vw;*/
  min-height: 60vh;
  margin: auto;
}

.login__form--error {
  color: red;
  /*font-size: 18px;*/
}

.login__image {
  width: 40vw;
  min-height: 60vh;
  background-color: #ffd0a5;
}

.login__form {
  width: 40vw;
  min-height: 60vh;
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
  padding-left: 5%;
  padding-top: 5%;
}

.divider {
  padding: 10px;
  margin: 10px;
}
</style>
