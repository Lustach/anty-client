import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'
import i18n from '@/i18n'

export default {
  namespaced: true,
  state: {
    initialDolphinTokenState: '',
    settings: {
      user: {
        dolphinIntegration: {
          token: ''
        },
        homepages: {
          all: '',
          facebook: '',
          google: '',
          tiktok: '',
          crypto: ''
        }
      }
    },
    dialogs: {}
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    settings: state => state.settings,
    dialogs: state => state.dialogs
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_SETTINGS: (state, payload) => {
      const settings = {
        user: {
          dolphinIntegration: {
            token: payload.user && payload.user.dolphinIntegration && payload.user.dolphinIntegration.token ? payload.user.dolphinIntegration.token : ''
          },
          homepages: {
            all: '',
            facebook: '',
            google: '',
            tiktok: '',
            crypto: ''
          }
        }
      }

      if (payload.user && payload.user.homepages) {
        if (payload.user.homepages.all) {
          // settings.user.homepages.all = payload.user.homepages.all.join('\n')
          // settings.user.homepages.all = JSON.parse(payload.user.homepages.all)
          settings.user.homepages.all = payload.user.homepages.all
        }
        if (payload.user.homepages.facebook) {
          // settings.user.homepages.facebook = payload.user.homepages.facebook.join('\n')
          // settings.user.homepages.facebook = JSON.parse(payload.user.homepages.facebook)
          settings.user.homepages.facebook = payload.user.homepages.facebook
        }
        if (payload.user.homepages.google) {
          // settings.user.homepages.google = payload.user.homepages.google.join('\n')
          // settings.user.homepages.google = JSON.parse(payload.user.homepages.google)
          settings.user.homepages.google = payload.user.homepages.google
        }
        if (payload.user.homepages.tiktok) {
          // settings.user.homepages.tiktok = payload.user.homepages.tiktok.join('\n')
          // settings.user.homepages.tiktok = JSON.parse(payload.user.homepages.tiktok)
          settings.user.homepages.tiktok = payload.user.homepages.tiktok
        }
        if (payload.user.homepages.crypto) {
          // settings.user.homepages.vk = payload.user.homepages.vk.join('\n')
          // settings.user.homepages.vk = JSON.parse(payload.user.homepages.vk)
          settings.user.homepages.crypto = payload.user.homepages.crypto
        }
      }

      state.settings = settings
      state.initialDolphinTokenState = settings.user.dolphinIntegration.token
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadSettings (context) {
      const response = await this._vm.api.get('/settings')
      if (response && response.status === 200 && response.data && response.data.data) {
        await context.commit('SET_SETTINGS', response.data.data)
        this._vm.localApi.post('/settings', context.state.settings)
      }
    },

    async saveSettings (context) {
      // AMPLITUDE СОБЫТИЕ - изменение заметки
      try {
        let identify

        if (!context.state.initialDolphinTokenState && context.state.settings.user.dolphinIntegration.token) {
          identify = new this._vm.$amplitude.Identify().set('dolphin token', true)
          await this._vm.$amplitude.getInstance().identify(identify)
          this._vm.$amplitude.getInstance().logEvent('Dolphin Token Add')
        } else {
          identify = new this._vm.$amplitude.Identify().set('dolphin token', false)
          await this._vm.$amplitude.getInstance().identify(identify)
          this._vm.$amplitude.getInstance().logEvent('Dolphin Token Delete')
        }
      } catch (_) {
        // Do nothing
      }

      const response = await this._vm.api.patch('/settings', context.state.settings)
      if (response.status === 200) {
        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.saved')
        }, { root: true })
      }
    }
  }
}
