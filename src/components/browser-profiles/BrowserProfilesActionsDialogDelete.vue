<template>
  <v-dialog
    :value="dialogs.delete"
    width="800"
    height="800"
    :overlay-opacity="0.9"
    scrollable
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'delete')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="error"
        class="pr-0"
      >
        <v-toolbar-title v-if="forDialogs.singleDelete">
          {{ $t('dialogs.deleteBrowserProfiles.youAreDeleting') +
            ' ' + 1 + ' ' +
            $tc('browserProfiles.profiles', 1)
          }}
        </v-toolbar-title>
        <v-toolbar-title v-else>
          {{ $t('dialogs.deleteBrowserProfiles.youAreDeleting') +
            ' ' + browserProfiles.selected.length + ' ' +
            $tc('browserProfiles.profiles', browserProfiles.selected.length)
          }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'delete')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-data-table
          :items="browserProfilesForDeleting"
          item-key="id"
          :headers="cols"
          fixed-header
          :height="innerHeight - 350"
          :items-per-page="-1"
          hide-default-footer
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
        </v-data-table>
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          id="browserProfilesActionsDialogDeleteConfirmButton"
          color="error"
          text
          :loading="loading"
          @click="deleteBrowserProfiles"
        >
          {{ $t('common.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import MainTableCellStatus from './main-table/BrowserProfilesMainTableCellStatus.vue'
import MainTableCellProxy from './main-table/BrowserProfilesMainTableCellProxy.vue'
import MainTableCellTags from './main-table/BrowserProfilesMainTableCellTags.vue'

export default {
  name: 'BrowserProfilesActionsDialogDelete',

  components: {
    MainTableCellStatus,
    MainTableCellProxy,
    MainTableCellTags
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'browserProfiles/dialogs',
      innerHeight: 'main/innerHeight'
    }),
    ...mapFields('browserProfiles', ['forDialogs']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
      cols.push({ text: this.$t('common.status'), value: 'status' })
      cols.push({ text: this.$t('common.proxy'), value: 'proxy' })
      cols.push({ text: this.$t('common.tags'), value: 'tags' })

      return cols
    },

    browserProfilesForDeleting () {
      if (this.forDialogs.singleDelete) {
        return [this.browserProfiles.all.find(i => parseInt(i.id, 10) === parseInt(this.forDialogs.browserProfileId, 10))]
      }
      return this.browserProfiles.selected
    }
  },

  methods: {
    async deleteBrowserProfiles () {
      try {
        this.loading = true

        const data = {}
        if (this.forDialogs.singleDelete) {
          data.ids = [parseInt(this.forDialogs.browserProfileId, 10)]
        } else {
          data.ids = this.browserProfiles.selected.map(item => parseInt(item.id, 10))
        }

        const browserProfilesDeleted = await this.$store.dispatch('browserProfiles/deleteBrowserProfiles', data)

        if (browserProfilesDeleted) {
          if (this.forDialogs.singleDelete) {
            const identify = new this.$amplitude.Identify().add('profiles count', -1)
            this.$amplitude.getInstance().identify(identify)

            this.$amplitude.getInstance().logEvent('Profile Delete')
          } else {
            const identify = new this.$amplitude.Identify().add('profiles count', -data.ids.length)
            this.$amplitude.getInstance().identify(identify)

            data.ids.forEach(() => {
              this.$amplitude.getInstance().logEvent('Profile Delete')
            })
          }
        }

        await this.$store.dispatch('browserProfiles/closeDialog', 'delete')

        this.forDialogs.singleDelete = false
        this.forDialogs.browserProfileId = null
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('main/getSubscription')
        this.$store.dispatch('browserProfiles/loadTags')
      }
    }
  }
}
</script>
