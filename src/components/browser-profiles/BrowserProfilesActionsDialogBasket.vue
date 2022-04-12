<template>
  <v-dialog
    :value="dialogs.basket"
    width="900"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'basket')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'basket')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="error"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('dialogs.basket.title',[basket.total]) }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'basket')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-5">
        <v-alert
          icon="fas fa-exclamation-triangle"
          type="warning"
          class="mb-0 mt-2"
        >
          {{ $t('dialogs.basket.warring') }}
        </v-alert>
        <br>

        <v-data-table

          v-model="basket.selected"
          :items="basket.profiles"
          item-key="id"
          :headers="cols"
          :loading="browserProfiles.loading.includes('mainBasket')"
          fixed-header
          :height="innerHeight - 500"
          :items-per-page="-1"
          hide-default-footer
          show-select
          class="anty-main-table"
        >
          <template #[`item.status`]="{item: browserProfile}">
            <main-table-cell-status
              :browser-profile="browserProfile"
              do-not-change
            />
          </template>

          <template #[`item.proxy`]="{item: browserProfile}">
            <main-table-cell-proxy
              :browser-profile="browserProfile"
              do-not-change
            />
          </template>

          <template #[`item.tags`]="{item: browserProfile}">
            <main-table-cell-tags
              :browser-profile="browserProfile"
              do-not-change
            />
          </template>
          <template #[`item.updated_at`]="{item: browserProfile}">
            <last-edited
              :browser-profile="browserProfile"
              do-not-change
            />
          </template>
        </v-data-table>
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'basket')"
        >
          {{ $t('common.cancelBasket') }}
        </v-btn>

        <v-btn
          v-if="basket.selected.length > 0"
          id="browserProfilesActionsDialogbasketConfirmButton"
          color="error"
          text
          :loading="buttonLoading"
          @click="basketRestoreProfiles"
        >
          {{ $t('common.restore') }}
        </v-btn>
      </v-card-actions>
      <!-- ФУТЕР -->
      <template>
        <pagination
          :disable-pagination="basket.loading.includes('mainBasket')"
          :go-to-page-payload="{
            tags: pagination.tags,
            mainWebsites: pagination.mainWebsites,
            statuses: pagination.statuses,
            users: pagination.users
          }"
          go-to-page-action="browserProfiles/loadBasket"
          :pagination="pagination"
          :footer-options="footerOptions"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import MainTableCellStatus from './main-table/BrowserProfilesMainTableCellStatus.vue'
import MainTableCellProxy from './main-table/BrowserProfilesMainTableCellProxy.vue'
import MainTableCellTags from './main-table/BrowserProfilesMainTableCellTags.vue'
import LastEdited from './main-table/BrowserProfilesMainTableCellLastEdited'
import Pagination from '../parts/Pagination'

export default {
  name: 'BrowserProfilesActionsDialogBasket',

  components: {
    MainTableCellStatus,
    MainTableCellProxy,
    MainTableCellTags,
    LastEdited,
    Pagination
  },

  data () {
    return {
      buttonLoading: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'browserProfiles/dialogs',
      pagination: 'browserProfiles/paginationBasket',
      innerHeight: 'main/innerHeight'
    }),
    ...mapFields('browserProfiles', ['basket']),
    ...mapFields('main', ['basket.profiles']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
      cols.push({ text: this.$t('common.status'), value: 'status' })
      cols.push({ text: this.$t('common.proxy'), value: 'proxy' })
      cols.push({ text: this.$t('common.tags'), value: 'tags' })
      cols.push({ text: this.$t('common.deleted_at'), value: 'updated_at' })

      return cols
    },
    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    }

  },
  async mounted () {
    await this.$store.dispatch('browserProfiles/loadBasket', { itemsPerPage: 100 })
  },

  methods: {
    async basketRestoreProfiles () {
      try {
        this.buttonLoading = true

        const data = {
          ids: this.basket.selected.map(item => parseInt(item.id, 10))
        }
        await this.$store.dispatch('browserProfiles/restoreProfiles', data)

        const identify = new this.$amplitude.Identify().add('profiles count', +data.ids.length)
        this.$amplitude.getInstance().identify(identify)

        this.$amplitude.getInstance().logEvent('Profile Restore')
      } catch (err) {
        console.error(err)
      } finally {
        this.buttonLoading = false
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('browserProfiles/loadCurrentPageBasket')
        this.$store.dispatch('main/getSubscription')
      }
    }

  }
}
</script>
