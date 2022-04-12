import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'
import { getField, updateField } from 'vuex-map-fields'
import moment from 'moment'

export default {
  namespaced: true,
  state: {
    appVersion: null,
    profile: {},
    profileAuthorized: false,
    dialogs: {
      alert: false,
      help: false,
      warning: false,
      error: false,
      feedback: false,
      logoutConfirmation: false,
      editProfile: false
    },
    alert: {
      color: '',
      message: ''
    },
    help: {
      title: '',
      body: ''
    },
    warning: {
      createProfile: false,
      doNotShowWarning: false,
      title: '',
      body: ''
    },
    error: {},
    innerHeight: 0,
    browserDownloading: {
      show: false,
      stage: null,
      percentage: 0,
      showProgress: true
    },
    subscription: {},
    disableUi: false
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    profile: state => state.profile,
    profileAuthorized: state => state.profileAuthorized,
    alert: state => state.alert,
    help: state => state.help,
    warning: state => state.warning,
    error: state => state.error,
    innerHeight: state => state.innerHeight,
    appVersion: state => state.appVersion,
    browserDownloading: state => state.browserDownloading,
    subscription: state => state.subscription,
    disableUi: state => state.disableUi
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_APP_VERSION: (state, payload) => {
      state.appVersion = payload
    },

    LOAD_PROFILE: (state, payload) => {
      state.profile = payload
      if (!state.profile.columns || (Array.isArray(state.profile.columns) && state.profile.columns.length === 0)) {
        state.profile.columns = ['notes', 'tags', 'proxy']
      }
    },

    SET_ALERT: (state, alert) => {
      state.alert = alert
    },

    OPEN_ALERT: (state) => {
      state.dialogs.alert = true
    },

    CLOSE_ALERT: (state) => {
      state.dialogs.alert = false
    },

    SET_HELP: (state, payload) => {
      state.help.title = payload.title
      state.help.body = payload.body
    },

    SET_WARNING: (state, payload) => {
      state.warning = payload
    },

    SET_ERROR: (state, payload) => {
      if (typeof payload !== 'object') {
        state.error[payload.key] = payload.value.replace(/\\/g, '')
      } else {
        state.error[payload.key] = payload.value
      }
    },

    SET_INNER_HEIGHT: (state, height) => {
      state.innerHeight = height
    },

    SET_SUBSCRIPTION: (state, payload) => {
      state.subscription = payload
    },

    SET_DISABLE_UI: (state, payload) => {
      state.disableUi = payload
    },

    SET_PINNED_BROWSER_PROFILES_COUNT: (state, payload) => {
      state.profile.pinnedBrowserProfilesCount = payload
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadProfile (context) {
      const response = await this._vm.api.get('/profile')
      if (response.status === 200 && response.data) {
        context.commit('LOAD_PROFILE', response.data.data)

        if (!this._vm.$amplitude.getInstance().options.userId) {
          this._vm.$amplitude.getInstance().setUserId(response.data.data.username)
        }
      }
    },

    async alert (context, alert) {
      context.commit('CLOSE_ALERT')
      context.commit('SET_ALERT', alert)
      context.commit('OPEN_ALERT')
      setTimeout(() => {
        context.commit('CLOSE_ALERT')
      }, 5000)
    },

    async closeAlert (context) {
      context.commit('CLOSE_ALERT')
    },

    async setHelp (context, help) {
      context.commit('SET_HELP', help)
    },

    async setWarning (context, warning) {
      context.commit('SET_WARNING', warning)
    },

    async setError (context, error) {
      context.commit('SET_ERROR', error)
    },

    async setInnerHeight (context, height) {
      context.commit('SET_INNER_HEIGHT', height)
    },

    async setAppVersion ({ commit }, payload) {
      commit('SET_APP_VERSION', payload)
    },

    async getSubscription (context) {
      const response = await this._vm.api.get('/subscription')
      if (response && response.status === 200 && response.data && response.data.data) {
        context.commit('SET_SUBSCRIPTION', response.data.data)

        let expired = moment.utc(response.data.data.expiration).unix() < (Math.floor(Date.now() / 1000))
        const browserProfilesLimitExceeded = response.data.data.browserProfiles.count > response.data.data.browserProfiles.limit
        const usersLimitExceeded = response.data.data.users.count > response.data.data.users.limit

        // не учитываем дату экспирации на фри плане
        if (response.data.data.plan.toLowerCase() === 'free' && parseInt(response.data.data.browserProfiles.limit, 10) === 10) {
          expired = false
        }

        context.commit('SET_DISABLE_UI', expired || browserProfilesLimitExceeded || usersLimitExceeded)
      }
    },

    async setPinnedBrowserProfilesCount ({ commit }, payload) {
      commit('SET_PINNED_BROWSER_PROFILES_COUNT', payload)
    }
  }
}
