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
    />
    <div v-if="appStatusToggle === true" class="page-item-container">
      <!-- Insert extension settings here -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PopupPage",
  data() {
    return {
      options: [
        { label: "on", value: true },
        { label: "off", value: false }
      ]
    };
  },
  methods: {
    ...mapActions("settingsstore", ["setAppStatusToggle"])
  },
  computed: {
    ...mapGetters("settingsstore", ["getAppStatusToggle"]),
    appStatusToggle: {
      get: function() {
        return this.getAppStatusToggle;
      },
      set: function(newStatus) {
        this.setAppStatusToggle(newStatus);
      }
    }
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
