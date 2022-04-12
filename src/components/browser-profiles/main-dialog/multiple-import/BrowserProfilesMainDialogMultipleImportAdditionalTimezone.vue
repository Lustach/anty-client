<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">{{ $t('browserProfiles.timezone') }}</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportTimezoneButtonToggle"
      v-model="browserProfile.timezone.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['auto', 'manual']"
        :id="`browserProfilesMainDialogMultipleImportTimezoneButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-timezone-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>

    <!-- ЧАСОВОЙ ПОЯС -->
    <v-autocomplete
      v-if="browserProfile.timezone.mode === 'manual'"
      id="browserProfilesMainDialogMultipleImportTimezoneValueAutocomplete"
      v-model="browserProfile.timezone.value"
      :label="$t('browserProfiles.timezoneSelect')"
      :items="timezonesUtc.filter(timezone => timezone.toString().search('Etc/GMT') === -1)"
      :error="timezoneError"
      :error-messages="timezoneError ? $t('browserProfiles.timezoneError') : ''"
      :hide-details="timezoneError ? false : true"
      clearable
      outlined
      dense
      class="mt-2"
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
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import timezones from 'timezones.json'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalTimezone',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      timezones
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    timezoneError () {
      return this.browserProfileTouched && this.validation.browserProfile.timezone.value.$error
    },

    timezonesUtc () {
      return this.timezones.reduce((totalTimezones, timezone) => {
        return totalTimezones.concat(timezone.utc)
      }, [])
    }
  },

  watch: {
    'browserProfile.timezone.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.timezone.value = null
      }
    }
  },

  methods: {
    timezoneOffset (item) {
      const offset = this.timezones.find(timezone => timezone.utc.includes(item))
      if (offset && typeof offset !== 'undefined') {
        return offset.offset
      }
      return 'no offset'
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
