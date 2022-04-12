<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ЛЕВАЯ СТОРОНА -->
    <div />

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- УДАЛИТЬ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="bookmarksDeleteButton"
            color="primary"
            icon
            :disabled="bookmarks.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('bookmarks/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 20px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.delete') }}</span>
      </v-tooltip>

      <!-- СОЗДАТЬ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="bookmarksCreateButton"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('bookmarks/openDialog', 'create')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.create') }}</span>
      </v-tooltip>

      <!-- ПОИСК -->
      <v-text-field
        id="bookmarksSearchField"
        ref="bookmarksSearchField"
        v-model="bookmarksSearchField"
        class="anty-topbar-search-field"
        :label="$t('browserProfiles.searchField')"
        dense
        solo
        single-line
        hide-details
        clearable
        clear-icon="fas fa-times"
        :spellcheck="false"
        @input="search"
      >
        <template #prepend-inner>
          <ion-icon
            name="search-outline"
            class="mx-1"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BookmarksTopbar',

  data () {
    return {
      bookmarksSearchField: '',
      nameSearchText: ''
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'bookmarks/dialogs',
      mainDialogs: 'main/dialogs',
      pagination: 'bookmarks/pagination'
    }),
    ...mapFields('bookmarks', ['bookmarks'])
  },

  created () {
    document.addEventListener('keyup', this.focusSearch)
  },

  destroyed () {
    document.removeEventListener('keyup', this.focusSearch)
  },

  methods: {
    focusSearch (e) {
      let dialogOpened = false
      let mainDialogOpened = false

      for (const dialog of Object.values(this.dialogs)) {
        if (dialog) {
          dialogOpened = true
        }
      }
      for (const dialog of Object.values(this.mainDialogs)) {
        if (dialog) {
          mainDialogOpened = true
        }
      }
      if (!dialogOpened && !mainDialogOpened && (e.keyCode === 111 || e.keyCode === 191)) {
        this.$refs.bookmarksSearchField.focus()
      }

      if (!dialogOpened && this.$refs.bookmarksSearchField.isFocused && e.keyCode === 27) {
        this.$refs.bookmarksSearchField.blur()
        this.bookmarksSearchField = ''
        this.search('')
      }
    },

    search (name) {
      this.nameSearchText = name
      setTimeout(async () => {
        if (name === this.nameSearchText) {
          const payload = {
            query: name,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('bookmarks/loadBookmarks', payload)
        }
      }, 500)
    }
  }
}
</script>
