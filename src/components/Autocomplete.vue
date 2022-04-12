<template>
  <div class="autocomplete">
    <v-textarea
      :id="id"
      v-model="inputValue"
      outlined
      solo
      :label="label"
      :rows="rows"
      :cols="cols"
      :placeholder="placeholder"
      type="text"
      hide-details="true"
      @change="$emit('change', $event)"
      @focusout="focusout"
      @focus="focus"
      @keydown.13="chooseItem"
      @keydown.tab="chooseItem"
      @keydown.40="moveDown"
      @keydown.38="moveUp"
    />

    <ul
      v-if="searchMatch.length > 0"
      :class="{
        'autocomplete-list': true,
        [id+'-list']: true
      }"
    >
      <li
        v-for="(result, index) in searchMatchLimited"
        :key="index"
        :class="{active: selectedIndex === index}"
        @click="selectItem(index), chooseItem()"
        v-html="highlightWord(result)"
      />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Autocomplete',

  props: ['value', 'items', 'placeholder', 'label', 'rows', 'cols'],
  data () {
    return {
      id: 'input-' + parseInt(Math.random() * 1000),
      searchMatch: [],
      selectedIndex: 0,
      clickedChooseItem: false,
      wordIndex: 0
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    listToSearch () {
      return this.items
    },
    currentWord () {
      return this.inputValue && this.inputValue.length > 0
        ? this?.inputValue?.replace(/(\r\n|\n|\r)/gm, ' ').split(' ')[this.wordIndex] ?? ''
        : ''
    },
    inputSplitted () {
      return this?.inputValue?.replace(/(\r\n|\n|\r)/gm, ' ').split(' ') ?? ''
    },
    searchMatchLimited () {
      return this.searchMatch.slice(0, 6)
    }
  },
  watch: {
    inputValue () {
      this.focus()

      this.selectedIndex = 0
      this.wordIndex = this.inputSplitted.length - 1
    }
  },
  mounted () {
    const _self = this
    document.querySelector('#' + this.id)
      .addEventListener('input', function () {
        const caret = _self.getCaretCoordinates(this, this.selectionEnd)

        if (_self.searchMatch.length > 0) {
          const element = document.querySelectorAll('.' + _self.id + '-list')

          if (element[0]) {
            element[0].style.top = (caret.top - element[0].offsetHeight) + 'px'
          }
        }
      })
  },
  methods: {
    highlightWord (word) {
      const regex = new RegExp('(' + this.currentWord + ')', 'g')
      return word.replace(regex, '<mark>$1</mark>')
    },
    setWord (word) {
      const currentWords = this.inputValue.replace(/(\r\n|\n|\r)/gm, '__br__ ').split(' ')
      currentWords[this.wordIndex] = currentWords[this.wordIndex].replace(this.currentWord, word + ' ')
      this.wordIndex += 1
      this.inputValue = currentWords.join(' ').replace(/__br__\s/g, '\n')
    },
    moveDown () {
      if (this.selectedIndex < this.searchMatch.length - 1) {
        this.selectedIndex++
      }
    },
    moveUp () {
      if (this.selectedIndex !== -1) {
        this.selectedIndex--
      }
    },
    selectItem (index) {
      this.selectedIndex = index
      this.chooseItem()
    },
    chooseItem (e) {
      this.clickedChooseItem = true

      if (this.selectedIndex !== -1 && this.searchMatch.length > 0) {
        if (e) {
          e.preventDefault()
        }
        this.setWord(this.searchMatch[this.selectedIndex])
        this.selectedIndex = -1
      }
    },
    focusout (e) {
      setTimeout(() => {
        if (!this.clickedChooseItem) {
          this.searchMatch = []
          this.selectedIndex = -1
        }
        this.clickedChooseItem = false
      }, 100)
    },
    focus () {
      this.searchMatch = []
      if (this.currentWord.length >= 3) {
        this.searchMatch = this.listToSearch.filter(
          el => el.indexOf(this.currentWord) >= 0
        )
      }
      if (
        this.searchMatch.length === 1 &&
        this.currentWord === this.searchMatch[0]
      ) {
        this.searchMatch = []
      }
    },
    getCaretCoordinates (element, position, options) {
      const properties = [
        'direction', // RTL support
        'boxSizing',
        'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        'height',
        'overflowX',
        'overflowY', // copy the scrollbar for IE

        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',

        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',

        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',

        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration', // might not make a difference, but better be safe

        'letterSpacing',
        'wordSpacing',

        'tabSize',
        'MozTabSize'

      ]

      const isBrowser = (typeof window !== 'undefined')
      const isFirefox = (isBrowser && window.mozInnerScreenX != null)

      if (!isBrowser) {
        throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser')
      }

      const debug = (options && options.debug) || false
      if (debug) {
        const el = document.querySelector('#input-textarea-caret-position-mirror-div')
        if (el) el.parentNode.removeChild(el)
      }

      // The mirror div will replicate the textarea's style
      const div = document.createElement('div')
      div.id = 'input-textarea-caret-position-mirror-div'
      document.body.appendChild(div)

      const style = div.style
      const computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle // currentStyle for IE < 9
      const isInput = element.nodeName === 'INPUT'

      // Default textarea styles
      style.whiteSpace = 'pre-wrap'
      if (!isInput) { style.wordWrap = 'break-word' } // only for textarea-s

      // Position off-screen
      style.position = 'absolute' // required to return coordinates properly
      if (!debug) { style.visibility = 'hidden' } // not 'display: none' because we want rendering

      // Transfer the element's properties to the div
      properties.forEach(function (prop) {
        if (isInput && prop === 'lineHeight') {
          // Special case for <input>s because text is rendered centered and line height may be != height
          if (computed.boxSizing === 'border-box') {
            const height = parseInt(computed.height)
            const outerHeight =
              parseInt(computed.paddingTop) +
              parseInt(computed.paddingBottom) +
              parseInt(computed.borderTopWidth) +
              parseInt(computed.borderBottomWidth)
            const targetHeight = outerHeight + parseInt(computed.lineHeight)
            if (height > targetHeight) {
              style.lineHeight = height - outerHeight + 'px'
            } else if (height === targetHeight) {
              style.lineHeight = computed.lineHeight
            } else {
              style.lineHeight = 0
            }
          } else {
            style.lineHeight = computed.height
          }
        } else {
          style[prop] = computed[prop]
        }
      })

      if (isFirefox) {
        // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
        if (element.scrollHeight > parseInt(computed.height)) { style.overflowY = 'scroll' }
      } else {
        style.overflow = 'hidden' // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
      }

      div.textContent = element.value.substring(0, position)
      // The second special handling for input type="text" vs textarea:
      // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
      if (isInput) { div.textContent = div.textContent.replace(/\s/g, '\u00a0') }

      const span = document.createElement('span')
      // Wrapping must be replicated *exactly*, including when a long word gets
      // onto the next line, with whitespace at the end of the line before (#7).
      // The  *only* reliable way to do that is to copy the *entire* rest of the
      // textarea's content into the <span> created at the caret position.
      // For inputs, just '.' would be enough, but no need to bother.
      span.textContent = element.value.substring(position) || '.' // || because a completely empty faux span doesn't render at all
      div.appendChild(span)

      const coordinates = {
        top: span.offsetTop + parseInt(computed.borderTopWidth),
        left: span.offsetLeft + parseInt(computed.borderLeftWidth),
        height: parseInt(computed.lineHeight)
      }

      if (debug) {
        span.style.backgroundColor = '#aaa'
      } else {
        document.body.removeChild(div)
      }

      return coordinates
    }
  }
}
</script>

<style scoped>
.autocomplete {
  position: relative;
}

.autocomplete label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 100;
}

.autocomplete-list {
  position: absolute;
  left: 0;
  z-index: 2;
  overflow: auto;
  min-width: 250px;
  margin: 0;
  padding: 0;
  border: 1px solid #eee;
  list-style: none;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
}

.theme--dark .autocomplete-list {
    background-color: #1E1E1E;
    border-color: rgba(255, 255, 255, 0.24);
}

.autocomplete-list li {
  margin: 0;
  padding: 8px 11px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
  color: black;
}

.theme--dark .autocomplete-list li {
    color: white;
}

.autocomplete-list li:last-child {
  border-bottom: 0;
}

.autocomplete-list li:hover,
.autocomplete-list li.active {
  background-color: #f5f5f5;
}

.theme--dark .autocomplete-list li:hover,
.theme--dark .autocomplete-list li.active {
  background-color: #585858;
}
</style>
