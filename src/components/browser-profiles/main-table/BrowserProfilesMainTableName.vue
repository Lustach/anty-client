<template>
  <div
    class="d-flex align-center"
    style="font-size: 16px;"
  >

    <!-- ИКОНКА ОС -->
    <platform-icon :browser-profile="browserProfile" />

    <!-- MAIN WEBSITE -->
    <main-website-icon :browser-profile="browserProfile" />

    <div
      style="word-break: break-all;"
      class="d-flex align-center"
    >
      <div>
        <!-- КНОПКИ ДЕЙСТВИЙ -->
        <actions
          :browser-profile="browserProfile"
          style="margin-right: 1px;"
        />
      </div>

      <div style="margin-left: 4px;">
        <div>
          <!-- НАЗВАНИЕ -->
          {{ browserProfile.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Actions from './BrowserProfilesMainTableNameActions.vue'
import MainWebsiteIcon from './BrowserProfilesMainTableNameMainWebsiteIcon.vue'
import PlatformIcon from './BrowserProfilesMainTableNamePlatformIcon.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableName',

  components: {
    Actions,
    MainWebsiteIcon,
    PlatformIcon
  },

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  computed: {
    ...mapGetters({
      users: 'users/users'
    })
  }

}
</script>
