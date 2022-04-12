<template>
  <v-card-text
    style="overflow-y: auto; margin-top: 48px; height: 800px;"
    class="px-0 pb-8"
    @scroll="scrollListener"
  >
    <!-- ТАБЫ -->
    <v-tabs
      v-model="currentTab"
      grow
      class="main-dialog-tabs"
    >
      <v-tab
        v-for="tab in tabs"
        :key="`main-dialog-multiple-import-tabs-${tab.name}`"
        @click="scrollTo(tab.name)"
      >
        <v-badge
          :value="tabError.includes(tab.name)"
          dot
          color="error"
        >
          {{ tab.title }}
        </v-badge>
      </v-tab>
    </v-tabs>

    <!-- КОНТЕНТ ТАБОВ -->
    <v-tabs-items
      :value="0"
      class="px-6 main-dialog-tabs-items"
    >
      <v-tab-item
        v-for="tab in tabs"
        :key="`main-dialog-multiple-import-tabs-tab-item-${tab.name}`"
        :transition="false"
        :reverse-transition="false"
        style="width: 100%;"
      >
        <component
          :is="tab.component"
          :validation="$v"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-card-text>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { required, minValue, minLength, between } from 'vuelidate/lib/validators'
import MultipleImportGeneral from './BrowserProfilesMainDialogMultipleImportGeneral.vue'
// import MultipleImportAdditional from './BrowserProfilesMainDialogMultipleImportAdditional.vue'
import MultipleImportCookies from './BrowserProfilesMainDialogMultipleImportCookies.vue'
import parseProxyString from '@/mixins/parseProxy.js'
import parseCookies from '@/mixins/parseCookies.js'

