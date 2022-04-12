<template>
  <v-row>
    <!-- КНОПКА ДОБАВИТЬ -->
    <v-col
      :cols="12"
      class="text-center mt-2"
    >
      <input
        v-show="false"
        ref="inputUpload"
        type="file"
        @change="handleInputUpload"
      >
      <v-btn
        color="primary"
        @click="openFileUploader"
      >
        <ion-icon
          name="document-outline"
          style="font-size: 20px; margin-top: -2px;"
          class="mr-2"
        />
        {{ $t('browserProfiles.fromFile') }}
      </v-btn>

      <!-- ИЛИ -->
      <div class="my-2">
        {{ $t('common.or').toLowerCase() }}
      </div>

      <!-- ТЕКСТАРЕА ДЛЯ ПАРСИНГА КУКИСОВ -->
      <v-textarea
        v-model="browserProfile.cookiesInput"
        :placeholder="$t('common.pasteOrDropCookies')"
        outlined
        dense
        hide-details
        :spellcheck="false"
        @drop="dropHandler"
      />

      <div
        v-if="browserProfile.cookies"
        class="text-start mt-2"
      >
        <v-alert
          v-if="Array.isArray(browserProfile.cookies) && browserProfile.cookies.length !== 0"
          color="success"
          text
        >
          {{ $t('common.validCookies', {type: browserProfile.cookiesType}) + " " + browserProfile.cookies.length }}
        </v-alert>
        <v-alert
          v-else
          color="error"
          text
        >
          {{ $t('common.invalidCookies') }}
        </v-alert>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import tough from 'tough-cookie'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportCookies',

  data () {
    return {
      tough
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  },

  watch: {
    'browserProfile.cookiesInput': {
      handler (newVal) {
        this.parseCookies(newVal)
      }
    }
  },

  methods: {
    openFileUploader () {
      this.$refs.inputUpload.value = ''
      this.$refs.inputUpload.click()
    },

    dropHandler (event) {
      const _this = this
      const files = event.dataTransfer.files
      const file = files[0]

      if (!file) return

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        _this.browserProfile.cookiesInput = reader.result
      }
    },

    parseCookies (cookiesString) {
      if (cookiesString === '') {
        this.browserProfile.cookies = null
        this.browserProfile.cookiesType = null
        this.browserProfile.cookiesInput = ''
        return
      }

      if (this.isBase64(cookiesString)) {
        cookiesString = atob(cookiesString)
      }

      // проверка, являются ли куки JSON-массивом
      if (this.isJsonString(cookiesString)) {
        const cookies = JSON.parse(cookiesString)

        let correctCookieNotExists = true
        for (const cookie of cookies) {
          const keys = Object.keys(cookie)
          if (keys.includes('domain') &&
            keys.includes('name') &&
            keys.includes('path') &&
            keys.includes('value')
          ) {
            correctCookieNotExists = false
          }
        }
        if (correctCookieNotExists) return

        this.browserProfile.cookies = cookies
        if (cookies[0].creation) {
          this.browserProfile.cookies = this.parseBasCookies(cookies)
        }
        this.cookiesType = 'JSON'
        return
      } else {
        //
        // ЗДЕСЬ КОГДА-НИБУДЬ БУДЕТ ПАРСИНГ КУКОВ ИЗ ЗАГОЛОВКОВ
        //
        // const Cookie = tough.Cookie

        // const parsedCookies = Cookie.parse(cookiesString)
        // console.log(parsedCookies)
        // if (typeof parsedCookies !== 'undefined') {
        //   this.cookies = parsedCookies.toJSON()
        //   return
        // }
      }

      // const parsedCookies = this.parseNetscapeCookies(cookies)
      // if (parsedCookies && Array.isArray(parsedCookies) && parsedCookies.length !== 0) {
      //   this.cookies = parsedCookies
      // }
      this.browserProfile.cookiesType = 'Netscape'
      this.browserProfile.cookies = this.parseNetscapeCookies(cookiesString)
    },

    handleInputUpload () {
      const _this = this
      for (const file of this.$refs.inputUpload.files) {
        if (!file) continue

        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          _this.browserProfile.cookiesInput = reader.result
        }
      }
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
    },

    parseNetscapeCookies (data) {
      const lines = data.toString().split(/(\r\n|\r|\n)/)
      if (lines.length === 0) return []

      const result = []

      for (const _line of lines) {
        const line = _line.toString()

        // Пропускаем
        //   - комментарии
        //   - пустые строки
        //   - строки без символа табуляции
        if (
          line.substring(0, 1) === '#' ||
            line.trim().length === 0 ||
            line.search('\t') === -1
        ) continue

        const parts = line.split('\t')
        const row = {}

        row.domain = typeof parts[0] === 'undefined'
          ? null
          : parts[0]
        row.httpOnly = typeof parts[1] === 'undefined'
          ? null
          : parts[1].toString().toUpperCase() === 'TRUE'
        row.path = typeof parts[2] === 'undefined'
          ? null
          : parts[2]
        row.secure = typeof parts[3] === 'undefined'
          ? null
          : parts[3].toString().toUpperCase() === 'TRUE'
        row.expirationDate = typeof parts[4] === 'undefined'
          ? null
          : parseInt(parts[4], 10)
        row.name = typeof parts[5] === 'undefined'
          ? null
          : parts[5]
        row.value = typeof parts[6] === 'undefined'
          ? null
          : parts[6]

        result.push(row)
      }

      return result
    },

    parseBasCookies (basCookies) {
      return basCookies.map(item => {
        const cookies = {
          domain: item.domain,
          name: item.name,
          path: item.path,
          value: item.value
        }

        const expires = item.expires
        if (expires && parseInt(expires.year, 10)) {
          const expirationDate = new Date(
            parseInt(expires.year, 10),
            parseInt(expires.month, 10),
            parseInt(expires.day_of_month, 10),
            parseInt(expires.hour, 10),
            parseInt(expires.minute, 10),
            parseInt(expires.second, 10)
          )
          cookies.expirationDate = expirationDate.getTime() / 1000
        }

        if (!cookies.expirationDate || !cookies.expirationDate.toString().trim()) {
          cookies.expirationDate = 1756269164
        }
        cookies.expires = cookies.expirationDate

        return cookies
      })
    }
  }
}
</script>
