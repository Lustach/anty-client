<template>
  <v-btn
    id="browserProfilesMainDialogButtonNewFingerprint"
    text
    :loading="loading"
    @click="newFingerprint"
  >
    <v-icon
      :size="16"
      class="mr-1"
    >
      mdi-sync
    </v-icon>
    {{ $t('browserProfiles.newFingerprint') }}
  </v-btn>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogButtonNewFingerprint',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile', 'screenResolutions'])
  },

  methods: {
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
    }
  }
}
</script>
