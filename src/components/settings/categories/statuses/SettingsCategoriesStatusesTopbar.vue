<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ЛЕВАЯ СТОРОНА -->
    <div>&nbsp;</div>

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- УДАЛИТЬ -->
      <v-tooltip
        v-if="profile && profile.role === 'admin'"
        top
      >
        <template #activator="{ on }">
          <v-btn
            id="settingsStatusesActionDeleteButton"
            class="mr-2"
            color="primary"
            icon
            :disabled="statuses.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('browserProfilesStatuses/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 18px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('settings.statuses.deleteStatus') }}</span>
      </v-tooltip>

      <!-- СОЗДАТЬ ПОЛЕ -->
      <v-tooltip
        v-if="profile && profile.role === 'admin'"
        top
      >
        <template #activator="{ on }">
          <v-btn
            id="settingsStatusesTopbarButtonCreate"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('browserProfilesStatuses/openDialog', 'mainDialog')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('settings.statuses.createStatus') }}</span>
      </v-tooltip>
      <!-- {{ browserProfiles.all }} -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SettingsCategoriesStatusesTopbar',

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      statuses: 'browserProfilesStatuses/statuses',
      profile: 'main/profile'
    })
  }
}
</script>
