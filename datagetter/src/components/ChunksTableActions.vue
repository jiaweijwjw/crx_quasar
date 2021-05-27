<template>
  <div class="row">
    <q-space />
    <q-btn-dropdown outline rounded text-color="textColor" label="Actions">
      <q-list separator dense bordered class="actions-list">
        <q-item
          clickable
          v-close-popup
          class="actions-item-download-txt"
          @click="save(tableActionOptions.SELECTED, tableActionOptions.TXT)"
        >
          <q-item-section>
            <q-item-label>Download selected as txt</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-download-txt"
          @click="save(tableActionOptions.ALL, tableActionOptions.TXT)"
        >
          <q-item-section>
            <q-item-label>Download all as txt</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-download-csv"
          @click="save(tableActionOptions.SELECTED, tableActionOptions.CSV)"
        >
          <q-item-section>
            <q-item-label>Download selected as csv</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="actions-item-download-csv"
          @click="save(tableActionOptions.ALL, tableActionOptions.CSV)"
        >
          <q-item-section>
            <q-item-label>Download all as csv</q-item-label>
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
  name: "ChunksTableActions",
  data() {
    return {
      tableActionOptions
    };
  },
  methods: {
    ...mapActions("chunkstore", ["deleteChunks", "deleteAllChunks"]),
    async save(saveType, fileType) {
      // Can extract saving of files functionality into a service.
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
        chunksToCollate
          .map(chunk => {
            const textPortion = chunk.text.replace(/"/g, '""'); // regex g modifier to replace all. or use the replaceAll() function.
            const urlPortion = chunk.url.replace(/"/g, '""');
            return `\"` + textPortion + `\"` + "," + `\"` + urlPortion + `\"`;
          })
          .join("\n")
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

<style lang="sass" scoped>
.actions-list
  background-color: $background2
.actions-item-delete
  color: $red
.actions-item-download-txt
  color: $violet
.actions-item-download-csv
  color: $cyan
</style>
