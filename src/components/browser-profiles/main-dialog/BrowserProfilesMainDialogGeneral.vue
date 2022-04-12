<template>
  <v-row class="mt-2">
    <v-col
      :cols="12"
      class="d-flex align-items"
    >
      <!-- НАЗВАНИЕ ПРОФИЛЯ -->
      <v-text-field
        id="browserProfilesMainDialogFieldName"
        ref="browserProfileName"
        v-model="browserProfile.name"
        :error="validation.touched && validation.browserProfileName"
        :hide-details="validation.touched && validation.browserProfileName ? false : true"
        :messages="validation.touched && validation.browserProfileName ? $t('authorization.fieldRequired') : ''"
        :label="$t('common.name')"
        dense
        outlined
        class="mr-2"
        style="flex: 2;"
        :spellcheck="false"
      />

      <!-- СТАТУСЫ -->
      <v-select
        id="browserProfilesMainDialogStatuses"
        :value="browserProfile.status"
        :item-value="item => item.id"
        :item-text="item => item.name"
        :items="browserProfilesStatuses.all.filter(item => !item.deleted)"
        :placeholder="$t('common.status')"
        dense
        outlined
        hide-details
        clearable
        style="flex: 1;"
        return-object
        @change="changeStatus"
      >
        <template #[`item`]="{item}">
          <v-chip
            :id="`browserProfilesMainDialogStatusesChipColor${item.color}`"
            outlined
            label
            small
            :color="item.color"
            style="text-transform: uppercase; font-weight: bold;"
          >
            {{ item.name }}
          </v-chip>
        </template>
        <template #[`selection`]="{item}">
          <v-chip
            outlined
            label
            small
            :color="item.color"
            style="text-transform: uppercase; font-weight: bold;"
          >
            {{ item.name }}
          </v-chip>
        </template>
      </v-select>
    </v-col>

    <!-- ТЕГИ -->
    <v-col
      id="main-dialog-tags"
      :cols="12"
    >
      <v-combobox
        id="browserProfilesMainDialogFieldTags"
        v-model="browserProfile.tags"
        :items="tags"
        :label="$t('common.tags')"
        multiple
        small-chips
        deletable-chips
        clearable
        outlined
        dense
        hide-details
        class="densed-input"
      />
    </v-col>
  </v-row>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
export default {
  name: 'BrowserProfilesMainDialogGeneral',

  props: {
    validation: {
      type: Object,
      default: () => ({
        touched: false,
        browserProfileName: false
      })
    }
  },

  // data () {
  //   return {
  //     mode: 1,
  //     allTags: []
  //   }
  // },

  computed: {
    ...mapGetters({
      browserProfilesStatuses: 'browserProfilesStatuses/statuses',
      sortedTags: 'browserProfiles/sortedTags'
    }),
    ...mapFields('browserProfiles', ['browserProfiles', 'browserProfile']),

    tags () {
      return this.sortedTags.map(item => item.name)
    }
  },

  mounted () {
    setTimeout(() => {
      if (this.$refs && this.$refs.browserProfileName) {
        this.$refs.browserProfileName.focus()
      }
    }, 300)
  },

  methods: {
    changeStatus (status) {
      if (status) {
        this.browserProfile.status = {
          color: status.color,
          id: status.id,
          name: status.name
        }
      } else {
        this.browserProfile.status = null
      }
    }
  }
}
</script>
