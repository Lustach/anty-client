<template>
  <div>
    <v-progress-circular
      v-if="proxies.checking.includes(proxy.id)"
      :size="18"
      :width="2"
      color="grey"
      class="mr-2"
      indeterminate
    />
    <span
      class="anty-main-table-link"
      @click="edit"
    >
      {{ proxy.name }}
    </span>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ProxyMainTableName',

  props: {
    proxy: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  computed: {
    ...mapGetters({
      proxies: 'proxy/proxies'
    })
  },

  methods: {
    async edit () {
      await this.$store.dispatch('proxy/setProxyForEdit', this.proxy)
      this.$store.dispatch('proxy/openDialog', 'edit')
    }
  }
}
</script>
