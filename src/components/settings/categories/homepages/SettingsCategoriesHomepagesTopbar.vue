<template>
  <div class="d-flex align-center justify-space-between mb-2">
    <!-- ЛЕВАЯ СТОРОНА -->
    <div>&nbsp;</div>

    <!-- ПРАВАЯ СТОРОНА -->
    <div class="d-flex align-center">
      <!-- УДАЛИТЬ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="settingsHomepagesActionDeleteButton"
            class="mr-2"
            color="primary"
            icon
            :disabled="homepages.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('settingsHomepages/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 18px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.delete') }}</span>
      </v-tooltip>

      <!-- СОЗДАТЬ СТАРТОВУЮ СТРАНИЦУ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="settingsHomepagesTopbarCreateButton"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('settingsHomepages/openDialog', 'create')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('common.create') }}</span>
      </v-tooltip>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SettingsCategoriesHomepagesTopbar',

  computed: {
    ...mapGetters({
      homepages: 'settingsHomepages/homepages'
    })
  }
}
</script>
