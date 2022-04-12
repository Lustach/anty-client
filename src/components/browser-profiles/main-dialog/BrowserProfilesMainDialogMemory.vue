<template>
  <v-row class="mt-1 align-center">
    <!-- CPU -->
    <v-col
      :cols="7"
      class="pr-1"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.memory') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchMemory"
        v-model="browserProfile.memory.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchMemoryButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.realGeo') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchMemoryButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
        <!-- <v-btn
          id="browserProfilesMainDialogSwitchMemoryButtonRandom"
          value="random"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.random') }}
        </v-btn> -->
      </v-btn-toggle>
    </v-col>

    <!-- ВРУЧНУЮ -->
    <v-col
      v-if="browserProfile.memory.mode === 'manual'"
      :cols="5"
      class="px-1"
    >
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchMemoryButtonGroup"
        v-model="browserProfile.memory.value"
        mandatory
        class="mr-1"
      >
        <v-btn
          v-for="memoryNumber in memoryNumbers"
          :key="`main-dialog-additional-memory-number-${memoryNumber}`"
          :value="memoryNumber"
          x-small
          color="primary"
          outlined
        >
          {{ memoryNumber }}
        </v-btn>
      </v-btn-toggle>
      <span style="color: grey; font-size: 12px;">
        {{ $t('browserProfiles.gb').toUpperCase() }}
      </span>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMemory',

  data () {
    return {
      memoryNumbers: [2, 4, 8]
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  watch: {
    'browserProfile.memory.mode' (newVal) {
      if (newVal === 'random') {
        this.randomize()
      }
      if (newVal === 'real') {
        this.browserProfile.memory.value = null
      }
    }
  },

  methods: {
    randomize () {
      this.browserProfile.memory.value = this.$_.sample(this.memoryNumbers)
    }
  }

}
</script>
