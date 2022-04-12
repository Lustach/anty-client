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
            id="settingsUserFieldsTopbarButtonDelete"
            class="mr-2"
            color="primary"
            icon
            :disabled="userFields.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('userFields/openDialog', 'delete')"
          >
            <ion-icon
              name="trash-outline"
              style="font-size: 18px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('settings.userFields.deleteField') }}</span>
      </v-tooltip>

      <!-- СОЗДАТЬ ПОЛЕ -->
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            id="settingsUserFieldsTopbarButtonCreate"
            class="mr-2"
            color="primary"
            icon
            v-on="on"
            @click="$store.dispatch('userFields/openDialog', 'mainDialog')"
          >
            <ion-icon
              name="add-outline"
              style="font-size: 26px;"
            />
          </v-btn>
        </template>
        <span>{{ $t('settings.userFields.createField') }}</span>
      </v-tooltip>

      <!-- ПОИСК -->
      <!-- <v-text-field
        ref="settingsUserFieldsSearch"
        :label="$t('browserProfiles.searchField')"
        dense
        solo
        single-line
        hide-details
        clearable
        clear-icon="fas fa-times"
      >
        <template #prepend-inner>
          <ion-icon
            name="search-outline"
            class="mx-1"
          />
        </template>
      </v-text-field> -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      userFields: 'userFields/userFields',
      dialogs: 'userFields/dialogs',
      browserProfilesStatusesDialogs: 'browserProfilesStatuses/dialogs'
    })
  }

  // async created () {
  //   document.addEventListener('keyup', this.focusSearch)
  // },

  // destroyed () {
  //   document.removeEventListener('keyup', this.focusSearch)
  // },

  // methods: {
  //   focusSearch (e) {
  //     let dialogOpened = false
  // let mainDialogOpened = false
  // for (const dialog of Object.values(this.dialogs)) {
  //   if (dialog) {
  //     dialogOpened = true
  //   }
  // }
  // for (const dialog of Object.values(this.mainDialogs)) {
  //   if (dialog) {
  //     mainDialogOpened = true
  //   }
  // }
  // if (!dialogOpened && !mainDialogOpened && (e.keyCode === 111 || e.keyCode === 191)) {
  //       this.$refs.settingsUserFieldsSearch.focus()
  //     }
  //     if (!dialogOpened && this.$refs.settingsUserFieldsSearch.isFocused && e.keyCode === 27) {
  //       this.$refs.settingsUserFieldsSearch.blur()
  //     }
  //   }
  // }
}
</script>
