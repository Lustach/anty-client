<template>
  <div>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="settingsStatusesMainTable"
      v-model="statuses.selected"
      show-select
      item-key="id"
      :items="statuses.all"
      :headers="cols"
      fixed-header
      :items-per-page="footerOptions.itemsPerPage"
      hide-default-footer
      class="anty-main-table"
      :loading="loading.mainTable"
    >
      <!-- НАЗВАНИЕ -->
      <template #[`item.name`]="{item}">
        <v-chip
          outlined
          label
          small
          :color="item.color"
          style="text-transform: uppercase; font-weight: bold;"
        >
          {{ item.name }}
        </v-chip>

        <!-- ИКОНКА РЕДАКТИРОВАНИЯ -->
        <v-tooltip
          v-if="profile && profile.role === 'admin'"
          top
        >
          <template #activator="{ on }">
            <span
              :id="`settingsStatusesMainTableButtonEditFor-${item.id}`"
              class="anty-main-table-edit-button ml-2"
              @click="editStatus(item)"
              @mouseover="hover.edit = true"
              @mouseleave="hover.edit = false"
              v-on="on"
            >
              <ion-icon
                name="create-outline"
                size="small"
                :color="hover.edit ? 'primary' : ''"
                style="vertical-align: text-top;"
              />
            </span>
          </template>
          <span>{{ $t('common.edit') }}</span>
        </v-tooltip>
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          :short-pagination="true"
          :pagination="pagination"
          :footer-options="footerOptions"
          :items-per-page="[10,30,50]"
          go-to-page-action="browserProfilesStatuses/loadStatuses"
        />
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import Pagination from '../../../parts/Pagination'
export default {
  name: 'SettingsCategoriesStatusesMainTable',
  components: {
    Pagination
  },
  data () {
    return {
      hover: {
        edit: false
      }
    }
  },

  computed: {
    ...mapGetters({
      loading: 'browserProfilesStatuses/loading',
      pagination: 'browserProfilesStatuses/pagination',
      profile: 'main/profile'
    }),
    ...mapFields('browserProfilesStatuses', ['statuses']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    }
  },

  created () {
    const payload = localStorage.getItem('statuses-pagination') ? JSON.parse(localStorage.getItem('statuses-pagination')) : {}
    this.$store.dispatch('browserProfilesStatuses/loadStatuses', {
      page: payload.currentPage,
      itemsPerPage: payload.perPage
    })
  },

  methods: {
    async editStatus (status) {
      await this.$store.dispatch('browserProfilesStatuses/setUserFieldForMainDialog', status)
      await this.$store.dispatch('browserProfilesStatuses/setMainDialogMode', 'edit')
      await this.$store.dispatch('browserProfilesStatuses/openDialog', 'mainDialog')
    },

    updateFooterOptions (options) {
      const payload = {
        query: this.pagination.query,
        page: options.page,
        itemsPerPage: options.itemsPerPage
      }
      this.$store.dispatch('browserProfilesStatuses/loadStatuses', payload)
    }
  }
}
</script>
