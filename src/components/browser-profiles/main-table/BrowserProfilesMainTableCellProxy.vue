<template>
  <div style="font-size: 12px; word-break: break-all;">
    <!-- ПРОВЕРКА ПРОКСИ -->
    <v-tooltip
      v-if="!doNotChange && proxy"
      top
    >
      <template #activator="{ on }">
        <v-btn
          v-if="proxy.lastCheck"
          x-small
          icon
          :loading="loadingCheckProxy"
          :color="proxy.lastCheck.status ? 'green' : 'red'"
          :disabled="disableUi"
          v-on="on"
          @click="checkProxy"
        >
          <ion-icon
            name="swap-horizontal-outline"
            style="font-size: 14px;"
          />
        </v-btn>
        <v-btn
          v-else
          x-small
          icon
          :loading="loadingCheckProxy"
          :disabled="disableUi"
          v-on="on"
          @click="checkProxy"
        >
          <ion-icon
            name="swap-horizontal-outline"
            style="font-size: 14px;"
          />
        </v-btn>
      </template>
      <span>{{ $t('common.checkConnection') }}</span>
    </v-tooltip>

    <!-- СМЕНА АЙПИ -->
    <v-tooltip
      v-if="!doNotChange && proxy && proxy.changeIpUrl"
      top
    >
      <template #activator="{ on }">
        <v-btn
          x-small
          icon
          :loading="loadingChangeIpUrl"
          :color="responseSuccess === null ? 'default' : responseSuccess ? 'green' : 'red'"
          :disabled="disableUi"
          v-on="on"
          @click="changeIpUrl"
        >
          <ion-icon
            name="refresh-outline"
            style="font-size: 14px;"
          />
        </v-btn>
      </template>
      <span>{{ responseMessage === null ? $t('common.changeIp') : responseMessage }}</span>
    </v-tooltip>

    {{ proxyInput }}

    <v-btn
      v-if="!doNotChange"
      icon
      x-small
      color="primary"
      class="anty-proxy-edit-pencil"
      :disabled="disableUi"
      @click="changeProxy"
    >
      <v-icon :size="12">
        fas fa-pencil-alt
      </v-icon>
    </v-btn>

    <div v-if="proxy">
      <!-- ПРОВЕРКА БЫЛА -->
      <div
        v-if="lastCheckExists"
        class="d-flex align-center"
      >
        <!-- ДРУГИЕ ДАННЫЕ ПРОВЕРКИ -->
        <div
          v-if="proxy.lastCheck.status"
          style="font-size: 12px; color: #9E9E9E; min-width: 120px;"
          class="ml-1"
        >
          <div>
            <!-- ФЛАГ СТРАНЫ -->
            <flag
              v-if="proxy.lastCheck.ip !== undefined && proxy.lastCheck.country !== undefined"
              :iso="proxy.lastCheck.country.toLowerCase()"
              style="width: 16px; background-size: 100%;"
            />

            <!-- IP -->
            <span
              v-if="proxy.lastCheck.ip !== undefined"
              style="margin-left: 2px;"
            >
              {{ proxy.lastCheck.ip }}
            </span>
          </div>
        </div>
      </div>

      <!-- НЕИЗВЕСТНО -->
      <!-- <v-chip
        v-else
        outlined
        label
        x-small
        color="grey"
        class="mb-1"
      >
        {{ $t('common.unknown').toUpperCase() }}
      </v-chip> -->
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainTableCellProxy',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    },
    doNotChange: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      moment,
      loadingChangeIpUrl: false,
      changeIpResponse: null,
      loadingCheckProxy: false,
      responseSuccess: null,
      responseMessage: null
    }
  },

  computed: {
    ...mapGetters({
      pagination: 'browserProfiles/pagination',
      disableUi: 'main/disableUi'
    }),
    ...mapFields('proxy', ['proxies']),

    proxy () {
      const proxy = this.proxies.all.find(item => parseInt(item.id, 10) === parseInt(this.browserProfile.proxyId, 10))
      return proxy || null
    },

    proxyInput () {
      if (this.browserProfile.proxy && this.browserProfile.proxy.name) {
        return this.browserProfile.proxy.name
      } else if (this.browserProfile.proxy && !this.browserProfile.proxy.name) {
        return this.$t('common.noName')
      }
      return '-'
    },

    lastCheckExists () {
      if (this.proxy === null) return false
      return (
        this.proxy.lastCheck &&
        typeof this.proxy.lastCheck.status !== 'undefined' &&
        typeof this.proxy.lastCheck.createdAt !== 'undefined'
      )
    }
  },

  methods: {
    async changeProxy () {
      await this.$store.dispatch('browserProfiles/setBrowserProfileForEdit', this.$_.cloneDeep(this.browserProfile))
      this.$store.dispatch('browserProfiles/openDialog', 'changeProxyFromCell')
    },
    async changeIpUrl () {
      if (this.proxy === null) return

      try {
        this.loadingChangeIpUrl = true

        const response = await this.localApi(`/browser_profiles/${this.browserProfile.id}/change_proxy_ip`)

        if (response.status === 200 && response.data) {
          this.responseSuccess = response.data.success

          switch (response.data.success) {
            case true:
              this.responseMessage = response.data.response
              break
            case false:
              this.responseMessage = {
                data: response.data.data,
                error: response.data.error
              }
              break
          }

          setTimeout(() => {
            this.responseSuccess = null
            this.responseMessage = null
          }, 30000)
        } else {
          throw response
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loadingChangeIpUrl = false
      }
    },

    async checkProxy () {
      if (this.proxy === null) return

      try {
        this.loadingCheckProxy = true

        if (!this.proxies.checking.includes(this.proxy.id)) {
          this.proxies.checking.push(this.proxy.id)

          let data
          if (this.proxy.login && this.proxy.password) {
            data = {
              type: this.proxy.type,
              host: this.proxy.host,
              port: this.proxy.port,
              login: this.proxy.login,
              password: this.proxy.password
            }
          } else {
            data = {
              type: this.proxy.type,
              host: this.proxy.host,
              port: this.proxy.port
            }
          }

          const response = await this.localApi.post('/check/proxy', data)
          this.proxies.checking = this.proxies.checking.filter(item => parseInt(item, 10) !== parseInt(this.proxy.id, 10))

          await this.api.post(`/proxy/${this.proxy.id}/last_check`, {
            city: response.data.city ? response.data.city : undefined,
            country: response.data.country ? response.data.country : undefined,
            ip: response.data.ip ? response.data.ip : undefined,
            region: response.data.region ? response.data.region : undefined,
            status: response.data.success ? response.data.success : false,
            timezone: response.data.timezone ? response.data.timezone : undefined
          })

          const payload = {
            page: this.pagination.currentPage,
            itemsPerPage: this.pagination.perPage,
            query: this.pagination.query,
            tags: this.pagination.tags,
            mainWebsites: this.pagination.mainWebsites,
            statuses: this.pagination.statuses,
            users: this.pagination.users
          }
          this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.$store.dispatch('proxy/loadAllProxies')
        this.loadingCheckProxy = false
      }
    }
  }
}
</script>
<style>
.anty-proxy-edit-pencil {
  opacity: 0;
}

.browser-profiles-main-table-proxy-cell:hover .anty-proxy-edit-pencil {
  opacity: 1;
}
</style>
