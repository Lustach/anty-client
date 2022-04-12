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

        <!-- ПОЧТА -->
        <v-col
          id="registration-username-col"
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            id="registration-username"
            v-model.trim="$v.email.$model"
            :label="$t('common.email')"
            :error="touched && $v.email.$error"
            :hide-details="touched && $v.email.$error ? false : true"
            :messages="!$v.email.email ? $t('authorization.fieldEmail') :
              !$v.email.required ? $t('authorization.fieldRequired') : ''"
            outlined
            dense
            :spellcheck="false"
            @keydown.enter="register"
          />
        </v-col>

        <!-- ПАРОЛЬ -->
        <v-col
          id="registration-password-col"
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            id="registration-password"
            v-model.trim="$v.password.$model"
            class="append-icon"
            :label="$t('common.password')"
            :error="touched && $v.password.$error"
            :hide-details="touched && $v.password.$error ? false : true"
            :messages="!$v.password.minLength ? $t('authorization.passwordLength') :
              !$v.password.required ? $t('authorization.fieldRequired') : ''"
            outlined
            dense
            :type="showPassword ? '' : 'password'"
            :spellcheck="false"
            @keydown.enter="register"
          >
            <template #append>
              <!-- СГЕНЕРИРОВАТЬ ПАРОЛЬ -->
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    id="registrationPasswordGenerateButton"
                    color="grey"
                    small
                    icon
                    v-on="on"
                    @click="generatePassword"
                  >
                    <ion-icon name="key-outline" />
                  </v-btn>
                </template>
                <span>{{ $t('authorization.generatePassword') }}</span>
              </v-tooltip>

              <!-- ПОКАЗАТЬ ПАРОЛЬ -->
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    id="registration-password-show-button"
                    color="grey"
                    small
                    icon
                    v-on="on"
                    @click="showPassword = !showPassword; showRepeatPassword = !showRepeatPassword"
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

        <!-- ПОВТОРИТЕ ПАРОЛЬ -->
        <v-col
          id="registration-password-repeat-col"
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            id="registration-password-repeat"
            v-model.trim="$v.passwordRepeat.$model"
            class="append-icon"
            :label="$t('common.passwordRepeat')"
            :error="touched && $v.passwordRepeat.$error"
            :hide-details="touched && $v.passwordRepeat.$error ? false : true"
            :messages="!$v.passwordRepeat.sameAsPassword ? $t('authorization.passwordRepeat') :
              !$v.passwordRepeat.required ? $t('authorization.fieldRequired') : ''"
            outlined
            dense
            :type="showRepeatPassword ? '' : 'password'"
            :spellcheck="false"
            @keydown.enter="register"
          >
            <template #append>
              <v-tooltip bottom>
                <template #activator="{ on }">
                  <v-btn
                    id="registration-password-show-button2"
                    color="grey"
                    small
                    icon
                    v-on="on"
                    @click="showPassword = !showPassword; showRepeatPassword = !showRepeatPassword"
                  >
                    <ion-icon
                      v-if="!showRepeatPassword"
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

        <!-- ТЕЛЕГРАМ -->
        <v-col
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            v-model="telegram"
            label="Telegram"
            class="prepend-inner-icon"
            hide-details
            outlined
            dense
            :spellcheck="false"
            @keydown.enter="register"
          />
        </v-col>

        <!-- ПРОМОКОД -->
        <v-col
          cols="12"
          sm="4"
          offset-sm="4"
        >
          <v-text-field
            v-model="promocode"
            :label="$t('authorization.promoCode')"
            class="prepend-inner-icon"
            hide-details
            outlined
            dense
            :spellcheck="false"
            @keydown.enter="register"
          />
        </v-col>

        <!-- КНОПКИ -->
        <v-col
          cols="12"
          style="text-align: center"
        >
          <div class="mb-4">
            <v-btn
              id="registration-register-button"
              color="primary"
              :loading="loading"
              @click="register"
            >
              {{ $t('common.register') }}
            </v-btn>
          </div>
          <router-link
            id="registration-login-link"
            to="/login"
          >
            {{ $t('common.logIn').toLowerCase() }}
          </router-link>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import generator from 'generate-password'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'Registration',

  data () {
    return {
      email: '',
      telegram: '',
      promocode: '',
      password: '',
      passwordRepeat: '',
      loading: false,
      touched: false,
      showPassword: false,
      showRepeatPassword: false
    }
  },

  computed: {
    ...mapFields('main', ['profileAuthorized'])
  },

  validations: {
    email: {
      required,
      email: email
    },

    password: {
      required,
      minLength: minLength(5)
    },

    passwordRepeat: {
      required,
      sameAsPassword: sameAs('password')
    }
  },

  watch: {
    email: {
      handler () {
        this.touched = false
      }
    },

    password: {
      handler () {
        this.touched = false
      }
    },

    passwordRepeat: {
      handler () {
        this.touched = false
      }
    }
  },

  methods: {
    generatePassword () {
      const generatedPassword = generator.generate({
        length: 10,
        numbers: true
      })

      this.password = generatedPassword
      this.passwordRepeat = generatedPassword

      this.showPassword = true
      this.showRepeatPassword = true

      navigator.clipboard.writeText(generatedPassword)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.passwordCopied')
      })
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
    },

    async register () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.loading = true

        try {
          const response = await this.api.post('/auth/register', {
            username: this.email,
            password: this.password,
            telegram: this.telegram,
            promo: this.promocode
          })

          if (!response.status) {
            throw response.response
          } else if (response.status && response.status !== 200) {
            throw response
          }

          this.$amplitude.getInstance().setUserId(this.email)
          this.$amplitude.getInstance().logEvent('Registration')

          const responseLogin = await this.api.post('/auth/login', {
            username: this.email,
            password: this.password
          })

          if (!responseLogin.status) {
            throw responseLogin.response
          } else if (responseLogin.status && responseLogin.status !== 200) {
            throw responseLogin
          }

          await this.processToken(responseLogin.data.token)
          this.profileAuthorized = true
          await this.$router.push({ path: '/' })
        } catch (err) {
          if (err.status === 401) {
            this.$store.dispatch('main/alert', {
              color: 'error',
              message: this.$t('authorization.invalidUsernamePassword')
            })
          }
          if (err.status === 422) {
            if (err.data && err.data.username && err.data.username[0] === 'The username has already been taken.') {
              this.$store.dispatch('main/alert', {
                color: 'error',
                message: this.$t('authorization.emailIsTaken')
              })
            }
            if (err.data && err.data.error && err.data.error === 'Promo code not found') {
              this.$store.dispatch('main/alert', {
                color: 'error',
                message: this.$t('authorization.promoCodeNotFound')
              })
            }
          } else {
            console.error(err)
          }
        }
        this.loading = false
      }
    }
  }
}
</script>
