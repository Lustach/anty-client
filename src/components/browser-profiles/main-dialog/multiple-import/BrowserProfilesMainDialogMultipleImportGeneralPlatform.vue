<template>
  <v-col :cols="12">
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportPlatformButtonToggle"
      v-model="browserProfile.platform"
      mandatory
    >
      <v-btn
        v-for="platform in platforms"
        :id="`browserProfilesMainDialogMultipleImportPlatformButton${capitalize(platform.name)}`"
        :key="`main-dialog-multiple-import-platforms-${platform.name}`"
        :value="platform.name"
        small
        color="primary"
        outlined
      >
        <ion-icon
          :name="platform.icon"
          style="font-size: 16px;"
          class="mr-1"
        />
        {{ platform.name }}
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralPlatform',

  data () {
    return {
      platforms: [
        {
          name: 'windows',
          icon: 'logo-windows'
        },
        {
          name: 'macos',
          icon: 'logo-apple'
        },
        {
          name: 'linux',
          icon: 'logo-tux'
        }
      ]
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  created () {
    if (localStorage.getItem('browserProfilesAddDialogPlatform') === null) {
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
    } else {
      this.browserProfile.platform = localStorage.getItem('browserProfilesAddDialogPlatform')
    }
  },

  methods: {
    setLocalPlatform () {
      localStorage.setItem('browserProfilesAddDialogPlatform', this.browserProfile.platform)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
