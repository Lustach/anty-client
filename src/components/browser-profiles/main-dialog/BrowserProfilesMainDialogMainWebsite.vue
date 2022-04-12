<template>
  <v-row class="mt-2">
    <!-- MAIN WEBSITE -->
    <v-col :cols="12">
      <!-- <span class="mr-2">
        {{ $t('browserProfiles.mainWebsite') }}
      </span> -->
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchMainWebsite"
        v-model="browserProfile.mainWebsite"
        :mandatory="browserProfile.mainWebsite === 'vk' ? false : true"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchMainWebsiteButtonNone"
          value="none"
          small
          color="primary"
          outlined
        >
          none
        </v-btn>

        <!-- FACEBOOK -->
        <v-btn
          id="browserProfilesMainDialogSwitchMainWebsiteButtonFacebook"
          value="facebook"
          small
          color="primary"
          outlined
        >
          <v-icon
            size="16"
            color="primary"
            class="mr-1"
          >
            fab fa-facebook-square
          </v-icon>
          facebook
        </v-btn>

        <!-- GOOGLE -->
        <v-btn
          id="browserProfilesMainDialogSwitchMainWebsiteButtonGoogle"
          value="google"
          small
          color="primary"
          outlined
        >
          <v-icon
            size="16"
            color="primary"
            class="mr-1"
          >
            fab fa-google
          </v-icon>
          google
        </v-btn>

        <!-- TIKTOK -->
        <v-btn
          id="browserProfilesMainDialogSwitchMainWebsiteButtonTikTok"
          value="tiktok"
          small
          color="primary"
          outlined
        >
          <v-icon
            size="16"
            color="primary"
            class="mr-1"
          >
            fab fa-tiktok
          </v-icon>
          tiktok
        </v-btn>

        <!-- CRYPTO -->
        <v-btn
          id="browserProfilesMainDialogSwitchMainWebsiteButtonCrypto"
          value="crypto"
          small
          color="primary"
          outlined
        >
          <icon
            name="crypto"
            class="mr-1"
          />
          crypto
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { icon } from '@/assets/icons'

export default {
  name: 'BrowserProfilesMainDialogMainWebsite',

  components: {
    icon
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  watch: {
    'browserProfile.mainWebsite' (newVal) {
      localStorage.setItem('browserProfilesAddDialogMainWebsite', newVal)
    }
  },

  created () {
    if (!this.browserProfile.forEdit && localStorage.getItem('browserProfilesAddDialogMainWebsite')) {
      this.browserProfile.mainWebsite = localStorage.getItem('browserProfilesAddDialogMainWebsite')
    }
  }
}
</script>
