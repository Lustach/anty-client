<template>
  <div>
    <v-dialog
      v-model="parallelStartWarning"
      width="800"
      :overlay-opacity="0.9"
      scrollable
      :transition="false"
    >
      <v-card>
        <v-card-text class="pt-5">
          <v-alert
            type="warning"
            dense
            text
            class="mb-0 mt-2"
          >
            {{ $t('browserProfiles.parallelStartWarning') }}
          </v-alert>

          <v-checkbox
            v-model="doNotShowWarning"
            :label="$t('dialogs.warning.doNotShowWarning')"
            hide-details
            @change="handleWarningChange"
          />
        </v-card-text>

        <!-- КНОПКИ ДИАЛОГА -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="grey"
            @click="parallelStartWarning = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="startBrowserProfiles"
          >
            {{ $t('common.start') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      v-if="browserProfiles.selected.length > 0"
      :class="['actions-containter', 'elevation-24']"
    >
      <!-- ТЕГИ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            :disabled="disableUi"
            v-on="on"
            @click="$store.dispatch('browserProfiles/openDialog', 'tags')"
          >
            <ion-icon
              name="pricetags-outline"
              style="font-size: 22px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.tags') }}</span>
      </v-tooltip>

      <!-- ЭКСПОРТИРОВАТЬ КУКИСЫ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            :disabled="disableUi"
            :loading="loading.includes('exportCookies')"
            v-on="on"
            @click="exportCookies"
          >
            <ion-icon
              name="download-outline"
              style="font-size: 22px;"
              v-on="on"
            />
          </v-btn>
        </template>
        <span>{{ $t('browserProfiles.exportCookies') }}</span>
      </v-tooltip>

      <!-- ПОДЕЛИТЬСЯ -->
      <!-- <v-tooltip top>
      <template #activator="{ on }">
        <v-btn
          :color="disableShare ? 'rgba(255, 255, 255, 0.3)' : 'white'"
          dark
          icon
          :disabled="disableUi"
          v-on="on"
          @click="disableShare ? null : $store.dispatch('browserProfiles/openDialog', 'share')"
        >
          <ion-icon
            name="share-social-outline"
            style="font-size: 22px;"
            alt=""
            title=""
            v-on="on"
          />
        </v-btn>
      </template>
      <span>{{ disableShare ? $t('browserProfiles.shareDisabledTooltip') : $t('common.share') }}</span>
    </v-tooltip> -->

      <!-- ПЕРЕДАТЬ ПРОФИЛИ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            :color="disableShare ? 'rgba(255, 255, 255, 0.3)' : 'white'"
            dark
            icon
            v-on="on"
            @click="disableShare ? null : transfer()"
          >
            <ion-icon
              name="arrow-redo-outline"
              style="font-size: 24px;"
            />
          </v-btn>
        </template>
        <span>{{ disableShare ? $t('browserProfiles.shareDisabledTooltip') : $t('browserProfiles.transfer') }}</span>
      </v-tooltip>

      <!-- ПРОКСИ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            :disabled="disableUi"
            v-on="on"
            @click="changeProxy"
          >
            <ion-icon
              name="wifi-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.proxyChange') }}</span>
      </v-tooltip>

      <!-- ЗАПУСТИТЬ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            large
            :disabled="disableUi"
            v-on="on"
            @click="chromeExists ? initStartBrowserProfiles() : openDialogChromeNotFound()"
          >
            <ion-icon
              name="play-outline"
              style="font-size: 26px; margin-left: 3px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.profilesStart') }}</span>
      </v-tooltip>

      <!-- ОСТАНОВИТЬ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            :disabled="disableUi"
            v-on="on"
            @click="stopBrowserProfiles"
          >
            <ion-icon
              name="pause-outline"
              style="font-size: 24px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.profilesStop') }}</span>
      </v-tooltip>

      <!-- УДАЛИТЬ -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            id="globalActionDeleteButton"
            :color="disableDelete ? 'rgba(255, 255, 255, 0.3)' : 'white'"
            dark
            icon
            v-on="on"
            @click="disableDelete ? null : $store.dispatch('browserProfiles/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 24px;"
            />
          </v-btn>
        </template>
        <span>{{ disableDelete ? $t('browserProfiles.deleteDisabledTooltip') : $t('common.profilesDelete') }}</span>
      </v-tooltip>

      <!-- Очистить профили -->
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
            @click="$store.dispatch('browserProfiles/clearSelected')"
            @mouseover="showClearSelected = false"
            @mouseleave="showClearSelected = true"
          >
            <span
              v-if="showClearSelected"
              style="font-size: 18px;"
            >
              {{ browserProfiles.selected.length }}
            </span>
            <ion-icon
              v-else
              name="close-outline"
              style="font-size: 22px;"
            />
          </v-btn>
        </template>

        <span>{{ $t('common.clear') }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import EmptyBrowserProfile from '@/constants/browserProfiles/emptyBrowserProfile.js'
import amplitude from '@/mixins/amplitude.js'
import browserProfileActions from '@/mixins/browserProfileActions.js'

export default {
  name: 'BrowserProfilesActions',

  mixins: [
    amplitude,
    browserProfileActions
  ],

  data () {
    return {
      showClearSelected: true,
      parallelStartWarning: false,
      doNotShowWarning: false,
      loading: []
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      chromeExists: 'browserProfiles/chromeExists',
      disableUi: 'main/disableUi'
    }),
    ...mapFields('browserProfiles', ['forDialogs']),

    disableShare () {
      let disabled = false

      if (this.browserProfiles.selected &&
        Array.isArray(this.browserProfiles.selected) &&
        this.browserProfiles.selected.length > 0
      ) {
        this.browserProfiles.selected.forEach(item => {
          if (item.access && !item.access.share) {
            disabled = true
          }
        })
      }

      return disabled
    },

    disableDelete () {
      let disabled = false

      if (this.browserProfiles.selected &&
        Array.isArray(this.browserProfiles.selected) &&
        this.browserProfiles.selected.length > 0
      ) {
        this.browserProfiles.selected.forEach(item => {
          if (item.access && !item.access.delete) {
            disabled = true
          }
        })
      }

      return disabled
    }
  },

  methods: {
    initStartBrowserProfiles () {
      if (this.teamProfileRunning() && !localStorage.getItem('browserProfilesDoNotShowParallelStartWarning')) {
        this.parallelStartWarning = true
      } else {
        this.startBrowserProfiles()
      }
    },

    startBrowserProfiles () {
      if (this.parallelStartWarning) this.parallelStartWarning = false

      for (const profile of this.browserProfiles.selected) {
        this.checkBeforeStartBrowserProfiles(profile)
      }
    },

    teamProfileRunning () {
      let exists = false

      for (const profile of this.browserProfiles.selected) {
        if (this.browserProfiles.teamProfileRunning.findIndex(i => i.id === parseInt(profile.id, 10)) > -1) {
          exists = true
        }
      }

      return exists
    },

    async stopBrowserProfiles () {
      for (const profile of this.browserProfiles.selected) {
        this.checkBeforeStopBrowserProfiles(profile)
      }
    },

    async checkBeforeStartBrowserProfiles (profile) {
      if (!this.browserProfiles.running.includes(profile.id)) {
        this.$store.dispatch('browserProfiles/addLoading', parseInt(profile.id, 10))
        this.browserProfileActionsStart(profile, false)
        this.amplitudeSendProfileStart(profile)
      }
    },

    async checkBeforeStopBrowserProfiles (profile) {
      if (this.browserProfiles.running.includes(profile.id)) {
        this.browserProfileActionsStop(profile, false)
      }
    },

    async changeProxy () {
      await this.$store.dispatch('browserProfiles/setEmptyBrowserProfile', this.$_.cloneDeep(EmptyBrowserProfile))
      this.$store.dispatch('browserProfiles/openDialog', 'changeProxy')
    },

    async exportCookies () {
      this.loading.push('exportCookies')
      try {
        const browserProfiles = this.browserProfiles.selected.map((browserProfile) => {
          return {
            id: browserProfile.id,
            name: browserProfile.name
          }
        })
        const response = await this.localApi.post('/export-cookies', { browserProfiles })
        const { status, data } = response
        if (status === 200 && data.success) {
          this.$store.dispatch('main/alert', {
            color: 'success',
            message: this.$t('browserProfiles.exportedCookiesToDownloads')
          })
        }
      } catch (_) {
        // Do nothing
      } finally {
        this.loading = this.loading.filter(i => i !== 'exportCookies')
      }
    },

    CookieRobot () {
      console.log('Robot Cookies')
    },

    openDialogChromeNotFound () {
      this.$store.dispatch('browserProfiles/openDialog', 'chromeNotFound')
    },

    handleWarningChange (val) {
      localStorage.setItem('browserProfilesDoNotShowParallelStartWarning', val)
    },

    transfer () {
      this.$store.dispatch('browserProfiles/openDialog', 'transfer')
    }
  }
}
</script>
<style>
  .actions-containter-hidden > * {
    display: none;
  }

  .actions-containter {
    height: 48px;
    background: #2196f3;
    border-radius: 24px;
    position: fixed;
    bottom: 68px;
    left: calc(50% + 28px);
    transform: translateX(-50%);
    padding: 16px;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
  }

  .count-container {
    padding: 8px 0 8px 8px;
    /* border-radius: 24px; */
    /* min-width: 42px; */
    /* text-align: center; */
    font-size: 22px;
    color: #ffffff;
  }

  /* .count-badge {
    cursor: pointer;
  } */
  .count-badge span.v-badge__badge {
    padding: 0 !important;
  }

  #actions-circle {
    background: #2196f3;
    width: 64px;
    height: 64px;
    border-radius: 32px;
    position: fixed;
    left: calc(50% - 32px + 48px);
    bottom: 40px;
  }
</style>
