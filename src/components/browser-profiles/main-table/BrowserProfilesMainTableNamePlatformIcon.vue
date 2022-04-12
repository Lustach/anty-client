<template>
  <div
    style="width: 20px; min-width: 20px; margin-top: 2px;"
    class="mx-1 d-flex justify-center align-center"
  >
    <v-icon
      v-if="browserProfile.platform === 'windows'"
      :id="`browserProfilesMainTablePlatformIconWindowsFor-${browserProfile.id}`"
      size="20"
      color="primary"
    >
      fab fa-windows
    </v-icon>

    <v-icon
      v-if="browserProfile.platform === 'macos'"
      :id="`browserProfilesMainTablePlatformIconMacOsFor-${browserProfile.id}`"
      size="24"
      color="primary"
      style="margin-top: -5px;"
    >
      fab fa-apple
    </v-icon>

    <v-icon
      v-if="browserProfile.platform === 'linux'"
      :id="`browserProfilesMainTablePlatformIconLinuxFor-${browserProfile.id}`"
      size="20"
      color="primary"
    >
      fab fa-linux
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'BrowserProfilesMainTableNamePlatformIcon',

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
