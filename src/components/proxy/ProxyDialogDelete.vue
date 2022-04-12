<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('proxy/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('proxy/closeDialog', 'delete')"
  >
    <v-card>
      <v-card-text class="pt-5">
        <h2>{{ $t('dialogs.confirmAction') }}</h2>
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('proxy/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          id="proxyActionDialogDeleteConfirmButton"
          color="primary"
          text
          :loading="loading"
          @click="deleteProxy"
        >
          {{ $t('common.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProxyDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      proxies: 'proxy/proxies',
      dialogs: 'proxy/dialogs',
      pagination: 'proxy/pagination'
    })
  },

  methods: {
    async deleteProxy () {
      try {
        this.loading = true

        const data = {
          ids: this.proxies.selected.map(item => parseInt(item.id, 10))
        }
        const response = await this.$store.dispatch('proxy/deleteProxies', data)

        if (response.status === 200) {
          const pagination = (
            localStorage.getItem('browser-profiles-pagination')
              ? JSON.parse(localStorage.getItem('browser-profiles-pagination'))
              : {}
          )
          pagination.proxies = []
          localStorage.setItem('browser-profiles-pagination', JSON.stringify(pagination))

          await this.$store.dispatch('browserProfiles/setFilter', { filter: 'proxies', data: [] })

          const identify = new this.$amplitude.Identify().add('proxies count', -data.ids.length)
          this.$amplitude.getInstance().identify(identify)

          data.ids.forEach(() => {
            this.$amplitude.getInstance().logEvent('Proxy Delete')
          })
        }

        const payload = {
          query: this.pagination.query,
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage
        }
        this.$store.dispatch('proxy/loadProxies', payload)
        this.$store.dispatch('proxy/closeDialog', 'delete')
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
