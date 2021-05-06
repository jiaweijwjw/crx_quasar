<template>
  <q-page class="flex flex-center" v-if="drawerStatusToggle">
    <div class="page-item">
      <chunks-table-actions />
    </div>
    <div class="page-item">
      <chunks-table />
    </div>
  </q-page>
</template>

<script>
import ChunksTable from "src/components/ChunksTable.vue";
import ChunksTableActions from "src/components/ChunksTableActions.vue";

export default {
  name: "AddChunkPage",
  props: ["drawerStatusToggle"],
  components: {
    ChunksTable,
    ChunksTableActions
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
