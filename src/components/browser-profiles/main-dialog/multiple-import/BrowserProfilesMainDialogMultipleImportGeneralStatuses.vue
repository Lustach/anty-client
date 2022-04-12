<template>
  <v-col :cols="3">
    <v-select
      id="browserProfilesMainDialogMultipleImportStatusesSelect"
      :value="browserProfile.status"
      :item-value="item => item.id"
      :item-text="item => item.name"
      :items="browserProfilesStatuses.all.filter(item => !item.deleted)"
      :placeholder="$t('common.status')"
      dense
      outlined
      hide-details
      clearable
      style="flex: 1;"
      return-object
      @change="changeStatus"
    >
      <template #[`item`]="{item}">
        <v-chip
          outlined
          label
          small
          :color="item.color"
          style="text-transform: uppercase; font-weight: bold;"
        >
          {{ item.name }}
        </v-chip>
      </template>

      <template #[`selection`]="{item}">
        <v-chip
          outlined
          label
          small
          :color="item.color"
          style="text-transform: uppercase; font-weight: bold;"
        >
          {{ item.name }}
        </v-chip>
      </template>
    </v-select>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralStatuses',

  computed: {
    ...mapGetters({ browserProfilesStatuses: 'browserProfilesStatuses/statuses' }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  methods: {
    changeStatus (status) {
      if (status) {
        this.browserProfile.status = {
          color: status.color,
          id: status.id,
          name: status.name
        }
      } else {
        this.browserProfile.status = null
      }
    }
  }
}
</script>
