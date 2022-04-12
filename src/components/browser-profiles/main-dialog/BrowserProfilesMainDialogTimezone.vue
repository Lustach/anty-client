<template>
  <v-row class="mt-1">
    <!-- РЕЖИМ -->
    <v-col
      id="main-dialog-timezone"
      :cols="6"
      class="d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.timezone') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchTimezone"
        v-model="browserProfile.timezone.mode"
        mandatory
        @change="changeMode"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchTimezoneButtonAuto"
          value="auto"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.auto') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchTimezoneButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- ЧАСОВОЙ ПОЯС -->
    <v-col
      v-show="browserProfile.timezone.mode === 'manual'"
      :cols="12"
      class="pt-0"
    >
      <v-autocomplete
        id="browserProfilesMainDialogTimezoneSelect"
        v-model="browserProfile.timezone.value"
        :placeholder="$t('browserProfiles.timezoneSelect')"
        :label="selectFocused ? $t('browserProfiles.timezone') : ''"
        :items="timezonesUtc.filter(timezone => timezone.toString().search('Etc/GMT') === -1)"
        :error="validation.touched && validation.error"
        :error-messages="validation.touched && validation.error ? $t('browserProfiles.timezoneError') : ''"
        :hide-details="validation.touched && validation.error ? false : true"
        clearable
        outlined
        dense
        @focus="selectFocused = true"
        @blur="selectFocused = false"
      >
        <template #item="{item}">
          <span
            v-if="timezoneOffset(item) !== 'no offset'"
            class="mr-1"
          >
            {{ '[' + (timezoneOffset(item) > 0 ? '+' : '') + timezoneOffset(item) + ']' }}
          </span>
          {{ item }}
        </template>

        <template #selection="{item}">
          <span
            v-if="timezoneOffset(item) !== 'no offset'"
            class="mr-1"
          >
            {{ '[' + (timezoneOffset(item) > 0 ? '+' : '') + timezoneOffset(item) + ']' }}
          </span>
          {{ item }}
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import timezones from 'timezones.json'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogTimezone',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        error: false
      })
    }
  },

  data () {
    return {
      timezones,
      selectFocused: false
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    timezonesUtc () {
      let utc = []
      for (const i of this.timezones) {
        utc = utc.concat(i.utc)
      }

      return utc
    }
  },

  methods: {
    changeMode (mode) {
      if (mode === 'auto') {
        this.$set(this.browserProfile.timezone, 'value', null)
      }
    },

    timezoneOffset (item) {
      const offset = this.timezones.find(timezone => timezone.utc.includes(item))
      if (offset && typeof offset !== 'undefined') {
        return offset.offset
      }
      return 'no offset'
    }
  }
}
</script>
