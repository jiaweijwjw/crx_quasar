<template>
  <q-layout view="hHh lpr fff">
    <q-drawer
      v-model="sideDrawer"
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
              @click="toggleSideDrawer"
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
    <!-- q-page-sticky has to be at the bottom -->
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
import { mapGetters, mapActions } from "vuex";
import { uid } from "quasar";
export default {
  name: "BrowserLayout",
  data() {
    return {
      menuList: [
        {
          icon: "post_add",
          label: "Generic Add Chunk",
          route: "AddChunkPage"
        },
        {
          icon: "facebook",
          label: "Add FB Post",
          route: "AddFbPostPage"
        }
      ],
      thumbStyle: {
        borderRadius: "10px"
      }
    };
  },
  methods: {
    ...mapActions("chunkstore", ["initChunkData", "addChunk"]),
    ...mapActions("fbpoststore", ["initPostData", "addPost"]),
    ...mapActions("settingsstore", [
      "initCrxBrowser",
      "setDrawerStatusToggle",
      "setSideDrawer"
    ]),
    toggleDrawer() {
      this.drawerStatusToggle = !this.drawerStatusToggle;
    },
    toggleSideDrawer() {
      this.sideDrawer = !this.sideDrawer;
    }
  },
  computed: {
    ...mapGetters("settingsstore", ["getDrawerStatusToggle", "getSideDrawer"]),
    drawerStatusToggle: {
      get: function() {
        return this.getDrawerStatusToggle;
      },
      set: function(newStatus) {
        this.setDrawerStatusToggle(newStatus);
      }
    },
    sideDrawer: {
      get: function() {
        return this.getSideDrawer;
      },
      set: function(newStatus) {
        this.setSideDrawer(newStatus);
      }
    }
  },
  async created() {
    await this.initCrxBrowser();
    await this.initChunkData();
    await this.initPostData();

    let self = this;

    chrome.runtime.onMessage.addListener(function(
      parcel,
      sender,
      sendResponse
    ) {
      console.log(
        sender.tab
          ? "from a content script: " + sender.tab.url
          : "from the extension"
      );
      console.log(parcel.message);
      if (parcel.message == "new.chunk.added") {
        // from background script contextmenu
        let id = uid();
        let chunk = {
          id,
          text: parcel.content.text,
          url: parcel.content.url
        };
        self.addChunk(chunk); // cannot use 'this' as the 'this' context is not the same.
        sendResponse({ id: id });
      }

      if (parcel.message == "new.fb.post.added") {
        // from content script: facebook.com
        let id = uid();
        console.log(id);
        let post = {
          id,
          author: parcel.content.author,
          postBody: parcel.content.postBody,
          metaData: parcel.content.metaData,
          comments: parcel.content.comments
        };
        self.addPost(post);
        sendResponse({ id: id });
      }
    });
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
  min-width: 25px
  height: 10vw
  min-height: 100px
.open-sidedrawer-btn
  background-color: $background2
  color: $text-color
  width: 2vw
  min-width: 25px
  height: 10vw
  min-height: 100px
</style>
