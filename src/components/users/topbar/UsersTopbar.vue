<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ЛЕВАЯ СТОРОНА -->
    <div />

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- АЛЕРТ ОШИБКИ ПЛАНА -->
      <v-alert
        v-if="disableUi"
        color="error"
        class="mr-2 mb-0 py-0 d-flex align-center disable-ui-alert"
        type="error"
        text
        dense
        height="38"
      >
        {{ disableUiMessage }}
        <v-btn
          color="success"
          x-small
          class="ml-2"
          @click="openExternalLink(`https://anty.dolphin.ru.com/panel/#/overview?token=${remoteApiToken}`)"
        >
          {{ disableUiAlertButton }}
        </v-btn>
      </v-alert>

      <!-- НОВЫЙ ПОЛЬЗОВАТЕЛЬ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="usersAddButton"
            class="mr-2"
            color="primary"
            icon
            :disabled="disableUi || disableCreateButton"
            v-on="on"
            @click="$store.dispatch('users/openDialog', 'create')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('users.createUser') }}</span>
      </v-tooltip>

      <!-- ПОИСК -->
      <v-text-field
        id="usersSearchField"
        ref="usersSearchField"
        v-model="usersSearchField"
        class="anty-topbar-search-field"
        :label="$t('browserProfiles.searchField')"
        dense
        solo
        single-line
        hide-details
        clearable
        clear-icon="fas fa-times"
        :spellcheck="false"
        @input="search"
      >
        <template #prepend-inner>
          <ion-icon
            name="search-outline"
            class="mx-1"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'UsersTopbar',

  data () {
    return {
      usersSearchField: '',
      nameSearchText: ''
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'users/dialogs',
      mainDialogs: 'main/dialogs',
      pagination: 'users/pagination',
      disableUi: 'main/disableUi',
      subscription: 'main/subscription'
    }),

    ...mapFields('users', ['users']),

    disableUiMessage () {
      const profilesCount = this.subscription.browserProfiles?.count
      const profilesLimit = this.subscription.browserProfiles?.limit
      let profilesLimitExceeded = false

      if (profilesCount !== undefined && profilesLimit !== undefined) {
        profilesLimitExceeded = profilesCount >= profilesLimit
      }

      const usersCount = this.subscription.users?.count
      const usersLimit = this.subscription.users?.limit
      let usersLimitExceeded = false

      if (usersCount !== undefined && usersLimit !== undefined) {
        usersLimitExceeded = usersCount >= usersLimit
      }

      if (profilesLimitExceeded || usersLimitExceeded) {
        return this.$t('common.limitsOverflowedMessage')
      }
      return this.$t('common.subscriptionExpiredMessage')
    },

    disableUiAlertButton () {
      const profilesCount = this.subscription.browserProfiles?.count
      const profilesLimit = this.subscription.browserProfiles?.limit
      let profilesLimitExceeded = false

      if (profilesCount !== undefined && profilesLimit !== undefined) {
        profilesLimitExceeded = profilesCount >= profilesLimit
      }

      const usersCount = this.subscription.users?.count
      const usersLimit = this.subscription.users?.limit
      let usersLimitExceeded = false

      if (usersCount !== undefined && usersLimit !== undefined) {
        usersLimitExceeded = usersCount >= usersLimit
      }

      if (profilesLimitExceeded || usersLimitExceeded) {
        return this.$t('common.upgrade')
      }
      return this.$t('common.renew')
    },

    remoteApiToken () {
      return localStorage.getItem('remoteApiToken')
    },

    disableCreateButton () {
      if (!this.subscription.browserProfiles || !this.subscription.browserProfiles) return

      const usersLimitExceeded = this.subscription.users.count >= this.subscription.users.limit
      return usersLimitExceeded
    }
  },

  created () {
    document.addEventListener('keyup', this.focusSearch)
  },

  destroyed () {
    document.removeEventListener('keyup', this.focusSearch)
  },

  methods: {
    openExternalLink (url) {
      this.localApi.post('/open-external-link', { url })
    },

    focusSearch (e) {
      let dialogOpened = false
      let mainDialogOpened = false
      for (const dialog of Object.values(this.dialogs)) {
        if (dialog) {
          dialogOpened = true
        }
      }
      for (const dialog of Object.values(this.mainDialogs)) {
        if (dialog) {
          mainDialogOpened = true
        }
      }
      if (!dialogOpened && !mainDialogOpened && (e.keyCode === 111 || e.keyCode === 191)) {
        this.$refs.usersSearchField.focus()
      }

      if (!dialogOpened && this.$refs.usersSearchField.isFocused && e.keyCode === 27) {
        this.$refs.usersSearchField.blur()
        this.usersSearchField = ''
        this.search('')
      }
    },

    search (name) {
      this.nameSearchText = name

      setTimeout(async () => {
        if (name === this.nameSearchText) {
          const payload = {
            query: name,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('users/loadUsers', payload)
        }
      }, 500)
    }
  }
}
</script>
