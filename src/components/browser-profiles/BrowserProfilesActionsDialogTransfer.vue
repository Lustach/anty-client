<template>
  <v-dialog
    :value="dialogs.transfer"
    :overlay-opacity="0.7"
    scrollable
    width="700"

    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        color="primary"
        dark
        flat
      >
        <v-toolbar-title style="height: inherit;">
          <div class="main-dialog-main-tabs">
            <div
              v-for="item in ['share', 'transfer']"
              :key="`transfer-dialog-main-tabs-${item}`"
              :class="{'main-dialog-main-tabs-tab-active': mainTab === item}"
              @click="mainTab = item"
            >
              <svg
                preserveAspectRatio="none"
                viewBox="0 0 247 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5 4C5 1.79077 6.79077 0 9 0H238C240.209 0 242 1.79077 242 4V43C242 45.7615 244.239 48 247 48H242H5H0C2.76147 48 5 45.7615 5 43V4Z"
                  fill="currentColor"
                />
              </svg>
              <span>{{ $t(`common.${item}`) }}</span>
            </div>
          </div>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <!-- ПЕРЕДАТЬ/ПОДЕЛИТЬСЯ -->
          <v-btn
            text
            :loading="loading"
            @click="triggerMainAction"
          >
            {{ $t(`common.${mainTab}`) }}
          </v-btn>

          <!-- ЗАКРЫТЬ -->
          <v-btn
            icon
            @click="closeDialog"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="min-height: 500px">
        <!-- ПОДЕЛИТЬСЯ -->
        <dialog-transfer-tab-share
          ref="dialogTransferTabShare"
          :style="{display: mainTab === 'share' ? 'block' : 'none' }"
          :items="shareUsersItems()"
          :filtered-users-share="filteredUsersShare"
          @closeDialog="closeDialog"
          @setLoading="setLoading"
          @filterUsers="shareFilterUsers"
        />

        <!-- ПЕРЕДАТЬ -->
        <dialog-transfer-tab-transfer
          ref="dialogTransferTabTransfer"
          :items="transferUsersItems()"
          :style="{display: mainTab === 'share' ? 'none' : 'block' }"
          @closeDialog="closeDialog"
          @setLoading="setLoading"
          @filterUsers="transferFilterUsers"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogTransferTabShare from './BrowserProfilesActionsDialogTransferTabShare.vue'
import DialogTransferTabTransfer from './BrowserProfilesActionsDialogTransferTabTransfer.vue'

export default {
  name: 'BrowserProfilesActionsDialogTransfer',

  components: {
    DialogTransferTabShare,
    DialogTransferTabTransfer
  },

  data () {
    return {
      mainTab: 'share',
      loading: false,
      filteredUsersTransfer: [],
      filteredUsersShare: []
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfiles: 'browserProfiles/browserProfiles',
      allUsersForDialog: 'users/allUsersForDialog',
      profile: 'main/profile'
    })
  },

  created () {
    this.setUsers()
  },

  methods: {
    closeDialog () {
      this.$store.dispatch('browserProfiles/closeDialog', 'transfer')
    },

    setLoading (value) {
      this.loading = value
    },

    async setUsers () {
      await this.$store.dispatch('users/loadAllUsersForDialog')
      this.shareFilterUsers()
      this.transferFilterUsers()
    },

    triggerMainAction () {
      if (this.mainTab === 'share') {
        this.$refs.dialogTransferTabShare.savePermissions()
      }
      if (this.mainTab === 'transfer') {
        this.$refs.dialogTransferTabTransfer.transfer()
      }
    },
    transferUsersItems () {
      const items = []
      this.filteredUsersTransfer.forEach(user => {
        if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

        const item = {
          id: user.id,
          name: user.displayName ? user.displayName : user.username,
          username: user.displayName ? user.username : null
        }

        items.push(item)
      })

      return items
    },
    transferFilterUsers (query = null) {
      if (query) {
        this.filteredUsersTransfer = this.allUsersForDialog.filter(i => i.displayName.toString().toLowerCase().includes(query.toString()) || i.username.toString().toLowerCase().includes(query.toString()))
      } else {
        this.filteredUsersTransfer = this.$_.cloneDeep(this.allUsersForDialog)
      }
    },
    // share
    shareFilterUsers (query = null) {
      if (query) {
        this.filteredUsersShare = this.allUsersForDialog.filter(i => i.displayName.toString().toLowerCase().includes(query.toString()) || i.username.toString().toLowerCase().includes(query.toString()))
      } else {
        this.filteredUsersShare = this.$_.cloneDeep(this.allUsersForDialog)
      }
    },
    shareUsersItems () {
      const items = []
      this.filteredUsersShare.forEach(user => {
        if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

        const item = {
          id: 'user-' + user.id,
          name: user.displayName ? user.displayName : user.username,
          username: user.displayName ? user.username : null
        }
        item.children = [
          { id: `${user.id}-view`, name: this.$t('browserProfiles.dialogShare.permissions.view') },
          { id: `${user.id}-usage`, name: this.$t('browserProfiles.dialogShare.permissions.startStop') },
          { id: `${user.id}-update`, name: this.$t('browserProfiles.dialogShare.permissions.update') },
          { id: `${user.id}-delete`, name: this.$t('browserProfiles.dialogShare.permissions.delete') },
          { id: `${user.id}-share`, name: this.$t('browserProfiles.dialogShare.permissions.share') }
        ]

        items.push(item)
      })

      return items
    }
  }
}
</script>
