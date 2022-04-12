import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      profile: 'main/profile',
      subscription: 'main/subscription',
      settings: 'settings/settings',
      appVersion: 'main/appVersion',
      sortedTags: 'browserProfiles/sortedTags',
      proxyPagination: 'proxy/pagination',
      statusesPagination: 'browserProfilesStatuses/pagination'
    }),

    appVersionForAmplitude () {
      let appVersion = null

      if (this.appVersion) {
        const versionArr = this.appVersion.toString().split('.')
        appVersion = `${versionArr[0]}.${versionArr[1]}`
      }

      return appVersion
    }
  },

  methods: {
    async amplitudeSendIdentify () {
      try {
        setTimeout(() => {
          const identify = new this.$amplitude
            .Identify()
            .set('plan', this.subscription.plan)
            .set('team profiles count', this.subscription.browserProfiles?.count)
            .set('dolphin token', !!this.settings.user?.dolphinIntegration?.token)
            .set('users count', this.subscription.users?.count)
            .set('users added', this.subscription.users?.count)
            .set('users role', this.profile.role)
            .set('OS', navigator.platform)
            .set('dolphin version', this.appVersionForAmplitude)
            .set('DolphinAnty ID', this.profile.id)
            .set('team owner', this.profile.team?.isOwner)
            .set('team owner e-mail', this.profile.team?.ownerEmail)
            .set('proxies count', this.proxyPagination.total)
            .set('tags count', this.sortedTags?.length)
            .set('status count', this.statusesPagination.total)
            .set('refferal', !!this.profile.team?.refUserId)
            .set('refferal user', this.profile.team?.refUserEmail)
            .set('promocode', this.profile.team?.promo)
            .set('telegram', this.profile.telegram)
            .set('e-mail confirmation', !!this.profile.emailConfirmed)

          this.$amplitude.getInstance().identify(identify)
          this.$amplitude.getInstance().setUserId(this.profile.username)
        }, 5000)
      } catch (_) { /* */ }
    },

    async amplitudeSendProfileStart (profile) {
      this.$amplitude
        .getInstance()
        .logEvent('Profile Start', {
          site: profile.mainWebsite === '' ? 'none' : profile.mainWebsite,
          os: profile.platform,
          'browser type': profile.browserType,
          'dolphin version': this.appVersionForAmplitude,
          'user os': this.getUserPlatform(),
          'dolphin token': !!this.settings.user?.dolphinIntegration?.token,
          plan: this.subscription.plan,
          'team profiles count': this.subscription.browserProfiles?.count,
          'users count': this.subscription.users?.count
        })
    },

    async amplitudeSendProfileCreate (profile, action) {
      switch (action) {
        case 'create': {
          const identify = new this.$amplitude.Identify().add('profiles count', 1)
          this.$amplitude.getInstance().identify(identify)

          if (parseInt(profile.proxyMode, 10) === 1) {
            this.amplitudeIncreaseProxyCount(1)
          }
          break
        }
      }

      this.$amplitude
        .getInstance()
        .logEvent('Profile Create', {
          site: profile.mainWebsite === '' ? 'none' : profile.mainWebsite,
          os: profile.platform,
          proxy: this.setProxyForAmplitude(profile, action),
          useragent: profile.useragent?.mode,
          webrtc: profile.webrtc?.mode,
          canvas: profile.canvas?.mode,
          webgl: profile.webgl?.mode,
          timezone: profile.timezone?.mode,
          language: profile.locale?.mode,
          'copy profile': action === 'copy',
          'mass import': action === 'massImport',
          'browser type': profile.browserType,
          'team profiles count': this.subscription.browserProfiles?.count + 1
        })
    },

    async amplitudeSendProfileEdit (profile) {
      if (parseInt(profile.proxyMode, 10) === 1) {
        this.amplitudeIncreaseProxyCount(1)
      }

      this.$amplitude
        .getInstance()
        .logEvent('Profile Edit', {
          site: profile.mainWebsite === '' ? 'none' : profile.mainWebsite,
          os: profile.platform,
          proxy: this.setProxyForAmplitude(profile, 'edit'),
          useragent: profile.useragent?.mode,
          webrtc: profile.webrtc?.mode,
          canvas: profile.canvas?.mode,
          webgl: profile.webgl?.mode,
          timezone: profile.timezone?.mode,
          language: profile.locale?.mode,
          'browser type': profile.browserType,
          'team profiles count': this.subscription.browserProfiles?.count
        })
    },

    getUserPlatform () {
      const platformArray = [
        { device: 'linux', platform: /Linux/ },
        { device: 'windows', platform: /Windows NT/ },
        { device: 'macos', platform: /Macintosh/ }
      ]

      const platform = navigator.userAgent

      for (const i in platformArray) {
        if (platformArray[i].platform.test(platform)) {
          return platformArray[i].device
        }
      }
    },

    setProxyForAmplitude (profile, action) {
      if (action === 'copy') {
        return 'saved proxies'
      } else {
        const proxyMode = parseInt(profile.proxyMode, 10)
        return proxyMode === 2 ? 'saved proxies' : proxyMode === 1 ? 'new proxy' : 'no proxy'
      }
    },

    amplitudeIncreaseProxyCount (count) {
      const identify = new this.$amplitude.Identify().add('proxies count', count)
      this.$amplitude.getInstance().identify(identify)
    }
  }
}
