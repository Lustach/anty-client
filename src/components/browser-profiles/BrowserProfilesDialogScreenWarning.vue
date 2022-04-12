<template>
  <v-dialog
    :value="dialogs.screenWarning"
    width="600"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'screenWarning')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'screenWarning')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        style="background: #FF9800"
        class="mb-5"
      >
        <v-toolbar-title>
          {{ $t('common.warning') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'screenWarning')"
          >
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-alert
          text
          type="warning"
        >
          {{ $t('browserProfiles.screenWarning') }}
        </v-alert>

        <v-checkbox
          v-model="startAnyway"
          :label="$t('browserProfiles.startAnyway')"
          hide-details
        />
        <v-checkbox
          v-model="doNotShowWarning"
          :label="$t('dialogs.warning.doNotShowWarning')"
          hide-details
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'screenWarning')"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          :disabled="!startAnyway"
          @click="start"
        >
          {{ $t('common.start') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import amplitude from '@/mixins/amplitude.js'
import browserProfileActions from '@/mixins/browserProfileActions.js'

export default {
  name: 'BrowserProfilesDialogScreenWarning',

  mixins: [
    amplitude,
    browserProfileActions
  ],

  data () {
    return {
      startAnyway: false,
      doNotShowWarning: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfile: 'browserProfiles/browserProfile',
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'browserProfiles/dialogs',
      forDialogs: 'browserProfiles/forDialogs'
    })
  },

  watch: {
    doNotShowWarning (newVal) {
      if (newVal) {
        localStorage.setItem('browserProfilesDisableScreenWarning', true)
      } else {
        localStorage.removeItem('browserProfilesDisableScreenWarning')
      }
    }
  },

  methods: {
    start () {
      if (this.forDialogs.multiple) {
        this.startBrowserProfiles()
      } else {
        this.startBrowserProfile()
      }
      this.$store.dispatch('browserProfiles/closeDialog', 'screenWarning')
    },

    async startBrowserProfile () {
      this.browserProfileActionsStart(this.browserProfile)
      this.amplitudeSendProfileStart(this.browserProfile)
    },

    startBrowserProfiles () {
      for (const profile of this.browserProfiles.selected) {
        this.$store.dispatch('browserProfiles/addLoading', profile.id)
        this.checkBeforeStartBrowserProfiles(profile)
      }
    },

    async checkBeforeStartBrowserProfiles (profile) {
      if (!this.browserProfiles.running.includes(profile.id)) {
        this.browserProfileActionsStart(profile, false)
        this.amplitudeSendProfileStart(profile)
      }
    }
  }
}
</script>
