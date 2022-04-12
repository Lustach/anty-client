<template>
  <v-autocomplete
    :value="value"
    :error="error"
    :hide-details="hideDetails"
    :messages="messages"
    :item-value="itemValue"
    :item-text="itemText"
    :items="sortedItems"
    :label="label"
    outlined
    :menu-props="{ contentClass: 'proxy-autocomplete-list' }"

    dense
    @change="$emit('change', $event)"
  >
    <template #prepend-item>
      <div
        class="proxy-select-header"
      >
        <v-container class="px-4 pt-2 pb-1">
          <v-row
            no-gutters
            class="row-proxy-item"
          >
            <v-col
              cols="12"
              sm="1"
              class="text-center"
              style="font-size: 14px; cursor: pointer;"
              @click="sortItemsBy('lastCheck.status')"
            >
              {{ $t('columns.proxies.status') }}
            </v-col>
            <v-col
              cols="12"
              sm="2"
              class="text-center"
              style="font-size: 14px;"
            >
              {{ $t('columns.proxies.geo') }}
            </v-col>
            <v-col
              cols="12"
              sm="7"
              class="pl-4"
              style="font-size: 14px; cursor: pointer;"
              @click="sortItemsBy('name')"
            >
              {{ $t('columns.proxies.name') }}
            </v-col>
            <v-col
              cols="12"
              sm="2"
              class="text-right"
              style="font-size: 14px; cursor: pointer;"
              @click="sortItemsBy('browser_profiles_count')"
            >
              {{ $t('columns.proxies.browser_profiles_count') }}
            </v-col>
          </v-row>
        </v-container>

        <v-divider />
      </div>
    </template>

    <template #item="proxy">
      <v-container class="px-0">
        <v-row
          no-gutters
          class="row-proxy-item"
        >
          <v-col
            cols="12"
            sm="1"
            class="text-center"
          >
            <ion-icon
              name="swap-horizontal-outline"
              :style="{
                fontSize: '14px',
                color: !proxy.item.lastCheck ? ($vuetify.theme.isDark ? 'white' : 'black') : (proxy.item.lastCheck.status ? 'green' : 'red')
              }"
            />
          </v-col>
          <v-col
            cols="12"
            sm="2"
            class="text-center"
          >
            <flag
              v-if="proxy.item.lastCheck"
              :iso="proxy.item.lastCheck.country.toLowerCase()"
              style="width: 20px; background-size: 100%;"
            />
          </v-col>
          <v-col
            cols="12"
            sm="7"
            class="pl-4"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
          >
            {{ proxy.item.name }}
          </v-col>
          <v-col
            cols="12"
            sm="2"
            class="text-center"
          >
            {{ proxy.item.browser_profiles_count }}
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'ProxyDropdown',

  props: {
    value: {
      default: undefined
    },
    error: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      default: undefined
    },
    messages: {
      default: () => []
    },
    itemValue: {
      default: 'value'
    },
    itemText: {
      default: 'text'
    },
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      sort_by: 'browser_profiles_count',
      sort_asc: true
    }
  },

  computed: {
    sortedItems () {
      if (!this.sort_by) {
        return this.items
      }

      const sortedItems = this.items.slice()

      sortedItems.sort((a, b) => {
        const a_ = this.sort_by.split('.').reduce((obj, i) => obj && obj[i], a)
        const b_ = this.sort_by.split('.').reduce((obj, i) => obj && obj[i], b)

        return ((a_ ?? 0).toString().localeCompare((b_ ?? 0).toString())) * Math.sign(+this.sort_asc - 0.5)
      })

      return sortedItems
    }
  },

  methods: {
    sortItemsBy (field) {
      if (this.sort_by !== field) {
        this.sort_by = field
        this.sort_asc = true
        return
      }

      this.sort_asc = !this.sort_asc
    }
  }
}
</script>
<style>
.row-proxy-item {
  max-width: 410px;
}
.proxy-select-header {
  background: #ffffff;
  position: sticky; top: 0px; z-index: 9999;
}
.theme--dark .proxy-select-header {
  background: #1E1E1E;
}
.proxy-autocomplete-list .v-list {
  padding-top: 0;
}
</style>
