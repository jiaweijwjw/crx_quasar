<template>
  <div>
    <q-table
      :data="data"
      :columns="columns"
      :row-key="row => row.id"
      dense
      dark
      :visible-columns="visibleColumns"
      color="cream"
      card-class="bg-background2 text-textColor"
      table-header-class="text-cream"
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
          classes: "ellipsis",
          style: "max-width: 50%",
          headerStyle: "max-width: 50%",
          sortable: true
        },
        {
          name: "url",
          align: "left",
          label: "Url",
          field: row => row.url,
          classes: "ellipsis",
          style: "max-width: 50%",
          headerStyle: "max-width: 50%",
          sortable: true
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

<style lang="sass" scoped>
.my-table-details
    font-size: 0.85em
    font-style: italic
    max-width: 200px
    white-space: normal
    color: #555
    margin-top: 4px
</style>
