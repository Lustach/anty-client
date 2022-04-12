<template>
  <v-card>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="extensionsMainTable"
      v-model="extensions.selected"
      :items="extensions.all"
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
      <template #[`item.name`]="{item: extension}">
        <!-- ИКОНКА -->
        <v-avatar
          v-if="extension.favicon"
          :size="32"
          class="mr-1"
        >
          <v-img :src="extension.favicon" />
        </v-avatar>
        <span
          class="anty-main-table-link"
          @click="openExternal(extension.url)"
        >{{ extension.name }}</span>
      </template>

      <!-- ОСНОВНОЙ САЙТ -->
      <template #[`item.mainWebsite`]="{item: extension}">
        <cell-main-website :extension="extension" />
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          go-to-page-action="extensions/loadExtensions"
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
import CellMainWebsite from './ExtensionsMainTableCellMainWebiste.vue'
import customSort from '@/mixins/customSort.js'
import Pagination from '../../parts/Pagination'

export default {
  name: 'ExtensionsMainTable',

  components: {
    CellMainWebsite,
    Pagination
  },

  mixins: [
    customSort
  ],

  computed: {
    ...mapGetters({
      loading: 'extensions/loading',
      innerHeight: 'main/innerHeight',
      pagination: 'extensions/pagination'
    }),
    ...mapFields('extensions', ['extensions']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
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
    openExternal (url) {
      if (!window.ipcRenderer) return

      window.ipcRenderer.send('open_external_link', url)
    }
  }
}
</script>
