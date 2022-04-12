<template>
  <v-dialog
    :value="dialogs.changeProxy"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
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
          {{ $t('common.changeProxy') }}
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
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          small
          text
          color="primary"
          :loading="loading"
          @click="changeProxy"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import AddProxy from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxy.vue'
import AddProxyMode from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxyMode.vue'
import DialogsHelp from '@/components/dialogs/DialogsHelp.vue'
import DialogsWarning from '@/components/dialogs/DialogsWarning.vue'
import { required, minValue } from 'vuelidate/lib/validators'

export default {
  name: 'BrowserProfilesActionsDialogChangeProxy',

  components: {
    AddProxy,
    AddProxyMode,
    DialogsHelp,
    DialogsWarning
  },

  data () {
    return {
      touched: false,
      loading: false
    }
  },

  validations () {
    if (this.browserProfile.proxyMode === 0) {
      return { browserProfile: {} }
    } else if (this.browserProfile.proxyMode === 1) {
      return {
        browserProfile: {
          proxyNew: {
            host: {
              required
            },
            port: {
              required
            }
          }
        }
      }
    } else if (this.browserProfile.proxyMode === 2) {
      return {
        browserProfile: {
          proxyId: {
            required,
            minValue: minValue(1)
          }
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfiles: 'browserProfiles/browserProfiles',
      browserProfile: 'browserProfiles/browserProfile',
      warning: 'main/warning',
      mainDialogs: 'main/dialogs'
    }),

    proxy () {
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

      return proxy
    }
  },

  watch: {
    'browserProfile.proxyInput': {
      handler () {
        this.touched = false
      }
    },

    'browserProfile.proxyNew.name': {
      handler () {
        this.touched = false
      }
    },

    'browserProfile.proxyNew.changeIpUrl': {
      handler () {
        this.touched = false
      }
    }
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'changeProxy')
    },

    async changeProxy () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.loading = true
        let amplitudeSent = false

        Promise.all(this.browserProfiles.selected.map(
          item => this.api.patch(`/browser_profiles/${item.id}`, { proxy: this.proxy })
        ))
          .then(values => {
            if (this.browserProfile.proxyMode === 1 && !amplitudeSent) {
              values.forEach(value => {
                if (value.status === 200) {
                  amplitudeSent = true

                  const identify = new this.$amplitude.Identify().add('proxies count', 1)
                  this.$amplitude.getInstance().identify(identify)

                  this.$amplitude.getInstance().logEvent('Proxy Create')
                }
              })
            }

            if (values.length === this.browserProfiles.selected.length) {
              this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
              this.$store.dispatch('browserProfiles/loadCurrentPage')
              this.$store.dispatch('proxy/loadAllProxies')
            }
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            this.close()
            this.loading = false
          })
      }
    }
  }
}
</script>
