<!-- eslint-disable vue/no-v-html -->
<template>
  <div :style="computedUserField.type === 'checkbox' ? 'display: flex; justify-content: center;' : ''">
    <!-- TEXT И TEXTAREA -->
    <div
      v-if="(computedUserField.type === 'textarea' || computedUserField.type === 'text') && computedUserField.value && showUserField"
      class="d-flex align-center justify-space-between"
      @mouseover="hover.text = true"
      @mouseleave="hover.text = false"
    >
      <span v-if="computedUserField.type === 'text'">
        {{ computedUserField.value }}
      </span>
      <span
        v-if="computedUserField.type === 'textarea'"
        v-html="nl2br(computedUserField.value)"
      />
      <v-tooltip
        v-if="hover.text"
        top
      >
        <template #activator="{ on }">
          <v-btn
            icon
            x-small
            v-on="on"
            @click="copy(computedUserField.value)"
          >
            <v-icon
              color="grey"
              :size="12"
            >
              far fa-copy
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('common.copy') }}</span>
      </v-tooltip>
    </div>

    <!-- ЧЕКБОКС -->
    <v-checkbox
      v-if="computedUserField.type === 'checkbox' && showUserField"
      :input-value="computedUserField.value"
      hide-details
      class="mt-0 pt-0"
      @change="updateField"
    />

    <!-- CHECKLIST -->
    <v-list
      v-if="computedUserField.type === 'checklist' && computedUserField.content && computedUserField.content.items && showUserField"
      flat
      class="browser-profiles-main-table-user-field-checklist"
    >
      <v-list-item-group>
        <v-list-item
          v-for="item in computedUserField.content.items"
          :key="`anty-main-dialog-user-data-checklist-${item.id}`"
          :value="item.id"
          class="align-center pl-0"
          style="height: 24px !important;"
        >
          <v-list-item-action class="mr-2 my-1">
            <v-checkbox
              :input-value="computedUserField.value[item.id]"
              dense
              @change="updateChecklistField(computedUserField.value, item.id)"
            />
          </v-list-item-action>

          <v-list-item-content
            class="pb-1"
            style="padding-top: 3px;"
            @click="updateChecklistField(computedUserField.value, item.id)"
          >
            <v-list-item-title :style="computedUserField.value[item.id] ? 'color: #9e9e9e !important; text-decoration: line-through;' : ''">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!-- SELECT -->
    <v-select
      v-if="computedUserField.type === 'select' && computedUserField.content && computedUserField.content.items && showUserField"
      class="anty-main-table-user-field-select"
      :value="computedUserField.value"
      :item-text="item => item.name"
      :items="computedUserField.content.items"
      dense
      outlined
      hide-details
      @change="updateField"
    />

    <!-- SELECT MULTIPLE -->
    <v-select
      v-if="computedUserField.type === 'selectMultiple' && computedUserField.content && computedUserField.content.items && showUserField"
      class="anty-main-table-user-field-select densed-input"
      :value="computedUserField.value"
      :item-text="item => item.name"
      :items="computedUserField.content.items"
      dense
      outlined
      hide-details
      multiple
      small-chips
      deletable-chips
      @change="updateField"
    />
  </div>
</template>
<script>
import nl2br from 'nl2br'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserProfilesMainTableCellUserField',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    },

    userFieldId: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      nl2br,
      hover: {
        text: false
      }
    }
  },

  computed: {
    ...mapGetters({
      userFields: 'userFields/userFields'
    }),

    computedUserField () {
      let userField = {}

      for (const item of this.userFields.all) {
        if (parseInt(item.id, 10) === parseInt(this.userFieldId, 10)) {
          userField = this.$_.cloneDeep(item)
        }
      }

      if (this.$_.isEmpty(userField)) return userField

      switch (userField.type) {
        case 'text':
        case 'textarea':
        case 'select':
          userField.value = ''
          break
        case 'checkbox':
          userField.value = false
          break
        case 'checklist':
          userField.value = {}

          if (userField.content && userField.content.items && Array.isArray(userField.content.items)) {
            for (const item of userField.content.items) {
              userField.value[item.id] = false
            }
          }
          break
        case 'selectMultiple':
          userField.value = []
          break
      }

      if (
        this.browserProfile.userFields &&
        Array.isArray(this.browserProfile.userFields) &&
        this.browserProfile.userFields.length > 0
      ) {
        for (const browserProfileUserField of this.browserProfile.userFields) {
          if (parseInt(browserProfileUserField.fieldId, 10) === parseInt(userField.id, 10)) {
            userField.value = this.$_.cloneDeep(browserProfileUserField.value)
          }
        }
      }

      return userField
    },

    selectedChecklistsItems () {
      const items = []

      for (const userField in this.browserProfile.userFields) {
        if (this.browserProfile.userFields[userField].fieldId === this.userFieldId) {
          for (const value in this.browserProfile.userFields[userField].value) {
            if (this.browserProfile.userFields[userField].value[value]) {
              items.push(value)
            }
          }
        }
      }

      return items
    },

    showUserField () {
      if (this.computedUserField.mainWebsite &&
        Array.isArray(this.computedUserField.mainWebsite) &&
        this.computedUserField.mainWebsite.length === 0
      ) {
        return true
      } else if (this.computedUserField.mainWebsite &&
        Array.isArray(this.computedUserField.mainWebsite) &&
        this.computedUserField.mainWebsite.length > 0
      ) {
        return this.computedUserField.mainWebsite.includes(this.browserProfile.mainWebsite)
      }

      return false
    }
  },

  methods: {
    copy (value) {
      navigator.clipboard.writeText(value)
      this.$store.dispatch('main/alert', {
        color: 'success',
        message: this.$t('common.copied')
      })
    },

    async updateField (value) {
      const clonedBrowserProfile = this.$_.cloneDeep(this.browserProfile)
      const userFieldIndex = clonedBrowserProfile.userFields.findIndex(item => parseInt(item.id, 10) === parseInt(this.userFieldId, 10))
      const data = {
        fieldId: parseInt(this.userFieldId, 10),
        value: value
      }

      if (clonedBrowserProfile.userFields &&
        Array.isArray(clonedBrowserProfile.userFields) &&
        clonedBrowserProfile.userFields.length > 0 &&
        userFieldIndex > -1
      ) {
        clonedBrowserProfile.userFields.splice(userFieldIndex, 1, data)
      } else {
        clonedBrowserProfile.userFields.push(data)
      }

      try {
        const response = await this.api.patch(`/browser_profiles/${this.browserProfile.id}`, { userFields: clonedBrowserProfile.userFields })
        if (response.status !== 200 || (!response.data && !response.data.data)) {
          throw response
        }

        this.$store.dispatch('browserProfiles/loadCurrentPage')
      } catch (err) {
        console.error(err)
      }
    },

    updateChecklistField (value, id) {
      const clonedValue = this.$_.cloneDeep(value)
      clonedValue[id] = !clonedValue[id]

      this.updateField(clonedValue)
    }
  }
}
</script>
