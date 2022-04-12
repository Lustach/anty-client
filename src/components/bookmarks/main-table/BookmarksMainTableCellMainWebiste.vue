<template>
  <span
    v-if="bookmark.mainWebsite"
    style="width: 20px; text-align: center;"
  >
    <v-chip
      v-for="mainWebsite in mainWebsitesList"
      :key="`item-mainWebsite-${mainWebsite.name}`"
      class="mr-1"
      outlined
      small
      label
      color="primary"
      :class="{'hide-main-website-tag': !bookmark.mainWebsite.includes(mainWebsite.value)}"
    >
      <v-icon
        v-if="mainWebsite.value !== 'crypto'"
        :size="14"
        color="primary"
        class="mr-1"
      >
        {{ mainWebsite.icon }}
      </v-icon>
      <icon
        v-else-if="mainWebsite.value === 'crypto'"
        name="crypto"
        style="height: 16px; width: 16px;"
        class="mr-1 color-primary"
      />
      {{ mainWebsite.name }}
    </v-chip>
  </span>
</template>

<script>
import { icon } from '@/assets/icons'

export default {
  name: 'BookmarksMainTableCellMainWebiste',

  components: {
    icon
  },

  props: {
    bookmark: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      mainWebsitesList: [
        {
          name: this.$t('common.websitesAll'),
          value: 'all',
          icon: 'fas fa-globe'
        },
        {
          name: this.$t('common.websiteNo'),
          value: 'none',
          icon: 'fas fa-times'
        },
        {
          name: 'Facebook',
          value: 'facebook',
          icon: 'fab fa-facebook-square'
        },
        {
          name: 'Google',
          value: 'google',
          icon: 'fab fa-google'
        },
        {
          name: 'TikTok',
          value: 'tiktok',
          icon: 'fab fa-tiktok'
        },
        {
          name: 'VK',
          value: 'vk',
          icon: 'fab fa-vk'
        },
        {
          name: 'Crypto',
          value: 'crypto'
        }
      ]
    }
  }
}
</script>
<style>
.hide-main-website-tag {
  display: none !important;
}
</style>
