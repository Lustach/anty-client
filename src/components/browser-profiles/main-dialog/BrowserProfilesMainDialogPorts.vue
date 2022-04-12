<template>
  <v-row class="mt-1 d-flex align-center">
    <v-col
      id="main-dialog-ports"
      :cols="6"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.ports') }}</span>

      <v-btn-toggle
        v-model="browserProfile.ports.mode"
        mandatory
      >
        <v-btn
          v-for="mode in ['real', 'protect']"
          :key="`main-dialog-ports-mode-${mode}`"
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
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogPorts',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
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