export default {
  name: 'BrowserProfilesMainDialogMultipleImport',

  components: {
    MultipleImportGeneral,
    // MultipleImportAdditional,
    MultipleImportCookies
  },

  mixins: [
    parseProxyString,
    parseCookies
  ],

  data () {
    return {
      currentTab: 0,
      tabs: [
        {
          name: 'general',
          title: this.$t('common.general'),
          component: 'MultipleImportGeneral'
        },
        {
          name: 'additional',
          title: this.$t('common.additional'),
          component: 'MultipleImportAdditional'
        }
      ],
      createdProfiles: []
    }
  },

  validations () {
    const browserProfile = {
      multipleImportData: {
        required,
        minLength: minLength(1),
        $each: {
          minLength: minLength(5)
        }
      }
    }

    if (this.browserProfile.proxyMode === 1) {
      browserProfile.proxyNew = {
        host: { required },
        port: { required }
      }
    }
    if (this.browserProfile.proxyMode === 2) {
      browserProfile.proxyId = { required, minValue: minValue(1) }
    }
    if (this.browserProfile.useragent.mode === 'manual') {
      browserProfile.useragent = {
        value: { required }
      }
    }
    if (this.browserProfile.webrtc.mode === 'manual') {
      browserProfile.webrtc = {
        ipAddress: { required }
      }
    }
    if (this.browserProfile.webglInfo.mode === 'manual') {
      browserProfile.webglInfo = {
        vendor: { required, minLength: minLength(3) },
        renderer: { required, minLength: minLength(5) }
      }
    }
    if (this.browserProfile.timezone.mode === 'manual') {
      browserProfile.timezone = {
        value: { required }
      }
    }
    if (this.browserProfile.locale.mode === 'manual') {
      browserProfile.locale = {
        value: { required }
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
    if (this.browserProfile.screen.mode === 'manual') {
      browserProfile.screen = {
        resolution: { required }
      }
    }

    return { browserProfile: browserProfile }
  },

  computed: {
    ...mapGetters({
      innerHeight: 'main/innerHeight',
      pagination: 'browserProfiles/pagination',
      proxies: 'proxy/proxies',
      screenResolutions: 'browserProfiles/screenResolutions'
    }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    tabError () {
      const tabs = []

      if (this.browserProfileTouched) {
        const generalErrors = {}

        generalErrors.multipleImportData = this.$v.browserProfile.multipleImportData.$error.toString()

        if (this.browserProfile.proxyMode === 1) {
          generalErrors.host = this.$v.browserProfile.proxyNew.host.$error.toString()
          generalErrors.port = this.$v.browserProfile.proxyNew.port.$error.toString()
        }
        if (this.browserProfile.proxyMode === 2) {
          generalErrors.savedProxy = this.$v.browserProfile.proxyId.$error.toString()
        }

        if (this.currentTab !== 0 && Object.values(generalErrors).includes('true')) {
          tabs.push('general')
        }

        const additionalErrors = {}

        if (this.browserProfile.useragent.mode === 'manual') {
          additionalErrors.useragent = this.$v.browserProfile.useragent.value.$error.toString()
        }
        if (this.browserProfile.webrtc.mode === 'manual') {
          additionalErrors.webrtc = this.$v.browserProfile.webrtc.ipAddress.$error.toString()
        }
        if (this.browserProfile.webglInfo.mode === 'manual') {
          additionalErrors.vendor = this.$v.browserProfile.webglInfo.vendor.$error.toString()
          additionalErrors.renderer = this.$v.browserProfile.webglInfo.renderer.$error.toString()
        }
        if (this.browserProfile.timezone.mode === 'manual') {
          additionalErrors.timezone = this.$v.browserProfile.timezone.value.$error.toString()
        }
        if (this.browserProfile.locale.mode === 'manual') {
          additionalErrors.locale = this.$v.browserProfile.locale.value.$error.toString()
        }
        if (this.browserProfile.geolocation.mode === 'manual') {
          additionalErrors.latitude = this.$v.browserProfile.geolocation.latitude.$error.toString()
          additionalErrors.longitude = this.$v.browserProfile.geolocation.longitude.$error.toString()
        }

        if (this.currentTab !== 1 && Object.values(additionalErrors).includes('true')) {
          tabs.push('additional')
        }
      }

      return tabs
    }
  },

  watch: {
    browserProfile: {
      deep: true,
      handler () {
        this.browserProfileTouched = false
        this.$v.$reset()
      }
    },

    async browserProfileTouched (newVal) {
      if (newVal) {
        await this.$v.$touch()

        if (!this.$v.$invalid && Array.isArray(this.browserProfile.multipleImportData)) {
          this.createdProfiles = []
          this.addBrowserProfiles(this.browserProfile.multipleImportData, 1)
        }
      }
    }
  },

  methods: {
    scrollTo (element) {
      if (element === 'general') {
        document.querySelector('#multipleImportGeneralInput').scrollIntoView()
      }
      if (element === 'additional') {
        document.querySelector('#multipleImportAdditionalUseragent').scrollIntoView()
      }
    },

    scrollListener () {
      if (!document.querySelector('#multipleImportAdditionalUseragent')) return

      const useragent = document.querySelector('#multipleImportAdditionalUseragent').getBoundingClientRect()

      if (useragent.y > this.innerHeight / 2) {
        this.currentTab = 0
      } else {
        this.currentTab = 1
      }
    },

    compareProxy (proxy) {
      if (!proxy) return

      return this.proxies.all.find(p => {
        return p.host === proxy.host &&
          p.port === proxy.port &&
          p.type === proxy.type &&
          p.login === proxy.login &&
          p.password === proxy.password &&
          p.changeIpUrl === proxy.changeIpUrl
      })
    },

    // addBrowserProfiles (parsedData, iteration) {
    //   try {
    //     this.$store.dispatch('browserProfilesMultipleImport/setLoading', {
    //       key: 'mainDialog',
    //       value: true
    //     })

    //     const end = iteration * 25
    //     const start = end - 25

    //     const profiles = []
    //     for (let i = start; i < end; i++) {
    //       if (parsedData[i]) {
    //         profiles.push(parsedData[i])
    //       }
    //     }

    //     Promise.all(profiles.map(profile => this.addBrowserProfile(profile)))
    //       .then((values) => {
    //         for (const value of values) {
    //           if (value) this.createdProfiles.push(value)
    //         }
    //       })
    //       .finally(() => {
    //         this.$store.dispatch('browserProfilesMultipleImport/setLoading', {
    //           key: 'mainDialog',
    //           value: false
    //         })

    //         if (parsedData.length > end) {
    //           this.addBrowserProfiles(parsedData, ++iteration)
    //         } else {
    //           const idsLength = this.createdProfiles.length
    //           this.$store.dispatch('main/alert', {
    //             color: 'success',
    //             message: `${this.$tc('browserProfiles.multipleImport.imported', idsLength)} ${idsLength} ${this.$tc('browserProfiles.multipleImport.profiles', idsLength)}`
    //           })
    //           this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')
    //           this.$store.dispatch('browserProfiles/loadTags')
    //           this.$store.dispatch('browserProfiles/loadCurrentPage')

    //           if ([1, 3].includes(parseInt(this.browserProfile.proxyMode, 10))) {
    //             this.$store.dispatch('proxy/loadAllProxies')
    //           }
    //         }
    //       })
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    async addBrowserProfiles (parsedData) {
      try {
        this.$store.dispatch('browserProfilesMultipleImport/setLoading', {
          key: 'mainDialog',
          value: true
        })

        for (const profile of parsedData) {
          const profileId = await this.addBrowserProfile(profile)
          if (profileId) {
            this.createdProfiles.push(profileId)

            try {
              if (this.browserProfile.needToSetProxyId && !this.$_.isEmpty(this.browserProfile.newSavedProxies)) {
                this.browserProfile.needToSetProxyId = false
                const response = await this.api(`/browser_profiles/${profileId}`, { headers: { 'X-Anty-App-Version': 1 } })
                if (response.status === 200) {
                  const savedProxyLastIndex = this.browserProfile.newSavedProxies.length - 1
                  this.browserProfile.newSavedProxies[savedProxyLastIndex].id = response.data.data.proxyId
                }

                const identify = new this.$amplitude.Identify().add('proxies count', 1)
                this.$amplitude.getInstance().identify(identify)

                this.$amplitude.getInstance().logEvent('Proxy Create')
              }
            } catch (_) { /* */ }
          }
        }

        const idsLength = this.createdProfiles.length
        this.$store.dispatch('main/alert', {
          color: 'success',
          message: `${this.$tc('browserProfiles.multipleImport.imported', idsLength)} ${idsLength} ${this.$tc('browserProfiles.multipleImport.profiles', idsLength)}`
        })
        this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')
        this.$store.dispatch('browserProfiles/loadTags')
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('proxy/loadAllProxies')
      } catch (err) {
        console.log(err)
      } finally {
        this.browserProfile.newSavedProxies = []
        this.$store.dispatch('browserProfilesMultipleImport/setLoading', {
          key: 'mainDialog',
          value: false
        })
      }
    },

    async handleRandom (browserProfile) {
      if (this.browserProfile.useragent.mode === 'random') {
        const browserVersion = 98
        const response = await this.api.get(`/fingerprints/useragent?platform=${this.browserProfile.platform}&browser_type=anty&browser_version=${browserVersion}`)
        if (response.status === 200 && response.data !== null) {
          browserProfile.randomUseragent = response.data.data
        }
      }

      if (this.browserProfile.webglInfo.mode === 'random') {
        const browserVersion = 98

        const response = await this.api.get(`/fingerprints/webgl?platform=${this.browserProfile.platform}&browser_type=${this.browserProfile.browserType}&browser_version=${browserVersion}&type=webgl`)
        if (response.status === 200 && response.data !== null) {
          browserProfile.randomWebglInfoVendor = response.data.webgl_unmasked_vendor
          browserProfile.randomWebglInfoRenderer = response.data.webgl_unmasked_renderer
        }
      }

      if (this.browserProfile.cpu.mode === 'random') {
        let cpuList = [2, 4, 6, 8, 12, 16]
        if (this.browserProfile.platform === 'macos') {
          cpuList = [2, 4, 8, 16]
        }
        browserProfile.randomCpu = this.$_.sample(cpuList)
      }

      if (this.browserProfile.memory.mode === 'random') {
        const memoryNumbers = [2, 4, 8]
        browserProfile.randomMemory = this.$_.sample(memoryNumbers)
      }

      if (this.browserProfile.screen.mode === 'random') {
        browserProfile.randomResolution = this.$_.sample(this.screenResolutions[this.browserProfile.platform])
      }

      if (this.browserProfile.mediaDevices.mode === 'random') {
        const numbers = [1, 2]
        browserProfile.randomAudioInputs = this.$_.sample(numbers)
        browserProfile.randomVideoInputs = 1
        browserProfile.randomAudioOutputs = this.$_.sample(numbers)
      }
    },

    async addBrowserProfile (data) {
      const browserProfile = {
        name: data[0],
        notes: this.$_.cloneDeep(this.browserProfile.notes)
      }

      await this.handleRandom(browserProfile)

      if (data[1]) {
        const parsedCookies = await this.parseCookies(data[1])
        if (parsedCookies) {
          browserProfile.cookies = Array.isArray(parsedCookies.cookies) && parsedCookies.cookies.length > 0 ? parsedCookies.cookies : null
        }
      }

      if (this.browserProfile.proxyMode === 0) {
        browserProfile.proxy = null
      }

      if (this.browserProfile.proxyMode === 2) {
        delete browserProfile.proxy
        browserProfile.proxy = {
          id: this.browserProfile.proxyId
        }
      }

      const proxyTypeFromFile = data[2] ? data[2].toString().toLowerCase().trim() : ''

      if (this.browserProfile.proxyMode === 3 && data[3] && proxyTypeFromFile !== 'noproxy') {
        const type = data[3] ? data[2] : 'http'
        const parsedProxy = await this.parseProxyString(`${type}://${data[3]}`)
        const existingProxy = await this.compareProxy(parsedProxy)

        if (parsedProxy && existingProxy) {
          delete browserProfile.proxy
          browserProfile.proxy = { id: existingProxy.id }
        } else if (parsedProxy) {
          browserProfile.proxy = {
            name: `${data[0]} proxy`,
            host: parsedProxy.host,
            port: parsedProxy.port,
            type: parsedProxy.type,
            login: parsedProxy.login,
            password: parsedProxy.password,
            changeIpUrl: parsedProxy.changeIpUrl
          }

          if (parsedProxy.name === '') {
            browserProfile.proxy.name = `${data[0]} proxy`
          }
          if (parsedProxy.changeIpUrl === '') {
            delete browserProfile.proxy.changeIpUrl
          }
          if (parsedProxy.login === '') {
            delete browserProfile.proxy.login
          }
          if (parsedProxy.password === '') {
            delete browserProfile.proxy.password
          }

          if (!this.$_.isEmpty(this.browserProfile.newSavedProxies)) {
            try {
              for (const savedProxy of this.browserProfile.newSavedProxies) {
                if (
                  savedProxy.host === browserProfile.proxy?.host &&
                  savedProxy.port === browserProfile.proxy?.port &&
                  savedProxy.type === browserProfile.proxy?.type &&
                  savedProxy.login === browserProfile.proxy?.login &&
                  savedProxy.password === browserProfile.proxy?.password &&
                  savedProxy.changeIpUrl === browserProfile.proxy?.changeIpUrl
                ) {
                  browserProfile.proxy = {
                    id: savedProxy.id
                  }
                }
              }

              if (browserProfile.proxy.id === undefined) {
                this.$store.dispatch('browserProfilesMultipleImport/pushToNewSavedProxies', this.$_.cloneDeep(browserProfile.proxy))
              }
            } catch (_) { /* */ }
          } else {
            this.$store.dispatch('browserProfilesMultipleImport/pushToNewSavedProxies', this.$_.cloneDeep(browserProfile.proxy))
          }
        } else {
          browserProfile.proxy = null
        }
      } else if (this.browserProfile.proxyMode === 3 && (!data[3] || proxyTypeFromFile === 'noproxy')) {
        browserProfile.proxy = null
      }

      if (this.browserProfile.useragent.mode === 'fromFile') {
        browserProfile.useragent = {
          mode: 'manual',
          value: data[4]
        }
      }

      if (data[5]) {
        browserProfile.notes.content = data[5]
      }

      return await this.$store.dispatch('browserProfilesMultipleImport/addBrowserProfile', browserProfile)
    }
  }
}
</script>
