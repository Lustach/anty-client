<template>
  <div class="my-2">
    <!-- ПРОВЕРКА БЫЛА -->
    <div
      v-if="lastCheckExists"
      class="d-flex align-center"
    >
      <div class="mr-1">
        <!-- СТАТУС ПРОВЕРКИ -->
        <v-chip
          outlined
          label
          small
          :color="proxy.lastCheck.status ? 'green' : 'red'"
        >
          {{ proxy.lastCheck.status ? $t('proxy.active').toUpperCase() : $t('proxy.error').toUpperCase() }}
        </v-chip>

        <!-- ВРЕМЯ СОЗДАНИЯ ПРОВЕРКИ -->
        <!-- <div
          style="font-size: 12px; color: #9E9E9E; line-height: 14px;"
          class="mt-1"
        >
          {{ moment(proxy.lastCheck.createdAt).fromNow() }}
        </div> -->
      </div>

      <!-- ДРУГИЕ ДАННЫЕ ПРОВЕРКИ -->
      <div
        v-if="proxy.lastCheck.status !== undefined && proxy.lastCheck.status"
        style="font-size: 12px; color: #9E9E9E; min-width: 120px;"
        class="my-1 ml-1"
      >
        <!-- ВРЕМЯ СОЗДАНИЯ ПРОВЕРКИ -->
        <div
          style="font-size: 12px; color: #9E9E9E; line-height: 14px;"
        >
          <v-icon
            :size="12"
            class="mr-1"
            style="margin-left: 2px;"
            color="grey"
          >
            fas fa-history
          </v-icon>
          {{ moment(proxy.lastCheck.createdAt).fromNow() === 'несколько секунд назад' ? 'только что' : moment(proxy.lastCheck.createdAt).fromNow() }}
        </div>

        <div style="margin-top: 3px;">
          <!-- ФЛАГ СТРАНЫ -->
          <flag
            v-if="proxy.lastCheck.ip !== undefined && proxy.lastCheck.country !== undefined"
            :iso="proxy.lastCheck.country.toLowerCase()"
            style="width: 16px; background-size: 100%;"
          />

          <!-- IP -->
          <span
            v-if="proxy.lastCheck.ip !== undefined"
            style="margin-left: 2px;"
          >
            <span
              v-if="proxy.lastCheck.ip.length > 15"
              style="width: calc(100% - 16px - 4px);padding-left: 3px;display: inline-flex;"
            >
              {{ proxy.lastCheck.ip }}
            </span>

            <span
              v-else
            >
              {{ proxy.lastCheck.ip }}
            </span>
          </span>
        </div>

        <!-- ЧАСОВОЙ ПОЯС -->
        <div v-if="proxy.lastCheck.timezone !== undefined">
          <v-icon
            :size="12"
            class="mr-1"
            style="margin-left: 2px;"
            color="grey"
          >
            fas fa-clock
          </v-icon>
          <span
            class="mr-3"
          >
            {{ proxy.lastCheck.timezone }}
          </span>
        </div>
      </div>
    </div>

    <!-- НЕИЗВЕСТНО -->
    <v-chip
      v-else
      outlined
      label
      small
      color="grey"
    >
      {{ $t('common.unknown').toUpperCase() }}
    </v-chip>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ProxyMainTableStatus',

  props: {
    proxy: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      moment
    }
  },

  computed: {
    lastCheckExists () {
      return (
        this.proxy &&
        this.proxy.lastCheck &&
        typeof this.proxy.lastCheck.status !== 'undefined' &&
        typeof this.proxy.lastCheck.createdAt !== 'undefined'
      )
    }
  }
}
</script>
