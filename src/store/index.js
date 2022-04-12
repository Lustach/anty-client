import Vuex from 'vuex'
import Vue from 'vue'

import browserProfiles from './modules/browserProfiles'
import main from './modules/main'
import proxy from './modules/proxy'
import settings from './modules/settings'
import browserProfilesStatuses from './modules/browserProfilesStatuses'
import userFields from './modules/userFields'
import users from './modules/users'
import bookmarks from './modules/bookmarks'
import extensions from './modules/extensions'
import browserProfilesMultipleImport from './modules/browserProfilesMultipleImport'
import settingsHomepages from './modules/settingsHomepages'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    browserProfiles,
    main,
    proxy,
    settings,
    browserProfilesStatuses,
    userFields,
    users,
    bookmarks,
    extensions,
    browserProfilesMultipleImport,
    settingsHomepages
  }
})
