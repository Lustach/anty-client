<template>
  <v-dialog
    id="browserProfilesMainDialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :value="dialogs.mainDialog"
    :overlay-opacity="0.7"
    scrollable
    width="1020"
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <!-- ДОПОЛНИТЕЛЬНЫЕ ДИАЛОГИ -->
    <dialogs-help />
    <dialogs-warning />
    <v-card
      id="main-dialog-card"
      style="max-height: 800px;"
    >
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        style="flex-grow: 0;"
      >
        <!-- <v-toolbar-title>
          {{ browserProfile.forEdit ? $t('common.editProfile') + ' [' + editName + ']' : $t('common.newProfile') }}
        </v-toolbar-title> -->

        <v-toolbar-title :style="!browserProfile.forEdit ? 'height: inherit;' : ''">
          <span v-if="browserProfile.forEdit">
            {{ $t('common.editProfile') + ' [' + editName + ']' }}
          </span>

          <div
            v-else
            class="main-dialog-main-tabs"
          >
            <div
              v-for="item in ['newProfile', 'massImport']"
              :id="`browserProfilesMainDialogTab${capitalize(item)}`"
              :key="`main-dialog-main-tabs-${item}`"
              :class="{'main-dialog-main-tabs-tab-active': mainTab === item}"
              @click="mainTab = item"
            >
              <svg
                preserveAspectRatio="none"
                viewBox="0 0 247 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5 4C5 1.79077 6.79077 0 9 0H238C240.209 0 242 1.79077 242 4V43C242 45.7615 244.239 48 247 48H242H5H0C2.76147 48 5 45.7615 5 43V4Z"
                  fill="currentColor"
                />
              </svg>
              <span>{{ item === 'newProfile' ? $t('common.newProfile') : $t('common.massImport') }}</span>
            </div>
          </div>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <!-- НОВЫЙ ОТПЕЧАТОК -->
          <new-fingerprint v-if="mainTab === 'newProfile'" />

          <!-- СОЗДАТЬ/СОХРАНИТЬ -->
          <v-btn
            v-if="mainTab === 'massImport'"
            id="browserProfilesMainDialogMultipleImportImportButton"
            text
            :loading="multipleImportLoading.mainDialog"
            @click="$store.dispatch('browserProfilesMultipleImport/touchMultipleImport', true)"
          >
            {{ $t('common.import') }}
          </v-btn>
          <v-btn
            v-else
            id="browserProfilesMainDialogMainButton"
            text
            :loading="loading"
            :disabled="mainButtonDisabled"
            @click="checkBrowserProfile"
          >
            <v-icon
              :size="16"
              class="mr-1"
            >
              {{ browserProfile.forEdit ? 'mdi-floppy' : 'mdi-plus' }}
            </v-icon>
            {{ browserProfile.forEdit ? $t('common.save') : $t('common.create') }}
          </v-btn>

          <!-- ЗАКРЫТЬ -->
          <v-btn
            id="browserProfilesMainDialogButtonClose"
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

      <v-card-text
        v-if="mainTab === 'newProfile'"
        style="overflow-y: auto; margin-top: 48px; height: 800px;"
        class="px-0 pb-8"
        @scroll="scrollListener"
      >
        <!-- ТАБЫ -->
        <v-tabs
          v-model="tab"
          grow
          class="main-dialog-tabs"
        >
          <!-- ОСНОВНОЕ -->
          <v-tab
            id="browserProfilesMainDialogTabGeneral"
            @click="scrollTo('tabGeneral')"
          >
            <v-badge
              :value="touched && tab !== 0 && generalInvalid"
              dot
              color="error"
            >
              {{ $t('common.general') }}
            </v-badge>
          </v-tab>

          <!-- ДОПОЛНИТЕЛЬНО -->
          <v-tab
            id="browserProfilesMainDialogTabAdditional"
            @click="scrollTo('tabAdditional')"
          >
            <v-badge
              :value="touched && tab !== 1 && additionalInvalid"
              dot
              color="error"
            >
              {{ $t('common.additional') }}
            </v-badge>
          </v-tab>

          <!-- КУКИСЫ -->
          <!-- <v-tab id="browserProfilesMainDialogTabCookies">
            Cookies
          </v-tab> -->

          <!-- АНКЕТА -->
          <v-tab
            id="browserProfilesMainDialogTabUserData"
            @click="scrollTo('tabUserData')"
          >
            {{ $t('common.userData') }}
          </v-tab>
        </v-tabs>

        <!-- ТЕЛА ТАБОВ -->
        <v-tabs-items
          :value="0"
          class="px-6 main-dialog-tabs-items"
        >
          <!-- НАСТРОЙКИ -->
          <v-tab-item
            style="flex: 2;"
            :transition="false"
            :reverse-transition="false"
          >
            <div id="browserProfilesMainDialogGeneral">
              <!-- ОСНОВНЫЕ -->
              <main-dialog-general :validation="{touched: touched, browserProfileName: $v.browserProfile.name.$error}" />

              <!-- ТИП БРАУЗЕРА -->
              <!-- <main-dialog-browser-type v-if="!browserProfile.forEdit" /> -->

              <!-- ПЛАТФОРМА -->
              <main-dialog-platform v-if="!browserProfile.forEdit" />

              <!-- MAIN WEBSITE -->
              <main-dialog-main-website />

              <!-- ПРОКСИ -->
              <main-dialog-proxy
                :validation="{
                  touched: touched,
                  proxyIdError: browserProfile.proxyMode === 2 ? $v.browserProfile.proxyId.$error : false,
                  hostError: browserProfile.proxyMode === 1 ? $v.browserProfile.proxyNew.host.$error : false,
                  portError: browserProfile.proxyMode === 1 ? $v.browserProfile.proxyNew.port.$error : false
                }"
              />
              <!-- КУКИСЫ -->
              <main-dialog-cookies />
            </div>

            <div
              id="browserProfilesMainDialogAdditional"
              class="mt-3"
            >
              <!-- USERAGENT -->
              <main-dialog-useragent
                :validation="{
                  touched: touched,
                  error: browserProfile.useragent.mode !== 'auto' ? $v.browserProfile.useragent.value.$error : false
                }"
              />

              <!-- ФИЧИ -->
              <main-dialog-webrtc
                :validation="{
                  touched: touched,
                  error: browserProfile.webrtc.mode === 'manual' ? $v.browserProfile.webrtc.ipAddress.$error : false
                }"
              />
              <main-dialog-canvas />
              <main-dialog-webgl
                :validation="{
                  touched: touched,
                  errorVendor: browserProfile.webglInfo.mode === 'manual' ? $v.browserProfile.webglInfo.vendor.$error : false,
                  errorRenderer: browserProfile.webglInfo.mode === 'manual' ? $v.browserProfile.webglInfo.renderer.$error : false
                }"
              />
              <main-dialog-client-rects v-if="browserProfile.browserType === 'anty'" />

              <!-- ЧАСОВОЙ ПОЯС -->
              <main-dialog-timezone
                :validation="{
                  touched: touched,
                  error: browserProfile.timezone.mode !== 'auto' ? $v.browserProfile.timezone.value.$error : false
                }"
              />

              <!-- ЯЗЫК -->
              <main-dialog-locale
                :validation="{
                  touched: touched,
                  error: browserProfile.locale.mode !== 'auto' ? $v.browserProfile.locale.value.$error : false
                }"
              />

              <!-- ГЕОЛОКАЦИЯ -->
              <main-dialog-geolocation
                :validation="{
                  touched: touched,
                  latitudeRequired: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.latitude.required : false,
                  latitudeBetween: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.latitude.between : false,
                  longitudeRequired: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.longitude.required : false,
                  longitudeBetween: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.longitude.between : false,
                  accuracyRequired: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.accuracy.required : false,
                  accuracyBetween: browserProfile.geolocation.mode === 'manual' ? $v.browserProfile.geolocation.accuracy.between : false
                }"
              />

              <!-- ПРОЦЕССОР -->
              <main-dialog-cpu />

              <!-- ПАМЯТЬ -->
              <main-dialog-memory />

              <!-- ЭКРАН -->
              <main-dialog-screen
                v-if="browserProfile.browserType === 'anty'"
                :validation="{
                  touched: touched,
                  error: browserProfile.screen.mode === 'manual' ? $v.browserProfile.screen.resolution.$invalid : false
                }"
              />

              <!-- МЕДИАФАЙЛЫ -->
              <main-dialog-media-files v-if="browserProfile.browserType === 'anty'" />

              <!-- ПОРТЫ -->
              <main-dialog-ports v-if="browserProfile.browserType === 'anty'" />

              <!-- DO NOT TRACK -->
              <main-dialog-do-not-track />
              <!-- Command line switches -->
              <main-dialog-command-line-switches />
            </div>

            <div
              id="browserProfilesMainDialogUserData"
              class="mt-3"
            >
              <!-- ЗАМЕТКИ -->
              <notes />

              <!-- ПОЛЯ ПОЛЬЗОВАТЕЛЯ -->
              <!-- <main-dialog-user-data /> -->
            </div>
          </v-tab-item>

          <!-- ДОПОЛНИТЕЛЬНО -->
          <v-tab-item
            style="flex: 2;"
            :transition="false"
            :reverse-transition="false"
          />

          <!-- КУКИСЫ -->
          <!-- <v-tab-item
            style="flex: 2;"
            :transition="false"
            :reverse-transition="false"
          >
            <div class="px-3">
              <main-dialog-cookies />
            </div>
          </v-tab-item> -->

          <!-- АНКЕТА -->
          <v-tab-item
            style="flex: 2;"
            :transition="false"
            :reverse-transition="false"
          />

          <!-- САММАРИ -->
          <div style="flex: 1; z-index: 99; height: inherit;">
            <main-dialog-summary class="px-3" />
          </div>
        </v-tabs-items>
      </v-card-text>

      <!-- МАССОВЫЙ ИМПОРТ -->
      <main-dialog-multiple-import v-else />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import MainDialogBrowserType from './BrowserProfilesMainDialogBrowserType'
