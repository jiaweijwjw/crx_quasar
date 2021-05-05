<template>
  <q-page class="flex flex-center" v-if="drawerStatusToggle">
    <div class="page-item">
      <table-actions />
    </div>
    <div class="page-item">
      <collected-data-table />
    </div>
  </q-page>
</template>

<script>
import CollectedDataTable from "components/CollectedDataTable.vue";
import TableActions from "src/components/TableActions.vue";

export default {
  name: "AddChunkPage",
  props: ["drawerStatusToggle"],
  components: {
    CollectedDataTable,
    TableActions
  },
  data() {
    return {};
  },
  methods: {},
  async created() {
    this.$q.bex.on("testdirect", event => {
      const payload = event.data;
      if (payload.msg === " hello") {
        console.log("hello");
      }
    });
  }
};
// q-page    // :class="drawerStatusToggle ? 'q-page-shown' : 'q-page-hidden'"
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
