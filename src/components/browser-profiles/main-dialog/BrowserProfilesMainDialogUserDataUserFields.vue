<template>
  <div>
    <v-container
      v-for="userField in userFields"
      :key="`anty-main-dialog-user-fields${userField.id}`"
      class="d-flex align-center"
    >
      <!-- <div
        class="mb-1"
        style="font-weight: bold;"
      >
        {{ userField.name }}
      </div> -->
      <span class="mr-2 main-dialog-col-label">{{ userField.name }}</span>

      <!-- TEXT -->
      <v-text-field
        v-if="userField.type === 'text'"
        v-model="userField.value"
        dense
        outlined
        hide-details
        :spellcheck="false"
      />

      <!-- TEXTAREA -->
      <v-textarea
        v-if="userField.type === 'textarea'"
        v-model="userField.value"
        dense
        outlined
        hide-details
        :spellcheck="false"
      />

      <!-- CHECKBOX -->
      <v-checkbox
        v-if="userField.type === 'checkbox'"
        v-model="userField.value"
        dense
        hide-details
        style="margin-top: 0; padding-top: 0;"
      />

      <!-- CHECKLIST -->
      <v-list
        v-if="userField.type === 'checklist'"
        flat
        style="width: 100%;"
      >
        <v-list-item-group>
          <v-list-item
            v-for="item in userField.content.items"
            :key="`anty-main-dialog-user-data-checklist-${item.id}`"
            :value="item.id"
            class="pl-0"
            style="height: 24px !important;"
          >
            <v-list-item-action class="mr-2 my-1">
              <v-checkbox
                v-model="userField.value[item.id]"
                dense
              />
            </v-list-item-action>

            <v-list-item-content @click="userField.value[item.id] = !userField.value[item.id]">
              <v-list-item-title :style="userField.value[item.id] ? 'color: #9e9e9e !important; text-decoration: line-through;' : ''">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- SELECT -->
      <v-select
        v-if="userField.type === 'select'"
        v-model="userField.value"
        class="anty-main-table-user-field-select"
        :item-text="item => item.name"
        :items="userField.content.items"
        dense
        outlined
        hide-details
      />

      <!-- SELECT MULTIPLE -->
      <v-select
        v-if="userField.type === 'selectMultiple'"
        v-model="userField.value"
        class="anty-main-table-user-field-select"
        :item-text="item => item.name"
        :items="userField.content.items"
        outlined
        hide-details
        multiple
        small-chips
        deletable-chips
      />
    </v-container>
  </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesMainDialogUserDataUserFields',

  computed: {
    ...mapFields('browserProfiles', ['browserProfile']),

    userFields () {
      return this.browserProfile.userFieldsForMainDialog.filter(item => {
        for (const browserProfileUserField of this.browserProfile.userFields) {
          if (parseInt(item.id, 10) === parseInt(browserProfileUserField.fieldId, 10)) {
            return true && this.showUserField(item)
          }
        }
        return !item.deleted && this.showUserField(item)
      })
    }
  },

  methods: {
    showUserField (userField) {
      if (userField.mainWebsite && Array.isArray(userField.mainWebsite) && userField.mainWebsite.length === 0) {
        return true
      } else if (userField.mainWebsite && Array.isArray(userField.mainWebsite) && userField.mainWebsite.length > 0) {
        return userField.mainWebsite.includes(this.browserProfile.mainWebsite)
      }

      return false
    }
  }
}
</script>
