<template>
  <v-menu
    open-on-hover
    bottom
    offset-y
    :transition="false"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        id="browserProfilesMainTableProfileActions"
        :size="18"
        v-on="on"
      >
        mdi-dots-vertical
      </v-icon>
    </template>

    <v-list>
      <!-- ИКОНКА РЕДАКТИРОВАНИЯ -->
      <v-list-item
        id="browserProfilesMainTableBrowserProfileEditButton"
        :disabled="(browserProfile.access && !browserProfile.access.update) || disableUi"
        @click="editBrowserProfile"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="create-outline"
            size="small"
            style="margin-top: -1px;"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
      </v-list-item>

      <!-- ИКОНКА ПОШАРКИ -->
      <v-list-item
        v-if="browserProfile.access && browserProfile.access.share"
        id="browserProfilesMainTableBrowserProfilePermissionsShowButton"
        :disabled="disableUi"
        @click="showBrowserProfilePermissions"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="share-social-outline"
            size="small"
            style="margin-top: -1px;"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('common.permissionsShow') }}</v-list-item-title>
      </v-list-item>

      <!-- ИКОНКА ИСТОРИИ -->
      <!-- <v-list-item @click="openLog">
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="pulse-outline"
            size="small"
            style="margin-top: -1px;"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('common.profileHistory') }}</v-list-item-title>
      </v-list-item> -->

      <!-- ИМПОРТИРОВАТЬ КУКИСЫ -->
      <v-list-item
        :disabled="(browserProfile.access && !browserProfile.access.update) || disableUi"
        @click="importCookies"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <v-icon
            :size="16"
            :disabled="(browserProfile.access && !browserProfile.access.update) || disableUi"
          >
            fas fa-cookie-bite
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.importCookies') }}</v-list-item-title>
      </v-list-item>

      <!-- ЭКСПОРТИРОВАТЬ КУКИСЫ -->
      <v-list-item
        :disabled="disableUi"
        @click="exportCookies"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <v-icon
            :size="16"
            :disabled="disableUi"
          >
            fas fa-cookie-bite
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.exportCookies') }}</v-list-item-title>
      </v-list-item>

      <!--АВТОМАТИЗАЦИЯ-->
      <v-list-item
        v-if="browserProfile.mainWebsite === 'google'"
        :disabled="disableUi"
        @click="automation"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <v-icon
            :size="16"
            :disabled="disableUi"
          >
            fas fa-lock-open
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.automation') }}</v-list-item-title>
      </v-list-item>

      <!-- COOKIE ROBOT -->
      <v-list-item
        id="browserProfilesMainTableCookieRobotButton"
        :disabled="disableUi"
        @click="cookieRobot"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <v-icon
            :size="20"
            :disabled="disableUi"
          >
            mdi-cookie-cog
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.cookieRobot') }}</v-list-item-title>
      </v-list-item>

      <!-- КОПИРОВАТЬ ПРОФИЛЬ -->
      <v-list-item
        id="browserProfilesMainTableBrowserProfileCopyProfile"
        :disabled="disableUi || disableCopyProfileButton"
        @click="copyProfile"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="duplicate-outline"
            size="small"
            style="margin-top: -1px;"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('common.copyProfile') }}</v-list-item-title>
      </v-list-item>

      <!-- ПРИНУДИТЕЛЬНЫЙ СТОП -->

      <v-list-item
        v-if="browserProfiles.teamProfileRunning.findIndex(i => i.id === parseInt(browserProfile.id, 10)) > -1"
        :disabled="disableUi || disableForceStop"
        @click="forceStop"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="stop-circle-outline"
            size="small"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.forceStop') }}</v-list-item-title>
      </v-list-item>
      <!-- СИНХРОНИЗАЦИЯ РАСШИРЕНИЙ -->
      <v-list-item
        v-if="!browserProfile.extensionsNewNaming"
        :disabled="disableUi"
        @click="extensionSync"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="stop-circle-outline"
            size="small"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('browserProfiles.extensionSync') }}</v-list-item-title>
      </v-list-item>

      <!-- ОТКРЕПИТЬ -->
      <v-list-item
        v-if="browserProfile.pinned"
        :disabled="disableUi"
        @click="unpinFromTop"
      >
        <v-list-item-icon id="browserProfilesMainTableProfileActionsUnpinToTop" />
        <v-list-item-title>{{ $t('browserProfiles.unpinFromTop') }}</v-list-item-title>
      </v-list-item>

      <!-- ЗАКРЕПИТЬ ВВЕРХУ -->
      <v-list-item
        v-else
        :disabled="disableUi || profile.pinnedBrowserProfilesCount >= 10"
        @click="pinToTop"
      >
        <v-list-item-icon
          id="browserProfilesMainTableProfileActionsPinToTop"
          :style="{ opacity: (disableUi || profile.pinnedBrowserProfilesCount >= 10) ? 0.38 : 1 }"
        />
        <v-list-item-title>{{ $t('browserProfiles.pinToTop') }}</v-list-item-title>
      </v-list-item>

      <!-- УДАЛИТЬ -->
      <v-list-item
        :disabled="browserProfile.access && !browserProfile.access.delete"
        @click="deleteBrowserProfile"
      >
        <v-list-item-icon style="align-self: center; margin: 0 !important;">
          <ion-icon
            name="trash-outline"
            size="small"
            style="margin-top: -1px;"
          />
        </v-list-item-icon>
        <v-list-item-title>{{ $t('common.delete') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { saveAs } from 'file-saver'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableNameActions',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      disableForceStop: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      disableUi: 'main/disableUi',
      subscription: 'main/subscription',
      profile: 'main/profile'
    }),
    ...mapFields('browserProfiles', ['forDialogs']),

    disableCopyProfileButton () {
      const count = this.subscription.browserProfiles?.count
      const limit = this.subscription.browserProfiles?.limit

      if (count !== undefined && limit !== undefined) {
        return count >= limit
      }

      return false
    }
  },

  methods: {
    async editBrowserProfile () {
      await this.$store.dispatch('browserProfiles/setBrowserProfileForEdit', this.$_.cloneDeep(this.browserProfile))
      await this.$store.dispatch('browserProfiles/openDialog', 'mainDialog')
    },

    async showBrowserProfilePermissions () {
      await this.$store.dispatch('browserProfiles/setBrowserProfile', this.browserProfile)
      this.$store.dispatch('browserProfiles/openDialog', 'shareInfo')
    },

    async deleteBrowserProfile () {
      this.forDialogs.singleDelete = true
      this.forDialogs.browserProfileId = this.browserProfile.id
      await this.$store.dispatch('browserProfiles/openDialog', 'delete')
    },

    // async openLog () {
    //   await this.$store.dispatch('browserProfiles/setBrowserProfileForEdit', this.$_.cloneDeep(this.browserProfile))
    //   this.$store.dispatch('browserProfiles/openDialog', 'activityLog')
    // },

    async importCookies () {
      await this.$store.dispatch('browserProfiles/setBrowserProfileForEdit', this.$_.cloneDeep(this.browserProfile))
      this.$store.dispatch('browserProfiles/openDialog', 'importCookies')
    },

    async exportCookies () {
      try {
        const response = await this.syncApi.get(`/?actionType=getCookies&browserProfileId=${this.browserProfile.id}`)
        if (response.status === 200 && response.data && response.data.data) {
          const blob = new Blob([JSON.stringify(response.data.data)], {
            type: 'text/plain;charset=utf-8'
          })
          saveAs(blob, `dolphin-anty-cookies-${this.browserProfile.name}.txt`)
        }
      } catch (err) {
        console.log(err)
      }
    },

    automation () {
      this.forDialogs.browserProfileId = this.browserProfile.id
      this.forDialogs.browserProfileName = this.browserProfile.name
      if (this.profile.sawAutomationOnboarding) {
        this.$store.dispatch('browserProfiles/openDialog', 'automation')
      } else {
        this.$store.dispatch('browserProfiles/openDialog', 'automationOnboarding')
      }
    },

    async cookieRobot () {
      await this.$store.dispatch('browserProfiles/setBrowserProfileForCookieRobot', this.$_.cloneDeep(this.browserProfile))
      this.$store.dispatch('browserProfiles/openDialog', 'enterCookieRobot')
    },

    async copyProfile () {
      await this.$store.dispatch('browserProfiles/setFullBrowserProfile', this.$_.cloneDeep(this.browserProfile))
      await this.$store.dispatch('browserProfiles/openDialog', 'copyProfile')
    },

    async forceStop () {
      this.$socket.emit('forceStopRequest', this.browserProfile.id)
      this.disableForceStop = true
      setTimeout(() => {
        this.disableForceStop = false
      }, 10000)
    },

    async extensionSync () {
      this.forDialogs.browserProfileId = this.browserProfile.id
      await this.$store.dispatch('browserProfiles/openDialog', 'extensionSync')
    },

    async pinToTop () {
      const response = await this.api(`/browser_profiles/${this.browserProfile.id}/pin`)
      if (response.status === 200) {
        this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.success') })
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('main/loadProfile')
      }
    },
    async unpinFromTop () {
      const response = await this.api(`/browser_profiles/${this.browserProfile.id}/unpin`)
      if (response.status === 200) {
        this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.success') })
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('main/loadProfile')
      }
    }
  }
}
</script>

<style>
.theme--light #browserProfilesMainTableProfileActionsPinToTop {
  background-image: url('~@/assets/black-pin.png');
}
.theme--dark #browserProfilesMainTableProfileActionsPinToTop {
  background-image: url('~@/assets/white-pin.png');
}
.theme--light #browserProfilesMainTableProfileActionsUnpinToTop {
  background-image: url('~@/assets/black-unpin.png');
}
.theme--dark #browserProfilesMainTableProfileActionsUnpinToTop {
  background-image: url('~@/assets/white-unpin.png');
}
#browserProfilesMainTableProfileActionsUnpinToTop,
#browserProfilesMainTableProfileActionsPinToTop {
  display: block;
  width: 18px;
  height: 18px;
  background-size: contain;
  margin: auto 0 !important;
}
</style>
