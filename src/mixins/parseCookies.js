export default {
  methods: {
    parseCookies (cookiesString) {
      if (cookiesString === '') return

      if (this.isBase64(cookiesString)) {
        cookiesString = atob(cookiesString)
      }

      // проверка, являются ли куки JSON-массивом
      if (this.isJsonString(cookiesString)) {
        let cookies = JSON.parse(cookiesString)

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

        if (cookies[0].creation) {
          cookies = this.parseBasCookies(cookies)
        }
        return {
          cookies: cookies,
          cookiesType: 'JSON'
        }
      } else {
        //
        // ЗДЕСЬ КОГДА-НИБУДЬ БУДЕТ ПАРСИНГ КУКОВ ИЗ ЗАГОЛОВКОВ
        //
      }

      return {
        cookies: this.parseNetscapeCookies(cookiesString),
        cookiesType: 'Netscape'
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
