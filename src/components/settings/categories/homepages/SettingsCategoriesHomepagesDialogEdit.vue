<template>
  <v-dialog
    :value="dialogs.edit"
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
          {{ $t('settings.homepages') }}
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
          :value="homepages.homepageForEdit.mainWebsite"
          :mandatory="homepages.homepageForEdit.mainWebsite.includes('vk') ? false : true"
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

        <!-- НАЗВАНИЕ -->
        <v-text-field
          v-model="homepages.homepageForEdit.name"
          :label="$t('common.name')"
          outlined
          dense
          :error-messages="$v.homepages.homepageForEdit.name.$error ? $t('common.fieldRequired') : ''"
          :hide-details="$v.homepages.homepageForEdit.name.$error ? false : true"
          :spellcheck="false"
          class="mb-4"
        />

        <!-- URL -->
        <v-text-field
          v-model="homepages.homepageForEdit.url"
          label="URL"
          outlined
          dense
          :error-messages="$v.homepages.homepageForEdit.url.$error ? $t('common.fieldRequired') : ''"
          :hide-details="$v.homepages.homepageForEdit.url.$error ? false : true"
          :spellcheck="false"
        />

        <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
        <v-switch
          v-if="profile.role === 'admin'"
          v-model="homepages.homepageForEdit.sharedToEntireTeam"
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
          :disabled="$_.isEqual(initialHomepage, homepages.homepageForEdit)"
          @click="saveHomepage"
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
  name: 'SettingsCategoriesHomepagesDialogEdit',

  components: {
    icon
  },

  data () {
    return {
      initialHomepage: {},
      loading: false,
      name: '',
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
    const homepages = {
      homepageForEdit: {
        name: {
          required
        },
        url: {
          required
        }
      }
    }

    return { homepages: homepages }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'settingsHomepages/dialogs'
    }),
    ...mapFields('settingsHomepages', ['homepages'])
  },

  watch: {
    'homepages.homepageForEdit': {
      deep: true,
      handler () {
        this.$v.$reset()
      }
    }
  },

  created () {
    this.initialHomepage = this.$_.cloneDeep(this.homepages.homepageForEdit)
    this.name = this.homepages.homepageForEdit.name
  },

  methods: {
    closeDialog () {
      this.$store.dispatch('settingsHomepages/closeDialog', 'edit')
    },

    handleMainWebsiteClick (mainWebsite) {
      switch (mainWebsite) {
        case 'all':
          this.homepages.homepageForEdit.mainWebsite = ['all']
          break
        case 'none':
          this.homepages.homepageForEdit.mainWebsite = ['none']
          break
        default:
          this.homepages.homepageForEdit.mainWebsite = this.homepages.homepageForEdit.mainWebsite.filter(i => i !== 'none')
          this.homepages.homepageForEdit.mainWebsite = this.homepages.homepageForEdit.mainWebsite.filter(i => i !== 'all')
          if (this.homepages.homepageForEdit.mainWebsite.includes(mainWebsite)) {
            this.homepages.homepageForEdit.mainWebsite = this.homepages.homepageForEdit.mainWebsite.filter(i => i !== mainWebsite)
          } else {
            this.homepages.homepageForEdit.mainWebsite.push(mainWebsite)
          }
          break
      }

      switch (this.homepages.homepageForEdit.mainWebsite.length) {
        case 0:
          this.homepages.homepageForEdit.mainWebsite = ['none']
          break
        case 4:
          this.homepages.homepageForEdit.mainWebsite = ['all']
          break
      }
    },

    async saveHomepage () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        try {
          this.loading = true

          const data = {
            name: this.homepages.homepageForEdit.name,
            url: this.homepages.homepageForEdit.url,
            mainWebsite: this.homepages.homepageForEdit.mainWebsite
          }

          if (this.profile.role === 'admin') {
            data.sharedToEntireTeam = this.homepages.homepageForEdit.sharedToEntireTeam
          }

          const response = await this.api.patch(`/homepages/${this.homepages.homepageForEdit.id}`, data)

          if (response.status === 200) {
            this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })

            this.$store.dispatch('settingsHomepages/loadAllHomepages')
            this.closeDialog()
          }
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      }
    }
  }

}
</script>
