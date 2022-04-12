<template>
  <v-row class="mt-2">
    <!-- РЕЖИМ ПРОКСИ -->
    <v-col
      id="main-dialog-proxy"
      :cols="12"
    >
      <add-proxy-mode />
    </v-col>

    <!-- ПРОКСИ -->
    <v-col
      v-if="browserProfile.proxyMode === 1 || browserProfile.proxyMode === 2"
      :cols="12"
    >
      <add-proxy :validation="validation" />
    </v-col>
  </v-row>
</template>
<script>
import AddProxy from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxy.vue'
import AddProxyMode from '@/components/browser-profiles/main-dialog/BrowserProfilesMainDialogAddProxyMode.vue'
import { mapFields } from 'vuex-map-fields'
export default {
  name: 'BrowserProfilesMainDialogProxy',

  components: {
    AddProxy,
    AddProxyMode
  },

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        savedProxyError: false,
        hostError: false,
        portError: false
      })
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  }
}
</script>
