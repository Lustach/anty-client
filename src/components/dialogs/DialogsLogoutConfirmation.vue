<template>
  <v-dialog
    :value="dialogs.logoutConfirmation"
    width="600"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'logoutConfirmation')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'logoutConfirmation')"
  >
    <v-card>
      <v-card-title>
        {{ $t('dialogs.logoutConfirmation') }}
      </v-card-title>
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="$store.dispatch('main/closeDialog', 'logoutConfirmation')"
        >
          {{ $t('common.no') }}
        </v-btn>
        <v-btn
          text
          @click="logOut"
        >
          {{ $t('common.yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'DialogsLogoutConfirmation',

  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs'
    }),
    ...mapFields('main', ['profileAuthorized'])
  },

  methods: {
    logOut () {
      // ЗАПИСАТЬ ПОРТ АПИ, ЧТОБЫ ПОСЛЕ localstorage.clear() ПРИСОВОИТЬ ЗНАЧЕНИЕ ОБРАТНО
      let antyLocalApiPort = null
      if (localStorage.getItem('antyLocalApiPort')) {
        antyLocalApiPort = localStorage.getItem('antyLocalApiPort')
      }

      localStorage.clear()

      if (antyLocalApiPort) {
        localStorage.setItem('antyLocalApiPort', antyLocalApiPort)
      }

      this.api.defaults.headers.Authorization = ''
      this.localApi.defaults.headers.Authorization = ''

      this.profileAuthorized = false

      this.$router.push({ name: 'Login' })

      this.$store.dispatch('main/closeDialog', 'logoutConfirmation')
      this.$store.dispatch('browserProfiles/clearSelected')
      this.$store.dispatch('proxy/clearSelected')
      this.$store.dispatch('browserProfilesStatuses/clearSelected')
      this.$store.dispatch('userFields/clearSelected')

      this.$amplitude.getInstance().logEvent('Log out')
      this.$amplitude.getInstance().setUserId(null)
    }
  }
}
</script>
