<template>
  <v-dialog
    :value="dialogs.delete"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('bookmarks/closeDialog', 'delete')"
    @keydown.esc="$store.dispatch('bookmarks/closeDialog', 'delete')"
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
          @click="$store.dispatch('bookmarks/closeDialog', 'delete')"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          :loading="loading"
          @click="deleteBookmarks"
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
  name: 'BookmarksDialogDelete',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      bookmarks: 'bookmarks/bookmarks',
      dialogs: 'bookmarks/dialogs',
      pagination: 'bookmarks/pagination'
    })
  },

  methods: {
    async deleteBookmarks () {
      try {
        this.loading = true

        const data = {
          ids: this.bookmarks.selected.map(item => parseInt(item.id, 10))
        }
        await this.$store.dispatch('bookmarks/deleteBookmarks', data)

        const payload = {
          query: this.pagination.query,
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage
        }
        this.$store.dispatch('bookmarks/loadBookmarks', payload)
        this.$store.dispatch('bookmarks/closeDialog', 'delete')
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
