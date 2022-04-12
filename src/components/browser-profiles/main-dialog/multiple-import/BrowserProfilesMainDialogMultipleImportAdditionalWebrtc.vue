<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">WebRTC</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportWebrtcButtonToggle"
      v-model="browserProfile.webrtc.mode"
      mandatory
      @change="changeMode"
    >
      <v-btn
        v-for="mode in ['off', 'real', 'altered', 'manual']"
        :id="`browserProfilesMainDialogMultipleImportWebrtcButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-webrtc-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>

    <!-- ВРУЧНУЮ -->
    <v-text-field
      v-if="browserProfile.webrtc.mode === 'manual'"
      id="browserProfilesMainDialogMultipleImportWebrtcIpAddressTextField"
      v-model="browserProfile.webrtc.ipAddress"
      :label="$t('browserProfiles.ipAddress')"
      dense
      outlined
      :error="webrtcError"
      :hide-details="webrtcError ? false : true"
      :messages="webrtcError ? $t('browserProfiles.webrtcError') : ''"
      :spellcheck="false"
      class="mt-2"
    />
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalWebrtc',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    webrtcError () {
      return this.browserProfileTouched && this.validation.browserProfile.webrtc.ipAddress.$error
    }
  },

  methods: {
    changeMode (mode) {
      if (['off', 'real', 'altered'].includes(mode)) {
        this.browserProfile.webrtc.ipAddress = null
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
