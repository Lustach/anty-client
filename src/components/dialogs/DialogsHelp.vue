<template>
  <v-dialog
    :value="dialogs.help"
    width="600"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'help')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'help')"
  >
    <v-card>
      <v-card-title class="headline">
        {{ help.title !== '' && typeof help.title !== 'undefined' ? help.title : '' }}
      </v-card-title>

      <v-card-text
        v-if="help.body !== '' && help.body !== undefined"
        v-html="help.body"
      />
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('main/closeDialog', 'help')"
        >
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DialogsHelp',

  computed: {
    ...mapGetters({
      help: 'main/help',
      dialogs: 'main/dialogs'
    })
  }
}
</script>
