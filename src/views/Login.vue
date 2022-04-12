<template>
  <div
    class="px-4 d-flex justify-center align-center"
    style="height: 100%;"
  >
    <div style="width: 100%;">
      <!-- ЗАГОЛОВОК -->
      <v-row>
        <v-col
          cols="12"
          sm="4"
          offset-sm="4"
          class="text-center"
        >
          <h1 class="font-weight-thin">
            <img
              src="/logo.png"
              style="width: 36px; height: auto; position: relative; top: 5px;"
              class="mr-1"
            >
            Dolphin Anty
          </h1>
        </v-col>
      </v-row>

      <!-- ЛОГИН -->
      <v-row>
        <v-col
          id="username-col"
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            id="username"
            v-model.trim="$v.login.$model"
            :label="$t('common.email')"
            :error="touched && $v.login.$error"
            :hide-details="touched && $v.login.$error ? false : true"
            :messages="touched && $v.login.$error ? $t('authorization.fieldRequired') : ''"
            outlined
            dense
            :spellcheck="false"
            @keydown.enter="logIn"
          />
        </v-col>
      </v-row>

      <!-- ПАРОЛЬ -->
      <v-row>
        <v-col
          id="password-col"
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            id="password"
            v-model.trim="$v.password.$model"
            class="append-icon"
            :label="$t('common.password')"
            :error="touched && $v.password.$error"
            :hide-details="touched && $v.password.$error ? false : true"
            :messages="touched && $v.password.$error ? $t('authorization.fieldRequired') : ''"
            outlined
            dense
            :type="showPassword ? '' : 'password'"
            :spellcheck="false"
            @keydown.enter="logIn"
          >
            <template #append>
              <!-- ПОКАЗАТЬ ПАРОЛЬ -->
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    color="grey"
                    small
                    icon
                    v-on="on"
                    @click="showPassword = !showPassword"
                  >
                    <ion-icon
                      v-if="!showPassword"
                      name="eye-outline"
                    />
                    <ion-icon
                      v-else
                      name="eye-off-outline"
                    />
                  </v-btn>
                </template>
                <span>{{ !showPassword ? $t('authorization.showPassword') : $t('authorization.hidePassword') }}</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- КНОПКИ -->
      <v-row>
        <v-col
          cols="12"
          style="text-align: center"
        >
          <div class="mb-4">
            <v-btn
              id="login-button"
              color="primary"
              :loading="loading"
              @click="logIn"
            >
              {{ $t('common.logIn') }}
            </v-btn>
          </div>
          <div
            class="anty-linkable-span"
            @click="resetPassword"
          >
            {{ $t('common.forgotPassword').toLowerCase() }}
          </div>

          <div
            class="anty-linkable-span"
            @click="registration"
          >
            {{ $t('common.registration').toLowerCase() }}
          </div>
          <!-- <router-link
            id="registration-link"
            to="/registration"
          >
            {{ $t('common.registration').toLowerCase() }}
          </router-link> -->
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'Login',

  data () {
    return {
      login: null,
      password: null,
      loading: false,
      touched: false,
      showPassword: false,
      capsLockPressed: 0
    }
  },

  validations: {
    login: {
      required
    },

    password: {
      required
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile'
    }),
    ...mapFields('main', ['profileAuthorized'])
  },

  watch: {
    login: {
      handler () {
        this.touched = false
      }
    },

    password: {
      handler () {
        this.touched = false
      }
    }
  },

  async created () {
    // Сбросить весь стейт
    if ('id' in this.profile) {
      location.reload()
    }

    document.addEventListener('keydown', this.logInByToken)

    if (this.$route.query.token) {
      await this.processToken(this.$route.query.token)
      // this.profileAuthorized = true
      // await this.$router.push({ path: '/' })
    }
  },

  destroyed () {
    document.removeEventListener('keydown', this.logInByToken)
  },

  methods: {
    registration () {
      this.openExternalLink('https://anty.dolphin.ru.com/?utm_source=Registration_app')
    },

    resetPassword () {
      this.openExternalLink(`https://anty.dolphin.ru.com/${this.$i18n.locale}/?reset-password`)
    },

    openExternalLink (url) {
      this.localApi.post('/open-external-link', { url })
    },

    async logInByToken (event) {
      if (event.key !== 'CapsLock') return

      this.capsLockPressed++

      setTimeout(() => {
        this.capsLockPressed = 0
      }, 1000)

      if (this.capsLockPressed === 4) {
        const token = await navigator.clipboard.readText()

        if (token && token !== '') {
          const response = await this.api.get('/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (response && response.status === 200 && response.data.data) {
            await this.processToken(token)
            this.profileAuthorized = true

            await this.$router.push({ path: '/' })
          }
        }
      }
    },

    async processToken (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`
      this.syncApi.defaults.headers.Authorization = `Bearer ${token}`
      this.localApi.defaults.headers.Authorization = `Bearer ${token}`

      this.localApi.post('/remote_api_token', { token })
      // const sessionResponse = await this.localApi.post('/session')
      // if (sessionResponse.data) {
      //   localStorage.setItem('remoteSessionId', sessionResponse.data.id)
      // }

      localStorage.setItem('remoteApiToken', token)

      await this.$store.dispatch('main/loadProfile')

      this.$amplitude.getInstance().setUserId(this.profile.username)

      // ОПРЕДЕЛЕНИЕ ЯЗЫКА ПРОФИЛЯ
      if (this.profile && this.profile.language) {
        const profileLanguage = this.profile.language
        localStorage.setItem('profileLanguage', profileLanguage)

        if (this.$vuetify.lang.current !== profileLanguage) {
          this.$vuetify.lang.current = profileLanguage
        }
        if (this.$i18n.locale !== profileLanguage) {
          this.$i18n.locale = profileLanguage
        }
        moment.locale(profileLanguage)
      } else {
        const navigatorLang = navigator.language.substring(0, 2) === 'ru' ? 'ru' : 'en'

        localStorage.setItem('profileLanguage', navigatorLang)
        this.$vuetify.lang.current = navigatorLang
        this.$i18n.locale = navigatorLang
        moment.locale(navigatorLang)
      }

      // ОПРЕДЕЛЕНИЕ ТЕМЫ ПРОФИЛЯ
      if (this.profile && this.profile.theme) {
        const profileTheme = this.profile.theme
        localStorage.setItem('profileTheme', profileTheme)

        const profileDarkMode = profileTheme === 'dark'
        if (this.$vuetify.theme.dark !== profileDarkMode) {
          this.$vuetify.theme.dark = profileDarkMode
        }
      } else {
        localStorage.setItem('profileTheme', 'dark')
        this.$vuetify.theme.dark = true
      }

      await this.$store.dispatch('main/getSubscription')
    },

    async logIn () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.loading = true

        try {
          const response = await this.api.post('/auth/login', {
            username: this.login,
            password: this.password
          })

          if (!response.status) {
            throw response.response.status
          } else if (response.status && response.status !== 200) {
            throw response.status
          }

          this.$amplitude.getInstance().logEvent('Authorization')

          await this.processToken(response.data.token)
          this.profileAuthorized = true
          await this.$router.push({ path: '/' })
        } catch (status) {
          if (status === 401) {
            this.$store.dispatch('main/alert', {
              color: 'error',
              message: this.$t('authorization.invalidUsernamePassword')
            })
          }
        }

        this.loading = false
      }
    }
  }
}
</script>
