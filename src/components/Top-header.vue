<template>
  <div>
    Logged In
    <span v-if="loggedIn">Yes</span>
    <span v-else>No</span>
    <div>
      <button v-on:click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "top-header.vue",

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

  data() {
    return {
      loggedIn: false,
    };
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
