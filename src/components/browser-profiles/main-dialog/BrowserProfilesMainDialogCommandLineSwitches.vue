<template>
  <v-row class="mt-1 align-center">
    <!-- DO NOT TRACK -->
    <v-col
      :cols="12"
      class="d-flex align-center mb-1"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.commandLineSwitches') }}</span>
      <v-switch
        id="browserProfilesMainDialogCheckboxDoNotTrack"
        v-model="commandLineSwitches"
        dense
        hide-details
        class="mt-0"
        style="padding-top: 2px !important; padding-bottom: 2px !important;"
      />
    </v-col>
    <v-col
      v-if="commandLineSwitches"
      :cols="10"
      :offset="2"
      class="d-flex align-center mb-1"
    >
      <autocomplete
        v-model="browserProfile.args"
        :textarea="true"
        :items="argsList"
        style="width:100%;"
        :label="$t('browserProfiles.PasteCommandLineSwitches')"
        @change="onArgsChange"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import Autocomplete from '@/components/Autocomplete.vue'

export default {
  name: 'BrowserProfilesMainDialogCommandLineSwitches',
  components: { Autocomplete },
  data () {
    return {
      commandLineSwitches: false,
      argsList: require('@/files/args.json')
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  mounted () {
    this.commandLineSwitches = !!this.browserProfile.args.length
  },

  methods: {
    onArgsChange (value) {
      this.browserProfile.args = value.split('\n').filter(arg => {
        const matches = arg.match(/^([a-zA-Z\d-]+)(=[^;]*)?[\s]*$/)
        return matches && this.argsList.includes(matches[1])
      }).map(arg => arg.trim()).join('\n')
    }
  }
}
</script>
