<template>
  <div
    style="width: 24px; min-width: 24px; margin-top: 2px;"
    class="mx-1 d-flex justify-center align-center"
  >
    <v-icon
      v-if="browserProfile.mainWebsite === 'none' || !browserProfile.mainWebsite"
      :id="`browserProfilesMainTableMainWebsiteIconNoneFor-${browserProfile.id}`"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fas fa-globe
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'facebook'"
      :id="`browserProfilesMainTableMainWebsiteIconFacebookFor-${browserProfile.id}`"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fab fa-facebook-square
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'google'"
      :id="`browserProfilesMainTableMainWebsiteIconGoogleFor-${browserProfile.id}`"
      :size="20"
      style="margin-top: -1px;"
      color="primary"
    >
      fab fa-google
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'tiktok'"
      :id="`browserProfilesMainTableMainWebsiteIconTikTokFor-${browserProfile.id}`"
      :size="20"
      color="primary"
      style="margin-top: -1px;"
    >
      fab fa-tiktok
    </v-icon>

    <v-icon
      v-if="browserProfile.mainWebsite === 'vk'"
      :id="`browserProfilesMainTableMainWebsiteIconVkFor-${browserProfile.id}`"
      :size="20"
      color="primary"
      style="margin-top: -1px; margin-left: -1px;"
    >
      fab fa-vk
    </v-icon>
    <icon
      v-if="browserProfile.mainWebsite === 'crypto'"
      name="crypto"
      style="height: 24px; width: 24px;"
      class="color-primary"
    />
  </div>
</template>

<script>
import { icon } from '@/assets/icons'

export default {
  name: 'BrowserProfilesMainTableNameMainWebsiteIcon',

  components: {
    icon
  },

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
