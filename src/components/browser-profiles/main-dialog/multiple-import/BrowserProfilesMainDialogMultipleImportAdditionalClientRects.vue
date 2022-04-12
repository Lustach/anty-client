<template>
  <v-col :cols="12">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">Client Rects</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportClientRectsButtonToggle"
      v-model="browserProfile.clientRect.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['real', 'noise']"
        :id="`browserProfilesMainDialogMultipleImportClientRectsButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-client-rects-mode-${mode}`"
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
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalClientRects',

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
