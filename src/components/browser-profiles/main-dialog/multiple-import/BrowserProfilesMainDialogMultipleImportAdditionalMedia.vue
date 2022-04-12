<template>
  <v-col :cols="8">
    <v-row class="main-dialog-media-files-row">
      <!-- РЕЖИМ -->
      <v-col
        :cols="6"
        class="d-flex align-center"
      >
        <span class="main-dialog-col-label">{{ $t('browserProfiles.mediaDevices') }}</span>
        <v-btn-toggle
          v-model="browserProfile.mediaDevices.mode"
          mandatory
        >
          <v-btn
            v-for="mode in ['real', 'manual', 'random']"
            :key="`main-dialog-multiple-import-media-mode-${mode}`"
            :value="mode"
            x-small
            color="primary"
            outlined
          >
            {{ mode === 'real' ? $t(`browserProfiles.realMultiple`) : $t(`browserProfiles.${mode}`) }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- МЕДИА -->
      <v-col
        v-if="browserProfile.mediaDevices.mode === 'manual'"
        :cols="12"
        class="py-0 d-flex align-center"
      >
        <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.microphones') }}</span>
        <v-slider
          v-model="browserProfile.mediaDevices.audioInputs"
          class="align-center"
          hide-details
          :min="0"
          :max="3"
        >
          <template #append>
            <v-text-field
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
          v-model="browserProfile.mediaDevices.audioOutputs"
          class="align-center"
          hide-details
          :min="0"
          :max="3"
        >
          <template #append>
            <v-text-field
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
          v-model="browserProfile.mediaDevices.videoInputs"
          class="align-center"
          hide-details
          :min="0"
          :max="3"
        >
          <template #append>
            <v-text-field
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
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalMedia',

  computed: {
    ...mapFields('browserProfilesMultipleImport', [
      'browserProfile',
      'browserProfileTouched'
    ])
  },

  watch: {
    'browserProfile.mediaDevices.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.mediaDevices.audioInputs = null
        this.browserProfile.mediaDevices.videoInputs = null
        this.browserProfile.mediaDevices.audioOutputs = null
      }
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
