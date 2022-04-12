<template>
  <v-row class="mt-1 main-dialog-media-files-row">
    <!-- МЕДИАФАЙЛЫ -->
    <v-col
      id="main-dialog-media-files"
      :cols="12"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.mediaDevices') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchMedia"
        v-model="browserProfile.mediaDevices.mode"
        mandatory
      >
        <v-btn
          v-for="mode in ['real', 'manual']"
          :id="`browserProfilesMainDialogSwitchMedia${capitalize(mode)}`"
          :key="`main-dialog-media-files-mode-${mode}`"
          :value="mode"
          x-small
          color="primary"
          outlined
        >
          {{ mode === 'real' ? $t(`browserProfiles.realMultiple`) : $t(`browserProfiles.${mode}`) }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <v-col
      v-if="browserProfile.mediaDevices.mode === 'manual'"
      :cols="12"
      class="py-0 d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.microphones') }}</span>
      <v-slider
        id="browserProfilesMainDialogMediaSliderAudioInputs"
        v-model="browserProfile.mediaDevices.audioInputs"
        class="align-center"
        hide-details
        :min="0"
        :max="3"
      >
        <template #append>
          <v-text-field
            id="browserProfilesMainDialogMediaInputAudioInputs"
            v-model="browserProfile.mediaDevices.audioInputs"
            class="mt-0 pt-0"
            type="number"
            style="width: 80px"
            outlined
            dense
            hide-details
            :min="0"
            :max="3"
          />
        </template>
      </v-slider>
    </v-col>
    <v-col
      v-if="browserProfile.mediaDevices.mode === 'manual'"
      :cols="12"
      class="py-0 d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.dynamics') }}</span>
      <v-slider
        id="browserProfilesMainDialogMediaSliderAudioOutputs"
        v-model="browserProfile.mediaDevices.audioOutputs"
        class="align-center"
        hide-details
        :min="0"
        :max="3"
      >
        <template #append>
          <v-text-field
            id="browserProfilesMainDialogMediaInputAudioOutputs"
            v-model="browserProfile.mediaDevices.audioOutputs"
            class="mt-0 pt-0"
            type="number"
            style="width: 80px"
            outlined
            dense
            hide-details
            :min="0"
            :max="3"
          />
        </template>
      </v-slider>
    </v-col>
    <v-col
      v-if="browserProfile.mediaDevices.mode === 'manual'"
      :cols="12"
      class="pt-0 d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.cameras') }}</span>
      <v-slider
        id="browserProfilesMainDialogMediaSliderVideoInputs"
        v-model="browserProfile.mediaDevices.videoInputs"
        class="align-center"
        hide-details
        :min="0"
        :max="3"
      >
        <template #append>
          <v-text-field
            id="browserProfilesMainDialogMediaInputVideoInputs"
            v-model="browserProfile.mediaDevices.videoInputs"
            class="mt-0 pt-0"
            type="number"
            style="width: 80px"
            outlined
            dense
            hide-details
            :min="0"
            :max="3"
          />
        </template>
      </v-slider>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMediaFiles',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  watch: {
    'browserProfile.mediaDevices.mode' (newVal) {
      if (newVal === 'real') {
        this.browserProfile.mediaDevices.audioInputs = null
        this.browserProfile.mediaDevices.videoInputs = null
        this.browserProfile.mediaDevices.audioOutputs = null
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
<style>
  .main-dialog-media-files-row .v-input__slot {
    min-height: 28px !important;
  }
  .main-dialog-media-files-row .v-text-field__slot input {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
