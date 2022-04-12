<template>
  <v-dialog
    :value="dialogs.create"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('users.createUser') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            id="usersDialogCreateCloseButton"
            icon
            @click="close"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text style="max-height: 700px;">
        <v-row class="mt-2 users-dialog-create-form">
          <!-- ОТОБРАЖАЕМОЕ ИМЯ -->
          <v-col :cols="12">
            <v-text-field
              id="usersDialogCreateDisplayNameTextField"
              v-model="user.displayName"
              :label="$t('common.displayName')"
              outlined
              dense
              hide-details
              :spellcheck="false"
            />
          </v-col>

          <!-- ИМЯ ПОЛЬЗОВАТЕЛЯ -->
          <v-col :cols="12">
            <v-text-field
              id="usersDialogCreateUsernameTextField"
              v-model="user.username"
              :label="$t('common.email')"
              outlined
              dense
              :error-messages="usernameError"
              :hide-details="touched && $v.user.username.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- ПАРОЛЬ -->
          <v-col :cols="12">
            <v-text-field
              id="usersDialogCreatePasswordTextField"
              v-model="user.password"
              :label="$t('common.password')"
              outlined
              dense
              :error-messages="passwordError"
              :hide-details="touched && $v.user.password.$error ? false : true"
              :spellcheck="false"
              class="centralize-inner"
            >
              <template #append>
                <!-- СГЕНЕРИРОВАТЬ ПАРОЛЬ -->
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
                      id="usersDialogCreateGeneratePasswordButton"
                      color="grey"
                      small
                      icon
                      v-on="on"
                      @click="generatePassword"
                    >
                      <v-icon size="16">
                        mdi-key-variant
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('common.generatePassword') }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-col>

          <!-- РОЛЬ -->
          <v-col :cols="12">
            <v-autocomplete
              id="usersDialogCreateRoleAutocomplete"
              v-model="user.role"
              :label="$t('common.role')"
              :item-text="item => $t(`users.roles.${item.text}`)"
              :item-value="item => item.value"
              :items="roles"
              outlined
              dense
              :error-messages="touched && $v.user.role.$error ? $t('common.fieldRequired') : null"
              :hide-details="touched && $v.user.role.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- TEAMLEADS -->
          <v-col
            v-if="user.role === 'user'"
            :cols="12"
          >
            <v-autocomplete
              id="usersDialogCreateRoleUserAutocomplete"
              v-model="user.teamleads"
              :label="$t('common.teamleads')"
              :item-text="item => item.displayName ? `${item.displayName} (${item.username})` : item.username"
              :item-value="item => item.id"
              :items="allUsersForDialog.filter(item => item.role === 'teamlead')"
              outlined
              dense
              hide-details
              :spellcheck="false"
              multiple
              small-chips
              deletable-chips
              clearable
              class="densed-input"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          text
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          id="usersDialogCreateCreateButton"
          color="primary"
          text
          :loading="loading"
          @click="touch"
        >
          {{ $t('common.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
// import generator from 'generate-password'
import { required, email, minLength } from 'vuelidate/lib/validators'
import roles from '@/constants/users/roles.js'
import generatePassword from 'omgopass'

export default {
  name: 'UsersDialogCreate',

  data () {
    return {
      user: {
        username: null,
        displayName: null,
        password: null,
        role: null,
        teamleads: null
      },
      loading: false,
      touched: false,
      roles
    }
  },

  validations () {
    const user = {
      username: {
        required, email
      },
      password: {
        required,
        minLength: minLength(5)
      },
      role: {
        required
      }
    }

    return { user: user }
  },

  computed: {
    ...mapGetters({
      dialogs: 'users/dialogs',
      users: 'users/users',
      pagination: 'users/pagination',
      allUsersForDialog: 'users/allUsersForDialog',
      profile: 'main/profile'
    }),

    usernameError () {
      if (this.touched && (!this.$v.user.username.required || !this.$v.user.username.email)) {
        if (!this.$v.user.username.email) {
          return this.$t('authorization.fieldEmail')
        }
        return this.$t('common.fieldRequired')
      }

      return null
    },

    passwordError () {
      if (this.touched && (!this.$v.user.password.required || !this.$v.user.password.minLength)) {
        if (!this.$v.user.password.minLength) {
          return this.$t('authorization.passwordLength')
        }
        return this.$t('common.fieldRequired')
      }

      return null
    }
  },

  watch: {
    user: {
      deep: true,
      handler () {
        this.touched = false
      }
    }
  },

  methods: {
    close () {
      this.$store.dispatch('users/closeDialog', 'create')
    },

    touch () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.create()
      }
    },

    async create () {
      this.loading = true

      const user = this.$_.cloneDeep(this.user)

      if (user.role !== 'user' ||
        user.teamleads === null ||
        (Array.isArray(user.teamleads) && user.teamleads.length === 0)
      ) {
        delete user.teamleads
      }
      try {
        const response = await this.api.post('/team/users', user)

        if (!response.status || (response.status && response.status !== 200)) {
          throw response.response
        }

        this.$store.dispatch('main/alert', {
          color: 'success',
          message: this.$t('common.created')
        })

        const payload = {
          query: this.pagination.query,
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage
        }
        this.$store.dispatch('users/loadUsers', payload)
        this.$store.dispatch('main/getSubscription')

        // AMPLITUDE СОБЫТИЕ - создание пользователя
        try {
          this.$amplitude.getInstance().logEvent('User Create', { 'user role': user.role })
        } catch (_) { /* */ }

        this.close()
      } catch (err) {
        console.error(err)

        if (err.status === 422) {
          if (err.data && err.data.username && err.data.username[0] === 'The username has already been taken.') {
            this.$store.dispatch('main/alert', {
              color: 'error',
              message: this.$t('authorization.emailIsTaken')
            })
          }
        }
      } finally {
        this.loading = false
        this.$store.dispatch('users/loadAllUsersForDialog')
      }
    },

    generatePassword () {
      // const generatedPassword = generator.generate({
      //   length: 10,
      //   numbers: true
      // })
      const generatedPassword = generatePassword({
        minSyllableLength: 4,
        maxSyllableLength: 6,
        hasNumbers: false,
        titlecased: false,
        separators: '-'
      })

      this.user.password = generatedPassword

      navigator.clipboard.writeText(generatedPassword)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.copied')
      })
    }

  }
}
</script>

<style>
.users-dialog-create-form .v-text-field__details {
  margin-bottom: 0 !important;
}
</style>
