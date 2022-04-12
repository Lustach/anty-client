<template>
  <v-col :cols="12">
    <v-row>
      <!-- РЕЖИМ -->
      <v-col
        :cols="6"
        class="d-flex align-center"
      >
        <span class="main-dialog-col-label">{{ $t('common.screen') }}</span>
        <v-btn-toggle
          v-model="browserProfile.screen.mode"
          mandatory
        >
          <v-btn
            v-for="mode in ['real', 'manual', 'random']"
            :key="`main-dialog-multiple-import-screen-mode-${mode}`"
            :value="mode"
            x-small
            color="primary"
            outlined
          >
            {{ $t(`browserProfiles.${mode}`) }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- РАЗРЕШЕНИЕ -->
      <v-col
        v-if="browserProfile.screen.mode === 'manual'"
        :cols="6"
      >
        <v-combobox
          v-model="browserProfile.screen.resolution"
          :label="$t('common.resolution')"
          dense
          outlined
          :items="screenResolutions[browserProfile.platform]"
          :error="resolutionError"
          :error-messages="resolutionError ? $t('authorization.fieldRequired') : ''"
          hide-details="auto"
          :spellcheck="false"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalScreen',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      screenResolutions: 'browserProfiles/screenResolutions'
    }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    resolutionError () {
      return this.browserProfileTouched && this.validation.browserProfile.screen.resolution.$error
    }
  },

  watch: {
    'browserProfile.screen.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.screen.resolution = null
      }
    }
  }
}
</script>
