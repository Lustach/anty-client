<template>
  <v-row class="mt-1 align-center">
    <!-- CPU -->
    <v-col
      :cols="7"
      class="pr-1"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.cpu') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchCpu"
        v-model="browserProfile.cpu.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchCpuButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchCpuButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
        <!-- <v-btn
          id="browserProfilesMainDialogSwitchCpuButtonRandom"
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
      v-if="browserProfile.cpu.mode === 'manual'"
      :cols="5"
      class="px-1"
    >
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchCpuButtonGroup"
        v-model="browserProfile.cpu.value"
        mandatory
        class="mr-1"
      >
        <v-btn
          v-for="cpuNumber in cpuList"
          :key="`main-dialog-additional-cpu-number-${cpuNumber}`"
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
        style="color: grey; font-size: 12px;"
      >
        {{ $tc('browserProfiles.core', 1) }}
      </span>
      <span
        v-show="[6, 8, 12, 16].includes(browserProfile.cpu.value)"
        style="color: grey"
      >
        {{ $tc('browserProfiles.core', 2) }}
      </span>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogCpu',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    cpuList () {
      if (this.browserProfile.platform === 'macos') {
        return [2, 4, 8, 12, 16]
      }
      return [2, 4, 6, 8, 12, 16]
    }

  },

  watch: {
    'browserProfile.cpu.mode' (newVal) {
      if (newVal === 'random') {
        this.randomize()
      }
      if (newVal === 'real') {
        this.browserProfile.cpu.value = null
      }
    }
  },

  methods: {
    randomize () {
      this.browserProfile.cpu.value = this.$_.sample(this.cpuList)
    }
  }

}
</script>
