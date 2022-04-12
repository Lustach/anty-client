<template>
  <v-row class="mt-1">
    <!-- Canvas -->
    <v-col
      id="main-dialog-canvas"
      :cols="12"
    >
      <span class="mr-2 main-dialog-col-label">Canvas</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchCanvas"
        v-model="browserProfile.canvas.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchCanvasButtonOff"
          value="off"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.off') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchCanvasButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchCanvasButtonNoise"
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
  name: 'BrowserProfilesMainDialogCanvas',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  }
}
</script>
