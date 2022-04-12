<template>
  <!-- НАВИГАЦИЯ -->
  <v-simple-table
    id="browserProfilesMainDialogSummaryTable"
    class="main-dialog-summary"
    style="height: inherit;"
    :style="$vuetify.breakpoint.mdAndDown ? 'width: 405px;' : ''"
  >
    <tbody>
      <!-- ID -->
      <tr v-if="browserProfile.id">
        <td>{{ 'ID:' }}</td>
        <td>
          <div>
            {{ browserProfile.id }}
          </div>
        </td>
      </tr>

      <!-- НАЗВАНИЕ -->
      <tr>
        <td>{{ $t('common.name') + ':' }}</td>
        <td>
          <div :style="'width:' + secondColumnWidth() + 'px;'">
            {{ browserProfile.name }}
          </div>
        </td>
      </tr>

      <!-- СТАТУС -->
      <tr>
        <td>{{ $t('common.status') + ':' }}</td>
        <td>
          <div v-if="browserProfile.status">
            <v-chip
              outlined
              label
              x-small
              :color="browserProfile.status.color"
              style="text-transform: uppercase; font-weight: bold;"
            >
              {{ browserProfile.status.name }}
            </v-chip>
          </div>
        </td>
      </tr>

      <!-- ТЕГИ -->
      <tr>
        <td>{{ $t('common.tags') + ':' }}</td>
        <td>
          <v-chip
            v-for="tag in browserProfile.tags"
            :key="`main-dialog-${browserProfile.id}-tag-${tag}`"
            class="mr-1"
            outlined
            x-small
            label
            color="primary"
          >
            {{ tag }}
          </v-chip>
        </td>
      </tr>

      <!-- ПЛАТФОРМА -->
      <tr>
        <td>{{ $t('common.platform') + ':' }}</td>
        <td>
          <v-icon
            v-if="browserProfile.platform === 'windows'"
            size="16"
            class="mr-1"
            style="margin-top: -2px;"
          >
            fab fa-windows
          </v-icon>

          <v-icon
            v-if="browserProfile.platform === 'macos'"
            size="18"
            class="mr-1"
            style="margin-top: -3px;"
          >
            fab fa-apple
          </v-icon>

          <v-icon
            v-if="browserProfile.platform === 'linux'"
            size="16"
            class="mr-1"
            style="margin-top: -1px;"
          >
            fab fa-linux
          </v-icon>
          {{ browserProfile.platform.charAt(0).toUpperCase() + browserProfile.platform.slice(1) }}
        </td>
      </tr>

      <!-- USERAGENT -->
      <tr>
        <td>UserAgent:</td>
        <td :style="browserProfile.useragent.mode === 'manual' ? 'padding-top: 4px; padding-bottom: 4px;' : ''">
          <div v-if="browserProfile.useragent.mode && browserProfile.useragent.mode !== 'manual'">
            {{ $t(`browserProfiles.${browserProfile.useragent.mode}`) }}
          </div>
          <div
            v-if="browserProfile.useragent.mode && browserProfile.useragent.mode === 'manual'"
            style="white-space: normal; font-size: 11px;"
          >
            {{ browserProfile.useragent.value }}
          </div>
        </td>
      </tr>

      <!-- ТИП БРАУЗЕРА -->
      <!-- <tr>
        <td>{{ $t('common.browser') + ':' }}</td>
        <td>
          <v-icon
            v-if="browserProfile.browserType === 'chrome'"
            size="16"
            class="mr-1"
            style="margin-top: -2px;"
          >
            fab fa-chrome
          </v-icon>

          <v-icon
            v-if="browserProfile.browserType === 'firefox'"
            size="16"
            class="mr-1"
            style="margin-top: -3px;"
          >
            fab fa-firefox
          </v-icon>

          <v-icon
            v-if="browserProfile.browserType === 'safari'"
            size="16"
            class="mr-1"
            style="margin-top: -2px;"
          >
            fab fa-safari
          </v-icon>
          {{ browserProfile.browserType.charAt(0).toUpperCase() + browserProfile.browserType.slice(1) }}
        </td>
      </tr> -->

      <!-- ПРОКСИ -->
      <tr>
        <td>{{ $t('common.proxy') + ':' }}</td>
        <td>
          <div
            v-if="browserProfile.proxyMode === 1 &&
              browserProfile.proxyNew.host &&
              browserProfile.proxyNew.port"
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            {{ proxyInput }}
          </div>

          <span
            v-else-if="browserProfile.proxyMode === 2"
          >
            {{ proxyName }}
          </span>

          <span v-else>
            {{ $t('browserProfiles.proxy.noProxy') }}
          </span>
        </td>
      </tr>

      <!-- WEBRTC -->
      <tr>
        <td>{{ 'WebRTC:' }}</td>
        <td>
          <div v-if="browserProfile.webrtc.mode && browserProfile.webrtc.mode !== 'manual'">
            {{ $t(`browserProfiles.${browserProfile.webrtc.mode}`) }}
          </div>
          <div
            v-else
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            {{ browserProfile.webrtc.ipAddress }}
          </div>
        </td>
      </tr>

      <!-- CANVAS -->
      <tr>
        <td>{{ 'Canvas:' }}</td>
        <td>
          {{ $t(`browserProfiles.${browserProfile.canvas.mode}`) }}
        </td>
      </tr>

      <!-- WebGL -->
      <tr>
        <td>{{ 'WebGL:' }}</td>
        <td>
          {{ $t(`browserProfiles.${browserProfile.webgl.mode}`) }}
        </td>
      </tr>

      <!-- WebGL Info -->
      <tr>
        <td>{{ $t('browserProfiles.webglInfo') + ':' }}</td>
        <td v-if="browserProfile.webgl.mode === 'off'">
          {{ $t(`browserProfiles.${browserProfile.webgl.mode}`) }}
        </td>

        <td
          v-else
          :style="browserProfile.webglInfo.mode === 'manual' ? 'padding-top: 4px; padding-bottom: 4px;' : ''"
        >
          <div v-if="browserProfile.webglInfo.mode && (browserProfile.webglInfo.mode === 'real' || browserProfile.webglInfo.mode === 'software' || browserProfile.webglInfo.mode === 'random')">
            {{ $t(`browserProfiles.${browserProfile.webglInfo.mode}`) }}
          </div>
          <div
            v-else-if="browserProfile.webglInfo.mode && (browserProfile.webglInfo.mode === 'manual' || browserProfile.webglInfo.mode === 'random')"
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            <div style="white-space: normal; margin-bottom: 6px;">
              {{ browserProfile.webglInfo.vendor }}
            </div>
            <div style="white-space: normal; font-size: 11px;">
              {{ browserProfile.webglInfo.renderer }}
            </div>
          </div>
        </td>
      </tr>

      <!-- WebGL -->
      <tr>
        <td>{{ 'Client Rects:' }}</td>
        <td>
          {{ $t(`browserProfiles.${browserProfile.clientRect.mode}`) }}
        </td>
      </tr>

      <!-- ЧАСОВОЙ ПОЯС -->
      <tr>
        <td>{{ $t('browserProfiles.timezone') + ':' }}</td>
        <td>
          <div
            v-if="browserProfile.timezone.mode === 'manual' && browserProfile.timezone.value && browserProfile.timezone.value !== null"
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            <span v-if="timezoneOffset !== 'no offset'">
              {{ '[' + (timezoneOffset > 0 ? '+' : '') + timezoneOffset + ']' }}
            </span>
            {{ browserProfile.timezone.value }}
          </div>
          <span v-if="browserProfile.timezone.mode === 'auto'">
            {{ $t('browserProfiles.auto') }}
          </span>
        </td>
      </tr>

      <!-- ЯЗЫК -->
      <tr>
        <td>{{ $t('browserProfiles.language') + ':' }}</td>
        <td>
          <div
            v-if="browserProfile.locale.mode === 'manual' && browserProfile.locale.value && browserProfile.locale.value !== null"
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            {{ '[' + browserProfile.locale.value + '] ' + locale.find(i => i.key === browserProfile.locale.value).value }}
          </div>
          <span v-if="browserProfile.locale.mode === 'auto'">
            {{ $t('browserProfiles.auto') }}
          </span>
        </td>
      </tr>

      <!-- ГЕОЛОКАЦИЯ -->
      <tr>
        <td>{{ $t('browserProfiles.geolocation') + ':' }}</td>
        <td>
          <div
            v-if="browserProfile.geolocation.mode === 'manual' && (browserProfile.geolocation.latitude || browserProfile.geolocation.longitude)"
            :style="'width:' + secondColumnWidth() + 'px;'"
          >
            {{ `${browserProfile.geolocation.latitude ? browserProfile.geolocation.latitude : '-'}, ${browserProfile.geolocation.longitude ? browserProfile.geolocation.longitude : '-'}` }}
          </div>
          <span v-if="browserProfile.geolocation.mode === 'real'">
            {{ $t('browserProfiles.realGeo') }}
          </span>
          <span v-if="browserProfile.geolocation.mode === 'auto'">
            {{ $t('browserProfiles.auto') }}
          </span>
        </td>
      </tr>

      <!-- ПРОЦЕССОР -->
      <tr>
        <td>{{ $t('browserProfiles.cpu') + ':' }}</td>
        <td>
          <div v-if="browserProfile.cpu.mode && browserProfile.cpu.mode === 'real'">
            {{ $t('browserProfiles.real') }}
          </div>
          <div v-if="browserProfile.cpu.mode && browserProfile.cpu.mode === 'random'">
            {{ $t('browserProfiles.random') }}
          </div>
          <div v-else-if="browserProfile.cpu.mode && browserProfile.cpu.mode === 'manual'">
            {{ browserProfile.cpu.value }}
            <span v-show="[2, 4].includes(browserProfile.cpu.value)">{{ $tc('browserProfiles.core', 1) }}</span>
            <span v-show="[6, 8, 12, 16].includes(browserProfile.cpu.value)">{{ $tc('browserProfiles.core', 2) }}</span>
          </div>
        </td>
      </tr>

      <!-- ПАМЯТЬ -->
      <tr>
        <td>{{ $t('browserProfiles.memory') + ':' }}</td>
        <td>
          <div v-if="browserProfile.memory.mode && browserProfile.memory.mode === 'real'">
            {{ $t('browserProfiles.realGeo') }}
          </div>
          <div v-if="browserProfile.memory.mode && browserProfile.memory.mode === 'random'">
            {{ $t('browserProfiles.random') }}
          </div>
          <div v-else-if="browserProfile.memory.mode && browserProfile.memory.mode === 'manual'">
            {{ browserProfile.memory.value + ' ' + $t('browserProfiles.gb').toUpperCase() }}
          </div>
        </td>
      </tr>

      <!-- ЭКРАН -->
      <tr v-if="browserProfile.browserType === 'anty'">
        <td>{{ $t('common.screen') + ':' }}</td>
        <td>
          <div v-if="browserProfile.screen.mode && browserProfile.screen.mode === 'real'">
            {{ $t('browserProfiles.real') }}
          </div>
          <div v-else-if="browserProfile.screen.mode && browserProfile.screen.mode === 'manual'">
            {{ browserProfile.screen.resolution }}
            <!-- {{ browserProfile.screen.resolution + ', ' + browserProfile.screen.colorDepth }}
            <span v-show="browserProfile.screen.colorDepth === 24 || browserProfile.screen.colorDepth === 32"> {{ $tc('browserProfiles.bits', 0) }} </span>
            <span v-show="browserProfile.screen.colorDepth === 16 || browserProfile.screen.colorDepth === 30"> {{ $tc('browserProfiles.bits', 1) }} </span> -->
          </div>
        </td>
      </tr>

      <!-- МЕДИАФАЙЛЫ -->
      <tr v-if="browserProfile.browserType === 'anty'">
        <td>{{ $t('browserProfiles.mediaDevices') + ':' }}</td>
        <td>
          <div v-if="browserProfile.mediaDevices.mode && browserProfile.mediaDevices.mode === 'real'">
            {{ $t('browserProfiles.realMultiple') }}
          </div>
          <div v-else-if="browserProfile.mediaDevices.mode && browserProfile.mediaDevices.mode === 'manual'">
            {{ browserProfile.mediaDevices.audioInputs + '/' + browserProfile.mediaDevices.audioOutputs + '/' + browserProfile.mediaDevices.videoInputs }}
          </div>
        </td>
      </tr>

      <!-- DO NOT TRACK -->
      <tr>
        <td>Do not track:</td>
        <td>{{ browserProfile.doNotTrack ? $t('common.on') : $t('common.off') }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>
<script>
import timezones from 'timezones.json'
import en from '@/constants/locales/en.json'
import ru from '@/constants/locales/ru.json'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainDialogSummary',

  data () {
    return {
      timezones,
      en,
      ru
    }
  },

  computed: {
    ...mapGetters({
      browserProfile: 'browserProfiles/browserProfile',
      browserProfilesStatuses: 'browserProfilesStatuses/statuses',
      proxies: 'proxy/proxies'
    }),

    status () {
      return this.browserProfilesStatuses.all.find(item => item.id === this.browserProfile.status)
    },

    proxyName () {
      const proxy = this.proxies.all.find(item => parseInt(item.id, 10) === parseInt(this.browserProfile.proxyId, 10))
      return proxy ? proxy.name : this.$t('browserProfiles.proxy.noProxy')
    },

    proxyInput () {
      if (this.browserProfile.proxyInput.includes('://')) {
        return this.browserProfile.proxyInput
      }
      return this.browserProfile.proxyNew.type + '://' + this.browserProfile.proxyInput
    },

    timezoneOffset () {
      const offset = this.timezones.find(timezone => timezone.utc.includes(this.browserProfile.timezone.value))
      if (offset && typeof offset !== 'undefined') {
        return offset.offset
      }
      return 'no offset'
    },

    locale () {
      if (localStorage.getItem('profileLanguage')) {
        return localStorage.getItem('profileLanguage') === 'en' ? this.en : this.ru
      }
      return this.en
    }
  },

  mounted () {
    window.addEventListener('resize', this.secondColumnWidth)
  },

  destroyed () {
    window.removeEventListener('resize', this.secondColumnWidth)
  },

  methods: {
    secondColumnWidth () {
      const table = document.querySelector('.main-dialog-summary')
      if (table !== null) {
        const tableWrapper = table.querySelector('.v-data-table__wrapper')
        return tableWrapper.offsetWidth - 100 - 32
      }
      return 200
    }
  }
}
</script>
