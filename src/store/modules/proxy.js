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
    proxies: {
      all: [],
      selected: [],
      checking: [],
      forEdit: {}
    },
    pagination: {},
    dialogs: {
      create: false,
      delete: false,
      edit: false,
      share: false
    },
    loading: {
      mainTable: false
    },
    filters: {
      name: ''
    },

    mainTableLoading: false
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    proxies: state => state.proxies,
    filters: state => state.filters,
    loading: state => state.loading,
    pagination: state => state.pagination
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.proxies.all = payload
    },

    ADD_ALL: (state, payload) => {
      state.proxies.all = state.proxies.all.concat(payload)
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },

    SET_SELECTED: (state, payload) => {
      state.proxies.selected = payload
    },

    SET_FILTER: (state, payload) => {
      state.filters[payload.filter] = payload.data
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_PROXY_FOR_EDIT: (state, payload) => {
      state.proxies.forEdit = { ...payload }
    },

    REMOVE_PROXIES: (state, payload) => {
      state.proxies.all = state.proxies.all.filter(item => !payload.includes(parseInt(item.id, 10)))
    },

    REPLACE_PROXY: (state, payload) => {
      const allProxyIndex = state.proxies.all.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (allProxyIndex > -1) {
        state.proxies.all.splice(allProxyIndex, 1, payload)
      }

      const selectedProxyIndex = state.proxies.selected.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (selectedProxyIndex > -1) {
        state.proxies.selected.splice(selectedProxyIndex, 1, payload)
      }
    },

    REPLACE_LAST_CHECK: (state, payload) => {
      state.proxies.all = state.proxies.all.map(item => {
        if (parseInt(item.id, 10) === parseInt(payload.id, 10)) {
          item.lastCheck = payload.lastCheck
        }
        return item
      })

      state.proxies.selected = state.proxies.selected.map(item => {
        if (parseInt(item.id, 10) === parseInt(payload.id, 10)) {
          item.lastCheck = payload.lastCheck
        }
        return item
      })
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadAllProxies (context) {
      try {
        const response = await this._vm.api.get('/proxy?page=1&limit=50')

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data
          }

          await context.dispatch('setPagination', data)
          await context.commit('SET_ALL', response.data.data)
          while (context.state.pagination.currentPage < context.state.pagination.lastPage) {
            await context.dispatch('loadNextProxies')
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    async loadProxies (context, payload = null) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/proxy?'

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
          request += 'page=1&limit=50'
        }

        const response = await this._vm.api.get(request)

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data,
            query: payload && payload.query ? payload.query : null
          }

          await context.dispatch('setPagination', data)
          localStorage.setItem('proxy-pagination', JSON.stringify(context.state.pagination))
          context.commit('SET_ALL', response.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('SET_LOADING', { key: 'mainTable', value: false })
      }
    },

    async loadNextProxies (context) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/proxy?'
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
          request += 'page=1&limit=50'
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

    async setFilter (context, data) {
      await context.commit('SET_FILTER', data)
    },

    async clearSelected (context) {
      await context.commit('SET_SELECTED', [])
    },

    async deleteProxies (context, data) {
      const response = await this._vm.api.delete('/proxy', { data: data })
      if (response.status === 200 && response.data && response.data.success === true) {
        context.commit('SET_SELECTED', [])
        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.deleted')
        }, {
          root: true
        })
      }

      return response
    },

    async setProxyForEdit (context, data) {
      await context.commit('SET_PROXY_FOR_EDIT', data)
    },

    async editProxy (context, data) {
      const response = await this._vm.api.patch(`/proxy/${data.id}`, data.payload)
      if (response.status === 200) {
        await context.dispatch('replaceProxy', response.data.data)

        context.dispatch('main/alert', {
          color: 'success',
          message: i18n.t('common.saved')
        }, {
          root: true
        })

        return true
      } else {
        return false
      }
    },

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async replaceProxy (context, data) {
      await context.commit('REPLACE_PROXY', data)
    },

    async replaceLastCheck (context, data) {
      await context.commit('REPLACE_LAST_CHECK', data)
    }
  }
}
