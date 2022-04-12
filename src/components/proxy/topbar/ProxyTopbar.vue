<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ЛЕВАЯ СТОРОНА -->
    <div />

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- ПОДЕЛИТЬСЯ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="proxiesShareButton"
            color="primary"
            icon
            :disabled="proxies.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('proxy/openDialog', 'share')"
          >
            <ion-icon
              name="share-social-outline"
              style="font-size: 20px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.share') }}</span>
      </v-tooltip>

      <!-- УДАЛИТЬ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="proxiesDeleteButton"
            color="primary"
            icon
            :disabled="proxies.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('proxy/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 20px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.proxiesDelete') }}</span>
      </v-tooltip>

      <!-- ПРОВЕРКА ПРОКСИ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="proxiesCheckProxyButton"
            color="primary"
            icon
            :disabled="proxies.selected.length === 0"
            :loading="loadingCheckProxy"
            v-on="on"
            @click="startProxiesChecking(1)"
          >
            <ion-icon
              name="swap-horizontal-outline"
              style="font-size: 20px;"
            />
            <!--            <v-icon :size="14">-->
            <!--              fas fa-check-double-->
            <!--            </v-icon>-->
          </v-btn>
        </template>
        <span>{{ $t('common.checkConnection') }}</span>
      </v-tooltip>

      <!-- НОВЫЙ ПРОКСИ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="proxiesCreateButton"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('proxy/openDialog', 'create')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('proxy.createProxy') }}</span>
      </v-tooltip>

      <!-- ПОИСК -->
      <v-text-field
        id="proxySearchField"
        ref="proxySearchField"
        v-model="proxySearchField"
        class="anty-topbar-search-field"
        :label="$t('browserProfiles.searchField')"
        dense
        solo
        single-line
        hide-details
        clearable
        clear-icon="fas fa-times"
        :spellcheck="false"
        @input="search"
      >
        <template #prepend-inner>
          <ion-icon
            name="search-outline"
            class="mx-1"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ProxyTopbar',

  data () {
    return {
      loadingCheckProxy: false,
      proxySearchField: '',
      nameSearchText: '',
      checkedProxies: []
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'proxy/dialogs',
      mainDialogs: 'main/dialogs',
      pagination: 'proxy/pagination'
    }),
    ...mapFields('proxy', ['proxies'])
  },

  created () {
    document.addEventListener('keyup', this.focusSearch)
  },

  destroyed () {
    document.removeEventListener('keyup', this.focusSearch)
  },

  methods: {
    focusSearch (e) {
      let dialogOpened = false
      let mainDialogOpened = false
      for (const dialog of Object.values(this.dialogs)) {
        if (dialog) {
          dialogOpened = true
        }
      }
      for (const dialog of Object.values(this.mainDialogs)) {
        if (dialog) {
          mainDialogOpened = true
        }
      }
      if (!dialogOpened && !mainDialogOpened && (e.keyCode === 111 || e.keyCode === 191)) {
        this.$refs.proxySearchField.focus()
      }

      if (!dialogOpened && this.$refs.proxySearchField.isFocused && e.keyCode === 27) {
        this.$refs.proxySearchField.blur()
        this.proxySearchField = ''
        this.search('')
      }
    },

    search (name) {
      this.nameSearchText = name
      setTimeout(async () => {
        if (name === this.nameSearchText) {
          const payload = {
            query: name,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('proxy/loadProxies', payload)
        }
      }, 500)
    },

    startProxiesChecking (iteration) {
      try {
        if (parseInt(iteration, 10) === 1) { this.checkedProxies = [] }
        this.loadingCheckProxy = true

        const end = iteration * 25
        const start = end - 25

        const proxies = []
        for (let i = start; i < end; i++) {
          if (this.proxies.selected[i]) {
            proxies.push(this.proxies.selected[i])
          }
        }
        Promise.all(proxies.map(proxy => this.checkProxy(proxy)))
          .then((values) => {
            for (const value of values) {
              if (value) this.checkedProxies.push(value)
            }
          })
          .finally(() => {
            this.loadingCheckProxy = false

            if (this.proxies.selected.length > end) {
              this.startProxiesChecking(iteration + 1)
            } else {
              const idsLength = this.checkedProxies.length
              this.$store.dispatch('main/alert', {
                color: 'success',
                message: `${this.$t('common.checked')} ${idsLength} ${this.$t('common.proxy').toLowerCase()}`
              })
              const payload = {
                query: this.pagination.query,
                page: this.pagination.currentPage,
                itemsPerPage: this.pagination.perPage
              }
              this.$store.dispatch('proxy/loadProxies', payload)
            }
          })
      } catch (err) {
        console.log(err)
      }
    },

    async checkProxy (proxy) {
      try {
        if (!this.proxies.checking.includes(proxy.id)) {
          this.proxies.checking.push(proxy.id)

          let data
          if (proxy.login && proxy.password) {
            data = {
              type: proxy.type,
              host: proxy.host,
              port: proxy.port,
              login: proxy.login,
              password: proxy.password
            }
          } else {
            data = {
              type: proxy.type,
              host: proxy.host,
              port: proxy.port
            }
          }

          const response = await this.localApi.post('/check/proxy', data)
          const checkedProxy = response.data

          let lastCheck = {}
          if (checkedProxy.success) {
            lastCheck = {
              city: checkedProxy.city,
              country: checkedProxy.country,
              region: checkedProxy.region,
              timezone: checkedProxy.timezone,
              ip: checkedProxy.ip,
              status: 1,
              createdAt: new Date().toISOString()
            }
          } else {
            lastCheck = {
              city: '',
              country: '',
              region: '',
              timezone: '',
              ip: '',
              status: 0,
              createdAt: new Date().toISOString()
            }
          }
          this.$store.dispatch('proxy/replaceLastCheck', {
            id: proxy.id,
            lastCheck
          })

          await this.api.post(`/proxy/${proxy.id}/last_check`, {
            city: checkedProxy && checkedProxy.city ? checkedProxy.city : undefined,
            country: checkedProxy && checkedProxy.country ? checkedProxy.country : undefined,
            ip: checkedProxy && checkedProxy.ip ? checkedProxy.ip : undefined,
            region: checkedProxy && checkedProxy.region ? checkedProxy.region : undefined,
            status: checkedProxy && checkedProxy.success ? checkedProxy.success : false,
            timezone: checkedProxy && checkedProxy.timezone ? checkedProxy.timezone : undefined
          })

          return proxy.id
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.proxies.checking = this.proxies.checking.filter(i => parseInt(i, 10) !== parseInt(proxy.id, 10))
      }
    }
  }
}
</script>
