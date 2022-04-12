<template>
  <v-navigation-drawer
    id="browserProfilesFiltersBar"
    :value="show"
    temporary
    right
    absolute
    style="position: fixed; top: 0; width: 400px; height: 100%; z-index: 99999;"
    @transitionend="$emit('close')"
  >
    <div style="padding: 16px">
      <div class="mb-4 d-flex align-center">
        <span>
          <v-btn
            id="browserProfilesFiltersBarCloseButton"
            color="grey"
            fab
            x-small
            outlined
            class="mr-2"
            @click="$emit('close')"
          >
            <v-icon :size="14">
              fas fa-chevron-right
            </v-icon>
          </v-btn>
        </span>
        <span>
          {{ $t('common.filters') }}
        </span>
      </div>

      <v-row class="anty-label-uniq-color">
        <!-- ФИЛЬТР ПО ЮЗЕРАМ -->
        <v-col
          v-if="profile && profile.role && ['admin', 'teamlead'].includes(profile.role)"
          cols="12"
        >
          <v-autocomplete
            id="browserProfilesFiltersBarUsersTextarea"
            :value="filters.users"
            :search-input.sync="filtersUsers"
            :item-value="user => user.id"
            :item-text="generateUserSelectItem"
            :items="computedUsers"
            :label="$t('common.users')"
            multiple
            small-chips
            deletable-chips
            clearable
            dense
            outlined
            hide-details
            class="densed-input"
            :disabled="profile && profile.role === 'user'"
            @change="filterByUsers"
          >
            <template #[`item`]="{item}">
              <!-- отображаемое имя -->
              <span>
                {{ item.displayName || item.username }}
                <span v-if="item.id === profile.id">({{ $t('common.you').toLowerCase() }})</span>
              </span>

              <!-- почта, если есть отображаемое имя -->
              <span
                v-if="item.displayName"
                style="font-size: 12px; margin-left: 8px; color: grey; padding-top: 4px;"
              >
                {{ item.username }}
              </span>
            </template>
          </v-autocomplete>
        </v-col>

        <!-- ФИЛЬТР ПО ТЕГАМ -->
        <v-col cols="12">
          <v-autocomplete
            id="browserProfilesFiltersBarTagsTextarea"
            :value="filters.tags"
            :search-input.sync="filtersTags"
            :item-value="item => item.name"
            :item-text="item => item.name"
            :items="computedTags"
            :label="$t('common.tags')"
            multiple
            small-chips
            deletable-chips
            clearable
            dense
            outlined
            hide-details
            class="densed-input"
            @change="filterByTags"
          />
        </v-col>

        <!-- ФИЛЬТР ПО СТАТУСУ -->
        <v-col cols="12">
          <v-autocomplete
            id="browserProfilesFiltersBarStatusesTextarea"
            :value="filters.statuses"
            :search-input.sync="filtersStatuses"
            :item-value="item => item.id"
            :item-text="item => item.name"
            :items="computedBrowserProfilesStatuses"
            :label="$t('common.statuses')"
            multiple
            small-chips
            clearable
            dense
            outlined
            hide-details
            class="densed-input"
            @change="filterByStatuses"
          >
            <template #[`item`]="{item}">
              <v-chip
                outlined
                label
                small
                :color="item.color"
                style="text-transform: uppercase; font-weight: bold; cursor: pointer;"
              >
                {{ item.name }}
              </v-chip>
            </template>
            <template #[`selection`]="{item}">
              <v-chip
                outlined
                label
                small
                :color="item.color"
                style="text-transform: uppercase; font-weight: bold; cursor: pointer;"
              >
                {{ item.name }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>

        <!-- ФИЛЬТР ПО ОСНОВНОМУ САЙТУ -->
        <v-col cols="12">
          <v-autocomplete
            id="browserProfilesFiltersBarMainWebsiteTextarea"
            :value="filters.mainWebsites"
            :search-input.sync="filtersMainWebsites"
            :item-text="item => item.name"
            :item-value="item => item.value"
            :items="websites"
            :label="$t('browserProfiles.mainWebsites')"
            multiple
            small-chips
            deletable-chips
            clearable
            dense
            outlined
            hide-details
            class="densed-input"
            @change="filterByMainWebsites"
          />
        </v-col>

        <!-- ФИЛЬТР ПО ПРОКСИ -->
        <v-col cols="12">
          <v-autocomplete
            id="browserProfilesFiltersBarProxyTextarea"
            :value="filters.proxies"
            :search-input.sync="filtersProxies"
            :item-text="item => item.name"
            :item-value="item => item.id"
            :items="proxiesTruncated"
            :label="$t('common.proxy')"
            multiple
            small-chips
            deletable-chips
            clearable
            dense
            outlined
            hide-details
            class="densed-input"
            @change="filterByProxies"
          />
        </v-col>
      </v-row>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesFiltersBar',

  props: {
    show: {
      type: Boolean,
      default: false
    },

    activeFiltersCount: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      filtersUsers: '',
      filtersStatuses: '',
      filtersTags: '',
      filtersMainWebsites: '',
      filtersProxies: '',
      allTags: [],
      websites: [
        {
          name: this.$t('browserProfiles.noWebsite'),
          value: 'none'
        },
        {
          name: 'Facebook',
          value: 'facebook'
        },
        {
          name: 'Google',
          value: 'google'
        },
        {
          name: 'TikTok',
          value: 'tiktok'
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
      browserProfiles: 'browserProfiles/browserProfiles',
      users: 'users/users',
      filters: 'browserProfiles/filters',
      browserProfilesStatuses: 'browserProfilesStatuses/statuses',
      sortedTags: 'browserProfiles/sortedTags',
      profile: 'main/profile'
    }),
    ...mapFields('proxy', ['proxies']),

    computedTags () {
      const tags = this.$_.cloneDeep(this.sortedTags)

      for (const i of this.filters.tags) {
        const existedTag = this.sortedTags.find(y => y.name === i)
        if (existedTag === undefined) {
          tags.push({
            count: 0,
            name: i
          })
        }
      }
      return tags
    },

    computedBrowserProfilesStatuses () {
      const statuses = this.browserProfilesStatuses.all.filter(item => !item.deleted)

      statuses.push({
        name: this.$t('browserProfiles.noStatus'),
        id: 'none',
        color: 'grey'
      })

      return statuses
    },

    computedUsers () {
      let users = []

      if (this.profile && this.profile.role === 'admin') {
        users = this.users.all
      }
      if (this.profile && this.profile.role === 'teamlead') {
        users = this.users.all.filter(item => item.teamleads && item.teamleads.includes(parseInt(this.profile.id, 10)))
      }

      return users
    },

    proxiesTruncated () {
      return this.proxies.all.map(proxy => ({
        ...proxy,
        ...{ name: proxy.name.length <= 45 ? proxy.name : proxy.name.slice(0, 45) + '...' }
      }))
    }
  },

  methods: {
    generateUserSelectItem (user) {
      let text

      if (user.displayName) {
        text = `${user.displayName} (${user.username})`
      } else {
        text = user.username
      }

      if (user.id === this.profile.id) {
        text += ` (${this.$t('common.you').toLowerCase()})`
      }

      return text
    },

    filterByUsers (users) {
      this.filtersUsers = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'users', data: users })
      this.$store.dispatch('browserProfiles/loadTags')
    },

    filterByTags (tags) {
      this.filtersTags = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'tags', data: tags })
    },

    filterByStatuses (statuses) {
      this.filtersStatuses = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'statuses', data: statuses })
    },

    filterByMainWebsites (mainWebsites) {
      this.filtersMainWebsites = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'mainWebsites', data: mainWebsites })
    },

    filterByProxies (proxies) {
      this.filtersProxies = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'proxies', data: proxies })
    }
  }
}
</script>
