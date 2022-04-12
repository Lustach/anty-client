<template>
  <v-col :cols="12">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">WebGL</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportWebglButtonToggle"
      v-model="browserProfile.webgl.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['off', 'real', 'noise']"
        :id="`browserProfilesMainDialogMultipleImportWebglButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-webgl-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalWebgl',

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  watch: {
    'browserProfile.webgl.mode': {
      handler (newVal) {
        if (newVal === 'off') {
          this.browserProfile.webglInfo.mode = 'real'
        }
      }
    }
  },

  methods: {
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
