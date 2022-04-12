<template>
  <v-navigation-drawer
    id="anty-sidebar"
    :mini-variant="mini"
    permanent
    fixed
    width="200"
  >
    <template #prepend>
      <!-- ЛОГОТИП -->
      <v-list-item
        id="sidebarLogo"
        style="margin-bottom: 16px;"
      >
        <img
          src="/logo.png"
          style="width: 32px; height: auto; margin-left: -4px; margin-top: 16px;"
        >
      </v-list-item>
    </template>

    <!-- <v-list-item>
      <v-btn
        icon
        style="margin-left: -6px;"
        @click="mini = !mini"
      >
        <ion-icon
          name="menu-outline"
          size="large"
        />
      </v-btn>
    </v-list-item> -->

    <v-list
      v-if="profileAuthorized"
      nav
      style="width: 56px;"
    >
      <v-list-item-group
        v-model="tab"
        active-class="blue--text"
        class="sidebar-tabs"
      >
        <!-- БРАУЗЕРЫ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarBrowsers"
              :to="{path: '/'}"
              v-on="on"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.browserProfiles') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.browserProfiles') }}</span>
        </v-tooltip>

        <!-- АВТОМАТИЗАЦИЯ -->
        <!-- <v-list-item :to="{path: '/automation'}">
          <v-list-item-icon>
            <ion-icon
              name="color-wand-outline"
              size="large"
            />
          </v-list-item-icon>
          <v-list-item-title>
            {{ $t('sidebar.automation') }}
          </v-list-item-title>
        </v-list-item> -->

        <!-- ПРОКСИ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarProxy"
              :disabled="disableUi"
              :to="{path: '/proxy'}"
              v-on="on"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.proxy') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.proxy') }}</span>
        </v-tooltip>

        <!-- ЗАКЛАДКИ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarBookmarks"
              :disabled="disableUi"
              :to="{path: '/bookmarks'}"
              v-on="on"
            >
              <v-list-item-icon />
              <!-- <ion-icon
                name="bookmarks-outline"
                style="font-size: 22px; margin: 0 auto;"
              /> -->
              <v-list-item-title>
                {{ $t('sidebar.bookmarks') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.bookmarks') }}</span>
        </v-tooltip>

        <!-- РАСШИРЕНИЯ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarExtensions"
              :disabled="disableUi"
              :to="{path: '/extensions'}"
              v-on="on"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.extensions') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.extensions') }}</span>
        </v-tooltip>

        <!-- ПОЛЬЗОВАТЕЛИ -->
        <v-tooltip
          v-show="profile.role === 'admin'"
          right
        >
          <template #activator="{ on }">
            <v-list-item
              id="sidebarUsers"
              :to="{path: '/users'}"
              v-on="on"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.users') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.users') }}</span>
        </v-tooltip>

        <!-- API -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarApi"
              :disabled="disableUi"
              inactive
              v-on="on"
              @click="openExternalLink('https://documenter.getpostman.com/view/15402503/Tzm8Fb5f')"
            >
              <v-list-item-icon />
              <v-list-item-title>API</v-list-item-title>
            </v-list-item>
          </template>
          <span>API</span>
        </v-tooltip>

        <!-- АВТОМАТИЗАЦИЯ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarAutomation"
              :disabled="disableUi"
              inactive
              v-on="on"
              @click="openExternalLink('https://anty.dolphin.ru.com/docs/docs/basic-automation')"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.automation') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.automation') }}</span>
        </v-tooltip>

        <!-- НАСТРОЙКИ -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarSettings"
              :disabled="disableUi"
              :to="{path: '/settings'}"
              v-on="on"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.settings') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.settings') }}</span>
        </v-tooltip>

        <!-- ОПЛАТИТЬ -->
        <v-tooltip
          v-show="profile.role === 'admin'"
          right
        >
          <template #activator="{ on }">
            <v-list-item
              id="sidebarPayment"
              inactive
              v-on="on"
              @click="openExternalLink(`https://anty.dolphin.ru.com/panel/#/overview?token=${remoteApiToken}`)"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('common.payment') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('common.payment') }}</span>
        </v-tooltip>

        <!-- ВЫХОД -->
        <v-tooltip right>
          <template #activator="{ on }">
            <v-list-item
              id="sidebarLogout"
              inactive
              v-on="on"
              @click="$store.dispatch('main/openDialog', 'logoutConfirmation')"
            >
              <v-list-item-icon />
              <v-list-item-title>
                {{ $t('sidebar.logOut') }}
              </v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ $t('sidebar.logOut') }}</span>
        </v-tooltip>
      </v-list-item-group>
    </v-list>

    <template #append>
      <!-- АВАТАРКА -->
      <v-tooltip
        v-if="profileAuthorized"
        right
      >
        <template #activator="{ on }">
          <v-list-item
            style="margin-bottom: 16px;"
            v-on="on"
            @click="$store.dispatch('main/openDialog', 'editProfile')"
          >
            <user-avatar
              style="margin-left: -5px; cursor: pointer;"
              v-on="on"
            />
          </v-list-item>
        </template>
        <span>{{ $t('common.editProfile') }}</span>
      </v-tooltip>

      <!-- ОБРАТНАЯ СВЯЗЬ -->
      <v-tooltip
        v-if="profileAuthorized"
        right
      >
        <template #activator="{ on }">
          <v-list-item
            id="sidebarFeedback"
            :disabled="disableUi"
            color="green"
            :input-value="true"
            @click="$store.dispatch('main/openDialog', 'feedback')"
            v-on="on"
          >
            <v-list-item-icon>
              <ion-icon
                name="bulb-outline"
                size="large"
              />
            </v-list-item-icon>
            <v-list-item-title>
              {{ $t('sidebar.feedback') }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <span>{{ $t('sidebar.feedback') }}</span>
      </v-tooltip>

      <!-- ЯЗЫК -->
      <v-list-item
        id="sidebarLanguage"
        style="margin-top: 8px;"
        :disabled="disableUi"
      >
        <v-list-item-icon>
          <language-switcher />
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('browserProfiles.language') }}
        </v-list-item-title>
      </v-list-item>

      <!-- DARK MODE -->
      <v-list-item
        id="sidebarDarkMode"
        class="px-0"
        :disabled="disableUi"
      >
        <v-list-item-content>
          <dark-mode :mini="mini" />
        </v-list-item-content>
      </v-list-item>

      <!-- VERSION -->
      <!-- <v-list-item class="px-0">
        <v-list-item-content>
          <span style="font-size: 10px; font-weight: normal;">{{ appVersion }}</span>
        </v-list-item-content>
      </v-list-item> -->
    </template>
  </v-navigation-drawer>
