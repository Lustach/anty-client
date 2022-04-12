<template>
  <v-dialog
    :value="dialogs.automation"
    width="590"
    :overlay-opacity="0.7"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card class="automation-cart-2">
      <!-- ЗАГОЛОВОК -->

      <!-- ОКНО -->
      <v-card-text
        style="max-height: 700px; overflow: hidden"
        class="pb-0 pt-5"
      >
        <div>
          <v-btn
            icon
            class="mt-2"
            style="float: right; position: relative; right: -7px;"
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn
            icon
            class="mt-2"
            style="float: right; position: relative; right: -14px;"
            @click="openAutomation"
          >
            <i
              style="font-size: 20px"
              class="far fa-question-circle"
            />
          </v-btn>
        </div>
        <div>
          <h3 style="font-size: 16px;">
            {{ $t('automation.onboardingTitle') }}
          </h3>
          <h1 class="mb-5">
            {{ forDialogs.browserProfileName }}
          </h1>
          <v-btn
            large
            color="primary"
            class="mb-4 start-automation"
            :loading="loading"
            @click="startProfile"
          >
            {{ $t('automation.start') }}
          </v-btn>
          <v-divider />
        </div>
        <v-container>
          <div
            class="d-flex justify-center mt-5"
          />
          <div class="automation-container">
            <v-row>
              <div

                style="width: 100%"
              >
                <label>{{ $t('automation.businessDescriptionLabel') }}
                </label>
              </div>
              <v-textarea

                v-model="businessDescription"
                dense
                outlined
                hide-details
                auto-grow
                :spellcheck="false"
                :placeholder="$t('automation.businessDescriptionPlaceholder')"
              />
            </v-row>
            <v-row class="mt-5">
              <div

                style="width: 100%"
              >
                <label>{{ $t('automation.issueDescriptionLabel') }}
                </label>
              </div>
              <v-textarea
                v-model="issueDescription"
                dense
                outlined
                hide-details
                auto-grow
                :placeholder="$t('automation.issueDescriptionPlaceholder')"
                :spellcheck="false"
              />
            </v-row>
          </div>
        </v-container>
      </v-card-text>

      <!-- КНОПКИ -->
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import axios from 'axios'

export default {
  name: 'BrowserProfilesActionsDialogAutomation',

  data () {
    return {
      loading: false,
      businessDescription: '',
      issueDescription: ''
    }
  },

  computed: {
    ...mapGetters({
      browserProfile: 'browserProfiles/browserProfile',
      users: 'users/users',
      dialogs: 'browserProfiles/dialogs',
      profile: 'main/profile',
      pagination: 'browserProfiles/pagination',
      usersPagination: 'users/pagination',
      usersLoading: 'users/loading'
    }),
    ...mapFields('browserProfiles', ['forDialogs'])
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'automation')
    },
    openAutomation () {
      this.close()
      this.$store.dispatch('browserProfiles/openDialog', 'automationOnboarding')
    },
    async startProfile () {
      this.loading = true
      const addLoading = true
      const id = parseInt(this.forDialogs.browserProfileId, 10)

      try {
        this.$store.dispatch('browserProfiles/removeMainButtonError', id)

        if (addLoading) {
          await this.$store.dispatch('browserProfiles/addLoading', id)
        }

        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        this.api.post(`/browser_profiles/${id}/events`,
          { type: 'start' },
          { cancelToken: cancelTokenSource.token }
        )
        const response = await this.localApi.post(`/browser_profiles/${id}/start`, {
          businessDescription: this.businessDescription,
          issueDescription: this.issueDescription
        }, {
          params: {
            screenWidth: screen.width,
            screenHeight: screen.height,
            dpr: window.devicePixelRatio,
            automation: true,
            automationScript: 'googleAdsUnban'
          },
          cancelToken: cancelTokenSource.token
        })

        if (response.data && response.data.success === false) {
          switch (response.data.message) {
            case 'initConnectionError':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: this.$t('browserProfiles.errors.failedToGetIPData')
              })
              break
            case 'downloadDatadirError':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: this.$t('browserProfiles.errors.downloadDatadirError')
              })
              break
          }

          setTimeout(() => {
            this.$store.dispatch('browserProfiles/removeMainButtonError', id)
          }, 60000)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
        await this.$store.dispatch('browserProfiles/removeLoading', id)
        this.loading = false
      }

      await this.amplitudeAutomation()
    },

    async amplitudeAutomation () {
      this.$amplitude
        .getInstance()
        .logEvent('Automation', {
          script: 'google appeal'
        })
    }
  }
}
</script>
<style lang="scss">
.automation-container {
  margin-bottom: 30px;
}

.automation-cart-2 {
  h3 {
    font-size: 16px;
    line-height: 19px;
    /* identical to box height */

    letter-spacing: 0.5px;
    margin-top: 10px;
  }

  h1 {
    font-weight: bold;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 5px;
  }

  .start-automation {
    padding: 18px 45px !important;
  }
}
</style>
