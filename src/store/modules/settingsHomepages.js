import {
  mixinDialogMutations,
  mixinDialogActions,
  mixinDialogGetters
} from '@/mixins/vuexDialogs'

import { getField, updateField } from 'vuex-map-fields'

export default {
  namespaced: true,
  state: {
    homepages: {
      all: [],
      selected: [],
      homepageForEdit: {}
    },
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

    homepages: state => state.homepages,
    pagination: state => state.pagination,
    loading: state => state.loading
  },
  mutations: {
    ...mixinDialogMutations,
    updateField,

    SET_ALL: (state, payload) => {
      state.homepages.all = payload
    },
    CONCAT_ALL: (state, payload) => {
      state.homepages.all = state.homepages.all.concat(payload)
    },

    SET_SELECTED: (state, payload) => {
      state.homepages.selected = payload
    },

    SET_LOADING: (state, payload) => {
      state.loading[payload.key] = payload.value
    },

    SET_HOME_PAGE_FOR_EDIT: (state, payload) => {
      state.homepages.homepageForEdit = payload
    },

    REPLACE_SELECTED_HOMEPAGES: (state) => {
      if (state.homepages.selected.length) {
        state.homepages.selected.forEach((selectedHomepage, selectedHomepageIndex) => {
          console.log('asdas')
          const allHomepageIndex = state.homepages.all.findIndex(i => parseInt(i.id, 10) === parseInt(selectedHomepage.id, 10))
          if (allHomepageIndex > -1) {
            state.homepages.selected.splice(selectedHomepageIndex, 1, state.homepages.all[allHomepageIndex])
          } else {
            state.homepages.selected = state.homepages.selected.filter(i => parseInt(i.id, 10) !== parseInt(selectedHomepage.id, 10))
          }
        })
      }
    },

    SELECT_HOMEPAGE: (state, homepage) => {
      state.homepages.selected.push(homepage)
    },
    DESELECT_HOMEPAGE: (state, homepage) => {
      state.homepages.selected = state.homepages.selected.filter(i => parseInt(i.id, 10) !== parseInt(homepage.id, 10))
    }
  },

  actions: {
    ...mixinDialogActions,

    async loadAllHomepages ({ commit }) {
      try {
        await commit('SET_ALL', [])
        await commit('SET_LOADING', { key: 'mainTable', value: true })

        let response = await this._vm.api.get('/homepages')

        if (response.status === 200 && response.data?.data) {
          await commit('CONCAT_ALL', response.data.data)

          while (response.data.current_page < response.data.last_page) {
            response = await this._vm.api.get(`/homepages?page=${response.data.current_page + 1}`)
            if (response.status === 200 && response.data?.data) {
              await commit('CONCAT_ALL', response.data.data)
            }
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        await commit('SET_LOADING', { key: 'mainTable', value: false })
        await commit('REPLACE_SELECTED_HOMEPAGES')
      }
    },

    async clearAll (context) {
      context.commit('SET_ALL', [])
    },

    async clearSelected (context) {
      await context.commit('SET_SELECTED', [])
    },

    async setHomepageForEdit (context, data) {
      await context.commit('SET_HOME_PAGE_FOR_EDIT', data)
    },

    async selectHomepage ({ commit }, homepage) {
      await commit('SELECT_HOMEPAGE', homepage)
    },
    async deselectHomepage ({ commit }, homepage) {
      await commit('DESELECT_HOMEPAGE', homepage)
    }
  }
}
