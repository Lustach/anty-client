<template>
  <div>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="settingsUserFieldsMainTable"
      v-model="userFields.selected"
      show-select
      item-key="id"
      :items="userFields.all"
      :headers="cols"
      fixed-header
      :items-per-page="footerOptions.itemsPerPage"
      hide-default-footer
      class="anty-main-table"
      :loading="loading.mainTable"
    >
      <!-- НАЗВАНИЕ -->
      <template #[`item.name`]="{item: userField}">
        <main-table-name :user-field="userField" />
      </template>

      <!-- ВИДИМОСТЬ -->
      <template #[`item.visibility`]="{item: userField}">
        <main-table-visibility :user-field="userField" />
      </template>

      <!-- ТИП -->
      <template #[`item.type`]="{item: userField}">
        <span
          v-if="userField.type === 'textarea'"
          :id="`settingsUserFieldsMainTableCellType${capitalize(userField.type)}`"
        >
          {{ $t('common.userFields.bigText') }}
        </span>
        <span
          v-else
          :id="`settingsUserFieldsMainTableCellType${capitalize(userField.type)}`"
        >
          {{ $t(`common.userFields.${userField.type}`) }}
        </span>
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          :short-pagination="true"
          :pagination="pagination"
          :footer-options="footerOptions"
          :items-per-page="[10,30,50]"
          go-to-page-action="userFields/loadUserFields"
        />
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import MainTableName from './SettingsCategoriesUserFieldsMainTableName.vue'
import MainTableVisibility from './SettingsCategoriesUserFieldsMainTableVisibility.vue'

export default {
  name: 'SettingsCategoriesUserFieldsMainTable',

  components: {
    MainTableName,
    MainTableVisibility
  },

  computed: {
    ...mapGetters({
      loading: 'userFields/loading',
      pagination: 'userFields/pagination'
    }),
    ...mapFields('userFields', ['userFields']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('settings.userFields.field'), value: 'name' })
      cols.push({ text: this.$t('settings.userFields.visibility'), value: 'visibility', sortable: false })
      cols.push({ text: this.$t('settings.userFields.type'), value: 'type', sortable: false })

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    },

    footerPagination () {
      const pagination = {}

      pagination.page = this.pagination.currentPage
      pagination.itemsPerPage = this.pagination.perPage
      pagination.pageStart = this.pagination.from - 1
      pagination.pageStop = this.pagination.to
      pagination.pageCount = this.pagination.lastPage
      pagination.itemsLength = this.pagination.total

      return pagination
    }
  },

  created () {
    this.$store.dispatch('userFields/loadUserFields')
  },

  methods: {
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }

  }
}
</script>
