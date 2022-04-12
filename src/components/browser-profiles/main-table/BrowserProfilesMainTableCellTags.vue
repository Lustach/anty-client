<template>
  <div>
    <template v-if="browserProfile.tags && Array.isArray(browserProfile.tags) && browserProfile.tags.length > 0">
      <!-- ТЕГИ -->
      <v-chip
        v-for="tag in browserProfile.tags"
        :key="`item-${browserProfile.id}-tag-${tag}`"
        class="mr-1"
        outlined
        x-small
        label
        color="primary"
      >
        {{ tag }}
      </v-chip>

      <!-- РЕДАКТИРОВАТЬ -->
      <v-btn
        v-if="!doNotChange"
        icon
        x-small
        color="primary"
        class="anty-tags-edit-pencil"
        :disabled="disableUi"
        @click="addTags"
      >
        <v-icon :size="12">
          fas fa-pencil-alt
        </v-icon>
      </v-btn>
    </template>

    <!-- ЛИНК РЕДАКТИРОВАНИЯ -->
    <span
      v-else-if="!doNotChange"
      class="anty-adsmanager-main-table-link"
      :class="{'anty-adsmanager-main-table-link-disabled': disableUi}"
      @click="addTags"
    >
      {{ $t('common.tags').toLowerCase() }}
    </span>
  </div>
</template>
<script>

import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableCellTags',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    },
    doNotChange: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      disableUi: 'main/disableUi'
    }),
    ...mapFields('browserProfiles', ['forTagsDialog'])
  },

  methods: {
    addForTagsDialog () {
      this.forTagsDialog.singleBrowserProfile = true
      this.forTagsDialog.browserProfile.id = this.browserProfile.id
      this.forTagsDialog.browserProfile.tags = this.browserProfile.tags.slice()
    },

    async addTags () {
      this.addForTagsDialog()
      await this.$store.dispatch('browserProfiles/openDialog', 'tags')
    }
  }
}
</script>
<style>
.anty-tags-edit-pencil {
  opacity: 0;
}

.browser-profiles-main-table-tags-cell:hover .anty-tags-edit-pencil {
  opacity: 1;
}
</style>
