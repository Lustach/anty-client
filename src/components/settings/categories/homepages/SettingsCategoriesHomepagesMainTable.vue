<template>
  <div>
    <!-- ТАБЛИЦА -->
    <v-data-table
      id="settingsHomepagesMainTable"
      v-model="homepages.selected"
      show-select
      item-key="id"
      :items="allHomepages"
      :headers="cols"
      fixed-header
      class="anty-main-table"
      :loading="loading.mainTable"
      :footer-props="{'items-per-page-options': [10, 30, 50]}"
    >
      <!-- ГАЛОЧКА -->
      <template #[`item.data-table-select`]="{item: homepage}">
        <!-- {{ homepage.id }} -->
        <v-checkbox
          v-if="profile.role === 'admin' || ownHomepage(homepage.id)"
          :id="`checkbox-${homepage.id}`"
          hide-details
          :input-value="homepages.selected.findIndex(i => parseInt(i.id, 10) === parseInt(homepage.id, 10)) > -1"
          class="mt-0 pt-0 anty-main-table-checkbox"
          @click="selectMultipleItems(homepage)"
        />
      </template>

      <!-- НАЗВАНИЕ -->
      <template #[`item.name`]="{item: homepage}">
        <span v-if="profile.role !== 'admin' && !ownHomepage(homepage.id)">
          {{ homepage.name }}
        </span>
        <span
          v-else
          class="anty-linkable-span"
          @click="editDialog(homepage)"
        >
          {{ homepage.name }}
        </span>
      </template>

      <!-- ДОСТУП -->
      <template #[`item.access`]="{item: homepage}">
        <v-chip
          v-if="homepage.sharedToEntireTeam"
          outlined
          small
          label
          color="#737373"
          class="homepage-maintable-access-chip"
        >
          {{ $t('homepages.shared') }}
        </v-chip>
        <v-chip
          v-if="isPrivate(homepage) && !homepage.sharedToEntireTeam"
          outlined
          small
          label
          color="#737373"
          class="homepage-maintable-access-chip"
        >
          {{ $t('homepages.personal') }}
        </v-chip>
      </template>

      <!-- ОСНОВНОЙ САЙТ -->
      <template #[`item.mainWebsite`]="{item: homepage}">
        <v-chip
          v-for="mainWebsite in mainWebsitesList"
          :key="`item-mainWebsite-${mainWebsite.name}`"
          class="mr-1"
          outlined
          small
          label
          color="primary"
          :class="{'hide-main-website-tag': !homepage.mainWebsite.includes(mainWebsite.value)}"
        >
          <v-icon
            v-if="mainWebsite.value !== 'crypto'"
            :size="14"
            color="primary"
            class="mr-1"
          >
            {{ mainWebsite.icon }}
          </v-icon>
          <icon
            v-else-if="mainWebsite.value === 'crypto'"
            name="crypto"
            style="height: 16px; width: 16px;"
            class="mr-1 color-primary"
          />
          {{ mainWebsite.name }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import { icon } from '@/assets/icons'

export default {
  name: 'SettingsCategoriesHomepagesMainTable',

  components: {
    icon
  },

  data () {
    return {
      mainWebsitesList: [
        { name: this.$t('common.websitesAll'), value: 'all', icon: 'fas fa-globe' },
        { name: this.$t('common.websiteNo'), value: 'none', icon: 'fas fa-times' },
        { name: 'Facebook', value: 'facebook', icon: 'fab fa-facebook-square' },
        { name: 'Google', value: 'google', icon: 'fab fa-google' },
        { name: 'TikTok', value: 'tiktok', icon: 'fab fa-tiktok' },
        { name: 'VK', value: 'vk', icon: 'fab fa-vk' },
        { name: 'Crypto', value: 'crypto' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      loading: 'settingsHomepages/loading'
    }),
    ...mapFields('settingsHomepages', ['homepages']),

    cols () {
      const cols = []

      cols.push({ text: this.$t('common.name'), value: 'name' })
      cols.push({ text: this.$t('common.mainWebsite'), value: 'mainWebsite', sortable: false })
      cols.push({ text: this.$t('common.access'), value: 'access', sortable: false })

      return cols
    },

    allHomepages () {
      if (this.homepages.all.length) {
        return this.homepages.all.map(i => {
          i.isSelectable = this.profile.role === 'admin' || this.ownHomepage(i.id)
          return i
        })
      }
      return []
    }
  },

  created () {
    this.$store.dispatch('settingsHomepages/loadAllHomepages')
  },

  methods: {
    isPrivate (homepage) {
      return parseInt(homepage.userId, 10) === parseInt(this.profile.id, 10)
    },
    async editDialog (homepage) {
      await this.$store.dispatch('settingsHomepages/setHomepageForEdit', this.$_.cloneDeep(homepage))
      this.$store.dispatch('settingsHomepages/openDialog', 'edit')
    },

    ownHomepage (id) {
      for (const i of this.homepages.all) {
        if (parseInt(i.id, 10) === parseInt(id, 10)) {
          return parseInt(this.profile.id, 10) === parseInt(i.userId, 10)
        }
      }
    },

    selectMultipleItems (homepage) {
      const selectedHomepageIndex = this.homepages.selected.findIndex(i => parseInt(i.id, 10) === parseInt(homepage.id, 10))
      if (selectedHomepageIndex > -1) {
        this.$store.dispatch('settingsHomepages/deselectHomepage', homepage)
      } else {
        this.$store.dispatch('settingsHomepages/selectHomepage', homepage)
      }
    }
  }
}
</script>
<style>
.hide-main-website-tag {
  display: none !important;
}
.homepage-maintable-access-chip .v-chip__content {
  width: 50px;
  justify-content: center;
}
.theme--light .homepage-maintable-access-chip .v-chip__content {
  color: rgba(0, 0, 0, 0.87);
}
.theme--dark .homepage-maintable-access-chip .v-chip__content {
  color: #FFFFFF;
}
</style>
