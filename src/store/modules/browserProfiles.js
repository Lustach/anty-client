import i18n from '@/i18n'
import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'
import { getField, updateField } from 'vuex-map-fields'
export default {
  namespaced: true,
  state: {
    browserProfiles: {
      all: [],
      selected: [],
      running: [],
      cookieRobotsWorking: [],
      loading: [],
      sync: [],
      syncErrors: [],
      mainButtonErrors: [],
      syncSuccess: [],
      cancelTokens: {},
      total: 0,
      teamProfileRunning: []
    },
    basket: {
      profiles: [],
      selected: [],
      total: 0,

      all: [],
      running: [],
      loading: [],
      sync: [],
      syncErrors: [],
      mainButtonErrors: [],
      syncSuccess: [],
      cancelTokens: {},
      teamProfileRunning: []

    },
    pagination: {},
    paginationBasket: {},
    browserProfile: {},
    fullBrowserProfile: {},
    dialogs: {
      automation: false,
      automationOnboarding: false,
      add: false,
      delete: false,
      basket: false,
      tags: false,
      changeProxy: false,
      start: false,
      stop: false,
      mainDialog: false,
      syncErrors: false,
      columns: false,
      notesEdit: false,
      activityLog: false,
      importCookies: false,
      enterCookieRobot: false,
      chromeNotFound: false,
      share: false,
      shareInfo: false,
      copyProfile: false,
      changeProxyFromCell: false,
      screenWarning: false,
      parallelStartWarning: false,
      extensionSync: false,
      transfer: false
    },
    filters: {
      name: '',
      tags: [],
      statuses: [],
      mainWebsites: [],
      users: [],
      sortBy: [],
      order: [],
      proxies: []
    },
    browserProfileSyncError: '',
    sortedTags: [],
    columns: {
      all: [],
      filtered: [],
      selected: []
    },
    timers: {},
    chromeExists: true,
    forTagsDialog: {
      singleBrowserProfile: false,
      browserProfile: {
        id: 0,
        tags: []
      }
    },
    screenResolutions: {
      linux: [],
      windows: [],
      macos: []
    },
    forDialogs: {
      singleDelete: false,
      browserProfileId: null,
      browserProfileName: null,
      multiple: false
    }
  },
  getters: {
    ...mixinDialogGetters,
    getField,
    basket: state => state.basket,
    browserProfiles: state => state.browserProfiles,
    browserProfile: state => state.browserProfile,
    fullBrowserProfile: state => state.fullBrowserProfile,
    browserProfileSyncError: state => state.browserProfileSyncError,
    sortedTags: state => state.sortedTags,
    filters: state => state.filters,
    columns: state => state.columns,
    timers: state => state.timers,
    chromeExists: state => state.chromeExists,
    forTagsDialog: state => state.forTagsDialog,
    screenResolutions: state => state.screenResolutions,
    forDialogs: state => state.forDialogs,
    pagination: state => state.pagination,
    paginationBasket: state => state.paginationBasket
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.browserProfiles.all = payload
    },
    SET_ALL_BASKET: (state, payload) => {
      state.basket.all = payload
    },

    ADD_TEAM_PROFILE_RUNNING: (state, payload) => {
      if (Array.isArray(payload)) {
        for (const browserProfile of payload) {
          if (parseInt(browserProfile.running, 10) === 1) {
            const teamRunningProfileIndex = state.browserProfiles.teamProfileRunning.findIndex(i => i.id === parseInt(browserProfile.id, 10))

            if (teamRunningProfileIndex === -1) {
              state.browserProfiles.teamProfileRunning.push({
                id: parseInt(browserProfile.id, 10),
                userId: parseInt(browserProfile.lastRunnedByUserId, 10)
              })
            }
          }
        }
      } else {
        const teamRunningProfileIndex = state.browserProfiles.teamProfileRunning.findIndex(i => i.id === parseInt(payload.profile_id, 10))

        if (teamRunningProfileIndex === -1) {
          state.browserProfiles.teamProfileRunning.push({
            id: parseInt(payload.profile_id, 10),
            userId: parseInt(payload.runned_by, 10)
          })
        }
      }
    },

    REMOVE_TEAM_PROFILE_RUNNING: (state, id) => {
      state.browserProfiles.teamProfileRunning = state.browserProfiles.teamProfileRunning.filter(i => i.id !== id)
    },

    SET_TOTAL: (state, payload) => {
      state.browserProfiles.total = payload
    },
    SET_TOTAL_BASKET: (state, payload) => {
      state.basket.total = payload
    },

    SET_SELECTED: (state, payload) => {
      state.browserProfiles.selected = payload
    },
    SET_SELECTED_BASKET: (state, payload) => {
      state.basket.selected = payload
    },

    REPLACE_SELECTED: (state, payload) => {
      payload.forEach(item => {
        const selectedBrowserProfileIndex = state.browserProfiles.selected.findIndex(selected => parseInt(selected.id, 10) === parseInt(item.id, 10))
        if (selectedBrowserProfileIndex > -1) {
          state.browserProfiles.selected.splice(selectedBrowserProfileIndex, 1, item)
        }
      })
    },
    REPLACE_SELECTED_BASKET: (state, payload) => {
      payload.forEach(item => {
        const selectedBrowserProfileIndex = state.basket.selected.findIndex(selected => parseInt(selected.id, 10) === parseInt(item.id, 10))
        if (selectedBrowserProfileIndex > -1) {
          state.basket.selected.splice(selectedBrowserProfileIndex, 1, item)
        }
      })
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },
    SET_PAGINATION_BASKET: (state, payload) => {
      state.paginationBasket = payload
    },

    SET_EMPTY_BROWSER_PROFILE: (state, payload) => {
      state.browserProfile = payload
    },

    SET_BROWSER_PROFILE: (state, payload) => {
      state.browserProfile = payload
    },

    SET_FILTER: (state, payload) => {
      state.filters[payload.filter] = payload.data
    },

    ADD_RUNNING: (state, payload) => {
      if (!state.browserProfiles.running.includes(payload)) {
        state.browserProfiles.running.push(payload)
      }
    },

    REMOVE_RUNNING: (state, payload) => {
      state.browserProfiles.running = state.browserProfiles.running.filter(item => item !== payload)
      state.browserProfiles.cookieRobotsWorking = state.browserProfiles.cookieRobotsWorking.filter(item => item !== payload)
      const idx = state.browserProfiles.cookieRobotsWorking.findIndex(item => item.profileId === payload)
      if (idx !== -1) {
        state.browserProfiles.cookieRobotsWorking.splice(idx, 1)
      }
    },

    ADD_COOKIE_ROBOT_RUNNING: (state, payload) => {
      const cookieRobotsWorking = state.browserProfiles.cookieRobotsWorking.find(item => item.profileId === payload.profileId)
      if (cookieRobotsWorking === undefined) {
        state.browserProfiles.cookieRobotsWorking.push(payload)
      }
    },

    ADD_COOKIE_ROBOT_PROGRESS: (state, payload) => {
      const cookieRobotsWorking = state.browserProfiles.cookieRobotsWorking.find(item => item.profileId === payload.profileId)
      if (cookieRobotsWorking !== undefined) {
        cookieRobotsWorking.percentage = payload.percentage
        cookieRobotsWorking.message = payload.message
        cookieRobotsWorking.url = payload.url
      }
    },

    REMOVE_COOKIE_ROBOT_RUNNING: (state, payload) => {
      state.browserProfiles.cookieRobotsWorking = state.browserProfiles.cookieRobotsWorking.filter(item => item !== payload.profileId)
      const idx = state.browserProfiles.cookieRobotsWorking.findIndex(item => item.profileId === payload.profileId)
      if (idx !== -1) {
        state.browserProfiles.cookieRobotsWorking.splice(idx, 1)
      }
    },

    ADD_LOADING: (state, payload) => {
      if (!state.browserProfiles.loading.includes(payload)) {
        state.browserProfiles.loading.push(payload)
      }
    },

    REMOVE_LOADING: (state, payload) => {
      state.browserProfiles.loading = state.browserProfiles.loading.filter(item => item !== payload)
    },

    ADD_SYNC: (state, payload) => {
      if (!state.browserProfiles.sync.includes(payload)) {
        state.browserProfiles.sync.push(payload)
      }
    },

    REMOVE_SYNC: (state, payload) => {
      state.browserProfiles.sync = state.browserProfiles.sync.filter(item => item !== payload)
    },

    ADD_SYNC_ERRORS: (state, payload) => {
      let notExists = true
      for (const item of state.browserProfiles.syncErrors) {
        if (item.id === payload.id) {
          notExists = false
        }
      }
      if (notExists) {
        state.browserProfiles.syncErrors.push(payload)
      }
    },

    REMOVE_SYNC_ERRORS: (state, payload) => {
      state.browserProfiles.syncErrors = state.browserProfiles.syncErrors.filter(item => item.id !== payload)
    },

    ADD_MAIN_BUTTON_ERROR: (state, payload) => {
      let notExists = true
      for (const item of state.browserProfiles.mainButtonErrors) {
        if (item.id === payload.id) {
          notExists = false
        }
      }
      if (notExists) {
        state.browserProfiles.mainButtonErrors.push(payload)
      }
    },

    REMOVE_MAIN_BUTTON_ERROR: (state, payload) => {
      state.browserProfiles.mainButtonErrors = state.browserProfiles.mainButtonErrors.filter(item => item.id !== payload)
    },

    ADD_SYNC_SUCCESS: (state, payload) => {
      if (!state.browserProfiles.syncSuccess.includes(payload)) {
        state.browserProfiles.syncSuccess.push(payload)

        setTimeout(() => {
          state.browserProfiles.syncSuccess = state.browserProfiles.syncSuccess.filter(item => item !== payload)
        }, 5000)
      }
    },

    CLEAR_USERAGENT: (state) => {
      state.browserProfile.useragent.value = null
    },

    SET_BROWSER_PROFILE_PROPERTY: (state, payload) => {
      state.browserProfile[payload.property] = payload.value
    },

    SET_BROWSER_PROFILE_SYNC_ERROR: (state, payload) => {
      state.browserProfileSyncError = payload
    },

    SET_SORTED_TAGS: (state, payload) => {
      state.sortedTags = payload
    },

    SET_USER_FIELDS_FOR_MAIN_DIALOG: (state, payload) => {
      state.browserProfile.userFieldsForMainDialog = payload
    },

    SET_COLUMNS: (state, payload) => {
      state.columns[payload.key] = payload.value
    },

    REPLACE_BROWSER_PROFILE: (state, payload) => {
      const allBrowserProfileIndex = state.browserProfiles.all.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (allBrowserProfileIndex > -1) {
        state.browserProfiles.all.splice(allBrowserProfileIndex, 1, payload)
      }

      const selectedBrowserProfileIndex = state.browserProfiles.selected.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (selectedBrowserProfileIndex > -1) {
        state.browserProfiles.selected.splice(selectedBrowserProfileIndex, 1, payload)
      }
    },

    SET_BROWSER_PROFILE_TIMER: (state, payload) => {
      if (payload.action === 'add') {
        state.timers = { ...state.timers, [payload.id]: payload.date }
      }
      if (payload.action === 'remove') {
        delete state.timers[payload.id]
      }
    },

    SET_SCREEN_RESOLUTIONS: (state, payload) => {
      if (!Array.isArray(payload.data) || payload.data.length === 0) return

      for (const screen of payload.data) {
        if (!state.screenResolutions[payload.platform].includes(screen)) {
          state.screenResolutions[payload.platform].push(screen)
        }
      }
    },

    SET_CANCEL_TOKEN: (state, payload) => {
      if (payload.remove && typeof state.browserProfiles.cancelTokens[payload.id] !== 'undefined') {
        delete state.browserProfiles.cancelTokens[payload.id]
      } else {
        state.browserProfiles.cancelTokens[payload.id] = payload.token
      }
    },

    REMOVE_BROWSER_PROFILES: (state, payload) => {
      state.browserProfiles.all = state.browserProfiles.all.filter(item => !payload.includes(parseInt(item.id, 10)))
    },

    SET_TOTAL_SESSION_DURATION: (state, payload) => {
      for (const browserProfile of state.browserProfiles.all) {
        if (parseInt(browserProfile.id, 10) === parseInt(payload.id, 10)) {
          browserProfile.totalSessionDuration = payload.totalSessionDuration
        }
      }

      for (const browserProfile of state.browserProfiles.selected) {
        if (parseInt(browserProfile.id, 10) === parseInt(payload.id, 10)) {
          browserProfile.totalSessionDuration = payload.totalSessionDuration
        }
      }
    },

    SET_FULL_BROWSER_PROFILE: (state, payload) => {
      state.fullBrowserProfile = payload
    },

    LOAD_BASKET: (state, payload) => {
      state.basket.profiles = payload
      if (!state.basket.profiles.columns || (Array.isArray(state.basket.profiles.columns) && state.basket.profiles.columns.length === 0)) {
        state.basket.profiles.columns = ['notes', 'tags', 'proxy']
      }
    }
  },
  actions: {
    ...mixinDialogActions,
    async loadBasket (context, payload = null) {
      await context.commit('ADD_LOADING', 'mainBasket')
      context.commit('SET_SELECTED_BASKET', [])

      try {
        let request = '/browser_profiles/basket?'
        if (payload && payload.page) {
          request += `page=${payload.page}&`
        }
        if (payload && payload.itemsPerPage) {
          request += `limit=${payload.itemsPerPage}&`
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        const response = await this._vm.api.get(request)
        if (response.status === 200 && response.data) {
          const data = {
            response: response.data,
            query: payload && payload.query ? payload.query : null,
            tags: payload && payload.tags ? payload.tags : null,
            mainWebsites: payload && payload.mainWebsites ? payload.mainWebsites : null,
            proxies: payload && payload.proxies ? payload.proxies : null,
            statuses: payload && payload.statuses ? payload.statuses : null,
            users: payload && payload.users ? payload.users : null
          }

          context.dispatch('setPaginationBasket', data)
          context.commit('LOAD_BASKET', response.data.data)
          context.commit('SET_TOTAL_BASKET', response.data.total)
          if (context.state.basket.selected.length > 0) {
            context.commit('REPLACE_SELECTED_BASKET', response.data.data)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('REMOVE_LOADING', 'mainBasket')
      }
    },
    async restoreProfiles (context, payload) {
      context.commit('SET_SELECTED_BASKET', [])
      try {
        const response = await this._vm.api.patch('browser_profiles/basket/restore',
          payload)
        if (response.status === 200 && response.data) {
          context.dispatch('loadTags')
          context.dispatch('main/alert', {
            color: 'success',
            message: i18n.t('common.restored')
          }, {
            root: true
          })
          context.dispatch('loadBasket')
        }
      } catch (e) {
        console.error(e)
      }
    },
    async loadBrowserProfiles (context, payload = null) {
      await context.commit('ADD_LOADING', 'mainTable')

      try {
        let request = '/browser_profiles?'

        if (payload && payload.page) {
          request += `page=${payload.page}&`
        }
        if (payload && payload.itemsPerPage) {
          request += `limit=${payload.itemsPerPage}&`
        }
        if (payload && payload.query) {
          request += `query=${encodeURIComponent(payload.query)}&`
        }
        if (payload && payload.tags) {
          payload.tags.forEach(tag => {
            request += `tags[]=${encodeURIComponent(tag)}&`
          })
        }
        if (payload && payload.mainWebsites) {
          payload.mainWebsites.forEach(mainWebsite => {
            request += `mainWebsites[]=${mainWebsite}&`
          })
        }
        if (payload && payload.proxies) {
          payload.proxies.forEach(proxy => {
            request += `proxies[]=${proxy}&`
          })
        }
        if (payload && payload.statuses) {
          payload.statuses.forEach(status => {
            request += `statuses[]=${encodeURIComponent(status)}&`
          })
        }
        if (payload && payload.sortBy) {
          request += `sortBy=${payload.sortBy}&`
        }
        if (payload && payload.order) {
          request += `order=${payload.order}&`
        }
        if (payload && payload.users) {
          payload.users.forEach(userId => {
            request += `users[]=${userId}&`
          })
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (payload === null || request.endsWith('?')) {
          request += 'page=1&limit=50'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: payload && payload.query ? payload.query : null,
            tags: payload && payload.tags ? payload.tags : null,
            mainWebsites: payload && payload.mainWebsites ? payload.mainWebsites : null,
            proxies: payload && payload.proxies ? payload.proxies : null,
            statuses: payload && payload.statuses ? payload.statuses : null,
            users: payload && payload.users ? payload.users : null
          }

          context.dispatch('setPagination', data)
          context.commit('SET_ALL', response.data.data)
          context.commit('ADD_TEAM_PROFILE_RUNNING', response.data.data)
          context.commit('SET_TOTAL', response.data.total)
          if (context.state.browserProfiles.selected.length > 0) {
            context.commit('REPLACE_SELECTED', response.data.data)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('REMOVE_LOADING', 'mainTable')
      }
    },

    async loadCurrentPage (context) {
      await context.commit('ADD_LOADING', 'mainTable')

      try {
        let request = '/browser_profiles?'

        if (context.state.pagination.currentPage) {
          request += `page=${context.state.pagination.currentPage}&`
        }
        if (context.state.pagination.itemsPerPage) {
          request += `limit=${context.state.pagination.itemsPerPage}&`
        }
        if (context.state.pagination.query) {
          request += `query=${context.state.pagination.query}&`
        }
        if (context.state.pagination.tags) {
          context.state.pagination.tags.forEach(tag => {
            request += `tags[]=${tag}&`
          })
        }
        if (context.state.pagination.mainWebsites) {
          context.state.pagination.mainWebsites.forEach(mainWebsite => {
            request += `mainWebsites[]=${mainWebsite}&`
          })
        }
        if (context.state.pagination.proxies) {
          context.state.pagination.proxies.forEach(proxy => {
            request += `proxies[]=${proxy}&`
          })
        }
        if (context.state.pagination.statuses) {
          context.state.pagination.statuses.forEach(status => {
            request += `statuses[]=${status}&`
          })
        }
        if (context.state.pagination.users) {
          context.state.pagination.users.forEach(userId => {
            request += `users[]=${userId}&`
          })
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (request.endsWith('?')) {
          request += 'page=1&limit=50'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: context.state.pagination.query ? context.state.pagination.query : null,
            tags: context.state.pagination.tags ? context.state.pagination.tags : null,
            mainWebsites: context.state.pagination.mainWebsites ? context.state.pagination.mainWebsites : null,
            proxies: context.state.pagination.proxies ? context.state.pagination.proxies : null,
            statuses: context.state.pagination.statuses ? context.state.pagination.statuses : null,
            users: context.state.pagination.users ? context.state.pagination.users : null
          }

          context.dispatch('setPagination', data)
          context.commit('SET_ALL', response.data.data)
          context.commit('ADD_TEAM_PROFILE_RUNNING', response.data.data)
          context.commit('SET_TOTAL', response.data.total)
          if (context.state.browserProfiles.selected.length > 0) {
            context.commit('REPLACE_SELECTED', response.data.data)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('REMOVE_LOADING', 'mainTable')
      }
    },
    async loadCurrentPageBasket (context) {
      await context.commit('ADD_LOADING', 'mainTable')

      try {
        let request = '/browser_profiles/basket?'

        if (context.state.pagination.currentPage) {
          request += `page=${context.state.pagination.currentPage}&`
        }
        if (context.state.pagination.itemsPerPage) {
          request += `limit=${context.state.pagination.itemsPerPage}&`
        }
        if (context.state.pagination.query) {
          request += `query=${context.state.pagination.query}&`
        }
        if (context.state.pagination.tags) {
          context.state.pagination.tags.forEach(tag => {
            request += `tags[]=${tag}&`
          })
        }
        if (context.state.pagination.mainWebsites) {
          context.state.pagination.mainWebsites.forEach(mainWebsite => {
            request += `mainWebsites[]=${mainWebsite}&`
          })
        }
        if (context.state.pagination.proxies) {
          context.state.pagination.proxies.forEach(proxy => {
            request += `proxies[]=${proxy}&`
          })
        }
        if (context.state.pagination.statuses) {
          context.state.pagination.statuses.forEach(status => {
            request += `statuses[]=${status}&`
          })
        }
        if (context.state.pagination.users) {
          context.state.pagination.users.forEach(userId => {
            request += `users[]=${userId}&`
          })
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (request.endsWith('?')) {
          request += 'page=1&limit=50'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: context.state.pagination.query ? context.state.pagination.query : null,
            tags: context.state.pagination.tags ? context.state.pagination.tags : null,
            mainWebsites: context.state.pagination.mainWebsites ? context.state.pagination.mainWebsites : null,
            proxies: context.state.pagination.proxies ? context.state.pagination.proxies : null,
            statuses: context.state.pagination.statuses ? context.state.pagination.statuses : null,
            users: context.state.pagination.users ? context.state.pagination.users : null
          }

          context.dispatch('setPaginationBasket', data)
          context.commit('SET_ALL_BASKET', response.data.data)
          context.commit('LOAD_BASKET', response.data.data)
          context.commit('SET_TOTAL_BASKET', response.data.total)

          if (context.state.browserProfiles.selected.length > 0) {
            context.commit('REPLACE_SELECTED_BASKET', response.data.data)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('REMOVE_LOADING', 'mainBasket')
      }
    },

    async setPagination (context, payload) {
      const pagination = {
        currentPage: parseInt(payload.response.current_page, 10),
        lastPage: parseInt(payload.response.last_page, 10),
        firstPageUrl: payload.response.first_page_url,
        nextPageUrl: payload.response.next_page_url,
        prevPageUrl: payload.response.prev_page_url,
        lastPageUrl: payload.response.last_page_url,
        links: payload.response.links,
        perPage: parseInt(payload.response.per_page, 10),
        itemsPerPage: parseInt(payload.response.per_page, 10),
        total: parseInt(payload.response.total, 10) ? parseInt(payload.response.total, 10) : 0,
        from: parseInt(payload.response.from, 10) ? parseInt(payload.response.from, 10) : 0,
        to: parseInt(payload.response.to, 10) ? parseInt(payload.response.to, 10) : 0,
        query: payload.query,
        tags: payload.tags,
        mainWebsites: payload.mainWebsites,
        proxies: payload.proxies,
        statuses: payload.statuses,
        users: payload.users
      }

      localStorage.setItem('browser-profiles-pagination', JSON.stringify(pagination))

      await context.commit('SET_PAGINATION', pagination)
    },
    async setPaginationBasket (context, payload) {
      const pagination = {
        currentPage: parseInt(payload.response.current_page, 10),
        lastPage: parseInt(payload.response.last_page, 10),
        firstPageUrl: payload.response.first_page_url,
        nextPageUrl: payload.response.next_page_url,
        prevPageUrl: payload.response.prev_page_url,
        lastPageUrl: payload.response.last_page_url,
        links: payload.response.links,
        perPage: parseInt(payload.response.per_page, 10),
        itemsPerPage: parseInt(payload.response.per_page, 10),
        total: parseInt(payload.response.total, 10) ? parseInt(payload.response.total, 10) : 0,
        from: parseInt(payload.response.from, 10) ? parseInt(payload.response.from, 10) : 0,
        to: parseInt(payload.response.to, 10) ? parseInt(payload.response.to, 10) : 0,
        query: payload.query,
        tags: payload.tags,
        mainWebsites: payload.mainWebsites,
        proxies: payload.proxies,
        statuses: payload.statuses,
        users: payload.users
      }

      localStorage.setItem('browser-profiles-pagination-basket', JSON.stringify(pagination))

      await context.commit('SET_PAGINATION_BASKET', pagination)
    },

    async addBrowserProfile (context, data) {
      try {
        const response = await this._vm.api.post('/browser_profiles', data)

        if (!response.status || response.status !== 200 || response.data.error) {
          throw response
        }
        const payload = {
          query: context.state.pagination.query,
          tags: context.state.pagination.tags,
          page: context.state.pagination.currentPage,
          itemsPerPage: context.state.pagination.itemsPerPage,
          mainWebsites: context.state.pagination.mainWebsites,
          proxies: context.state.pagination.proxies,
          statuses: context.state.pagination.statuses,
          users: context.state.pagination.users
        }
        context.dispatch('loadBrowserProfiles', payload)

        context.dispatch('loadTags')
        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.added')
        }, { root: true })
        context.dispatch('main/getSubscription', null, { root: true })

        return response.data
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async editBrowserProfile (context, data) {
      const oldBrowserProfileData = context.getters.browserProfiles.all.find(bp => bp.id === data.id)

      // AMPLITUDE СОБЫТИЕ - изменение заметки
      try {
        if (oldBrowserProfileData.notes.content && oldBrowserProfileData.notes.content !== data.data.notes.content) {
          this._vm.$amplitude.getInstance().logEvent('Note Edit')
        }
      } catch (_) { console.log(_) }

      // AMPLITUDE СОБЫТИЕ - создание заметки
      try {
        if (!oldBrowserProfileData.notes.content && data.data.notes.content) {
          this._vm.$amplitude.getInstance().logEvent('Note Add')
        }
      } catch (_) { console.log(_) }

      // AMPLITUDE СОБЫТИЕ - изменение прокси
      try {
        if (data.data && data.data.proxy && parseInt(oldBrowserProfileData.proxyId) !== parseInt(data.data.proxy.id)) {
          this._vm.$amplitude.getInstance().logEvent('Account Proxy Change')
        }
      } catch (_) { console.log(_) }

      // AMPLITUDE СОБЫТИЕ - изменение тегов
      try {
        if (JSON.stringify(oldBrowserProfileData.tags) !== JSON.stringify(data.data.tags)) {
          if (oldBrowserProfileData.tags.length < data.data.tags.length) {
            this._vm.$amplitude.getInstance().logEvent('Tag Add', { 'tags count': data.data.tags.length })
          } else {
            this._vm.$amplitude.getInstance().logEvent('Tag Delete', { 'tags count': data.data.tags.length })
          }
        }
      } catch (_) { console.log(_) }

      try {
        const response = await this._vm.api.patch(`/browser_profiles/${data.id}`, data.data)

        if (!response.status || response.status !== 200 || response.data.error) {
          throw response
        }

        context.dispatch('loadCurrentPage')
        context.dispatch('loadTags')

        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.saved')
        }, {
          root: true
        })

        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async loadTags (context, payload = { sendAmplitude: false }) {
      try {
        let request = '/browser_profiles/tags?'

        if (context.state.filters.users.length) {
          context.state.filters.users.forEach(userId => {
            const existedUser = context.rootState.users.users.all.find(i => parseInt(i.id, 10) === parseInt(userId, 10))
            if (existedUser) {
              request += `users[]=${userId}&`
            }
          })
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (request.endsWith('?')) {
          request += 'page=1&limit=50'
        }

        let response = await this._vm.api.get(request)
        let tags = []

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          tags = tags.concat(response.data.data)

          if (payload.sendAmplitude) {
            switch (payload.mode) {
              case 1:
                this._vm.$amplitude.getInstance().logEvent('Tag Add', { 'tags count': response.data.total })
                break
              case 0:
                this._vm.$amplitude.getInstance().logEvent('Tag Delete', { 'tags count': response.data.total })
                break
            }
          }

          if (response.data.last_page > 1) {
            while (response.data.current_page < response.data.last_page) {
              // response = await this._vm.api.get(`/browser_profiles/tags?page=${response.data.current_page + 1}`)
              response = await this._vm.api.get(request.replace(/page=\d{1,1000}/, `page=${response.data.current_page + 1}`))
              tags = tags.concat(response.data.data)
            }
          }

          await context.commit('SET_SORTED_TAGS', tags)
        }
      } catch (err) {
        console.error(err)
      }
    },

    async setEmptyBrowserProfile (context, payload) {
      await context.commit('SET_EMPTY_BROWSER_PROFILE', payload)
    },

    async setFilter (context, data) {
      await context.commit('SET_FILTER', data)
    },

    async deleteBrowserProfiles (context, payload) {
      try {
        const response = await this._vm.api.delete('/browser_profiles', { data: payload })

        if (!response.status || response.status !== 200) {
          throw response
        }
        context.commit('SET_SELECTED', [])
        context.dispatch('removeBrowserProfiles', payload.ids)
        context.dispatch('loadTags')
        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.deleted')
        }, {
          root: true
        })
        return true
      } catch (_) {
        return false
        // context.dispatch('main/alert', {
        //   color: 'error',
        //   message: i18n.t('authorization.somethingWentWrong')
        // }, {
        //   root: true
        // })
      }
    },
    async setBrowserProfile (context, browserProfile) {
      context.commit('SET_BROWSER_PROFILE', browserProfile)
    },

    async removeBrowserProfiles (context, payload) {
      context.commit('REMOVE_BROWSER_PROFILES', payload)
    },

    async setBrowserProfileForCookieRobot (context, browserProfile) {
      context.commit('SET_BROWSER_PROFILE', browserProfile)
    },

    async setBrowserProfileForEdit (context, browserProfile) {
      const data = {
        id: browserProfile.id,
        name: typeof browserProfile.name === 'undefined' ? '' : browserProfile.name,
        tags: typeof browserProfile.tags === 'undefined' ? [] : browserProfile.tags,
        platform: typeof browserProfile.platform === 'undefined' ? '' : browserProfile.platform,
        browserType: browserProfile.browserType ? browserProfile.browserType : 'chrome',
        mainWebsite: browserProfile.mainWebsite ? browserProfile.mainWebsite : 'none',
        useragent: {
          mode: browserProfile.useragent && typeof browserProfile.useragent.mode !== 'undefined' ? browserProfile.useragent.mode : 'auto',
          value: browserProfile.useragent && typeof browserProfile.useragent.value !== 'undefined' ? browserProfile.useragent.value : null
        },
        webrtc: {
          mode: browserProfile.webrtc && typeof browserProfile.webrtc.mode !== 'undefined' ? browserProfile.webrtc.mode : 'altered',
          ipAddress: browserProfile.webrtc && typeof browserProfile.webrtc.ipAddress !== 'undefined' ? browserProfile.webrtc.ipAddress : null
        },
        webgl: {
          mode: browserProfile.webgl && typeof browserProfile.webgl.mode !== 'undefined' ? browserProfile.webgl.mode : 'off'
        },
        webglInfo: {
          mode: browserProfile.webglInfo && typeof browserProfile.webglInfo.mode !== 'undefined' ? browserProfile.webglInfo.mode : 'real',
          vendor: browserProfile.webglInfo && typeof browserProfile.webglInfo.vendor !== 'undefined' ? browserProfile.webglInfo.vendor : null,
          renderer: browserProfile.webglInfo && typeof browserProfile.webglInfo.renderer !== 'undefined' ? browserProfile.webglInfo.renderer : null
        },
        clientRect: {
          mode: browserProfile.clientRect && typeof browserProfile.clientRect.mode !== 'undefined' ? browserProfile.clientRect.mode : 'real'
        },
        canvas: {
          mode: browserProfile.canvas && typeof browserProfile.canvas.mode !== 'undefined' ? browserProfile.canvas.mode : 'real'
        },
        notes: {
          content: browserProfile.notes && typeof browserProfile.notes.content !== 'undefined' ? browserProfile.notes.content : '',
          color: browserProfile.notes && typeof browserProfile.notes.color !== 'undefined' ? browserProfile.notes.color : 'blue',
          style: browserProfile.notes && typeof browserProfile.notes.style !== 'undefined' ? browserProfile.notes.style : 'text',
          icon: browserProfile.notes && typeof browserProfile.notes.icon !== 'undefined' ? browserProfile.notes.icon : null
        },
        timezone: {
          mode: browserProfile.timezone && typeof browserProfile.timezone.mode !== 'undefined' ? browserProfile.timezone.mode : 'auto',
          value: browserProfile.timezone && typeof browserProfile.timezone.value !== 'undefined' ? browserProfile.timezone.value : null
        },
        locale: {
          mode: browserProfile.locale && typeof browserProfile.locale.mode !== 'undefined' ? browserProfile.locale.mode : 'auto',
          value: browserProfile.locale && typeof browserProfile.locale.value !== 'undefined' ? browserProfile.locale.value : null
        },
        clientRects: {
          mode: browserProfile.clientRects && typeof browserProfile.clientRects.mode !== 'undefined' ? browserProfile.clientRects.mode : 'real'
        },
        geolocation: {
          // mode: browserProfile.geolocation && typeof browserProfile.geolocation.mode !== 'undefined' ? browserProfile.geolocation.mode : 'auto',
          latitude: browserProfile.geolocation && typeof browserProfile.geolocation.latitude !== 'undefined' ? browserProfile.geolocation.latitude : null,
          longitude: browserProfile.geolocation && typeof browserProfile.geolocation.longitude !== 'undefined' ? browserProfile.geolocation.longitude : null,
          accuracy: browserProfile.geolocation && typeof browserProfile.geolocation.accuracy !== 'undefined' ? browserProfile.geolocation.accuracy : null,
          marker: browserProfile.geolocation && typeof browserProfile.geolocation.marker !== 'undefined' ? browserProfile.geolocation.marker : {}
        },
        cpu: {
          mode: browserProfile.cpu && typeof browserProfile.cpu.mode !== 'undefined' ? browserProfile.cpu.mode : 'real',
          value: browserProfile.cpu && typeof browserProfile.cpu.value !== 'undefined' ? browserProfile.cpu.value : null
        },
        memory: {
          mode: browserProfile.memory && typeof browserProfile.memory.mode !== 'undefined' ? browserProfile.memory.mode : 'real',
          value: browserProfile.memory && typeof browserProfile.memory.value !== 'undefined' ? browserProfile.memory.value : null
        },
        screen: {
          mode: browserProfile.screen && typeof browserProfile.screen.mode !== 'undefined' ? browserProfile.screen.mode : 'real',
          resolution: browserProfile.screen && typeof browserProfile.screen.resolution !== 'undefined' ? browserProfile.screen.resolution : null,
          colorDepth: browserProfile.screen && typeof browserProfile.screen.colorDepth !== 'undefined' ? browserProfile.screen.colorDepth : null
        },
        mediaDevices: {
          mode: browserProfile.mediaDevices && typeof browserProfile.mediaDevices.mode !== 'undefined' ? browserProfile.mediaDevices.mode : 'real',
          audioInputs: browserProfile.mediaDevices && typeof browserProfile.mediaDevices.audioInputs !== 'undefined' ? browserProfile.mediaDevices.audioInputs : null,
          videoInputs: browserProfile.mediaDevices && typeof browserProfile.mediaDevices.videoInputs !== 'undefined' ? browserProfile.mediaDevices.videoInputs : null,
          audioOutputs: browserProfile.mediaDevices && typeof browserProfile.mediaDevices.audioOutputs !== 'undefined' ? browserProfile.mediaDevices.audioOutputs : null
        },
        ports: {
          mode: browserProfile.ports && typeof browserProfile.ports.mode !== 'undefined' ? browserProfile.ports.mode : 'protect',
          blacklist: browserProfile.ports && typeof browserProfile.ports.blacklist !== 'undefined' ? browserProfile.ports.blacklist : '3389,5900,5800,7070,6568,5938'
        },
        doNotTrack: typeof browserProfile.doNotTrack === 'undefined' ? false : browserProfile.doNotTrack,
        args: typeof browserProfile.args === 'undefined' || browserProfile.args === '[]' ? '' : browserProfile.args.map(arg => '--' + arg).join('\n'),
        // userFields: typeof browserProfile.userFields === 'undefined' ? [] : browserProfile.userFields,
        // userFieldsForMainDialog: typeof browserProfile.userFieldsForMainDialog === 'undefined' ? [] : browserProfile.userFieldsForMainDialog,
        status: browserProfile.status ? browserProfile.status : null,
        forEdit: true,
        proxy: browserProfile.proxy ? browserProfile.proxy : null,
        proxyId: browserProfile.proxyId ? browserProfile.proxyId : 0,
        proxyInput: '',
        proxyNew: {
          name: '',
          host: '',
          port: '',
          type: '',
          login: '',
          password: '',
          changeIpUrl: ''
        },
        platformVersion: browserProfile.platformVersion ? browserProfile.platformVersion : null
      }

      if (browserProfile.proxyId > 0) {
        data.proxyMode = 2
      } else {
        data.proxyMode = 0
      }

      if (browserProfile.browserType === 'anty') {
        data.appCodeName = browserProfile.appCodeName
        data.platformName = browserProfile.platformName

        data.connectionDownlink = browserProfile.connectionDownlink
        data.connectionEffectiveType = browserProfile.connectionEffectiveType
        data.connectionRtt = browserProfile.connectionRtt
        data.connectionSaveData = browserProfile.connectionSaveData

        data.cpuArchitecture = browserProfile.cpuArchitecture
        data.osVersion = browserProfile.osVersion ? browserProfile.osVersion.toString() : ''

        // data.screenWidth = browserProfile.screenWidth
        // data.screenHeight = browserProfile.screenHeight

        data.vendorSub = browserProfile.vendorSub
        data.productSub = browserProfile.productSub ? browserProfile.productSub.toString() : ''
        data.vendor = browserProfile.vendor
        data.product = browserProfile.product
      }

      await context.commit('SET_BROWSER_PROFILE', data)
    },

    async addRunning (context, data) {
      await context.commit('ADD_RUNNING', data)
    },

    async removeRunning (context, data) {
      await context.commit('REMOVE_RUNNING', data)
    },

    async addLoading (context, data) {
      await context.commit('ADD_LOADING', data)
    },

    async removeLoading (context, data) {
      await context.commit('REMOVE_LOADING', data)
    },

    async addCookieRobotRunning (context, data) {
      await context.commit('ADD_COOKIE_ROBOT_RUNNING', data)
    },

    async addCookieRobotProgress (context, data) {
      await context.commit('ADD_COOKIE_ROBOT_PROGRESS', data)
    },

    async removeCookieRobotRunning (context, data) {
      await context.commit('REMOVE_COOKIE_ROBOT_RUNNING', data)
    },

    async clearUseragent (context) {
      await context.commit('CLEAR_USERAGENT')
    },

    async setBrowserProfileProperty (context, data) {
      await context.commit('SET_BROWSER_PROFILE_PROPERTY', data)
    },

    async addSync (context, data) {
      await context.commit('ADD_SYNC', data)
    },

    async removeSync (context, data) {
      await context.commit('REMOVE_SYNC', data)
    },

    async addSyncErrors (context, data) {
      await context.commit('ADD_SYNC_ERRORS', data)
    },

    async addMainButtonError (context, data) {
      await context.commit('ADD_MAIN_BUTTON_ERROR', data)
    },

    async removeMainButtonError (context, data) {
      await context.commit('REMOVE_MAIN_BUTTON_ERROR', data)
    },

    async addSyncSuccess (context, data) {
      await context.commit('ADD_SYNC_SUCCESS', data)
    },

    async removeSyncErrors (context, data) {
      await context.commit('REMOVE_SYNC_ERRORS', data)
    },

    async setBrowserProfileSyncError (context, data) {
      await context.commit('SET_BROWSER_PROFILE_SYNC_ERROR', data)
    },

    async setColumns (context, data) {
      await context.commit('SET_COLUMNS', data)
    },

    // async replaceBrowserProfile (context, data) {
    //   await context.commit('REPLACE_BROWSER_PROFILE', data)
    // },

    async setBrowserProfileTimer (context, data) {
      await context.commit('SET_BROWSER_PROFILE_TIMER', data)
    },

    async loadScreenResolutions (context) {
      const platforms = ['linux', 'windows', 'macos']

      for (const platform of platforms) {
        const response = await this._vm.api.get(`/fingerprints/screen?platform=${platform}`)
        if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
          await context.commit('SET_SCREEN_RESOLUTIONS', { platform: platform, data: response.data.data })
        }
      }
    },

    async sendEventStop (context, data) {
      let response = null

      if (data.browserProfile) {
        response = await this._vm.api.post(`/browser_profiles/${data.browserProfile.id}/events`, { type: 'stop' }, { cancelToken: data.cancelToken.token })
      } else {
        response = await this._vm.api.post(`/browser_profiles/${data}/events`, { type: 'stop' })
      }

      if (response &&
        response.data &&
        response.data &&
        response.data.totalSessionDuration !== undefined &&
        response.data.totalSessionDuration !== null &&
        parseInt(response.data.totalSessionDuration, 10) > 0
      ) {
        context.commit('SET_TOTAL_SESSION_DURATION', {
          id: data.browserProfile ? data.browserProfile.id : data,
          totalSessionDuration: response.data.totalSessionDuration
        })
      }
    },

    async setCancelToken (context, data) {
      await context.commit('SET_CANCEL_TOKEN', data)
    },

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async clearTags (context) {
      context.commit('SET_SORTED_TAGS', [])
    },

    async clearSelected (context) {
      await context.commit('SET_SELECTED', [])
    },
    async clearSelectedBasket (context) {
      await context.commit('SET_SELECTED_BASKET', [])
    },

    async setFullBrowserProfile (context, browserProfile) {
      await context.commit('SET_FULL_BROWSER_PROFILE', browserProfile)
    },

    async addTeamProfileRunning (context, id) {
      await context.commit('ADD_TEAM_PROFILE_RUNNING', id)
    },

    async removeTeamProfileRunning (context, id) {
      await context.commit('REMOVE_TEAM_PROFILE_RUNNING', id)
    },

    async setUserFieldsForMainDialog (context, data) {
      const userFieldsForMainDialog = []

      for (const userField of data) {
        switch (userField.type) {
          case 'text':
          case 'textarea':
          case 'select':
            userField.value = ''
            break
          case 'checkbox':
            userField.value = false
            break
          case 'checklist':
            userField.value = {}

            if (userField.content && userField.content.items && Array.isArray(userField.content.items)) {
              for (const item of userField.content.items) {
                userField.value[item.id] = false
              }
            }
            break
          case 'selectMultiple':
            userField.value = []
            break
        }

        if (context.state.browserProfile &&
          context.state.browserProfile.userFields &&
          Array.isArray(context.state.browserProfile.userFields) &&
          context.state.browserProfile.userFields.length > 0
        ) {
          context.state.browserProfile.userFields.forEach(browserProfileUserField => {
            if (parseInt(browserProfileUserField.fieldId, 10) === parseInt(userField.id, 10) && browserProfileUserField.value) {
              userField.value = this.$_.cloneDeep(browserProfileUserField.value)
            }
          })
        }

        userFieldsForMainDialog.push(userField)
      }

      context.commit('SET_USER_FIELDS_FOR_MAIN_DIALOG', userFieldsForMainDialog)
    }
  }
}
