<template>
  <q-page
    class="flex flex-center"
    :class="drawerStatusToggle ? 'q-page-shown' : 'q-page-hidden'"
  >
    <q-page-sticky :position="drawerStatusToggle ? 'top' : 'bottom'">
      <q-btn
        dense
        ripple
        flat
        size="xs"
        :icon="drawerStatusToggle ? 'expand_more' : 'expand_less'"
        :class="drawerStatusToggle ? 'sticky-btn-shown' : 'sticky-btn-hidden'"
        @click="toggleDrawer"
      />
    </q-page-sticky>
    <div class="page-item" v-if="drawerStatusToggle">
      <collected-data-table />
    </div>
  </q-page>
</template>

<script>
import CollectedDataTable from "components/CollectedDataTable.vue";
import Storage from "../services/storage.access";
export default {
  name: "BrowserDrawerPage",
  components: {
    CollectedDataTable
  },
  data() {
    return {
      drawerStatusToggle: null
    };
  },
  methods: {
    toggleDrawer() {
      this.drawerStatusToggle = !this.drawerStatusToggle;
      Storage.save("drawerStatusToggle", this.drawerStatusToggle);
      this.$q.bex.send("toggle.drawer", {
        showDrawer: this.drawerStatusToggle
      });
    },
    async initialLoad() {
      Storage.get("drawerStatusToggle").then(res => {
        console.log("initialload, drawer is: " + res);
        this.drawerStatusToggle = res;
      });
    }
  },
  async created() {
    await this.initialLoad();
    this.$q.bex.on("testdirect", event => {
      const payload = event.data;
      if (payload.msg === " hello") {
        console.log("hello");
      }
    });
  },
  beforeDestroy() {}
};
</script>
<style lang="sass" scoped>
.q-page
  background-color: $background
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
.q-page-shown
  border-width: 1px 0 0 0
  border-style: solid
  border-color: $cream
.q-page-hidden
  background-color: transparent !important
.page-item
  display: block
  width: 90%
.sticky-btn-shown
  color: $cream
.sticky-btn-hidden
  background-color: $background
  color: $cream
</style>
