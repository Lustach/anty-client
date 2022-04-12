<template>
  <v-col
    :cols="7"
    class="pt-0"
  >
    <!-- НОВЫЙ ПРОКСИ -->
    <div v-if="browserProfile.proxyMode === 1">
      <!-- ТИП ПРОКСИ -->
      <v-btn-toggle
        id="browserProfilesMainDialogMultipleImportProxyNewTypeToggle"
        v-model="browserProfile.proxyNew.type"
        mandatory
        class="mb-4"
      >
        <v-btn
          v-for="type in ['http', 'socks4', 'socks5', 'ssh']"
          :id="`browserProfilesMainDialogMultipleImportProxyNewType${capitalize(type)}`"
          :key="`main-dialog-multiple-import-proxy-input-type-${type}`"
          :value="type"
          x-small
          color="primary"
          outlined
        >
          {{ type.toUpperCase() }}
        </v-btn>
      </v-btn-toggle>

      <!-- ВВОД ПРОКСИ -->
      <v-text-field
        id="browserProfilesMainDialogMultipleImportProxyNewInput"
        v-model="browserProfile.proxyInput"
        class="append-icon"
        :label="$t('common.proxy')"
        :error="proxyInputError"
        :error-messages="proxyInputError ? $t('browserProfiles.proxy.newProxyError') : ''"
        dense
        outlined
        messages="1"
        :spellcheck="false"
        @input="proxyInput"
      >
        <!-- РЕЗУЛЬТАТ ПРОВЕРКИ ПРОКСИ -->
        <template #message="{message}">
          <span
            v-if="connectionCheckResult && connectionCheckResult.success"
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
            v-else-if="connectionCheckResult && connectionCheckResult.success === false"
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
                icon
                color="grey"
                small
                v-on="on"
                @click="checkProxyConnection"
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

      <!-- ССЫЛКА ДЛЯ СМЕНЫ IP -->
      <v-text-field
        id="browserProfilesMainDialogMultipleImportProxyNewChangeIpUrl"
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

      <!-- НАЗВАНИЕ ПРОКСИ -->
      <v-text-field
        id="browserProfilesMainDialogMultipleImportProxyNewName"
        v-model="browserProfile.proxyNew.name"
        :label="$t('browserProfiles.proxy.proxyName')"
        dense
        outlined
        :hint="$t('browserProfiles.proxy.optional')"
        :persistent-hint="true"
        :spellcheck="false"
      />
    </div>

    <!-- СОХРАНЕННЫЕ ПРОКСИ -->
    <proxy-dropdown
      v-if="browserProfile.proxyMode === 2"
      id="browserProfilesMainDialogMultipleImportProxySavedAutocomplete"
      :value="proxy"
      :error="proxySavedError"
      :hide-details="proxySavedError ? false : true"
      :messages="proxySavedError ? $t('authorization.fieldRequired') : ''"
      :item-value="item => item.id"
      :item-text="item => item.name"
      :items="proxies.all"
      :label="$t('browserProfiles.proxy.proxySelect')"
      class="browser-profiles-add-save-proxy-autocomplete"
      @change="setLocalSavedProxy"
    />
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import parseProxyString from '@/mixins/parseProxy.js'
import ProxyDropdown from '@/components/proxy/ProxyDropdown'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralProxyInput',
  components: { ProxyDropdown },
  mixins: [
    parseProxyString
  ],

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      connectionCheckResult: { ip: '1.1.1.1' },
      connectionChecking: false
    }
  },

  computed: {
    ...mapGetters({ proxies: 'proxy/proxies' }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    proxy () {
      const proxy = this.proxies.all.find(item => parseInt(item.id, 10) === parseInt(this.browserProfile.proxyId, 10))
      return proxy || null
    },

    proxyInputError () {
      return this.browserProfileTouched && (this.validation.browserProfile.proxyNew.host.$error || this.validation.browserProfile.proxyNew.port.$error)
    },

    proxySavedError () {
      return this.browserProfileTouched && this.validation.browserProfile.proxyId.$error
    }
  },

  methods: {
    async proxyInput (value) {
      const parsedProxy = await this.parseProxyString(value, this.browserProfile.proxyNew.type)
      this.$set(this.browserProfile, 'proxyNew', parsedProxy)

      setTimeout(() => {
        if (value === this.browserProfile.proxyInput) {
          this.checkProxyConnection()
        }
      }, 3000)
    },

    async checkProxyConnection () {
      if (!this.browserProfile.proxyNew.type || !this.browserProfile.proxyNew.host || !this.browserProfile.proxyNew.port) return

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

    async openHelp (help) {
      await this.$store.dispatch('main/setHelp', {
        title: help.title,
        body: this.$t(`dialogs.help.${help.body}`)
      })
      await this.$store.dispatch('main/openDialog', 'help')
    },

    setLocalSavedProxy (proxyId) {
      this.browserProfile.proxyId = proxyId
      localStorage.setItem('browserProfilesAddDialogProxyId', proxyId)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
