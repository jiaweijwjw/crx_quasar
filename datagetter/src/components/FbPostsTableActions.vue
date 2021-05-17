<template>
  <div>
    <q-btn
      dense
      label="download selected as json"
      @click="save('selected', 'json')"
      color="cyan"
    />
    <q-btn
      dense
      label="download all as json"
      @click="save('all', 'json')"
      color="cyan"
    />
    <q-btn
      dense
      label="delete selected"
      @click="remove('selected')"
      color="yellow"
    />
    <q-btn dense label="delete all" @click="remove('all')" color="yellow" />
  </div>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "FbPostsTableActions",
  data() {
    return {};
  },
  methods: {
    ...mapActions("fbpoststore", ["deletePosts", "deleteAllPosts"]),
    async save(saveType, fileType) {
      let collated = [];
      let options = {};
      let fileName = "";
      if (fileType === "json") {
        // saved as a JSONArray
        options = { type: "application/json" };
        fileName = "default.json";
        if (saveType === "all") {
          collated = await this.collatePostsToJSON(
            Object.values(this.getPosts)
          );
        }
        if (saveType === "selected") {
          collated = await this.collatePostsToJSON(this.getSelectedPosts);
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
      if (removeType === "selected") {
        this.deletePosts(this.getSelectedPosts.map(post => post.id));
      }
      if (removeType === "all") {
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
