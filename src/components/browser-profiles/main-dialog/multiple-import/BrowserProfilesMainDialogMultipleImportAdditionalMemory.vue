<template>
  <v-col :cols="12">
    <v-row>
      <!-- РЕЖИМ -->
      <v-col :cols="6">
        <span class="main-dialog-col-label">{{ $t('browserProfiles.memory') }}</span>
        <v-btn-toggle
          id="browserProfilesMainDialogMultipleImportMemoryButtonToggle"
          v-model="browserProfile.memory.mode"
          mandatory
        >
          <v-btn
            v-for="mode in ['real', 'manual', 'random']"
            :id="`browserProfilesMainDialogMultipleImportMemoryButton${capitalize(mode)}`"
            :key="`main-dialog-multiple-import-memory-mode-${mode}`"
            :value="mode"
            x-small
            color="primary"
            outlined
          >
            {{ mode === 'real' ? $t('browserProfiles.realGeo') : $t(`browserProfiles.${mode}`) }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- ВРУЧНУЮ -->
      <v-col
        v-if="browserProfile.memory.mode === 'manual'"
        :cols="6"
      >
        <v-btn-toggle
          id="browserProfilesMainDialogMultipleImportMemoryValueButtonToggle"
          v-model="browserProfile.memory.value"
          mandatory
        >
          <v-btn
            v-for="memoryNumber in memoryNumbers"
            :key="`main-dialog-multiple-import-memory-number-${memoryNumber}`"
            :value="memoryNumber"
            x-small
            color="primary"
            outlined
          >
            {{ memoryNumber }}
          </v-btn>
        </v-btn-toggle>
        <span style="color: grey; margin-left: 4px;">
          {{ $t('browserProfiles.gb').toUpperCase() }}
        </span>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalMemory',

  data () {
    return {
      memoryNumbers: [2, 4, 8]
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  watch: {
    'browserProfile.memory.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.memory.value = null
      }
    }
  },

  methods: {
    randomize () {
      this.browserProfile.memory.value = this.$_.sample(this.memoryNumbers)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
