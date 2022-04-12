<template>
  <div>
    <dialog-create v-if="dialogs.create" />
    <dialog-delete v-if="dialogs.delete" />
    <topbar />
    <main-table />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MainTable from '../components/extensions/main-table/ExtensionsMainTable.vue'
import Topbar from '../components/extensions/topbar/ExtensionsTopbar.vue'
import DialogCreate from '../components/extensions/ExtensionsDialogCreate.vue'
import DialogDelete from '../components/extensions/ExtensionsDialogDelete.vue'

export default {
  name: 'Extensions',

  components: {
    MainTable,
    Topbar,
    DialogCreate,
    DialogDelete
  },

  computed: {
    ...mapGetters({
      dialogs: 'extensions/dialogs'
    })
  },

  async beforeCreate () {
    await this.$store.dispatch('extensions/clearAll')
  },

  created () {
    const payload = localStorage.getItem('extensions-pagination') ? JSON.parse(localStorage.getItem('extensions-pagination')) : {}
    this.$store.dispatch('extensions/loadExtensions', {
      page: payload.currentPage,
      itemsPerPage: payload.perPage
    })
  }
}
</script>
