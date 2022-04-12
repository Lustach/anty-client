<template>
  <div
    id="settings-wrapper"
    class="pb-6"
  >
    <!-- ИНТЕГРАЦИЯ С DOLPHIN -->
    <v-container>
      <h1
        id="settingsDolphinIntegrationTitle"
        class="mb-2"
      >
        {{ $t('settings.dolphinIntegration') }}
      </h1>
      <dolphin-integration-token />
    </v-container>

    <!-- ПОЛЬЗОВАТЕЛЬСКИЕ ПОЛЯ -->
    <!-- <v-container>
      <h1>
        {{ $t('settings.userFields.userFields') }}
      </h1>
      <user-fields-delete v-if="userFieldsDialogs.delete" />
      <user-fields-main-dialog v-if="userFieldsDialogs.mainDialog" />
      <user-fields-topbar />
      <user-fields-main-table />
    </v-container> -->

    <!-- СТАТУСЫ -->
    <v-container>
      <h1 id="settingsStatusesTitle">
        {{ $t('settings.statuses.statuses') }}
      </h1>
      <statuses-delete v-if="statusesDialogs.delete" />
      <statuses-main-dialog v-if="statusesDialogs.mainDialog" />
      <statuses-topbar />
      <statuses-main-table />
    </v-container>

    <!-- СТАРТОВЫЙ СТРАНИЦЫ -->
    <v-container>
      <h1
        id="settingsHomepagesTitle"
        class="mb-2"
      >
        {{ $t('settings.homepages') }}
      </h1>
      <homepages-delete v-if="homepagesDialogs.delete" />
      <homepages-create v-if="homepagesDialogs.create" />
      <homepages-edit v-if="homepagesDialogs.edit" />
      <homepages-topbar />
      <homepages-main-table />
    </v-container>

    <!-- СОХРАНИТЬ -->
    <div class="anty-settings-save-settings-button">
      <v-btn
        id="settingsWrapperButtonSave"
        color="primary"
        :loading="loading"
        :disabled="disableSaveButton"
        @click="saveSettings"
      >
        {{ $t('common.save') }}
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DolphinIntegrationToken from './categories/dolphin-integration/SettingsCategoriesDolphinIntegrationToken.vue'
// import UserFieldsTopbar from './categories/user-fields/SettingsCategoriesUserFieldsTopbar.vue'
// import UserFieldsMainTable from './categories/user-fields/SettingsCategoriesUserFieldsMainTable.vue'
// import UserFieldsMainDialog from './categories/user-fields/SettingsCategoriesUserFieldsMainDialog.vue'
// import UserFieldsDelete from './categories/user-fields/SettingsCategoriesUserFieldsDialogDelete.vue'
import StatusesTopbar from './categories/statuses/SettingsCategoriesStatusesTopbar.vue'
import StatusesMainTable from './categories/statuses/SettingsCategoriesStatusesMainTable.vue'
import StatusesMainDialog from './categories/statuses/SettingsCategoriesStatusesMainDialog.vue'
import StatusesDelete from './categories/statuses/SettingsCategoriesStatusesDialogDelete.vue'
import HomepagesTopbar from './categories/homepages/SettingsCategoriesHomepagesTopbar.vue'
import HomepagesMainTable from './categories/homepages/SettingsCategoriesHomepagesMainTable.vue'
import HomepagesCreate from './categories/homepages/SettingsCategoriesHomepagesDialogCreate.vue'
import HomepagesDelete from './categories/homepages/SettingsCategoriesHomepagesDialogDelete.vue'
import HomepagesEdit from './categories/homepages/SettingsCategoriesHomepagesDialogEdit.vue'

export default {
  name: 'SettingsWrapper',

  components: {
    DolphinIntegrationToken,
    // UserFieldsTopbar,
    // UserFieldsMainTable,
    // UserFieldsMainDialog,
    // UserFieldsDelete,
    StatusesTopbar,
    StatusesMainTable,
    StatusesMainDialog,
    StatusesDelete,
    HomepagesTopbar,
    HomepagesMainTable,
    HomepagesCreate,
    HomepagesDelete,
    HomepagesEdit
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      statusesDialogs: 'browserProfilesStatuses/dialogs',
      userFieldsDialogs: 'userFields/dialogs',
      settings: 'settings/settings',
      homepagesDialogs: 'settingsHomepages/dialogs'
    }),

    disableSaveButton () {
      for (const mainWebsite in this.settings.user.homepages) {
        const splittedLinks = this.settings.user.homepages[mainWebsite].split('\n')
        for (const i in splittedLinks) {
          if (i > 4) return true
        }
      }

      return false
    }
  },

  methods: {
    async saveSettings () {
      try {
        this.loading = true

        await this.$store.dispatch('settings/saveSettings')
        await this.$store.dispatch('settings/loadSettings')
          .then(() => {
            this.localApi.post('/settings', this.settings)
          })
      } catch (_) {
        // Do nothing
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
 <style>
  .anty-settings-save-settings-button {
    position: fixed;
    bottom: 3%;
    left: calc(50% + 28px);
    transform: translateX(-50%);
    z-index: 99;
  }
</style>
