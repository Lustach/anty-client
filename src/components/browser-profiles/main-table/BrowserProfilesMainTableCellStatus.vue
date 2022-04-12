<template>
  <div
    id="browserProfilesMainTableCellStatus"
    :class="{'cell-status-not-changeable': doNotChange || disableUi}"
  >
    <v-menu
      offset-y
      :disabled="doNotChange || disableUi"
    >
      <template #activator="{ on, attrs }">
        <v-chip
          v-if="browserProfile.status"
          :id="`browserProfilesMainTableCellStatusChipFor-${browserProfile.id}${browserProfile.status.color}`"
          outlined
          label
          small
          :color="browserProfile.status.color"
          style="text-transform: uppercase; font-weight: normal; height: 28px; letter-spacing: 0.0892857143em;"
          v-bind="attrs"
          v-on="on"
        >
          {{ browserProfile.status.name }}
        </v-chip>
        <v-chip
          v-else
          outlined
          label
          small
          color="grey"
          style="text-transform: uppercase; font-weight: normal; height: 28px; letter-spacing: 0.0892857143em;"
          v-bind="attrs"
          v-on="on"
        >
          {{ $t('common.statusNo') }}
        </v-chip>
      </template>
      <v-list :id="`browserProfilesMainTableCellStatusMenuFor-${browserProfile.id}`">
        <v-list-item>
          <v-tooltip
            v-if="profile"
            top
          >
            <template
              #activator="{ on }"
              style="padding: 90px"
            >
              <v-btn
                id="settingsStatusesTopbarButtonCreate"
                class="mr-2"
                color="primary"
                icon
                v-on="on"
                @click.prevent="openStatusDialog"
              >
                <ion-icon
                  name="add-outline"
                  style="font-size: 26px;"
                />
              </v-btn>
            </template>
            <span>{{ $t('settings.statuses.addNew') }}</span>
          </v-tooltip>
        </v-list-item>
        <v-list-item
          v-for="item in browserProfilesStatuses.all.filter(item => !item.deleted)"
          :key="`anty-main-table-statuses-${item.id}`"
        >
          <v-chip
            outlined
            label
            small
            :color="item.color"
            :disabled="browserProfile.status ? parseInt(item.id, 10) === parseInt(browserProfile.status.id, 10) : false"
            style="text-transform: uppercase; font-weight: bold; height: 28px;"
            @click="changesStatus(item)"
          >
            {{ item.name }}
          </v-chip>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableCellStatus',

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
      browserProfilesStatuses: 'browserProfilesStatuses/statuses',
      profile: 'main/profile',
      disableUi: 'main/disableUi'
    })
  },

  methods: {
    openStatusDialog () {
      this.$store.dispatch('browserProfilesStatuses/openDialog', 'mainDialog')
      this.$store.dispatch('browserProfilesStatuses/setMainDialogMode', 'AddNew')
      this.$store.commit('browserProfilesStatuses/SET_SELECTED_PROFILE', this.browserProfile.id)
    },
    async changesStatus (status) {
      try {
        this.$amplitude.getInstance().logEvent('Status Change')
      } catch (_) { /* */ }

      const clonedBrowserProfile = this.$_.cloneDeep(this.browserProfile)
      clonedBrowserProfile.status = {
        color: status.color,
        id: status.id,
        name: status.name
      }

      try {
        const response = await this.api.patch(`/browser_profiles/${this.browserProfile.id}`, { statusId: clonedBrowserProfile.status.id })
        if (response.status !== 200 || (!response.data && !response.data.data)) {
          throw response
        }

        this.$store.dispatch('browserProfiles/loadCurrentPage')
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
<style scoped>
.cell-status-not-changeable .v-chip {
  cursor: default !important;
}
</style>
