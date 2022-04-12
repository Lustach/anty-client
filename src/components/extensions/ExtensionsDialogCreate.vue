<template>
  <v-dialog
    :value="dialogs.create"
    width="600"
    :overlay-opacity="0.9"
    scrollable
    :transition="false"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card>
      <!-- ХЭДЕР ДИАЛОГА -->
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="pr-0"
        elevation="0"
      >
        <!-- ЗАГОЛОВОК -->
        <v-toolbar-title>
          {{ $t('common.create') + ' ' + $t('common.extension').toLowerCase() }}
        </v-toolbar-title>
        <!-- ЗАГОЛОВОК КОНЕЦ -->

        <v-spacer />

        <!-- ИКОНКА ЗАКРЫТЬ -->
        <v-toolbar-items>
          <v-btn
            id="extensionsDialogCreateCloseButton"
            icon
            @click="closeDialog"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
        <!-- ИКОНКА ЗАКРЫТЬ КОНЕЦ -->
      </v-toolbar>
      <!-- ХЭДЕР ДИАЛОГА КОНЕЦ -->

      <!-- ТЕЛО ДИАЛОГА -->
      <v-card-text class="pb-0">
        <!-- ТАБЫ -->
        <v-tabs
          v-model="tab"
          grow
        >
          <!-- ДОБАВИТЬ ИЗ CHROME WEB STORE -->
          <v-tab>
            {{ $t('extensions.addFromChromeWebStore') }}
          </v-tab>

          <!-- ЗАГРУЗИТЬ ФАЙЛ -->
          <v-tab>
            {{ $t('extensions.uploadFile') }}
          </v-tab>
        </v-tabs>
        <!-- ТАБЫ КОНЕЦ -->

        <!-- КОНТЕНТ ТАБОВ -->
        <v-tabs-items v-model="tab">
          <!-- ДОБАВИТЬ ИЗ CHROME WEB STORE -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="px-0">
                <!-- САЙТЫ -->
                <v-btn-toggle
                  id="extensionsDialogCreateMainWebsiteButtonToggle"
                  :value="mainWebsite"
                  mandatory
                  multiple
                  class="mb-4"
                >
                  <v-btn
                    v-for="mainWebsiteItem in mainWebsitesList"
                    :id="`extensionsDialogCreateMainWebsite${capitalize(mainWebsiteItem.value)}Button`"
                    :key="`item-mainWebsite-${mainWebsiteItem.name}`"
                    :value="mainWebsiteItem.value"
                    small
                    color="primary"
                    outlined
                    @click="handleMainWebsiteClick(mainWebsiteItem.value)"
                  >
                    <v-icon
                      v-if="mainWebsiteItem.value !== 'crypto'"
                      size="16"
                      color="primary"
                      class="mr-1"
                    >
                      {{ mainWebsiteItem.icon }}
                    </v-icon>
                    <icon
                      v-else-if="mainWebsiteItem.value === 'crypto'"
                      name="crypto"
                      style="height: 20px; width: 20px;"
                      class="mr-1 color-primary"
                    />
                    {{ mainWebsiteItem.name }}
                  </v-btn>
                </v-btn-toggle>
                <!-- САЙТЫ КОНЕЦ -->

                <!-- URL -->
                <v-text-field
                  id="extensionsDialogCreateMainWebsiteTextField"
                  v-model="extensionUrl"
                  :label="$t('common.chromeWebStoreURL')"
                  outlined
                  dense
                  :error-messages="errorMessage"
                  :hide-details="touched && $v.$invalid ? false : true"
                  :spellcheck="false"
                />
                <!-- URL КОНЕЦ -->

                <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
                <v-switch
                  id="extensionsDialogCreateMainWebsiteSharedToEntireTeam"
                  v-model="sharedToEntireTeam"
                  :label="$t('common.sharedToEntireTeam')"
                  hide-details
                />
                <!-- ОБШИЙ ДЛЯ КОМАНДЫ КОНЕЦ -->
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- ДОБАВИТЬ ИЗ CHROME WEB STORE КОНЕЦ -->

          <!-- ЗАГРУЗИТЬ ФАЙЛ -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="px-0">
                <!-- САЙТЫ -->
                <v-btn-toggle
                  id="extensionsDialogCreateMainWebsiteButtonToggle"
                  :value="mainWebsite"
                  mandatory
                  multiple
                  class="mb-4"
                >
                  <v-btn
                    v-for="mainWebsiteItem in mainWebsitesList"
                    :id="`extensionsDialogCreateMainWebsite${capitalize(mainWebsiteItem.value)}Button`"
                    :key="`item-mainWebsite-${mainWebsiteItem.name}`"
                    :value="mainWebsiteItem.value"
                    small
                    color="primary"
                    outlined
                    @click="handleMainWebsiteClick(mainWebsiteItem.value)"
                  >
                    <v-icon
                      v-if="mainWebsiteItem.value !== 'crypto'"
                      size="16"
                      color="primary"
                      class="mr-1"
                    >
                      {{ mainWebsiteItem.icon }}
                    </v-icon>
                    <icon
                      v-else-if="mainWebsiteItem.value === 'crypto'"
                      name="crypto"
                      style="height: 20px; width: 20px;"
                      class="mr-1 color-primary"
                    />
                    {{ mainWebsiteItem.name }}
                  </v-btn>
                </v-btn-toggle>
                <!-- САЙТЫ КОНЕЦ -->

                <div class="d-flex align-center">
                  <div class="mr-3 d-flex flex-column align-center">
                    <!-- ИКОНКА -->
                    <v-avatar
                      :color="extensionIcon ? null : 'purple'"
                      class="elevation-3"
                    >
                      <div
                        v-if="!extensionIcon"
                        class="icon-anty-logo"
                      >
                        <icon name="logoAnty" />
                      </div>
                      <img
                        v-else
                        :src="extensionIcon"
                      >
                    </v-avatar>

                    <!-- ЗАГРУЗКА ИКОНКИ -->
                    <v-btn
                      class="mt-2"
                      text
                      color="primary"
                      x-small
                      @click="iconCropperTrigger = true"
                    >
                      {{ $t('common.upload') }}
                    </v-btn>
                    <!-- ЗАГРУЗКА ИКОНКИ КОНЕЦ -->

                    <!-- УДАЛЕНИЕ ИКОНКИ -->
                    <v-btn
                      text
                      color="red"
                      x-small
                      @click="extensionIcon = null"
                    >
                      {{ $t('common.delete') }}
                    </v-btn>
                    <!-- УДАЛЕНИЕ ИКОНКИ КОНЕЦ -->
                  </div>
                  <div style="width: 100%;">
                    <!-- НАЗВАНИЕ РАСШИРЕНИЯ -->
                    <v-text-field
                      v-model="extensionName"
                      outlined
                      dense
                      :error-messages="errorMessage"
                      :hide-details="touched && $v.extensionName.$invalid ? false : true"
                      :label="$t('extensions.extensionName')"
                    />
                    <!-- НАЗВАНИЕ РАСШИРЕНИЯ КОНЕЦ-->

                    <div
                      v-if="extensionZipFile"
                      class="mt-2"
                    >
                      <span class="extension-file-name">
                        {{ extensionZipFile.name }}
                      </span>
                      <v-btn
                        class="ml-1"
                        color="primary"
                        icon
                        @click="extensionZipFile = null"
                      >
                        <ion-icon
                          name="trash-outline"
                          style="font-size: 20px;"
                        />
                      </v-btn>
                    </div>

                    <!-- Загрузить файл -->
                    <v-chip
                      v-else
                      outlined
                      label
                      :color="showValidationError('extensionZipFile', 'required') ? 'error' : 'primary'"
                      class="mt-4"
                      style="cursor: pointer;"
                      @click="openFileUploader"
                    >
                      <ion-icon
                        name="document-outline"
                        class="mr-1"
                      />
                      {{ $t('extensions.uploadZip') }}
                    </v-chip>
                    <div
                      v-if="showValidationError('extensionZipFile', 'required')"
                      style="color: #F44336;"
                    >
                      {{ $t('common.fieldRequired') }}
                    </div>
                    <!-- Загрузить файл конец -->

                    <!-- СКРЫТЫЙ ФАЙЛОВЫЙ ИНПУТ -->
                    <input
                      v-show="false"
                      ref="inputUpload"
                      type="file"
                      accept=".zip"
                      @change="handleInputUpload"
                    >
                    <!-- СКРЫТЫЙ ФАЙЛОВЫЙ ИНПУТ КОНЕЦ -->
                  </div>
                </div>

                <!-- ОБШИЙ ДЛЯ КОМАНДЫ -->
                <v-switch
                  id="extensionsDialogCreateMainWebsiteSharedToEntireTeam"
                  v-model="sharedToEntireTeam"
                  :label="$t('common.sharedToEntireTeam')"
                  hide-details
                />

                <!-- КРОП ИКОНКИ -->
                <my-upload
                  v-if="iconCropperTrigger"
                  v-model="iconCropperTrigger"
                  no-square
                  field="file"
                  :width="128"
                  :height="128"
                  img-format="png"
                  :lang-type="$i18n.locale"
                  class="icon-cropper"
                  @crop-success="cropSuccess"
                />
                <!-- КРОП ИКОНКИ КОНЕЦ -->
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!-- ЗАГРУЗИТЬ ФАЙЛ КОНЕЦ -->
        </v-tabs-items>
        <!-- КОНТЕНТ ТАБОВ КОНЕЦ -->
      </v-card-text>
      <!-- ТЕЛО ДИАЛОГА КОНЕЦ -->

      <!-- КНОПКИ ДИАЛОГА -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="closeDialog"
        >
          {{ $t('common.close') }}
        </v-btn>

        <v-btn
          id="extensionsDialogCreateCreateButton"
          color="primary"
          text
          :loading="loading"
          @click="touch"
        >
          {{ $t('common.create') }}
        </v-btn>
      </v-card-actions>
      <!-- КНОПКИ ДИАЛОГА КОНЕЦ -->
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, helpers, maxLength } from 'vuelidate/lib/validators'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import { icon } from '@/assets/icons'

