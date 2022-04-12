<template>
  <v-col
    :cols="12"
    class="mb-2"
  >
    <span class="main-dialog-col-label">Do not track</span>
    <v-switch
      id="browserProfilesMainDialogMultipleImportDoNotTrack"
      v-model="browserProfile.doNotTrack"
      dense
      hide-details
      class="mt-0 pt-0"
      style="display: inline-block;"
    />
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalDoNotTrack',

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  }
}
</script>
