<template>
  <div class="background centerAlign">
    <v-container class="align-center mb-6 fill-height centerAlign">
      <v-card class="test" rounded="xl">
        <v-row class="test">
          <v-col
            align="center"
            justify="center"
            cols="6"
            class="register__image centerAlign"
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
                      <div class="register__form--error" v-if="error">
                        {{ error }}
                      </div>
                      <div style="padding-bottom: 18px">
                        <v-text-field
                          prepend-inner-icon="mdi-account"
                          outlined
                          type="text"
                          placeholder="Username"
                          v-model="name"
                          color="#ff9d66"
                          hide-details="auto"
                        />
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
import { db } from "../main.ts";
import axios from "axios";
// import googleSignInFunction from "../services/firebaseService"

export default {
  data: () => ({
    alignments: ["start", "center", "end"],
    email: "",
    password: "",
    error: "",
    name: "",
  }),

  methods: {
    async pressed() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({ displayName: this.name });
            console.log(firebase.auth().currentUser);
          });
        // console.log(user);
        // this.$store.dispatch("setUser", firebase.auth().currentUser)
        this.addUser();
        this.$router.replace({ name: "Secret" });
      } catch (err) {
        console.log(err);
        this.error = "This email has already been used in other account.";
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

    addUser() {
      if (this.email !== "") {
        db.collection("user")
          .doc(this.$store.state.user.uid)
          .set({
            email: this.email,
            name: this.name,
            todo: [],
            project: [],
            created_at: Date.now(),
            photoURL: null,
          })
          .then((response) => {
            if (response) {
              this.email = "";
            }
          })
          .catch((error) => {
            this.errors = error;
          });
      } else {
        this.errors = "Please enter your email";
      }
      this.email = "";
      this.password = "";
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

.v {
  min-width: 0;
  padding: 0px;
}

.register__form--error {
  color: white;
  font-size: 18px;
}

.register__image {
  width: 40vw;
  min-height: 60vh;
  background-color: #ffd0a5;
}

.register__form {
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
  padding: 5%;
}

.divider {
  padding: 10px;
  margin: 10px;
}
</style>
