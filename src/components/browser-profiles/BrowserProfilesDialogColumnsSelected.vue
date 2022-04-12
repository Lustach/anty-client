<template>
  <v-card
    flat
    class="px-3"
  >
    <v-card-title style="font-size: 18px; display: block; text-align: center;">
      {{ $t('columns.browserProfiles.columnsSelected') + ': ' + columns.selected.length }}
    </v-card-title>
    <draggable :list="columns.selected">
      <v-card
        v-for="col in columns.selected"
        :key="`columns-dialog-${col}`"
        outlined
        class="mb-2 anty-columns-col-draggable"
      >
        <v-card-text class="d-flex justify-space-between align-center py-0">
          <span class="d-flex justify-space-between align-center py-2">
            <v-icon
              size="12"
              class="mr-2"
              color="grey"
            >
              fas fa-grip-horizontal
            </v-icon>
            {{ col.startsWith("user-field") ? userFieldName(col.replace("user-field-", "")) : $t(`columns.browserProfiles.${col}`) }}
          </span>
          <span>
            <v-btn
              icon
              x-small
              color="grey"
              @click="removeCol(col)"
            >
              <ion-icon
                name="close-outline"
                size="small"
                style="font-size: 28px;"
              />
            </v-btn>
          </span>
        </v-card-text>
      </v-card>
    </draggable>
  </v-card>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesDialogColumnsSelected',

  components: {
    draggable
  },

  data () {
    return {
      selectedCols: []
    }
  },

  computed: {
    ...mapGetters({
      userFields: 'userFields/userFields'
    }),
    ...mapFields('browserProfiles', ['columns'])
  },

  methods: {
    removeCol (col) {
      this.$delete(this.columns.selected, this.columns.selected.indexOf(col))
    },

    userFieldName (id) {
      const userField = this.userFields.all.find(item => parseInt(item.id, 10) === parseInt(id, 10))

      if (userField) {
        return userField.name
      }

      return this.$t('columns.browserProfiles.noSuchUserfield')
    }
  }
}
</script>
