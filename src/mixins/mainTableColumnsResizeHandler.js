import { mapFields } from 'vuex-map-fields'

export default {
  data () {
    return {
      curCol: null,
      curColWidth: null,
      curColComputedWidth: null,
      mainTableColumns: null,
      pageX: null,
      diffX: null,
      curColResizer: null,
      tab: null,
      tabWrapper: null
    }
  },

  computed: {
    ...mapFields('main', ['profile'])
  },

  methods: {
    resizbaleColumns (tab) {
      const mainTable = document.querySelector(`.resizableMainTable${tab}`)

      if (mainTable && mainTable.querySelector('thead')) {
        mainTable.querySelector('table').style.width = '1px'
        mainTable.querySelector('thead').classList.add('resizable-header')

        this.mainTableColumns = Array.prototype.slice.call(mainTable.querySelector('thead > tr').children)
        this.tab = tab

        this.tabWrapper = document.querySelector(`#view${tab}`)
        this.tabWrapper.addEventListener('mousemove', this.documentMouseMove)
        this.tabWrapper.addEventListener('mouseup', this.documentMouseUp)

        if (this.$_.isEmpty(this.profile.columnsWidth)) {
          this.mainTableColumns.forEach((col, colIndex) => {
            if (colIndex === 0) return

            if (colIndex === 1) {
              this.mainTableColumns[colIndex].style.width = '250px'
              this.mainTableColumns[colIndex].style.minWidth = '250px'
              return
            }

            if (colIndex === 2) {
              this.mainTableColumns[colIndex].style.width = '150px'
              this.mainTableColumns[colIndex].style.minWidth = '150px'
              return
            }

            this.mainTableColumns[colIndex].style.width = '200px'
            this.mainTableColumns[colIndex].style.minWidth = '200px'
          })
        }

        this.mainTableColumns.forEach((col, index) => {
          if (index === 0) return

          const lastColumnIndex = this.mainTableColumns.length - 1
          if (index === lastColumnIndex) {
            let complexWidth = 0
            const mainTableWrapper = document.querySelector('#browser-profiles-main-table')

            this.mainTableColumns.forEach((item) => {
              complexWidth += item.offsetWidth
            })

            if (complexWidth < mainTableWrapper.offsetWidth) {
              let firstColumnsComplexWidth = 0

              this.mainTableColumns.forEach((item, itemIndex) => {
                if (itemIndex === lastColumnIndex) return
                firstColumnsComplexWidth += item.offsetWidth
              })

              this.mainTableColumns[lastColumnIndex].style.width = `${mainTableWrapper.offsetWidth - firstColumnsComplexWidth}px`
              this.mainTableColumns[lastColumnIndex].style.minWidth = `${mainTableWrapper.offsetWidth - firstColumnsComplexWidth}px`
            }
          }

          const existingDiv = col.querySelector('div.column-resizer')
          if (existingDiv) existingDiv.remove()

          const div = this.createDiv()
          const thinDiv = this.createThinDiv()

          col.appendChild(div)
          col.appendChild(thinDiv)

          const _this = this
          div.addEventListener('mousedown', function (e) {
            _this.tabWrapper.classList.add('cursor-col-resize')

            _this.curColResizer = _this.createResizerPreview(e.pageX)
            mainTable.querySelector('thead').appendChild(_this.curColResizer)

            _this.curCol = e.target.parentElement
            _this.pageX = e.pageX

            _this.curColWidth = _this.curCol.offsetWidth
          })

          col.addEventListener('mouseover', function (e) {
            const thinResizer = e.target.querySelector('.column-resizer-thin')
            const previousThinResizer = e.target.previousSibling ? e.target.previousSibling.querySelector('.column-resizer-thin') : null
            if (thinResizer) {
              thinResizer.style.display = 'block'
            }
            if (previousThinResizer) {
              previousThinResizer.style.display = 'block'
            }
          })
          col.addEventListener('mouseleave', function (e) {
            const thinResizer = e.target.querySelector('.column-resizer-thin')
            const previousThinResizer = e.target.previousSibling ? e.target.previousSibling.querySelector('.column-resizer-thin') : null
            const preview = document.querySelector('.column-resizer-preview')

            if (thinResizer) {
              thinResizer.style.display = 'none'
            }

            if (preview) return

            if (previousThinResizer) {
              previousThinResizer.style.display = 'none'
            }
          })
        })
      }
    },

    createDiv () {
      const div = document.createElement('div')

      div.className = 'column-resizer'
      div.style.top = 0
      div.style.right = '1px'
      div.style.width = '5px'
      div.style.position = 'absolute'
      div.style.cursor = 'col-resize'
      div.style.userSelect = 'none'
      div.style.height = '100%'
      div.style.zIndex = 2

      return div
    },

    createThinDiv () {
      const div = document.createElement('div')

      div.className = 'column-resizer-thin'
      div.style.display = 'none'
      div.style.top = 0
      div.style.right = '3px'
      div.style.width = '1px'
      div.style.position = 'absolute'
      div.style.cursor = 'col-resize'
      div.style.userSelect = 'none'
      div.style.height = '100%'
      div.style.zIndex = 1

      return div
    },

    createResizerPreview (pageX) {
      const div = document.createElement('div')

      div.className = 'column-resizer-preview'
      div.style.position = 'absolute'
      div.style.top = '0'
      div.style.left = `${pageX - 64}px`
      div.style.width = '1px'
      div.style.backgroundColor = 'rgba(158, 158, 158, .3)'
      div.style.zIndex = '5'

      return div
    },

    async documentMouseUp () {
      this.tabWrapper.classList.remove('cursor-col-resize')

      if (this.curCol) {
        this.curCol.style.width = `${this.curColComputedWidth}px`
        this.curCol.style.minWidth = `${this.curColComputedWidth}px`

        const notesAlerts = document.querySelectorAll('.browser-profiles-main-table-notes-cell-alert')
        if (this.curCol.className.includes('column-name-notes') && notesAlerts && notesAlerts.length > 0) {
          notesAlerts.forEach(notesAlert => {
            notesAlert.querySelector('.v-alert__content > span').style.width = `${this.curColComputedWidth - 128}px`
          })
        }

        let complexWidth = 0
        const lastColumnIndex = this.mainTableColumns.length - 1
        const mainTableWrapper = document.querySelector('#browser-profiles-main-table')

        this.mainTableColumns.forEach((item) => {
          complexWidth += item.offsetWidth
        })

        if (complexWidth < mainTableWrapper.offsetWidth) {
          let firstColumnsComplexWidth = 0

          this.mainTableColumns.forEach((item, itemIndex) => {
            if (itemIndex === lastColumnIndex) return
            firstColumnsComplexWidth += item.offsetWidth
          })

          this.mainTableColumns[lastColumnIndex].style.width = `${mainTableWrapper.offsetWidth - firstColumnsComplexWidth}px`
          this.mainTableColumns[lastColumnIndex].style.minWidth = `${mainTableWrapper.offsetWidth - firstColumnsComplexWidth}px`
        }

        const columnsWidth = {}

        this.mainTableColumns.forEach(col => {
          if (col.classList && col.classList.length > 0) {
            col.classList.forEach(className => {
              if (className.startsWith('column-name-')) {
                columnsWidth[className.replace('column-name-', '')] = col.offsetWidth
              }
            })
          }
        })

        this.profile.columnsWidth = columnsWidth
        this.api.patch('/profile', { columnsWidth: columnsWidth })
      }

      this.curCol = null
      this.curColWidth = null
      this.curColComputedWidth = null
      this.pageX = null

      if (this.curColResizer) this.curColResizer.remove()
      this.curColResizer = null
    },

    documentMouseMove (e) {
      if (this.curCol) {
        this.diffX = e.pageX - this.pageX

        this.curColComputedWidth = this.diffX + this.curCol.offsetWidth

        if (this.curColResizer && e.pageX > 63 && e.pageX < (document.querySelector('body').offsetWidth - 11)) {
          this.curColResizer.style.left = `${e.pageX - 64}px`
        }
      }
    }

    // getLastColWidth () {
    //   let lastColWidth = null
    //   const complexWidth = this.getComplexWidth()
    //   const mainTableWrapper = document.querySelector('#browser-profiles-main-table')

    //   if (mainTableWrapper && complexWidth < mainTableWrapper.offsetWidth) {
    //     const lastCol = this.profile.columns[this.profile.columns.length - 1]
    //     if (this.profile.columnsWidth[lastCol]) {
    //       lastColWidth = mainTableWrapper.offsetWidth - complexWidth + this.profile.columnsWidth[lastCol]
    //     } else {
    //       lastColWidth = mainTableWrapper.offsetWidth - complexWidth + 200
    //     }
    //   }

    //   return lastColWidth
    // },

    // getComplexWidth () {
    //   let complexWidth = 44

    //   if (this.profile.columnsWidth && this.profile.columnsWidth.name) {
    //     complexWidth += this.profile.columnsWidth.name
    //   } else {
    //     complexWidth += 250
    //   }
    //   if (this.profile.columnsWidth && this.profile.columnsWidth.actions) {
    //     complexWidth += this.profile.columnsWidth.actions
    //   } else {
    //     complexWidth += 150
    //   }

    //   if (this.profile && this.profile.columns && Array.isArray(this.profile.columns)) {
    //     this.profile.columns.forEach(col => {
    //       if (this.profile.columnsWidth[col]) {
    //         complexWidth += this.profile.columnsWidth[col]
    //       } else {
    //         complexWidth += 200
    //       }
    //     })
    //   }

    //   return complexWidth
    // }
  }
}
