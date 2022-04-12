<template>
  <div>
    <div class="mb-1">
      {{ $t('settings.dolphinToken') }}
    </div>
    <v-text-field
      id="settingsDolphinIntegrationTextfieldToken"
      v-model="settings.user.dolphinIntegration.token"
      dense
      outlined
      hide-details
      :spellcheck="false"
    />
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'SettingsCategoriesDolphinIntegrationToken',

  computed: {
    ...mapFields('settings', ['settings'])
  }
}
</script>
