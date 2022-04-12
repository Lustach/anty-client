<template>
  <div id="viewBrowserProfiles">
    <dialog-delete v-if="dialogs.delete" />
    <dialogs-automation-onboarding v-if="dialogs.automationOnboarding" />
    <dialog-automation v-if="dialogs.automation" />
    <dialog-extension-sync v-if="dialogs.extensionSync" />
    <dialog-tags v-if="dialogs.tags" />
    <dialog-change-proxy v-if="dialogs.changeProxy" />
    <dialog-sync-error v-if="dialogs.syncErrors" />
    <dialog-start v-if="dialogs.start" />
    <dialog-stop v-if="dialogs.stop" />
    <dialog-columns v-if="dialogs.columns" />
    <main-dialog v-if="dialogs.mainDialog" />
    <notes-dialog-edit v-if="dialogs.notesEdit" />
    <dialog-import-cookies v-if="dialogs.importCookies" />
    <dialog-enter-cookie-robot v-if="dialogs.enterCookieRobot" />
    <dialog-chrome-not-found v-if="dialogs.chromeNotFound" />
    <dialog-share v-if="dialogs.share" />
    <dialog-share-info v-if="dialogs.shareInfo" />
    <dialog-copy-profile v-if="dialogs.copyProfile" />
    <dialog-screen-warning v-if="dialogs.screenWarning" />
    <cell-proxy-dialog-change v-if="dialogs.changeProxyFromCell" />
    <dialog-transfer v-if="dialogs.transfer" />
    <dialog-parallel-start-warning v-if="dialogs.parallelStartWarning" />
    <statuses-main-dialog v-if="statusesDialogs.mainDialog" />
    <topbar />
    <main-table />
    <actions />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import Actions from '../components/browser-profiles/BrowserProfilesActions.vue'
import DialogDelete from '../components/browser-profiles/BrowserProfilesActionsDialogDelete.vue'
import DialogTags from '../components/browser-profiles/BrowserProfilesActionsDialogTags.vue'
import DialogChangeProxy from '../components/browser-profiles/BrowserProfilesActionsDialogChangeProxy.vue'
import DialogSyncError from '../components/browser-profiles/BrowserProfilesDialogSyncError.vue'
import DialogColumns from '../components/browser-profiles/BrowserProfilesDialogColumns.vue'
import NotesDialogEdit from '../components/browser-profiles/main-table/BrowserProfilesMainTableCellNotesDialogEdit.vue'
import MainTable from '../components/browser-profiles/main-table/BrowserProfilesMainTable.vue'
import MainDialog from '../components/browser-profiles/main-dialog/BrowserProfilesMainDialog.vue'
import Topbar from '../components/browser-profiles/topbar/BrowserProfilesTopbar.vue'
import DialogImportCookies from '../components/browser-profiles/main-table/BrowserProfilesMainTableDialogImportCookies.vue'
import DialogChromeNotFound from '../components/browser-profiles/BrowserProfilesDialogChromeNotFound.vue'
import DialogShare from '../components/browser-profiles/BrowserProfilesActionsDialogShare.vue'
import DialogEnterCookieRobot from '../components/browser-profiles/main-table/BrowserProfilesMainDialogCookieRobot.vue'
import DialogShareInfo from '../components/browser-profiles/BrowserProfilesActionsDialogShareInfo.vue'
import DialogCopyProfile from '../components/browser-profiles/BrowserProfilesDialogCopyProfile.vue'
import DialogScreenWarning from '../components/browser-profiles/BrowserProfilesDialogScreenWarning.vue'
import EmptyBrowserProfile from '@/constants/browserProfiles/emptyBrowserProfile.js'
import CellProxyDialogChange from '../components/browser-profiles/main-table/BrowserProfilesMainTableCellProxyDialogChange.vue'
import CommonResolutions from '@/constants/browserProfiles/commonResolutions.js'
import DialogTransfer from '../components/browser-profiles/BrowserProfilesActionsDialogTransfer.vue'
import DialogParallelStartWarning from '../components/browser-profiles/BrowserProfilesActionsDialogParallelStartWarning.vue'
import DialogExtensionSync from '../components/browser-profiles/BrowserProfilesActionsDialogExtensionSync'
import StatusesMainDialog from '../components/settings/categories/statuses/SettingsCategoriesStatusesMainDialog'
import DialogAutomation from '../components/browser-profiles/BrowserProfilesActionsDialogAutomation'
import DialogsAutomationOnboarding
from '../components/browser-profiles/BrowserProfilesActionsAutomationOnboardingDialog'

