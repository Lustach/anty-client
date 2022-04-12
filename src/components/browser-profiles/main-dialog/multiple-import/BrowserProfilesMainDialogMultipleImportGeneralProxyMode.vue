<template>
  <v-col :cols="12">
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportProxyButtonToggle"
      v-model="browserProfile.proxyMode"
      mandatory
      @change="setLocalProxyMode"
    >
      <v-btn
        v-for="mode in modes"
        :id="`browserProfilesMainDialogMultipleImportProxyButton${capitalize(mode.name)}`"
        :key="`main-dialog-multiple-import-proxy-mode-${mode.name}`"
        small
        color="primary"
        outlined
      >
        <ion-icon
          style="font-size: 16px;"
          :name="mode.icon"
          class="mr-1"
        />
        {{ mode.title }}
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralProxyMode',

  data () {
    return {
      modes: [
        {
          name: 'noProxy',
          title: this.$t('browserProfiles.proxy.noProxy'),
          icon: 'ban-outline'
        },
        {
          name: 'newProxy',
          title: this.$t('browserProfiles.proxy.newProxy'),
          icon: 'create-outline'
        },
        {
          name: 'savedProxy',
          title: this.$t('browserProfiles.proxy.savedProxies'),
          icon: 'bookmark-outline'
        },
        {
          name: 'fromFile',
          title: this.$t('common.getFromFile'),
          icon: 'document-outline'
        }
      ]
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  methods: {
    setLocalProxyMode () {
      localStorage.setItem('browserProfilesAddDialogProxyMode', this.browserProfile.proxyMode)
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
