<template>
  <div>
    <v-btn-toggle
      id="browserProfilesMainDialogSwitchProxy"
      v-model="browserProfile.proxyMode"
      mandatory
      @change="setLocalProxyMode"
    >
      <v-btn
        id="browserProfilesMainDialogSwitchProxyButtonNone"
        small
        color="primary"
        outlined
      >
        <ion-icon
          style="font-size: 16px;"
          name="ban-outline"
          class="mr-1"
        />
        {{ $t('browserProfiles.proxy.noProxy') }}
      </v-btn>
      <v-btn
        id="browserProfilesMainDialogSwitchProxyButtonNew"
        small
        color="primary"
        outlined
      >
        <ion-icon
          style="font-size: 16px;"
          name="create-outline"
          class="mr-1"
        />
        {{ $t('browserProfiles.proxy.newProxy') }}
      </v-btn>
      <v-btn
        id="browserProfilesMainDialogSwitchProxyButtonSaved"
        small
        color="primary"
        outlined
      >
        <ion-icon
          style="font-size: 16px;"
          name="bookmark-outline"
          class="mr-1"
        />
        {{ $t('browserProfiles.proxy.savedProxies') }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogAddProxyMode',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  methods: {
    setLocalProxyMode () {
      localStorage.setItem('browserProfilesAddDialogProxyMode', this.browserProfile.proxyMode)
    }
  }
}
</script>
