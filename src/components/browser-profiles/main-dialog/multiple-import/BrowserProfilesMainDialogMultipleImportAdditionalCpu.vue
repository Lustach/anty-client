<template>
  <v-col :cols="12">
    <v-row>
      <v-col :cols="6">
        <!-- РЕЖИМ -->
        <span class="main-dialog-col-label">{{ $t('browserProfiles.cpu') }}</span>
        <v-btn-toggle
          id="browserProfilesMainDialogMultipleImportСpuButtonToggle"
          v-model="browserProfile.cpu.mode"
          mandatory
        >
          <v-btn
            v-for="mode in ['real', 'manual', 'random']"
            :id="`browserProfilesMainDialogMultipleImportСpuButton${capitalize(mode)}`"
            :key="`main-dialog-multiple-import-cpu-mode-${mode}`"
            :value="mode"
            x-small
            color="primary"
            outlined
          >
            {{ $t(`browserProfiles.${mode}`) }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- ВРУЧНУЮ -->
      <v-col
        v-if="browserProfile.cpu.mode === 'manual'"
        :cols="6"
      >
        <v-btn-toggle
          id="browserProfilesMainDialogMultipleImportСpuValueButtonToggle"
          v-model="browserProfile.cpu.value"
          mandatory
        >
          <v-btn
            v-for="cpuNumber in cpuList"
            :key="`main-dialog-multiple-import-cpu-number-${cpuNumber}`"
            :value="cpuNumber"
            x-small
            color="primary"
            outlined
          >
            {{ cpuNumber }}
          </v-btn>
        </v-btn-toggle>
        <span
          v-show="[2, 4].includes(browserProfile.cpu.value)"
          style="color: grey; margin-left: 4px;"
        >
          {{ $tc('browserProfiles.core', 1) }}
        </span>
        <span
          v-show="[6, 8, 12, 16].includes(browserProfile.cpu.value)"
          style="color: grey; margin-left: 4px;"
        >
          {{ $tc('browserProfiles.core', 2) }}
        </span>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalCpu',

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile']),

    cpuList () {
      if (this.browserProfile.platform === 'macos') {
        return [2, 4, 8, 16]
      }
      return [2, 4, 6, 8, 12, 16]
    }
  },

  watch: {
    'browserProfile.cpu.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.cpu.value = null
      }
    }
  },

  methods: {
    randomize () {
      this.browserProfile.cpu.value = this.$_.sample(this.cpuList)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
