<template>
  <v-card>
    <!-- ЛОГ -->
    <!-- <activity-log
      v-if="dialogs.activityLog"
      :show="dialogs.activityLog"
      @close="$store.dispatch('browserProfiles/closeDialog', 'activityLog')"
    /> -->

    <!-- КНОПКА НАСТРОЙКИ СТОЛБЦОВ -->
    <customize-columns />

    <!-- ТАБЛИЦА -->
    <v-data-table
      id="browser-profiles-main-table"
      v-model="browserProfiles.selected"
      :items="browserProfiles.all"
      item-key="id"
      :headers="cols"
      fixed-header
      :height="innerHeight - 46 - 32 - 38"
      :items-per-page="footerOptions.itemsPerPage"
      hide-default-footer
      show-select
      :loading="browserProfiles.loading.includes('mainTable')"
      class="browser-profiles-main-table anty-main-table elevation-1 resizableMainTableBrowserProfiles"
      :custom-sort="customSort"
      :sort-by="sortBy()"
      :sort-desc="sortDesc()"
      @toggle-select-all="toggleSelectAll"
    >
      <!-- БОДИ ТАБЛИЦЫ -->
      <template #body="{items}">
        <tbody>
          <tr
            v-for="browserProfile in items"
            :key="`row-${browserProfile.id}`"
          >
            <!-- ГАЛОЧКА -->
            <td :class="{'pinned-profile': browserProfile.pinned}">
              <v-checkbox
                :id="`checkbox-${browserProfile.id}`"
                :input-value="browserProfiles.selected.find(item => item.id === browserProfile.id) ? true : false"
                hide-details
                class="mt-0 pt-0 anty-main-table-checkbox"
                @click="selectMultipleItems($event, browserProfile)"
              />
            </td>

            <!-- НАЗВАНИЕ ПРОФИЛЯ -->
            <td>
              <name-cell :browser-profile="browserProfile" />
            </td>

            <!-- КНОПКА ЗАПУСТИТЬ -->
            <td class="px-0 browser-profiles-main-table-bring-to-top-button">
              <main-button :browser-profile="browserProfile" />
            </td>

            <!-- СТОЛБЦЫ -->
            <template v-if="profile && profile.columns && Array.isArray(profile.columns)">
              <td
                v-for="(col, index) in profile.columns"
                :key="`browserProfiles-cols-${index}-${col}`"
                :class="{'browser-profiles-main-table-proxy-cell': col === 'proxy', 'browser-profiles-main-table-tags-cell': col === 'tags'}"
              >
                <user-field-cell
                  v-if="col.startsWith('user-field-')"
                  :browser-profile="browserProfile"
                  :user-field-id="col.replace('user-field-', '')"
                />
                <component
                  :is="col"
                  v-else
                  :browser-profile="browserProfile"
                  :current-time="col === 'timer' ? currentTime : ''"
                />
              </td>
            </template>
          </tr>
        </tbody>
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="browserProfiles.loading.includes('mainTable')"
          :go-to-page-payload="{
            tags: pagination.tags,
            mainWebsites: pagination.mainWebsites,
            statuses: pagination.statuses,
            users: pagination.users
          }"
          go-to-page-action="browserProfiles/loadBrowserProfiles"
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
import mainTableColumnsResizeHandler from '@/mixins/mainTableColumnsResizeHandler.js'
import customSort from '@/mixins/customSort.js'
import MainWebsite from './BrowserProfilesMainTableCellMainWebsite.vue'
import Notes from './BrowserProfilesMainTableCellNotes.vue'
import Platform from './BrowserProfilesMainTableCellPlatform.vue'
import Proxy from './BrowserProfilesMainTableCellProxy.vue'
import Tags from './BrowserProfilesMainTableCellTags.vue'
import Timer from './BrowserProfilesMainTableCellTimer.vue'
import Worktime from './BrowserProfilesMainTableCellWorktime.vue'
import MainButton from './BrowserMainTableMainButton.vue'
import NameCell from './BrowserProfilesMainTableName.vue'
import UserFieldCell from './BrowserProfilesMainTableCellUserField.vue'
import ActivityLog from './BrowserMainTableActivityLog.vue'
import Status from './BrowserProfilesMainTableCellStatus.vue'
import LastEdited from './BrowserProfilesMainTableCellLastEdited.vue'
import CustomizeColumns from './BrowserProfilesMainTableCustomizeColumns.vue'
import Pagination from '../../parts/Pagination'

