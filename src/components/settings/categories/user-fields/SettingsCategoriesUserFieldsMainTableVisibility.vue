<template>
  <div>
    <span
      v-if="userField.mainWebsite && userField.mainWebsite.length === 0"
      id="settingsUserFieldsMainTableCellVisibilityAll"
      style="color: #9e9e9e !important; font-size: 12px;"
    >
      {{ $t('settings.userFields.allWebsites').toLowerCase() }}
    </span>
    <span v-else>
      <!-- FACEBOOK -->
      <v-icon
        v-if="userField.mainWebsite.includes('facebook')"
        id="settingsUserFieldsMainTableCellVisibilityFacebook"
        :size="18"
        color="grey"
        class="mr-2"
      >
        fab fa-facebook-square
      </v-icon>

      <!-- GOOGLE -->
      <v-icon
        v-if="userField.mainWebsite.includes('google')"
        id="settingsUserFieldsMainTableCellVisibilityGoogle"
        :size="16"
        color="grey"
        class="mr-2"
        style="margin-top: 1px;"
      >
        fab fa-google
      </v-icon>

      <!-- TIKTOK -->
      <v-icon
        v-if="userField.mainWebsite.includes('tiktok')"
        id="settingsUserFieldsMainTableCellVisibilityTiktok"
        :size="16"
        color="grey"
        class="mr-2"
      >
        fab fa-tiktok
      </v-icon>

      <!-- VK -->
      <!-- <v-icon
        v-if="userField.mainWebsite.includes('vk')"
        id="settingsUserFieldsMainTableCellVisibilityVk"
        :size="16"
        color="grey"
      >
        fab fa-vk
      </v-icon> -->

      <icon
        v-if="userField.mainWebsite.includes('crypto')"
        name="crypto"
        style="height: 20px; width: 20px;"
        class="color-primary"
      />
    </span>
  </div>
</template>
<script>
import { icon } from '@/assets/icons'

export default {
  name: 'SettingsCategoriesUserFieldsMainTableVisibility',

  components: {
    icon
  },

  props: {
    userField: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  }
}
</script>
