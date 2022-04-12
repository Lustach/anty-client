<template>
  <v-dialog
    :value="dialogs.edit"
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
          {{ $t('users.editUser') + ' ' + username }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
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
              :value="users.forEdit.displayName"
              :label="$t('common.displayName')"
              outlined
              dense
              hide-details
              :spellcheck="false"
              @input="setDisplayName"
            />
          </v-col>

          <!-- ПАРОЛЬ -->
          <v-col :cols="12">
            <v-text-field
              :value="users.forEdit.password"
              :label="$t('common.newPassword')"
              outlined
              dense
              :error-messages="touched &&
                $v.users.forEdit.password &&
                $v.users.forEdit.password.$error ? $t('authorization.passwordLength') : null"
              :hide-details="touched &&
                $v.users.forEdit.password &&
                $v.users.forEdit.password.$error ? false : true"
              :spellcheck="false"
              class="centralize-inner"
              @input="setPassword"
            >
              <template #append>
                <!-- СГЕНЕРИРОВАТЬ ПАРОЛЬ -->
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-btn
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
              v-model="users.forEdit.role"
              :label="$t('common.role')"
              :item-text="item => $t(`users.roles.${item.text}`)"
              :item-value="item => item.value"
              :items="roles"
              outlined
              dense
              :disabled="profile.id === users.forEdit.id"
              :error-messages="touched && $v.users.forEdit.role.$error ? $t('common.fieldRequired') : null"
              :hide-details="touched && $v.users.forEdit.role.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- TEAMLEADS -->
          <v-col
            v-if="users.forEdit.role === 'user'"
            :cols="12"
          >
            <v-autocomplete
              v-model="users.forEdit.teamleads"
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
        <v-btn
          v-if="profile.id !== users.forEdit.id"
          color="red"
          :disabled="profile.role === 'user'"
          text
          @click="$store.dispatch('users/openDialog', 'delete')"
        >
          {{ $t('common.delete') }}
        </v-btn>

        <v-spacer />

        <v-btn
          color="grey"
          text
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          :loading="loading"
          :disabled="$_.isEqual(user, users.forEdit) || disableUi"
          @click="touch"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
// import generator from 'generate-password'
import { required, minLength } from 'vuelidate/lib/validators'
import roles from '@/constants/users/roles.js'
import generatePassword from 'omgopass'

export default {
  name: 'UsersDialogCreate',

  data () {
    return {
      username: null,
      loading: false,
      touched: false,
      roles
    }
  },

  validations () {
    const users = {
      forEdit: {
        role: {
          required
        }
      }
    }

    if (users.forEdit.password !== null) {
      users.forEdit.password = {
        minLength: minLength(5)
      }
    }

    return { users: users }
  },

  computed: {
    ...mapGetters({
      dialogs: 'users/dialogs',
      allUsersForDialog: 'users/allUsersForDialog',
      profile: 'main/profile',
      disableUi: 'main/disableUi'
    }),
    ...mapFields('users', ['users'])
  },

  watch: {
    'users.forEdit': {
      deep: true,
      handler () {
        this.touched = false
      }
    }
  },

  created () {
    this.username = this.users.forEdit.username
    this.user = this.$_.cloneDeep(this.users.forEdit)
    if (this.users.forEdit.teamleads) {
      this.users.forEdit.teamleads = this.users.forEdit.teamleads.filter(i => {
        const index = this.allUsersForDialog.findIndex(y => parseInt(y.id, 10) === parseInt(i, 10))
        return index > -1
      })
    }
  },

  methods: {
    close () {
      this.$store.dispatch('users/closeDialog', 'edit')
    },

    touch () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.save()
      }
    },

    async save () {
      try {
        this.loading = true

        const oldUserData = this.users.all.find(u => u.id === this.users.forEdit.id)
        if (oldUserData.role !== this.users.forEdit.role) {
        // AMPLITUDE СОБЫТИЕ
          try {
            this.$amplitude.getInstance().logEvent('User Change Role', { 'user role': this.users.forEdit.role })
          } catch (_) { /* */ }
        }

        const user = this.$_.cloneDeep(this.users.forEdit)
        delete user.id
        delete user.username

        if (user.role !== 'user' || user.teamleads === null) {
          user.teamleads = []
        }
        if (user.password === null) {
          delete user.password
        }

        const response = await this.api.patch(`/team/users/${this.users.forEdit.id}`, user)

        if (response.status === 200) {
          this.$store.dispatch('main/alert', {
            color: 'success',
            message: this.$t('common.saved')
          })
          this.$store.dispatch('users/replaceUser', response.data.data)
          this.close()
        }
      } catch (err) {
        console.log(err)
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

      this.users.forEdit.password = generatedPassword

      navigator.clipboard.writeText(generatedPassword)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.copied')
      })
    },

    setDisplayName (displayName) {
      if (displayName === '') {
        this.users.forEdit.displayName = null
      } else {
        this.users.forEdit.displayName = displayName
      }
    },

    setPassword (password) {
      if (password === '') {
        this.users.forEdit.password = null
      } else {
        this.users.forEdit.password = password
      }
    }
  }
}
</script>

<style>
.users-dialog-create-form .v-text-field__details {
  margin-bottom: 0 !important;
}
</style>
