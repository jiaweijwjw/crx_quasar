<template>
  <q-page class="flex flex-center" v-if="drawerStatusToggle">
    <h1>Add FB Post Page</h1>
  </q-page>
</template>

<script>
export default {
  name: "AddFBPostPage",
  props: ["drawerStatusToggle"],
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="sass" scoped>
.q-page
  background-color: $background
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
.page-item
  display: block
  width: 90%
</style>
