<template>
  <span id="settingsUserFieldsMainTableButtonEdit">
    <!-- ИКОНКА РЕДАКТИРОВАНИЯ -->
    <v-tooltip top>
      <template #activator="{ on }">
        <span
          :id="`settingsUserFieldsMainTableButtonEditFor-${userField.id}`"
          class="anty-main-table-edit-button ml-2"
          @click="editUserField"
          @mouseover="hover.edit = true"
          @mouseleave="hover.edit = false"
          v-on="on"
        >
          <ion-icon
            name="create-outline"
            size="small"
            :color="hover.edit ? 'primary' : ''"
            style="vertical-align: text-top;"
          />
        </span>
      </template>
      <span>{{ $t('common.edit') }}</span>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  name: 'SettingsCategoriesUserFieldsMainTableNameActions',

  props: {
    userField: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      hover: {
        edit: false
      }
    }
  },

  methods: {
    async editUserField () {
      await this.$store.dispatch('userFields/setUserFieldForMainDialog', this.userField)
      await this.$store.dispatch('userFields/setMainDialogMode', 'edit')
      await this.$store.dispatch('userFields/openDialog', 'mainDialog')
    }
  }
}
</script>
