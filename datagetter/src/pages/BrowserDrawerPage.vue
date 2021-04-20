<template>
  <q-page class="flex flex-center q-page-drawer">
    <q-btn outline icon="account_box" label="Login" class="q-mr-xs q-ml-md">
      <q-tooltip anchor="bottom middle" self="center middle" :offset="[15, 15]"
        >Login</q-tooltip
      >
    </q-btn>
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
      showDrawerToggle: false
    };
  }
  //   methods: {
  //     toggleDrawer() {
  //       Storage.save("showDrawerToggle", this.showDrawerToggle).then(res => {
  //         console.log("Data saved and returned: " + res);
  //         this.$q.bex
  //           .send("toggle.drawer", { openDrawer: this.showDrawerToggle })
  //           .then(res => {
  //             console.log("Should be an event response key???");
  //             console.log(res);
  //           });
  //       });
  //     },
  //     testSetStorage(someKey, someString) {
  //       Storage.save(someKey, someString);
  //     },
  //     testGetStorage(someKey) {
  //       Storage.get(someKey);
  //     },
  //     testGetAllStorage() {
  //       Storage.getAll().then(res => {
  //         console.log(res);
  //       });
  //     },
  //     toggleShowDrawerToggle() {
  //       Storage.save("showDrawerToggle", this.showDrawerToggle);
  //     },
  //     initialLoad() {
  //       // CAN TRY TO GET ALL??
  //       Storage.get("showDrawerToggle").then(res => {
  //         console.log("initialload: " + res);
  //       });
  //     }
  //   },
  //   computed: {
  //     // toggles: {
  //     //   get: function() {
  //     //     return this.getToggleSettings;
  //     //   },
  //     //   set: function(settingsArr) {
  //     //     this.setAnnotationSettings(settingsArr);
  //     //   }
  //     // }
  //   },
  //   created() {
  //     // attach the listeners
  //     this.$q.bex.on("toggle.drawer", this.toggleDrawer);
  //     // this.$q.bex.on('add.chunk', this.addChunk)

  //     this.initialLoad();
  //   },
  //   beforeDestroy() {
  //     this.$q.bex.off("toggle.drawer", this.toggleDrawer);
  //     // this.$q.bex.off('add.chunk', this.addChunk)
  //   }
  // async created() {
  //   this.$q.bex.on("drawer.status", event => {
  //     console.log(event);
  //     this.openDrawer = event.data; // event.data should be the status of the drawer from the popup page.
  //     bridge.send(event.eventResponseKey);
  //   });
  //   // await this.initialLoad()
  // }
};
</script>
<style lang="sass" scoped>
.q-page-drawer
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
  background-color: $background !important
  height: 100%
  width: 100%
.page-item
  display: block
  width: 100%
.q-toggle
  color: $cream
</style>
