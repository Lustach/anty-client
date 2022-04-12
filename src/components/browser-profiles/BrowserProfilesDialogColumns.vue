<template>
  <v-dialog
    id="browserProfilesCustomizeColumnsDialog"
    :value="dialogs.columns"
    :width="850"
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
        class="mb-5 pr-0"
      >
        <v-toolbar-title>
          {{ $t('common.columns') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            id="browserProfilesCustomizeColumnsDialogCloseButton"
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

      <v-card-text style="height: 400px;">
        <v-row>
          <!-- ПОИСК СТОЛБЦОВ -->
          <v-col :cols="8">
            <columns-search id="browserProfilesCustomizeColumnsDialogSearchComponent" />
          </v-col>

          <!-- ВЫБРАННЫЕ СТОЛБЦЫ -->
          <v-col :cols="4">
            <columns-selected id="browserProfilesCustomizeColumnsDialogSelectedComponent" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <span
          id="browserProfilesCustomizeColumnsDialogSavePreset"
          class="d-flex align-center"
          style="min-height: 40px;"
        >
          <v-switch
            v-model="savePreset"
            :label="$t('columns.browserProfiles.savePreset')"
            dense
            hide-details
            class="mt-0 pt-0 mr-2"
          />
          <v-text-field
            v-if="savePreset"
            v-model="presetName"
            :label="$t('common.name')"
            dense
            outlined
            hide-details
            :spellcheck="false"
          />
        </span>
        <v-spacer />

        <v-btn
          small
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="browserProfilesCustomizeColumnsDialogSaveButton"
          small
          text
          :loading="loading"
          color="primary"
          @click="saveColumns"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ColumnsSearch from './BrowserProfilesDialogColumnsSearch.vue'
import ColumnsSelected from './BrowserProfilesDialogColumnsSelected.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesDialogColumns',

  components: {
    ColumnsSearch,
    ColumnsSelected
  },

  data () {
    return {
      loading: false,
      savePreset: false,
      presetName: ''
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      columns: 'browserProfiles/columns'
    })
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'columns')
    },

    async saveColumns () {
      this.loading = true

      const data = {
        columns: this.columns.selected
      }

      if (this.savePreset) {
        data.columnsPresetName = this.presetName
      }

      await this.api.patch('/profile', data)
      await this.$store.dispatch('main/loadProfile')

      this.loading = true
      this.close()
    }
  }
}
</script>
