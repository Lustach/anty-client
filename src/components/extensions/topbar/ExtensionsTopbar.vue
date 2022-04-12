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
            id="extensionsDeleteButton"
            color="primary"
            icon
            :disabled="extensions.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('extensions/openDialog', 'delete')"
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
            id="extensionsCreateButton"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('extensions/openDialog', 'create')"
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
        id="extensionsSearchField"
        ref="extensionsSearchField"
        v-model="extensionsSearchField"
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
  name: 'ExtensionsTopbar',

  data () {
    return {
      extensionsSearchField: '',
      nameSearchText: ''
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'extensions/dialogs',
      mainDialogs: 'main/dialogs',
      pagination: 'extensions/pagination'
    }),
    ...mapFields('extensions', ['extensions'])
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
        this.$refs.extensionsSearchField.focus()
      }

      if (!dialogOpened && this.$refs.extensionsSearchField.isFocused && e.keyCode === 27) {
        this.$refs.extensionsSearchField.blur()
        this.extensionsSearchField = ''
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
          this.$store.dispatch('extensions/loadExtensions', payload)
        }
      }, 500)
    }
  }
}
</script>
