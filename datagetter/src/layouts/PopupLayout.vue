<template>
  <q-layout view="hHh lpr fff">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Data Getter
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "PopupLayout",
  data() {
    return {};
  }
};
</script>

<style lang="sass" scoped>
.q-layout
  background-color: $background !important
  height: 300px
  width: 300px
  overflow: auto
.q-page-container
  background-color: $background !important
.q-header
  background-color: $background2
  color: $cream
</style>
