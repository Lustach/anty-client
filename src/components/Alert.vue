<template>
  <v-snackbar
    id="alert"
    :value="dialogs.alert"
    :color="alert.color || 'success'"
  >
    <v-row align="center">
      <v-col class="grow py-0">
        {{ alert.message }}
      </v-col>
      <v-col class="shrink py-0">
        <v-btn
          id="alertClose"
          text
          small
          color="white"
          @click="$store.dispatch('main/closeAlert')"
        >
          {{ $t('common.close') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Alert',

  data () {
    return {
      snackbar: true
    }
  },

  computed: {
    ...mapGetters({
      alert: 'main/alert',
      dialogs: 'main/dialogs'
    })
  }
}
</script>
