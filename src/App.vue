<template>
  <v-app class="anty-font">
    <dialogs-downloading-chrome v-if="browserDownloading.show" />
    <dialogs-error v-if="dialogs.error" />
    <dialogs-feedback v-if="dialogs.feedback" />
    <dialogs-logout-confirmation v-if="dialogs.logoutConfirmation" />
    <dialogs-edit-profile v-if="dialogs.editProfile" />
    <sidebar />
    <alert style="margin-left: 28px;" />
    <v-main
      style="padding: 8px 8px 24px 64px"
    >
      <router-view />
    </v-main>
    <info-bar v-if="!['Login', 'Registration'].includes($route.name)" />
    <div
      v-if="['Login', 'Registration'].includes($route.name)"
      style="text-align: end;"
      class="mr-2"
    >
      {{ $t('common.version').toLowerCase() }} {{ appVersion }}
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Alert from './components/Alert.vue'
import Sidebar from './components/Sidebar.vue'
import DialogsError from './components/dialogs/DialogsError.vue'
import DialogsFeedback from './components/dialogs/DialogsFeedback.vue'
import DialogsLogoutConfirmation from './components/dialogs/DialogsLogoutConfirmation.vue'
import InfoBar from './components/InfoBar.vue'
import DialogsDownloadingChrome from './components/dialogs/DialogsDownloadingChrome.vue'
import amplitudeMixin from '@/mixins/amplitude.js'
import amplitude from 'amplitude-js'
import DialogsEditProfile from './components/dialogs/DialogsEditProfile.vue'

