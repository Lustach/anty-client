<template>
  <v-dialog
    :value="dialogs.changeProxyFromCell"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'changeProxyFromCell')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'changeProxyFromCell')"
  >
    <!-- ДОПОЛНИТЕЛЬНЫЕ ДИАЛОГИ -->
    <dialogs-help />
    <dialogs-warning />

    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="mb-5 pr-0"
      >
        <v-toolbar-title>
          {{ $t('proxy.editing') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'changeProxyFromCell')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-row>
          <!-- РЕЖИМ ПРОКСИ -->
          <v-col
            cols="12"
            class="text-center"
          >
            <add-proxy-mode />
          </v-col>

          <!-- ПРОКСИ -->
          <v-col cols="12">
            <add-proxy
              :validation="{
                touched: touched,
                proxyIdError: browserProfile.proxyMode === 2 ? $v.browserProfile.proxyId.$error : false,
                hostError: browserProfile.proxyMode === 1 ? $v.browserProfile.proxyNew.host.$error : false,
                portError: browserProfile.proxyMode === 1 ? $v.browserProfile.proxyNew.port.$error : false
              }"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          small
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'changeProxyFromCell')"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          small
          text
          color="primary"
          :loading="loading"
          :disabled="initialProxyId === browserProfile.proxyId"
          @click="changeProxy"
        >
          {{ $t('common.change') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import AddProxy from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxy.vue'
import AddProxyMode from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxyMode.vue'
import DialogsHelp from '@/components/dialogs/DialogsHelp.vue'
import DialogsWarning from '@/components/dialogs/DialogsWarning.vue'
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  name: 'BrowserProfilesMainTableCellProxyDialogChange',

  components: {
    AddProxy,
    AddProxyMode,
    DialogsHelp,
    DialogsWarning
  },

  data () {
    return {
      loading: false,
      initialProxy: 0,
      touched: false,
      initialProxyId: 0
    }
  },

  validations () {
    if (this.browserProfile.proxyMode === 0) {
      return { browserProfile: {} }
    } else if (this.browserProfile.proxyMode === 1) {
      return {
        browserProfile: {
          proxyNew: {
            host: { required },
            port: { required }
          }
        }
      }
    } else if (this.browserProfile.proxyMode === 2) {
      return {
        browserProfile: {
          proxyId: { required, minValue: minValue(1) }
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      proxies: 'proxy/proxies'
    }),
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  watch: {
    browserProfile: {
      deep: true,
      handler () {
        this.touched = false
      }
    }
  },

  created () {
    this.browserProfile.proxyMode = 2

    this.initialProxyId = this.browserProfile.proxyId
    this.browserProfile.proxyId = null
  },

  mounted () {
    const savedProxyInput = document.querySelector('#browserProfilesMainDialogFieldProxySavedSelect')
    savedProxyInput.click()
  },

  methods: {
    async changeProxy () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        try {
          this.loading = true
          let proxy = this.$_.cloneDeep(this.browserProfile.proxyNew)

          if (this.browserProfile.proxyMode === 0) {
            proxy = null
          }

          if (this.browserProfile.proxyMode === 1) {
            if (proxy.name === '') {
              if (this.browserProfile.proxyInput.includes('://')) {
                proxy.name = this.browserProfile.proxyInput
              } else {
                proxy.name = this.browserProfile.proxyNew.type + '://' + this.browserProfile.proxyInput
              }
            }
            if (proxy.changeIpUrl === '') {
              delete proxy.changeIpUrl
            }
            if (proxy.login === '') {
              delete proxy.login
            }
            if (proxy.password === '') {
              delete proxy.password
            }
          }

          if (this.browserProfile.proxyMode === 2) {
            proxy = {
              id: this.browserProfile.proxyId
            }
          }

          const response = await this.api.patch(`/browser_profiles/${this.browserProfile.id}`, { proxy: proxy })
          if (response.status === 200) {
            this.$store.dispatch('browserProfiles/closeDialog', 'changeProxyFromCell')
            this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
            this.$store.dispatch('browserProfiles/loadCurrentPage')
            this.$store.dispatch('proxy/loadAllProxies')
          } else {
            throw response
          }
        } catch (error) {
          console.error(error)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>