export default {
  name: 'BrowserProfiles',

  components: {
    Actions,
    DialogDelete,
    DialogTags,
    DialogChangeProxy,
    DialogSyncError,
    DialogColumns,
    NotesDialogEdit,
    MainTable,
    MainDialog,
    Topbar,
    DialogImportCookies,
    DialogEnterCookieRobot,
    DialogChromeNotFound,
    DialogShare,
    DialogShareInfo,
    DialogCopyProfile,
    DialogScreenWarning,
    CellProxyDialogChange,
    DialogParallelStartWarning,
    DialogExtensionSync,
    DialogTransfer,
    StatusesMainDialog,
    DialogAutomation,
    DialogsAutomationOnboarding
  },
  data () {
    return {
      loadBrowserProfilesInterval: 0,
      shiftPressed: 0
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'browserProfiles/dialogs',
      userFields: 'userFields/userFields',
      pagination: 'browserProfiles/pagination',
      filters: 'browserProfiles/filters',
      profile: 'main/profile',
      disableUi: 'main/disableUi',
      statusesDialogs: 'browserProfilesStatuses/dialogs'
    }),
    ...mapFields('browserProfiles', ['screenResolutions'])
  },

  watch: {
    filters: {
      deep: true,
      async handler (newVal) {
        const payload = {
          query: this.pagination.query,
          tags: this.pagination.tags,
          mainWebsites: this.pagination.mainWebsites,
          proxies: this.pagination.proxies,
          statuses: this.pagination.statuses,
          itemsPerPage: this.pagination.perPage,
          users: this.pagination.users
        }

        if (newVal && newVal.tags && Array.isArray(newVal.tags) && newVal.tags.length > 0) {
          payload.tags = newVal.tags

          // AMPLITUDE СОБЫТИЕ - фильтр по тегам
          try {
            this.$amplitude.getInstance().logEvent('Tag Filter', { 'tags count': newVal.tags.length })
          } catch (_) { /* */ }
        } else {
          payload.tags = null
        }
        if (newVal && newVal.mainWebsites && Array.isArray(newVal.mainWebsites) && newVal.mainWebsites.length > 0) {
          payload.mainWebsites = newVal.mainWebsites
        } else {
          payload.mainWebsites = null
        }
        if (newVal && newVal.proxies && Array.isArray(newVal.proxies) && newVal.proxies.length > 0) {
          payload.proxies = newVal.proxies
        } else {
          payload.proxies = null
        }
        if (newVal && newVal.statuses && Array.isArray(newVal.statuses) && newVal.statuses.length > 0) {
          payload.statuses = newVal.statuses
        } else {
          payload.statuses = null
        }
        if (newVal && newVal.users && Array.isArray(newVal.users) && newVal.users.length > 0) {
          payload.users = newVal.users
        } else {
          payload.users = null
        }
        if (newVal && newVal.sortBy && newVal.sortBy !== 'none') {
          payload.sortBy = newVal.sortBy
        } else {
          payload.sortBy = null
        }
        if (newVal && newVal.order && newVal.order !== 'none') {
          payload.order = newVal.order
        } else {
          payload.order = null
        }

        this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
      }
    }
  },

  async beforeCreate () {
    await this.$store.dispatch('browserProfiles/clearAll')
    await this.$store.dispatch('browserProfiles/clearTags')
  },

  async created () {
    this.loadScreens()

    const payload = localStorage.getItem('browser-profiles-pagination') ? JSON.parse(localStorage.getItem('browser-profiles-pagination')) : {}
    this.$store.dispatch('browserProfiles/loadBrowserProfiles', {
      tags: payload.tags,
      mainWebsites: payload.mainWebsites,
      proxies: payload.proxies,
      statuses: payload.statuses,
      page: payload.currentPage,
      itemsPerPage: payload.itemsPerPage,
      users: payload.users
    })
    this.loadUsersThenTags()
    this.$store.dispatch('browserProfilesStatuses/loadAllStatuses')
    if (!this.disableUi) {
      this.$store.dispatch('proxy/loadAllProxies')
    }

    document.addEventListener('keyup', this.openMainDialog)
  },

  beforeDestroy () {
    clearInterval(this.loadBrowserProfilesInterval)
  },

  destroyed () {
    document.removeEventListener('keyup', this.openMainDialog)
    window.removeEventListener('resize', this.setInnerHeight)
  },

  methods: {
    async loadUsersThenTags () {
      await this.$store.dispatch('users/loadAllUsers')
      this.$store.dispatch('browserProfiles/loadTags')
    },

    loadBrowserProfiles () {
      const payload = {
        query: this.pagination.query,
        tags: this.pagination.tags,
        page: this.pagination.currentPage,
        itemsPerPage: this.pagination.perPage,
        mainWebsites: this.pagination.mainWebsites,
        proxies: this.pagination.proxies,
        statuses: this.pagination.statuses,
        users: this.pagination.users
      }
      this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
    },

    async openMainDialog (e) {
      let dialogOpened = false
      for (const dialog of Object.values(this.dialogs)) {
        if (dialog) {
          dialogOpened = true
        }
      }

      if (!dialogOpened && !this.dialogs.mainDialog && e.keyCode === 16) {
        this.shiftPressed++
        setTimeout(() => { this.shiftPressed = 0 }, 300)

        if (this.shiftPressed === 2) {
          await this.$store.dispatch('browserProfiles/setEmptyBrowserProfile', this.$_.cloneDeep(EmptyBrowserProfile))
          this.$store.dispatch('browserProfiles/openDialog', 'mainDialog')
        } else if (this.shiftPressed > 2) {
          this.shiftPressed = 0
        }
      } else if (this.dialogs.mainDialog && e.keyCode === 16) {
        this.shiftPressed++
        setTimeout(() => { this.shiftPressed = 0 }, 300)

        if (this.shiftPressed === 2) {
          this.$store.dispatch('browserProfiles/closeDialog', 'mainDialog')
        } else if (this.shiftPressed > 2) {
          this.shiftPressed = 0
        }
      }
    },

    loadScreens () {
      let platformIsEmpty = false
      for (const platform in this.screenResolutions) {
        if (this.$_.isEmpty(this.screenResolutions[platform])) {
          platformIsEmpty = true
        }
      }

      if (platformIsEmpty) {
        this.setCommomScreens()
        // this.$store.dispatch('browserProfiles/loadScreenResolutions')
      }
    },

    setCommomScreens () {
      const platforms = ['linux', 'windows', 'macos']
      // const resolutions = CommonResolutions.sort((a, b) => parseInt(a.replace('x', ''), 10) - parseInt(b.replace('x', ''), 10))

      for (const platform of platforms) {
        for (const resolution of CommonResolutions) {
          this.screenResolutions[platform].push(resolution)
          // const dimensions = resolution.split('x')
          // if (dimensions[0] <= screen.width && dimensions[1] <= screen.height) {
          //   this.screenResolutions[platform].push(resolution)
          // }
        }
      }
    }
  }
}
</script>
