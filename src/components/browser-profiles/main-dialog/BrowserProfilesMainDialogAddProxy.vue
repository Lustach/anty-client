<template>
  <div>
    <!-- НОВЫЕ ПРОКСИ -->
    <v-row
      v-if="browserProfile.proxyMode == 1"
      id="browserProfilesMainDialogFieldNewProxy"
      class="browser-profiles-dialog-add-proxy"
    >
      <!-- ТИП ПРОКСИ -->
      <v-col :cols="12">
        <v-btn-toggle
          id="browserProfilesMainDialogFieldNewProxySwitchType"
          v-model="browserProfile.proxyNew.type"
          mandatory
        >
          <v-btn
            id="browserProfilesMainDialogFieldNewProxySwitchTypeButtonHttp"
            value="http"
            x-small
            color="primary"
            outlined
          >
            HTTP
          </v-btn>
          <v-btn
            id="browserProfilesMainDialogFieldNewProxySwitchTypeButtonSocks4"
            value="socks4"
            x-small
            color="primary"
            outlined
          >
            SOCKS4
          </v-btn>
          <v-btn
            id="browserProfilesMainDialogFieldNewProxySwitchTypeButtonSocks5"
            value="socks5"
            x-small
            color="primary"
            outlined
          >
            SOCKS5
          </v-btn>
          <v-btn
            id="browserProfilesMainDialogFieldNewProxySwitchTypeButtonSsh"
            value="ssh"
            x-small
            color="primary"
            outlined
          >
            SSH
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- ВВОД ПРОКСИ -->
      <v-col
        :cols="12"
        class="pb-0"
      >
        <v-text-field
          id="browserProfilesMainDialogFieldNewProxyInput"
          v-model="browserProfile.proxyInput"
          class="append-icon"
          :label="$t('common.proxy')"
          :error="validation.touched && (validation.hostError || validation.portError)"
          :error-messages="validation.touched && (validation.hostError || validation.portError) ? $t('browserProfiles.proxy.newProxyError') : ''"
          messages="1"
          dense
          outlined
          :spellcheck="false"
          @input="parseProxy"
        >
          <!-- РЕЗУЛЬТАТ ПРОВЕРКИ ПРОКСИ -->
          <template #message="{message}">
            <span
              v-if="connectionCheckResult && connectionCheckResult.success && connectionCheckResult.success === true"
              class="grey--text"
            >
              <v-icon
                color="green"
                :size="16"
                class="mr-1"
              >
                fas fa-check-square
              </v-icon>

              <!-- IP -->
              <span class="mr-3">{{ connectionCheckResult.ip }}</span>

              <!-- ФЛАГ СТРАНЫ -->
              <flag :iso="connectionCheckResult.country.toLowerCase()" />

              <!-- РЕГИОН/ГОРОД -->
              <span
                v-if="connectionCheckResult.city || connectionCheckResult.region"
                class="mr-3"
              >
                <span v-if="connectionCheckResult.region && connectionCheckResult.city">
                  {{ connectionCheckResult.region + ', ' + connectionCheckResult.city }}
                </span>
                <span v-else-if="connectionCheckResult.region">
                  {{ connectionCheckResult.region }}
                </span>
                <span v-else-if="connectionCheckResult.city">
                  {{ connectionCheckResult.city }}
                </span>
              </span>

              <!-- ЧАСОВОЙ ПОЯС -->
              <v-icon
                :size="12"
                class="mr-1"
              >
                fas fa-clock
              </v-icon>
              <span class="mr-3">
                {{ connectionCheckResult.timezone }}
              </span>
            </span>

            <span
              v-else-if="connectionCheckResult && typeof connectionCheckResult.success !== 'undefined' && connectionCheckResult.success === false"
              class="grey--text"
            >
              <v-icon
                color="red"
                :size="16"
                class="mr-1"
              >
                fas fa-times-circle
              </v-icon>
              {{ $t('dialogs.addBrowserProfile.failedConnection') }}
            </span>

            <span v-else>
              {{ $t('dialogs.addBrowserProfile.notYet') }}
            </span>

            <span style="display: none">{{ message }}</span>
          </template>

          <!-- КНОПКИ ИНПУТА -->
          <template #append>
            <!-- ПРОВЕРКА ПРОКСИ -->
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn
                  id="browserProfilesMainDialogFieldNewProxyInputConnectionChecking"
                  icon
                  color="grey"
                  small
                  v-on="on"
                  @click="startCheckProxy"
                >
                  <ion-icon
                    v-if="!connectionChecking"
                    name="swap-horizontal-outline"
                    style="font-size: 20px;"
                  />

                  <v-icon
                    v-if="connectionChecking"
                    :size="16"
                  >
                    fas fa-circle-notch fa-spin
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('common.checkConnection') }}</span>
            </v-tooltip>

            <!-- СПРАВКА -->
            <v-btn
              id="browserProfilesMainDialogFieldNewProxyInputInfo"
              icon
              color="grey"
              small
              @click="openHelp({title: '', body: 'proxyBody'})"
            >
              <ion-icon
                name="information-circle-outline"
                style="font-size: 20px;"
              />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>

      <!-- ССЫЛКА ДЛЯ СМЕНЫ IP -->
      <v-col
        v-if="browserProfile.proxyNew.type !== 'ssh'"
        :cols="12"
        class="pb-0"
      >
        <v-text-field
          id="browserProfilesMainDialogFieldNewProxyChangeIpUrl"
          v-model="browserProfile.proxyNew.changeIpUrl"
          class="append-icon"
          :label="$t('browserProfiles.proxy.changeIpUrl')"
          dense
          outlined
          :hint="$t('browserProfiles.proxy.optional')"
          :persistent-hint="true"
          :spellcheck="false"
        >
          <template #append>
            <v-btn
              id="browserProfilesMainDialogFieldNewProxyChangeIpUrlInfo"
              icon
              color="grey"
              small
              @click="openHelp({title: '', body: 'changeIpUrlBody'})"
            >
              <ion-icon
                name="information-circle-outline"
                style="font-size: 20px;"
              />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>

      <!-- НАЗВАНИЕ ПРОКСИ -->
      <v-col
        :cols="12"
        class="pb-0"
      >
        <v-text-field
          id="browserProfilesMainDialogFieldNewProxyName"
          v-model="browserProfile.proxyNew.name"
          :label="$t('browserProfiles.proxy.proxyName')"
          dense
          outlined
          :hint="$t('browserProfiles.proxy.optional')"
          :persistent-hint="true"
          :spellcheck="false"
        >
          <!-- <template #append>
            <v-btn
              icon
              color="grey"
              small
              @click="openHelp({title: '', body: 'proxyNameBody'})"
            >
              <ion-icon
                name="information-circle-outline"
                style="font-size: 20px;"
              />
            </v-btn>
          </template> -->
        </v-text-field>
      </v-col>
    </v-row>

    <!-- СОХРАННЕНЫЕ ПРОКСИ -->
    <v-row v-if="browserProfile.proxyMode == 2">
      <v-col
        :cols="12"
      >
        <proxy-dropdown
          id="browserProfilesMainDialogFieldProxySavedSelect"
          ref="browserProfilesMainDialogFieldProxySavedSelectRef"
          :value="proxy"
          :error="validation.touched && validation.proxyIdError"
          :hide-details="validation.touched && validation.proxyIdError ? false : true"
          :messages="validation.touched && validation.proxyIdError ? $t('authorization.fieldRequired') : ''"
          :item-value="item => item.id"
          :item-text="item => item.name"
          :items="proxies.all"
          :label="$t('browserProfiles.proxy.proxySelect')"
          class="browser-profiles-add-save-proxy-autocomplete"
          @change="setLocalSavedProxy"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import parseProxyString from '@/mixins/parseProxy.js'
