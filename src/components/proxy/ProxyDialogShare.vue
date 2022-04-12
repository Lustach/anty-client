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
                <template #prepend>
                  <!-- ИКОНКА - ПОЛЬЗОВАТЕЛЬ -->
                  <v-icon
                    size="16"
                    class="d-block text-center"
                  >
                    fas fa-user
                  </v-icon>
                </template>

                <template #label="{ item }">
                  <div>
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
  name: 'ProxyDialogShare',

  data () {
    return {
      permissions: [],
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'proxy/proxies',
      dialogs: 'proxy/dialogs',
      users: 'users/users',
      profile: 'main/profile',
      proxy: 'proxy/proxies',
      pagination: 'proxy/pagination',
      usersPagination: 'users/pagination',
      usersLoading: 'users/loading'
    }),

    items () {
      const items = []

      this.users.all.forEach(user => {
        if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

        const item = {
          id: user.id,
          name: user.displayName ? user.displayName : user.username,
          username: user.displayName ? user.username : null
        }

        items.push(item)
      })

      this.updatePermissions()

      return items
    },

    allItems () {
      let allItems = []

      this.users.all.forEach(user => {
        if (parseInt(user.id, 10) === parseInt(this.profile.id, 10)) return

        allItems = allItems.concat(user.id)
      })

      return allItems
    }
  },

  mounted () {
    this.updatePermissions()
  },

  methods: {
    close () {
      this.$store.dispatch('proxy/closeDialog', 'share')
    },

    async updatePermissions () {
      const proxyIds = this.proxy.selected.map(item => parseInt(item.id, 10))

      try {
        const teamPermissions = await this.api.get(`/proxy/${proxyIds.join(',')}/share`)

        teamPermissions.data.forEach(perm => {
          this.permissions.push(perm.userId)
        })
      } catch (err) {
        console.error(err)

        this.$store.dispatch('main/alert', {
          color: 'error',
          message: this.$t('common.somethingWentWrong')
        })
      }
    },

    async savePermissions () {
      try {
        this.loading = true
        const users = []

        this.permissions.forEach(permission => {
          users.push(permission)
        })

        const data = {
          ids: this.browserProfiles.selected.map(browserProfile => browserProfile.id),
          users: users
        }

        await this.api.post('/proxy/share', data)
        await this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })

        const payload = {
          query: this.pagination.query,
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage
        }
        this.$store.dispatch('proxy/loadProxies', payload)
        await this.$store.dispatch('proxy/closeDialog', 'share')
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
