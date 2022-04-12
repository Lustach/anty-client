<template>
  <div style="padding-left: 8px;">
    <v-switch
      id="sidebarDarkModeSwitcher"
      v-model="$vuetify.theme.dark"
      inset
      dense
      hide-details
      class="mt-0 pt-0"
    >
      <template #label>
        <div v-if="!mini">
          <span>
            Dark mode
          </span>
        </div>
      </template>
    </v-switch>

    <v-icon
      v-if="$vuetify.theme.dark"
      :size="12"
      style="margin-top: -43px; margin-left: 4px;"
    >
      far fa-moon
    </v-icon>

    <ion-icon
      v-if="!$vuetify.theme.dark"
      name="sunny-outline"
      style="position: relative; top: -20px; left: 21px; font-size: 14px; color: grey;"
    />
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarDarkMode',

  props: {
    mini: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapGetters({
      profileAuthorized: 'main/profileAuthorized'
    }),
    ...mapFields('main', ['profile'])
  },

  watch: {
    '$vuetify.theme.dark': {
      handler (mode) {
        const theme = mode ? 'dark' : 'light'

        if (this.profileAuthorized) {
          this.api.patch('/profile', { theme: theme })
        }

        this.profile.theme = theme
        localStorage.setItem('profileTheme', theme)
      }
    }
  }
}
</script>
