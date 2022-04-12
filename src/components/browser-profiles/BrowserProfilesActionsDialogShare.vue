<template>
  <v-dialog
    :value="dialogs.share"
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
          {{ $t('common.share') }}
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
        v-if="usersLoading.mainTable"
        indeterminate
      />

      <!-- ОКНО -->
      <v-card-text style="max-height: 700px;">
        <v-container>
          <v-row>
            <v-col :cols="12">
              <div class="mb-1">
                <!-- ВЫБРАТЬ ВСЕ -->
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

                <!-- УБРАТЬ ВСЕ -->
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
              </div>

              <!-- ДЕРЕВО ПОЛЬЗОВАТЕЛЕЙ -->
              <v-treeview
                v-model="permissions"
                selectable
                dense
                open-on-click
                selected-color="primary"
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
                      <div>{{ item.name }}</div>
                      <div style="color: #9E9E9E; font-size: 13px; margin-top: -5px;">
                        {{ item.username }}
                      </div>
                    </div>
                    <div v-else>
                      {{ item.name }}
                    </div>
                  </div>
                  <div v-else>
                    {{ item.name }}
                  </div>
                </template>
              </v-treeview>

              <!-- ЗАГРУЗИТЬ ЕЩЕ -->
              <div v-if="usersPagination.currentPage < usersPagination.lastPage">
                <span
                  class="anty-main-table-link"
                  @click="$store.dispatch('users/loadNextUsers')"
                >
                  {{ $t('common.loadMore') }}
                </span>
              </div>

              <!-- ВЫБОР РЕЖИМА -->
              <div>
                <v-radio-group
                  v-model="action"
                  row
                  dense
                  hide-details
                  class="mt-1"
                >
                  <v-radio
                    :label="$t('common.addPermissions')"
                    value="add"
                  />
                  <v-radio
                    :label="$t('common.removePermissions')"
                    value="remove"
                  />
                </v-radio-group>
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
          small
          text
          color="primary"
          :disabled="permissions.length === 0"
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
  name: 'BrowserProfilesActionsDialogShare',

  data () {
    return {
      permissions: [],
      action: 'add',
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
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

        // this.allItems = this.allItems.concat(item.children.map(child => child.id))

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

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'share')
    },

    async savePermissions () {
      try {
        this.loading = true
        const users = []

        this.permissions.forEach(permission => {
          const id = parseInt(permission.split('-')[0], 10)
          const permissionType = permission.split('-')[1]

          const user = users.find(user => user.id === id)

          if (user) {
            user[permissionType] = 1
          } else {
            users.push({ id: id, [permissionType]: 1 })
          }
        })

        const data = {
          ids: this.browserProfiles.selected.map(browserProfile => browserProfile.id),
          users: users,
          action: this.action
        }

        const response = await this.api.post('/browser_profiles/access', data)
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

        if (response.status === 200 && response.data && response.data.success) {
          this.$store.dispatch('main/alert', {
            color: 'success',
            message: this.$t('common.saved')
          })
          this.close()
        }
      } catch (err) {
        console.error(err)

        this.$store.dispatch('main/alert', {
          color: 'error',
          message: this.$t('common.somethingWentWrong')
        })
      } finally {
        this.loading = false
      }
    },

    selectAll () {
      this.permissions = []
      this.permissions = this.permissions.concat(this.allItems)
    },

    deselectAll () {
      this.permissions = []
    }
  }
}
</script>
