<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">Useragent</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportUseragentButtonToggle"
      v-model="browserProfile.useragent.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['manual', 'fromFile', 'random']"
        :id="`browserProfilesMainDialogMultipleImportUseragentButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-useragent-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ mode === "fromFile" ? $t('common.getFromFile') : $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>

    <!-- USERAGENT -->
    <v-text-field
      v-if="browserProfile.useragent.mode === 'manual'"
      id="browserProfilesMainDialogMultipleImportUseragentValueTextarea"
      v-model="browserProfile.useragent.value"
      label="Useragent"
      dense
      outlined
      :error="useragentError"
      :error-messages="useragentError ? $t('browserProfiles.useragentError') : ''"
      :hide-details="useragentError ? false : true"
      :spellcheck="false"
      class="centralize-inner mt-2"
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
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import axios from 'axios'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalUseragent',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      cancelTokenSource: null
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    useragentError () {
      return this.browserProfileTouched && this.validation.browserProfile.useragent.value.$error
    }
  },

  watch: {
    'browserProfile.useragent.mode' (newVal, oldVal) {
      if (newVal === 'manual') {
        this.randomize()
      }

      if (oldVal === 'manual') {
        if (this.cancelTokenSource) this.cancelTokenSource.cancel()
        this.browserProfile.useragent.value = null
      }
    },

    'browserProfile.platform': {
      handler () {
        if (this.browserProfile.useragent.mode === 'manual') {
          this.randomize()
        }
      }
    }
  },

  methods: {
    async randomize () {
      try {
        this.loading = true
        this.cancelTokenSource = axios.CancelToken.source()
        const browserVersion = 98

        let url = `/fingerprints/useragent?browser_type=anty&browser_version=${browserVersion}&platform=${this.browserProfile.platform}`
        if (this.browserProfile.useragent.value) {
          url += `&oldUseragent=${this.browserProfile.useragent.value}`
        }
        const response = await this.api.get(url, {
          cancelToken: this.cancelTokenSource.token
        })
        if (response.status === 200 && response.data !== null) {
          this.browserProfile.useragent.value = response.data.data
        }
      } catch (err) {
        this.cancelTokenSource = null
        console.log(err)
      } finally {
        this.cancelTokenSource = null
        this.loading = false
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
