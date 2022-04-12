<template>
  <v-row class="mt-1 align-center">
    <!-- WebGL -->
    <v-col
      id="main-dialog-webgl"
      :cols="12"
    >
      <span class="mr-2 main-dialog-col-label">WebGL</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchWebgl"
        v-model="browserProfile.webgl.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchWebglButtonOff"
          value="off"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.off') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebglButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebglButtonNoise"
          value="noise"
          x-small
          color="primary"
          outlined
        >
          {{ $t('browserProfiles.noise') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- WebGL Info -->
    <v-col
      id="main-dialog-webglInfo"
      :cols="12"
      class="pt-0 mt-1"
    >
      <span class="mr-2 main-dialog-col-label">{{ $t('browserProfiles.webglInfo') }}</span>
      <v-btn-toggle
        id="browserProfilesMainDialogSwitchWebglInfo"
        v-model="browserProfile.webglInfo.mode"
        mandatory
      >
        <v-btn
          id="browserProfilesMainDialogSwitchWebglInfoButtonReal"
          value="real"
          x-small
          color="primary"
          outlined
          :disabled="browserProfile.webgl.mode === 'off'"
        >
          {{ $t('browserProfiles.real') }}
        </v-btn>
        <v-btn
          v-if="browserProfile.browserType === 'chrome'"
          id="browserProfilesMainDialogSwitchWebglInfoButtonSoftware"
          value="software"
          x-small
          color="primary"
          outlined
          :disabled="browserProfile.webgl.mode === 'off'"
        >
          {{ $t('browserProfiles.software') }}
        </v-btn>
        <v-btn
          id="browserProfilesMainDialogSwitchWebglInfoButtonManual"
          value="manual"
          x-small
          color="primary"
          outlined
          :disabled="browserProfile.webgl.mode === 'off'"
        >
          {{ $t('browserProfiles.manual') }}
        </v-btn>
      </v-btn-toggle>
    </v-col>

    <!-- ВРУЧНУЮ -->
    <!--    <v-col-->
    <!--      v-if="browserProfile.webglInfo.mode === 'manual' && browserProfile.webgl.mode !== 'off'"-->
    <!--      :cols="6"-->
    <!--      class="py-0"-->
    <!--    >-->
    <!--      &lt;!&ndash; ПРОИЗВОДИТЕЛЬ &ndash;&gt;-->
    <!--      <v-text-field-->
    <!--        id="browserProfilesMainDialogSwitchWebglInfoVendor"-->
    <!--        v-model="browserProfile.webglInfo.vendor"-->
    <!--        :label="$t('browserProfiles.vendor')"-->
    <!--        dense-->
    <!--        outlined-->
    <!--        :disabled="browserProfile.webgl.mode === 'off'"-->
    <!--        :error="validation.touched && validation.errorVendor"-->
    <!--        :hide-details="validation.touched && (validation.errorRenderer || validation.errorVendor) ? false : true"-->
    <!--        :messages="validation.touched && validation.errorVendor ? $t('browserProfiles.errorAtLeast3Symbols') : ''"-->
    <!--        class="mb-2 centralize-inner"-->
    <!--        :spellcheck="false"-->
    <!--      >-->
    <!--            <template #prepend-inner>-->
    <!--              <v-btn-->
    <!--                x-small-->
    <!--                icon-->
    <!--                :loading="loading"-->
    <!--                :disabled="loading"-->
    <!--                @click="randomize"-->
    <!--              >-->
    <!--                <v-icon :size="16">-->
    <!--                  mdi-autorenew-->
    <!--                </v-icon>-->
    <!--              </v-btn>-->
    <!--            </template>-->
    <!--      </v-text-field>-->
    <!--    </v-col>-->
    <v-col
      v-if="browserProfile.webglInfo.mode === 'manual' && browserProfile.webgl.mode !== 'off'"
      :cols="6"
      class="py-0"
    >
      <!-- ПРОИЗВОДИТЕЛЬ -->
      <v-autocomplete
        id="browserProfilesMainDialogWebglVendor"
        v-model="browserProfile.webglInfo.vendor"
        :placeholder="$t('browserProfiles.vendor')"
        :label="$t('browserProfiles.vendor')"
        :items="webglVendors"
        :loading="loading"
        outlined
        dense
        :error="validation.touched && validation.errorVendor"
        :hide-details="!(validation.touched && (validation.errorRenderer || validation.errorVendor))"
        :messages="validation.touched && validation.errorVendor ? $t('browserProfiles.errorAtLeast3Symbols') : ''"
        class="mb-2 centralize-inner"
      >
        <template #item="{item}">
          {{ item }}
        </template>

        <template #prepend-inner>
          <v-btn
            x-small
            icon
            :loading="loading"
            :disabled="loading"
            @click.stop="randomize"
          >
            <v-icon :size="16">
              mdi-autorenew
            </v-icon>
          </v-btn>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col
      v-if="browserProfile.webglInfo.mode === 'manual' && browserProfile.webgl.mode !== 'off'"
      :cols="6"
      class="py-0"
    >
      <!-- ВИДЕОКАРТА -->
      <v-autocomplete
        id="browserProfilesMainDialogWebglRenderer"
        v-model="browserProfile.webglInfo.renderer"
        :placeholder="$t('browserProfiles.renderer')"
        :label="$t('browserProfiles.renderer')"
        :items="getWebglRenderers"
        outlined
        :loading="loading"
        :disabled="!browserProfile.webglInfo.vendor"
        dense
        :error="validation.touched && validation.errorRenderer"
        :hide-details="!(validation.touched && (validation.errorRenderer || validation.errorVendor))"
        :messages="validation.touched && validation.errorRenderer ? $t('browserProfiles.errorAtLeast5Symbols') : ''"
        class="mb-2 centralize-inner"
      >
        <template #item="{item}">
          {{ item }}
        </template>

        <template #prepend-inner>
          <v-btn
            x-small
            icon
            :loading="loading"
            :disabled="loading"
            @click.stop="randomize"
          >
            <v-icon :size="16">
              mdi-autorenew
            </v-icon>
          </v-btn>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import axios from 'axios'

export default {
  name: 'BrowserProfilesMainDialogWebgl',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        errorVendor: false,
        errorRenderer: false
      })
    }
  },

  data () {
    return {
      loading: false,
      webglInfoCancelTokenSource: null,
      webglInfoDataList: {},
      selectedWebglInfoVendor: null,
      selectedWebglInfoRenderer: null
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),
    getWebglRenderers () {
      return (
        this.browserProfile.webglInfo.vendor
          ? this.webglInfoDataList[this.browserProfile.webglInfo.vendor]
          : Object.keys(this.webglInfoDataList).reduce((agg, cur) => [...agg, ...this.webglInfoDataList[cur]], [])
      )
    },
    webglVendors () {
      return Object.keys(this.webglInfoDataList)
    }
  },

  watch: {
    'browserProfile.webgl.mode': {
      handler (newVal) {
        if (newVal === 'off') {
          // if (this.webglInfoCancelTokenSource) this.webglInfoCancelTokenSource.cancel()
          this.browserProfile.webglInfo.mode = 'real'
          // if (this.browserProfile.webglInfo.vendor !== null || this.browserProfile.webglInfo.renderer !== null) {
          //   this.browserProfile.webglInfo.vendor = null
          //   this.browserProfile.webglInfo.renderer = null
          // }
        }
      }
    },
    'browserProfile.webglInfo.vendor': {
      handler (value) {
        if (this?.getWebglRenderers?.length > 0) {
          this.browserProfile.webglInfo.renderer = this.getWebglRenderers[0]
        }
      },
      immediate: true,
      deep: true
    },
    'browserProfile.webglInfo.mode': {
      handler (newVal) {
        if (this.webglInfoCancelTokenSource) {
          // this.webglInfoCancelTokenSource.cancel()
        }
        if ((newVal === 'real' || newVal === 'software' || newVal === 'manual') && (this.browserProfile.webglInfo.vendor !== null || this.browserProfile.webglInfo.renderer !== null)) {
          this.browserProfile.webglInfo.vendor = null
          this.browserProfile.webglInfo.renderer = null
        }
      }
    },
    'browserProfile.platform': {
      handler (newVal) {
        this.getWebglList()
      }
    }
  },

  beforeDestroy () {
    if (this.webglInfoCancelTokenSource) {
      // this.webglInfoCancelTokenSource.cancel()
    }
  },
  async created () {
    console.log(this.browserProfile.webglInfo.mode, this.browserProfile.webglInfo.vendor)
    if (this.browserProfile.webglInfo.mode === 'random') {
      await this.getWebglList()
    }
  },

  methods: {
    randomize () {
      console.log(this.webglVendors.length + 0)

      if (this.webglVendors && this.webglVendors.length && this.webglVendors.length > 0) {
        this.browserProfile.webglInfo.vendor = this.webglVendors[Math.floor(Math.random() * this.webglVendors.length)]
        this.browserProfile.webglInfo.renderer = this.getWebglRenderers[Math.floor(Math.random() * this.getWebglRenderers.length)]
      }
    },
    async getWebglList () {
      this.loading = true

      const browserVersion = 98

      this.webglInfoCancelTokenSource = axios.CancelToken.source()
      await this.api.get(
          `/fingerprints/webglList?platform=${this.browserProfile.platform}&browser_type=${this.browserProfile.browserType}&browser_version=${browserVersion}&type=webgl`,
          { cancelToken: this.webglInfoCancelTokenSource.token }
      ).then(response => {
        if (response.status === 200 && response.data !== null) {
          console.log('RESPONSE DATA::::', response.data)
          this.webglInfoDataList = response.data

          if (this.browserProfile.webglInfo.mode === 'manual' || this.browserProfile.webglInfo.mode === 'random') {
            this.randomize()
          }
        }

        this.webglInfoCancelTokenSource = null
      }).catch(() => {
        this.webglInfoCancelTokenSource = null
      }).finally(() => {
        this.loading = false
      })
    },

    updated () {
      console.log(this.browserProfile.webglInfo.vendor)
    }
  }
}
</script>
