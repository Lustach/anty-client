<template>
  <v-col :cols="12">
    <v-row>
      <!-- РЕЖИМ -->
      <v-col
        :cols="6"
        class="d-flex align-center"
      >
        <span class="main-dialog-col-label">{{ $t('browserProfiles.ports') }}</span>
        <v-btn-toggle
          v-model="browserProfile.ports.mode"
          mandatory
        >
          <v-btn
            v-for="mode in ['real', 'protect']"
            :key="`main-dialog-multiple-import-ports-mode-${mode}`"
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
        v-if="browserProfile.ports.mode === 'protect'"
        :cols="6"
      >
        <v-text-field
          v-model="browserProfile.ports.blacklist"
          :label="$t('browserProfiles.portsToProtect')"
          hide-details
          dense
          outlined
          :spellcheck="false"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalPorts',

  computed: {
    ...mapFields('browserProfilesMultipleImport', [
      'browserProfile',
      'browserProfileTouched'
    ])
  },

  watch: {
    'browserProfile.ports.mode' (newVal) {
      if (newVal === 'protect') {
        this.browserProfile.ports.blacklist = '3389,5900,5800,7070,6568,5938'
      } else if (newVal === 'real') {
        this.browserProfile.ports.blacklist = null
      }
    }
  }
}
</script>
