<template>
  <v-dialog
    :value="dialogs.edit"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
      >
        <v-toolbar-title>
          {{ $t('proxy.editing') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="close"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text style="max-height: 700px;">
        <v-row class="mt-2">
          <!-- ТИП -->
          <v-col :cols="12">
            <v-btn-toggle
              v-model="proxies.forEdit.type"
              mandatory
            >
              <v-btn
                value="http"
                small
                color="primary"
                outlined
              >
                HTTP
              </v-btn>
              <v-btn
                value="socks4"
                small
                color="primary"
                outlined
              >
                SOCKS4
              </v-btn>
              <v-btn
                value="socks5"
                small
                color="primary"
                outlined
              >
                SOCKS5
              </v-btn>
              <v-btn
                value="ssh"
                small
                color="primary"
                outlined
              >
                SSH
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <!-- НАЗВАНИЕ -->
          <v-col :cols="12">
            <v-text-field
              id="proxiesDialogEditTextFieldName"
              v-model="proxies.forEdit.name"
              :label="$t('common.name')"
              outlined
              dense
              :error-messages="touched && $v.proxies.forEdit.name.$error ? $t('common.fieldRequired') : ''"
              :hide-details="touched && $v.proxies.forEdit.name.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- ХОСТ -->
          <v-col :cols="12">
            <v-text-field
              v-model="proxies.forEdit.host"
              :label="$t('common.host')"
              outlined
              dense
              :error-messages="touched && $v.proxies.forEdit.host.$error ? $t('common.fieldRequired') : ''"
              :hide-details="touched && $v.proxies.forEdit.host.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- ПОРТ -->
          <v-col :cols="12">
            <v-text-field
              v-model="proxies.forEdit.port"
              :label="$t('common.port')"
              outlined
              dense
              :error-messages="touched && $v.proxies.forEdit.port.$error ? $t('common.fieldRequired') : ''"
              :hide-details="touched && $v.proxies.forEdit.port.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- ЛОГИН -->
          <v-col :cols="12">
            <v-text-field
              v-model="proxies.forEdit.login"
              :label="$t('common.login')"
              outlined
              dense
              hide-details
              :spellcheck="false"
            />
          </v-col>

          <!-- ПАРОЛЬ -->
          <v-col :cols="12">
            <v-text-field
              v-model="proxies.forEdit.password"
              :label="$t('common.password')"
              outlined
              dense
              :error-messages="touched &&
                typeof proxies.forEdit.login !== 'undefined' &&
                proxies.forEdit.login !== '' &&
                $v.proxies.forEdit.password.$error ? $t('common.fieldRequired') : ''"
              :hide-details="touched &&
                typeof proxies.forEdit.login !== 'undefined' &&
                proxies.forEdit.login !== '' &&
                $v.proxies.forEdit.password.$error ? false : true"
              :spellcheck="false"
            />
          </v-col>

          <!-- ССЫЛКА ДЛЯ СМЕНЫ IP -->
          <v-col :cols="12">
            <v-text-field
              v-model="proxies.forEdit.changeIpUrl"
              :label="$t('common.changeIpUrl')"
              outlined
              dense
              hide-details
              :spellcheck="false"
            />
          </v-col>
          <v-col
            :cols="12"
            class="d-flex justify-space-between align-center"
          >
            <v-btn
              text
              :loading="checkProxyLoading"
              @click="checkProxy(true)"
            >
              <ion-icon
                name="swap-horizontal-outline"
                style="font-size: 18px; margin-right: 8px;"
              />
              {{ $t('common.checkConnection') }}
            </v-btn>
            <v-chip
              v-if="status !== null"
              outlined
              label
              small
              :color="status ? 'green' : 'red'"
            >
              {{ status ? $t('proxy.active').toUpperCase() : $t('proxy.error').toUpperCase() }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          text
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          id="proxiesDialogEditButtonSave"
          color="primary"
          text
          :loading="loading"
          @click="touch"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'ProxyDialogEdit',

  data () {
    return {
      loading: false,
      touched: false,
      status: null,
      checkProxyLoading: false
    }
  },

  validations () {
    const proxies = {
      forEdit: {
        name: {
          required
        },
        host: {
          required
        },
        port: {
          required
        }
      }
    }

    if (typeof this.proxies.forEdit.login !== 'undefined' && this.proxies.forEdit.login !== null && this.proxies.forEdit.login !== '') {
      proxies.forEdit.password = {
        required
      }
    }

    return { proxies: proxies }
  },

  computed: {
    ...mapGetters({
      dialogs: 'proxy/dialogs'
    }),
    ...mapFields('proxy', ['proxies'])
  },

  watch: {
    'proxies.forEdit.name': {
      handler () {
        this.touched = false
      }
    },
    'proxies.forEdit.host': {
      handler () {
        this.touched = false
      }
    },
    'proxies.forEdit.port': {
      handler () {
        this.touched = false
      }
    },
    'proxies.forEdit.login': {
      handler () {
        this.touched = false
      }
    },
    'proxies.forEdit.password': {
      handler () {
        this.touched = false
      }
    }
  },

  created () {
    if (this.proxies && this.proxies.forEdit && this.proxies.forEdit.lastCheck) {
      this.status = this.proxies.forEdit.lastCheck.status
    }
  },

  methods: {
    close () {
      this.$store.dispatch('proxy/closeDialog', 'edit')
      this.$store.dispatch('proxy/setProxyForEdit', {})
    },

    touch () {
      this.$v.$touch()
      this.touched = true

      if (!this.$v.$invalid) {
        this.save()
      }
    },

    async checkProxy (loading = false) {
      try {
        if (loading) this.checkProxyLoading = true

        const proxyId = this.proxies.forEdit.id

        const data = {
          type: this.proxies.forEdit.type,
          host: this.proxies.forEdit.host,
          port: this.proxies.forEdit.port
        }
        if (this.proxies.forEdit.login && this.proxies.forEdit.password) {
          data.login = this.proxies.forEdit.login
          data.password = this.proxies.forEdit.password
        }

        const response = await this.localApi.post('/check/proxy', data)

        await this.api.post(`/proxy/${proxyId}/last_check`, {
          city: response.data.city ? response.data.city : undefined,
          country: response.data.country ? response.data.country : undefined,
          ip: response.data.ip ? response.data.ip : undefined,
          region: response.data.region ? response.data.region : undefined,
          status: response.data.success ? response.data.success : false,
          timezone: response.data.timezone ? response.data.timezone : undefined
        })

        this.status = response.data.success ? response.data.success : false
      } catch (err) {
        console.error(err)
      } finally {
        this.checkProxyLoading = false
      }
    },

    async save () {
      try {
        this.loading = true

        const data = {
          type: this.proxies.forEdit.type,
          name: this.proxies.forEdit.name,
          host: this.proxies.forEdit.host,
          port: this.proxies.forEdit.port,
          login: this.proxies.forEdit.login ? this.proxies.forEdit.login : '',
          password: this.proxies.forEdit.password ? this.proxies.forEdit.password : '',
          changeIpUrl: this.proxies.forEdit.changeIpUrl ? this.proxies.forEdit.changeIpUrl : ''
        }

        // if (typeof this.proxies.forEdit.login !== 'undefined' && this.proxies.forEdit.login !== '') {
        //   data.login = this.proxies.forEdit.login
        // } else {
        //   data.login = null
        // }

        // if (typeof this.proxies.forEdit.password !== 'undefined' && this.proxies.forEdit.password !== '') {
        //   data.password = this.proxies.forEdit.password
        // } else {
        //   data.password = null
        // }

        // if (typeof this.proxies.forEdit.changeIpUrl !== 'undefined' && this.proxies.forEdit.changeIpUrl !== '') {
        //   data.changeIpUrl = this.proxies.forEdit.changeIpUrl
        // } else {
        //   data.changeIpUrl = null
        // }

        await this.checkProxy()
        const proxyEdited = await this.$store.dispatch('proxy/editProxy', {
          id: this.proxies.forEdit.id,
          payload: data
        })

        if (proxyEdited) {
          this.$amplitude.getInstance().logEvent('Proxy Edit')
        }

        this.close()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