export default {
  name: 'ExtensionsDialogCreate',

  components: {
    icon,
    myUpload
  },

  data () {
    return {
      extensionZipFile: null,
      extensionName: '',
      extensionIcon: null,
      iconCropperTrigger: false,
      tab: null,
      loading: false,
      touched: false,
      mainWebsite: ['all'],
      name: '',
      extensionUrl: '',
      sharedToEntireTeam: false,
      mainWebsitesList: [
        { name: this.$t('common.websitesAll'), value: 'all', icon: 'fas fa-globe' },
        { name: 'Facebook', value: 'facebook', icon: 'fab fa-facebook-square' },
        { name: 'Google', value: 'google', icon: 'fab fa-google' },
        { name: 'TikTok', value: 'tiktok', icon: 'fab fa-tiktok' },
        { name: 'Crypto', value: 'crypto' }

      ],
      alphaRegex: /^(https:\/\/chrome\.google\.com\/webstore\/detail\/)/
    }
  },

  validations () {
    if (this.tab === 1) {
      return {
        extensionName: { required, maxLength: maxLength(20) },
        extensionZipFile: { required }
      }
    }

    const alpha = helpers.regex('alpha', this.alphaRegex)
    return {
      extensionUrl: { required, alpha }
    }
  },

  computed: {
    ...mapGetters({
      extensions: 'extensions/extensions',
      dialogs: 'extensions/dialogs',
      pagination: 'extensions/pagination'
    }),

    errorMessage () {
      if (this.touched && this.tab === 0) {
        if (this.$v.extensionUrl.required === false) {
          return this.$t('common.fieldRequired')
        }

        if (this.$v.extensionUrl.alpha === false) {
          return this.$t('common.validChromeWebstoreUrlField')
        }
      }

      if (this.touched && this.tab === 1) {
        if (this.$v.extensionName.required === false) {
          return this.$t('common.fieldRequired')
        }
        if (this.$v.extensionName.maxLength === false) {
          return this.$t('validation.max', { length: 20 })
        }
      }

      return null
    }
  },

  watch: {
    tab () {
      this.touched = false
    },
    extensionUrl () {
      this.touched = false
    },
    extensionName () {
      this.touched = false
    }
  },

  methods: {
    closeDialog () {
      this.$store.dispatch('extensions/closeDialog', 'create')
    },

    touch () {
      this.$v.$touch()
      this.touched = true

      if (this.$v.$invalid) return

      if (this.tab === 0) {
        this.createExtension()
      } else if (this.tab === 1) {
        this.uploadZipped()
      }
    },

    async createExtension () {
      this.loading = true
      try {
        await this.api.post('/extensions', {
          url: this.extensionUrl,
          sharedToEntireTeam: this.sharedToEntireTeam,
          mainWebsite: this.mainWebsite
        })
          .then(() => {
            this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.created') })

            const payload = {
              query: this.pagination.query,
              page: this.pagination.currentPage,
              itemsPerPage: this.pagination.perPage
            }
            this.$store.dispatch('extensions/loadExtensions', payload)
            this.closeDialog()
          })
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    capitalize (string) {
      return string.substring(0, 1).toUpperCase() + string.substring(1)
    },

    handleMainWebsiteClick (mainWebsite) {
      switch (mainWebsite) {
        case 'all':
          this.mainWebsite = ['all']
          break
        default:
          this.mainWebsite = this.mainWebsite.filter(i => i !== 'all')
          if (this.mainWebsite.includes(mainWebsite)) {
            this.mainWebsite = this.mainWebsite.filter(i => i !== mainWebsite)
          } else {
            this.mainWebsite.push(mainWebsite)
          }
          break
      }

      switch (this.mainWebsite.length) {
        case 4:
          this.mainWebsite = ['all']
          break
      }
    },

    cropSuccess (imgDataUrl) {
      this.extensionIcon = imgDataUrl
    },

    openFileUploader () {
      this.$refs.inputUpload.value = ''
      this.$refs.inputUpload.click()
    },

    handleInputUpload () {
      const file = this.$refs.inputUpload.files[0]
      if (file) {
        this.extensionZipFile = file
      }
    },

    async uploadZipped () {
      this.loading = true
      try {
        const payload = new FormData()
        payload.append('sharedToEntireTeam', +this.sharedToEntireTeam)
        this.mainWebsite.map(item => payload.append('mainWebsite[]', item))
        payload.append('file', this.extensionZipFile)
        payload.append('extensionName', this.extensionName)
        payload.append('sharedToEntireTeam', this.sharedToEntireTeam ? 1 : 0)

        // // const file = await this.getBase64(this.extensionZipFile)
        // console.log(this.extensionZipFile)
        // const payload = {
        //   file: this.extensionZipFile,
        //   sharedToEntireTeam: this.sharedToEntireTeam,
        //   mainWebsite: this.mainWebsite
        // }

        const response = await this.api.post('/extensions/upload-zipped', payload)

        const { status, data } = response
        if (status === 200 && data && data.success) {
          this.$store.dispatch('main/alert', { color: 'success', message: this.$t('common.created') })

          const payload = {
            query: this.pagination.query,
            page: this.pagination.currentPage,
            itemsPerPage: this.pagination.perPage
          }
          this.$store.dispatch('extensions/loadExtensions', payload)

          this.closeDialog()
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },

    showValidationError (field, param) {
      return this.touched && this.$v[field] && !this.$v[field][param]
    },

    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  }
}
</script>
<style>
.icon-cropper .vicp-wrap {
  left: 56px;
}
.icon-cropper .vicp-crop {
  display: flex;
}
.icon-cropper .vicp-crop-right {
  margin-left: auto;
  margin-right: auto;
}
.icon-cropper .vicp-preview .vicp-preview-item span {
  left: 0;
}
.icon-anty-logo {
  width: 70%;
  height: 100%;
  margin-top: auto;
  margin-bottom: auto;
  color: white;
}
.extension-file-name {
  font-weight: bold;
}
.theme--dark .extension-file-name {
  color: #2196f3 !important;
}
.theme--light .extension-file-name {
  color: #1976d2 !important;
}
</style>
