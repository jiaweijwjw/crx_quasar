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
import Storage from "../services/storage.access";
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
  created() {
    Storage.save("crxBrowserPageView", this.$route.name);
  }
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