import ProxyDropdown from '@/components/proxy/ProxyDropdown'

export default {
  name: 'BrowserProfilesMainDialogAddProxy',
  components: { ProxyDropdown },
  mixins: [
    parseProxyString
  ],

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        proxyIdError: false,
        hostError: false,
        portError: false
      })
    }
  },

  data () {
    return {
      connectionCheckResult: { ip: '1.1.1.1' },
      connectionChecking: false
    }
  },

  computed: {
    ...mapGetters({
      proxies: 'proxy/proxies',
      dialogs: 'browserProfiles/dialogs'
    }),
    ...mapFields('browserProfiles', ['browserProfile']),

    proxy () {
      const proxy = this.proxies.all.find(item => parseInt(item.id, 10) === parseInt(this.browserProfile.proxyId, 10))
      return proxy || null
    },

    messagesForProxyInput () {
      if (this.connectionCheckResult) {
        if (this.connectionCheckResult.success) {
          return true
        } else {
          return false
        }
      }

      return ''
    }
  },

  watch: {
    'browserProfile.proxyNew.type': {
      deep: true,
      handler (newVal, oldVal) {
        if (this.browserProfile.proxyInput) {
          const proxyInput = this.browserProfile.proxyInput.split('://')
          if (proxyInput.length === 2) {
            proxyInput.splice(0, 1, this.browserProfile.proxyNew.type)
            this.browserProfile.proxyInput = proxyInput.join('://')
            return
          }
        }

        if (newVal !== oldVal) {
          this.startCheckProxy()
        }
      }
    },

    'browserProfile.proxyInput': {
      deep: true,
      handler (newVal) {
        setTimeout(() => {
          if (newVal === this.browserProfile.proxyInput) {
            this.startCheckProxy()
          }
        }, 3000)
      }
    }
  },

  mounted () {
    if (this.dialogs.changeProxyFromCell) {
      this.$refs.browserProfilesMainDialogFieldProxySavedSelectRef?.focus()
    }
  },

  methods: {
    async parseProxy (string) {
      const parsedProxy = await this.parseProxyString(string, this.browserProfile.proxyNew.type)
      this.$set(this.browserProfile, 'proxyNew', parsedProxy)
    },

    startCheckProxy () {
      // this.connectionCheckResult = {}
      this.checkProxyConnection()
    },

    async checkProxyConnection () {
      if (
        !this.browserProfile.proxyNew.type ||
        !this.browserProfile.proxyNew.host ||
        !this.browserProfile.proxyNew.port
      ) {
        return
      }
      try {
        this.connectionChecking = true

        let data
        if (this.browserProfile.proxyNew.login && this.browserProfile.proxyNew.password) {
          data = {
            type: this.browserProfile.proxyNew.type,
            host: this.browserProfile.proxyNew.host,
            port: this.browserProfile.proxyNew.port,
            login: this.browserProfile.proxyNew.login,
            password: this.browserProfile.proxyNew.password
          }
        } else {
          data = {
            type: this.browserProfile.proxyNew.type,
            host: this.browserProfile.proxyNew.host,
            port: this.browserProfile.proxyNew.port
          }
        }

        const response = await this.localApi.post('/check/proxy', data)

        this.connectionCheckResult = response.data
      } catch (err) {
        console.error(err)
      } finally {
        this.connectionChecking = false
      }
    },

    setLocalSavedProxy (proxyId) {
      this.browserProfile.proxyId = proxyId
      localStorage.setItem('browserProfilesAddDialogProxyId', proxyId)
    },

    async openHelp (help) {
      await this.$store.dispatch('main/setHelp', {
        title: help.title,
        body: this.$t(`dialogs.help.${help.body}`)
      })
      await this.$store.dispatch('main/openDialog', 'help')
    },

    test (proxy) {
      console.log(proxy)
    }
  }
}
</script>