</template>

<script>
import LanguageSwitcher from './sidebar/SidebarLanguageSwitcher'
import DarkMode from './sidebar/SidebarDarkMode'
import { mapGetters } from 'vuex'
import UserAvatar from './UserAvatar.vue'

export default {
  name: 'Sidebar',

  components: {
    DarkMode,
    LanguageSwitcher,
    UserAvatar
  },

  data () {
    return {
      tab: 0,
      drawer: false,
      mini: true
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      profileAuthorized: 'main/profileAuthorized',
      disableUi: 'main/disableUi'
    }),

    remoteApiToken () {
      return localStorage.getItem('remoteApiToken')
    }
  },

  methods: {
    openExternalLink (url) {
      this.localApi.post('/open-external-link', { url })
    }
  }
}
</script>
<style>
.v-list-item {
  padding-top: 0 !important;
  min-height: 0 !important;
  height: 36px !important;
}

.v-list-item__icon {
  margin-top: 2px !important;
  margin-bottom: 0 !important;
  margin-right: 16px !important;
}
.sidebar-tabs .v-list-item__icon {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  margin-top: 0 !important;
}
#anty-sidebar .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#sidebarBrowsers.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-browser-profiles-active.png');
  opacity: 1;
}
#sidebarBrowsers.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-browser-profiles-light-theme.png');
  opacity: .87;
}
#sidebarBrowsers.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-browser-profiles-dark-theme.png');
}

#sidebarProxy.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-proxy-active.png');
  opacity: 1;
}
#sidebarProxy.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-proxy-light-theme.png');
  opacity: .87;
}
#sidebarProxy.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-proxy-dark-theme.png');
}

#sidebarSettings.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-settings-active.png');
  opacity: 1;
}
#sidebarSettings.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-settings-light-theme.png');
  opacity: .87;
}
#sidebarSettings.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-settings-dark-theme.png');
}

#sidebarUsers.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-users-active.png');
  opacity: 1;
}
#sidebarUsers.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-users-light-theme.png');
  opacity: .87;
}
#sidebarUsers.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-users-dark-theme.png');
}

#sidebarBookmarks.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-bookmarks-active.png');
  opacity: 1;
}
#sidebarBookmarks.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-bookmarks-light-theme.png');
  opacity: .87;
}
#sidebarBookmarks.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-bookmarks-dark-theme.png');
}

#sidebarExtensions.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-extensions-active.png');
  opacity: 1;
}
#sidebarExtensions.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-extensions-light-theme.png');
  opacity: .87;
}
#sidebarExtensions.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-extensions-dark-theme.png');
}

/* #sidebarApi.v-list-item.v-list-item--active .v-list-item__icon {
  background-image: url('~@/assets/sidebar-api-active.png');
  opacity: 1;
} */
#sidebarApi {
  cursor: pointer;
}
#sidebarApi.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-api-light-theme.png');
  opacity: .87;
}
#sidebarApi.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-api-dark-theme.png');
}

#sidebarAutomation {
  cursor: pointer;
}
#sidebarAutomation.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-automation-light-theme.png');
  opacity: .87;
}
#sidebarAutomation.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-automation-dark-theme.png');
}

#sidebarPayment {
  cursor: pointer;
}
#sidebarPayment.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-dollar-light-theme.png');
  opacity: .87;
}
#sidebarPayment.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-dollar-dark-theme.png');
}

#sidebarLogout {
  cursor: pointer;
}
#sidebarLogout .v-list-item__icon {
  margin-left: 2px !important;
  margin-top: auto !important;
  margin-bottom: auto !important;
  height: 20px;
}
#sidebarLogout.theme--light .v-list-item__icon {
  background-image: url('~@/assets/sidebar-logout-light-theme.png');
  opacity: .87;
}
#sidebarLogout.theme--dark .v-list-item__icon {
  background-image: url('~@/assets/sidebar-logout-dark-theme.png');
}
</style>
