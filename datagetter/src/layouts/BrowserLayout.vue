<template>
  <q-layout view="hHh lpr fff">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "BrowserLayout",
  data() {
    return {};
  },
  methods: {
    ...mapActions("main", ["initData"])
  },
  async created() {
    await this.initData();
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
