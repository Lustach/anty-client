<template>
  <ul style="margin-top: 8px;">
    <template
      v-for="key in keys"
    >
      <!-- НАЗВАНИЕ -->
      <li
        v-if="key === 'name'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('common.name') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">{{ changedValues[key]['old'] }}</span>
          </li>
          <li>
            <span class="value new">{{ changedValues[key]['new'] }}</span>
          </li>
        </ul>
      </li>

      <!-- СТАТУС -->
      <li
        v-if="key === 'status' && showStatus(changedValues[key])"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('common.status') }}</code>
        <ul class="values-list">
          <li>
            <v-chip
              outlined
              label
              x-small
              :color="statusById(changedValues[key]['old']) === 'none' ? 'grey' : statusById(changedValues[key]['old']).color"
              style="text-transform: uppercase; font-weight: normal; height: 20px; letter-spacing: 0.0892857143em;"
            >
              {{ statusById(changedValues[key]['old']) === 'none' ? $t('common.statusNo') : statusById(changedValues[key]['old']).name }}
            </v-chip>
            {{ '&rarr;' }}
            <v-chip
              outlined
              label
              x-small
              :color="statusById(changedValues[key]['new']) === 'none' ? 'grey' : statusById(changedValues[key]['new']).color"
              style="text-transform: uppercase; font-weight: normal; height: 20px; letter-spacing: 0.0892857143em;"
            >
              {{ statusById(changedValues[key]['new']) === 'none' ? $t('common.statusNo') : statusById(changedValues[key]['new']).name }}
            </v-chip>
          </li>
        </ul>
      </li>

      <!-- MAIN WEBSITE -->
      <li
        v-if="key === 'mainWebsite'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.mainWebsite') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              <span v-if="changedValues[key]['old'] === null">
                {{ $t('common.all') }}
              </span>
              <span v-else>
                <v-icon :size="10">
                  {{ mainWebsites[changedValues[key]['old']].icon }}
                </v-icon>
                {{ mainWebsites[changedValues[key]['old']].name }}
              </span>
            </span>
            <!--</li>-->
            <!--<li>-->
            <span class="mx-1">&rarr;</span>
            <span class="value new">
              <span v-if="changedValues[key]['new'] === null">
                {{ $t('common.all') }}
              </span>
              <span v-else>
                <v-icon :size="10">
                  {{ mainWebsites[changedValues[key]['new']].icon }}
                </v-icon>
                {{ mainWebsites[changedValues[key]['new']].name }}
              </span>
            </span>
          </li>
        </ul>
      </li>

      <!-- ПЛАТФОРМА -->
      <li
        v-if="key === 'platform'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('common.platform') }}</code>
        <ul class="values-list">
          <li class="d-flex justify-start align-center">
            <div class="value old d-flex justify-start align-center">
              <ion-icon
                :name="platforms[changedValues[key]['old']].icon"
                style="font-size: 10px; margin-right: 4px;"
              />
              <span>
                {{ platforms[changedValues[key]['old']].name }}
              </span>
            </div>

            <span class="mx-1">&rarr;</span>

            <div class="value new d-flex justify-start align-center">
              <ion-icon
                :name="platforms[changedValues[key]['new']].icon"
                style="font-size: 10px; margin-right: 4px;"
              />
              {{ platforms[changedValues[key]['new']].name }}
            </div>
          </li>
        </ul>
      </li>

      <!-- WEBRTC -->
      <li
        v-if="key === 'webrtc'"
        :key="key"
      >
        <code style="font-family: monospace;">webRTC</code>
        <ul
          v-if="changedValues[key]['old'].mode === 'manual' || changedValues[key]['new'].mode === 'manual'"
          class="values-list"
        >
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ changedValues[key]['old'].ipAddress }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ changedValues[key]['new'].ipAddress }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <ul
          v-else
          class="values-list"
        >
          <li>
            <span class="value old">{{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}</span>

            <span class="mx-1">&rarr;</span>

            <span class="value new">{{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}</span>
          </li>
        </ul>
      </li>

      <!-- DO NOT TRACK -->
      <li
        v-if="key === 'doNotTrack'"
        :key="key"
      >
        <code style="font-family: monospace;">Do not track</code>
        <ul class="values-list">
          <li>
            <span class="value old">{{ changedValues[key]['old'] ? $t('common.yes') : $t('common.no') }}</span>

            <span class="mx-1">&rarr;</span>

            <span class="value new">{{ changedValues[key]['new'] ? $t('common.yes') : $t('common.no') }}</span>
          </li>
        </ul>
      </li>

      <!-- WEBGL -->
      <li
        v-if="key === 'webgl' && changedValues[key].old.mode !== changedValues[key].new.mode"
        :key="key"
      >
        <code style="font-family: monospace;">WebGL</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
          </li>
        </ul>
      </li>

      <!-- WEBGL INFO -->
      <li
        v-if="key === 'webglInfo' && showWebglInfo(changedValues[key])"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.webglInfo') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ $t('browserProfiles.vendor') + ': ' + changedValues[key]['old'].vendor }}
                </span>
              </li>
              <li>
                <span class="value old">
                  {{ $t('browserProfiles.renderer') + ': ' + changedValues[key]['old'].renderer }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ $t('browserProfiles.vendor') + ': ' + changedValues[key]['new'].vendor }}
                </span>
              </li>
              <li>
                <span class="value new">
                  {{ $t('browserProfiles.renderer') + ': ' + changedValues[key]['new'].renderer }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- USERAGENT -->
      <li
        v-if="key === 'useragent'"
        :key="key"
      >
        <code style="font-family: monospace;">Useragent</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ changedValues[key]['old'].value }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ changedValues[key]['new'].value }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- ЧАСОВОЙ ПОЯС -->
      <li
        v-if="key === 'timezone'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.timezone') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ changedValues[key]['old'].value }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ changedValues[key]['new'].value }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- ПАМЯТЬ -->
      <li
        v-if="key === 'memory'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.memory') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ changedValues[key]['old'].mode === 'manual' ? $t('browserProfiles.manual') : $t('browserProfiles.realGeo') }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ changedValues[key]['old'].value + ' ' + $t('browserProfiles.gb').toUpperCase() }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ changedValues[key]['new'].mode === 'manual' ? $t('browserProfiles.manual') : $t('browserProfiles.realGeo') }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ changedValues[key]['new'].value + ' ' + $t('browserProfiles.gb').toUpperCase() }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- ПРОЦЕССОР -->
      <li
        v-if="key === 'cpu'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.cpu') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ changedValues[key]['old'].value + ' ' + cpuCores(changedValues[key]['old'].value) }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ changedValues[key]['new'].value + ' ' + cpuCores(changedValues[key]['new'].value) }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- ГЕО -->
      <li
        v-if="key === 'geolocation'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('browserProfiles.geolocation') }}</code>
        <ul class="values-list">
          <li>
            <span class="value old">
              {{ changedValues[key]['old'].mode === 'manual' ? $t('browserProfiles.manual') : $t('browserProfiles.realGeo') }}
            </span>
            <ul v-if="changedValues[key]['old'].mode === 'manual'">
              <li>
                <span class="value old">
                  {{ $t('browserProfiles.latitude') + ': ' + changedValues[key]['old'].latitude }}
                </span>
              </li>
              <li>
                <span class="value old">
                  {{ $t('browserProfiles.longitude') + ': ' + changedValues[key]['old'].longitude }}
                </span>
              </li>
            </ul>
          </li>
          <li>
            <span class="value new">
              {{ changedValues[key]['new'].mode === 'manual' ? $t('browserProfiles.manual') : $t('browserProfiles.realGeo') }}
            </span>
            <ul v-if="changedValues[key]['new'].mode === 'manual'">
              <li>
                <span class="value new">
                  {{ $t('browserProfiles.latitude') + ': ' + changedValues[key]['new'].latitude }}
                </span>
              </li>
              <li>
                <span class="value new">
                  {{ $t('browserProfiles.longitude') + ': ' + changedValues[key]['new'].longitude }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>

      <!-- CANVAS -->
      <li
        v-if="key === 'canvas'"
        :key="key"
      >
        <code style="font-family: monospace;">Canvas</code>
        <ul class="values-list">
          <li>
            <span class="value old">{{ $t(`browserProfiles.${changedValues[key]['old'].mode}`) }}</span>

            <span class="mx-1">&rarr;</span>

            <span class="value new">{{ $t(`browserProfiles.${changedValues[key]['new'].mode}`) }}</span>
          </li>
        </ul>
      </li>

      <!-- ТЕГИ -->
      <li
        v-if="key === 'tags'"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('common.tags') }}</code>
        <ul class="values-list">
          <li
            v-for="(tag, index) in changedValues[key]['old']"
            :key="`anty-activity-log-tag-old-${index}-${tag}`"
          >
            <v-chip
              outlined
              label
              x-small
              color="red"
              class="mb-1"
            >
              {{ tag }}
            </v-chip>
          </li>
          <li
            v-for="(tag, index) in changedValues[key]['new']"
            :key="`anty-activity-log-tag-new-${index}-${tag}`"
          >
            <v-chip
              outlined
              label
              x-small
              color="green"
              class="mb-1"
            >
              {{ tag }}
            </v-chip>
          </li>
        </ul>
      </li>

      <!-- ЗАМЕТКИ -->
      <li
        v-if="key === 'notes' && showNote(changedValues[key])"
        :key="key"
      >
        <code style="font-family: monospace;">{{ $t('common.notes') }}</code>
        <ul class="values-list">
          <li
            class="mb-1"
            :class="changedValues[key]['old'].content !== null ? 'value old' : ''"
          >
            <span
              v-if="changedValues[key]['old'].content !== null"
              class="anty-main-table-activity-log-changes-notes"
              v-html="changedValues[key]['old'].content"
            />
            <span
              v-else
              class="value old"
            >
              {{ $t('common.empty') }}
            </span>
          </li>
          <li
            class="mb-1"
            :class="changedValues[key]['new'].content !== null ? 'value new' : ''"
          >
            <span
              v-if="changedValues[key]['new'].content !== null"
              class="anty-main-table-activity-log-changes-notes"
              v-html="changedValues[key]['new'].content"
            />
            <span
              v-else
              class="value new"
            >
              {{ $t('common.empty') }}
            </span>
          </li>
        </ul>
      </li>
    </template>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {

  props: {
    changedValues: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      keys: [],
      mainWebsites: {
        facebook: {
          name: 'Facebook',
          icon: 'fab fa-facebook-square'
        },
        google: {
          name: 'Google',
          icon: 'fab fa-google'
        },
        tiktok: {
          name: 'TikTok',
          icon: 'fab fa-tiktok'
        },
        vk: {
          name: 'VK',
          icon: 'fab fa-vk'
        }
      },
      platforms: {
        windows: {
          name: 'Windows',
          icon: 'logo-windows'
        },
        macos: {
          name: 'macOS',
          icon: 'logo-apple'
        },
        linux: {
          name: 'Linux',
          icon: 'logo-tux'
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      browserProfilesStatuses: 'browserProfilesStatuses/statuses'
    })
  },

  created () {
    this.keys = Object.keys(this.changedValues)
  },

  methods: {
    showWebglInfo (value) {
      if (value.old.mode !== value.new.mode) {
        return true
      }
      if (value.old.mode === 'manual' && value.new.mode === 'manual' && (value.old.vendor !== value.new.vendor || value.old.renderer !== value.new.renderer)) {
        return true
      }
      return false
    },

    statusById (id) {
      for (const item of this.browserProfilesStatuses.all) {
        if (item.id === id) {
          return item
        }
      }
      return 'none'
    },

    showStatus (value) {
      if (value.old === null && value.new === null) {
        return false
      }
      if (value.old !== null && value.new !== null && value.old.toString() === value.new.toString()) {
        return false
      }
      return true
    },

    showNote (value) {
      if (value.old.content === value.new.content) return false

      return true
    },

    cpuCores (value) {
      switch (value) {
        case 1:
          return this.$tc('browserProfiles.core', 0)
        case 2:
          return this.$tc('browserProfiles.core', 1)
        case 4:
          return this.$tc('browserProfiles.core', 1)
        case 8:
          return this.$tc('browserProfiles.core', 2)
        default:
          return this.$tc('browserProfiles.core', 0)
      }
    }
  }
}
</script>
<style>
.anty-main-table-activity-log-changes-notes p {
  margin-bottom: 0 !important;
}

.values-list > li {
  line-height: 18px;
}

.values-list {
  margin-bottom: 8px;
}

.value {
  padding: 2px 8px;
  color: white;
  font-size: 11px;
  font-family: monospace;
  border-radius: 4px;
}

.old {
  background-color: #F44336;
}

.new {
  background-color: #4CAF50;
}
</style>