import MainDialogGeneral from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogGeneral.vue'
import MainDialogLocale from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogLocale.vue'
import MainDialogPlatform from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogPlatform.vue'
// import MainDialogBrowserType from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogBrowserType.vue'
import MainDialogProxy from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogProxy.vue'
import MainDialogSummary from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogSummary.vue'
import MainDialogTimezone from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogTimezone.vue'
import MainDialogWebrtc from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogWebrtc.vue'
import MainDialogCanvas from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogCanvas.vue'
import MainDialogWebgl from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogWebgl.vue'
import MainDialogUseragent from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogUseragent.vue'
// import MainDialogUserData from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogUserData.vue'
import MainDialogGeolocation from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogGeolocation.vue'
import MainDialogCpu from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogCpu.vue'
import MainDialogMemory from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogMemory.vue'
import MainDialogDoNotTrack from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogDoNotTrack.vue'
import MainDialogCommandLineSwitches from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogCommandLineSwitches.vue'
import MainDialogScreen from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogScreen.vue'
import MainDialogMainWebsite from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogMainWebsite.vue'
import MainDialogCookies from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogCookies.vue'
import MainDialogClientRects from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogClientRects.vue'
import MainDialogMediaFiles from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogMediaFiles.vue'
import MainDialogPorts from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogPorts.vue'

