import i18n from '@/i18n'
import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    browserProfile: {},
    browserProfileTouched: false,
    loading: {
      mainDialog: false
    }
  },

  getters: {
    getField,
    browserProfile: state => state.browserProfile,
    loading: state => state.loading,
    browserProfileTouched: state => state.browserProfileTouched
  },

  mutations: {
    updateField,

    TOUCH_MULTIPLE_IMPORT: (state, payload) => {
      state.browserProfileTouched = payload
    },

    SET_EMPTY_BROWSER_PROFILE: (state, payload) => {
      state.browserProfile = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    PUSH_TO_NEW_SAVED_PROXIES: (state, payload) => {
      state.browserProfile.newSavedProxies.push(payload)
      state.browserProfile.needToSetProxyId = true
    }
  },

  actions: {
    async setLoading (context, payload) {
      context.commit('SET_LOADING', payload)
    },

    async touchMultipleImport (context, value) {
      context.commit('TOUCH_MULTIPLE_IMPORT', value)
    },

    async setEmptyBrowserProfile (context, browserProfile) {
      context.commit('SET_EMPTY_BROWSER_PROFILE', browserProfile)
    },

    async addBrowserProfiles (context, browserProfiles) {
      const globalData = context.state.browserProfile
      const data = {
        browserType: globalData.browserType,
        tags: globalData.tags,
        statusId: globalData.status ? globalData.status.id : 0,
        platform: globalData.platform,
        mainWebsite: globalData.mainWebsite === 'none' ? '' : globalData.mainWebsite,
        webrtc: {
          mode: globalData.webrtc.mode,
          ipAddress: globalData.webrtc.ipAddress
        },
        canvas: {
          mode: globalData.canvas.mode
        },
        webgl: {
          mode: globalData.webgl.mode
        },
        webglInfo: {
          mode: globalData.webglInfo.mode,
          vendor: globalData.webglInfo.vendor,
          renderer: globalData.webglInfo.renderer
        },
        clientRect: {
          mode: globalData.clientRect.mode
        },
        timezone: {
          mode: globalData.timezone.mode,
          value: globalData.timezone.value
        },
        locale: {
          mode: globalData.locale.mode,
          value: globalData.locale.value
        },
        geolocation: {
          // mode: globalData.geolocation.mode,
          latitude: globalData.geolocation.latitude,
          longitude: globalData.geolocation.longitude,
          marker: {
            lng: '',
            ltd: ''
          }
        },
        cpu: {
          mode: globalData.cpu.mode,
          value: globalData.cpu.value
        },
        memory: {
          mode: globalData.memory.mode,
          value: globalData.memory.value
        },
        screen: {
          mode: globalData.screen.mode,
          resolution: globalData.screen.resolution
        },
        mediaDevices: {
          mode: globalData.mediaDevices.mode,
          audioInputs: globalData.mediaDevices.audioInputs,
          videoInputs: globalData.mediaDevices.videoInputs,
          audioOutputs: globalData.mediaDevices.audioOutputs
        },
        ports: {
          mode: globalData.ports.mode,
          blacklist: globalData.ports.blacklist
        },
        doNotTrack: globalData.doNotTrack
      }

      if (globalData.useragent.mode !== 'fromFile') {
        data.useragent = {
          mode: globalData.useragent.mode,
          value: globalData.useragent.value
        }
      }

      if (globalData.proxyMode === 1) {
        data.proxy = globalData.proxyNew

        if (data.proxy.name === '') {
          if (globalData.proxyInput.includes('://')) {
            data.proxy.name = globalData.proxyInput
          } else {
            data.proxy.name = globalData.proxyNew.type + '://' + globalData.proxyInput
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

      const response = await this._vm.api.post('/browser_profiles/mass', {
        common: data,
        items: browserProfiles
      })

      if (response.status === 200 && response.data && Array.isArray(response.data.ids)) {
        context.dispatch('main/alert', {
          color: 'success',
          message: `${i18n.tc('browserProfiles.multipleImport.imported', response.data.ids.length)} ${response.data.ids.length} ${i18n.tc('browserProfiles.multipleImport.profiles', response.data.ids.length)}`
        }, { root: true })

        const subscription = context.rootState.main.subscription
        const eventProperties = {
          site: globalData.mainWebsite === 'none' ? '' : globalData.mainWebsite,
          os: globalData.platform,
          proxy: parseInt(globalData.proxyMode, 10) === 3
            ? 'from file' : parseInt(globalData.proxyMode, 10) === 2
              ? 'saved proxies' : parseInt(globalData.proxyMode, 10) === 1
                ? 'new proxy' : 'no proxy',
          useragent: globalData.useragent.mode,
          webrtc: globalData.webrtc.mode,
          canvas: globalData.canvas.mode,
          webgl: globalData.webgl.mode,
          timezone: globalData.timezone.mode,
          language: globalData.locale.mode,
          'copy profile': false,
          'mass import': true,
          'browser type': globalData.browserType,
          'team profiles count': subscription && subscription.browserProfiles && subscription.browserProfiles.count ? subscription.browserProfiles.count : 'not found'
        }

        context.dispatch('sendAmplitude', {
          event: 'Profile Create',
          eventProperties: eventProperties,
          ids: response.data.ids
        })
      }
    },

    async addBrowserProfile (context, browserProfile) {
      const globalData = context.state.browserProfile
      const data = {
        name: browserProfile.name,
        notes: browserProfile.notes,
        useragent: browserProfile.useragent,
        proxy: browserProfile.proxy,
        browserType: globalData.browserType,
        tags: globalData.tags,
        statusId: globalData.status ? globalData.status.id : 0,
        platform: globalData.platform,
        mainWebsite: globalData.mainWebsite === 'none' ? '' : globalData.mainWebsite,
        webrtc: {
          mode: globalData.webrtc.mode,
          ipAddress: globalData.webrtc.ipAddress
        },
        canvas: {
          mode: globalData.canvas.mode
        },
        webgl: {
          mode: globalData.webgl.mode
        },
        webglInfo: {
          mode: globalData.webglInfo.mode,
          vendor: globalData.webglInfo.vendor,
          renderer: globalData.webglInfo.renderer
        },
        clientRect: {
          mode: globalData.clientRect.mode
        },
        timezone: {
          mode: globalData.timezone.mode,
          value: globalData.timezone.value
        },
        locale: {
          mode: globalData.locale.mode,
          value: globalData.locale.value
        },
        geolocation: {
          // mode: globalData.geolocation.mode,
          latitude: globalData.geolocation.latitude,
          longitude: globalData.geolocation.longitude,
          marker: {
            lng: '',
            ltd: ''
          }
        },
        cpu: {
          mode: globalData.cpu.mode,
          value: globalData.cpu.value
        },
        memory: {
          mode: globalData.memory.mode,
          value: globalData.memory.value
        },
        screen: {
          mode: globalData.screen.mode,
          resolution: globalData.screen.resolution
        },
        mediaDevices: {
          mode: globalData.mediaDevices.mode,
          audioInputs: globalData.mediaDevices.audioInputs,
          videoInputs: globalData.mediaDevices.videoInputs,
          audioOutputs: globalData.mediaDevices.audioOutputs
        },
        ports: {
          mode: globalData.ports.mode,
          blacklist: globalData.ports.blacklist
        },
        doNotTrack: globalData.doNotTrack,
        appCodeName: '',
        platformName: '',
        connectionDownlink: 0,
        connectionEffectiveType: '',
        connectionRtt: 0,
        connectionSaveData: 0,
        cpuArchitecture: '',
        osVersion: '',
        vendorSub: '',
        productSub: '',
        vendor: '',
        product: '',
        platformVersion: globalData.platformVersion
      }

      if (globalData.useragent.mode !== 'fromFile') {
        if (globalData.useragent.mode === 'random') {
          data.useragent = {
            mode: 'manual',
            value: browserProfile.randomUseragent
          }
        } else {
          data.useragent = {
            mode: globalData.useragent.mode,
            value: globalData.useragent.value
          }
        }
      }

      if (globalData.webglInfo.mode === 'random') {
        data.webglInfo = {
          mode: 'manual',
          vendor: browserProfile.randomWebglInfoVendor,
          renderer: browserProfile.randomWebglInfoRenderer
        }
      }

      if (globalData.cpu.mode === 'random') {
        data.cpu = {
          mode: 'manual',
          value: browserProfile.randomCpu
        }
      }

      if (globalData.memory.mode === 'random') {
        data.memory = {
          mode: 'manual',
          value: browserProfile.randomMemory
        }
      }

      if (globalData.screen.mode === 'random') {
        data.screen = {
          mode: 'manual',
          resolution: browserProfile.randomResolution
        }
      }

      if (globalData.mediaDevices.mode === 'random') {
        data.mediaDevices = {
          mode: 'manual',
          audioInputs: browserProfile.randomAudioInputs,
          videoInputs: browserProfile.randomVideoInputs,
          audioOutputs: browserProfile.randomAudioOutputs
        }
      }

      if (globalData.proxyMode === 1) {
        data.proxy = this._vm.$_.cloneDeep(globalData.proxyNew)

        if (data.proxy.name === '') {
          if (globalData.proxyInput.includes('://')) {
            data.proxy.name = globalData.proxyInput
          } else {
            data.proxy.name = globalData.proxyNew.type + '://' + globalData.proxyInput
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

        if (!this._vm.$_.isEmpty(globalData.newSavedProxies)) {
          try {
            for (const savedProxy of globalData.newSavedProxies) {
              if (
                savedProxy.host === data.proxy?.host &&
                  savedProxy.port === data.proxy?.port &&
                  savedProxy.type === data.proxy?.type &&
                  savedProxy.login === data.proxy?.login &&
                  savedProxy.password === data.proxy?.password &&
                  savedProxy.changeIpUrl === data.proxy?.changeIpUrl
              ) {
                data.proxy = {
                  id: savedProxy.id
                }
              }
            }

            if (data.proxy.id === undefined) {
              context.dispatch('pushToNewSavedProxies', this._vm.$_.cloneDeep(data.proxy))
            }
          } catch (_) { /* */ }
        } else {
          context.dispatch('pushToNewSavedProxies', this._vm.$_.cloneDeep(data.proxy))
        }
      }

      const response = await this._vm.api.post('/browser_profiles', data)
      if (response.status === 200 && response.data && response.data.browserProfileId) {
        if (browserProfile.cookies) {
          context.dispatch('sendCookies', {
            id: response.data.browserProfileId,
            cookies: browserProfile.cookies
          })
        }

        const subscription = context.rootState.main.subscription
        const eventProperties = {
          site: globalData.mainWebsite === 'none' ? '' : globalData.mainWebsite,
          os: globalData.platform,
          proxy: parseInt(globalData.proxyMode, 10) === 3
            ? 'from file' : parseInt(globalData.proxyMode, 10) === 2
              ? 'saved proxies' : parseInt(globalData.proxyMode, 10) === 1
                ? 'new proxy' : 'no proxy',
          useragent: globalData.useragent.mode,
          webrtc: globalData.webrtc.mode,
          canvas: globalData.canvas.mode,
          webgl: globalData.webgl.mode,
          timezone: globalData.timezone.mode,
          language: globalData.locale.mode,
          'copy profile': false,
          'mass import': true,
          'browser type': globalData.browserType,
          'team profiles count': subscription && subscription.browserProfiles && subscription.browserProfiles.count ? subscription.browserProfiles.count : 'not found'
        }
        context.dispatch('sendAmplitude', {
          event: 'Profile Create',
          eventProperties: eventProperties
        })
      }
      return response.data && response.data.browserProfileId ? response.data.browserProfileId : null
    },

    async pushToNewSavedProxies ({ commit }, payload) {
      await commit('PUSH_TO_NEW_SAVED_PROXIES', payload)
    },

    async sendAmplitude (context, payload) {
      await this._vm.$amplitude.getInstance().logEvent(payload.event, payload.eventProperties)
    },

    async sendCookies (context, payload) {
      await this._vm.syncApi.post(`?actionType=importCookies&browserProfileId=${payload.id}`, {
        cookies: payload.cookies
      })
    }
  }
}
