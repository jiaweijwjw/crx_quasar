<template>
  <div>
    <q-btn
      dense
      label="download selected as txt"
      @click="save(tableActionOptions.SELECTED, tableActionOptions.TXT)"
      color="cyan"
    />
    <q-btn
      dense
      label="download all as txt"
      @click="save(tableActionOptions.ALL, tableActionOptions.TXT)"
      color="cyan"
    />
    <q-btn
      dense
      label="download selected as csv"
      @click="save(tableActionOptions.SELECTED, tableActionOptions.CSV)"
      color="magenta"
    />
    <q-btn
      dense
      label="download all as csv"
      @click="save(tableActionOptions.ALL, tableActionOptions.CSV)"
      color="magenta"
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
  name: "ChunksTableActions",
  data() {
    return {
      tableActionOptions
    };
  },
  methods: {
    ...mapActions("chunkstore", ["deleteChunks", "deleteAllChunks"]),
    async save(saveType, fileType) {
      let collated = [];
      let options = {};
      let fileName = "";
      if (fileType === this.tableActionOptions.TXT) {
        options = { type: "text/plain;charset=utf-8" };
        fileName = "default.txt";
        if (saveType === this.tableActionOptions.SELECTED) {
          collated = await this.collateChunks(this.getSelectedChunks);
        }
        if (saveType === this.tableActionOptions.ALL) {
          collated = await this.collateChunks(Object.values(this.getChunks));
        }
      }
      if (fileType === this.tableActionOptions.CSV) {
        options = { type: "data:text/csv;charset=utf-8" };
        fileName = "default.csv";
        if (saveType === this.tableActionOptions.SELECTED) {
          collated = await this.collateChunksCSV(this.getSelectedChunks);
        }
        if (saveType === this.tableActionOptions.ALL) {
          collated = await this.collateChunksCSV(Object.values(this.getChunks));
        }
      }
      let blob = new Blob([collated], options);
      saveAs(blob, fileName);
    },
    async collateChunks(chunksToCollate) {
      let selectedTextArray = chunksToCollate.map(chunk => chunk.text);
      let collated = "";
      for (let i = 0; i < selectedTextArray.length; i++) {
        collated += selectedTextArray[i];
        if (i !== selectedTextArray.length - 1) {
          collated += "\n \n";
        }
      }
      return collated;
    },
    async collateChunksCSV(chunksToCollate) {
      // chunksToCollate is an array of {id, text, url} objects
      let title = "Text, Url \n";
      let collated = title.concat(
        chunksToCollate.map(chunk => chunk.text + "," + chunk.url).join("\n")
      );
      return collated;
    },
    remove(removeType) {
      if (removeType === this.tableActionOptions.SELECTED) {
        this.deleteChunks(this.getSelectedChunks.map(chunk => chunk.id));
      }
      if (removeType === this.tableActionOptions.ALL) {
        this.deleteAllChunks();
      }
    }
  },
  computed: {
    ...mapGetters("chunkstore", ["getChunks", "getSelectedChunks"])
  }
};
</script>

<style lang="sass" scoped></style>
