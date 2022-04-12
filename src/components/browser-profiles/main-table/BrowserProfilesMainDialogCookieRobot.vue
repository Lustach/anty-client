<template>
  <v-dialog
    :value="dialogs.enterCookieRobot"
    width="656"
    height="478"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card
      class="px-1 py-0"
    >
      <!-- ИМЯ ПРОФИЛЯ -->
      <v-card-title>
        <span class="text-body-2">{{ browserProfile.name }}</span>
        <v-spacer />
        <v-btn
          icon
          @click="close"
        >
          <ion-icon
            name="close-outline"
            style="font-size: 28px;"
          />
        </v-btn>
      </v-card-title>

      <!-- ЗАГОЛОВОК ДИАЛОГА -->
      <v-card-title
        class="pt-0 mt-0"
        style="margin-top: -35px;"
      >
        {{ $t('browserProfiles.cookieRobot') }}
      </v-card-title>

      <!-- ПОДЗАГОЛОВОК ДИАЛОГА -->
      <v-card-subtitle>
        {{ $t('browserProfiles.cookieRobotSubtitle') }}
      </v-card-subtitle>
      <v-card-text>
        <v-divider />
      </v-card-text>

      <v-card
        class="mx-4"
        :color="idDark()? 'grey darken-3': 'grey lighten-4'"
      >
        <v-card-text>
          <v-container
            class="py-2 mr-2"
            background-color="gray lighten-2"
            style="border-top-left-radius: 4px; border: none; border-top-right-radius: 4px;"
          >
            <v-row>
              <v-col>
                <!-- TEXT FIELD ДЛЯ COOKIES LINKS -->
                <v-text-field
                  v-model="cookiesLinks"
                  :placeholder="$t('common.enterListOfLinks')"
                  no-resize
                  :spellcheck="false"
                  :rules="urlsValidation"
                  clearable
                  counter=""
                  :clear-icon-cb="onClearClicked"
                  background-color="gray lighten-3"
                  @keydown.enter="addUrl"
                  @drop="dropHandler"
                  @keyup.enter="onEnter"
                >
                  <template #counter>
                    <p
                      v-if="urlArray.length > 0 "
                      class="text-right caption text--disabled"
                    >
                      <span>
                        {{ urlArray.length }} {{ urlArray.length > 1? 'urls': 'url' }}
                      </span>
                    </p>
                    <p
                      v-else
                      class="text-right caption text--disabled"
                    />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-container
            class="py-2 mr-2 overflow-auto"
            style="max-height: 160px;  border: none; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
          >
            <v-row
              v-for="(url, index) in urlArray"
              :key="index"
              dense
              align="center"
              justify="start"
              class="shrink"
            >
              <v-col>
                <v-text-field
                  v-model="urlArray[index]"
                  :rules="urlValidate"
                  solo
                  filled
                  dense
                  :background-color="idDark()? 'grey darken-2': 'grey lighten-3'"
                  hide-details="auto"
                >
                  <template slot="append">
                    <v-btn
                      icon
                      @click="deleteUrl(url)"
                    >
                      <ion-icon
                        name="close-outline"
                        style="font-size: 16px;"
                      />
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card-text>
        <v-switch
          id="browserProfilesMainDialogCookieRobotImageless"
          v-model="imageless"
          inset
          :label="$t('common.doNotLoadImages')"
        />
        <v-switch
          id="browserProfilesMainDialogCookieRobotHeadless"
          v-model="headless"
          inset
          :label="$t('common.headless')"
        />
      </v-card-text>
      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-btn
          block
          large
          color="primary"
          :loading="loading"
          @click="startCookieRobot"
        >
          {{ $t('common.start') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainDialogCookieRobot',

  data () {
    return {
      cookiesLinks: '',
      urlArray: [],
      warning: '',
      loading: null,
      headless: true,
      imageless: true,
      labelList: '',
      urlsValidation: [
        value => (((this.validateUrlInput(value)) || (this.validateUrlArray(value))))
      ],
      urlValidate: [
        value => this.validateSingleUrl(value)
      ]
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfile: 'browserProfiles/browserProfile'
    })
  },

  watch: {
    cookiesLinks: {
      handler () {
        if (this.cookiesLinks && (this.cookiesLinks.slice(-1) === ',' || this.cookiesLinks.slice(-1) === '\n' || this.cookiesLinks.indexOf('\n') > 0 || this.cookiesLinks.indexOf(',') > 0)) {
          this.parseLinks(this.cookiesLinks)
          setTimeout(() => {
            this.cookiesLinks = ''
          }, 500
          )
        }
      }
    }
  },

  methods: {
    idDark () {
      return this.$vuetify.theme.dark
    },

    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'enterCookieRobot')
    },

    async startCookieRobot () {
      if (this.urlArray.length === 0) {
        this.warning = this.$t('common.invalidCookiesLinks')
        return
      }
      try {
        this.loading = true
        // const response = await this.localApi.post(`/import/cookies/${this.browserProfile.id}/robot`, { data: _this.urlArray, headless: _this.headless, imageless: _this.imageless })
        // await this.localApi.post(`/import/cookies/${this.browserProfile.id}/robot`, { data: _this.urlArray, headless: _this.headless, imageless: _this.imageless })
        // if (response.status === 200) {
        this.$store.dispatch('browserProfiles/addCookieRobotRunning', { profileId: this.browserProfile.id, count: this.urlArray.length, percentage: 0 })
        this.$store.dispatch('main/alert', { color: 'success', message: this.$t('browserProfiles.cookieRobotStarted') + ' ' + this.$t('browserProfiles.forProfile') + ' ' + this.browserProfile.name })
        this.$store.dispatch('browserProfiles/loadCurrentPage')
        this.close()
        const response = await this.localApi.post(`/import/cookies/${this.browserProfile.id}/robot`, { data: this.urlArray, headless: this.headless, imageless: this.imageless })
        if (response.status === 200) {
          this.$amplitude.getInstance().logEvent('Cookie Robot Run', { site: this.browserProfile.site, urlsCount: this.urlArray.length, imgLoad: this.imageless })
        }
        // } else {
        //   this.warning = this.$t('common.invalidCookiesLinks')
        // }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    dropHandler (event) {
      const _this = this
      const files = event.dataTransfer.files
      const file = files[0]

      if (!file) return

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        _this.cookiesLinks = reader.result
        // _this.parseLinks(reader.result)
        // setTimeout(() => {
        //   _this.cookiesLinks = ''
        // }, 500)
      }
    },

    onEnter () {
      this.parseLinks(this.cookiesLinks)
      setTimeout(() => { this.cookiesLinks = '' }, 500)
    },

    addUrl () {
      if (this.parseUrl(this.cookiesLinks)) {
        this.parseLinks(this.cookiesLinks)
        this.cookiesLinks = ''
      }
    },

    deleteUrl (url) {
      const index = this.urlArray.indexOf(url)
      if (index !== -1) {
        this.urlArray.splice(index, 1)
      }
    },

    onClearClicked () {
      this.cookiesString = ''
    },

    parseLinks (cookiesString) {
      const urlRegex = '(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[aA-zZ\u00a1-\uffff0-9]+-?)*[aA-zZ\u00a1-\uffff0-9]+)(?:\\.(?:[aA-zZ\u00a1-\uffff0-9]+-?)*[aA-zZ\\u00a1-\\uffff0-9]+)*(?:\\.(?:[aA-zZ\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(\\/|\\?|#)[^\\s]*)?'
      const reg = new RegExp(urlRegex, 'ig')
      const parsedUrls = cookiesString.match(reg)

      try {
        parsedUrls.forEach((url) => {
          const i = url.indexOf('http')
          if (i < 0) {
            url = 'http://' + url
          }
          if (url !== '' && this.parseUrl(url) && this.urlArray.indexOf(url) === -1) {
            this.urlArray.unshift(url)
            this.labelList = 'Entered ' + this.urlArray.length + ' unique urls'
          }
        })
        this.warning = this.$t('common.linkIsOk')
      } catch (e) {
        this.warning = this.$t('common.invalidCookiesLinks')
        return false
      }
    },

    parseUrl (string) {
      try {
        const link = string.replace(',', '')
        // const regExp = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\§.]{2,6})([\/\w \#\$\=\\$\:;\.-]*)*\/?$/)
        // if (regExp.test(string)) {
        //   return true
        // }
        return new URL(link)
      } catch (_) {
        return false
      }
    },

    validateUrlInput (string) {
      if (string === '' || !string) return true
      // if (this.urlArray.indexOf(string) !== -1) {
      //   return 'This url was already added in list below...'
      // }
      try {
        const urlRegex = '(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[aA-zZ\u00a1-\uffff0-9]+-?)*[aA-zZ\u00a1-\uffff0-9]+)(?:\\.(?:[aA-zZ\u00a1-\uffff0-9]+-?)*[aA-zZ\\u00a1-\\uffff0-9]+)*(?:\\.(?:[aA-zZ\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(\\/|\\?|#)[^\\s]*)?'
        const regExp = new RegExp(urlRegex, 'ig')
        if (regExp.test(string)) {
          const i = string.indexOf('http')
          if (i < 0) {
            string = 'http://' + string
          }
          const uri = new URL(string)
          return !!uri
        }
      } catch (_) {
        return 'This url: "' + string + '" is not good enough...please, check it'
      }
    },

    validateSingleUrl (string) {
      if (string === '' || !string) return true
      // if (this.urlArray.find(url => url === string).length > 1) {
      //   return 'This url was already added in list below...'
      // }
      try {
        const link = string.replace(',', '')
        // const regExp = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\§.]{2,6})([\/\w \.-]*)*\/?$/)
        // if (regExp.test(string)) {
        //   return true
        // }
        const url = new URL(link)
        return !!url
      } catch (_) {
        return 'This url: "' + string + '" is not good enough...please, check it'
      }
    },

    validateUrlArray (cookiesString) {
      if (cookiesString === '' || !cookiesString) return true
      cookiesString.replace(/(\r\n|\n|\r)/gm, ',')
      cookiesString.replace(',,', ',')
      cookiesString.trim()
      const urls = cookiesString.split(',')
      urls.forEach((url) => {
        try {
          this.parseUrl(cookiesString)
        } catch (_) {
          return 'This url: "' + url + '" is not good enough...please, check it'
        }
      })
      return true
    },

    isJsonString (str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },

    isBase64 (str) {
      try {
        return btoa(atob(str)) === str
      } catch (err) {
        return false
      }
    }
  }
}
</script>
