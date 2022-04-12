<template>
  <v-dialog
    :value="dialogs.extensionSync"
    width="600"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'extensionSync')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'extensionSync')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="info"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('browserProfiles.extensionSync') }}
        </v-toolbar-title>
        <v-spacer />
        <v-spacer />
      </v-toolbar>
      <v-card-text
        class="pt-5"
      >
        <div v-html="$t('browserProfiles.extensionSyncText')" />
        <!-- КНОПКИ ДИАЛОГА -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="grey"
            @click="$store.dispatch('browserProfiles/closeDialog', 'extensionSync')"
          >
            {{ $t('common.cancel') }}
          </v-btn>

          <v-btn
            id="browserProfilesActionsDialogDeleteConfirmButton"
            color="error"
            text
            :loading="loading"
            @click="extensionSyncProfile"
          >
            {{ $t('browserProfiles.extensionSyncButton') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
export default {
  name: 'BrowserProfilesActionsDialogExtensionSync',

  components: {

  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      dialogs: 'browserProfiles/dialogs'
    }),
    ...mapFields('browserProfiles', ['forDialogs'])
  },

  methods: {
    async extensionSyncProfile () {
      this.loading = true
      try {
        await this.api.patch(`/browser_profiles/${this.forDialogs.browserProfileId}/set-extensions-new-naming`)

        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('browserProfiles/closeDialog', 'extensionSync')
        this.$store.dispatch('main/alert', {
          color: 'success',
          message: this.$t('dialogs.addBrowserProfile.successfulConnection')
        }, {
          root: true
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }

      // this.$store.dispatch('browserProfiles/extensionSyncProfile', this.forDialogs.browserProfileId)
    }
  }
}
</script>
