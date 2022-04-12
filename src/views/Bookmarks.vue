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
import MainTable from '../components/bookmarks/main-table/BookmarksMainTable.vue'
import Topbar from '../components/bookmarks/topbar/BookmarksTopbar.vue'
import DialogCreate from '../components/bookmarks/BookmarksDialogCreate.vue'
import DialogDelete from '../components/bookmarks/BookmarksDialogDelete.vue'
import DialogEdit from '../components/bookmarks/BookmarksDialogEdit.vue'

export default {
  name: 'Bookmarks',

  components: {
    MainTable,
    Topbar,
    DialogCreate,
    DialogDelete,
    DialogEdit
  },

  computed: {
    ...mapGetters({
      dialogs: 'bookmarks/dialogs'
    })
  },

  async beforeCreate () {
    await this.$store.dispatch('bookmarks/clearAll')
  },

  created () {
    const payload = localStorage.getItem('bookmarks-pagination') ? JSON.parse(localStorage.getItem('bookmarks-pagination')) : {}
    this.$store.dispatch('bookmarks/loadBookmarks', {
      page: payload.currentPage,
      itemsPerPage: payload.perPage
    })
  }
}
</script>
