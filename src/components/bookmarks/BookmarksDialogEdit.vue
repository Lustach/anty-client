<template>
  <v-dialog
    :value="dialogs.edit"
    width="700"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('bookmarks/closeDialog', 'edit')"
    @keydown.esc="$store.dispatch('bookmarks/closeDialog', 'edit')"
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
          {{ $t('common.edit') + ' ' + name }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('bookmarks/closeDialog', 'edit')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text
        v-if="!$_.isEmpty(bookmarks.bookmarkForEdit)"
        class="pt-5"
      >
        <!-- САЙТЫ -->
        <v-btn-toggle
          v-model="bookmarks.bookmarkForEdit.mainWebsite"
          multiple
          class="mb-4"
        >
          <v-btn
            v-for="mainWebsiteItem in mainWebsitesList"
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

        <!-- НАЗВАНИЕ -->
        <v-text-field
          v-model="bookmarks.bookmarkForEdit.name"
          :label="$t('common.name')"
          outlined
          dense
          :error-messages="touched && $v.bookmarks.bookmarkForEdit.name.$error ? $t('common.fieldRequired') : ''"
          :hide-details="touched && $v.bookmarks.bookmarkForEdit.name.$error ? false : true"
          :spellcheck="false"
          class="mb-4"
        />

        <!-- URL -->
        <v-text-field
          v-model="bookmarks.bookmarkForEdit.url"
          label="URL"
          outlined
          dense
          :error-messages="touched && $v.bookmarks.bookmarkForEdit.url.$error ? $t('common.fieldRequired') : ''"
          :hide-details="touched && $v.bookmarks.bookmarkForEdit.url.$error ? false : true"
          :spellcheck="false"
        />

        <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
        <v-switch
          v-model="bookmarks.bookmarkForEdit.sharedToEntireTeam"
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
          @click="$store.dispatch('bookmarks/closeDialog', 'edit')"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          color="primary"
          text
          :loading="loading"
          :disabled="$_.isEqual(initialBookmark, bookmarks.bookmarkForEdit)"
          @click="touch"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'
import { icon } from '@/assets/icons'

export default {
  name: 'BookmarksDialogCreate',

  components: {
    icon
  },

  data () {
    return {
      name: '',
      initialBookmark: {},
      loading: false,
      touched: false,
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

  validations () {
    const bookmarks = {
      bookmarkForEdit: {
        name: {
          required
        },
        url: {
          required
        }
      }
    }

    return { bookmarks: bookmarks }
  },

  computed: {
    ...mapGetters({
      dialogs: 'bookmarks/dialogs',
      pagination: 'bookmarks/pagination'
    }),
    ...mapFields('bookmarks', ['bookmarks'])
  },

  watch: {
    'bookmarks.bookmarkForEdit.name' () {
      this.touched = false
    },
    'bookmarks.bookmarkForEdit.url' () {
      this.touched = false
    }
  },

  created () {
    this.initialBookmark = this.$_.cloneDeep(this.bookmarks.bookmarkForEdit)
    this.initialBookmark.sharedToEntireTeam = this.initialBookmark.sharedToEntireTeam === 1
    this.name = this.initialBookmark.name
  },

  methods: {
    bookmarksButtonClick (value) {
      setTimeout(() => {
        if (value === 'all') {
          if (this.bookmarks.bookmarkForEdit.mainWebsite.includes('all')) {
            this.bookmarks.bookmarkForEdit.mainWebsite = ['all']
          }
        } else if (value === 'none') {
          if (this.bookmarks.bookmarkForEdit.mainWebsite.includes('none')) {
            this.bookmarks.bookmarkForEdit.mainWebsite = ['none']
          }
        } else {
          const indexAll = this.bookmarks.bookmarkForEdit.mainWebsite.indexOf('all')
          const indexNone = this.bookmarks.bookmarkForEdit.mainWebsite.indexOf('none')
          if (indexAll !== -1) {
            this.bookmarks.bookmarkForEdit.mainWebsite.splice(indexAll, 1)
          }
          if (indexNone !== -1) {
            this.bookmarks.bookmarkForEdit.mainWebsite.splice(indexNone, 1)
          }
        }
      }, 50)
    },
    touch () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.editBookmarks()
      }
    },

    async editBookmarks () {
      try {
        this.loading = true

        const response = await this.api.patch(`/bookmarks/${this.bookmarks.bookmarkForEdit.id}`, {
          name: this.bookmarks.bookmarkForEdit.name,
          url: this.bookmarks.bookmarkForEdit.url,
          sharedToEntireTeam: this.bookmarks.bookmarkForEdit.sharedToEntireTeam,
          mainWebsite: this.bookmarks.bookmarkForEdit.mainWebsite
        })

        if (response.status === 200) {
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })

          const payload = {
            query: this.pagination.query,
            page: this.pagination.currentPage,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('bookmarks/loadBookmarks', payload)
          this.$store.dispatch('bookmarks/closeDialog', 'edit')
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
