<template>
  <div
    id="mainTableCustomizeColumns"
    class="anty-maintable-customize-columns"
  >
    <v-menu
      v-if="profile.columnsPresets && Array.isArray(profile.columnsPresets) && profile.columnsPresets.length > 0"
      open-on-hover
      bottom
      offset-y
      :disabled="disableUi"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          x-small
          icon
          color="grey"
          v-bind="attrs"
          v-on="on"
          @click="$store.dispatch('browserProfiles/openDialog', 'columns')"
        >
          <ion-icon name="settings-outline" />
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in profile.columnsPresets"
          :key="index"
          style="padding: 0 8px; height: 30px !important;"
          @click="selectColumns(item.columns)"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip
      v-else
      top
    >
      <template #activator="{ on }">
        <v-btn
          id="browserProfilesCustomizeColumnsButton"
          x-small
          icon
          color="grey"
          :disabled="disableUi"
          v-on="on"
          @click="$store.dispatch('browserProfiles/openDialog', 'columns')"
        >
          <ion-icon name="settings-outline" />
        </v-btn>
      </template>
      <span>{{ $t('common.customizeColumns') }}</span>
    </v-tooltip>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableCustomizeColumns',

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      disableUi: 'main/disableUi'
    })
  },

  methods: {
    async selectColumns (columns) {
      await this.api.patch('/profile', { columns: columns })
      await this.$store.dispatch('main/loadProfile')
    }
  }
}
</script>
