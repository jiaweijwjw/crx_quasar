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
      rows-per-page-label="Posts per page"
      :rows-per-page-options="[10, 0]"
      :pagination.sync="pagination"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No post added yet."
    >
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "FbPostsTable",
  data() {
    return {
      pagination: {
        rowsPerPage: 5
      },
      visibleColumns: ["author", "postText"],
      columns: [
        {
          name: "author",
          required: true,
          label: "Author",
          align: "left",
          field: row => row.author.name,
          format: val => `${val}`,
          sortable: true,
          style: "max-width: 20%",
          classes: "ellipsis"
        },
        {
          name: "postText",
          align: "left",
          label: "Post Text",
          field: row => row.postBody.text || row.postBody.blockQuote,
          sortable: true,
          style: "max-width: 80%",
          classes: "ellipsis"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("fbpoststore", ["getPosts", "getSelectedPosts"]),
    data() {
      return Object.values(this.getPosts); // convert to an array of objects
    },
    selected: {
      get: function() {
        return this.getSelectedPosts;
      },
      set: function(newSelection) {
        this.setSelectedPosts(newSelection);
      }
    }
  },
  methods: {
    ...mapActions("fbpoststore", ["addPost", "setSelectedPosts"]),
    getSelectedString() {
      return this.selected.length === 0
        ? ""
        : `${this.selected.length} post${
            this.selected.length > 1 ? "s" : ""
          } selected of ${this.data.length}`;
    }
  }
};
</script>

<style lang="sass" scoped></style>
