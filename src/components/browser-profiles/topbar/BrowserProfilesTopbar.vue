<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ФИЛЬТР БАР -->
    <filters-bar
      v-if="showFilters"
      :show="showFilters"
      @close="showFilters = false"
    />

    <!-- ЛЕВАЯ СТОРОНА -->
    <div
      ref="tags_line"
      class="adsmanager-maintable-tags"
    >
      <v-chip
        v-for="(tag, key ) in sortedTags"
        :id="`adsmanager-maintable-${tag.name}`"
        :key="`tag${tag.name}`"
        style="cursor: pointer;"
        outlined
        :color="filters.tags.includes(tag.name) ? 'primary' : '#616161'"
        :style="{ visibility:key > 15 ? 'hidden' : 'visible' }"
        label
        class="mr-2"
        small
        @click="filterTags(tag)"
      >
        {{ tag.name }}
      </v-chip>
    </div>

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- АЛЕРТ ОШИБКИ ПЛАНА -->
      <v-alert
        v-if="disableUi"
        color="error"
        class="mr-2 mb-0 py-0 d-flex align-center disable-ui-alert"
        type="error"
        text
        dense
        height="38"
      >
        {{ disableUiMessage }}
        <v-btn
          color="success"
          x-small
          class="ml-2"
          @click="openExternalLink(`https://anty.dolphin.ru.com/panel/#/overview?token=${remoteApiToken}`)"
        >
          {{ disableUiAlertButton }}
        </v-btn>
      </v-alert>

      <!-- НОВЫЙ ПРОФИЛЬ -->
      <v-btn
        v-if="showFullButton"
        id="browserProfilesDialogAddButton"
        class="mx-2"
        color="primary"
        :disabled="disableUi || disableButton"
        @click="openMainDialog"
      >
        <ion-icon
          name="add-outline"
          style="font-size: 26px;"
        />
        {{ $t('common.createProfile') }}
      </v-btn>
      <v-tooltip
        v-else
        bottom
      >
        <template #activator="{ on }">
          <v-btn
            id="browserProfilesDialogAddButton"
            class="mx-2"
            color="primary"
            icon
            :disabled="disableUi || disableButton"
            v-on="on"
            @click="openMainDialog"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.createProfile') }}</span>
      </v-tooltip>

      <!-- ФИЛЬТРЫ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="browserProfilesFiltersButton"
            class="mx-2"
            color="primary"
            icon
            v-on="on"
            @click="showFilters = true"
          >
            <v-badge
              :value="activeFiltersCount > 0"
              overlap
              color="red"
              :content="activeFiltersCount"
            >
              <ion-icon
                name="filter-outline"
                style="font-size: 22px;"
              />
            </v-badge>
          </v-btn>
        </template>
        <span>{{ $t('common.filters') }}</span>
      </v-tooltip>

      <!-- ИМПОРТ АККАУНТОВ -->
      <!-- <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            class="mx-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('browserProfiles/openDialog', 'add')"
          >
            <ion-icon
              name="cloud-upload-outline"
              style="font-size: 22px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.import') }}</span>
      </v-tooltip> -->

      <!-- ОБНОВИТЬ СПИСОК ПРОФИЛЕЙ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="browserProfilesRefreshBrowserProfilesButton"
            class="ml-2 mr-4"
            color="primary"
            icon
            :loading="refreshLoading"
            v-on="on"
            @click="refreshBrowserProfiles"
          >
            <ion-icon
              name="sync-outline"
              style="font-size: 22px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.syncProfilesList') }}</span>
      </v-tooltip>

      <!-- ПОИСК -->
      <v-text-field
        id="browserProfileSearch"
        ref="browserProfileSearch"
        v-model="browserProfileSearch"
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
import FiltersBar from '../filters-bar/BrowserProfilesFiltersBar.vue'
import EmptyBrowserProfile from '@/constants/browserProfiles/emptyBrowserProfile.js'
import EmptyBrowserProfileForMultipleImport from '@/constants/browserProfiles/emptyBrowserProfileForMultipleImport.js'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'BrowserProfilesTopbar',

  components: {
    FiltersBar
  },

  data () {
    return {
      moment,
      refreshLoading: false,
      nameSearchText: '',
      browserProfileSearch: '',
      tags: [],
      showFilters: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'browserProfiles/dialogs',
      mainDialogs: 'main/dialogs',
      browserProfiles: 'browserProfiles/browserProfiles',
      sortedTags: 'browserProfiles/sortedTags',
      filters: 'browserProfiles/filters',
      pagination: 'browserProfiles/pagination',
      subscription: 'main/subscription',
      disableUi: 'main/disableUi'
    }),

    activeFiltersCount () {
      let count = 0

      if (!this.filters) return 0

      if (this.filters.tags &&
      this.filters.tags !== null &&
      this.filters.tags.length > 0) {
        count++
      }

      if (this.filters.statuses &&
      this.filters.statuses !== null &&
      this.filters.statuses.length > 0) {
        count++
      }

      if (this.filters.mainWebsites &&
      this.filters.mainWebsites !== null &&
      this.filters.mainWebsites.length > 0) {
        count++
      }

      if (this.filters.proxies &&
      this.filters.proxies !== null &&
      this.filters.proxies.length > 0) {
        count++
      }

      if (this.filters.users &&
      this.filters.users !== null &&
      this.filters.users.length > 0) {
        count++
      }

      return count
    },

    showFullButton () {
      if (this.subscription.browserProfiles && this.subscription.browserProfiles.count < 3) {
        return true
      }
      return false
    },

    disableUiMessage () {
      const profilesCount = this.subscription.browserProfiles?.count
      const profilesLimit = this.subscription.browserProfiles?.limit
      let profilesLimitExceeded = false

      if (profilesCount !== undefined && profilesLimit !== undefined) {
        profilesLimitExceeded = profilesCount >= profilesLimit
      }

      const usersCount = this.subscription.users?.count
      const usersLimit = this.subscription.users?.limit
      let usersLimitExceeded = false

      if (usersCount !== undefined && usersLimit !== undefined) {
        usersLimitExceeded = usersCount >= usersLimit
      }

      if (profilesLimitExceeded || usersLimitExceeded) {
        return this.$t('common.limitsOverflowedMessage')
      }
      return this.$t('common.subscriptionExpiredMessage')
    },

    disableUiAlertButton () {
      const profilesCount = this.subscription.browserProfiles?.count
      const profilesLimit = this.subscription.browserProfiles?.limit
      let profilesLimitExceeded = false

      if (profilesCount !== undefined && profilesLimit !== undefined) {
        profilesLimitExceeded = profilesCount >= profilesLimit
      }

      const usersCount = this.subscription.users?.count
      const usersLimit = this.subscription.users?.limit
      let usersLimitExceeded = false

      if (usersCount !== undefined && usersLimit !== undefined) {
        usersLimitExceeded = usersCount >= usersLimit
      }

      if (profilesLimitExceeded || usersLimitExceeded) {
        return this.$t('common.upgrade')
      }
      return this.$t('common.renew')
    },

    remoteApiToken () {
      return localStorage.getItem('remoteApiToken')
    },

    disableButton () {
      const count = this.subscription.browserProfiles?.count
      const limit = this.subscription.browserProfiles?.limit

      if (count !== undefined && limit !== undefined) {
        return count >= limit
      }

      return false
    }
  },
  created () {
    const pagination = localStorage.getItem('browser-profiles-pagination') ? JSON.parse(localStorage.getItem('browser-profiles-pagination')) : null
    if (pagination) {
      if (!this.$_.isEmpty(pagination.users)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'users', data: pagination.users })
      }
      if (!this.$_.isEmpty(pagination.tags)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'tags', data: pagination.tags })
      }
      if (!this.$_.isEmpty(pagination.statuses)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'statuses', data: pagination.statuses })
      }
      if (!this.$_.isEmpty(pagination.mainWebsites)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'mainWebsites', data: pagination.mainWebsites })
      }
      if (!this.$_.isEmpty(pagination.proxies)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'proxies', data: pagination.proxies })
      }
    }

    document.addEventListener('keyup', this.focusSearch)
  },

  mounted () {
    this.displayTags()
    window.addEventListener('resize', this.displayTags)

    this.$refs.tags_line.addEventListener('wheel', this.scrollTags)
  },
  updated () {
    this.$nextTick(this.displayTags)
  },
  destroyed () {
    document.removeEventListener('keyup', this.focusSearch)
    window.removeEventListener('resize', this.displayTags)
  },

  methods: {
    openExternalLink (url) {
      this.localApi.post('/open-external-link', { url })
    },

    async openMainDialog () {
      await this.$store.dispatch('browserProfiles/setEmptyBrowserProfile', this.$_.cloneDeep(EmptyBrowserProfile))
      await this.$store.dispatch('browserProfilesMultipleImport/setEmptyBrowserProfile', this.$_.cloneDeep(EmptyBrowserProfileForMultipleImport))
      this.$store.dispatch('browserProfiles/openDialog', 'mainDialog')
    },

    filterTags (tag) {
      if (this.filters.tags.includes(tag.name)) {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'tags', data: this.filters.tags.filter(item => item !== tag.name) })
      } else {
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'tags', data: this.filters.tags.concat([tag.name]) })
      }
    },

    async refreshBrowserProfiles () {
      try {
        this.refreshLoading = true

        if (!this.disableUi) {
          this.$store.dispatch('proxy/loadAllProxies')
        }

        await this.$store.dispatch('browserProfiles/loadCurrentPage')
      } catch (_) {
        // Do nothing
      } finally {
        this.refreshLoading = false
      }
    },

    search (name) {
      this.nameSearchText = name
      setTimeout(async () => {
        if (name === this.nameSearchText) {
          const payload = {
            query: name,
            tags: this.pagination.tags,
            mainWebsites: this.pagination.mainWebsites,
            proxies: this.pagination.proxies,
            itemsPerPage: this.pagination.perPage,
            statuses: this.pagination.statuses,
            users: this.pagination.users
          }
          this.$store.dispatch('browserProfiles/loadBrowserProfiles', payload)
        }
      }, 500)
    },

    async displayTags () {
      const tagsWrap = document.querySelector('.adsmanager-maintable-tags')
      if (!tagsWrap) return
      let allTagsWidth = 0

      for (const item of tagsWrap.childNodes) {
        allTagsWidth += (item.offsetWidth + 7)
        const tagName = item.querySelector('.v-chip__content').innerHTML.trim()
        const tag = document.getElementById(`adsmanager-maintable-${tagName}`)

        if (tag && allTagsWidth - (this.$refs.tags_line.scrollLeft + 90) > (tagsWrap.offsetParent.offsetWidth - 568)) {
          tag.style.visibility = 'hidden'
        } else if (tag) {
          tag.style.visibility = 'visible'
        }
      }
    },

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
        this.$refs.browserProfileSearch.focus()
      }
      if (!dialogOpened && this.$refs.browserProfileSearch.isFocused && e.keyCode === 27) {
        this.$refs.browserProfileSearch.blur()
        this.browserProfileSearch = ''
        this.search('')
      }
    },

    scrollTags (e) {
      e.preventDefault()
      this.$refs.tags_line.scrollLeft += e.deltaY / 2
      this.displayTags()
    }
  }
}
</script>
<style>
.disable-ui-alert .v-alert__content {
  display: flex;
  align-items: center;
  width: max-content;
}
</style>
