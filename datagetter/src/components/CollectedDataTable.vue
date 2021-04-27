<template>
  <div>
    <q-table
      :data="data"
      :columns="columns"
      :row-key="row => row.id"
      dense
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
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
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
    ...mapGetters("main", ["getChunks", "getSelectedChunks"]),
    data() {
      return Object.values(this.getChunks); // convert to an array of objects {id, text, url}
    },
    selected: {
      get: function() {
        return this.getSelectedChunks;
      },
      set: function(newSelection) {
        this.setSelectedChunks(newSelection);
      }
    }
  },
  watch: {
    selected: function(newSelection, oldSelection) {
      if (newSelection.length === 0) {
        console.log("clear selection");
        console.log(this.selected);
      } else if (newSelection.length > 0) {
        console.log("emit new selections");
        console.log(this.selected);
      }
    }
  },
  methods: {
    ...mapActions("main", ["addChunk", "setSelectedChunks"]),
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
        self.addChunk(chunk); // cannot use 'this' as the 'this' context is not correct somehow.
        console.log(self.getChunks);
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
