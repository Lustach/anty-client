<template>
  <v-row class="mt-1">
    <!-- РЕЖИМ -->
    <v-col
      id="main-dialog-language"
      :cols="6"
      class="d-flex align-center"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.language') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchLocale"
        v-model="browserProfile.locale.mode"
        mandatory
        @change="changeMode"
      >
        <v-btn
          id="browserProfilesMainDialogSwitchLocaleButtonAuto"
          value="auto"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.auto') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchLocaleButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- ЯЗЫК -->
    <v-col
      v-show="browserProfile.locale.mode === 'manual'"
      :cols="12"
      class="pt-0"
    >
      <v-autocomplete
        id="browserProfilesMainDialogLocaleSelect"
        v-model="browserProfile.locale.value"
        :placeholder="$t('browserProfiles.languageSelect')"
        :label="selectFocused ? $t('browserProfiles.language') : ''"
        :item-text="item => item.value"
        :item-value="item => item.key"
        :items="locale"
        :error="validation.touched && validation.error"
        :error-messages="validation.touched && validation.error ? $t('browserProfiles.languageError') : ''"
        :hide-details="validation.touched && validation.error ? false : true"
        clearable
        outlined
        dense
        @focus="selectFocused = true"
        @blur="selectFocused = false"
      />
    </v-col>
  </v-row>
</template>

<script>
import en from '@/constants/locales/en.json'
import ru from '@/constants/locales/ru.json'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogLocale',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        error: false
      })
    }
  },

  data () {
    return {
      en,
      ru,
      selectFocused: false
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    locale () {
      if (localStorage.getItem('profileLanguage')) {
        return localStorage.getItem('profileLanguage') === 'en' ? this.en : this.ru
      }
      return this.en
    }
  },

  methods: {
    changeMode (mode) {
      if (mode === 'auto') {
        this.$set(this.browserProfile.locale, 'value', null)
      }
    }
  }
}
</script>
