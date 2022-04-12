import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    statuses: {
      all: [],
      selected: [],
      forMainDialog: {
        name: '',
        color: 'blue'
      }
    },
    pagination: {},
    dialogs: {
      mainDialog: false,
      delete: false
    },
    loading: {
      mainTable: false
    },
    mainDialogMode: 'create',
    selectedProfile: false
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    statuses: state => state.statuses,
    dialogs: state => state.dialogs,
    mainDialogMode: state => state.mainDialogMode,
    loading: state => state.loading,
    pagination: state => state.pagination,
    selectedProfile: state => state.selectedProfile
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_SELECTED_PROFILE: (state, payload) => {
      state.selectedProfile = payload
    },

    SET_ALL: (state, payload) => {
      state.statuses.all = payload
    },

    ADD_ALL: (state, payload) => {
      state.statuses.all = state.statuses.all.concat(payload)
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },

    SET_STATUS_FOR_MAIN_DIALOG: (state, payload) => {
      state.statuses.forMainDialog = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_SELECTED: (state, payload) => {
      state.statuses.selected = payload
    },

    SET_MAIN_DIALOG_MODE: (state, payload) => {
      state.mainDialogMode = payload
    },

    REMOVE_STATUSES: (state, payload) => {
      state.statuses.all = state.statuses.all.filter(item => !payload.includes(parseInt(item.id, 10)))
    },

    REPLACE_STATUS: (state, payload) => {
      const allStatusesIndex = state.statuses.all.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (allStatusesIndex > -1) {
        state.statuses.all.splice(allStatusesIndex, 1, payload)
      }

      const selectedStatusesIndex = state.statuses.selected.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (selectedStatusesIndex > -1) {
        state.statuses.selected.splice(selectedStatusesIndex, 1, payload)
      }
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadAllStatuses (context) {
      try {
        const response = await this._vm.api.get('/browser_profiles/statuses?page=1&limit=50')

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data
          }

          await context.dispatch('setPagination', data)
          await context.commit('SET_ALL', response.data.data)
          while (context.state.pagination.currentPage < context.state.pagination.lastPage) {
            await context.dispatch('loadNextStatuses')
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    async loadStatuses (context, payload = null) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/browser_profiles/statuses?'

        if (payload && payload.page) {
          request += `page=${payload.page}&`
        }
        if (payload && payload.itemsPerPage) {
          request += `limit=${payload.itemsPerPage}&`
        }
        if (payload && payload.query) {
          request += `query=${encodeURIComponent(payload.query)}&`
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (payload === null || request.endsWith('?')) {
          request += 'page=1&limit=10'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: payload && payload.query ? payload.query : null
          }

          await context.dispatch('setPagination', data)
          localStorage.setItem('statuses-pagination', JSON.stringify(context.state.pagination))
          context.commit('SET_ALL', response.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('SET_LOADING', { key: 'mainTable', value: false })
      }
    },

    async loadNextStatuses (context) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/browser_profiles/statuses?'
        if (context.state.pagination && context.state.pagination.currentPage) {
          request += `page=${context.state.pagination.currentPage + 1}&`
        }
        if (context.state.pagination && context.state.pagination.perPage) {
          request += `limit=${context.state.pagination.perPage}&`
        }
        if (context.state.pagination && context.state.pagination.query) {
          request += `query=${context.state.pagination.query}&`
        }
        if (request.endsWith('&')) {
          request = request.slice(0, request.length - 1)
        }

        if (context.state.pagination === null || request.endsWith('?')) {
          request += 'page=1&limit=10'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: context.state.pagination && context.state.pagination.query ? context.state.pagination.query : null
          }

          context.dispatch('setPagination', data)
          context.commit('ADD_ALL', response.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('SET_LOADING', { key: 'mainTable', value: false })
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
        total: parseInt(payload.response.total, 10),
        from: parseInt(payload.response.from, 10),
        to: parseInt(payload.response.to, 10),
        query: payload.query
      }

      await context.commit('SET_PAGINATION', pagination)
    },

    async clearStatusForMainDialog (context) {
      const data = {
        name: '',
        color: 'blue'
      }
      await context.commit('SET_STATUS_FOR_MAIN_DIALOG', data)
    },

    async clearSelected (context) {
      context.commit('SET_SELECTED', [])
    },

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async removeStatuses (context, data) {
      await context.commit('REMOVE_STATUSES', data)
    },

    async setUserFieldForMainDialog (context, status) {
      const data = {
        id: status.id,
        name: typeof status.name === 'undefined' ? '' : status.name,
        color: typeof status.color === 'undefined' ? 'blue' : status.color
      }

      await context.commit('SET_STATUS_FOR_MAIN_DIALOG', data)
    },

    async setMainDialogMode (context, data) {
      await context.commit('SET_MAIN_DIALOG_MODE', data)
    },

    async replaceStatus (context, data) {
      await context.commit('REPLACE_STATUS', data)
    }
  }
}
