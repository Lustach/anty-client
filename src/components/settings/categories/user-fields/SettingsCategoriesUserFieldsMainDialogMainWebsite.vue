<template>
  <v-btn-toggle
    id="settingsUserFieldsMainDialogMainWebsiteButtonToggle"
    v-model="mainWebsite"
    mandatory
    multiple
  >
    <!-- ВСЕ -->
    <v-btn
      id="settingsUserFieldsMainDialogMainWebsiteButtonAll"
      value="all"
      small
      color="primary"
      outlined
    >
      {{ $t('settings.userFields.allWebsites') }}
    </v-btn>

    <!-- FACEBOOK -->
    <v-btn
      id="settingsUserFieldsMainDialogMainWebsiteButtonFacebook"
      value="facebook"
      small
      color="primary"
      outlined
    >
      <v-icon
        size="18"
        color="primary"
        class="mr-1"
      >
        fab fa-facebook-square
      </v-icon>
    </v-btn>

    <!-- GOOGLE -->
    <v-btn
      id="settingsUserFieldsMainDialogMainWebsiteButtonGoogle"
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
    </v-btn>

    <!-- TIKTOK -->
    <v-btn
      id="settingsUserFieldsMainDialogMainWebsiteButtonTiktok"
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
    </v-btn>

    <!-- CRYPTO -->
    <v-btn
      id="settingsUserFieldsMainDialogMainWebsiteButtonCrypto"
      value="crypto"
      small
      color="primary"
      outlined
    >
      <icon
        name="crypto"
        style="height: 20px; width: 20px;"
        class="color-primary"
      />
    </v-btn>
  </v-btn-toggle>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { icon } from '@/assets/icons'

export default {
  name: 'SettingsCategoriesUserFieldsMainDialogMainWebsite',

  components: {
    icon
  },

  data () {
    return {
      mainWebsite: []
    }
  },

  computed: {
    ...mapFields('userFields', ['userFields'])
  },

  watch: {
    mainWebsite: {
      handler (newVal, oldVal) {
        if (!newVal.includes('all') && newVal.length === 4) {
          this.mainWebsite = ['all']
          return
        }

        if (!oldVal.includes('all') && newVal.includes('all')) {
          this.mainWebsite = ['all']
          return
        }

        if (oldVal.includes('all') && newVal.length > 1) {
          this.mainWebsite = newVal.filter(item => item !== 'all')
        }

        if (this.mainWebsite.includes('all')) {
          this.userFields.forMainDialog.mainWebsite = []
        } else {
          this.userFields.forMainDialog.mainWebsite = this.mainWebsite
        }
      }
    }
  },

  created () {
    this.mainWebsite = this.userFields.forMainDialog.mainWebsite
  }

}
</script>
