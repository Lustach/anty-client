<template>
  <v-row>
    <v-col
      v-for="(item, index) in userFields.forMainDialog.content.items"
      :key="`anty-settings-user-field-content-${index}-${item}`"
      :cols="12"
      class="d-flex align-center"
    >
      <v-text-field
        :id="`settingsUserFieldsMainDialogContentTextFieldName${index + 1}`"
        v-model="item.name"
        dense
        outlined
        hide-details
        class="mr-2"
        :spellcheck="false"
      />

      <!-- ПОДНЯТЬ -->
      <v-btn
        icon
        x-small
        class="mr-1"
        @click="moveUp(index)"
      >
        <ion-icon
          name="chevron-up-outline"
          style="font-size: 20px;"
        />
      </v-btn>

      <!-- ОПУСТИТЬ -->
      <v-btn
        icon
        x-small
        class="mr-1"
        @click="moveDown(index)"
      >
        <ion-icon
          name="chevron-down-outline"
          style="font-size: 20px;"
        />
      </v-btn>

      <!-- УДАЛИТЬ -->
      <v-btn
        icon
        x-small
        @click="removeItem(index)"
      >
        <ion-icon
          name="close-outline"
          style="font-size: 20px;"
        />
      </v-btn>
    </v-col>
    <v-col
      :cols="12"
      class="pt-0 text-center"
    >
      <v-btn
        id="settingsUserFieldsMainDialogContentButtonAdd"
        color="primary"
        small
        text
        @click="addItem"
      >
        <ion-icon
          name="add-outline"
          class="mr-1"
        />
        {{ $t('settings.userFields.addItem') }}
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { mapFields } from 'vuex-map-fields'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'SettingsCategoriesUserFieldsMainDialogContent',

  data () {
    return {
      uuidv4
    }
  },

  computed: {
    ...mapFields('userFields', ['userFields'])
  },

  methods: {
    addItem () {
      if (this.userFields.forMainDialog.type === 'checklist') {
        this.userFields.forMainDialog.content.items.push({
          id: uuidv4(),
          name: ''
        })
      } else {
        this.userFields.forMainDialog.content.items.push({
          name: ''
        })
      }
    },

    removeItem (index) {
      this.userFields.forMainDialog.content.items.splice(index, 1)
    },

    moveUp (index) {
      if (index > 0) {
        const item = this.userFields.forMainDialog.content.items.splice(index, 1)[0]
        this.userFields.forMainDialog.content.items.splice(index - 1, 0, item)
      }
    },

    moveDown (index) {
      if ((index + 1) !== this.userFields.forMainDialog.content.items.length) {
        const item = this.userFields.forMainDialog.content.items.splice(index, 1)[0]
        this.userFields.forMainDialog.content.items.splice(index + 1, 0, item)
      }
    }
  }
}
</script>
