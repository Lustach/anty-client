<template>
  <v-row class="mt-1 align-center">
    <!-- ГЕОЛОКАЦИЯ -->
    <v-col :cols="12">
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.geolocation') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchGeolocation"
        v-model="browserProfile.geolocation.mode"
        mandatory
        @change="changeGeolocation"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchGeolocationButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchGeolocationButtonAuto"
          value="auto"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.auto') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- ВРУЧНУЮ -->
    <!-- ШИРОТА -->
    <v-col
      v-if="browserProfile.geolocation.mode === 'manual'"
      :cols="4"
      class="pt-0"
    >
      <v-text-field
        id="browserProfilesMainDialogSwitchGeolocationTextFieldLatitude"
        :value="browserProfile.geolocation.latitude"
        :label="$t('browserProfiles.latitude')"
        dense
        outlined
        :error="validation.touched && (!validation.latitudeRequired || !validation.latitudeBetween)"
        :error-messages="validation.touched && (!validation.latitudeRequired || !validation.latitudeBetween) ? $t('browserProfiles.latitudeError') : ''"
        :hide-details="!error"
        class="mb-2"
        type="number"
        @input="setValue('latitude', $event)"
      />
    </v-col>

    <!-- ДОЛГОТА -->
    <v-col
      v-if="browserProfile.geolocation.mode === 'manual'"
      :cols="4"
      class="pt-0"
    >
      <v-text-field
        id="browserProfilesMainDialogSwitchGeolocationTextFieldLongitude"
        :value="browserProfile.geolocation.longitude"
        :label="$t('browserProfiles.longitude')"
        dense
        outlined
        :error="validation.touched && (!validation.longitudeRequired || !validation.longitudeBetween)"
        :error-messages="validation.touched && (!validation.longitudeRequired || !validation.longitudeBetween) ? $t('browserProfiles.longitudeError') : ''"
        :hide-details="!error"
        class="mb-2"
        type="number"
        @input="setValue('longitude', $event)"
      />
    </v-col>

    <v-col
      v-if="browserProfile.geolocation.mode === 'manual'"
      :cols="12"
      class="pt-0"
    >
      <Map />
    </v-col>
  </v-row>
</template>

<script>
import Map from '@/components/browser-profiles/main-dialog/map/Map'
import { MglMap, MglMarker, MglGeojsonLayer } from 'vue-mapbox'
import MglGeocoderControl from 'vue-mapbox-geocoder'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogGeolocation',
  components: {
    Map,
    // eslint-disable-next-line vue/no-unused-components
    MglMap,
    // eslint-disable-next-line vue/no-unused-components
    MglMarker,
    // eslint-disable-next-line vue/no-unused-components
    MglGeojsonLayer,
    // eslint-disable-next-line vue/no-unused-components
    MglGeocoderControl
  },
  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        latitudeRequired: false,
        latitudeBetween: false,
        longitudeRequired: false,
        longitudeBetween: false,
        accuracyRequired: false,
        accuracyBetween: false
      })
    }
  },

  data () {
    return {
      markerCoordinates: [-100.4458825, 39.7837304],
      layerId: 'firstLayer',
      sourceId: 'firstSource',
      center: {
        lat: 39.7837304,
        lng: -100.4458825
      },
      accessToken: 'pk.eyJ1IjoiZG9scGhpbjAwNyIsImEiOiJjbDFkcG5xZDAwM2Q5M2VydGt1bnN3bTY2In0.wQr4iIu_XZHH9qjmVjuQbg',
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
      defaultInput: 'Bodhgaya'
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    error () {
      return this.validation.touched && (
        !this.validation.latitudeRequired ||
        !this.validation.latitudeBetween ||
        !this.validation.longitudeRequired ||
        !this.validation.longitudeBetween ||
        !this.validation.accuracyRequired ||
        !this.validation.accuracyBetween
      )
    }
  },

  async mounted () {
    this.locateGeoLocation()
  },

  methods: {
    changeGeolocation (mode) {
      if (mode !== 'manual' && (this.browserProfile.geolocation.latitude !== null || this.browserProfile.geolocation.longitude !== null)) {
        this.browserProfile.geolocation.latitude = null
        this.browserProfile.geolocation.longitude = null
        this.browserProfile.geolocation.accuracy = null
      }

      if (mode === 'manual') {
        this.browserProfile.geolocation.accuracy = 10
      }
    },

    setValue (key, value) {
      if (parseFloat(value)) {
        this.browserProfile.geolocation[key] = parseFloat(value)
        if (!Object.prototype.hasOwnProperty.call(this.browserProfile.geolocation, 'marker')) {
          this.browserProfile.geolocation.marker = {}
        }
        if (key === 'longitude') {
          this.browserProfile.geolocation.marker.lng = parseFloat(value)
          this.browserProfile.geolocation.lng = parseFloat(value)
          this.browserProfile.geolocation.longitude = parseFloat(value)
        } else if (key === 'latitude') {
          this.browserProfile.geolocation.marker.lat = parseFloat(value)
          this.browserProfile.geolocation.lat = parseFloat(value)
          this.browserProfile.geolocation.latitude = parseFloat(value)
        } else if (key === 'accuracy') {
          this.browserProfile.geolocation.marker.lng = parseFloat(value)
        }
      } else {
        this.browserProfile.geolocation[key] = null
      }
    },

    addLocationMarker (e) {
      const marker = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }

      this.browserProfile.geolocation.latitude = marker.lat
      this.browserProfile.geolocation.longitude = marker.lng
      this.browserProfile.geolocation.marker = marker
    },

    locateGeoLocation: function () {
      navigator.geolocation.getCurrentPosition(geolocation => {
        this.center = {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude
        }
      })
    }
  }
}
</script>

<style scoped>
.googleMap {
  width: 100%;
  height: 400px;
}
</style>
