<template>
  <div>
    <dialog-create v-if="dialogs.create" />
    <dialog-delete v-if="dialogs.delete" />
    <dialog-edit v-if="dialogs.edit" />
    <dialog-share v-if="dialogs.share" />
    <topbar />
    <main-table />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MainTable from '../components/proxy/main-table/ProxyMainTable.vue'
import Topbar from '../components/proxy/topbar/ProxyTopbar.vue'
import DialogCreate from '../components/proxy/ProxyDialogCreate.vue'
import DialogDelete from '../components/proxy/ProxyDialogDelete.vue'
import DialogEdit from '../components/proxy/ProxyDialogEdit.vue'
import DialogShare from '../components/proxy/ProxyDialogShare.vue'

export default {
  name: 'Proxy',

  components: {
    MainTable,
    Topbar,
    DialogCreate,
    DialogDelete,
    DialogEdit,
    DialogShare
  },

  computed: {
    ...mapGetters({
      dialogs: 'proxy/dialogs',
      pagination: 'proxy/pagination'
    })
  },

  async beforeCreate () {
    await this.$store.dispatch('proxy/clearAll')
  },

  created () {
    const payload = localStorage.getItem('proxy-pagination') ? JSON.parse(localStorage.getItem('proxy-pagination')) : {}
    this.$store.dispatch('proxy/loadProxies', {
      page: payload.currentPage,
      itemsPerPage: payload.perPage
    })

    this.$store.dispatch('users/loadAllUsers')
  }
}
</script>
