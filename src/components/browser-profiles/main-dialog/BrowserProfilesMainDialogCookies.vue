<template>
  <div class="mt-4">
    <v-row>
      <v-col
        :cols="12"
      >
        <div
          style="position: relative"
          class="cookie-container"
          @click="showTextarea"
        >
          <drag
            v-if="!browserProfile.multipleImportInput && !inputFocused "
            :input-error="inputError"
            class="drop-box"
            @file="fileHandler"
            @buttonClick="buttonUploadClick = true"
          />

          <!-- ТЕКСТАРЕА ДЛЯ ПАРСИНГА ПРОФИЛЕЙ -->
          <v-textarea
            id="browserProfilesMainDialogCookiesTextarea"
            ref="fileInputTextarea"
            v-model.lazy="cookiesInput"
            :rows="5"
            outlined
            dense
            :spellcheck="false"
            class="file-input-textarea transparent-scrollbar"
            clearable
            :loading="loading"
            :error="inputError"
            :error-messages="errorMessage"
            hide-details
            @focus="focusInput"
            @blur="textareaBlur"
            @click:clear="clearInput"
          />
        </div>
      </v-col>

      <v-col
        v-if="browserProfile.cookies"
        :cols="12"
      >
        <v-alert
          v-if="Array.isArray(browserProfile.cookies) && browserProfile.cookies.length !== 0"
          color="success"
          text
        >
          {{ $t('common.validCookies', {type: cookiesType}) + " " + browserProfile.cookies.length }}
        </v-alert>
        <v-alert
          v-else
          color="error"
          text
        >
          {{ $t('common.invalidCookies') }}
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import tough from 'tough-cookie'
import Drag from '../../../Parts/Drag'

export default {
  name: 'BrowserProfilesMainDialogCookies',
  components: {
    Drag
  },

  data () {
    return {
      tough,
      // cookies: null,
      cookiesType: null,
      cookiesInput: '',
      inputFocused: false,
      loading: false,
      buttonUploadClick: false
    }
  },
  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    inputError () {
      return this.browserProfileTouched && this.validation.browserProfile.multipleImportData.$error
    },

    errorMessage () {
      if (this.inputError && (this.browserProfile.multipleImportFile || this.browserProfile.multipleImportInput)) {
        return this.$t('browserProfiles.multipleImport.invalidData')
      } else if (this.inputError) {
        return this.$t('authorization.fieldRequired')
      }

      return ''
    }
  },

  watch: {
    cookiesInput: {
      handler (newVal) {
        this.parseCookies(newVal)
      }
    }
  },
  methods: {
    textareaBlur () {
      if (!this.cookiesInput || this.cookiesInput.length < 1) {
        this.inputFocused = false
      }
    },
    fileHandler (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        this.cookiesInput = reader.result
      }
    },

    parseCookies (cookiesString) {
      if (cookiesString === '' || cookiesString === null) {
        this.browserProfile.cookies = null
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
        this.inputFocused = true
        this.$refs.fileInputTextarea.focus()
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
      this.cookiesType = 'Netscape'
      this.browserProfile.cookies = this.parseNetscapeCookies(cookiesString)
    },
    showTextarea () {
      if (!this.buttonUploadClick) {
        this.inputFocused = true
        this.$refs.fileInputTextarea.focus()
      } else {
        this.buttonUploadClick = false
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
    },

    focusInput () {
      setTimeout(() => {
        this.inputFocused = true
      }, 50)
    },

    clearInput () {
      this.inputFocused = false
      this.setReadonly(false)
    },

    setReadonly (value) {
      if (this.$refs && this.$refs.fileInputTextarea) {
        this.$refs.fileInputTextarea.$el.querySelector('div.v-text-field__slot textarea').readOnly = value
      }
    }

  }
}
</script>
<style >
.hide #browserProfilesMainDialogCookiesTextarea {
  opacity: 0;
}

#browserProfilesMainDialogMultipleImportFileInputButton{
  z-index: 1000;
}

.drop-box {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9999;
}

.cookie-container {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.87);
  border-radius: 4px;
}
</style>
