<template>
  <div>
    <dialog-create v-if="dialogs.create" />
    <dialog-delete v-if="dialogs.delete" />
    <dialog-edit v-if="dialogs.edit" />
    <topbar />
    <main-table />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MainTable from '../components/users/main-table/UsersMainTable.vue'
import Topbar from '../components/users/topbar/UsersTopbar.vue'
import DialogCreate from '../components/users/UsersDialogCreate.vue'
import DialogDelete from '../components/users/UsersDialogDelete.vue'
import DialogEdit from '../components/users/UsersDialogEdit.vue'

export default {
  name: 'Users',

  components: {
    MainTable,
    Topbar,
    DialogCreate,
    DialogDelete,
    DialogEdit
  },

  computed: {
    ...mapGetters({
      dialogs: 'users/dialogs'
    })
  },

  async beforeCreate () {
    await this.$store.dispatch('users/clearAll')
  },

  created () {
    this.$store.dispatch('users/loadAllUsersForDialog')

    const payload = localStorage.getItem('users-pagination') ? JSON.parse(localStorage.getItem('users-pagination')) : {}
    this.$store.dispatch('users/loadUsers', {
      page: payload.currentPage,
      itemsPerPage: payload.perPage
    })
  }
}
</script>
