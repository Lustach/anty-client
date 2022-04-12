import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    userFields: {
      all: [],
      selected: [],
      forMainDialog: {
        name: '',
        type: 'text',
        mainWebsite: ['all'],
        content: {
          items: []
        }
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
    mainDialogMode: 'create'
  },
  getters: {
    ...mixinDialogGetters,
    getField,

    userFields: state => state.userFields,
    dialogs: state => state.dialogs,
    mainDialogMode: state => state.mainDialogMode,
    loading: state => state.loading,
    pagination: state => state.pagination
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.userFields.all = payload
    },

    SET_PAGINATION: (state, payload) => {
      state.pagination = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_USER_FIELD_FOR_MAIN_DIALOG: (state, payload) => {
      state.userFields.forMainDialog = payload
    },

    SET_SELECTED: (state, payload) => {
      state.userFields.selected = payload
    },

    SET_MAIN_DIALOG_MODE: (state, payload) => {
      state.mainDialogMode = payload
    },

    REMOVE_USER_FIELDS: (state, payload) => {
      state.userFields.all = state.userFields.all.filter(item => !payload.includes(parseInt(item.id, 10)))
    },

    REPLACE_USERFIELD: (state, payload) => {
      const allUserFieldsIndex = state.userFields.all.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (allUserFieldsIndex > -1) {
        state.userFields.all.splice(allUserFieldsIndex, 1, payload)
      }

      const selectedUserFieldsIndex = state.userFields.selected.findIndex(item => parseInt(item.id, 10) === parseInt(payload.id, 10))
      if (selectedUserFieldsIndex > -1) {
        state.userFields.selected.splice(selectedUserFieldsIndex, 1, payload)
      }
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadUserFields (context, payload = null) {
      await context.commit('SET_LOADING', { key: 'mainTable', value: true })

      let response = null
      if (payload && payload.page && payload.itemsPerPage) {
        response = await this._vm.api.get(`/browser_profiles/user_fields?page=${payload.page}&limit=${payload.itemsPerPage}`)
      } else {
        response = await this._vm.api.get('/browser_profiles/user_fields?page=1&limit=10')
      }

      if (response.status === 200) {
        context.dispatch('setPagination', response.data)
        context.commit('SET_ALL', response.data.data)
      }
      await context.commit('SET_LOADING', { key: 'mainTable', value: false })
    },

    async setPagination (context, payload) {
      const pagination = {
        currentPage: parseInt(payload.current_page, 10),
        lastPage: parseInt(payload.last_page, 10),
        firstPageUrl: payload.first_page_url,
        nextPageUrl: payload.next_page_url,
        prevPageUrl: payload.prev_page_url,
        lastPageUrl: payload.last_page_url,
        links: payload.links,
        perPage: parseInt(payload.per_page, 10),
        total: parseInt(payload.total, 10),
        from: parseInt(payload.from, 10),
        to: parseInt(payload.to, 10)
      }
      await context.commit('SET_PAGINATION', pagination)
    },

    async clearUserFieldForMainDialog (context) {
      const data = {
        name: '',
        type: 'text',
        mainWebsite: ['all'],
        content: {
          items: []
        }
      }
      await context.commit('SET_USER_FIELD_FOR_MAIN_DIALOG', data)
    },

    async clearSelected (context) {
      context.commit('SET_SELECTED', [])
    },

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async removeUserFields (context, data) {
      await context.commit('REMOVE_USER_FIELDS', data)
    },

    async setUserFieldForMainDialog (context, userField) {
      const data = {
        id: userField.id,
        name: typeof userField.name === 'undefined' ? '' : userField.name,
        type: typeof userField.type === 'undefined' ? 'text' : userField.type,
        mainWebsite: typeof userField.mainWebsite === 'undefined' ? ['all'] : userField.mainWebsite.concat([]),
        content: typeof userField.content === 'undefined' ? { items: [] } : { ...userField.content }
      }

      await context.commit('SET_USER_FIELD_FOR_MAIN_DIALOG', data)
    },

    async setMainDialogMode (context, data) {
      await context.commit('SET_MAIN_DIALOG_MODE', data)
    },

    async replaceUserField (context, data) {
      await context.commit('REPLACE_USERFIELD', data)
    }
  }
}
