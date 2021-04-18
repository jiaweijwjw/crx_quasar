<template>
  <q-page class="flex flex-center q-page">
    <self-select></self-select>
  </q-page>
</template>

<script>
export default {
  name: "PopupPage",
  components: {
    SelfSelect: require("components/manualget/SelfSelect.vue").default
  }
};
</script>
<style lang="sass" scoped>
.q-page
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
  background-color: $background !important
.page-item
  display: block
  width: 100%
</style>
