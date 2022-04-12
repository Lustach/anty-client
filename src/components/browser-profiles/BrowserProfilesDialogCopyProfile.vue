<template>
  <v-dialog
    :value="dialogs.copyProfile"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'copyProfile')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'copyProfile')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('common.copyProfile') + ' [' + browserProfileName + ']' }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'copyProfile')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-progress-linear
        v-if="loading"
        v-model="done"
      />

      <v-card-text class="pt-6">
        <v-slider
          v-model="copiesNumbers"
          class="align-center mb-2"
          :max="30"
          :min="1"
          hide-details
          :thumb-size="24"
          thumb-label="always"
        >
          <template #prepend>
            <v-text-field
              id="profilesCopyDialogCopiesNumber"
              :value="copiesNumbers"
              :label="$t('common.copiesNumbers')"
              class="mt-0 pt-0"
              dense
              outlined
              hide-details
              maxlength="2"
              min="1"
              @input="changeCopiesNumbers"
              @keypress="filterPositiveNumbers"
            />
          </template>
        </v-slider>

        <v-text-field
          v-model="browserProfilePrefix"
          :label="$t('browserProfiles.title')"
          :error="browserProfilePrefixError"
          class="my-5"
          dense
          outlined
          hide-details
        />

        <v-switch
          v-model="randomizeFingerprint"
          :label="$t('common.randomizeFingerprint')"
          dense
          hide-details
          class="mt-0"
          @change="saveRandomizeFingerprint"
        />
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          small
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'copyProfile')"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="profilesCopyDialogButtonCopy"
          small
          text
          color="primary"
          :loading="loading"
          @click="copyProfile"
        >
          {{ $t('common.copy') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import amplitude from '@/mixins/amplitude.js'

export default {
  name: 'BrowserProfilesDialogCopyProfile',

  mixins: [
    amplitude
  ],

  data () {
    return {
      knowledge: 0,
      browserProfileName: '',
      copiesNumbers: 1,
      randomizeFingerprint: true,
      done: 0,
      loading: false,
      browserProfilePrefixRegex: new RegExp('\\{start ID from (\\d+)\\}'),
      browserProfilePrefix: '',
      browserProfilePrefixError: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfile: 'browserProfiles/fullBrowserProfile',
      proxies: 'proxy/proxies'
    }),
    ...mapFields('browserProfiles', ['screenResolutions'])
  },

  watch: {
    copiesNumbers: {
      handler (newVal) {
        localStorage.setItem('browserProfilesDialogCopyProfileCopiesNumbers', newVal)

        this.browserProfilePrefixError = (!this.browserProfilePrefix.match(this.browserProfilePrefixRegex) && newVal !== 1)
      }
    },
    browserProfilePrefix: {
      handler (newVal) {
        this.browserProfilePrefixError = (!newVal.match(this.browserProfilePrefixRegex) && this.copiesNumbers !== 1)
      }
    }
  },

  created () {
    this.browserProfileName = this.browserProfile.name
    this.browserProfilePrefix = this.browserProfile.name + ' {start ID from 1}'

    if (localStorage.getItem('browserProfilesDialogCopyProfileCopiesNumbers') !== null) {
      this.copiesNumbers = parseInt(localStorage.getItem('browserProfilesDialogCopyProfileCopiesNumbers'), 10)
    }

    if (localStorage.getItem('browserProfilesDialogCopyProfileRandomizeFingerprint') !== null) {
      this.randomizeFingerprint = localStorage.getItem('browserProfilesDialogCopyProfileRandomizeFingerprint') === 'true'
    }
  },

  methods: {
    async copyProfile () {
      try {
        let fingerprintError = false
        let counter = 0
        this.done = 0
        this.loading = true
        const proxyExist = this.proxies.all.findIndex(i => parseInt(i.id, 10) === parseInt(this.browserProfile.proxyId, 10))

        let startingFromMatches
        if (!(startingFromMatches = this.browserProfilePrefix.match(this.browserProfilePrefixRegex)) && this.copiesNumbers !== 1) {
          this.browserProfilePrefixError = true
          return
        }
        this.browserProfilePrefixError = false

        const startingFrom = startingFromMatches ? +startingFromMatches[1] : 0

        for (let copyIndex = startingFrom; copyIndex < startingFrom + this.copiesNumbers; copyIndex++) {
          const data = {
            name: this.browserProfilePrefix.replace(this.browserProfilePrefixRegex, copyIndex),
            tags: Array.isArray(this.browserProfile.tags) ? this.browserProfile.tags : [],
            platform: this.browserProfile.platform,
            browserType: 'anty',
            mainWebsite: this.browserProfile.mainWebsite === 'none' ? '' : this.browserProfile.mainWebsite,
            useragent: this.browserProfile.useragent,
            webrtc: this.browserProfile.webrtc,
            canvas: this.browserProfile.canvas,
            webgl: this.browserProfile.webgl,
            webglInfo: this.browserProfile.webglInfo,
            timezone: this.browserProfile.timezone,
            locale: this.browserProfile.locale,
            geolocation: this.browserProfile.geolocation,
            cpu: this.browserProfile.cpu,
            memory: this.browserProfile.memory,
            screen: this.browserProfile.screen &&
              typeof this.browserProfile.screen === 'object' ? this.browserProfile.screen : {},
            doNotTrack: this.browserProfile.doNotTrack,
            statusId: 0,
            mediaDevices: this.browserProfile.mediaDevices &&
              typeof this.browserProfile.mediaDevices === 'object' ? this.browserProfile.mediaDevices : {},
            platformName: this.browserProfile.platformName &&
              typeof this.browserProfile.platformName === 'string' ? this.browserProfile.platformName : '',
            cpuArchitecture: this.browserProfile.cpuArchitecture &&
              typeof this.browserProfile.cpuArchitecture === 'string' ? this.browserProfile.cpuArchitecture : '',
            osVersion: this.browserProfile.osVersion &&
              typeof this.browserProfile.osVersion === 'string' ? this.browserProfile.osVersion : '',
            connectionEffectiveType: this.browserProfile.connectionEffectiveType &&
              typeof this.browserProfile.connectionEffectiveType === 'string' ? this.browserProfile.connectionEffectiveType : '',
            vendorSub: this.browserProfile.vendorSub &&
              typeof this.browserProfile.vendorSub === 'string' ? this.browserProfile.vendorSub : '',
            productSub: this.browserProfile.productSub &&
              typeof this.browserProfile.productSub === 'string' ? this.browserProfile.productSub : '',
            vendor: this.browserProfile.vendor &&
              typeof this.browserProfile.vendor === 'string' ? this.browserProfile.vendor : '',
            product: this.browserProfile.product &&
              typeof this.browserProfile.product === 'string' ? this.browserProfile.product : '',
            appCodeName: this.browserProfile.appCodeName &&
              typeof this.browserProfile.appCodeName === 'string' ? this.browserProfile.appCodeName : '',
            ports: this.browserProfile.ports &&
              typeof this.browserProfile.ports === 'object' ? this.browserProfile.ports : {},
            clientRect: this.browserProfile.clientRect &&
              typeof this.browserProfile.clientRect === 'object' ? this.browserProfile.clientRect : {},
            // screenWidth: this.browserProfile.screenWidth &&
            //   typeof this.browserProfile.screenWidth === 'number' ? this.browserProfile.screenWidth : 0,
            // screenHeight: this.browserProfile.screenHeight &&
            //   typeof this.browserProfile.screenHeight === 'number' ? this.browserProfile.screenHeight : 0,
            connectionDownlink: this.browserProfile.connectionDownlink &&
              typeof this.browserProfile.connectionDownlink === 'number' ? this.browserProfile.connectionDownlink : 0,
            connectionRtt: this.browserProfile.connectionRtt &&
              typeof this.browserProfile.connectionRtt === 'number' ? this.browserProfile.connectionRtt : 0,
            connectionSaveData: this.browserProfile.connectionSaveData &&
              typeof this.browserProfile.connectionSaveData === 'number' ? this.browserProfile.connectionSaveData : 0,
            platformVersion: this.browserProfile.platformVersion ? this.browserProfile.platformVersion : null
          }
          if (proxyExist > -1 && this.browserProfile.proxy) {
            data.proxy = this.$_.cloneDeep(this.browserProfile.proxy)
          }
          if (proxyExist > -1 && this.browserProfile.proxyId) {
            data.proxyId = this.browserProfile.proxyId
          }

          if (this.randomizeFingerprint) {
            try {
              data.webrtc.mode = 'altered'
              data.canvas.mode = 'real'
              data.webgl.mode = 'real'

              const fingerprint = await this.getFingerprint()

              if (fingerprint) {
                data.platformVersion = fingerprint.platformVersion ? fingerprint.platformVersion : null

                data.useragent.mode = 'manual'
                data.useragent.value = fingerprint.useragent || fingerprint.userAgent

                data.cpu.mode = 'manual'
                data.cpu.value = fingerprint.hardwareConcurrency !== undefined ? fingerprint.hardwareConcurrency : parseInt(fingerprint.cpu, 10)

                data.memory.mode = 'manual'
                data.memory.value = fingerprint.deviceMemory !== undefined ? fingerprint.deviceMemory : parseInt(fingerprint.memory, 10)

                data.webglInfo.mode = 'manual'
                data.webglInfo.vendor = fingerprint.webgl && fingerprint.webgl.unmaskedVendor ? fingerprint.webgl.unmaskedVendor : fingerprint.webgl_unmasked_vendor
                data.webglInfo.renderer = fingerprint.webgl && fingerprint.webgl.unmaskedRenderer ? fingerprint.webgl.unmaskedRenderer : fingerprint.webgl_unmasked_renderer

                data.doNotTrack = fingerprint.donottrack === 'true' || fingerprint.donottrack === true || parseInt(fingerprint.donottrack, 10) === 1

                data.screen.mode = 'real'
                data.screen.resolution = null

                data.appCodeName = fingerprint.appCodeName
                data.platformName = fingerprint.platform

                data.connectionDownlink = fingerprint.connection.downlink
                data.connectionEffectiveType = fingerprint.connection.effectiveType
                data.connectionRtt = fingerprint.connection.rtt
                data.connectionSaveData = fingerprint.connection.saveData

                data.cpuArchitecture = fingerprint.cpu.architecture
                data.osVersion = fingerprint.os.version

                data.vendorSub = fingerprint.vendorSub
                data.productSub = fingerprint.productSub
                data.vendor = fingerprint.vendor
                data.product = fingerprint.product
              } else {
                fingerprintError = true
              }
            } catch (err) {
              console.log(err)
            }
          }

          if (fingerprintError) {
            throw new Error('fingerprintError')
          }

          const response = await this.api.post('/browser_profiles', data)

          if (response.status === 200) {
            this.amplitudeSendProfileCreate(this.browserProfile, 'copy')

            counter++
            this.done = (100 * counter) / this.copiesNumbers
          }
        }

        this.$store.dispatch('main/alert', {
          color: 'success',
          message: this.$t('common.copied')
        })
        this.closeDialog()
      } catch (err) {
        if (err.message === 'fingerprintError') {
          this.$store.dispatch('main/alert', {
            color: 'error',
            message: this.$t('errors.noSuitableUseragents')
          })
        }
        console.log(err)
        this.closeDialog()
      } finally {
        this.loading = false
      }
    },

    saveRandomizeFingerprint (value) {
      localStorage.setItem('browserProfilesDialogCopyProfileRandomizeFingerprint', value)
    },

    changeCopiesNumbers (copiesNumbers) {
      if (copiesNumbers >= 1 && copiesNumbers <= 30) {
        this.copiesNumbers = copiesNumbers
      } else if (copiesNumbers < 1) {
        this.copiesNumbers = 1
      } else if (copiesNumbers > 30) {
        this.copiesNumbers = 30
      }
    },

    filterPositiveNumbers (evt) {
      const value = evt.target.value.toString() + evt.key.toString()

      if (!/^[1-9][0-9]*$/.test(value)) {
        evt.preventDefault()
      } else {
        return true
      }
    },

    closeDialog () {
      this.$store.dispatch('browserProfiles/closeDialog', 'copyProfile')
      this.$store.dispatch('browserProfiles/loadCurrentPage')
      this.$store.dispatch('main/getSubscription')
    },

    async getFingerprint () {
      const screen = `${window.screen.width}x${window.screen.height}`
      const browserVersion = 98

      for (let i = 0; i < 3; i++) {
        const response = await this.api.get(`/fingerprints/fingerprint?platform=${this.browserProfile.platform}&browser_type=anty&browser_version=${browserVersion}&type=fingerprint&screen=${screen}`)

        if (response && response.status === 200 && response.data) {
          return response.data
        }
      }

      return null
    }
  }
}
</script>
