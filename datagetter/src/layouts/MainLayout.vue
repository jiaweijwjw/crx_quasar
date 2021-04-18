<template>
  <q-layout view="hHh lpr fff" class="layout">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="q-ml-md">
          Data Getter
        </q-toolbar-title>
        <q-space />
        <q-btn
          outline
          color="cream"
          icon="account_box"
          label="Login"
          class="q-mr-xs q-ml-md"
        >
          <q-tooltip
            anchor="bottom middle"
            self="center middle"
            :offset="[15, 15]"
            >Login</q-tooltip
          >
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      loggedIn: false
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.loggedIn;
    }
  }
};
</script>

<style lang="sass">
.q-layout
  background-color: $background !important
  height: 400px
  width: 400px
  overflow: auto
.q-page-container
  background-color: $background !important
.q-header
  background-color: $background2
  color: $cream
.q-tooltip
  background-color: $grey
  color: $cream
</style>
