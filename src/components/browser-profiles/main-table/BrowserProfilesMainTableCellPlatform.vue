<template>
  <div style="text-align: center;">
    <v-icon
      v-if="browserProfile.platform === 'windows'"
      size="20"
      color="primary"
    >
      fab fa-windows
    </v-icon>

    <v-icon
      v-if="browserProfile.platform === 'macos'"
      size="24"
      color="primary"
      style="margin-top: -5px;"
    >
      fab fa-apple
    </v-icon>

    <v-icon
      v-if="browserProfile.platform === 'linux'"
      size="20"
      color="primary"
    >
      fab fa-linux
    </v-icon>
  </div>
</template>
<script>

export default {
  name: 'BrowserProfilesMainTableCellPlatform',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  }
}
</script>
