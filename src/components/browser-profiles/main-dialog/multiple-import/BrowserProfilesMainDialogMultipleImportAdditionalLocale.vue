<template>
  <v-col :cols="7">
    <!-- РЕЖИМ -->
    <span class="main-dialog-col-label">{{ $t('browserProfiles.language') }}</span>
    <v-btn-toggle
      id="browserProfilesMainDialogMultipleImportLocaleButtonToggle"
      v-model="browserProfile.locale.mode"
      mandatory
    >
      <v-btn
        v-for="mode in ['auto', 'manual']"
        :id="`browserProfilesMainDialogMultipleImportLocaleButton${capitalize(mode)}`"
        :key="`main-dialog-multiple-import-language-mode-${mode}`"
        :value="mode"
        x-small
        color="primary"
        outlined
      >
        {{ $t(`browserProfiles.${mode}`) }}
      </v-btn>
    </v-btn-toggle>

    <!-- ЧАСОВОЙ ПОЯС -->
    <v-autocomplete
      v-if="browserProfile.locale.mode === 'manual'"
      id="browserProfilesMainDialogMultipleImportLocaleValueAutocomplete"
      v-model="browserProfile.locale.value"
      :label="$t('browserProfiles.languageSelect')"
      :item-text="item => item.value"
      :item-value="item => item.key"
      :items="locale"
      :error="localeError"
      :error-messages="localeError ? $t('browserProfiles.languageError') : ''"
      :hide-details="localeError ? false : true"
      clearable
      outlined
      dense
      class="mt-2"
    />
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import en from '@/constants/locales/en.json'
import ru from '@/constants/locales/ru.json'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditionalLocale',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      en,
      ru
    }
  },

  computed: {
    ...mapGetters({ profile: 'main/profile' }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    localeError () {
      return this.browserProfileTouched && this.validation.browserProfile.locale.value.$error
    },

    locale () {
      if (this.profile && this.profile.language === 'en') {
        return this.en
      }
      return this.ru
    }
  },

  watch: {
    'browserProfile.locale.mode' (newVal, oldVal) {
      if (oldVal === 'manual') {
        this.browserProfile.locale.value = null
      }
    }
  },

  methods: {
    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
