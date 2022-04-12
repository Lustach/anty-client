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
    bookmarks: {
      all: [],
      selected: [],
      bookmarkForEdit: {}
    },
    pagination: {},
    dialogs: {
      create: false,
      delete: false,
      edit: false
    },
    loading: {
      mainTable: false
    }
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    bookmarks: state => state.bookmarks,
    pagination: state => state.pagination,
    loading: state => state.loading
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.bookmarks.all = payload
    },

    ADD_ALL: (state, payload) => {
      state.bookmarks.all = state.bookmarks.all.concat(payload)
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },

    SET_SELECTED: (state, payload) => {
      state.bookmarks.selected = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_BOOKMARK_FOR_EDIT: (state, payload) => {
      state.bookmarks.bookmarkForEdit = payload
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadAllBookmarks (context) {
      try {
        const response = await this._vm.api.get('/bookmarks?page=1&limit=50')

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data
          }
          await context.dispatch('setPagination', data)

          await context.commit('SET_ALL', response.data.data)
          while (context.state.pagination.currentPage < context.state.pagination.lastPage) {
            await context.dispatch('loadNextBookmarks')
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    async loadBookmarks (context, payload = null) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/bookmarks?'

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
          localStorage.setItem('bookmarks-pagination', JSON.stringify(context.state.pagination))
          context.commit('SET_ALL', response.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('SET_LOADING', { key: 'mainTable', value: false })
      }
    },

    async loadNextBookmarks (context) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/bookmarks?'
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

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async clearSelected (context) {
      await context.commit('SET_SELECTED', [])
    },

    async deleteBookmarks (context, data) {
      const response = await this._vm.api.delete('/bookmarks', { data: data })
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

    async setBookmarkForEdit (context, data) {
      await context.commit('SET_BOOKMARK_FOR_EDIT', data)
    }
  }
}
