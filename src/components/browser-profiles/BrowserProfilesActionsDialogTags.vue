<template>
  <v-dialog
    :value="dialogs.tags"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('browserProfiles/closeDialog', 'tags')"
    @keydown.esc="$store.dispatch('browserProfiles/closeDialog', 'tags')"
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
          {{ $t('common.tags') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('browserProfiles/closeDialog', 'tags')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pt-5">
        <v-combobox
          ref="browserProfilesActionsDialogTagsCombobox"
          v-model="forTagsDialog.browserProfile.tags"
          :items="tags"
          :label="$t('common.tags')"
          multiple
          chips
          deletable-chips
          clearable
          outlined
          dense
          hide-details
          class="densed-input"
        />
        <v-radio-group
          v-if="!forTagsDialog.singleBrowserProfile"
          v-model="mode"
          row
          dense
          hide-details
        >
          <v-radio
            :label="$t('dialogs.tags.addTags')"
            :value="1"
          />
          <v-radio
            :label="$t('dialogs.tags.removeTags')"
            :value="-1"
          />
        </v-radio-group>
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          small
          text
          color="grey"
          @click="$store.dispatch('browserProfiles/closeDialog', 'tags')"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          small
          text
          color="primary"
          :loading="loading"
          @click="blurCombobox()"
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

export default {
  name: 'BrowserProfilesActionsDialogTags',

  data () {
    return {
      loading: false,
      mode: 1
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfiles: 'browserProfiles/browserProfiles',
      sortedTags: 'browserProfiles/sortedTags',
      profile: 'main/profile'
    }),
    ...mapFields('browserProfiles', ['forTagsDialog']),

    tags () {
      return this.sortedTags.map(item => item.name)
    }
  },

  beforeDestroy () {
    this.forTagsDialog.singleBrowserProfile = false
    this.forTagsDialog.browserProfile.id = 0
    this.forTagsDialog.browserProfile.tags = []
  },

  methods: {
    async blurCombobox () {
      if (this.$refs && this.$refs.browserProfilesActionsDialogTagsCombobox) {
        await this.$refs.browserProfilesActionsDialogTagsCombobox.blur()
      }
      if (this.forTagsDialog.singleBrowserProfile) {
        this.setTagsForSingle()
      } else {
        this.setTags()
      }
    },

    async setTagsForSingle () {
      this.loading = true

      // AMPLITUDE СОБЫТИЕ - изменение тегов
      try {
        const oldBrowserProfile = this.browserProfiles.all.find(bp => bp.id === this.forTagsDialog.browserProfile.id)
        if (oldBrowserProfile.tags.length < this.forTagsDialog.browserProfile.tags.length) {
          this.$amplitude.getInstance().logEvent('Tag Add', { 'tags count': this.forTagsDialog.browserProfile.tags.length })
        } else {
          this.$amplitude.getInstance().logEvent('Tag Delete', { 'tags count': this.forTagsDialog.browserProfile.tags.length })
        }
      } catch (_) { /* */ }

      try {
        const response = await this.api.patch(`/browser_profiles/${this.forTagsDialog.browserProfile.id}`, { tags: this.forTagsDialog.browserProfile.tags })

        if (!response.status || response.status !== 200 || response.data.error) {
          throw response
        }
        this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.$store.dispatch('browserProfiles/closeDialog', 'tags')
      } catch (err) {
        console.error(err)
      } finally {
        this.$store.dispatch('browserProfiles/loadTags')
        this.loading = false
      }
    },

    async setTags () {
      this.loading = true

      Promise.all(this.browserProfiles.selected.map(
        browserProfile => {
          let browserProfileTags = browserProfile.tags.slice()

          this.forTagsDialog.browserProfile.tags.forEach(tag => {
            if (this.mode === 1) {
              if (!browserProfileTags.includes(tag)) {
                browserProfileTags.push(tag)
              }
            } else {
              browserProfileTags = browserProfileTags.filter(item => item !== tag)
            }
          })

          return this.api.patch(`/browser_profiles/${browserProfile.id}`, { tags: browserProfileTags })
        }
      ))
        .then(values => {
          if (values.length === this.browserProfiles.selected.length) {
            this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
            this.$store.dispatch('browserProfiles/loadCurrentPage')
          }
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.$store.dispatch('browserProfiles/closeDialog', 'tags')
          this.$store.dispatch('browserProfiles/loadTags', {
            sendAmplitude: true,
            mode: this.mode
          })
          this.loading = false
        })
    }
  }
}
</script>
