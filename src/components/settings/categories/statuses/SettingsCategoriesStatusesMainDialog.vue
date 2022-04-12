<template>
  <v-dialog
    id="settingsStatusesMainDialog"
    :value="dialogs.mainDialog"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card @keyup.enter="onEnter">
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ mainDialogMode === 'AddNew' ? $t('settings.statuses.addNew') : $t('settings.statuses.createStatus') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="close"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-5">
        <v-row>
          <v-col
            :cols="12"
            class="d-flex align-center justify-space-between"
          >
            <!-- НАЗВАНИЕ -->
            <v-text-field
              id="settingsStatusesMainDialogTextFieldName"
              v-model="statuses.forMainDialog.name"
              :label="$t('common.name')"
              dense
              outlined
              hide-details
              class="mr-2"
              :spellcheck="false"
            />

            <!-- ЦВЕТА -->
            <v-btn
              v-for="color in ['red', 'orange', 'green', 'blue', 'purple']"
              :id="`settingsStatusesMainDialogButtonColor${capitalize(color)}`"
              :key="`anty-settings-statuses-color-${color}`"
              icon
              x-small
              :color="color"
              @click="statuses.forMainDialog.color = color"
            >
              <v-icon v-if="statuses.forMainDialog.color === color">
                fas fa-check-circle
              </v-icon>
              <v-icon v-else>
                fas fa-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          id="settingsStatusesMainDialogButtonClose"
          small
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="settingsStatusesMainDialogButtonCreateOrUpdate"
          small
          text
          color="primary"
          :disabled="statuses.forMainDialog.name && statuses.forMainDialog.name.length === 0"
          :loading="loading"
          @click="createOrUpdateUserField"
        >
          {{ createButtonText() }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'SettingsCategoriesStatusesMainDialog',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfilesStatuses/dialogs',
      selectedProfile: 'browserProfilesStatuses/selectedProfile',
      mainDialogMode: 'browserProfilesStatuses/mainDialogMode',
      pagination: 'browserProfilesStatuses/pagination'
    }),
    ...mapFields('browserProfilesStatuses', ['statuses'])
  },

  beforeDestroy () {
    this.$store.dispatch('browserProfilesStatuses/clearStatusForMainDialog')
    this.$store.dispatch('browserProfilesStatuses/setMainDialogMode', 'create')
    this.$store.commit('browserProfilesStatuses/SET_SELECTED_PROFILE', false)
  },

  methods: {
    createButtonText () {
      if (this.mainDialogMode === 'edit') {
        return this.$t('common.save')
      } else if (this.mainDialogMode === 'AddNew') {
        return this.$t('common.add')
      } else {
        return this.$t('common.create')
      }
    },
    close () {
      this.$store.dispatch('browserProfilesStatuses/closeDialog', 'mainDialog')
    },

    onEnter () {
      if (!(this.statuses.forMainDialog.name && this.statuses.forMainDialog.name.length === 0)) {
        this.createOrUpdateUserField()
      }
    },
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },

    async createOrUpdateUserField () {
      this.loading = true

      if (this.mainDialogMode === 'edit') {
        const data = { ...this.statuses.forMainDialog }
        delete data.id

        const response = await this.api.patch(`/browser_profiles/statuses/${this.statuses.forMainDialog.id}`, data)
        if (response.status === 200) {
          this.$store.dispatch('browserProfilesStatuses/replaceStatus', response.data.data)
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
        }
      } else {
        const type = this.mainDialogMode === 'AddNew' ? 'custom' : 'common'
        const response = await this.api.post('/browser_profiles/statuses', {
          type, profile: this.selectedProfile, ...this.statuses.forMainDialog
        })
        if (response.status === 200) {
          const payload = {
            query: this.pagination.query,
            page: this.pagination.currentPage,
            itemsPerPage: this.pagination.perPage
          }
          await this.$store.dispatch('browserProfilesStatuses/loadStatuses', payload)
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.added') })

          if (type === 'custom') {
            await this.$store.dispatch('browserProfiles/loadCurrentPage')
          }

          const identify = new this.$amplitude.Identify().add('status сount', 1)
          this.$amplitude.getInstance().identify(identify)

          this.$amplitude.getInstance().logEvent('Status Add')
        }
      }

      this.close()

      this.loading = false
    }
  }

}
</script>
