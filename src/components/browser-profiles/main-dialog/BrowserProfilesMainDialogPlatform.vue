<template>
  <v-row class="mt-2">
    <!-- ПЛАТФОРМА -->
    <v-col
      id="browserProfilesMainDialogFieldPlatform"
      :cols="12"
      class="d-flex align-center"
    >
      <!-- <span class="mr-2">
        {{ $t('common.platform') }}
      </span> -->
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchPlatform"
        v-model="browserProfile.platform"
        mandatory
        @change="setLocalPlatform"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchPlatformButtonWindows"
          value="windows"
          small
          color="primary"
          outlined
        >
          <ion-icon
            name="logo-windows"
            style="font-size: 16px;"
            class="mr-1"
          />
          windows
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchPlatformButtonMacOs"
          value="macos"
          small
          color="primary"
          outlined
        >
          <ion-icon
            name="logo-apple"
            style="font-size: 16px;"
            class="mr-1"
          />
          macos
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchPlatformButtonLinux"
          value="linux"
          small
          color="primary"
          outlined
        >
          <ion-icon
            name="logo-tux"
            style="font-size: 16px;"
            class="mr-1"
          />
          linux
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogPlatform',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  created () {
    if (!this.browserProfile.forEdit && localStorage.getItem('browserProfilesAddDialogPlatform') === null) {
      const platformArray = [
        { device: 'linux', platform: /Linux/ },
        { device: 'windows', platform: /Windows NT/ },
        { device: 'macos', platform: /Macintosh/ }
      ]

      const platform = navigator.userAgent

      for (const i in platformArray) {
        if (platformArray[i].platform.test(platform)) {
          localStorage.setItem('browserProfilesAddDialogPlatform', platformArray[i].device)
          this.browserProfile.platform = platformArray[i].device
          return
        }
      }
      localStorage.setItem('browserProfilesAddDialogPlatform', 'windows')
      this.browserProfile.platform = 'windows'
    } else if (!this.browserProfile.forEdit) {
      this.browserProfile.platform = localStorage.getItem('browserProfilesAddDialogPlatform')
    }
  },

  methods: {
    setLocalPlatform () {
      localStorage.setItem('browserProfilesAddDialogPlatform', this.browserProfile.platform)
    }
  }
}
</script>
