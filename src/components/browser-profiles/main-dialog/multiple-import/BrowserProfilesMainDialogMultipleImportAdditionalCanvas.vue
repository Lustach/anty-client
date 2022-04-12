<template>
  <v-col :cols="12">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">Canvas</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportCanvasButtonToggle"
      v-model="browserProfile.canvas.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['off', 'real', 'noise']"
        :id="`browserProfilesMainDialogMultipleImportCanvasButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-canvas-mode-${mode}`"
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
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalCanvas',

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  methods: {
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
