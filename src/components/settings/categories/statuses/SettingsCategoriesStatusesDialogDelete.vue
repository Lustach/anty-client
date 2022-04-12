<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfilesStatuses/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('browserProfilesStatuses/closeDialog', 'delete')"
  >
    <v-card>
      <v-card-text class="pt-5">
        <h2>{{ $t('dialogs.confirmAction') }}</h2>
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('browserProfilesStatuses/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          id="settingsStatusesActionDialogDeleteConfirmButton"
          color="primary"
          text
          :loading="loading"
          @click="deleteStatus"
        >
          {{ $t('common.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SettingsCategoriesStatusesDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfilesStatuses/dialogs',
      statuses: 'browserProfilesStatuses/statuses'
    })
  },

  methods: {
    async deleteStatus () {
      try {
        this.loading = true

        const data = { ids: this.statuses.selected.map(item => parseInt(item.id, 10)) }

        const response = await this.api.delete('/browser_profiles/statuses', { data: data })

        if (response.status !== 200) {
          throw response
        }

        this.$store.dispatch('browserProfilesStatuses/clearSelected')
        this.$store.dispatch('browserProfilesStatuses/removeStatuses', data.ids)
        this.$store.dispatch('browserProfilesStatuses/closeDialog', 'delete')

        const identify = new this.$amplitude.Identify().add('statusCount', -data.ids.length)
        this.$amplitude.getInstance().identify(identify)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
