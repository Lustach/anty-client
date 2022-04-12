<template>
  <v-dialog
    :value="dialogs.editProfile"
    width="480"
    :transition="false"
    @click:outside="$store.dispatch('main/closeDialog', 'editProfile')"
    @keydown.esc="$store.dispatch('main/closeDialog', 'editProfile')"
  >
    <v-card>
      <v-toolbar
        :height="48"
        dark
        color="primary"
        class="mb-5"
      >
        <v-toolbar-title>
          {{ $t('common.editProfile') }}
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn
            icon
            @click="$store.dispatch('main/closeDialog', 'editProfile')"
          >
            <ion-icon
              name="close-outline"
              style="font-size: 28px;"
            />
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <div style="display: flex;">
          <div class="mr-3">
            <!-- АВАТАР -->
            <div style="text-align:center;">
              <user-avatar
                :size="64"
              />
            </div>

            <!-- ЗАГРУЗКА АВАТАРА -->
            <div
              style="text-align:center;"
              class="mt-2"
            >
              <v-btn
                text
                color="primary"
                x-small
                :loading="avatarUploadLoading"
                @click="avatarCropperTrigger = true"
              >
                {{ $t('common.upload') }}
              </v-btn>
            </div>

            <!-- УДАЛЕНИЕ АВАТАРА -->
            <div style="text-align:center;">
              <v-btn
                text
                :loading="avatarDeleteLoading"
                color="red"
                x-small
                @click="deleteAvatar"
              >
                {{ $t('common.delete') }}
              </v-btn>
            </div>
          </div>

          <!-- ОТОБРАЖАЕМОЕ ИМЯ -->
          <div style="width: 100%;">
            <v-text-field
              v-model="displayName"
              label="Отображаемое имя"
              outlined
              dense
              style="position: relative;"
              full-width
            />
          </div>
        </div>

        <!-- КОМПОНЕНТ ОБРЕЗКИ АВАТАРА -->
        <!-- <avatar-cropper
          v-model="avatarCropperTrigger"
          :upload-url="`${baseUrl}/profile/avatar`"
          :output-options="{width: 64, height: 64}"
          :labels="{submit: 'OK', cancel: $t('common.cancel')}"
          :request-options="{method: 'POST', headers: {'Authorization': authorizationHeader}}"
          output-mime="image/png"
          :inline="true"
          @uploading="handleAvatarUploading"
          @completed="handleAvatarUploadingCompleted"
          @error="handleAvatarUploadingError"
        /> -->
        <my-upload
          v-if="avatarCropperTrigger"
          v-model="avatarCropperTrigger"
          no-square
          field="file"
          :width="128"
          :height="128"
          :url="`${baseUrl}/profile/avatar`"
          method="POST"
          :headers="{'Authorization': authorizationHeader}"
          img-format="png"
          :lang-type="$i18n.locale"
          @crop-success="handleAvatarUploading"
          @crop-upload-success="handleAvatarUploadingCompleted"
          @crop-upload-fail="handleAvatarUploadingError"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          :loading="saveLoading"
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
// import AvatarCropper from 'vue-avatar-cropper'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import UserAvatar from '../UserAvatar.vue'

export default {
  name: 'DialogsEditProfile',

  components: {
    // AvatarCropper,
    UserAvatar,
    myUpload
  },

  data () {
    return {
      avatarCropperTrigger: false,
      avatarUploadLoading: false,
      avatarDeleteLoading: false,
      saveLoading: false,
      oldDisplayName: null
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs'
    }),

    ...mapFields('main', ['profile.displayName']),

    authorizationHeader () {
      return `Bearer ${localStorage.getItem('remoteApiToken')}`
    }
  },

  created () {
    this.oldDisplayName = this.displayName
  },

  methods: {
    async deleteAvatar () {
      this.avatarDeleteLoading = true

      try {
        await this.api.delete('/profile/avatar')
        this.$store.dispatch('main/loadProfile')
      } catch (_) {
        this.$store.dispatch('main/alert', { message: this.$t('common.somethingWentWrong'), color: 'error' })
      }

      this.avatarDeleteLoading = false
    },

    handleAvatarUploading () {
      this.avatarUploadLoading = true
    },

    handleAvatarUploadingCompleted () {
      this.avatarUploadLoading = false
      this.$store.dispatch('main/loadProfile')
      this.avatarCropperTrigger = false
    },

    handleAvatarUploadingError () {
      this.avatarUploadLoading = false
      this.$store.dispatch('main/alert', { message: this.$t('common.somethingWentWrong'), color: 'error' })
      this.avatarCropperTrigger = false
    },

    async save () {
      if (this.oldDisplayName === this.displayName) {
        this.$store.dispatch('main/closeDialog', 'editProfile')
        return
      }

      this.saveLoading = true

      try {
        await this.api.patch('/profile', { displayName: this.displayName })
      } catch (_) {
        this.$store.dispatch('main/alert', { message: this.$t('common.somethingWentWrong'), color: 'error' })
      }

      this.saveLoading = false
      this.$store.dispatch('main/closeDialog', 'editProfile')
      this.$store.dispatch('main/alert', { message: this.$t('common.success'), color: 'success' })
      this.$store.dispatch('main/loadProfile')
    }
  }
}
</script>
<style>
.avatar-cropper-btn {
  color: black !important;
}
</style>
