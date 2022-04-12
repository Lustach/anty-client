<template>
  <v-row class="mt-2">
    <!-- ТИП БРАУЗЕРА -->
    <v-col
      id="main-dialog-browser-type"
      :cols="12"
    >
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchBrowserType"
        v-model="browserProfile.browserType"
        mandatory
        @change="setLocalBrowserType"
      >
        <!-- CHROME -->
        <v-btn
          id="browserProfilesMainDialogSwitchBrowserTypeButtonChrome"
          value="chrome"
          small
          color="primary"
          outlined
        >
          <v-icon
            color="primary"
            :size="15"
            class="mr-1"
          >
            fab fa-chrome
          </v-icon>
          chrome
        </v-btn>

        <!-- ANTY -->
        <v-btn
          id="browserProfilesMainDialogSwitchBrowserTypeButtonAnty"
          value="anty"
          small
          color="primary"
          outlined
        >
          <icon
            name="logoAnty"
            style="width: 12px;"
            class="mr-1"
          />
          anty
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script>
import { icon } from '@/assets/icons'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogBrowserType',

  components: {
    icon
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  // created () {
  //   if (localStorage.getItem('browserProfilesAddDialogBrowserType')) {
  //     this.browserProfile.browserType = localStorage.getItem('browserProfilesAddDialogBrowserType')
  //   }
  // },

  methods: {
    setLocalBrowserType () {
      localStorage.setItem('browserProfilesAddDialogBrowserType', this.browserProfile.browserType)
    }
  }
}
</script>
