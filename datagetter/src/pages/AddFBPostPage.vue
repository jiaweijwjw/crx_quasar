<template>
  <q-page class="flex flex-center" v-if="drawerStatusToggle">
    <div class="page-item">
      <fb-posts-table-actions />
    </div>
    <div class="page-item">
      <fb-posts-table />
    </div>
  </q-page>
</template>

<script>
import FbPostsTable from "components/FbPostsTable.vue";
import FbPostsTableActions from "src/components/FbPostsTableActions.vue";
import Storage from "../services/storage.access";
export default {
  name: "AddFbPostPage",
  props: ["drawerStatusToggle"],
  components: {
    FbPostsTable,
    FbPostsTableActions
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
