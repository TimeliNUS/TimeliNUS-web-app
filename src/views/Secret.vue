<template>
  <div>
    <div>
      <br />
      <v-btn color="#ff9d66" depressed large type="submit" v-on:click="signOut">
        <span style="color: #ffffff">Sign Out</span>
      </v-btn>
      <br />
      Here would be a dashboard like this.
      <br />
    </div>
    <br />
    <v-img src="@/assets/Dashboard.png" alt=""></v-img>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Secret.vue",

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

<style scoped></style>
