<template>
  <q-page class="flex flex-center">
    <q-btn-toggle
      v-model="appStatusToggle"
      push
      color="background"
      text-color="textColor2"
      toggle-color="background2"
      toggle-text-color="cream"
      :options="options"
      @input="changeAppState"
    />
    <div v-if="appStatusToggle === true" class="page-item-container">
      <q-btn label="testdirect" @click="testdirect" />
      <q-btn label="testSetStorage" @click="testSetStorage('say', 'fuckkk')" />
      <q-btn label="testGetStorage" @click="testGetStorage('say')" />
      <q-btn label="testGetAll" @click="testGetAllStorage" />
      <q-btn label="testDeleteStorage" @click="testDeleteStorage" />
    </div>
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
      appStatusToggle: null,
      options: [
        { label: "on", value: true },
        { label: "off", value: false }
      ]
    };
  },
  methods: {
    changeAppState() {
      Storage.save("appStatusToggle", this.appStatusToggle);
    },
    testdirect() {
      this.$q.bex.send("testdirect", { msg: "hello" });
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
    testDeleteStorage() {
      Storage.delete("say");
    },
    async initialLoad() {
      Storage.get("appStatusToggle").then(res => {
        console.log("initialload, app is: " + res);
        if (!res) {
          // first time accessing the extension, appStatusToggle in storage will be undefined.
          this.appStatusToggle = false;
          Storage.save("appStatusToggle", false);
        } else {
          this.appStatusToggle = res;
        }
      });
    }
  },
  async created() {
    await this.initialLoad();
  }
};
</script>
<style lang="sass" scoped>
.q-page
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
.page-item-container
  display: flex
  flex-flow: column
  align-content: center
  align-items: center
.page-item
  display: block
  width: 100%
</style>
