<template>
  <v-card>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="usersMainTable"
      v-model="users.selected"
      :items="users.all"
      item-key="id"
      :height="innerHeight - 46 - 32 - 37"
      :headers="cols"
      fixed-header
      :items-per-page="footerOptions.itemsPerPage"
      hide-default-footer
      :loading="loading.mainTable"
      :custom-sort="customSort"
      :sort-by="sortBy()"
      :sort-desc="sortDesc()"
      class="anty-main-table users-main-table"
    >
      <!-- ПОЛЬЗОВАТЕЛЬ -->
      <template #[`item.user`]="{item: user}">
        <span
          class="anty-main-table-link"
          @click="editUser(user)"
        >
          {{ user.displayName ? user.displayName : user.username }}
        </span>
        <div
          v-if="user.displayName"
          style="color: #9E9E9E; font-size: 12px;"
        >
          {{ user.username }}
        </div>
      </template>

      <!-- РОЛЬ -->
      <template #[`item.role`]="{item: user}">
        {{ $t(`users.roles.${user.role}`) }}
      </template>

      <!-- ФУТЕР -->
      <template #footer>
        <pagination
          :disable-pagination="loading.mainTable"
          go-to-page-action="users/loadUsers"
          :pagination="pagination"
          :footer-options="footerOptions"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import customSort from '@/mixins/customSort.js'
import Pagination from '../../parts/Pagination'

export default {
  name: 'UsersMainTable',
  components: {
    Pagination
  },
  mixins: [
    customSort
  ],
  computed: {
    ...mapGetters({
      loading: 'users/loading',
      innerHeight: 'main/innerHeight',
      pagination: 'users/pagination'
    }),
    ...mapFields('users', ['users']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.user'), value: 'user', width: 350 })
      cols.push({ text: this.$t('common.role'), value: 'role' })

      return cols
    },

    footerOptions () {
      const options = {}

      options.page = this.pagination.currentPage
      options.itemsPerPage = this.pagination.perPage

      return options
    },

    footerPagination () {
      const pagination = {}

      pagination.page = this.pagination.currentPage
      pagination.itemsPerPage = this.pagination.perPage
      pagination.pageStart = this.pagination.from - 1
      pagination.pageStop = this.pagination.to
      pagination.pageCount = this.pagination.lastPage
      pagination.itemsLength = this.pagination.total

      return pagination
    },
    pages () {
      const pages = []

      if (this.footerPagination && this.footerPagination.pageCount) {
        for (let i = 1; i <= this.footerPagination.pageCount; i++) {
          pages.push(i)
        }
      }

      return pages
    }
  },

  methods: {
    async editUser (user) {
      await this.$store.dispatch('users/setUserForEdit', this.$_.cloneDeep(user))
      await this.$store.dispatch('users/openDialog', 'edit')
    },

    updateFooterOptions (options) {
      const payload = {
        query: this.pagination.query,
        page: options.page,
        itemsPerPage: options.itemsPerPage
      }
      this.$store.dispatch('users/loadUsers', payload)
    },
    goToPage (page) {
      const payload = {
        page: page,
        itemsPerPage: this.pagination.perPage,
        query: this.pagination.query
      }
      this.$store.dispatch('users/loadUsers', payload)
    }
  }
}
</script>

<style>
.users-main-table table > thead > tr > th:first-child {
  padding-right: 0 !important;
}
</style>
