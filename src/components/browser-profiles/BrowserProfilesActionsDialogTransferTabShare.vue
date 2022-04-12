<template>
  <v-container class="mt-4">
    <v-row style="height: 550px">
      <v-col :cols="12">
        <v-text-field
          :label="$t('common.search')"
          outlined
          dense
          hide-details
          :spellcheck="false"
          @input="filterUsers"
        />
      </v-col>
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
          v-if="items"
          v-model="permissions"
          selectable
          dense
          style="height: 400px; overflow: scroll"
          open-on-click
          selected-color="primary"
          :items="localItems"
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesActionsDialogTransferTabShare',
  props: ['items', 'filteredUsersShare'],

  data () {
    return {
      permissions: [],
      action: 'add',
      loading: false,
      filteredUsers: [],
      localItems: this.items
    }
  },
  watch: {
    items (val) {
      this.localItems = val
    }
  },
  mounted () {
    this.localItems = this.items
  },
  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      allUsersForDialog: 'users/allUsersForDialog',
      profile: 'main/profile'
    }),

    allItems () {
      let allItems = []

      this.filteredUsersShare.forEach(user => {
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

    async savePermissions () {
      try {
        if (this.permissions.length === 0) {
          this.$emit('closeDialog')
          return
        }

        this.$emit('setLoading', true)
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

        if (response.status === 200 && response.data && response.data.success) {
          this.$emit('closeDialog')

          this.$store.dispatch('main/alert', {
            color: 'success',
            message: this.$t('common.saved')
          })
        }
      } catch (err) {
        console.log(err)

        this.$store.dispatch('main/alert', {
          color: 'error',
          message: this.$t('common.somethingWentWrong')
        })
      } finally {
        this.$emit('setLoading', false)
        this.$store.dispatch('browserProfiles/loadCurrentPage')
      }
    },

    selectAll () {
      this.permissions = []
      this.permissions = this.permissions.concat(this.allItems)
    },

    deselectAll () {
      this.permissions = []
    },

    filterUsers (query = null) {
      this.$emit('filterUsers', query)
      /* if (query) {
        this.filteredUsers = this.allUsersForDialog.filter(i => i.displayName.toString().toLowerCase().includes(query.toString()) || i.username.toString().toLowerCase().includes(query.toString()))
      } else {
        this.filteredUsers = this.$_.cloneDeep(this.allUsersForDialog)
      } */
    }
  }
}
</script>
