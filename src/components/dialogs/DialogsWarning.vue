<template>
  <v-dialog
    v-if="dialogs.warning"
    id="DialogWarning"
    :value="dialogs.warning"
    width="600"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'warning')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'warning')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        style="background: #FF9800"
        class="mb-5"
      >
        <v-toolbar-title style="">
          {{ warning.title !== '' && typeof warning.title !== 'undefined' ? warning.title : $t('common.warning') + '!' }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('main/closeDialog', 'warning')"
          >
            <v-icon>
              fas fa-times
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <div
          v-if="warning.body && warning.body !== ''"
          v-html="warning.body"
        />
        <v-checkbox
          id="DialogWarningCheckboxOk"
          v-model="createProfile"
          :label="browserProfile.forEdit ? $t('dialogs.warning.updateProfile') : $t('dialogs.warning.createProfile')"
          hide-details
          @change="saveCreateCheckbox"
        />
        <v-checkbox
          v-model="warning.doNotShowWarning"
          :label="$t('dialogs.warning.doNotShowWarning')"
          hide-details
          @change="saveDoNotShowCheckbox"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('main/closeDialog', 'warning')"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          id="DialogWarningButtonOk"
          color="primary"
          text
          :disabled="!createProfile"
          @click="create"
        >
          {{ browserProfile.forEdit ? $t('common.updateProfile') : $t('common.createProfile') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'DialogsWarning',

  data () {
    return {
      createProfile: false
    }
  },

  computed: {
    ...mapFields('main', ['warning']),
    ...mapGetters({
      browserProfile: 'browserProfiles/browserProfile',
      dialogs: 'main/dialogs'
    })
  },

  watch: {
    'dialogs.warning': {
      handler (newVal) {
        if (newVal) {
          if (localStorage.getItem('browserProfilesShowWarningCheckbox')) {
            this.warning.doNotShowWarning = localStorage.getItem('browserProfilesShowWarningCheckbox') === 'true'
          }
          if (localStorage.getItem('browserProfilesWarningCreateAnywayCheckbox')) {
            this.createProfile = localStorage.getItem('browserProfilesWarningCreateAnywayCheckbox') === 'true'
            return
          }
        }
        this.createProfile = false
      }
    }
  },

  methods: {
    async create () {
      if (this.warning.doNotShowWarning) {
        localStorage.setItem('browserProfilesShowWarning', true)
      }
      this.warning.createProfile = await true
      await this.$store.dispatch('main/closeDialog', 'warning')
    },

    saveCreateCheckbox (value) {
      localStorage.setItem('browserProfilesWarningCreateAnywayCheckbox', value)
    },

    saveDoNotShowCheckbox (value) {
      localStorage.setItem('browserProfilesShowWarningCheckbox', value)
    }
  }
}
</script>
