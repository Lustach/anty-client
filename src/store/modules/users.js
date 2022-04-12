import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    users: {
      all: [],
      forEdit: {}
    },
    dialogs: {
      create: false,
      delete: false,
      edit: false
    },
    loading: {
      mainTable: false
    },
    pagination: {},
    filters: {
      user: ''
    },
    allUsersForDialog: []
  },

  getters: {
    ...mixinDialogGetters,
    getField,

    users: state => state.users,
    filters: state => state.filters,
    loading: state => state.loading,
    pagination: state => state.pagination,
    allUsersForDialog: state => state.allUsersForDialog
  },

  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.users.all = payload
    },
    ADD_ALL: (state, payload) => {
      state.users.all = state.users.all.concat(payload)
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },

    SET_FILTER: (state, payload) => {
      state.filters[payload.filter] = payload.data
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_USER_FOR_EDIT: (state, payload) => {
      state.users.forEdit = payload
    },

    REPLACE_USER: (state, payload) => {
      const allUserIndex = state.users.all.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (allUserIndex > -1) {
        state.users.all.splice(allUserIndex, 1, payload)
      }
    },

    REMOVE_USERS: (state, payload) => {
      state.users.all = state.users.all.filter(item => !payload.includes(parseInt(item.id, 10)))
    },

    SET_ALL_USERS_FOR_DIALOG: (state, payload) => {
      state.allUsersForDialog = state.allUsersForDialog.concat(payload)
    },

    CLEAR_ALL_USERS_FOR_DIALOG: (state) => {
      state.allUsersForDialog = []
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadAllUsers (context) {
      try {
        const response = await this._vm.api.get('/team/users?page=1&limit=50')

        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          const data = {
            response: response.data
          }

          await context.dispatch('setPagination', data)
          await context.commit('SET_ALL', response.data.data)
          while (context.state.pagination.currentPage < context.state.pagination.lastPage) {
            await context.dispatch('loadNextUsers')
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    async loadUsers (context, payload = null) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/team/users?'

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
          localStorage.setItem('users-pagination', JSON.stringify(context.state.pagination))
          context.commit('SET_ALL', response.data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        await context.commit('SET_LOADING', { key: 'mainTable', value: false })
      }
    },

    async loadNextUsers (context) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      try {
        let request = '/team/users?'
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
      await context.commit('SET_ALL', [])
    },

    async setUserForEdit (context, data) {
      data.password = null
      if (data.displayName === undefined) {
        data.displayName = null
      }
      if (data.teamleads === undefined) {
        data.teamleads = null
      }
      await context.commit('SET_USER_FOR_EDIT', data)
    },

    async replaceUser (context, data) {
      await context.commit('REPLACE_USER', data)
    },

    async removeUsers (context, data) {
      await context.commit('REMOVE_USERS', data)
    },

    async loadAllUsersForDialog (context, iteration = 1) {
      try {
        if (parseInt(iteration) === 1) {
          await context.commit('CLEAR_ALL_USERS_FOR_DIALOG')
        }

        const response = await this._vm.api.get(`/team/users?page=${iteration}&limit=50`)
        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          await context.commit('SET_ALL_USERS_FOR_DIALOG', response.data.data)
          if (parseInt(response.data.current_page, 10) < parseInt(response.data.last_page, 10)) {
            context.dispatch('loadAllUsersForDialog', parseInt(response.data.current_page, 10) + 1)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
