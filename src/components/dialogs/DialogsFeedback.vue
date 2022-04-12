<template>
  <v-dialog
    id="feedbackDialog"
    :value="dialogs.feedback"
    width="600"
    scrollable
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'feedback')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'feedback')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="mb-5"
      >
        <v-toolbar-title>
          {{ $t('sidebar.feedback') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('main/closeDialog', 'feedback')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-container class="pb-0">
          <v-btn-toggle
            v-model="type"
            mandatory
          >
            <v-btn
              value="bug"
              small
              color="primary"
              outlined
            >
              <span class="mr-1">
                <ion-icon
                  name="bug-outline"
                  style="font-size: 18px;"
                />
              </span>
              {{ $t('dialogs.feedback.bug') }}
            </v-btn>
            <v-btn
              value="idea"
              small
              color="primary"
              outlined
            >
              <span class="mr-1">
                <ion-icon
                  name="bulb-outline"
                  style="font-size: 18px;"
                />
              </span>
              {{ $t('dialogs.feedback.idea') }}
            </v-btn>
            <v-btn
              value="review"
              small
              color="primary"
              outlined
            >
              <span class="mr-1">
                <ion-icon
                  name="document-text-outline"
                  style="font-size: 18px;"
                />
              </span>
              {{ $t('dialogs.feedback.review') }}
            </v-btn>
            <v-btn
              value="feature"
              small
              color="primary"
              outlined
            >
              <span class="mr-1">
                <ion-icon
                  name="extension-puzzle-outline"
                  style="font-size: 18px;"
                />
              </span>
              {{ $t('dialogs.feedback.feature') }}
            </v-btn>
          </v-btn-toggle>
        </v-container>
        <v-container>
          <v-textarea
            v-model="content"
            dense
            outlined
            hide-details
            auto-grow
            :spellcheck="false"
          />
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$store.dispatch('main/closeDialog', 'feedback')"
        >
          {{ $t('common.close') }}
        </v-btn>
        <v-btn
          text
          color="primary"
          :loading="loading"
          @click="sendFeedback"
        >
          {{ $t('common.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DialogsFeedback',

  data () {
    return {
      type: 'feature',
      content: '',
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs'
    })
  },

  methods: {
    async sendFeedback () {
      this.loading = true

      await this.api.post('/feedback', {
        type: this.type,
        content: this.content
      })

      this.$store.dispatch('main/closeDialog', 'feedback')
      this.loading = false
      this.$store.dispatch('main/alert', { color: 'success', message: this.$t('dialogs.feedback.feedbackSent') })
    }
  }
}
</script>

<style>
.anty-notes-edit-editor .ProseMirror {
  min-height: 200px;
  border: solid 2px #9E9E9E;
  border-radius: 5px;
  padding: 10px;
  outline: none !important;
}

.anty-notes-edit-editor .ProseMirror p {
  margin-bottom: 0 !important;
}

.anty-notes-edit-editor .ProseMirror-focused {
  border-color: #2196F3;
}
.anty-notes-link-textfield-append .v-input__append-inner{
  margin-top: auto !important;
  margin-bottom: auto !important;
}
</style>
