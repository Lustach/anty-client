import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import i18n from './i18n'
import axios from 'axios'
import Vuelidate from 'vuelidate'
import FlagIcon from 'vue-flag-icon'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import _ from 'lodash'
// import * as Sentry from '@sentry/vue'
// import { Integrations } from '@sentry/tracing'
import http from 'http'
import https from 'https'

import '@/assets/css/fonts.css'
import '@/assets/css/main.css'

Object.defineProperty(Vue.prototype, '$_', { value: _ })

let baseUrl = process.env.VUE_APP_BACKEND_URL ?? 'https://anty-api.com'
let syncBaseUrl = 'https://sync-dev.anty-api.com'
let localApiPort = 3001
let localBaseUrl = `http://localhost:${localApiPort}`

let branchName, branchHash

if (location.hostname !== 'localhost') {
  try {
    const url = new URL(location.href)
    localApiPort = parseInt(url.searchParams.get('localApiPort'))

    localStorage.setItem('antyLocalApiPort', localApiPort)
    localBaseUrl = `http://localhost:${localApiPort}`

    baseUrl = url.searchParams.get('baseUrl') ?? 'https://anty-api.com'
    syncBaseUrl = url.searchParams.get('syncBaseUrl') ?? 'https://sync.anty-api.com'

    if (url.searchParams.get('token')) {
      localStorage.setItem('remoteApiToken', url.searchParams.get('token'))
      location.href = require('url-query-handle').removeParam(location.href, 'token')
    }

    branchName = url.searchParams.get('branchName')
    branchHash = url.searchParams.get('branchHash')
  } catch (error) {
    console.log(error)
  }
}

const options = { transports: ['websocket', 'polling'] } // Options object to pass into SocketIO

Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO(localBaseUrl, options), // options object is Optional
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
})
)

// if (location.hostname !== 'localhost') {
//   Sentry.init({
//     Vue,
//     release: 'SENTRY_RELEASE',
//     dsn: 'https://e225c088609b463eb59690aa93480377@o1037856.ingest.sentry.io/6006771',
//     integrations: [new Integrations.BrowserTracing()],
//     tracesSampleRate: 0,
//     ignoreErrors: [
//       'Unhandled error. ({ sender: EventEmitter',
//       'Failed to fetch',
//       'Cannot read property \'isOwner\' of undefined'
//     ]
//   })
// }

Vue.use(FlagIcon)

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('remoteApiToken')}`
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
})

const syncApi = axios.create({
  baseURL: syncBaseUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('remoteApiToken')}`
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
})

const localApi = axios.create({
  baseURL: `${localBaseUrl}/v1.0`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('remoteApiToken')}`
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
})

Vue.prototype.api = api
Vue.prototype.syncApi = syncApi
Vue.prototype.localApi = localApi
Vue.prototype.baseUrl = baseUrl
Vue.prototype.branchName = branchName
Vue.prototype.branchHash = branchHash

Vue.config.productionTip = false
Vue.config.ignoredElements = [/^ion-/]

Vue.use(Vuelidate)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
