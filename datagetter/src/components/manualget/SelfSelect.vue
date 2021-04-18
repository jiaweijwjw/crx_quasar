<template>
  <div>
    <q-btn label="hello" class="test" />
  </div>
</template>

<script>
export default {
  name: "PopupPage",
  components: {
    // SelfSelect: require("components/manualget/SelfSelect.vue").default
  }
};
</script>
<style lang="sass" scoped>
.test
  color: $magenta !important
  background-color: $background2
</style>
