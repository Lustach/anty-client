<template>
  <div>
    {{ timer }}
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainTableCellTimer',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    },

    currentTime: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['timers']),

    timer () {
      if (typeof this.timers[this.browserProfile.id] !== 'undefined') {
        const duration = Number(this.currentTime / 1000 - this.timers[this.browserProfile.id] / 1000)
        const days = Math.floor(duration / (3600 * 24))

        let hours = Math.floor(duration % (3600 * 24) / 3600)
        hours = hours < 10 ? '0' + hours : hours

        let minutes = Math.floor(duration % 3600 / 60)
        minutes = minutes < 10 ? '0' + minutes : minutes

        let seconds = Math.floor(duration % 60)
        seconds = seconds < 10 ? '0' + seconds : seconds

        if (days > 0) {
          return days + this.$t('common.dayShort').toLowerCase() + ' ' + hours + ':' + minutes + ':' + seconds
        }

        if (parseInt(days, 10) === 0 && parseInt(hours, 10) === 0 && parseInt(minutes, 10) === 0 && parseInt(seconds, 10) >= 0) {
          return seconds + ' ' + this.$t('common.secondShort').toLowerCase()
        }

        if (hours.length > 2 || minutes.length > 2 || seconds.length > 2) {
          return '00 ' + this.$t('common.secondShort').toLowerCase()
        }

        return hours + ':' + minutes + ':' + seconds
      } else {
        return null
      }
    }
  }
}
</script>