export default {
  name: 'App',

  components: {
    Alert,
    Sidebar,
    DialogsError,
    DialogsFeedback,
    DialogsLogoutConfirmation,
    InfoBar,
    DialogsDownloadingChrome,
    DialogsEditProfile
  },

  mixins: [
    amplitudeMixin
  ],

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'main/dialogs'
    }),
    ...mapFields('browserProfiles', ['chromeExists']),
    ...mapFields('main', ['profileAuthorized', 'browserDownloading'])
  },

  async beforeCreate () {
    if (localStorage.getItem('remoteApiToken')) {
      this.profileAuthorized = true
    }
    await this.$store.dispatch('main/getSubscription')
  },

  created: async function () {
    this.getAppVersion()
    this.initAmplitude()
    this.$store.dispatch('settings/loadSettings')
      .then(() => {
        this.localApi.post('/settings', this.settings)
      })

    if (localStorage.getItem('remoteApiToken')) {
      this.amplitudeSendIdentify()
    }

    this.$store.dispatch('main/setInnerHeight', window.innerHeight)
    window.addEventListener('resize', this.setInnerHeight)

    if (localStorage.getItem('remoteApiToken')) {
      this.$store.dispatch('main/loadProfile')
      this.localApi.post('/remote_api_token', { token: localStorage.getItem('remoteApiToken') })
    }

    this.syncApi.interceptors.response.use(response => { return response },
      async error => this.apiErrorHandling(error))

    this.api.interceptors.response.use(response => { return response },
      async error => this.apiErrorHandling(error))
  },

  sockets: {
    browserDownloading (data) {
      this.browserDownloading.showProgress = true
      this.browserDownloading.stage = data.stage
      this.browserDownloading.percentage = data.percentage
      if (parseInt(data.percentage) === 100) this.browserDownloading.showProgress = false

      if (data.stage === 'setupEnded') {
        this.browserDownloading.show = false
        this.browserDownloading.stage = null
      } else if (!this.browserDownloading.show) {
        this.browserDownloading.show = true
      }
    },

    browserProfileStopped (data) {
      this.$store.dispatch('browserProfiles/setBrowserProfileTimer', { id: parseInt(data.profileId, 10), action: 'remove' })
      this.$store.dispatch('browserProfiles/sendEventStop', parseInt(data.profileId, 10))
      this.$store.dispatch('browserProfiles/removeRunning', parseInt(data.profileId, 10))
      this.$store.dispatch('browserProfiles/addSync', parseInt(data.profileId, 10))
      this.$store.dispatch('browserProfiles/removeLoading', parseInt(data.profileId, 10))

      // this.$amplitude.getInstance().logEvent('Profile Stop')
    },

    browserProfileStarted (data) {
      this.$store.dispatch('browserProfiles/setBrowserProfileTimer', { id: parseInt(data.profileId, 10), date: Date.now(), action: 'add' })
      this.$store.dispatch('browserProfiles/addRunning', parseInt(data.profileId, 10))
    },

    async browserProfileSyncStarted (data) {
      let exists = false
      for (const item of this.browserProfiles.syncErrors) {
        if (parseInt(item.id, 10) === parseInt(data.profileId, 10)) {
          exists = true
        }
      }
      if (exists) {
        await this.$store.dispatch('browserProfiles/removeSyncErrors', parseInt(data.profileId, 10))
      }

      // this.$store.dispatch('browserProfiles/addSync', data.profileId)
    },

    async browserProfileSyncFinished (data) {
      await this.$store.dispatch('browserProfiles/removeSync', parseInt(data.profileId, 10))
      await this.$store.dispatch('browserProfiles/addSyncSuccess', parseInt(data.profileId, 10))
    },

    async browserProfileSyncError (data) {
      await this.$store.dispatch('browserProfiles/removeSync', parseInt(data.profileId, 10))
      await this.$store.dispatch('browserProfiles/addSyncErrors', { id: parseInt(data.profileId, 10), error: data.error })
    },

    async teamProfileStarted (data) {
      const id = parseInt(data.profile_id, 10)
      const loadingProfileIndex = this.browserProfiles.loading.includes(id)
      const runningProfileIndex = this.browserProfiles.running.includes(id)

      if (!loadingProfileIndex && !runningProfileIndex) {
        await this.$store.dispatch('browserProfiles/addTeamProfileRunning', data)
      }
    },
    async teamProfileStopped (data) {
      await this.$store.dispatch('browserProfiles/removeTeamProfileRunning', parseInt(data.profile_id, 10))
    },

    async robotCookieStarted (data) {
      this.$store.dispatch('browserProfiles/addCookieRobotRunning', {
        profileId: parseInt(data.data.profileId, 10),
        percentage: 0,
        message: data.data.message,
        url: ''
      })
    },

    async robotCookieCompletelyFailed (data) {
      const id = parseInt(data.data.profileId, 10)
      this.$store.dispatch('browserProfiles/removeCookieRobotRunning', {
        profileId: id,
        percentage: parseInt(data.data.percentage, 10),
        message: data.data.message,
        url: data.data.url
      })
      this.$amplitude.getInstance().logEvent('Cookie Robot Failed', { profileId: parseInt(data.data.profileId, 10) })
      this.$store.dispatch('main/alert', { color: 'success', message: this.$t('browserProfiles.cookieRobotFailed') + ' ' + this.$t('browserProfiles.forProfile') + ' ' + data.data.name })
    },

    async robotCookieFinished (data) {
      const id = parseInt(data.data.profileId, 10)
      this.$store.dispatch('browserProfiles/removeCookieRobotRunning', {
        profileId: id,
        percentage: 100,
        message: data.data.message,
        url: ''
      })
      this.$amplitude.getInstance().logEvent('Cookie Robot Finished', { profileId: parseInt(data.data.profileId, 10) })
      this.$store.dispatch('main/alert', { color: 'success', message: this.$t('browserProfiles.cookieRobotFinished') + ' ' + this.$t('browserProfiles.forProfile') + ' ' + data.data.name })
    },

    async browserProfileCookieRobotOk (data) {
      await this.$store.dispatch('browserProfiles/addCookieRobotProgress', {
        profileId: parseInt(data.data.profileId, 10),
        percentage: parseInt(data.data.percentage, 10),
        message: data.data.message,
        url: data.data.url,
        count: data.data.total
      })
    },

    async browserProfileCookieRobotFailed (data) {
      await this.$store.dispatch('browserProfiles/addCookieRobotProgress', {
        profileId: parseInt(data.data.profileId, 10),
        percentage: data.data.percentage ? parseInt(data.data.percentage, 10) : 0,
        message: data.data.message,
        url: data.data.url,
        count: data.data.total
      })
    }
  },

  methods: {
    apiUnauthorize () {
      // ЗАПИСАТЬ ПОРТ АПИ, ЧТОБЫ ПОСЛЕ localstorage.clear() ПРИСОВОИТЬ ЗНАЧЕНИЕ ОБРАТНО
      let antyLocalApiPort = null
      if (localStorage.getItem('antyLocalApiPort')) {
        antyLocalApiPort = localStorage.getItem('antyLocalApiPort')
      }
      localStorage.clear()

      if (antyLocalApiPort) {
        localStorage.setItem('antyLocalApiPort', antyLocalApiPort)
      }

      this.api.defaults.headers.Authorization = ''
      this.localApi.defaults.headers.Authorization = ''

      this.profileAuthorized = false

      if (!['Login', 'Registration'].includes(this.$route.name)) {
        this.$router.push({ name: 'Login' })
      }

      this.$store.dispatch('browserProfiles/clearSelected')
      this.$store.dispatch('proxy/clearSelected')
      this.$store.dispatch('browserProfilesStatuses/clearSelected')
      this.$store.dispatch('userFields/clearSelected')

      this.$amplitude.getInstance().setUserId(null)
    },
    async apiErrorHandling (error) {
      // Unauthorized
      if (!error.response || !error.request) return

      if (error.response.status === 401) {
        this.apiUnauthorize()
      } else {
        await this.apiErrorBackendHandling(error)
      }
      return error
    },
    async apiErrorBackendHandling (error) {
      if (!error.response || !error.request) return
      // human message
      const data = {
        request: {
          url: error.request.responseURL,
          data: error.response.config.data
        },
        response: {
          status: error.response.status,
          data: error.response.data
        }
      }
      if (typeof error.response.data.error.code !== 'undefined') {
        await this.$store.dispatch('main/setError', { key: 'message', value: error.response.data.error.text })
        await this.$store.dispatch('main/setError', { key: 'type', value: 'new' })
        await this.$store.dispatch('main/setError', { key: 'code', value: error.response.data.error.code })
        await this.$store.dispatch('main/setError', { key: 'error', value: error.response.data.error })
      } else {
        await this.$store.dispatch('main/setError', { key: 'message', value: JSON.stringify(data) })
        await this.$store.dispatch('main/setError', { key: 'type', value: 'old' })
      }
      await this.$store.dispatch('main/openDialog', 'error')
    },

    async getAppVersion () {
      try {
        const response = await this.localApi.get('/get-app-version')
        const { status, data } = response
        if (status === 200 && data.success) {
          this.$store.dispatch('main/setAppVersion', data.appVersion)
        }
      } catch (_) {
        // Do nothing
      }
    },

    setInnerHeight (data) {
      this.$store.dispatch('main/setInnerHeight', data.target.innerHeight)
    },

    async initAmplitude () {
      let token = 'e8c66f87bfc4828dd7029beb9afda19b'
      let appVersion = '1'

      try {
        const response = await this.localApi.get('/get-app-version')
        const { status, data } = response
        if (status === 200 && data.success) {
          appVersion = data.appVersion
        }
      } catch (_) {
        // Do nothing
      }

      if (appVersion.indexOf('beta') === -1 && appVersion.includes('.')) {
        token = 'cc69d5080af9e4710e5b0d1d268ca067'
      }

      amplitude.getInstance().init(token)
      Object.defineProperty(Vue.prototype, '$amplitude', { value: amplitude })
    }
  }
}
</script>
