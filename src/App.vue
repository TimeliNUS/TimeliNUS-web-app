<template>
  <v-app>
    <div id="app">
      <!--    <top-header></top-header>-->

      <router-view />
     
    </div>

    <!--    <v-main>-->
    <!--      <router-view />-->
    <!--    </v-main>-->
  </v-app>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=MuseoModerno:wght@100;200;300;400;500;600;700;800;900&display=swap");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  width: 35px;
  height: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 12px;
  border-radius: 12px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: rgba(255, 157, 102, 0.8);
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.5);
  margin-right: 100px;
  border: 9px transparent solid;
  border-top: 10px transparent solid;
  background-clip: padding-box;
  height: 50px;
  width: 15px;
  border-bottom: 10px transparent solid;
}
::-webkit-scrollbar-thumb:window-inactive {
  border-radius: 20px;
  background: rgba(255, 157, 102, 0.4);
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.5);
  margin-right: 100px;
  border: 9px transparent solid;
  border-top: 10px transparent solid;
  background-clip: padding-box;
  height: 50px;
  width: 15px;
  border-bottom: 10px transparent solid;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
