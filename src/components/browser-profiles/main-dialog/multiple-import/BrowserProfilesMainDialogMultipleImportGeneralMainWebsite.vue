<template>
  <v-col :cols="12">
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportMainWebsiteButtonToggle"
      v-model="browserProfile.mainWebsite"
      mandatory
    >
      <v-btn
        v-for="mainWebsite in mainWebsites"
        :id="`browserProfilesMainDialogMultipleImportMainWebsiteButton${capitalize(mainWebsite.name)}`"
        :key="`main-dialog-multiple-import-mainWebsites-${mainWebsite.name}`"
        :value="mainWebsite.name"
        small
        color="primary"
        outlined
      >
        <v-icon
          v-if="mainWebsite.icon && mainWebsite.name !== 'crypto'"
          size="16"
          color="primary"
          class="mr-1"
        >
          {{ mainWebsite.icon }}
        </v-icon>
        <icon
          v-else-if="mainWebsite.name === 'crypto'"
          name="crypto"
          class="mr-1"
        />
        {{ mainWebsite.name }}
      </v-btn>
    </v-btn-toggle>
  </v-col>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { icon } from '@/assets/icons'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralMainWebsite',

  components: {
    icon
  },

  data () {
    return {
      mainWebsites: [
        {
          name: 'none'
        },
        {
          name: 'facebook',
          icon: 'fab fa-facebook-square'
        },
        {
          name: 'google',
          icon: 'fab fa-google'
        },
        {
          name: 'tiktok',
          icon: 'fab fa-tiktok'
        },
        {
          name: 'crypto'
        }
      ]
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  methods: {
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
