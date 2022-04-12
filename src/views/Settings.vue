<template>
  <div>
    <v-row style="height: calc(100vh - 32px); margin: 0; overflow-y: auto;">
      <v-col
        :cols="12"
        :md="8"
        :lg="6"
        :xl="4"
        :offset-md="2"
        :offset-lg="3"
        :offset-xl="4"
      >
        <settings-wrapper />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SettingsWrapper from '@/components/settings/SettingsWrapper.vue'

export default {
  name: 'Settings',

  components: {
    SettingsWrapper
  },

  data () {
    return {
      updateSettings: 0
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'settings/dialogs'
    })
  },

  async beforeCreate () {
    await this.$store.dispatch('browserProfilesStatuses/clearAll')
    await this.$store.dispatch('userFields/clearAll')
  },

  created () {
    this.$store.dispatch('settings/loadSettings')
  }

  // created () {
  //   this.$store.dispatch('settings/loadSettings')
  //   this.updateSettings = setInterval(() => {
  //     this.$store.dispatch('settings/loadSettings')
  //   }, 300000)
  // },

  // beforeDestroy () {
  //   clearInterval(this.updateSettings)
  // }
}
</script>
