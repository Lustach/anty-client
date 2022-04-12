<template>
  <v-col
    :cols="8"
    :offset="2"
    class="text-center mt-2"
  >
    <v-dialog
      v-model="openImportedData"
      scrollable
      :transition="false"
    >
      <v-card>
        <!-- ХЭДЕР ДИАЛОГА -->
        <v-toolbar
          :height="48"
          dark
          flat
          dense
          color="primary"
          class="pr-0"
        >
          <v-toolbar-title>
            {{ $t('common.dataCheck') }}
          </v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn
              icon
              @click="openImportedData = false"
            >
              <ion-icon
                name="close-outline"
                style="font-size: 28px;"
              />
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text class="mt-2">
          <v-simple-table
            fixed-header
            height="50vh"
          >
            <template #default>
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in multipleImportHeaders"
                    :key="`main-dialog-multiple-import-data-dialog-header-${index}`"
                    class="text-left"
                  >
                    {{ $t(`browserProfiles.multipleImportHeaders.${item}`) }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item, index) in browserProfile.multipleImportData"
                  :key="`main-dialog-multiple-import-data-dialog-body-${index}`"
                >
                  <td
                    v-for="(cell, cellIndex) in item"
                    :key="`main-dialog-multiple-import-data-dialog-body-cell-${cellIndex}`"
                    :class="{'text-center': [1, 5].includes(parseInt(cellIndex, 10))}"
                  >
                    <ion-icon
                      v-if="[1, 5].includes(parseInt(cellIndex, 10)) && !!cell"
                      name="checkmark-outline"
                    />
                    <div
                      v-else-if="!!cell"
                      style="width: max-content;"
                    >
                      {{ cell }}
                    </div>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <!-- КНОПКИ ДИАЛОГА -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="grey"
            @click="openImportedData = false"
          >
            {{ $t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <input
      v-show="false"
      ref="inputUpload"
      type="file"
      @change="inputHandler"
    >
    <!-- ТЕКСТАРЕА ДЛЯ ПАРСИНГА ПРОФИЛЕЙ -->
    <v-textarea
      id="browserProfilesMainDialogMultipleImportFileInputTextarea"
      ref="fileInputTextarea"
      v-model="browserProfile.multipleImportInput"
      :rows="browserProfile.multipleImportFile ? 1 : 5"
      :no-resize="browserProfile.multipleImportFile ? true : false"
      outlined
      dense
      :spellcheck="false"
      class="file-input-textarea transparent-scrollbar"
      clearable
      :loading="loading"
      :error="inputError"
      :error-messages="errorMessage"
      :hide-details="inputError ? false : true"
      @focus="focusInput"
      @blur="inputFocused = false"
      @click:clear="clearInput"
    >
      <template
        v-if="!browserProfile.multipleImportInput && !inputFocused"
        #prepend-inner
      >
        <div
          class="d-flex flex-column align-center justify-center"
          style="margin: auto;"
          :style="`height: ${prependInnerOffsetHeight}`"
        >
          <ion-icon
            name="download-outline"
            style="font-size: 32px;"
          />

          {{ $t('common.dragNDropOrPaste') }}
          <v-btn
            id="browserProfilesMainDialogMultipleImportFileInputButton"
            class="mt-2 v-btn--active"
            small
            :color="inputError ? 'error' : 'primary'"
            outlined
            @click="openFileUploader"
          >
            <ion-icon
              name="document-outline"
              style="font-size: 20px; margin-top: -2px;"
              class="mr-2"
            />
            {{ $t('browserProfiles.fromFile') }}
          </v-btn>
        </div>
      </template>
    </v-textarea>

    <v-alert
      v-if="wrongFormat"
      text
      type="error"
      color="error"
      dense
      class="mb-0 mt-2 text-start"
    >
      {{ $t('common.wrongFormat') }}
    </v-alert>

    <v-btn
      v-if="browserProfile.multipleImportData.length > 0"
      class="mt-2"
      color="success"
      @click="openImportedData = true"
    >
      {{ $t('common.checkData') }}
    </v-btn>

    <div style="text-align: start;">
      <span
        id="browserProfilesMainDialogMultipleImportExportTemplate"
        style="color: #2196F3; cursor: pointer;"
        @click="exportTemplate"
      >
        {{ $t('common.downloadTemplate') }}
      </span>
    </div>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import multipleImportHeaders from '@/constants/browserProfiles/multipleImportHeaders.js'
import Papa from 'papaparse'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneralInput',

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      multipleImportHeaders,
      openImportedData: false,
      extRegExp: new RegExp(/^.*\.(xlsx|xls|csv)$/),
      inputFocused: false,
      prependInnerOffsetHeight: '100%',
      loading: false
    }
  },

  computed: {
    ...mapGetters({ innerHeight: 'main/innerHeight' }),
    ...mapFields('browserProfilesMultipleImport', ['browserProfile', 'browserProfileTouched']),

    wrongFormat () {
      const file = this.browserProfile.multipleImportFile
      return file && !this.extRegExp.test(file.name)
    },

    inputError () {
      return this.browserProfileTouched && this.validation.browserProfile.multipleImportData.$error
    },

    errorMessage () {
      if (this.inputError && (this.browserProfile.multipleImportFile || this.browserProfile.multipleImportInput)) {
        return this.$t('browserProfiles.multipleImport.invalidData')
      } else if (this.inputError) {
        return this.$t('authorization.fieldRequired')
      }

      return ''
    }
  },

  watch: {
    'browserProfile.multipleImportInput' (newVal) {
      if (!newVal) {
        this.browserProfile.multipleImportFile = null
        this.browserProfile.multipleImportData = []
        // this.browserProfile.multipleImportHeaders = []
      } else {
        this.parseString(newVal)
      }
    },

    'browserProfile.multipleImportFile': {
      deep: true,
      handler (newVal) {
        if (newVal === null) {
          this.browserProfile.multipleImportData = []
          // this.browserProfile.multipleImportHeaders = []
        }
      }
    }
  },

  mounted () {
    if (this.$refs && this.$refs.fileInputTextarea) {
      const prependInner = this.$refs.fileInputTextarea.$el.querySelector('div.v-input__control')
      prependInner.addEventListener('dragover', (e) => e.preventDefault())
      prependInner.addEventListener('drop', this.dropHandler)

      this.prependInnerOffsetHeight = `${prependInner.offsetHeight}px`
    }
  },

  methods: {
    clearInput () {
      // this.$refs.fileInputTextarea.blur()
      this.setReadonly(false)
    },

    async parseString (string) {
      try {
        this.loading = true
        const rows = await Papa.parse(string, { delimiter: '\t' }).data

        // let multipleImportHeaders = []
        const multipleImportData = []
        let testRows = [0, 1]

        for (const rowIndex in rows) {
          const row = rows[rowIndex]

          // Определить включает ли таблица строку с информацией
          if (parseInt(rowIndex, 10) === 0 && /Dolphin{anty}/i.test(row[0])) {
            testRows = testRows.map(i => ++i)
            continue
          }
          // Определить включает ли таблица хэдеры
          if ((parseInt(rowIndex, 10) === 0 || parseInt(rowIndex, 10) === 1) && /Profile name/i.test(row[0])) {
            testRows = testRows.map(i => ++i)
            continue
          }

          // Исключить первые 2 строки с примерами
          if (testRows.includes(parseInt(rowIndex, 10)) && /example/i.test(row[0])) continue

          if (row.find(rowVal => rowVal)) {
            if (row[5]) {
              row[5] = row[5].toString().split('\n').map(i => `<p>${i}</p>`).join('')
            }
            multipleImportData.push(row.slice(0, 6))
          }
        }

        // this.browserProfile.multipleImportHeaders = multipleImportHeaders
        this.browserProfile.multipleImportData = multipleImportData
      } catch (_) {
        // Do nothing
      } finally {
        this.loading = false
      }
    },

    focusInput () {
      setTimeout(() => {
        this.inputFocused = true
      }, 50)
    },

    setReadonly (value) {
      if (this.$refs && this.$refs.fileInputTextarea) {
        this.$refs.fileInputTextarea.$el.querySelector('div.v-text-field__slot textarea').readOnly = value
      }
    },

    openFileUploader () {
      this.$refs.inputUpload.value = ''
      this.$refs.inputUpload.click()
    },

    inputHandler (e) {
      const file = e.target.files[0]
      this.browserProfile.multipleImportFile = file

      if (file.name.endsWith('.csv')) {
        this.handleCsvFile(file)
      } else {
        this.handleExcelFile(file)
      }
    },

    dropHandler (e) {
      const file = e.dataTransfer.files[0]

      if (!file) return

      this.browserProfile.multipleImportFile = file

      if (file.name.endsWith('.csv')) {
        this.handleCsvFile(file)
      } else {
        this.handleExcelFile(file)
      }
    },

    async handleCsvFile (file) {
      if (file && file.name) {
        this.browserProfile.multipleImportInput = file.name
        this.setReadonly(true)
      }

      if (this.wrongFormat) return

      const _this = this
      this.browserProfile.multipleImportData = []

      Papa.parse(file, {
        complete: function (results) {
          const rows = results.data

          // let multipleImportHeaders = []
          const multipleImportData = []
          let testRows = [0, 1]

          for (const rowIndex in rows) {
            const row = rows[rowIndex]

            // Определить включает ли таблица строку с информацией
            if (parseInt(rowIndex, 10) === 0 && /Dolphin{anty}/i.test(row[0])) {
              testRows = testRows.map(i => ++i)
              continue
            }
            // Определить включает ли таблица хэдеры
            if ((parseInt(rowIndex, 10) === 0 || parseInt(rowIndex, 10) === 1) && /Profile name/i.test(row[0])) {
              testRows = testRows.map(i => ++i)
              continue
            }

            // Исключить первые 2 строки с примерами
            if (testRows.includes(parseInt(rowIndex, 10)) && /example/i.test(row[0])) continue

            if (row.find(rowVal => rowVal)) {
              if (row[5]) {
                row[5] = row[5].toString().split('\n').map(i => `<p>${i}</p>`).join('')
              }
              multipleImportData.push(row.slice(0, 6))
            }
          }

          // this.browserProfile.multipleImportHeaders = multipleImportHeaders
          _this.browserProfile.multipleImportData = multipleImportData
        }
      })
    },

    async handleExcelFile (file) {
      if (file && file.name) {
        this.browserProfile.multipleImportInput = file.name
        this.setReadonly(true)
      }

      const response = await this.localApi.post('/xlsx-populate/parse-browser-profiles-data', {
        path: file.path
      })
      const { status, data } = response
      if (status === 200 && data.success) {
        this.browserProfile.multipleImportData = data.data
      }
    },

    async exportTemplate () {
      const response = await this.localApi.get('/xlsx-populate/mass-import-template')
      const { status, data } = response
      if (status === 200 && data.success) {
        this.$store.dispatch('main/alert', {
          color: 'success',
          message: this.$t('common.fileExportedToDownloads')
        })
      }
    }
  }
}
</script>
