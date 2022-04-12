<template>
  <v-dialog
    scrollable
    :value="dialogs.error"
    width="600"
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'error')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'error')"
  >
    <v-card>
      <v-card-title class="headline">
        <span v-if="error.type == 'old'">{{ $t('common.errorOops') }}</span>
        <span v-else>{{ $t('common.errorOccurred') }}</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- ОШИБКА -->
          <v-col :cols="12">
            <div
              class="mb-2"
              style="font-size: 16px;"
            >
              <span v-if="error.type == 'old'"> {{ $t('common.errorToDeveloper') + ':' }}</span>
              <template v-else>
                <template v-if="error.error.type == 'E_VALIDATION'">
                  <v-alert
                    v-for="(item, key) in error.error.fields"

                    :key="`new-error-${key}`"
                    color="red lighten-2"
                    dark
                  >
                    {{ getValidationMessage(item) }}
                  </v-alert>
                </template>
                <div v-else>
                  {{ getMessageWithFallback().replace('username', 'email') }}
                </div>
              </template>
            </div>

            <v-alert
              class="mb-0 pa-0"
              style="font-size: 11px; line-height: 12px !important; word-break: break-word;"
            >
              <span v-if="error.type == 'old'">{{ error.message }}</span>

              <template
                v-if="error.type == 'old'"
                #append
              >
                <v-tooltip top>
                  <template #activator="{ on }">
                    <v-btn
                      icon
                      small
                      v-on="on"
                      @click="copy"
                    >
                      <v-icon
                        color="primary"
                        :size="16"
                      >
                        far fa-copy
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('common.copy') }}</span>
                </v-tooltip>
              </template>
            </v-alert>
          </v-col>
          <!-- СКОПИРОВАТЬ -->
        </v-row>
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('main/closeDialog', 'error')"
        >
          {{ $t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DialogsError',

  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs',
      error: 'main/error'
    })
  },

  methods: {
    copy () {
      navigator.clipboard.writeText(this.error.message)
      this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.copied') })
    },
    getValidationMessage (item) {
      let msg = this.$t(`validationNew.${item.error}`,
        {
          attribute: item.field,
          value: item.values[0],
          values: item.values
        }
      )
      let error = item.error
      const comma = error.indexOf('.')
      if (comma !== -1) {
        error = error.substr(0, comma)
      }
      msg = msg.replace(':' + error, item.values[0])
      msg = msg.replace('username', 'email')
      return msg
    },
    getMessageWithFallback () {
      if (this.error.code === 'E_LIMIT_PROFILES_ARCHIVED') {
        const limitHuman = `(${this.error.error.browserProfilesCount}/${this.error.error.browserProfilesLimit})`
        return this.$t(`common.errorsCodes.${this.error.code}`, [this.error.error.browserProfilesCount, limitHuman])
      } else if (this.$t(`common.errorsCodes.${this.error.code}`) === `common.errorsCodes.${this.error.code}`) {
        return this.error.message
      } else {
        return this.$t(`common.errorsCodes.${this.error.code}`)
      }
    }
  }
}
</script>
<style>
#error-textarea {
  line-height: 14px;
}
</style>
