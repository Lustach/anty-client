<template>
  <v-container class="mt-4">
    <v-row style="height: 550px">
      <v-col :cols="12">
        <v-text-field
          v-model="userToTransfer"
          :label="$t('common.enterEmail')"
          outlined
          dense
          hide-details
          :spellcheck="false"
          @input="filterUsers"
        />
      </v-col>
      <v-switch
        id="bookmarksDialogCreateMainWebsiteSharedToEntireTeam"
        v-model="withProxy"
        style="padding-left: 10px"

        :label="$t('common.transferWithProxy')"
        hide-details
      />
      <!-- ДЕРЕВО ПОЛЬЗОВАТЕЛЕЙ -->
      <v-treeview
        v-if="items"
        v-model="selectedUser"
        :multiple-active="false"
        selectable
        activatable
        dense
        open-on-click
        style="height: 490px; overflow: scroll; width: 100%; left: -28px; position: relative;"
        selected-color="primary"
        :items="localItems"
        return-object
      >
        <template #prepend="{ item }">
          <!-- ИКОНКА - ПОЛЬЗОВАТЕЛЬ -->
          <v-icon
            v-if="item"
            size="16"
            class="d-block text-center"
          >
            fas fa-user
          </v-icon>
        </template>

        <template
          #label="{ item }"
          @click="changeTreeView"
        >
          <div v-if="item.username">
            <div>{{ item.name }}</div>
            <div style="color: #9E9E9E; font-size: 13px; margin-top: -5px;">
              {{ item.username }}
            </div>
          </div>
          <div v-else>
            {{ item.name }}
          </div>
        </template>
      </v-treeview>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesActionsDialogTransferTabTransfer',
  props: ['items'],

  data () {
    return {
      selectedUser: [],
      withProxy: false,
      userToTransfer: null,
      localItems: this.items
    }
  },
  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      allUsersForDialog: 'users/allUsersForDialog',
      profile: 'main/profile'
    })

  },
  watch: {
    items (val) {
      this.localItems = val
    },
    selectedUser (values, oldValues) {
      const index = values.findIndex(function (v, i) { return v !== oldValues[i] })
      if (values.length > 1) {
        this.selectedUser = [values[index]]
      }
    }
  },
  mounted () {
    this.localItems = this.items
  },
  methods: {
    filterUsers (query = null) {
      this.$emit('filterUsers', query)
    },
    async transfer () {
      setTimeout(async () => {
        console.log(this.profile)

        try {
          this.$emit('setLoading', true)
          let username = this.userToTransfer
          if (this.selectedUser && this.selectedUser.length > 0) {
            username = this.selectedUser[0].username ? this.selectedUser[0].username : this.selectedUser[0].name
          }
          const data = {
            ids: this.browserProfiles.selected.map(browserProfile => browserProfile.id),
            username,
            withProxy: this.withProxy
          }

          if (this.$_.isEmpty(data.username)) {
            this.$store.dispatch('main/alert', {
              color: 'error',
              message: this.$t('browserProfiles.transferEmptyUser')
            }, { root: true })

            return
          }
          if (this.profile.username === data.username) {
            this.$store.dispatch('main/alert', {
              color: 'error',
              message: this.$t('browserProfiles.transferYourSelf')
            }, { root: true })

            return
          }
          this.browserProfiles.selected = []
          const response = await this.api.post('/browser_profiles/transfer', data)

          if (response.status === 200 && response.data && response.data.success) {
            this.$store.dispatch('main/alert', {
              color: 'success',
              message: this.$t('common.saved')
            })
          }
          this.$emit('setLoading', false)
          this.$emit('closeDialog')
          await this.$store.dispatch('browserProfiles/loadCurrentPage')
        } catch (err) {
          this.$emit('setLoading', false)
          this.$store.dispatch('browserProfiles/loadCurrentPage')

          console.error(err)

          this.$store.dispatch('main/alert', {
            color: 'error',
            message: this.$t('common.somethingWentWrong')
          })
        }
      }, 500)
    }
  }

}
</script>
