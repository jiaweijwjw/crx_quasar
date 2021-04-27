<template>
  <div>
    <q-btn
      dense
      label="download selected"
      @click="save('selected')"
      color="cyan"
    />
    <q-btn dense label="download all" @click="save('all')" color="cyan" />
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
  data() {
    return {};
  },
  methods: {
    ...mapActions("main", ["deleteChunks", "deleteAllChunks"]),
    async save(quantityStr) {
      let collated = [];
      if (quantityStr === "all") {
        collated = await this.collateChunks(Object.values(this.getChunks));
      }
      if (quantityStr === "selected") {
        collated = await this.collateChunks(this.getSelectedChunks);
      }
      let blob = new Blob([collated], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "default.txt");
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
    remove(quantityStr) {
      if (quantityStr === "selected") {
        this.deleteChunks(this.getSelectedChunks.map(chunk => chunk.id));
      }
      if (quantityStr === "all") {
        this.deleteAllChunks();
      }
    }
  },
  computed: {
    ...mapGetters("main", ["getChunks", "getSelectedChunks"])
  }
};
</script>

<style lang="sass" scoped></style>