import DialogsHelp from '@/components/dialogs/DialogsHelp.vue'
import DialogsWarning from '@/components/dialogs/DialogsWarning.vue'

import NewFingerprint from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogButtonNewFingerprint.vue'

import { required, between, ipAddress, minLength, minValue } from 'vuelidate/lib/validators'
import Notes from './BrowserProfilesMainDialogNotes'
import axios from 'axios'
import MainDialogMultipleImport from '@/components/browser-profiles/main-dialog/multiple-import/BrowserProfilesMainDialogMultipleImport.vue'
import amplitude from '@/mixins/amplitude.js'

export default {
  name: 'BrowserProfilesMainDialog',

  components: {
    // MainDialogBrowserType,
    MainDialogGeneral,
    MainDialogLocale,
    MainDialogPlatform,
    // MainDialogBrowserType,
    MainDialogProxy,
    MainDialogSummary,
    MainDialogTimezone,
    MainDialogWebrtc,
    MainDialogCanvas,
    MainDialogWebgl,
    MainDialogUseragent,
    // MainDialogUserData,
    MainDialogGeolocation,
    MainDialogCpu,
    MainDialogMemory,
    MainDialogDoNotTrack,
    MainDialogCommandLineSwitches,
    MainDialogScreen,
    DialogsHelp,
    DialogsWarning,
    NewFingerprint,
    Notes,
    MainDialogMainWebsite,
    MainDialogCookies,
    MainDialogMultipleImport,
    MainDialogClientRects,
    MainDialogMediaFiles,
    MainDialogPorts
  },

  mixins: [
    amplitude
  ],

  data () {
    return {
      mainTab: 'newProfile',
      editName: '',
      tab: 0,
      touched: false,
      loading: false,
      mainButtonDisabled: false,
      webglInfoCancelTokenSource: null
    }
  },

  validations () {
    const browserProfile = {
      name: {
        required
      }
    }

    if (this.browserProfile.proxyMode === 1) {
      browserProfile.proxyNew = {
        host: { required },
        port: { required }
      }
    }
    if (this.browserProfile.proxyMode === 2) {
      browserProfile.proxyId = {
        required,
        minValue: minValue(1)
      }
    }

    if (this.browserProfile.locale.mode !== 'auto') {
      browserProfile.locale = {
        value: { required }
      }
    }
    if (this.browserProfile.timezone.mode !== 'auto') {
      browserProfile.timezone = {
        value: { required }
      }
    }
    if (this.browserProfile.useragent.mode !== 'auto') {
      browserProfile.useragent = {
        value: { required }
      }
    }
    if (this.browserProfile.webrtc.mode === 'manual') {
      browserProfile.webrtc = {
        ipAddress: { required, ipAddress }
      }
    }
    if (this.browserProfile.webglInfo.mode === 'manual') {
      browserProfile.webglInfo = {
        vendor: { required, minLength: minLength(3) },
        renderer: { required, minLength: minLength(5) }
      }
    }
    if (this.browserProfile.screen.mode === 'manual') {
      browserProfile.screen = {
        resolution: { required }
      }
    }
    if (this.browserProfile.geolocation.mode === 'manual') {
      browserProfile.geolocation = {
        latitude: {
          required,
          between: between(-90, 90)
        },
        longitude: {
          required,
          between: between(-180, 180)
        },
        accuracy: {
          required,
          between: between(1, 1000)
        },
        marker: {
          required
        }
      }
    }
    return { browserProfile: browserProfile }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      innerHeight: 'main/innerHeight',
      multipleImportLoading: 'browserProfilesMultipleImport/loading',
      warning: 'main/warning',
      mainDialogs: 'main/dialogs'
    }),
    ...mapFields('browserProfiles', ['browserProfiles', 'browserProfile', 'screenResolutions']),

    generalInvalid () {
      const invalid = {}
      invalid.name = this.$v.browserProfile.name.$error.toString()

      if (this.browserProfile.proxyMode === 1) {
        invalid.host = this.$v.browserProfile.proxyNew.host.$error.toString()
        invalid.port = this.$v.browserProfile.proxyNew.port.$error.toString()
      }
      if (this.browserProfile.proxyMode === 2) {
        invalid.savedProxy = this.$v.browserProfile.proxyId.$error.toString()
      }

      return Object.values(invalid).includes('true')
    },

    additionalInvalid () {
      const invalid = {}

      if (this.browserProfile.locale.mode !== 'auto') {
        invalid.locale = this.$v.browserProfile.locale.value.$error.toString()
      }
      if (this.browserProfile.timezone.mode !== 'auto') {
        invalid.timezone = this.$v.browserProfile.timezone.value.$error.toString()
      }
      if (this.browserProfile.useragent.mode !== 'auto') {
        invalid.useragent = this.$v.browserProfile.useragent.value.$error.toString()
      }
      if (this.browserProfile.webrtc.mode === 'manual') {
        invalid.ipAddress = this.$v.browserProfile.webrtc.ipAddress.$error.toString()
      }
      if (this.browserProfile.webglInfo.mode === 'manual') {
        invalid.vendor = this.$v.browserProfile.webglInfo.vendor.$error.toString()
        invalid.renderer = this.$v.browserProfile.webglInfo.renderer.$error.toString()
      }
      if (this.browserProfile.geolocation.mode === 'manual') {
        invalid.latitude = this.$v.browserProfile.geolocation.latitude.$error.toString()
        invalid.longitude = this.$v.browserProfile.geolocation.longitude.$error.toString()
      }
      if (this.browserProfile.screen.mode === 'manual') {
        invalid.resolution = this.$v.browserProfile.screen.resolution.$error.toString()
      }

      return Object.values(invalid).includes('true')
    }
  },

  watch: {
    browserProfile: {
      deep: true,
      handler () {
        this.touched = false
      }
    },

    'browserProfile.platform': {
      handler (newVal, oldVal) {
        if (!this.browserProfile.forEdit && oldVal !== '') {
          this.setUserAgent()
        }
      }
    },

    'browserProfile.browserType': {
      handler (newVal, oldVal) {
        if (newVal !== oldVal) this.newFingerprint()
      }
    },

    'mainDialogs.warning': {
      handler (newVal, oldVal) {
        if (oldVal && !newVal && this.warning.createProfile) {
          if (!this.browserProfile.forEdit) {
            this.addBrowserProfile()
          } else if (this.browserProfile.forEdit) {
            this.saveBrowserProfile()
          }
        }
      }
    }
  },

  created () {
    // this.loadScreens()
    this.editName = this.browserProfile.name
    if (!this.browserProfile.forEdit && localStorage.getItem('browserProfilesAddDialogProxyMode') !== null) {
      this.browserProfile.proxyMode = parseInt(localStorage.getItem('browserProfilesAddDialogProxyMode'), 10)
    }

    if (!this.browserProfile.forEdit && localStorage.getItem('browserProfilesAddDialogProxyMode') === '2' && localStorage.getItem('browserProfilesAddDialogProxyId') !== null) {
      this.browserProfile.proxyId = localStorage.getItem('browserProfilesAddDialogProxyId')
    }
    this.setPlatform()
    if (!this.browserProfile.forEdit) {
      // this.randomize()
      this.newFingerprint()
    }
  },

  beforeDestroy () {
    if (this.webglInfoCancelTokenSource) {
      this.webglInfoCancelTokenSource.cancel()
    }
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')
    },

    loadScreens () {
      let platformIsEmpty = false
      for (const platform in this.screenResolutions) {
        if (this.$_.isEmpty(this.screenResolutions[platform])) {
          platformIsEmpty = true
        }
      }

      if (platformIsEmpty) {
        this.$store.dispatch('browserProfiles/loadScreenResolutions')
      }
    },

    setPlatform () {
      if (!this.browserProfile.forEdit && localStorage.getItem('browserProfilesAddDialogPlatform') === null) {
        const platformArray = [
          { device: 'linux', platform: /Linux/ },
          { device: 'windows', platform: /Windows NT/ },
          { device: 'macos', platform: /Macintosh/ }
        ]

        const platform = navigator.userAgent
        for (const i in platformArray) {
          if (platformArray[i].platform.test(platform)) {
            localStorage.setItem('browserProfilesAddDialogPlatform', platformArray[i].device)
            this.browserProfile.platform = platformArray[i].device
            return
          }
        }
        localStorage.setItem('browserProfilesAddDialogPlatform', 'windows')
        this.browserProfile.platform = 'windows'
      } else if (!this.browserProfile.forEdit) {
        this.browserProfile.platform = localStorage.getItem('browserProfilesAddDialogPlatform')
      }
    },

    async setUserAgent () {
      try {
        this.mainButtonDisabled = true
        const browserVersion = 98

        let url = `/fingerprints/useragent?browser_type=anty&browser_version=${browserVersion}&platform=${this.browserProfile.platform}`
        if (this.browserProfile.useragent.value) {
          url += `&oldUseragent=${this.browserProfile.useragent.value}`
        }

        const response = await this.api.get(url)
        if (response.status === 200 && response.data !== null) {
          this.browserProfile.useragent.mode = 'manual'
          this.browserProfile.useragent.value = response.data.data
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.mainButtonDisabled = false
      }
    },

    async checkBrowserProfile () {
      this.$v.$touch()
      this.touched = true
      if (!this.$v.$invalid) {
        const platformArray = [
          { device: 'linux', platform: /Linux/ },
          { device: 'windows', platform: /Windows_NT/ },
          { device: 'macos', platform: /Darwin/ }
        ]

        const platform = navigator.userAgent
        let samePlatform = 0
        for (const i in platformArray) {
          if (platformArray[i].platform.test(platform) && platformArray[i].device === this.browserProfile.platform) {
            samePlatform++
          }
        }
        if (samePlatform && !this.browserProfile.forEdit) {
          this.addBrowserProfile()
        } else if (samePlatform && this.browserProfile.forEdit) {
          this.saveBrowserProfile()
        } else {
          if (localStorage.getItem('browserProfilesShowWarning') && localStorage.getItem('browserProfilesShowWarning') === 'true' && !this.browserProfile.forEdit) {
            this.addBrowserProfile()
          } else if (localStorage.getItem('browserProfilesShowWarning') && localStorage.getItem('browserProfilesShowWarning') === 'true' && this.browserProfile.forEdit) {
            this.saveBrowserProfile()
          } else {
            await this.$store.dispatch('main/setWarning', { title: '', body: this.$t('dialogs.warning.differentPlatform'), createProfile: false, doNotShowWarning: false })
            await this.$store.dispatch('main/openDialog', 'warning')
          }
        }
      }
    },

    async addBrowserProfile () {
      try {
        this.loading = true
        this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')

        console.log(this.browserProfile.args, 1)
        const data = {
          name: this.browserProfile.name,
          tags: this.browserProfile.tags,
          platform: this.browserProfile.platform,
          browserType: this.browserProfile.browserType,
          mainWebsite: this.browserProfile.mainWebsite === 'none' ? '' : this.browserProfile.mainWebsite,
          useragent: {
            mode: this.browserProfile.useragent.mode,
            value: this.browserProfile.useragent.value
          },
          webrtc: this.browserProfile.webrtc,
          canvas: this.browserProfile.canvas,
          webgl: this.browserProfile.webgl,
          webglInfo: this.browserProfile.webglInfo,
          clientRect: this.browserProfile.clientRect,
          notes: {
            content: this.browserProfile.notes.content === '' ? null : this.browserProfile.notes.content,
            color: this.browserProfile.notes.color === '' ? 'blue' : this.browserProfile.notes.color,
            style: this.browserProfile.notes.style === '' ? 'text' : this.browserProfile.notes.style,
            icon: this.browserProfile.notes.icon === '' || this.browserProfile.notes.icon === 'none' ? null : this.browserProfile.notes.icon
          },
          timezone: {
            mode: this.browserProfile.timezone.mode,
            value: this.browserProfile.timezone.value
          },
          locale: {
            mode: this.browserProfile.locale.mode,
            value: this.browserProfile.locale.value
          },
          proxy: this.$_.cloneDeep(this.browserProfile.proxyNew),
          statusId: this.browserProfile.status ? this.browserProfile.status.id : 0,
          geolocation: this.browserProfile.geolocation,
          cpu: this.browserProfile.cpu,
          memory: this.browserProfile.memory,
          screen: {
            mode: this.browserProfile.screen.mode,
            resolution: this.browserProfile.screen.resolution
          },
          mediaDevices: {
            mode: this.browserProfile.mediaDevices.mode,
            audioInputs: this.browserProfile.mediaDevices.audioInputs,
            videoInputs: this.browserProfile.mediaDevices.videoInputs,
            audioOutputs: this.browserProfile.mediaDevices.audioOutputs
          },
          ports: {
            mode: this.browserProfile.ports.mode,
            blacklist: this.browserProfile.ports.blacklist
          },
          doNotTrack: this.browserProfile.doNotTrack,
          args: this.browserProfile.args && this.browserProfile.args.length && this.browserProfile.args.length > 0 ? this.browserProfile.args.split('\n').map(arg => arg.slice(2)) : [],
          platformVersion: this.browserProfile.platformVersion
        }

        if (this.browserProfile.proxyMode === 0) {
          data.proxy = null
        }

        if (this.browserProfile.proxyMode === 1) {
          if (data.proxy.name === '') {
            if (this.browserProfile.proxyInput.includes('://')) {
              data.proxy.name = this.browserProfile.proxyInput
            } else {
              data.proxy.name = this.browserProfile.proxyNew.type + '://' + this.browserProfile.proxyInput
            }
          }
          if (data.proxy.changeIpUrl === '') {
            delete data.proxy.changeIpUrl
          }
          if (data.proxy.login === '') {
            delete data.proxy.login
          }
          if (data.proxy.password === '') {
            delete data.proxy.password
          }
        }

        if (this.browserProfile.proxyMode === 2) {
          data.proxy = {
            id: this.browserProfile.proxyId
          }
        }

        if (this.browserProfile.browserType === 'anty') {
          data.appCodeName = this.browserProfile.appCodeName
          data.platformName = this.browserProfile.platformName

          data.connectionDownlink = this.browserProfile.connectionDownlink
          data.connectionEffectiveType = this.browserProfile.connectionEffectiveType
          data.connectionRtt = this.browserProfile.connectionRtt
          data.connectionSaveData = this.browserProfile.connectionSaveData

          data.cpuArchitecture = this.browserProfile.cpuArchitecture
          data.osVersion = this.browserProfile.osVersion

          data.vendorSub = this.browserProfile.vendorSub
          data.productSub = this.browserProfile.productSub
          data.vendor = this.browserProfile.vendor
          data.product = this.browserProfile.product
        }

        const browserProfileAdded = await this.$store.dispatch('browserProfiles/addBrowserProfile', data)
        if (browserProfileAdded && browserProfileAdded.browserProfileId) {
          this.amplitudeSendProfileCreate(this.browserProfile, 'create')
          if (this.browserProfile.cookies && !this.$_.isEmpty(this.browserProfile.cookies)) {
            await this.syncApi.post(`/?actionType=importCookies&browserProfileId=${browserProfileAdded.browserProfileId}`, { cookies: this.browserProfile.cookies })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.$store.dispatch('proxy/loadAllProxies')

        this.loading = false
      }
    },

    async saveBrowserProfile () {
      try {
        this.loading = true
        this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')

        console.log(this.browserProfile.args, 2)
        const data = {
          id: this.browserProfile.id,
          data: {
            name: this.browserProfile.name,
            tags: this.browserProfile.tags,
            // platform: this.browserProfile.platform,
            browserType: this.browserProfile.browserType,
            mainWebsite: this.browserProfile.mainWebsite === 'none' ? '' : this.browserProfile.mainWebsite,
            useragent: {
              mode: this.browserProfile.useragent.mode,
              value: this.browserProfile.useragent.value
            },
            webrtc: this.browserProfile.webrtc,
            canvas: this.browserProfile.canvas,
            webgl: this.browserProfile.webgl,
            webglInfo: this.browserProfile.webglInfo,
            clientRect: this.browserProfile.clientRect,
            notes: {
              content: this.browserProfile.notes.content === '' ? null : this.browserProfile.notes.content,
              color: this.browserProfile.notes.color === '' ? 'blue' : this.browserProfile.notes.color,
              style: this.browserProfile.notes.style === '' ? 'text' : this.browserProfile.notes.style,
              icon: this.browserProfile.notes.icon === '' || this.browserProfile.notes.icon === 'none' ? null : this.browserProfile.notes.icon
            },
            timezone: {
              mode: this.browserProfile.timezone.mode,
              value: this.browserProfile.timezone.value
            },
            locale: {
              mode: this.browserProfile.locale.mode,
              value: this.browserProfile.locale.value
            },
            proxy: this.$_.cloneDeep(this.browserProfile.proxyNew),
            statusId: this.browserProfile.status ? this.browserProfile.status.id : 0,
            geolocation: this.browserProfile.geolocation,
            cpu: this.browserProfile.cpu,
            memory: this.browserProfile.memory,
            screen: {
              mode: this.browserProfile.screen.mode,
              resolution: this.browserProfile.screen.resolution
            },
            mediaDevices: {
              mode: this.browserProfile.mediaDevices.mode,
              audioInputs: this.browserProfile.mediaDevices.audioInputs,
              videoInputs: this.browserProfile.mediaDevices.videoInputs,
              audioOutputs: this.browserProfile.mediaDevices.audioOutputs
            },
            ports: {
              mode: this.browserProfile.ports.mode,
              blacklist: this.browserProfile.ports.blacklist
            },
            doNotTrack: this.browserProfile.doNotTrack,
            args: this.browserProfile.args && this.browserProfile.args.length && this.browserProfile.args.length > 0 ? this.browserProfile.args.split('\n').map(arg => arg.slice(2)) : [],
            platformVersion: this.browserProfile.platformVersion
          }
        }

        if (this.browserProfile.proxyMode === 0) {
          data.data.proxy = null
        }

        if (this.browserProfile.proxyMode === 1) {
          if (data.data.proxy.name === '') {
            if (this.browserProfile.proxyInput.includes('://')) {
              data.data.proxy.name = this.browserProfile.proxyInput
            } else {
              data.data.proxy.name = this.browserProfile.proxyNew.type + '://' + this.browserProfile.proxyInput
            }
          }
          if (data.data.proxy.changeIpUrl === '') {
            delete data.data.proxy.changeIpUrl
          }
          if (data.data.proxy.login === '') {
            delete data.data.proxy.login
          }
          if (data.data.proxy.password === '') {
            delete data.data.proxy.password
          }
        }

        if (this.browserProfile.proxyMode === 2) {
          data.data.proxy = {
            id: this.browserProfile.proxyId
          }
        }

        if (this.browserProfile.browserType === 'anty') {
          data.data.appCodeName = this.browserProfile.appCodeName
          data.data.platformName = this.browserProfile.platformName

          data.data.connectionDownlink = this.browserProfile.connectionDownlink
          data.data.connectionEffectiveType = this.browserProfile.connectionEffectiveType
          data.data.connectionRtt = this.browserProfile.connectionRtt
          data.data.connectionSaveData = this.browserProfile.connectionSaveData

          data.data.cpuArchitecture = this.browserProfile.cpuArchitecture
          data.data.osVersion = this.browserProfile.osVersion

          // data.data.screenWidth = this.browserProfile.screenWidth
          // data.data.screenHeight = this.browserProfile.screenHeight

          data.data.vendorSub = this.browserProfile.vendorSub
          data.data.productSub = this.browserProfile.productSub
          data.data.vendor = this.browserProfile.vendor
          data.data.product = this.browserProfile.product
        }

        const browserProfileEditted = await this.$store.dispatch('browserProfiles/editBrowserProfile', data)

        if (browserProfileEditted) {
          this.amplitudeSendProfileEdit(this.browserProfile)
          if (this.browserProfile.cookies && !this.$_.isEmpty(this.browserProfile.cookies)) {
            await this.syncApi.post(`/?actionType=importCookies&browserProfileId=${this.browserProfile.id}`, { cookies: this.browserProfile.cookies })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.$store.dispatch('proxy/loadAllProxies')

        this.loading = false
      }
    },

    async randomize () {
      if (this.browserProfile.webglInfo.mode === 'random') {
        const browserVersion = 98

        this.webglInfoCancelTokenSource = axios.CancelToken.source()
        this.api.get(
          `/fingerprints/webgl?platform=${this.browserProfile.platform}&browser_type=${this.browserProfile.browserType}&browser_version=${browserVersion}&type=webgl`,
          { cancelToken: this.webglInfoCancelTokenSource.token }
        )
          .then(response => {
            if (response.status === 200 && response.data !== null) {
              this.browserProfile.webglInfo.vendor = response.data.webgl_unmasked_vendor
              this.browserProfile.webglInfo.renderer = response.data.webgl_unmasked_renderer
            }

            this.webglInfoCancelTokenSource = null
          })
          .catch(() => {
            this.webglInfoCancelTokenSource = null
          })
      }

      if (this.browserProfile.cpu.mode === 'random') {
        let cpuList
        if (this.browserProfile.platform === 'macos') {
          cpuList = [2, 4, 8, 16]
        } else {
          cpuList = [2, 4, 6, 8, 12, 16]
        }
        this.browserProfile.cpu.value = this.$_.sample(cpuList)
      }

      if (this.browserProfile.memory.mode === 'random') {
        this.browserProfile.memory.value = this.$_.sample([2, 4, 8])
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },

    async newFingerprint () {
      try {
        this.loading = true

        this.browserProfile.webrtc.mode = 'altered'
        this.browserProfile.canvas.mode = 'real'
        this.browserProfile.webgl.mode = 'real'

        const screen = `${window.screen.width}x${window.screen.height}`

        const browserVersion = 98

        const response = await this.api.get(`/fingerprints/fingerprint?platform=${this.browserProfile.platform}&browser_type=${this.browserProfile.browserType}&browser_version=${browserVersion}&type=fingerprint&screen=${screen}`)

        if (response.status === 200 && response.data !== null) {
          this.browserProfile.platformVersion = response.data.platformVersion ? response.data.platformVersion : null

          this.browserProfile.useragent.mode = 'manual'
          this.browserProfile.useragent.value = response.data.useragent || response.data.userAgent

          this.browserProfile.cpu.mode = 'manual'
          this.browserProfile.cpu.value = response.data.hardwareConcurrency !== undefined ? response.data.hardwareConcurrency : parseInt(response.data.cpu, 10)

          this.browserProfile.memory.mode = 'manual'
          this.browserProfile.memory.value = response.data.deviceMemory !== undefined ? response.data.deviceMemory : parseInt(response.data.memory, 10)

          this.browserProfile.webglInfo.mode = 'manual'
          this.browserProfile.webglInfo.vendor = response.data.webgl && response.data.webgl.unmaskedVendor ? response.data.webgl.unmaskedVendor : response.data.webgl_unmasked_vendor
          this.browserProfile.webglInfo.renderer = response.data.webgl && response.data.webgl.unmaskedRenderer ? response.data.webgl.unmaskedRenderer : response.data.webgl_unmasked_renderer

          this.browserProfile.doNotTrack = response.data.donottrack === 'true' || response.data.donottrack === true || parseInt(response.data.donottrack, 10) === 1

          if (this.browserProfile.browserType === 'anty') {
            this.browserProfile.screen.mode = 'real'
            this.browserProfile.screen.resolution = null

            this.browserProfile.appCodeName = response.data.appCodeName
            this.browserProfile.platformName = response.data.platform

            this.browserProfile.connectionDownlink = response.data.connection.downlink
            this.browserProfile.connectionEffectiveType = response.data.connection.effectiveType
            this.browserProfile.connectionRtt = response.data.connection.rtt
            this.browserProfile.connectionSaveData = response.data.connection.saveData

            this.browserProfile.cpuArchitecture = response.data.cpu.architecture
            this.browserProfile.osVersion = response.data.os.version

            // this.browserProfile.screenWidth = response.data.screen.width
            // this.browserProfile.screenHeight = response.data.screen.height

            this.browserProfile.vendorSub = response.data.vendorSub
            this.browserProfile.productSub = response.data.productSub
            this.browserProfile.vendor = response.data.vendor
            this.browserProfile.product = response.data.product
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    scrollTo (element) {
      if (element === 'tabGeneral') {
        document.querySelector('#browserProfilesMainDialogGeneral').scrollIntoView()
      }
      if (element === 'tabAdditional') {
        document.querySelector('#browserProfilesMainDialogAdditional').scrollIntoView()
      }
      if (element === 'tabUserData') {
        document.querySelector('#browserProfilesMainDialogUserData').scrollIntoView()
      }
    },
    scrollListener (event) {
      const additionalEl = document.querySelector('#browserProfilesMainDialogAdditional')
      const userDataEl = document.querySelector('#browserProfilesMainDialogUserData')

      if (
        userDataEl.offsetTop - event.target.scrollTop <= event.target.offsetHeight / 4 ||
        event.target.scrollTop + event.target.offsetHeight > event.target.scrollHeight - 5
      ) {
        this.tab = 2
      } else if (additionalEl.offsetTop - event.target.scrollTop <= event.target.offsetHeight / 4) {
        this.tab = 1
      } else {
        this.tab = 0
      }
    }
  }

}
</script>
<style>
  .main-dialog-tabs-items .v-window__container {
    display: flex;
    flex-direction: row;
  }
</style>
