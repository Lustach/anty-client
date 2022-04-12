<template>
  <v-dialog
    :value="dialogs.create"
    width="700"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('settings.homepagesCreate') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="closeDialog"
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
          :value="mainWebsite"
          mandatory
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
            @click="handleMainWebsiteClick(mainWebsiteItem.value)"
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

        <!-- ИНПУТ ДЛЯ ПАРСИНГА СТАРТОВЫХ СТРАНИЦ -->
        <v-textarea
          v-model="inputRaw"
          :label="$t('common.data')"
          :placeholder="`${$t('common.name').toUpperCase()}::URL`"
          class="transparent-scrollbar"
          persistent-placeholder
          rows="5"
          :spellcheck="false"
          outlined
          hide-details
          @input="parseHomepages"
        />

        <v-alert
          v-if="warning"
          class="mb-0 mt-2"
          type="warning"
          text
          dense
        >
          {{ $t('homepages.pagesLimitWarning') }}
        </v-alert>

        <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
        <v-switch
          v-if="profile.role === 'admin'"
          v-model="sharedToEntireTeam"
          :label="$t('common.sharedToEntireTeam')"
          hide-details
        />
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          small
          text
          color="grey"
          @click="closeDialog"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          small
          text
          color="primary"
          :loading="loading"
          :disabled="$_.isEmpty(parsedHomepages) || warning"
          @click="createHomepages"
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
  name: 'SettingsCategoriesHomepagesDialogCreate',

  components: {
    icon
  },

  data () {
    return {
      warning: false,
      loading: false,
      mainWebsite: ['all'],
      sharedToEntireTeam: false,
      inputRaw: '',
      parsedHomepages: [],
      mainWebsitesList: [
        { name: this.$t('common.websitesAll'), value: 'all', icon: 'fas fa-globe' },
        { name: this.$t('common.websiteNo'), value: 'none', icon: 'fas fa-times' },
        { name: 'Facebook', value: 'facebook', icon: 'fab fa-facebook-square' },
        { name: 'Google', value: 'google', icon: 'fab fa-google' },
        { name: 'TikTok', value: 'tiktok', icon: 'fab fa-tiktok' },
        { name: 'Crypto', value: 'crypto' }
      ]
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'settingsHomepages/dialogs',
      homepages: 'settingsHomepages/homepages'
    }),

    ownHomepagesCount () {
      if (this.homepages.all.length && this.profile.id) {
        return this.homepages.all.filter(i => parseInt(i.userId, 10) === parseInt(this.profile.id, 10)).length
      }

      return 0
    }
  },

  methods: {
    closeDialog () {
      this.$store.dispatch('settingsHomepages/closeDialog', 'create')
    },

    handleMainWebsiteClick (mainWebsite) {
      switch (mainWebsite) {
        case 'all':
          this.mainWebsite = ['all']
          break
        case 'none':
          this.mainWebsite = ['none']
          break
        default:
          this.mainWebsite = this.mainWebsite.filter(i => i !== 'none')
          this.mainWebsite = this.mainWebsite.filter(i => i !== 'all')
          if (this.mainWebsite.includes(mainWebsite)) {
            this.mainWebsite = this.mainWebsite.filter(i => i !== mainWebsite)
          } else {
            this.mainWebsite.push(mainWebsite)
          }
          break
      }

      switch (this.mainWebsite.length) {
        case 0:
          this.mainWebsite = ['none']
          break
        case 4:
          this.mainWebsite = ['all']
          break
      }
    },

    parseHomepages (input) {
      this.parsedHomepages = []

      const lines = input.split('\n')
      if (lines.length === 0) return

      lines.forEach(line => {
        if (!line.trim()) return

        const splittedLine = line.split('::')
        if (splittedLine.length !== 2 || splittedLine[1] === '') return

        if ((this.ownHomepagesCount + this.parsedHomepages.length) < 10) {
          if (this.warning) this.warning = false

          this.parsedHomepages.push({
            name: splittedLine[0],
            url: splittedLine[1]
          })
        } else {
          if (!this.warning) this.warning = true
        }
      })
    },

    async createHomepages () {
      try {
        this.loading = true

        await Promise.all(this.parsedHomepages.map(
          homepage => {
            const data = {
              name: homepage.name,
              url: homepage.url,
              mainWebsite: this.mainWebsite
            }
            if (this.profile.role === 'admin') {
              data.sharedToEntireTeam = this.sharedToEntireTeam
            }

            return this.api.post('/homepages', data)
          }
        )).then(() => {
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.created') })

          this.$store.dispatch('settingsHomepages/loadAllHomepages')
          this.closeDialog()
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }

}
</script>
