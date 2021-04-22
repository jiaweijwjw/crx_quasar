<template>
  <q-layout view="hHh lpr fff">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "BrowserLayout",
  data() {
    return {};
  }
};
</script>

<style lang="sass" scoped>
.q-layout
  background-color: transparent !important
  overflow: auto
.q-page-container
  background-color: transparent !important
</style>
