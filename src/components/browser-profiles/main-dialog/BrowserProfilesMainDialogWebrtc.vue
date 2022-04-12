<template>
  <v-row class="mt-1 align-center">
    <!-- WebRTC -->
    <v-col
      id="main-dialog-webrtc"
      :cols="12"
    >
      <span
        class="mr-2 main-dialog-col-label"
      >WebRTC</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchWebrtc"
        v-model="browserProfile.webrtc.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchWebrtcButtonOff"
          value="off"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.off') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebrtcButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebrtcButtonAltered"
          value="altered"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.altered') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebrtcButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- ВРУЧНУЮ -->
    <v-col
      v-if="browserProfile.webrtc.mode === 'manual'"
      :cols="12"
      class="pt-0"
    >
      <v-text-field
        id="browserProfilesMainDialogSwitchWebrtcTextfield"
        v-model="browserProfile.webrtc.ipAddress"
        :label="$t('browserProfiles.ipAddress')"
        dense
        outlined
        :error="validation.touched && validation.error"
        :hide-details="validation.touched && validation.error ? false : true"
        :messages="validation.touched && validation.error ? $t('browserProfiles.webrtcError') : ''"
        :spellcheck="false"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogWebrtc',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        error: false
      })
    }
  },

  watch: {
    'browserProfile.webrtc.mode': {
      handler (newVal) {
        if (newVal !== 'manual' && this.browserProfile.webrtc.ipAddress !== null) {
          this.browserProfile.webrtc.ipAddress = null
        }
      }
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  }
}
</script>
