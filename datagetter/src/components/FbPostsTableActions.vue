<template>
  <div>
    <!-- <q-btn
      dense
      label="download selected"
      @click="save('selected', 'txt')"
      color="cyan"
    />
    <q-btn
      dense
      label="download all"
      @click="save('all', 'txt')"
      color="cyan"
    />
    <q-btn
      dense
      label="download selected as csv"
      @click="save('selected', 'csv')"
      color="magenta"
    />
    <q-btn
      dense
      label="download all as csv"
      @click="save('all', 'csv')"
      color="magenta"
    /> -->
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
    // async save(saveType, fileType) {
    //   let collated = [];
    //   let options = {};
    //   let fileName = "";
    //   if (fileType === "txt") {
    //     options = { type: "text/plain;charset=utf-8" };
    //     fileName = "default.txt";
    //     if (saveType === "all") {
    //       collated = await this.collateChunks(Object.values(this.getChunks));
    //     }
    //     if (saveType === "selected") {
    //       collated = await this.collateChunks(this.getSelectedChunks);
    //     }
    //   }
    //   if (fileType === "csv") {
    //     options = { type: "data:text/csv;charset=utf-8" };
    //     fileName = "default.csv";
    //     if (saveType === "all") {
    //       collated = await this.collateChunksCSV(Object.values(this.getChunks));
    //     }
    //     if (saveType === "selected") {
    //       collated = await this.collateChunksCSV(this.getSelectedChunks);
    //     }
    //   }
    //   let blob = new Blob([collated], options);
    //   saveAs(blob, fileName);
    // },
    // async collateChunks(chunksToCollate) {
    //   let selectedTextArray = chunksToCollate.map(chunk => chunk.text);
    //   let collated = "";
    //   for (let i = 0; i < selectedTextArray.length; i++) {
    //     collated += selectedTextArray[i];
    //     if (i !== selectedTextArray.length - 1) {
    //       collated += "\n \n";
    //     }
    //   }
    //   return collated;
    // },
    // async collateChunksCSV(chunksToCollate) {
    //   // chunksToCollate is an array of {id, text, url} objects
    //   let title = "Text, Url \n";
    //   let collated = title.concat(
    //     chunksToCollate.map(chunk => chunk.text + "," + chunk.url).join("\n")
    //   );
    //   return collated;
    // },
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
