<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card>
      <v-card-text class="pt-5">
        <h2>{{ $t('dialogs.confirmAction') }}</h2>
        <v-alert
          type="error"
          dense
          text
          class="mb-0 mt-2"
        >
          {{ $t('users.deleteUserWarning') }}
        </v-alert>
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          :loading="loading"
          @click="deleteUser"
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
  name: 'UsersDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      users: 'users/users',
      dialogs: 'users/dialogs',
      profile: 'main/profile'
    })
  },

  methods: {
    close () {
      this.$store.dispatch('users/closeDialog', 'delete')
    },

    async deleteUser () {
      try {
        this.loading = true

        const response = await this.api.delete(`/team/users/${this.users.forEdit.id}`)

        if (response.status === 200 && response.data.success) {
          this.close()
          this.$store.dispatch('users/closeDialog', 'edit')
          this.$store.dispatch('users/removeUsers', [parseInt(this.users.forEdit.id, 10)])
          this.$store.dispatch('main/getSubscription')

          // AMPLITUDE СОБЫТИЕ
          try {
            this.$amplitude.getInstance().logEvent('User Delete', { 'user role': this.users.forEdit.role })
          } catch (_) { /* */ }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        this.$store.dispatch('users/loadAllUsersForDialog')
      }
    }
  }
}
</script>
