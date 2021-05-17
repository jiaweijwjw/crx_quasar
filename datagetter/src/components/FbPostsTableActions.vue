<template>
  <div>
    <q-btn
      dense
      label="download selected as json"
      @click="save(tableActionOptions.SELECTED, tableActionOptions.JSON)"
      color="cyan"
    />
    <q-btn
      dense
      label="download all as json"
      @click="save(tableActionOptions.ALL, tableActionOptions.JSON)"
      color="cyan"
    />
    <q-btn
      dense
      label="delete selected"
      @click="remove(tableActionOptions.SELECTED)"
      color="yellow"
    />
    <q-btn
      dense
      label="delete all"
      @click="remove(tableActionOptions.ALL)"
      color="yellow"
    />
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

<style lang="sass" scoped></style>