export default {
  name: 'BrowserProfilesMainTable',

  components: {
    MainWebsite,
    Notes,
    Platform,
    Proxy,
    Tags,
    Timer,
    Worktime,
    MainButton,
    NameCell,
    UserFieldCell,
    ActivityLog,
    Status,
    LastEdited,
    CustomizeColumns,
    Pagination
  },

  mixins: [
    mainTableColumnsResizeHandler,
    customSort
  ],

  data () {
    return {
      updateCurrentTimeInterval: 0,
      currentTime: 0,
      firstRow: null,
      secondRow: null
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfiles']),
    ...mapFields('main', ['profile']),
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      innerHeight: 'main/innerHeight',
      userFields: 'userFields/userFields',
      pagination: 'browserProfiles/pagination'
    }),

    cols () {
      const cols = []

      cols.push({
        text: this.$t('common.name'),
        value: 'name',
        width: this.profile.columnsWidth && this.profile.columnsWidth.name !== undefined ? parseInt(this.profile.columnsWidth.name, 10) : 250,
        class: 'column-name-name'
      })
      cols.push({
        value: 'actions',
        align: 'end',
        sortable: false,
        width: this.profile.columnsWidth && this.profile.columnsWidth.actions !== undefined ? parseInt(this.profile.columnsWidth.actions, 10) : 150,
        class: 'column-name-actions'
      })

      if (this.profile && this.profile.columns && Array.isArray(this.profile.columns)) {
        this.profile.columns.forEach(col => {
          const colData = {
            text: col.startsWith('user-field-') ? this.userFieldName(col.replace('user-field-', '')) : this.$t(`columns.browserProfiles.${col}`),
            value: `${col}`,
            sortable: col !== 'timer',
            width: this.profile.columnsWidth && this.profile.columnsWidth[col] !== undefined ? parseInt(this.profile.columnsWidth[col], 10) : 200,
            class: `column-name-${col}`
          }

          cols.push(colData)
        })
      }

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    }
  },

  watch: {
    'profile.columns': {
      deep: true,
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          setTimeout(() => {
            this.resizbaleColumns('BrowserProfiles')
          }, 1)
        }
      }
    }
  },

  created () {
    this.updateCurrentTimeInterval = setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)
  },

  mounted () {
    if (!this.$_.isEmpty(this.profile)) {
      setTimeout(() => {
        this.resizbaleColumns('BrowserProfiles')
      }, 1)
    }
  },

  beforeDestroy () {
    clearInterval(this.updateCurrentTimeInterval)
  },

  methods: {
    updateFooterOptions (options) {
      const payload = {
        page: options.page,
        itemsPerPage: options.itemsPerPage,
        query: this.pagination.query,
        tags: this.pagination.tags,
        mainWebsites: this.pagination.mainWebsites,
        statuses: this.pagination.statuses,
        users: this.pagination.users,
        sortBy: this.$store.getters['browserProfiles/filters'].sortBy,
        order: this.$store.getters['browserProfiles/filters'].order
      }
      this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
    },

    goToPage (page) {
      const payload = {
        page: page,
        itemsPerPage: this.pagination.perPage,
        query: this.pagination.query,
        tags: this.pagination.tags,
        mainWebsites: this.pagination.mainWebsites,
        statuses: this.pagination.statuses,
        users: this.pagination.users,
        sortBy: this.$store.getters['browserProfiles/filters'].sortBy,
        order: this.$store.getters['browserProfiles/filters'].order
      }
      this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
    },

    userFieldName (id) {
      const userField = this.userFields.all.find(item => parseInt(item.id, 10) === parseInt(id, 10))

      if (userField) {
        return userField.name
      }

      return this.$t('columns.browserProfiles.noSuchUserfield')
    },

    selectItem (browserProfile) {
      const browserProfileSelected = this.browserProfiles.selected.find(item => item.id === browserProfile.id)

      if (browserProfileSelected) {
        this.browserProfiles.selected = this.browserProfiles.selected.filter(item => item.id !== browserProfile.id)
      } else {
        this.browserProfiles.selected.push(browserProfile)
        const tableCheckboxes = Array.prototype.slice.call(document.getElementsByClassName('anty-main-table-checkbox'))

        tableCheckboxes.forEach((item, index) => {
          const checkboxId = item.querySelector('input[type="checkbox"]').id.split('-')[1]
          if (parseInt(checkboxId, 10) === parseInt(browserProfile.id, 10)) {
            this.firstRow = index
          }
        })
      }
    },

    selectMultipleItems (event, selectedBrowserProfile) {
      if (!event.shiftKey) {
        this.selectItem(selectedBrowserProfile)
        return
      }

      const tableCheckboxes = Array.prototype.slice.call(document.getElementsByClassName('anty-main-table-checkbox'))

      if (this.firstRow === null) {
        tableCheckboxes.forEach((item, index) => {
          const checkboxId = item.querySelector('input[type="checkbox"]').id.split('-')[1]
          if (!checkboxId) return

          if (parseInt(checkboxId, 10) === parseInt(selectedBrowserProfile.id, 10)) {
            this.firstRow = index

            const browserProfileSelected = this.browserProfiles.selected.find(item => parseInt(item.id, 10) === parseInt(checkboxId, 10))
            const browserProfile = this.browserProfiles.all.find(item => parseInt(item.id, 10) === parseInt(checkboxId, 10))

            if (!browserProfileSelected && browserProfile) {
              this.browserProfiles.selected.push(browserProfile)
            }
          }
        })
      } else if (this.secondRow === null) {
        tableCheckboxes.forEach((item, index) => {
          const checkboxId = item.querySelector('input[type="checkbox"]').id.split('-')[1]
          if (!checkboxId) return

          if (parseInt(checkboxId, 10) === parseInt(selectedBrowserProfile.id, 10)) {
            this.secondRow = index
          }
        })
      }

      if (this.firstRow !== null && this.secondRow !== null) {
        const firstIndex = Math.min(this.firstRow, this.secondRow)
        const secondIndex = Math.max(this.firstRow, this.secondRow)

        tableCheckboxes.forEach((item, index) => {
          if (index >= firstIndex && index <= secondIndex) {
            const checkboxId = item.querySelector('input[type="checkbox"]').id.split('-')[1]

            const browserProfileSelected = this.browserProfiles.selected.find(item => parseInt(item.id, 10) === parseInt(checkboxId, 10))
            const browserProfile = this.browserProfiles.all.find(item => parseInt(item.id, 10) === parseInt(checkboxId, 10))

            if (!browserProfileSelected && browserProfile) {
              this.browserProfiles.selected.push(browserProfile)
            }
          }
        })

        this.firstRow = this.secondRow
        this.secondRow = null
      }
    },

    toggleSelectAll () {
      this.firstRow = null
    },

    clearFirstRow () {
      this.firstRow = null
    }
  }
}
</script>
<style>
.pinned-profile {
  position: relative;
}
.pinned-profile::after {
  content: '';
  display: block;
  position: absolute;
  height: 100%;
  width: 5px;
  top: 0;
  left: 0;
  /* border-radius: 0 20px 20px 0; */
}
.theme--dark .pinned-profile::after {
  background: rgba(97,97,97, 0.3);
}
.theme--light .pinned-profile::after {
  background-color: #eeeeee;
}
</style>
