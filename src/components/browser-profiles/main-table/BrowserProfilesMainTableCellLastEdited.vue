<template>
  <span id="browserProfilesMainTableCellLastEdited">
    {{ browserProfile.updated_at ? updatedAt : '-' }}
  </span>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'BrowserProfilesMainTableCellLastEdited',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile'
    }),

    updatedAt () {
      const dateWithTimezone = `${this.moment(this.browserProfile.updated_at).format('YYYY-MM-DDTHH:mm:ss')}+03:00`

      try {
        const minuteSinceUpdate = parseInt(this.moment(dateWithTimezone).unix()) + 59
        const nowUnix = parseInt(Date.now() / 1000)
        if (nowUnix > minuteSinceUpdate) {
          return this.moment
            .parseZone(dateWithTimezone)
            .local()
            .locale(this.profile.language)
            .format('DD MMM HH:mm')
        }
        const dateNow = parseInt(Date.now() / 1000, 10)
        const editedUnix = parseInt(this.moment.parseZone(dateWithTimezone).local().locale(this.profile.language).unix(), 10)
        const secondsAgo = Math.abs((dateNow - editedUnix) ? (dateNow - editedUnix) : 1)

        return `${secondsAgo} ${this.$tc('browserProfiles.secondsAgo', secondsAgo)}`
      } catch (_) {
        return this.moment
          .parseZone(dateWithTimezone)
          .local()
          .locale(this.profile.language)
          .format('DD MMM HH:mm')
      }
    }
  }
}
</script>
