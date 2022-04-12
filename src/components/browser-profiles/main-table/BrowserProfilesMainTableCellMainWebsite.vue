<template>
  <div style="text-align: center;">
    <v-icon
      v-if="browserProfile.mainWebsite === 'none' || !browserProfile.mainWebsite"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fas fa-globe
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'facebook'"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fab fa-facebook-square
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'google'"
      :size="20"
      style="margin-top: -1px;"
      color="primary"
    >
      fab fa-google
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'tiktok'"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fab fa-tiktok
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'vk'"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fab fa-vk
    </v-icon>
  </div>
</template>
<script>

export default {
  name: 'BrowserProfilesMainTableCellMainWebsite',

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
