<template>
  <div>
    <q-btn dense label="download selected" @click="save" color="cyan" />
  </div>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    async save() {
      let collated = await this.collateChunks();
      let blob = new Blob([collated], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "default.txt");
    },
    async collateChunks() {
      let selectedTextArray = this.getSelectedChunks.map(chunk => chunk.text);
      let collated = "";
      for (let i = 0; i < selectedTextArray.length; i++) {
        collated += selectedTextArray[i];
        if (i !== selectedTextArray.length - 1) {
          collated += "\n \n";
        }
      }
      console.log(collated);
      // Object.keys(obj).forEach(e => console.log(`key=${e}  value=${obj[e]}`));
      return collated;
    }
  },
  computed: {
    ...mapGetters("main", ["getSelectedChunks"])
  }
};
</script>

<style lang="sass" scoped></style>
