<template>
  <v-dialog
    id="settingsUserFieldsMainDialog"
    :value="dialogs.mainDialog"
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
          {{ mainDialogMode === 'edit' ? $t('common.edit') + ` [${userFieldName}]` : $t('settings.userFields.createField') }}
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

      <v-card-text class="pt-5">
        <v-row>
          <!-- ОСНОВНОЙ САЙТ -->
          <v-col :cols="12">
            <main-website />
          </v-col>

          <!-- НАЗВАНИЕ -->
          <v-col :cols="12">
            <v-text-field
              id="settingsUserFieldsMainDialogTextFieldName"
              v-model="userFields.forMainDialog.name"
              :label="$t('common.name')"
              dense
              outlined
              hide-details
              :spellcheck="false"
            />
          </v-col>

          <!-- ТИП -->
          <v-col
            v-if="mainDialogMode !== 'edit'"
            :cols="12"
          >
            <v-autocomplete
              id="settingsUserFieldsMainDialogAutocompleteType"
              v-model="userFields.forMainDialog.type"
              :label="$t('common.type')"
              :items="typeItems"
              dense
              outlined
              hide-details
              :filter="filterTypes"
            >
              <template #[`item`]="{item}">
                <span
                  v-if="item === 'textarea'"
                  :id="`settingsUserFieldsMainDialogAutocompleteType${capitalize(item)}`"
                >
                  {{ $t('common.userFields.bigText') }}
                </span>
                <span
                  v-else
                  :id="`settingsUserFieldsMainDialogAutocompleteType${capitalize(item)}`"
                >
                  {{ $t(`common.userFields.${item}`) }}
                </span>
              </template>
              <template #[`selection`]="{item}">
                <span v-if="item === 'textarea'">
                  {{ $t('common.userFields.bigText') }}
                </span>
                <span v-else>
                  {{ $t(`common.userFields.${item}`) }}
                </span>
              </template>
            </v-autocomplete>
          </v-col>

          <!-- КОНТЕНТ -->
          <v-col
            v-if="userFields.forMainDialog.type === 'checklist' ||
              userFields.forMainDialog.type === 'select' ||
              userFields.forMainDialog.type === 'selectMultiple'"
            :cols="12"
          >
            <user-field-content />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          id="settingsUserFieldsMainDialogButtonClose"
          small
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="settingsUserFieldsMainDialogButtonCreateOrUpdate"
          small
          text
          color="primary"
          :disabled="userFields.forMainDialog.name && userFields.forMainDialog.name === 0"
          :loading="loading"
          @click="saveOrEditUserField"
        >
          {{ mainDialogMode === 'edit' ? $t('common.save') : $t('common.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import MainWebsite from './SettingsCategoriesUserFieldsMainDialogMainWebsite.vue'
import UserFieldContent from './SettingsCategoriesUserFieldsMainDialogContent.vue'

export default {
  name: 'SettingsCategoriesUserFieldsMainDialog',

  components: {
    MainWebsite,
    UserFieldContent
  },

  data () {
    return {
      userFieldName: '',
      loading: false,
      typeItems: [
        'text',
        'textarea',
        'checkbox',
        'checklist',
        'select',
        'selectMultiple'
      ]
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'userFields/dialogs',
      mainDialogMode: 'userFields/mainDialogMode',
      pagination: 'userFields/pagination'
    }),
    ...mapFields('userFields', ['userFields'])
  },

  created () {
    this.userFieldName = this.userFields.forMainDialog.name
  },

  beforeDestroy () {
    this.$store.dispatch('userFields/clearUserFieldForMainDialog')
    this.$store.dispatch('userFields/setMainDialogMode', 'create')
  },

  methods: {
    filterTypes (item, value) {
      if (item === 'textarea') {
        return this.$t('common.userFields.bigText').toString().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
      } else {
        return this.$t(`common.userFields.${item}`).toString().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },

    close () {
      this.$store.dispatch('userFields/closeDialog', 'mainDialog')
    },

    async saveOrEditUserField () {
      this.loading = true
      const data = this.$_.cloneDeep(this.userFields.forMainDialog)
      if (data.type === 'text' || data.type === 'textarea' || data.type === 'checkbox') {
        delete data.content
      }

      if (this.mainDialogMode === 'edit') {
        delete data.id

        const response = await this.api.patch(`/browser_profiles/user_fields/${this.userFields.forMainDialog.id}`, data)
        if (response.status === 200) {
          this.$store.dispatch('userFields/replaceUserField', response.data.data)
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.saved') })
        }
      } else {
        const response = await this.api.post('/browser_profiles/user_fields', data)
        if (response.status === 200) {
          this.$store.dispatch('userFields/loadUserFields', { page: this.pagination.currentPage, itemsPerPage: this.pagination.perPage })
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.created') })
        }
      }

      this.close()

      this.loading = false
    }
  }

}
</script>
