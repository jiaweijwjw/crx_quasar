<template>
  <div class="row">
    <q-space />
    <q-btn-dropdown outline rounded text-color="textColor" label="Actions">
      <q-list separator dense bordered class="actions-list">
        <q-item
          clickable
          v-close-popup
          class="actions-item-download-json"
          @click="save(tableActionOptions.SELECTED, tableActionOptions.JSON)"
        >
          <q-item-section>
            <q-item-label>Download selected as json</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-download-json"
          @click="save(tableActionOptions.ALL, tableActionOptions.JSON)"
        >
          <q-item-section>
            <q-item-label>Download all as json</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-delete"
          @click="remove(tableActionOptions.SELECTED)"
        >
          <q-item-section>
            <q-item-label>Delete selected</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-delete"
          @click="remove(tableActionOptions.ALL)"
        >
          <q-item-section>
            <q-item-label>Delete all</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters, mapActions } from "vuex";
import { tableActionOptions } from "../services/enums";
export default {
  name: "FbPostsTableActions",
  data() {
    return {
      tableActionOptions
    };
  },
  methods: {
    ...mapActions("fbpoststore", ["deletePosts", "deleteAllPosts"]),
    async save(saveType, fileType) {
      let collated = [];
      let options = {};
      let fileName = "";
      if (fileType === this.tableActionOptions.JSON) {
        // saved as a JSONArray
        options = { type: "application/json" };
        fileName = "default.json";
        if (saveType === this.tableActionOptions.SELECTED) {
          collated = await this.collatePostsToJSON(this.getSelectedPosts);
        }
        if (saveType === this.tableActionOptions.ALL) {
          collated = await this.collatePostsToJSON(
            Object.values(this.getPosts)
          );
        }
      }
      let blob = new Blob([collated], options);
      saveAs(blob, fileName);
    },
    async collatePostsToJSON(postsToCollate) {
      console.log(postsToCollate);
      let collated = [];
      for (let i = 0; i < postsToCollate.length; i++) {
        collated.push(postsToCollate[i]);
      }
      return JSON.stringify(collated);
    },
    remove(removeType) {
      if (removeType === this.tableActionOptions.SELECTED) {
        this.deletePosts(this.getSelectedPosts.map(post => post.id));
      }
      if (removeType === this.tableActionOptions.ALL) {
        this.deleteAllPosts();
      }
    }
  },
  computed: {
    ...mapGetters("fbpoststore", ["getPosts", "getSelectedPosts"])
  }
};
</script>

<style lang="sass" scoped>
.actions-list
  background-color: $background2
.actions-item-delete
  color: $red
.actions-item-download-json
  color: $green
</style>
