<template>
  <div>
    <q-table
      :data="data"
      :columns="columns"
      :row-key="row => row.id"
      dense
      dark
      title="Text Chunks"
      :visible-columns="visibleColumns"
      color="cream"
      card-class="bg-background2 text-textColor"
      table-header-class="text-cream"
      title-class="text-magenta"
      rows-per-page-label="Chunks per page"
      :rows-per-page-options="[10, 0]"
      :pagination.sync="pagination"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No chunk added yet."
    >
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CollectedTableData",
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
          field: row => row.text,
          format: val => `${val}`,
          sortable: true,
          classes: "ellipsis",
          headerClasses: "text-yellow"
        },
        {
          name: "url",
          align: "left",
          label: "Url",
          field: row => row.url,
          sortable: true,
          classes: "ellipsis",
          headerClasses: "text-blue"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("chunkstore", ["getChunks", "getSelectedChunks"]),
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
  methods: {
    ...mapActions("chunkstore", ["setSelectedChunks"]),
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} chunk${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.data.length}`;
    }
  }
};
</script>

<style lang="sass" scoped></style>
