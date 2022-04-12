<template>
  <v-card>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="proxy-main-table"
      v-model="proxies.selected"
      :items="proxies.all"
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
      <!-- НАЗВАНИЕ ПРОКСИ -->
      <template #[`item.name`]="{item: proxy}">
        <name-cell :proxy="proxy" />
      </template>

      <!-- ТИП ПРОКСИ -->
      <template #[`item.type`]="{item: proxy}">
        <v-chip
          outlined
          label
          x-small
          color="primary"
        >
          {{ proxy.type.toUpperCase() }}
        </v-chip>
      </template>

      <!-- СТАТУС -->
      <template #[`item.status`]="{item: proxy}">
        <status-cell :proxy="proxy" />
      </template>

      <!-- ПРОФИЛИ -->
      <template #[`item.browser_profiles_count`]="{item: proxy}">
        <a @click="goToProfiles(proxy.id)">{{ proxy.browser_profiles_count }}</a>
      </template>
      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          go-to-page-action="proxy/loadProxies"
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
import NameCell from './ProxyMainTableName.vue'
import StatusCell from './ProxyMainTableStatus.vue'
import customSort from '@/mixins/customSort.js'
import Pagination from '../../parts/Pagination'

export default {
  name: 'ProxyMainTable',

  components: {
    NameCell,
    StatusCell,
    Pagination
  },

  mixins: [
    customSort
  ],

  computed: {
    ...mapGetters({
      loading: 'proxy/loading',
      innerHeight: 'main/innerHeight',
      pagination: 'proxy/pagination'
    }),
    ...mapFields('proxy', ['proxies']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
      cols.push({ text: this.$t('common.status'), value: 'status', width: 200 })
      cols.push({ text: this.$t('common.profiles'), value: 'browser_profiles_count', width: 200 })
      cols.push({ text: this.$t('common.type'), value: 'type', width: 100 })
      cols.push({ text: this.$t('common.host'), value: 'host', width: 200 })
      cols.push({ text: this.$t('common.port'), value: 'port', width: 100 })
      cols.push({ text: this.$t('common.login'), value: 'login', width: 100 })
      cols.push({ text: this.$t('common.password'), value: 'password', width: 150 })

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
    goToProfiles (proxyId) {
      const pagination = localStorage.getItem('browser-profiles-pagination') ? JSON.parse(localStorage.getItem('browser-profiles-pagination')) : {}
      pagination.proxies = [proxyId]
      localStorage.setItem('browser-profiles-pagination', JSON.stringify(pagination))

      this.$router.push({ path: '/' })
    }

  }
}
</script>
