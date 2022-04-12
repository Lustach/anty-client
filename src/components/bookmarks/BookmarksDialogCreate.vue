<template>
  <v-dialog
    :value="dialogs.create"
    width="700"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('bookmarks/closeDialog', 'create')"
    @keydown.esc="$store.dispatch('bookmarks/closeDialog', 'create')"
  >
    <v-card>
      <!-- ХЭДЕР ДИАЛОГА -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('common.create') + ' ' + $t('common.bookmarks').toLowerCase() }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            id="bookmarksDialogCreateCloseButton"
            icon
            @click="$store.dispatch('bookmarks/closeDialog', 'create')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-5">
        <!-- САЙТЫ -->
        <v-btn-toggle
          id="bookmarksDialogCreateMainWebsiteButtonToggle"
          v-model="mainWebsite"
          mandatory
          multiple
          class="mb-4"
        >
          <v-btn
            v-for="mainWebsiteItem in mainWebsitesList"
            :id="`bookmarksDialogCreateMainWebsite${capitalize(mainWebsiteItem.value)}Button`"
            :key="`item-mainWebsite-${mainWebsiteItem.name}`"
            :value="mainWebsiteItem.value"
            small
            color="primary"
            outlined
            @click="bookmarksButtonClick(mainWebsiteItem.value)"
          >
            <v-icon
              v-if="mainWebsiteItem.value !== 'crypto'"
              size="16"
              color="primary"
              class="mr-1"
            >
              {{ mainWebsiteItem.icon }}
            </v-icon>
            <icon
              v-else-if="mainWebsiteItem.value === 'crypto'"
              name="crypto"
              style="height: 20px; width: 20px;"
              class="mr-1 color-primary"
            />
            {{ mainWebsiteItem.name }}
          </v-btn>
        </v-btn-toggle>

        <!-- ИНПУТ ДЛЯ ПАРСИНГА ЗАКЛАДОК -->
        <v-textarea
          id="bookmarksDialogCreateMainWebsiteTextarea"
          v-model="inputRaw"
          :label="$t('common.data')"
          :placeholder="`${$t('common.name').toUpperCase()}::URL`"
          persistent-placeholder
          rows="5"
          :spellcheck="false"
          outlined
          hide-details
          @input="parseBookmark"
        />

        <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
        <v-switch
          id="bookmarksDialogCreateMainWebsiteSharedToEntireTeam"
          v-model="sharedToEntireTeam"
          :label="$t('common.sharedToEntireTeam')"
          hide-details
        />
      </v-card-text>

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('bookmarks/closeDialog', 'create')"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="bookmarksDialogCreateCreateButton"
          color="primary"
          text
          :loading="loading"
          :disabled="$_.isEmpty(parsedBookmarks) || $_.isEmpty(mainWebsite)"
          @click="createBookmarks"
        >
          {{ $t('common.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { icon } from '@/assets/icons'

export default {
  name: 'BookmarksDialogCreate',

  components: {
    icon
  },

  data () {
    return {
      loading: false,
      sharedToEntireTeam: false,
      inputRaw: '',
      mainWebsite: [],
      parsedBookmarks: [],
      mainWebsitesList: [
        {
          name: this.$t('common.websitesAll'),
          value: 'all',
          icon: 'fas fa-globe'
        },
        {
          name: this.$t('common.websiteNo'),
          value: 'none',
          icon: 'fas fa-times'
        },
        {
          name: 'Facebook',
          value: 'facebook',
          icon: 'fab fa-facebook-square'
        },
        {
          name: 'Google',
          value: 'google',
          icon: 'fab fa-google'
        },
        {
          name: 'TikTok',
          value: 'tiktok',
          icon: 'fab fa-tiktok'
        },
        {
          name: 'Crypto',
          value: 'crypto'
        }
      ]
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
    bookmarksButtonClick (value) {
      setTimeout(() => {
        if (value === 'all') {
          if (this.mainWebsite.includes('all')) {
            this.mainWebsite = ['all']
          }
        } else if (value === 'none') {
          if (this.mainWebsite.includes('none')) {
            this.mainWebsite = ['none']
          }
        } else {
          const indexAll = this.mainWebsite.indexOf('all')
          const indexNone = this.mainWebsite.indexOf('none')
          if (indexAll !== -1) {
            this.mainWebsite.splice(indexAll, 1)
          }
          if (indexNone !== -1) {
            this.mainWebsite.splice(indexNone, 1)
          }
        }
      }, 50)
    },
    parseBookmark (input) {
      this.parsedBookmarks = []

      const lines = input.split('\n')
      if (lines.length === 0) return

      lines.forEach(line => {
        if (!line.trim()) return

        const splittedLine = line.split('::')
        if (splittedLine.length !== 2 || splittedLine[1] === '') return

        this.parsedBookmarks.push({
          name: splittedLine[0],
          url: splittedLine[1]
        })
      })
    },

    async createBookmarks () {
      try {
        this.loading = true

        await Promise.all(this.parsedBookmarks.map(
          bookmark => this.api.post('/bookmarks', {
            name: bookmark.name,
            url: bookmark.url,
            sharedToEntireTeam: this.sharedToEntireTeam,
            mainWebsite: this.mainWebsite
          })
        )).then(() => {
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.created') })

          const payload = {
            query: this.pagination.query,
            page: this.pagination.currentPage,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('bookmarks/loadBookmarks', payload)
          this.$store.dispatch('bookmarks/closeDialog', 'create')
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    }
  }
}
</script>
