<template>
  <v-card flat>
    <v-card-text>
      <!-- ИНПУТ ПОИСКА -->
      <v-text-field
        v-model="search"
        :label="$t('common.search')"
        dense
        outlined
        hide-details
        :spellcheck="false"
      />
      <!-- СПИСОК СТОЛБЦОВ -->
      <v-list
        flat
        style="height: 300px; overflow-y: auto;"
        class="mt-1"
      >
        <!-- ВЫБРАТЬ ВСЕ -->
        <v-list-item @click="selectAll">
          <v-list-item-action>
            <v-checkbox
              :input-value="columns.selected && Array.isArray(columns.selected) && columns.selected.length > 0 && columns.selected.length === columnsFiltered.length"
              :indeterminate="columns.selected && Array.isArray(columns.selected) && columns.selected.length > 0 && columns.selected.length !== columnsFiltered.length"
            />
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              {{ $t('common.all') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- СТОЛБЦЫ -->
        <v-list-item-group
          multiple
        >
          <v-list-item
            v-for="(column, index) in columnsFiltered"
            :key="`column-${index}-${column}`"
            :value="column.name"
            @click="selectColumn(column.name)"
          >
            <v-list-item-action>
              <v-checkbox :input-value="columns.selected.includes(column.name)" />
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                {{ column.name.startsWith("user-field-") ? userFieldName(column.name.replace("user-field-", "")) : $t(`columns.browserProfiles.${column.name}`) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import columnsConstant from '@/constants/columns/browserProfiles.js'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesDialogColumnsSearch',

  data () {
    return {
      search: '',
      columnsAll: []
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      userFields: 'userFields/userFields'
    }),
    ...mapFields('browserProfiles', ['columns']),

    columnsFiltered () {
      if (this.search !== '') {
        return this.columnsAll.filter(item => {
          if (item.name.startsWith('user-field-')) {
            const userFieldName = this.userFieldName(item.name.replace('user-field-', ''))
            return userFieldName.toLowerCase().includes(this.search.toLowerCase())
          } else {
            return this.$t(`columns.browserProfiles.${item.name}`).toLowerCase().includes(this.search.toLowerCase())
          }
        })
      }
      return this.columnsAll
    },

    filteredUserFields () {
      return this.userFields.all.filter(item => !item.deleted)
    }
  },

  // watch: {
  //   'userFields.all': {
  //     deep: true,
  //     handler () {
  //       this.addUserFields()
  //     }
  //   }
  // },

  async created () {
    if (columnsConstant) {
      this.columnsAll = this.columnsAll.concat(columnsConstant)
    }

    // if (this.userFields.all && Array.isArray(this.userFields.all) && this.userFields.all.length > 0) {
    //   this.addUserFields()
    // }

    await this.$store.dispatch('browserProfiles/setColumns', { key: 'selected', value: this.profile && this.profile.columns ? this.profile.columns.slice() : [] })
  },

  methods: {
    selectColumn (column) {
      if (this.columns.selected.includes(column)) {
        this.columns.selected = this.columns.selected.filter(item => item !== column)
      } else {
        this.columns.selected.unshift(column)
      }
    },

    addUserFields () {
      for (const userField of this.filteredUserFields) {
        const userFieldIndex = this.columnsAll.findIndex(item => item.name === `user-field-${userField.id}`)
        if (userFieldIndex === -1) {
          this.columnsAll.push({
            name: `user-field-${userField.id}`
          })
        }
      }
    },

    selectAll () {
      if (this.columns.selected && Array.isArray(this.columns.selected) && this.columns.selected.length === this.columnsFiltered.length) {
        this.$store.dispatch('browserProfiles/setColumns', { key: 'selected', value: [] })
      } else {
        const pushedColumns = this.columns.selected.concat([])
        this.columnsFiltered.forEach(column => {
          if (!this.columns.selected.includes(column.name)) {
            pushedColumns.push(column.name)
          }
        })

        this.$store.dispatch('browserProfiles/setColumns', { key: 'selected', value: pushedColumns })
      }
    },

    userFieldName (id) {
      const userField = this.filteredUserFields.find(item => parseInt(item.id, 10) === parseInt(id, 10))

      if (userField) {
        return userField.name
      }

      return this.$t('columns.browserProfiles.noSuchUserfield')
    }
  }
}
</script>
