<template>
  <div
    id="sidebarLanguageSwitcher"
    style="width: 100%; cursor: pointer;"
    @click="switchLanguage"
  >
    <flag
      :iso="languageFlag"
      style="width: inherit; background-size: 100% 100%;"
    />
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import moment from 'moment'
moment.locale(localStorage.getItem('profileLanguage') ? localStorage.getItem('profileLanguage') : 'en')

export default {
  name: 'SidebarLanguageSwitcher',

  data () {
    return {
      lang: localStorage.getItem('profileLanguage') ? localStorage.getItem('profileLanguage') : 'en'
    }
  },

  computed: {
    ...mapGetters({
      profileAuthorized: 'main/profileAuthorized'
    }),
    ...mapFields('main', ['profile']),

    languageFlag () {
      switch (this.lang) {
        case 'en':
          return 'ru'
        case 'ru':
          return 'gb'
      }

      return 'ru'
    }
  },

  methods: {
    async switchLanguage () {
      let locale = localStorage.getItem('profileLanguage') ? localStorage.getItem('profileLanguage') : 'en'

      switch (locale) {
        case 'en':
          locale = 'ru'
          break
        case 'ru':
          locale = 'en'
          break
      }
      if (this.profileAuthorized) {
        this.api.patch('/profile', { language: locale })
      }

      this.profile.language = locale
      localStorage.setItem('profileLanguage', locale)
      this.$vuetify.lang.current = locale
      this.$i18n.locale = locale
      moment.locale(locale)
      this.lang = locale
    }
  }
}
</script>
<style>
.anty-sidebar-language-select {
  cursor: pointer;
  text-decoration: underline;
}
.theme--dark .anty-sidebar-language-select {
  color: #FFFFFF;
  background-color: #363636;
  outline: none;
}
.theme--light .anty-sidebar-language-select {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
