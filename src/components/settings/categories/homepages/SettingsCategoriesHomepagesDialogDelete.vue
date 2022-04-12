<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('settingsHomepages/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('settingsHomepages/closeDialog', 'delete')"
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
          @click="$store.dispatch('settingsHomepages/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          :loading="loading"
          @click="deleteHomepages"
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
  name: 'SettingsCategoriesHomepagesDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'settingsHomepages/dialogs',
      homepages: 'settingsHomepages/homepages'
    })
  },

  methods: {
    async deleteHomepages () {
      try {
        this.loading = true

        await this.api.delete('/homepages', {
          data: {
            ids: this.homepages.selected.map(item => parseInt(item.id, 10))
          }
        })
      } catch (err) {
        console.log(err)
      } finally {
        this.$store.dispatch('settingsHomepages/loadAllHomepages')
        this.$store.dispatch('settingsHomepages/clearSelected')
        this.$store.dispatch('settingsHomepages/closeDialog', 'delete')
        this.loading = false
      }
    }
  }
}
</script>
