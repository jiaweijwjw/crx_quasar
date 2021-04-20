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

<style lang="sass">
.q-layout
  background-color: $background !important
  overflow: auto
.q-tooltip
  background-color: $grey
  color: $cream
.q-btn
  color: $cream
</style>
