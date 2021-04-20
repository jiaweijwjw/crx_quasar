<template>
  <q-page class="flex flex-center q-page">
    <q-toggle
      v-model="showDrawerToggle"
      label="Show side drawer?"
      left-label
      checked-icon="check"
      unchecked-icon="clear"
      dark
      size="md"
      keep-color="true"
      color="primary"
      @input="toggleDrawer"
    />
    <q-btn label="testSetStorage" @click="testSetStorage('say', 'fuckkk')" />
    <q-btn label="testGetStorage" @click="testGetStorage('say')" />
    <q-btn label="testGetAll" @click="testGetAllStorage" />
  </q-page>
</template>

<script>
import Storage from "../services/storage.access";
export default {
  name: "PopupPage",
  // components: {
  //   SelfSelect: require("components/manualget/SelfSelect.vue").default
  // }
  data() {
    return {
      showDrawerToggle: false
    };
  },
  methods: {
    toggleDrawer() {
      Storage.save("showDrawerToggle", this.showDrawerToggle).then(res => {
        console.log("Data saved and returned: " + res);
        this.$q.bex
          .send("toggle.drawer", { openDrawer: this.showDrawerToggle })
          .then(res => {
            console.log("Should be an event response key???");
            console.log(res);
          });
      });
    },
    testSetStorage(someKey, someString) {
      Storage.save(someKey, someString);
    },
    testGetStorage(someKey) {
      Storage.get(someKey);
    },
    testGetAllStorage() {
      Storage.getAll().then(res => {
        console.log(res);
      });
    },
    toggleShowDrawerToggle() {
      Storage.save("showDrawerToggle", this.showDrawerToggle);
    },
    initialLoad() {
      // CAN TRY TO GET ALL??
      Storage.get("showDrawerToggle").then(res => {
        console.log("initialload: " + res);
      });
    }
  },
  computed: {
    // toggles: {
    //   get: function() {
    //     return this.getToggleSettings;
    //   },
    //   set: function(settingsArr) {
    //     this.setAnnotationSettings(settingsArr);
    //   }
    // }
  },
  created() {
    // attach the listeners
    this.$q.bex.on("toggle.drawer", this.toggleDrawer);
    // this.$q.bex.on('add.chunk', this.addChunk)

    this.initialLoad();
  },
  beforeDestroy() {
    this.$q.bex.off("toggle.drawer", this.toggleDrawer);
    // this.$q.bex.off('add.chunk', this.addChunk)
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
.q-toggle
  color: $cream
</style>
