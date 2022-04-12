<template>
  <v-row class="mt-1">
    <!-- РЕЖИМ -->
    <!-- <v-col
      :cols="6"
      class="d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">Useragent</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchUseragent"
        v-model="browserProfile.useragent.mode"
        mandatory
        @change="changeMode"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchUseragentButtonAuto"
          value="auto"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.auto') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchUseragentButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col> -->

    <!-- USERAGENT -->
    <v-col
      v-show="browserProfile.useragent.mode === 'manual'"
      id="main-dialog-useragent"
      :cols="12"
      class="d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">Useragent</span>
      <v-text-field
        id="browserProfilesMainDialogFieldUseragentTextfield"
        v-model="browserProfile.useragent.value"
        label="Useragent"
        dense
        outlined
        :error="validation.touched && validation.error"
        :error-messages="validation.touched && validation.error ? $t('browserProfiles.useragentError') : ''"
        :hide-details="validation.touched && validation.error ? false : true"
        :spellcheck="false"
        class="centralize-inner"
        @input="clearUseragent"
      >
        <template #prepend-inner>
          <v-btn
            x-small
            icon
            :loading="loading"
            :disabled="loading"
            @click="randomize"
          >
            <v-icon :size="16">
              mdi-autorenew
            </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogUseragent',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        error: false
      })
    }
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  methods: {
    async randomize () {
      try {
        this.loading = true
        const browserVersion = 98

        let url = `/fingerprints/useragent?browser_type=anty&browser_version=${browserVersion}&platform=${this.browserProfile.platform}`
        if (this.browserProfile.useragent.value) {
          url += `&oldUseragent=${this.browserProfile.useragent.value}`
        }

        const response = await this.api.get(url)
        if (response.status === 200 && response.data !== null) {
          this.browserProfile.useragent.value = response.data.data
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    clearUseragent (value) {
      if (value === '') {
        this.$store.dispatch('browserProfiles/clearUseragent')
      }
    },

    changeMode (mode) {
      if (mode === 'auto') {
        this.$store.dispatch('browserProfiles/clearUseragent')
      }
    }
  }
}
</script>
