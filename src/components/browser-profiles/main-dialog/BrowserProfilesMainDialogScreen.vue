<template>
  <v-row class="mt-1">
    <!-- РЕЖИМ -->
    <v-col
      :cols="6"
      class="d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('common.screen') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchScreen"
        v-model="browserProfile.screen.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchScreenButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchScreenButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- РАЗРЕШЕНИЕ -->
    <v-col
      v-if="browserProfile.screen.mode === 'manual'"
      :cols="6"
    >
      <v-combobox
        id="browserProfilesMainDialogSwitchScreenResolution"
        v-model="browserProfile.screen.resolution"
        :label="$t('common.resolution')"
        dense
        outlined
        :items="screenResolutions[browserProfile.platform]"
        :error="validation.touched && validation.error"
        :hide-details="validation.touched && validation.error ? false : true"
        :messages="validation.touched && validation.error ? $t('authorization.fieldRequired') : ''"
        :spellcheck="false"
      />
    </v-col>
    <!-- <v-col
      v-if="browserProfile.screen.mode === 'manual'"
      :cols="6"
      class="d-flex align-center pt-0"
    >
      <v-btn-toggle
        v-model="browserProfile.screen.colorDepth"
        mandatory
        class="mr-1"
      >
        <v-btn
          :value="16"
          x-small
          color="primary"
          outlined
        >
          16
        </v-btn>
        <v-btn
          :value="24"
          x-small
          color="primary"
          outlined
        >
          24
        </v-btn>
        <v-btn
          :value="30"
          x-small
          color="primary"
          outlined
        >
          30
        </v-btn>
        <v-btn
          :value="32"
          x-small
          color="primary"
          outlined
        >
          32
        </v-btn>
      </v-btn-toggle>
      <span
        v-show="browserProfile.screen.colorDepth === 24 || browserProfile.screen.colorDepth === 32"
        style="color: grey"
      >
        {{ $tc('browserProfiles.bits', 0) }}
      </span>
      <span
        v-show="browserProfile.screen.colorDepth === 16 || browserProfile.screen.colorDepth === 30"
        style="color: grey"
      >
        {{ $tc('browserProfiles.bits', 1) }}
      </span>
    </v-col> -->
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainDialogScreen',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        error: false
      })
    }
  },

  computed: {
    ...mapGetters({
      screenResolutions: 'browserProfiles/screenResolutions'
    }),
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  watch: {
    'browserProfile.screen.mode' (newVal) {
      if (newVal === 'real') {
        this.browserProfile.screen.resolution = null
      }
    }
  }
}
</script>
