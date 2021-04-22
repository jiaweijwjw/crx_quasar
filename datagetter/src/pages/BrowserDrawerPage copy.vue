<template>
  <q-page
    class="flex flex-center"
    :class="drawerStatusToggle ? 'q-page-shown' : 'q-page-hidden'"
  >
    <q-page-sticky
      :position="drawerStatusToggle ? 'top' : 'bottom'"
      :expand="!drawerStatusToggle"
      :class="drawerStatusToggle ? '' : 'full-page-btn'"
    >
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
    <div v-if="drawerStatusToggle">
      <q-btn
        color="pink"
        outline
        icon="account_box"
        label="Login"
        class="q-mr-xs q-ml-md"
      >
        <q-tooltip
          anchor="bottom middle"
          self="center middle"
          :offset="[15, 15]"
          >Login</q-tooltip
        >
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import Storage from "../services/storage.access";
export default {
  name: "BrowserDrawerPage",
  // components: {
  //   SelfSelect: require("components/manualget/SelfSelect.vue").default
  // }
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
      // Handle the changes in UI here
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
  border-color: $pink
.q-page-hidden
  background-color: transparent !important
.page-item
  display: block
  width: 100%
.q-tooltip
  background-color: $grey
  color: $cream
.full-page-btn
  height: 100%
  width: 100%
.sticky-btn-shown
  color: $cream
.sticky-btn-hidden
  background-color: $background
  color: $cream
.test
  background-color: $text-color
</style>
