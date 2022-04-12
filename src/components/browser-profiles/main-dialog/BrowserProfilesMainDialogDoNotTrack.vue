<template>
  <v-row class="mt-1 align-center">
    <!-- DO NOT TRACK -->
    <v-col
      :cols="12"
      class="d-flex align-center mb-1"
    >
      <span class="mr-2 main-dialog-col-label">Do not track</span>
      <v-switch
        id="browserProfilesMainDialogCheckboxDoNotTrack"
        v-model="browserProfile.doNotTrack"
        dense
        hide-details
        class="mt-0"
        style="padding-top: 2px !important; padding-bottom: 2px !important;"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogDoNotTrack',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  }
}
</script>
