<template>
  <v-alert
    class="downloading-chrome-alert pt-2"
    color="primary"
    dark
  >
    <div class="d-flex justify-space-between">
      <div class="mb-2">
        {{ $t(`common.${browserDownloading.stage.replace('Ended', 'Started')}`) + '...' }}
      </div>
      <!-- <v-btn
        icon
        small
        @click="refreshDownload"
      >
        <ion-icon
          name="refresh-outline"
        />
      </v-btn> -->
    </div>

    <v-progress-linear
      v-if="browserDownloading.showProgress"
      :value="browserDownloading.percentage"
      height="20"
      color="light-blue"
    >
      <template #default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DialogsDownloadingChrome',

  computed: {
    ...mapGetters({ browserDownloading: 'main/browserDownloading' })
  },

  methods: {
    refreshDownload () {
      this.localApi.post('/download-browser')
    }
  }
}
</script>

<style>
.downloading-chrome-alert {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 202;
  width: 300px;
}
</style>
