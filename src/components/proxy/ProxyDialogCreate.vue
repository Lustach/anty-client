<template>
  <v-dialog
    :value="dialogs.create"
    persistent
    fullscreen
    :transition="false"
  >
    <v-card>
      <!-- ХЭДЕР ДИАЛОГА -->
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          id="proxyDialogCreateCloseButton"
          icon
          @click="close"
        >
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ $t('proxy.createProxy') }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            id="proxiesDialogCreateButtonAdd"
            :disabled="newProxy.length === 0"
            text
            :loading="loading"
            @click="addProxy"
          >
            {{ $t('common.add') }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- ТЕЛО ДИАЛОГА -->
      <v-card-text class="mt-8">
        <v-row>
          <!-- АЛЕРТ ФОРМАТОВ -->
          <v-col
            cols="6"
          >
            <v-alert
              id="proxiesDialogCreateFormatsAlert"
              color="primary"
              text
              v-html="$t('proxy.formats')"
            />
          </v-col>

          <!-- ТЕКСТАРЕЯ ДЛЯ ПАРСИНГА -->
          <v-col
            cols="6"
          >
            <v-textarea
              id="proxiesDialogCreateTextarea"
              v-model="inputRaw"
              outlined
              rows="10"
              :spellcheck="false"
              @input="parse"
            />
          </v-col>

          <!-- ТАБЛИЦА ПРОКСЕЙ -->
          <v-col
            cols="12"
          >
            <h3>{{ $t('proxy.checkYourself') }}:</h3>
            <v-simple-table id="proxiesDialogCreateSimpleTable">
              <template #default>
                <thead>
                  <tr>
                    <th>{{ $t('common.type') }}</th>
                    <th>{{ $t('common.host') }}</th>
                    <th>{{ $t('common.port') }}</th>
                    <th>{{ $t('common.login') }}</th>
                    <th>{{ $t('common.password') }}</th>
                    <th>{{ $t('common.name') }}</th>
                    <th style="overflow: hidden">
                      {{ $t('common.changeIpUrl') }}
                    </th>
                  </tr>
                </thead>
                <tbody v-if="newProxy.length > 0">
                  <tr
                    v-for="(proxy, index) in newProxy"
                    :key="`new-proxy-${index}`"
                  >
                    <td>{{ proxy.type }}</td>
                    <td>{{ proxy.host }}</td>
                    <td>{{ proxy.port }}</td>
                    <td>{{ proxy.login || '-' }}</td>
                    <td>{{ proxy.password || '-' }}</td>
                    <td>{{ proxy.name || '-' }}</td>
                    <td>{{ proxy.changeIpUrl || '-' }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import parseProxyString from '@/mixins/parseProxy.js'

export default {
  name: 'ProxyDialogCreate',

  mixins: [
    parseProxyString
  ],

  data () {
    return {
      newProxy: [],
      inputRaw: '',
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'proxy/dialogs',
      pagination: 'proxy/pagination'
    })
  },

  methods: {
    close () {
      this.$store.dispatch('proxy/closeDialog', 'create')
    },

    async addProxy () {
      try {
        this.loading = true

        await Promise.all(this.newProxy.map(
          proxy => this.api.post('/proxy', proxy)
        )).then((values) => {
          values.forEach(value => {
            if (value.status === 200) {
              const identify = new this.$amplitude.Identify().add('proxies count', 1)
              this.$amplitude.getInstance().identify(identify)

              this.$amplitude.getInstance().logEvent('Proxy Create')
            }
          })
        })

        const payload = {
          query: this.pagination.query,
          page: this.pagination.currentPage,
          itemsPerPage: this.pagination.perPage
        }
        await this.$store.dispatch('proxy/loadProxies', payload)

        this.$store.dispatch('main/alert', {
          color: 'success',
          message: this.$t('common.added')
        })

        this.close()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    parse () {
      const lines = this.inputRaw.split('\n')

      this.newProxy = []

      if (lines.length === 0) {
        return
      }

      lines.forEach(line => {
        if (!line.trim()) return
        const parsedProxy = this.parseProxyString(line)

        if (parsedProxy.type === '' || parsedProxy.type === null || typeof parsedProxy.type === 'undefined') {
          parsedProxy.type = 'http'
        }
        if (parsedProxy.name === '' || parsedProxy.name === null || typeof parsedProxy.name === 'undefined') {
          if (parsedProxy.login === '' && parsedProxy.password === '') {
            parsedProxy.name = parsedProxy.type + '://' + parsedProxy.host + ':' + parsedProxy.port
          } else {
            parsedProxy.name = parsedProxy.type + '://' + parsedProxy.login + ':' + parsedProxy.password + '@' + parsedProxy.host + ':' + parsedProxy.port
          }
        }

        if (parsedProxy.changeIpUrl === '') {
          delete parsedProxy.changeIpUrl
        }
        if (parsedProxy.login === '') {
          delete parsedProxy.login
        }
        if (parsedProxy.password === '') {
          delete parsedProxy.password
        }

        this.newProxy.push(parsedProxy)
      })
    }
  }
}
</script>
