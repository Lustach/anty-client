<template>
  <v-dialog
    :value="dialogs.automationOnboarding"
    width="627"
    :overlay-opacity="0.7"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card class="automation-cart">
      <!-- ЗАГОЛОВОК -->

      <!-- ОКНО -->
      <v-card-text
        style="max-height: 700px; overflow: hidden"
        class="pb-0 pt-5"
      >
        <v-btn
          icon
          class="mt-2"
          style="float: right; position: relative; right: -7px;"
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-container>
          <div
            class="d-flex justify-center mt-5"
            style="margin-bottom: -25px;"
          >
            <img
              v-if="!isDarkTheme()"
              src="../../assets/frame_light.png"
            > <img
              v-else
              src="../../assets/frame_dark.png"
            >
          </div>
          <div class="automation-content">
            <h3
              class="text-center"
            >
              {{ $t('automation.onboardingTitle') }}
            </h3>
            <p>
              {{ $t('automation.onboardingText1') }}
            </p>
            <p v-html="$t('automation.onboardingText2')">
              {{ $t('automation.onboardingText2') }}
            </p>
          </div>
        </v-container>
      </v-card-text>

      <!-- КНОПКИ -->
      <v-card-actions class="d-flex justify-center mb-5">
        <v-btn
          outlined
          color="primary"
          class="automation-next-button"
          :loading="loading"
          @click="next"
        >
          {{ $t('automation.onboardingSubmit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesActionsonboardingDialog',

  data () {
    return {
      loading: false
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
    })

  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'automationOnboarding')
    },
    isDarkTheme () {
      return localStorage.getItem('profileTheme') ? localStorage.getItem('profileTheme') === 'dark' : true
    },
    async  next () {
      try {
        await this.api.patch('/profile/automation-onboarding')
        this.$store.dispatch('main/loadProfile')
      } finally {
        this.close()
        this.$store.dispatch('browserProfiles/openDialog', 'automation')
      }
    }

  }
}
</script>
<style lang="scss">
.automation-content {
  text-align: center;
  h3 {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.7);
    left: 140%;
    margin-bottom: 8px;
  }
}

.automation-next-button {
  letter-spacing: 0.5px;
  border-color: #C8C8C8;
  padding: 16px 16px !important;
  span {
    color: #1867C0;
  }

}
.theme--dark {

  .automation-cart {
    background: #2C2C2C;
  }
  .automation-content {
    text-align: center;
    h3 {
      color: #FFFFFF;
    }

    p {
      color: #C8C8C8;
    }
  }

  .automation-next-button {
    span {
      color: #FFFFFF;
    }

  }
}

</style>
