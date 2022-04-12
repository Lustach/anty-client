<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">{{ $t('browserProfiles.geolocation') }}</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportGeolocationButtonToggle"
      v-model="browserProfile.geolocation.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['manual', 'auto']"
        :id="`browserProfilesMainDialogMultipleImportGeolocationButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-geolocation-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ mode === 'real' ? $t('browserProfiles.realGeo') : $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>

    <v-row
      v-if="browserProfile.geolocation.mode === 'manual'"
      class="mt-2"
    >
      <!-- ШИРОТА -->
      <v-col
        :cols="4"
        class="pt-0"
      >
        <v-text-field
          id="browserProfilesMainDialogMultipleImportGeolocationLatitudeTextField"
          :value="browserProfile.geolocation.latitude"
          :label="$t('browserProfiles.latitude')"
          dense
          outlined
          :error="latitudeError"
          :error-messages="latitudeError ? $t('browserProfiles.latitudeError') : ''"
          :hide-details="latitudeError ? false : true"
          type="number"
          @input="setLatitude"
        />
      </v-col>

      <!-- ДОЛГОТА -->
      <v-col
        :cols="4"
        class="pt-0"
      >
        <v-text-field
          id="browserProfilesMainDialogMultipleImportGeolocationLongitudeTextField"
          :value="browserProfile.geolocation.longitude"
          :label="$t('browserProfiles.longitude')"
          dense
          outlined
          :error="longitudeError"
          :error-messages="longitudeError ? $t('browserProfiles.longitudeError') : ''"
          :hide-details="longitudeError ? false : true"
          type="number"
          @input="setLongitude"
        />
      </v-col>

      <!-- ТОЧНОСТЬ -->
      <v-col
        :cols="4"
        class="pt-0"
      >
        <v-text-field
          id="browserProfilesMainDialogMultipleImportGeolocationAccuracyTextField"
          :value="browserProfile.geolocation.accuracy"
          :label="$t('browserProfiles.accuracy')"
          dense
          outlined
          :error="accuracyError"
          :error-messages="accuracyError ? $t('browserProfiles.accuracyError') : ''"
          :hide-details="accuracyError ? false : true"
          type="number"
          @input="setAccuracy"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalGeolocation',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    latitudeError () {
      return this.browserProfileTouched && this.validation.browserProfile.geolocation.latitude.$error
    },

    longitudeError () {
      return this.browserProfileTouched && this.validation.browserProfile.geolocation.longitude.$error
    },

    accuracyError () {
      return this.browserProfileTouched && this.validation.browserProfile.geolocation.accuracy.$error
    }
  },

  watch: {
    'browserProfile.geolocation.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.geolocation.latitude = null
        this.browserProfile.geolocation.longitude = null
      }
    }
  },

  methods: {
    setLatitude (latitude) {
      if (parseFloat(latitude)) {
        this.browserProfile.geolocation.latitude = parseFloat(latitude)
      } else {
        this.browserProfile.geolocation.latitude = null
      }
    },

    setLongitude (longitude) {
      if (parseFloat(longitude)) {
        this.browserProfile.geolocation.longitude = parseFloat(longitude)
      } else {
        this.browserProfile.geolocation.longitude = null
      }
    },

    setAccuracy (accuracy) {
      if (parseFloat(accuracy)) {
        this.browserProfile.geolocation.accuracy = parseFloat(accuracy)
      } else {
        this.browserProfile.geolocation.accuracy = null
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
