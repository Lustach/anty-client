<template>
  <v-dialog
    :value="dialogs.parallelStartWarning"
    width="800"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'parallelStartWarning')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'parallelStartWarning')"
  >
    <v-card>
      <v-card-text class="pt-5">
        <v-alert
          type="warning"
          dense
          text
          class="mb-0 mt-2"
        >
          {{ $t('browserProfiles.parallelStartWarning') }}
        </v-alert>

        <v-checkbox
          v-model="doNotShowWarning"
          :label="$t('dialogs.warning.doNotShowWarning')"
          hide-details
          @change="handleWarningChange"
        />
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'parallelStartWarning')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          @click="startBrowserProfile"
        >
          {{ $t('common.start') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import browserProfileActions from '@/mixins/browserProfileActions.js'
import amplitude from '@/mixins/amplitude.js'

export default {
  name: 'BrowserProfilesActionsDialogParallelStartWarning',

  mixins: [
    amplitude,
    browserProfileActions
  ],

  data () {
    return {
      doNotShowWarning: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfile: 'browserProfiles/browserProfile'
    })
  },

  methods: {
    startBrowserProfile () {
      this.browserProfileActionsStart(this.browserProfile)
      this.amplitudeSendProfileStart(this.browserProfile)
      this.$store.dispatch('browserProfiles/closeDialog', 'parallelStartWarning')
    },

    handleWarningChange (val) {
      localStorage.setItem('browserProfilesDoNotShowParallelStartWarning', val)
    }
  }
}
</script>
