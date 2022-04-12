<template>
  <div>
    <v-dialog
      scrollable
      :value="dialogOpened"
      width="500"
      :transition="false"
      @click:outside="dialogOpened = false"
      @keydown.esc="dialogOpened = false"
    >
      <v-card>
        <!-- ЗАГОЛОВОК -->
        <v-toolbar
          :height="48"
          dark
          color="primary"
          class="mb-5"
        >
          <v-toolbar-title>
            {{ $t('common.health') }}
          </v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              icon
              @click="dialogOpened = false"
            >
              <ion-icon
                name="close-outline"
                style="font-size: 28px;"
              />
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <v-simple-table>
            <tbody>
              <!-- ВЕРСИЯ АНТИ -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.dolphinAntyVersion') + ':' }}
                </td>
                <td>
                  <div>
                    {{ appVersion }}
                  </div>
                </td>
              </tr>

              <!-- ПЛАТФОРМА -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.platform') + ':' }}
                </td>
                <td>
                  <div v-if="health.system">
                    {{ health.system.os }} ({{ health.system.arch }})
                  </div>
                </td>
              </tr>

              <!-- ХРАНИЛИЩЕ -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.storage') + ':' }}
                </td>
                <td>
                  <div v-if="health.storageHost">
                    {{ health.storageHost }}
                  </div>
                </td>
              </tr>

              <!-- ПОРТ АПИ -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('infoBar.apiPort') + ':' }}
                </td>
                <td>
                  <div v-if="localApiPort">
                    {{ localApiPort }}
                  </div>
                </td>
              </tr>

              <!-- БРАУЗЕР ANTY -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.antyBrowser') + ':' }}
                </td>
                <td>
                  <div
                    v-if="health.antyBrowser"
                    class="d-flex justify-space-between align-center"
                  >
                    <div>
                      <v-chip
                        v-if="health.antyBrowser.downloaded"
                        color="success"
                        small
                        label
                        outlined
                      >
                        OK
                      </v-chip>
                      <v-chip
                        v-else
                        color="error"
                        small
                        label
                        outlined
                      >
                        FAIL
                      </v-chip>
                      <span
                        class="ml-1"
                        style="color: #9E9E9E; font-style: italic;"
                      >
                        {{ $t('common.version').toLowerCase() }} {{ health.antyBrowser.version }}
                      </span>
                    </div>
                    <div>
                      <v-progress-circular
                        v-if="antyBrowserLoading"
                        indeterminate
                        color="primary"
                        size="18"
                      />
                      <span
                        v-if="!health.antyBrowser.downloaded && !antyBrowserLoading"
                        class="anty-linkable-span"
                        @click="downloadAntyBrowser"
                      >
                        {{ $t('common.download').toLowerCase() }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- РАСШИРЕНИЕ DOLPHIN -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.dolphinExtension') + ':' }}
                </td>
                <td>
                  <div
                    v-if="health.dolphinExtension"
                    class="d-flex justify-space-between align-center"
                  >
                    <div>
                      <v-chip
                        v-if="health.dolphinExtension.downloaded"
                        color="success"
                        small
                        label
                        outlined
                      >
                        OK
                      </v-chip>
                      <v-chip
                        v-else
                        color="error"
                        small
                        label
                        outlined
                      >
                        FAIL
                      </v-chip>
                      <span
                        class="ml-1"
                        style="color: #9E9E9E; font-style: italic;"
                      >
                        {{ $t('common.version').toLowerCase() }} {{ health.dolphinExtension.version }}
                      </span>
                    </div>
                    <div>
                      <v-progress-circular
                        v-if="extensionLoading"
                        indeterminate
                        color="primary"
                        size="18"
                      />
                      <span
                        v-if="!health.dolphinExtension.downloaded && !extensionLoading"
                        class="anty-linkable-span"
                        @click="downloadExtension"
                      >
                        {{ $t('common.download').toLowerCase() }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- УТИЛИТА ПРОКСИ -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('common.proxyUtility') + ':' }}
                </td>
                <td>
                  <div
                    v-if="health.proxyTool"
                    class="d-flex justify-space-between align-center"
                  >
                    <div>
                      <v-chip
                        v-if="health.proxyTool.downloaded"
                        color="success"
                        small
                        label
                        outlined
                      >
                        OK
                      </v-chip>
                      <v-chip
                        v-else
                        color="error"
                        small
                        label
                        outlined
                      >
                        FAIL
                      </v-chip>
                      <span
                        class="ml-1"
                        style="color: #9E9E9E; font-style: italic;"
                      >
                        {{ $t('common.version').toLowerCase() }} {{ health.proxyTool.version }}
                      </span>
                    </div>
                    <div>
                      <v-progress-circular
                        v-if="proxyLoading"
                        indeterminate
                        color="primary"
                        size="18"
                      />
                      <span
                        v-if="!health.proxyTool.downloaded && !proxyLoading"
                        class="anty-linkable-span"
                        @click="downloadProxyUtility"
                      >
                        {{ $t('common.download').toLowerCase() }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- СТАРЫЙ ЮЗЕРАГЕНТ -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('infoBar.oldUseragents') + ':' }}
                </td>
                <td>
                  <div class="d-flex justify-space-between align-center">
                    <div v-if="oldUseragents.found !== undefined">
                      <div v-if="oldUseragents.found">
                        <v-chip
                          color="error"
                          small
                          label
                          outlined
                        >
                          {{ $t('common.yes').toUpperCase() }}
                        </v-chip>

                        <span
                          class="ml-2 anty-linkable-span"
                          @click="upgradeOldUseragents"
                        >{{ $t('infoBar.upgradeAll').toLowerCase() }}</span>
                      </div>

                      <v-chip
                        v-else
                        color="success"
                        small
                        label
                        outlined
                      >
                        {{ $t('common.no').toUpperCase() }}
                      </v-chip>
                    </div>
                    <div v-else>
                      <span
                        class="ml-2"
                        style="color: #9E9E9E; font-style: italic;"
                      >
                        {{ $t('common.noData').toLowerCase() }}
                      </span>
                      <v-btn
                        color="grey"
                        icon
                        x-small
                        :loading="oldUseragentsLoading"
                        @click="checkOldUseragents"
                      >
                        <v-icon small>
                          mdi-cached
                        </v-icon>
                      </v-btn>
                    </div>
                    <div>
                      <v-progress-circular
                        v-if="oldUseragents.found !== undefined && oldUseragentsLoading"
                        indeterminate
                        color="primary"
                        size="18"
                      />
                    </div>
                  </div>
                </td>
              </tr>

              <!-- MACHINE ID -->
              <tr>
                <td style="width: 200px;">
                  {{ $t('infoBar.machineId') + ':' }}
                </td>
                <td>
                  <div v-if="machineId">
                    <v-chip
                        v-if="machineId.length > 20"
                        color="success"
                        small
                        label
                        outlined
                      >
                        OK
                      </v-chip>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn
                          color="grey"
                          small
                          icon
                          v-on="on"
                          @click="copyMachineId"
                        >
                          <v-icon size="16">
                            mdi-clipboard-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('common.copy') }}</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <span
      id="antyHealthButton"
      class="anty-linkable-span"
      :class="{'orange--text': !badHealth, 'red--text': badHealth, 'font-weight-bold': badHealth, 'anty-adsmanager-main-table-link-disabled': disableUi}"
      @click="openHealthDialog"
    >
      {{ badHealth ? '!! ' : '' }}{{ $t('common.health').toLowerCase() }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InfoBarHealth',

  data () {
    return {
      proxyLoading: false,
      extensionLoading: false,
      antyBrowserLoading: false,
      dialogOpened: false,
      healthInterval: null,
      health: {},
      oldUseragents: {},
      oldUseragentsLoading: false
    }
  },

  computed: {
    ...mapGetters({
      appVersion: 'main/appVersion',
      disableUi: 'main/disableUi'
    }),

    badHealth () {
      return this.health.result === undefined || this.health.result === false || this.oldUseragents.found
    },

    localApiPort () {
      if (location.hostname !== 'localhost') {
        return localStorage.getItem('antyLocalApiPort')
      }
      return '3001'
    },

    machineId () {
      const url = new URL(location.href)
      return url.searchParams.get('machineId')
    }
  },

  sockets: {
    browserDownloading (data) {
      if (data.stage === 'setupEnded') {
        this.antyBrowserLoading = false
        this.loadHealth()
      }
    }
  },

  created () {
    this.loadHealth()
    const _this = this
    this.healthInterval = setInterval(() => {
      _this.loadHealth()
    }, 60000)
  },

  destroyed () {
    clearInterval(this.healthInterval)
  },

  methods: {
    copyMachineId () {
      navigator.clipboard.writeText(this.machineId)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.copied')
      })
    },

    openHealthDialog () {
      this.checkOldUseragents()
      this.dialogOpened = true
    },

    async downloadExtension () {
      try {
        this.extensionLoading = true
        const response = await this.localApi('/health/download-dolphin-extension')
        if (response.status === 200 && response.data && response.data.data && response.data.data.result) {
          this.loadHealth()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.extensionLoading = false
      }
    },

    async downloadProxyUtility () {
      try {
        this.proxyLoading = true
        const response = await this.localApi('/health/download-proxy-tool')
        if (response.status === 200 && response.data && response.data.data && response.data.data.result) {
          this.loadHealth()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.proxyLoading = false
      }
    },

    async downloadAntyBrowser () {
      this.antyBrowserLoading = true
      this.localApi('/health/download-anty-browser')
    },

    async loadHealth () {
      const response = await this.localApi('/health')
      if (response.status === 200 && response.data && response.data.data) {
        this.health = response.data.data
      }

      // 20% шанс
      if (Math.random() <= 0.2) {
        this.checkOldUseragents()
      }
    },

    async checkOldUseragents () {
      try {
        this.oldUseragentsLoading = true
        const response = await this.api('/browser_profiles/check-old-useragents', { headers: { 'X-Anty-App-Version': this.appVersion } })
        if (response.status === 200 && response.data?.success) {
          this.oldUseragents = response.data.data
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.oldUseragentsLoading = false
      }
    },

    async upgradeOldUseragents () {
      try {
        this.oldUseragentsLoading = true
        const response = await this.api('/browser_profiles/upgrade-old-useragents')
        if (response.status === 200 && response.data?.success) {
          this.checkOldUseragents()
          this.$store.dispatch('browserProfiles/loadCurrentPage')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.oldUseragentsLoading = false
      }
    }
  }
}
</script>
