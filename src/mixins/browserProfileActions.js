import axios from 'axios'

export default {
  methods: {
    async browserProfileActionsStart (profile, addLoading = true) {
      const id = parseInt(profile.id, 10)

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

        const canUpdateResponse = await this.api.get(`/browser_profiles/${id}/canUpdate`)

        if (canUpdateResponse.data.result) {
          this.api.post(`/browser_profiles/${id}/events`,
            { type: 'start' },
            { cancelToken: cancelTokenSource.token }
          )
        }

        const response = await this.localApi.get(`/browser_profiles/${id}/start?screenWidth=${screen.width}&screenHeight=${screen.height}&dpr=${window.devicePixelRatio}`, {
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
      }
    },

    async browserProfileActionsStop (profile) {
      const id = parseInt(profile.id, 10)

      try {
        await this.$store.dispatch('browserProfiles/addLoading', id)

        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        await this.localApi.get(`/browser_profiles/${id}/stop`, {
          cancelToken: cancelTokenSource.token
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
      }
    },

    async browserProfileActionBringToFront (profile) {
      const id = parseInt(profile.id, 10)

      try {
        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        const response = await this.localApi.get(`/browser_profiles/${id}/bring_to_front?screenWidth=${screen.width}&screenHeight=${screen.height}&dpr=${window.devicePixelRatio}`, {
          cancelToken: cancelTokenSource.token
        })

        if (response.data && response.data.success === false) {
          console.error('Bring to front is failed')
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
        await this.$store.dispatch('browserProfiles/removeLoading', id)
      }
    }
  }
}
