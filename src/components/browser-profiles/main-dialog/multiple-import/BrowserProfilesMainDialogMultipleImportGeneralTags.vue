<template>
  <v-col
    :cols="5"
    :offset="2"
  >
    <v-combobox
      id="browserProfilesMainDialogMultipleImportTagsCombobox"
      v-model="browserProfile.tags"
      :items="tags"
      :label="$t('common.tags')"
      multiple
      small-chips
      deletable-chips
      clearable
      outlined
      dense
      hide-details
      class="densed-input"
    />
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralTags',

  computed: {
    ...mapGetters({ sortedTags: 'browserProfiles/sortedTags' }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile']),

    tags () {
      return this.sortedTags.map(item => item.name)
    }
  }
}
</script>
