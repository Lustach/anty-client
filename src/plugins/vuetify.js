import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import en from 'vuetify/es5/locale/en'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: localStorage.getItem('profileTheme') ? localStorage.getItem('profileTheme') === 'dark' : true
  },
  lang: {
    locales: {
      en,
      ru
    },
    current: localStorage.getItem('profileLanguage') || 'en'
  }
})
