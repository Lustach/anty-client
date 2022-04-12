<template>
  <v-dialog
    :value="dialogs.notesEdit"
    width="500"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="close"
    @keydown.esc="close"
    @keydown.shift.13="save"
    @keydown.ctrl.13="checkBeforeSave('ctrl')"
    @keydown.meta.13="checkBeforeSave('meta')"
  >
    <v-card>
      <!-- ЗАГОЛОВОК -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="mb-5 pr-0"
      >
        <v-toolbar-title>
          {{ $t('common.notes') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="close"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <!-- СТИЛИ И ИКОНКИ -->
        <div class="d-flex justify-space-between mb-1">
          <div>
            <v-btn-toggle
              v-model="style"
              mandatory
            >
              <v-btn
                value="text"
                small
                text
                color="primary"
              >
                <div
                  style="opacity: 50%; border-radius: 3px; width: 16px; height: 16px; background-color: #9E9E9E;"
                />
              </v-btn>
              <v-btn
                value="outline"
                small
                text
                color="primary"
              >
                <div
                  style="opacity: 50%; border-radius: 3px; width: 16px; height: 16px; border: 2px solid #2196F3;"
                />
              </v-btn>
              <v-btn
                value="outline-text"
                small
                text
                color="primary"
              >
                <div
                  style="opacity: 50%; border-radius: 3px; width: 16px; height: 16px; background-color: #9E9E9E; border: 2px solid #2196F3;"
                />
              </v-btn>
            </v-btn-toggle>
          </div>
          <div>
            <v-btn-toggle
              v-model="icon"
              mandatory
            >
              <v-btn
                value="info"
                small
                icon
                color="primary"
              >
                <v-icon :size="18">
                  mdi-information
                </v-icon>
              </v-btn>
              <v-btn
                value="success"
                small
                icon
                color="primary"
              >
                <v-icon :size="18">
                  mdi-check-circle
                </v-icon>
              </v-btn>
              <v-btn
                value="warning"
                small
                icon
                color="primary"
              >
                <v-icon :size="18">
                  mdi-exclamation
                </v-icon>
              </v-btn>
              <v-btn
                value="error"
                small
                icon
                color="primary"
              >
                <v-icon :size="18">
                  mdi-alert
                </v-icon>
              </v-btn>
              <v-btn
                value="none"
                small
                icon
                color="red"
              >
                <ion-icon name="ban-outline" />
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <!-- КНОПКИ РЕДАКТОРА -->
        <editor-menu-bar
          v-slot="{ commands, isActive }"
          :editor="editor"
          class="mb-2"
        >
          <div
            class="menubar d-flex align-center"
            style="min-height: 40px;"
          >
            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.bold() }"
              icon
              small
              @click="commands.bold"
            >
              <v-icon
                :size="16"
                :color="isActive.bold() ? 'primary' : ''"
              >
                fas fa-bold
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.italic() }"
              icon
              small
              @click="commands.italic"
            >
              <v-icon
                :size="16"
                :color="isActive.italic() ? 'primary' : ''"
              >
                fas fa-italic
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.underline() }"
              icon
              small
              @click="commands.underline"
            >
              <v-icon
                :size="15"
                :color="isActive.underline() ? 'primary' : ''"
              >
                fas fa-underline
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.strike() }"
              icon
              small
              @click="commands.strike"
            >
              <v-icon
                :size="16"
                :color="isActive.strike() ? 'primary' : ''"
              >
                fas fa-strikethrough
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.bullet_list() }"
              icon
              small
              @click="commands.bullet_list"
            >
              <v-icon
                :size="16"
                :color="isActive.bullet_list() ? 'primary' : ''"
              >
                fas fa-list-ul
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.ordered_list() }"
              icon
              small
              @click="commands.ordered_list"
            >
              <v-icon
                :size="16"
                :color="isActive.ordered_list() ? 'primary' : ''"
              >
                fas fa-list-ol
              </v-icon>
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 1 }) }"
              icon
              small
              :color="isActive.heading({ level: 1 }) ? 'primary' : ''"
              @click="commands.heading({ level: 1 })"
            >
              H1
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              icon
              small
              :color="isActive.heading({ level: 2 }) ? 'primary' : ''"
              @click="commands.heading({ level: 2 })"
            >
              H2
            </v-btn>

            <v-btn
              class="menubar__button"
              :class="{ 'is-active': isActive.heading({ level: 3 }) }"
              icon
              small
              :color="isActive.heading({ level: 3 }) ? 'primary' : ''"
              @click="commands.heading({ level: 3 })"
            >
              H3
            </v-btn>
            <div style="margin-left: auto;">
              <v-btn
                v-for="color in ['red', 'orange', 'yellow', 'green', 'blue', 'purple']"
                :key="`anty-notes-color-${color}`"
                icon
                x-small
                :color="color"
                @click="selectedColor = color"
              >
                <v-icon v-if="selectedColor === color">
                  fas fa-check-circle
                </v-icon>
                <v-icon v-else>
                  fas fa-circle
                </v-icon>
              </v-btn>
            </div>
          </div>
        </editor-menu-bar>

        <!-- РЕДАКТОР -->
        <editor-content
          ref="editorContent"
          :editor="editor"
          class="anty-notes-edit-editor editor__content"
        />
      </v-card-text>

      <v-divider />

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />

        <v-btn
          small
          text
          color="grey"
          @click="close"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          small
          text
          color="primary"
          :loading="loading"
          :disabled="content.length === 0"
          @click="save"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Italic,
  Strike,
  Underline
  // History
} from 'tiptap-extensions'
import sanitizeHtml from 'sanitize-html'
import platform from 'platform'

