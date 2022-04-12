<template>
  <v-system-bar style="color: #9E9E9E; z-index: 2; position: fixed; bottom: 0; width: 100%; height: 16px; font-size: 11px; padding-left: 64px; padding-bottom: 4px;">
    <v-spacer />
    <info-bar-subscription v-if="!$_.isEmpty(subscription)" />

    <v-divider
      v-if="!$_.isEmpty(subscription)"
      vertical
      class="mx-2"
    />

    <info-bar-health />

    <v-divider
      vertical
      class="mx-2"
    />

    <span
      id="infoBarDebug"
      class="anty-main-table-link"
      :class="{'anty-adsmanager-main-table-link-disabled': disableUi}"
      @click="openExternalLink(`https://dolphin-anty.site24x7signals.eu/`)"
    >{{ $t('common.status').toLowerCase() }}</span>

    <v-divider
      vertical
      class="mx-2"
    />

    <span
      id="infoBarBasket"
      class="anty-main-table-link"
      @click="$store.dispatch('browserProfiles/openDialog', 'basket')"
    >{{ $t('common.basket') }}</span>
    <dialog-basket v-if="dialogs.basket" />
    <v-divider
      vertical
      class="mx-2"
    />

    <span id="infoBarAppVersion">
      {{ $t('common.version').toLowerCase() }} {{ appVersion }}
    </span>

    <v-divider
      vertical
      class="mx-2"
    />

    <span id="infoBarProfileUsername">
      {{ profile.username }}
    </span>

    <!-- <v-divider
      vertical
      class="mx-2"
    />

    <span
      id="infoBarLogOut"
      class="anty-main-table-link"
      @click="logOut"
    >
      {{ $t('sidebar.logOut').toLowerCase() }}
    </span> -->
  </v-system-bar>
</template>
<script>
import InfoBarHealth from '@/components/infoBar/InfoBarHealth.vue'
import InfoBarSubscription from '@/components/infoBar/InfoBarSubscription.vue'
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'
import DialogBasket from './browser-profiles/BrowserProfilesActionsDialogBasket'
export default {
  name: 'InfoBar',

  components: {
    InfoBarHealth,
    InfoBarSubscription,
    DialogBasket
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'browserProfiles/dialogs',
      subscription: 'main/subscription',
      appVersion: 'main/appVersion',
      disableUi: 'main/disableUi'
    })
  },

  created () {
    const _this = this
    setInterval(() => {
      _this.$store.dispatch('main/getSubscription')
    }, 60000)
  },

  methods: {
    openExternalLink (url) {
      this.localApi.post('/open-external-link', { url })
    },

    async debug () {
      try {
        const response = await this.localApi.get('/settings/debug_log')

        if (response.status === 200 && response.data && response.data.result) {
          const blob = new Blob([response.data.result], {
            type: 'text/plain;charset=utf-8'
          })
          saveAs(blob, 'debug.log')
        } else if (response.status === 200 && response.data && response.data.result === '') {
          const blob = new Blob([], {
            type: 'text/plain;charset=utf-8'
          })
          saveAs(blob, 'debug.log')
        }
      } catch (err) {
        console.log(err)
      }
    },

    logOut () {
      this.$store.dispatch('main/openDialog', 'logoutConfirmation')
    }
  }
}
</script>
