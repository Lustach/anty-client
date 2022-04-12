<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('userFields/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('userFields/closeDialog', 'delete')"
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
          @click="$store.dispatch('userFields/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          id="settingsUserFieldsActionDialogDeleteConfirmButton"
          color="primary"
          text
          :loading="loading"
          @click="deleteUserFields"
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
  name: 'SettingsCategoriesUserFieldsDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'userFields/dialogs',
      userFields: 'userFields/userFields'
    })
  },

  methods: {
    async deleteUserFields () {
      this.loading = true

      const data = { ids: this.userFields.selected.map(item => parseInt(item.id, 10)) }

      await this.api.delete('/browser_profiles/user_fields', { data: data })

      this.$store.dispatch('userFields/clearSelected')
      this.$store.dispatch('userFields/removeUserFields', data.ids)
      this.$store.dispatch('userFields/closeDialog', 'delete')

      this.loading = true
    }
  }
}
</script>
