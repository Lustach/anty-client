<template>
  <div
    class="d-flex align-center"
    style="font-size: 16px;"
  >
    <span style="word-break: break-all;">
      <!-- НАЗВАНИЕ -->
      {{ userField.name }}

      <!-- КНОПКИ ДЕЙСТВИЙ -->
      <actions :user-field="userField" />
    </span>
  </div>
</template>
<script>
import Actions from './SettingsCategoriesUserFieldsMainTableNameActions.vue'
export default {
  name: 'SettingsCategoriesUserFieldsMainTableName',

  components: {
    Actions
  },

  props: {
    userField: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  }
}
</script>
