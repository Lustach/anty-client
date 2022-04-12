<template>
  <div>
    {{ worktime }}
  </div>
</template>
<script>

export default {
  name: 'BrowserProfilesMainTableCellWorktime',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  computed: {
    worktime () {
      if (this.browserProfile.totalSessionDuration &&
        this.browserProfile.totalSessionDuration > 0
      ) {
        const duration = Number(this.browserProfile.totalSessionDuration)
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

        if (parseInt(days, 10) === 0 && parseInt(hours, 10) === 0 && parseInt(minutes, 10) === 0 && parseInt(seconds, 10) > 0) {
          return seconds + ' ' + this.$t('common.secondShort').toLowerCase()
        }

        return hours + ':' + minutes + ':' + seconds
      }

      return null
    }
  }
}
</script>
