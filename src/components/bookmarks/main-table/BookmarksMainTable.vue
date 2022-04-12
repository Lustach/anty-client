<template>
  <v-card>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="bookmarksMainTable"
      v-model="bookmarks.selected"
      :items="bookmarks.all"
      item-key="id"
      :headers="cols"
      fixed-header
      :height="innerHeight - 46 - 32 - 37"
      :items-per-page="footerOptions.itemsPerPage"
      hide-default-footer
      show-select
      class="anty-main-table"
      :custom-sort="customSort"
      :sort-by="sortBy()"
      :sort-desc="sortDesc()"
      :loading="loading.mainTable"
    >
      <!-- НАЗВАНИЕ -->
      <template #[`item.name`]="{item: bookmark}">
        <span
          class="anty-main-table-link"
          @click="edit(bookmark)"
        >
          {{ bookmark.name }}
        </span>
      </template>

      <!-- URL -->
      <template #[`item.url`]="{item: bookmark}">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <div
              style="width: 300px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
              v-bind="attrs"
              v-on="on"
            >
              {{ bookmark.url }}
            </div>
          </template>
          <span>{{ bookmark.url }}</span>
        </v-tooltip>
      </template>

      <!-- ОСНОВНОЙ САЙТ -->
      <template #[`item.mainWebsite`]="{item: bookmark}">
        <cell-main-website :bookmark="bookmark" />
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          go-to-page-action="bookmarks/loadBookmarks"
          :pagination="pagination"
          :footer-options="footerOptions"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import CellMainWebsite from './BookmarksMainTableCellMainWebiste.vue'
import customSort from '@/mixins/customSort.js'
import Pagination from '../../parts/Pagination'

export default {
  name: 'BookmarksMainTable',

  components: {
    CellMainWebsite, Pagination
  },

  mixins: [
    customSort
  ],

  computed: {
    ...mapGetters({
      loading: 'bookmarks/loading',
      innerHeight: 'main/innerHeight',
      pagination: 'bookmarks/pagination'
    }),
    ...mapFields('bookmarks', ['bookmarks']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
      cols.push({ text: 'URL', value: 'url', width: 300 })
      cols.push({ text: this.$t('common.mainWebsite'), value: 'mainWebsite' })

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    }

  },

  methods: {
    edit (bookmark) {
      this.$store.dispatch('bookmarks/setBookmarkForEdit', this.$_.cloneDeep(bookmark))
      this.$store.dispatch('bookmarks/openDialog', 'edit')
    },

    updateFooterOptions (options) {
      const payload = {
        query: this.pagination.query,
        page: options.page,
        itemsPerPage: options.itemsPerPage
      }
      this.$store.dispatch('bookmarks/loadBookmarks', payload)
    }
  }
}
</script>
