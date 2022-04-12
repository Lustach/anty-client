<template>
  <div>
    <v-alert
      v-if="showNote"
      :id="`antyBrowserProfilesMainTableNotesFor-${browserProfile.id}`"
      :color="browserProfile.notes.color ? browserProfile.notes.color : 'primary'"
      :text="notesStyle === 'text' || notesStyle === 'outline-text'"
      :outlined="notesStyle === 'outline' || notesStyle === 'outline-text'"
      :type="notesIcon"
      dense
      border="left"
      class="browser-profiles-main-table-notes-cell-alert"
      :class="{'browser-profiles-main-table-notes-cell-alert-hidden': hideNotes, 'browser-profiles-main-table-notes-cell-alert-icon-margin': notesIcon === null}"
      style="margin-top: 8px; margin-bottom: 8px; font-size: 14px; display: inline-block;"
    >
      <span
        :style="{width: profile.columnsWidth && profile.columnsWidth.notes ? `${profile.columnsWidth.notes - 128}px` : 'auto'}"
        v-html="sanitizeHtml(browserProfile.notes.content, {
          allowedTags: [ 'p', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3' ],
        })"
      />

      <template #append>
        <v-btn
          style="margin-bottom: auto; position: relative; right: -8px; top: 0px;"
          icon
          x-small
          :color="browserProfile.notes.color ? browserProfile.notes.color : 'primary'"
          class="anty-notes-edit-pencil"
          :disabled="disableUi"
          @click="hideNotes = !hideNotes"
        >
          <v-icon :size="18">
            {{ hideNotes ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
          </v-icon>
        </v-btn>

        <v-btn
          style="margin-bottom: auto; position: relative; right: -8px; top: 0px;"
          icon
          x-small
          :color="browserProfile.notes.color ? browserProfile.notes.color : 'primary'"
          class="anty-notes-edit-pencil"
          :disabled="disableUi"
          @click="editNote"
        >
          <v-icon :size="12">
            fas fa-pencil-alt
          </v-icon>
        </v-btn>
      </template>
    </v-alert>

    <span
      v-else
      class="anty-adsmanager-main-table-link"
      :class="{'anty-adsmanager-main-table-link-disabled': disableUi}"
      @click="editNote"
    >
      {{ $t('common.notes').toLowerCase() }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sanitizeHtml from 'sanitize-html'

export default {
  name: 'BrowserProfilesMainTableCellNotes',

  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },

  data () {
    return {
      sanitizeHtml,
      hideNotes: true
      // showShevron: false
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      disableUi: 'main/disableUi'
    }),

    showNote () {
      if (this.browserProfile.notes &&
        this.browserProfile.notes.content &&
        this.browserProfile.notes.content !== '<p></p>' &&
        this.browserProfile.notes.content !== '<h1></h1>' &&
        this.browserProfile.notes.content !== '<h2></h2>' &&
        this.browserProfile.notes.content !== '<h3></h3>'
      ) {
        return true
      }
      return false
    },

    notesStyle () {
      if (this.browserProfile.notes && this.browserProfile.notes.style) {
        return this.browserProfile.notes.style
      }
      return ''
    },

    notesIcon () {
      if (this.browserProfile.notes && this.browserProfile.notes.icon) {
        return this.browserProfile.notes.icon
      }
      return null
    }
  },

  // mounted () {
  //   this.checkAlertContent()
  // },

  // updated () {
  //   this.checkAlertContent()
  // },

  methods: {
    async editNote () {
      await this.$store.dispatch('browserProfiles/setBrowserProfileForEdit', this.$_.cloneDeep(this.browserProfile))
      this.$store.dispatch('browserProfiles/openDialog', 'notesEdit')
    }

    // checkAlertContent () {
    //   const alertContent = document.querySelector(`#antyBrowserProfilesMainTableNotesFor-${this.browserProfile.id} .v-alert__content > span > *:first-child`)

    //   console.log(alertContent)

    //   if (alertContent && alertContent.childElementCount > 1) {
    //     this.showShevron = true
    //     return
    //   }

    //   this.showShevron = true
    // }
  }
}
</script>
<style>
.anty-notes-edit-pencil {
  opacity: 0;
}

.browser-profiles-main-table-notes-cell-alert:hover .anty-notes-edit-pencil {
  opacity: 1;
}

.browser-profiles-main-table-notes-cell-alert .v-alert__content {
  line-height: 1;
}

.browser-profiles-main-table-notes-cell-alert .v-alert__content > span > * {
  display: inline-block;
  width: inherit;
  overflow: hidden !important;
  line-height: 1.5;
}

.browser-profiles-main-table-notes-cell-alert-hidden .v-alert__content > span > * {
  display: none;
}

.browser-profiles-main-table-notes-cell-alert-hidden .v-alert__content > span > *:first-child {
  display: inline-block !important;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.browser-profiles-main-table-notes-cell-alert-icon-margin .v-alert__content {
  margin-right: 28px;
}
</style>
