<template>
  <v-dialog
    :value="dialogs.shareInfo"
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
          {{ $t('browserProfiles.dialogShare.permissionsFor') + " " + browserProfile.name }}
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
      <v-progress-linear
        v-if="disabled"
        indeterminate
      />

      <!-- ОКНО -->
      <v-card-text
        style="max-height: 700px;"
        class="pb-0"
      >
        <v-container>
          <v-row>
            <v-col :cols="12">
              <div v-if="items.length === 0">
                {{ $t('browserProfiles.dialogShare.noSharedPermissions') }}
              </div>

              <div v-else>
                <!-- <div class="mb-1">
                  ВЫБРАТЬ ВСЕ
                  <v-btn
                    color="primary"
                    x-small
                    style="margin-left: 0px;"
                    class="my-1"
                    outlined
                    @click="selectAll"
                  >
                    {{ $t('common.selectAll') }}
                  </v-btn>

                  УБРАТЬ ВСЕ
                  <v-btn
                    color="primary"
                    x-small
                    style="margin-left: 0px;"
                    class="my-1 ml-1"
                    outlined
                    @click="deselectAll"
                  >
                    {{ $t('common.deselectAll') }}
                  </v-btn>
                </div> -->
                <!-- ДЕРЕВО ПОЛЬЗОВАТЕЛЕЙ -->
                <v-treeview
                  v-model="permissions"
                  selectable
                  selected-color="primary"
                  dense
                  open-on-click
                  :items="items"
                >
                  <template #prepend="{ item }">
                    <!-- ИКОНКА - ПОЛЬЗОВАТЕЛЬ -->
                    <v-icon
                      v-if="item.id.includes('user')"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-user
                    </v-icon>

                    <!-- ИКОНКА - ПРОСМОТР -->
                    <v-icon
                      v-if="item.id.includes('view')"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-eye
                    </v-icon>

                    <!-- ИКОНКА - СТАРТ/СТОП -->
                    <v-icon
                      v-if="item.id.includes('usage')"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-play
                    </v-icon>

                    <!-- ИКОНКА - ДЕЙСТВИЯ -->
                    <v-icon
                      v-if="item.id.includes('update')"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-bolt
                    </v-icon>

                    <!-- ИКОНКА - УДАЛЯТЬ -->
                    <v-icon
                      v-if="item.id.includes('delete')"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-trash
                    </v-icon>

                    <!-- ИКОНКА - РАЗДАВАТЬ -->
                    <v-icon
                      v-if="item.id.search('share') !== -1"
                      size="16"
                      class="d-block text-center"
                    >
                      fas fa-share-alt
                    </v-icon>
                  </template>

                  <template #label="{ item }">
                    <div v-if="item.id.includes('user')">
                      <div v-if="item.username">
                        <div>{{ item.name }} {{ item.owner ? '(' + $t('common.owner').toLowerCase() + ')' : '' }}</div>
                        <div style="color: #9E9E9E; font-size: 13px; margin-top: -5px;">
                          {{ item.username }}
                        </div>
                      </div>
                      <div v-else>
                        {{ item.name }} {{ item.owner ? '(' + $t('common.owner').toLowerCase() + ')' : '' }}
                      </div>
                    </div>
                    <div v-else>
                      {{ item.name }} {{ item.owner ? '(' + $t('common.owner').toLowerCase() + ')' : '' }}
                    </div>
                  </template>
                </v-treeview>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- КНОПКИ -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          small
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          :loading="loading"
          :disabled="disabled"
          small
          text
          color="primary"
          @click="savePermissions"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesActionsDialogShareInfo',

  data () {
    return {
      permissions: [],
      loading: false,
      disabled: false,
      browserProfileAccessList: []
    }
  },

  computed: {
    ...mapGetters({
      browserProfile: 'browserProfiles/browserProfile',
      users: 'users/users',
      dialogs: 'browserProfiles/dialogs',
      profile: 'main/profile',
      pagination: 'browserProfiles/pagination',
      usersPagination: 'users/pagination',
      usersLoading: 'users/loading'
    }),

    items () {
      const items = []

      this.users.all.forEach(user => {
        // if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

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

        for (const access of this.browserProfileAccessList) {
          if (parseInt(user.id, 10) === parseInt(access.userId, 10) && parseInt(access.roleId, 10) === 1) {
            item.disabled = true
            item.owner = true
          }
        }
        if (user.id === this.profile.id) {
          item.disabled = true
        }

        items.push(item)
      })

      return items
    },

    allItems () {
      let allItems = []

      this.users.all.forEach(user => {
        if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

        const children = [
          { id: `${user.id}-view`, name: this.$t('browserProfiles.dialogShare.permissions.view') },
          { id: `${user.id}-usage`, name: this.$t('browserProfiles.dialogShare.permissions.startStop') },
          { id: `${user.id}-update`, name: this.$t('browserProfiles.dialogShare.permissions.update') },
          { id: `${user.id}-delete`, name: this.$t('browserProfiles.dialogShare.permissions.delete') },
          { id: `${user.id}-share`, name: this.$t('browserProfiles.dialogShare.permissions.share') }
        ]

        allItems = allItems.concat(children.map(child => child.id))
      })

      return allItems
    }
  },

  async created () {
    try {
      this.disabled = true

      const response = await this.api.get(`/browser_profiles/${this.browserProfile.id}/access?page=1`)
      if (response.status === 200 && response.data.data) {
        this.browserProfileAccessList = this.browserProfileAccessList.concat(response.data.data)
        if (response.data.last_page > 0) {
          for (let i = 2; i <= response.data.last_page; i++) {
            const response2 = await this.api.get(`/browser_profiles/${this.browserProfile.id}/access?page=${i}`)
            this.browserProfileAccessList = this.browserProfileAccessList.concat(response2.data.data)
          }
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.disabled = false
    }

    this.browserProfileAccessList.forEach(access => {
      // if (parseInt(access.userId, 10) === parseInt(this.profile.id, 10)) return

      if (access.view) {
        this.permissions.push(`${access.userId}-view`)
      }
      if (access.usage) {
        this.permissions.push(`${access.userId}-usage`)
      }
      if (access.update) {
        this.permissions.push(`${access.userId}-update`)
      }
      if (access.delete) {
        this.permissions.push(`${access.userId}-delete`)
      }
      if (access.share) {
        this.permissions.push(`${access.userId}-share`)
      }
    })
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'shareInfo')
    },

    async savePermissions () {
      try {
        this.loading = true
        const permissions = []

        this.permissions.forEach(permission => {
          const userId = parseInt(permission.split('-')[0], 10)
          const permissionType = permission.split('-')[1]

          const userPermissions = permissions.findIndex(item => item.userId === userId)

          if (userPermissions > -1) {
            permissions[userPermissions][permissionType] = 1
          } else {
            permissions.push({
              userId: userId,
              [permissionType]: 1
            })
          }
        })

        const response = await this.api.patch(`/browser_profiles/${this.browserProfile.id}/access`, { users: permissions })

        if (response.status !== 200 || response.data.error) {
          throw response
        }

        const payload = {
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage,
          query: this.pagination.query,
          tags: this.pagination.tags,
          mainWebsites: this.pagination.mainWebsites,
          statuses: this.pagination.statuses,
          users: this.pagination.users
        }
        this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)

        this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
        this.close()
      } catch (err) {
        console.error(err)

        this.$store.dispatch('main/alert', {
          color: 'error',
          message: this.$t('common.somethingWentWrong')
        })
      } finally {
        this.loading = false
      }
    }

    // selectAll () {
    //   this.permissions = []
    //   this.permissions = this.permissions.concat(this.allItems)
    // },

    // deselectAll () {
    //   this.permissions = []
    // }
  }
}
</script>
