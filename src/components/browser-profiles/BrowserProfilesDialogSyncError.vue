<template>
  <v-dialog
    v-model="dialogs.syncErrors"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
  >
    <v-card>
      <v-card-title>
        {{ $t('dialogs.syncError') + ` ${name}` }}
      </v-card-title>

      <v-card-text>
        <v-alert
          color="orange"
          text
        >
          <v-row class="align-center">
            <v-col
              :cols="11"
            >
              {{ $t('dialogs.copyErrorText') }}
            </v-col>
            <v-col
              :cols="1"
              class="py-0"
            >
              <v-tooltip
                top
              >
                <template #activator="{ on }">
                  <v-btn
                    icon
                    x-small
                    v-on="on"
                    @click="copy(error)"
                  >
                    <v-icon
                      color="primary"
                      :size="12"
                    >
                      far fa-copy
                    </v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('common.copy') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-alert>

        <code>{{ error }}</code>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="repeat"
        >
          {{ $t('dialogs.repeat') }}
        </v-btn>
        <v-btn
          color="grey"
          text
          @click="$store.dispatch('browserProfiles/closeDialog', 'syncErrors')"
        >
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesDialogSyncError',

  data () {
    return {
      error: '',
      name: ''
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfiles: 'browserProfiles/browserProfiles',
      browserProfileSyncError: 'browserProfiles/browserProfileSyncError'
    })
  },

  created () {
    for (const item of this.browserProfiles.syncErrors) {
      if (item.id === this.browserProfileSyncError) {
        if (item.error && item.error.toLowerCase().includes('upload denied')) {
          this.error = this.$t('errors.uploadDenied')
        } else {
          this.error = item.error
        }
      }
    }

    for (const item of this.browserProfiles.all) {
      if (item.id === this.browserProfileSyncError) {
        this.name = item.name
      }
    }
  },

  methods: {
    copy (value) {
      navigator.clipboard.writeText(value)
      this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.copied') })
    },

    repeat () {
      this.localApi.post(`/sync/${this.browserProfileSyncError}`)
      this.$store.dispatch('browserProfiles/closeDialog', 'syncErrors')
    }
  }
}
</script>
