<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">{{ $t('browserProfiles.webglInfo') }}</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportWebglInfoButtonToggle"
      v-model="browserProfile.webglInfo.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['real', 'manual', 'random']"
        :id="`browserProfilesMainDialogMultipleImportWebglInfoButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-webgl-info-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
        :disabled="browserProfile.webgl.mode === 'off'"
      >
        {{ $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>
    <v-row
      v-if="browserProfile.webglInfo.mode === 'manual'"
      class="mt-2"
    >
      <!-- ПРОИЗВОДИТЕЛЬ -->
      <v-col
        :cols="6"
        class="pt-0"
      >
        <v-text-field
          id="browserProfilesMainDialogMultipleImportWebglInfoVendorTextField"
          v-model="browserProfile.webglInfo.vendor"
          :label="$t('browserProfiles.vendor')"
          dense
          outlined
          :error="vendorError"
          :hide-details="vendorError ? false : true"
          :messages="vendorError ? $t('browserProfiles.errorAtLeast3Symbols') : ''"
          class="centralize-inner"
          :spellcheck="false"
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

      <!-- ВИДЕОКАРТА -->
      <v-col
        :cols="6"
        class="pt-0"
      >
        <v-text-field
          id="browserProfilesMainDialogMultipleImportWebglInfoRendererTextField"
          v-model="browserProfile.webglInfo.renderer"
          :label="$t('browserProfiles.renderer')"
          dense
          outlined
          :error="rendererError"
          :error-messages="rendererError ? $t('browserProfiles.errorAtLeast5Symbols') : ''"
          :hide-details="rendererError ? false : true"
          class="centralize-inner"
          :spellcheck="false"
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
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
// import axios from 'axios'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalWebglInfo',

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

    vendorError () {
      return this.browserProfileTouched && this.validation.browserProfile.webglInfo.vendor.$error
    },

    rendererError () {
      return this.browserProfileTouched && this.validation.browserProfile.webglInfo.renderer.$error
    }
  },

  watch: {
    'browserProfile.webglInfo.mode' (newVal, oldVal) {
      if (newVal === 'manual') {
        this.randomize()
      }

      if (oldVal === 'manual') {
        // if (this.cancelTokenSource) this.cancelTokenSource.cancel()
        // this.browserProfile.webglInfo.vendor = null
        // this.browserProfile.webglInfo.renderer = null
      }
    },

    'browserProfile.platform': {
      handler () {
        if (this.browserProfile?.webglInfo?.mode === 'manual') {
          this.randomize()
        }
      }
    }
  },

  methods: {
    randomize () {
      this.loading = true

      const browserVersion = 98

      this.api.get(`/fingerprints/webgl?platform=${this.browserProfile.platform}&browser_type=${this.browserProfile.browserType}&browser_version=${browserVersion}&type=webgl`)
        .then(response => {
          if (response.status === 200 && response.data !== null) {
            this.browserProfile.webglInfo.vendor = response.data.webgl_unmasked_vendor
            this.browserProfile.webglInfo.renderer = response.data.webgl_unmasked_renderer
          }
        })
        .catch((e) => {
          console.log(e)
          if (this.api.isCancel(e)) {
            this.randomize()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
