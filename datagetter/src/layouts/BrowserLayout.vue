<template>
  <q-layout view="hHh lpr fff">
    <q-drawer
      v-model="sidedrawer"
      :width="250"
      :breakpoint="500"
      overlay
      dark
      elevated
      persistent
      content-class="bg-background2 text-cream"
    >
      <q-scroll-area class="fit" dark :thumb-style="thumbStyle">
        <q-list>
          <template v-for="(menuItem, index) in menuList">
            <q-item
              :key="index"
              clickable
              :to="{ name: menuItem.route }"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
      <q-page-sticky position="right">
        <q-btn
          dense
          ripple
          flat
          size="md"
          icon="keyboard_arrow_left"
          class="close-sidedrawer-btn"
          @click="toggleSideDrawer"
        />
      </q-page-sticky>
    </q-drawer>

    <q-page-container>
      <router-view :drawerStatusToggle="drawerStatusToggle" />
    </q-page-container>
    <q-page-sticky v-if="drawerStatusToggle" position="left">
      <q-btn
        dense
        ripple
        flat
        size="md"
        class="open-sidedrawer-btn"
        @click="toggleSideDrawer"
        ><span class="rotate-270">menu</span></q-btn
      >
    </q-page-sticky>
    <q-page-sticky :position="drawerStatusToggle ? 'top' : 'bottom'">
      <q-btn
        dense
        ripple
        flat
        size="xs"
        :icon="drawerStatusToggle ? 'expand_more' : 'expand_less'"
        class="sticky-btn"
        @click="toggleDrawer"
      />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import Storage from "../services/storage.access";
export default {
  name: "BrowserLayout",
  data() {
    return {
      drawerStatusToggle: null,
      sidedrawer: false,
      menuList: [
        {
          icon: "post_add",
          label: "Generic Add Chunk",
          route: "AddChunkPage"
        },
        {
          icon: "facebook",
          label: "Add FB Post",
          route: "AddFBPostPage"
        }
      ],
      thumbStyle: {
        borderRadius: "10px"
      }
    };
  },
  methods: {
    ...mapActions("main", ["initData"]),
    async initCrxSettings() {
      Storage.get("drawerStatusToggle").then(res => {
        console.log("initialload, drawer is: " + res);
        this.drawerStatusToggle = res;
      });
    },
    toggleDrawer() {
      this.drawerStatusToggle = !this.drawerStatusToggle;
      Storage.save("drawerStatusToggle", this.drawerStatusToggle);
      this.$q.bex.send("toggle.drawer", {
        showDrawer: this.drawerStatusToggle
      });
    },
    toggleSideDrawer() {
      this.sidedrawer = !this.sidedrawer;
    }
  },
  async created() {
    await this.initData();
    await this.initCrxSettings();
  }
};
</script>

<style lang="sass" scoped>
.q-layout
  background-color: transparent !important
  overflow: auto
.q-page-container
  background-color: transparent !important
.sticky-btn
  background-color: $background
  color: $cream
.close-sidedrawer-btn
  background-color: transparent
  color: $text-color
  width: 2vw
  height: 10vw
.open-sidedrawer-btn
  background-color: $background2
  color: $text-color
  width: 2vw
  height: 10vw
</style>
