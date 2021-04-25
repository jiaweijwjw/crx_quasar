<template>
  <div>
    <q-table
      :data="data"
      :columns="columns"
      :row-key="row => row.id"
      dark
      :visible-columns="visibleColumns"
      color="primary"
      rows-per-page-label="Chunks per page"
      :rows-per-page-options="[10, 0]"
      :pagination.sync="pagination"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No text added yet."
    >
    </q-table>
  </div>
</template>

<script>
import { uid } from "quasar";
import { mapGetters } from "vuex";
const util = require("util");
export default {
  data() {
    return {
      selected: [],
      pagination: {
        rowsPerPage: 5
      },
      visibleColumns: ["text", "url"],
      columns: [
        {
          name: "text",
          required: true,
          label: "Text",
          align: "left",
          // field: row => row.some.nested.prop,
          field: row => row.text,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "url",
          align: "left",
          label: "Url",
          field: "url",
          sortable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters("main", ["getChunks"]),
    data() {
      return Object.values(this.getChunks);
    }
  },
  watch: {
    selected: function(newSelection, oldSelection) {
      if (newSelection.length === 0) {
        console.log("clear selection");
        this.$emit("clearSelection");
      } else if (newSelection.length > 0) {
        console.log("emit new selections");
        let selectedProjsId = this.selected.map(proj => proj.id);
        this.$emit("updateSelection", selectedProjsId);
      }
    },
    isCleared: function(newVal, OldVal) {
      if (newVal === true) {
        this.selected = [];
      }
    }
  },
  methods: {
    getSelectedString() {
      // there is a @selection event
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} chunk${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.data.length}`;
    }
  },
  created() {
    let self = this;
    chrome.runtime.onMessage.addListener(function(
      parcel,
      sender,
      sendResponse
    ) {
      console.log(
        sender.tab
          ? "from a content script:" + sender.tab.url
          : "from the extension"
      );
      if (parcel.message == "new.chunk.added") {
        let id = uid();
        let chunk = {
          id,
          text: parcel.content.text,
          url: parcel.content.url
        };
        console.log(chunk);
        console.log(self.data); // cannot use this.data as the this context is not correct somehow.
        self.data.push(chunk);
        sendResponse({ id: id });
      }
    });
  }
};
</script>

<style lang="sass" scoped>
.my-table-details
    font-size: 0.85em
    font-style: italic
    max-width: 200px
    white-space: normal
    color: #555
    margin-top: 4px
</style>
