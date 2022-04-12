<template>
  <v-row class="mt-1">
    <!-- ClientRects -->
    <v-col
      id="main-dialog-client-rects"
      :cols="12"
    >
      <span class="mr-2 main-dialog-col-label">Client Rects</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchClientRects"
        v-model="browserProfile.clientRect.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchClientRectsButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchClientRectsButtonNoise"
          value="noise"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.noise') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogClientRects',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  }
}
</script>
