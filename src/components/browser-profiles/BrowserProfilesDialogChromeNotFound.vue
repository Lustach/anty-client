<template>
  <v-dialog
    :value="dialogs.chromeNotFound"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'chromeNotFound')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'chromeNotFound')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="red"
        class="mb-5 pr-0"
      >
        <v-toolbar-title>
          {{ $t('browserProfiles.chromeNotFound') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'chromeNotFound')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        {{ $t('browserProfiles.installChromeStart') }}
        <a
          href="https://google.com/chrome"
          target="_blank"
        >{{ $t('browserProfiles.installChrome') }}</a>
        {{ $t('browserProfiles.installChromeEnd') }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesDialogChromeNotFound',

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs'
    })
  }
}
</script>