export default {
  name: 'BrowserProfilesMainTableCellNotesDialogEdit',

  components: {
    EditorContent,
    EditorMenuBar
  },

  data () {
    return {
      sanitizeHtml,
      initContent: null,
      content: '',
      selectedColor: 'blue',
      style: 'text',
      icon: null,
      loading: false,
      editor: new Editor({
        disablePasteRules: ['italic'],
        disableInputRules: ['italic'],
        extensions: [
          new BulletList(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline()
          // new History()
        ],

        onUpdate: ({ getHTML }) => {
          this.content = sanitizeHtml(getHTML(), {
            allowedTags: ['p', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3']
          })
        }
      })
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      profile: 'main/profile',
      browserProfiles: 'browserProfiles/browserProfiles'
    }),
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  beforeDestroy () {
    this.editor.destroy()
  },

  created () {
    if (typeof this.browserProfile.notes.content !== 'undefined' && this.browserProfile.notes.content !== null && this.browserProfile.notes.content.length > 0) {
      try { this.initContent = this.browserProfile.notes.content } catch (_) { /* */ }

      this.editor.setContent(this.browserProfile.notes.content)
      this.content = this.browserProfile.notes.content
    }
    if (typeof this.browserProfile.notes.color !== 'undefined' && this.browserProfile.notes.color !== null && this.browserProfile.notes.color) {
      this.selectedColor = this.browserProfile.notes.color
    }
    if (typeof this.browserProfile.notes.style !== 'undefined' && this.browserProfile.notes.style !== null && this.browserProfile.notes.style) {
      this.style = this.browserProfile.notes.style
    }
    if (typeof this.browserProfile.notes.icon !== 'undefined' && this.browserProfile.notes.icon !== null && this.browserProfile.notes.icon) {
      this.icon = this.browserProfile.notes.icon
    } else {
      this.icon = 'none'
    }
  },

  mounted () {
    const editorContent = this.$refs.editorContent.$el
    editorContent.addEventListener('keydown', this.handleCtrlZ)
  },

  methods: {
    close () {
      this.$store.dispatch('browserProfiles/closeDialog', 'notesEdit')
    },

    handleCtrlZ (e) {
      if (e.keyCode === 90 && e.ctrlKey) {
        if (this.content.endsWith('</ul>') || this.content.endsWith('</ol>')) {
          for (const tag of ['</ul>', '</ol>']) {
            if (this.content.endsWith(tag)) {
              const lastTagIndex = this.content.lastIndexOf('<li>')
              let content = this.content.slice(0, lastTagIndex)
              if (content.endsWith('</li>')) {
                content = `${content}${tag}`
              } else {
                content = content.slice(0, content.length - 4)
              }
              this.editor.setContent(content)
              this.content = content
              return
            }
          }
        } else {
          for (const tag of ['</p>', '</h1>', '</h2>', '</h3>']) {
            if (this.content.endsWith(tag)) {
              const lastTagIndex = this.content.lastIndexOf(tag.replace('/', ''))
              const content = this.content.slice(0, lastTagIndex)
              this.editor.setContent(content)
              this.content = content
              return
            }
          }
        }
      }
    },

    checkBeforeSave (key) {
      const os = platform.os.toString().toLowerCase()
      if (key === 'ctrl' && os.includes('windows')) this.save()
      if (key === 'meta' && !os.includes('windows')) this.save()
    },

    async save () {
      if (this.content.length === 0) return

      this.loading = true
      const clonedBrowserProfile = this.$_.cloneDeep(this.browserProfile)
      clonedBrowserProfile.notes = {
        content: this.content,
        color: this.selectedColor,
        style: this.style,
        icon: this.icon === 'none' ? null : this.icon
      }
      // AMPLITUDE СОБЫТИЕ - изменение заметки
      try {
        if (this.initContent && this.initContent !== clonedBrowserProfile.notes.content) {
          this.$amplitude.getInstance().logEvent('Note Edit')
        }
      } catch (_) { console.log(_) }

      // AMPLITUDE СОБЫТИЕ - создание заметки
      try {
        if (!this.initContent && clonedBrowserProfile.notes.content) {
          this.$amplitude.getInstance().logEvent('Note Add')
        }
      } catch (_) { console.log(_) }

      try {
        const response = await this.api.patch(`/browser_profiles/${this.browserProfile.id}`, { notes: clonedBrowserProfile.notes })
        if (response.status !== 200 || (!response.data && !response.data.data)) {
          throw response
        }

        this.$store.dispatch('browserProfiles/loadCurrentPage')
      } catch (err) {
        console.error(err)
      } finally {
        this.close()
        this.loading = false
      }
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
