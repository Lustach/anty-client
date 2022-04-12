export default {
  methods: {
    parseProxyString (string, type) {
      let proxyString = string

      const parsedProxy = {
        name: '',
        host: '',
        port: '',
        type: '',
        login: '',
        password: '',
        changeIpUrl: ''
      }

      if (!proxyString.trim()) return parsedProxy

      // определить ссылку для смены IP
      const changeIpUrlRegex = /\[(.*?)\]/
      if ((changeIpUrlRegex).test(proxyString) && proxyString.endsWith(proxyString.match(changeIpUrlRegex)[0])) {
        parsedProxy.changeIpUrl = proxyString.match(changeIpUrlRegex)[1]

        // удалить ссылку для смены IP из строки
        proxyString = proxyString.replace(changeIpUrlRegex, '')
      }

      // определить тип прокси
      const [parsedType, parsedProxyString] = proxyString.split('://')

      if (parsedType && parsedProxyString) {
        const proxyType = parsedType.toLowerCase()
        switch (proxyType) {
          case 'https':
            parsedProxy.type = 'http'
            break
          case 'socks':
            parsedProxy.type = 'socks5'
            break
          case 'ssh':
            parsedProxy.type = 'ssh'
            break
          default:
            parsedProxy.type = proxyType
            break
        }
        proxyString = parsedProxyString
      } else {
        parsedProxy.type = type
      }

      const splittedProxy = proxyString.split(':')
      if (splittedProxy.length === 5 && (/(.+):(.+):(.+):(.+):(.+)/).test(proxyString)) {
        parsedProxy.host = splittedProxy[0]
        parsedProxy.port = splittedProxy[1]
        parsedProxy.login = splittedProxy[2]
        parsedProxy.password = splittedProxy[3]
        parsedProxy.name = splittedProxy[4]
      } else if (splittedProxy.length === 4 && (/(.+):(.+)@(.+):(.+):(.+)/).test(proxyString)) {
        parsedProxy.login = splittedProxy[0]
        parsedProxy.password = splittedProxy[1].split('@')[0]
        parsedProxy.host = splittedProxy[1].split('@')[1]
        parsedProxy.port = splittedProxy[2]
        parsedProxy.name = splittedProxy[3]
      } else if (splittedProxy.length === 4 && (/(.+):(.+):(.+):(.+)/).test(proxyString)) {
        parsedProxy.host = splittedProxy[0]
        parsedProxy.port = splittedProxy[1]
        parsedProxy.login = splittedProxy[2]
        parsedProxy.password = splittedProxy[3]
      } else {
        if (proxyString.search('@') > -1 && (/(.+):(.+)@(.+):(.+)/).test(proxyString)) {
          const [left, right] = proxyString.split('@')
          const [login, password] = left.split(':')
          const [host, port] = right.split(':')

          parsedProxy.login = login
          parsedProxy.password = password

          parsedProxy.host = host
          parsedProxy.port = port
        } else {
          if (splittedProxy.length === 2 && (/(.+):(.+)/).test(proxyString)) {
            parsedProxy.host = splittedProxy[0]
            parsedProxy.port = splittedProxy[1]
          } else if (splittedProxy.length === 3 && (/(.+):(.+):(.+)/).test(proxyString)) {
            parsedProxy.host = splittedProxy[0]
            parsedProxy.port = splittedProxy[1]
            parsedProxy.name = splittedProxy[2]
          }
        }
      }

      if (parsedProxy.type === 'ssh' && !parsedProxy.port) {
        parsedProxy.port = '22'
      }

      return this.$_.cloneDeep(parsedProxy)
    }
  }
}
