<template>
  <v-container class="d-flex align-center">
    <span
      class="mr-2 main-dialog-col-label"
      style="width: 121px !important;"
    >{{ $t('common.notes') }}</span>

    <!-- ЗАМЕТКИ -->
    <div
      id="browserProfilesMainDialogFieldNotes"
      style="width: 100%;"
    >
      <!-- СТИЛИ И ИКОНКИ -->
      <div class="d-flex justify-space-between mb-1">
        <div>
          <v-btn-toggle
            v-model="browserProfile.notes.style"
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
            v-model="browserProfile.notes.icon"
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
              @click="browserProfile.notes.color = color"
            >
              <v-icon v-if="browserProfile.notes.color === color">
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
    </div>
  </v-container>
</template>

<script>
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

export default {
  name: 'BrowserProfilesMainDialogNotes',

  components: {
    EditorContent,
    EditorMenuBar
  },

  data () {
    return {
      sanitizeHtml,
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
          this.browserProfile.notes.content = sanitizeHtml(getHTML(), {
            allowedTags: ['p', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3']
          })
        }
      })
    }
  },

  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },

  created () {
    if (typeof this.browserProfile.notes.content !== 'undefined' && this.browserProfile.notes.content !== null && this.browserProfile.notes.content.length > 0) {
      this.editor.setContent(this.browserProfile.notes.content)
    }
    if (typeof this.browserProfile.notes !== 'undefined' && this.browserProfile.notes.content === null) {
      this.browserProfile.notes.icon = 'none'
    }
  },

  mounted () {
    const editorContent = this.$refs.editorContent.$el
    editorContent.addEventListener('keydown', this.handleCtrlZ)
  },

  beforeDestroy () {
    this.editor.destroy()
  },

  methods: {
    handleCtrlZ (e) {
      if (e.keyCode === 90 && e.ctrlKey) {
        if (this.browserProfile.notes.content.endsWith('</ul>') ||
          this.browserProfile.notes.content.endsWith('</ol>')) {
          for (const tag of ['</ul>', '</ol>']) {
            if (this.browserProfile.notes.content.endsWith(tag)) {
              const lastTagIndex = this.browserProfile.notes.content.lastIndexOf('<li>')
              let content = this.browserProfile.notes.content.slice(0, lastTagIndex)
              if (content.endsWith('</li>')) {
                content = `${content}${tag}`
              } else {
                content = content.slice(0, content.length - 4)
              }
              this.editor.setContent(content)
              this.browserProfile.notes.content = content
              return
            }
          }
        } else {
          for (const tag of ['</p>', '</h1>', '</h2>', '</h3>']) {
            if (this.browserProfile.notes.content.endsWith(tag)) {
              const lastTagIndex = this.browserProfile.notes.content.lastIndexOf(tag.replace('/', ''))
              const content = this.browserProfile.notes.content.slice(0, lastTagIndex)
              this.editor.setContent(content)
              this.browserProfile.notes.content = content
              return
            }
          }
        }
      }
    }
  }
}
</script>
<style>
.anty-notes-edit-editor .ProseMirror {
  min-height: 90px;
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
</style>
