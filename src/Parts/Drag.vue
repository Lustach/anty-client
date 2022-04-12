<template>
  <div class="h100">
    <div class="h100">
      <div
        :class="['dropZone', dragging ? 'dropZone-over' : '']"
        class="h100"
        @dragenter="dragging = true"
        @dragleave="dragging = false"
      >
        <div

          style="margin: auto;"
          class="dropZone d-flex flex-column align-center justify-center"
          @drag="onChange"
        >
          <ion-icon
            name="download-outline"
            style="font-size: 32px;"
          />

          {{ $t('browserProfiles.dragNDropOrPasteCookies') }}

          <v-btn
            id="browserProfilesMainDialogMultipleImportFileInputButton"
            class="mt-2 v-btn--active"
            small
            :color="inputError ? 'error' : 'primary'"
            outlined
            @click.stop="openFileUploader"
          >
            <ion-icon
              name="document-outline"
              style="font-size: 20px; margin-top: -2px;"
              class="mr-2"
            />
            {{ $t('browserProfiles.cookiesFromFile') }}
          </v-btn>
        </div>
        <input
          type="file"
          @click.prevent=""
          @change="onChange"
        >
        <input
          ref="inputUpload"
          type="file"
          style="display: none"
          class="aaaaaaa"
          @change="onChange"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Drag',
  props: ['inputError'],
  data: function () {
    return {
      file: '',
      dragging: false
    }
  },

  methods: {
    onChange (e) {
      const files = e.target.files || e.dataTransfer.files

      if (!files.length) {
        this.dragging = false
        return
      }

      this.createFile(files[0])
    },
    createFile (file) {
      if (file.size > 250000000) {
        alert('File size limit is 250 MB')
        this.dragging = false
        return
      }
      this.file = file
      this.dragging = false
      this.$emit('file', file)
    },
    removeFile () {
      this.file = ''
    },
    openFileUploader () {
      this.$emit('buttonClick')
      this.$refs.inputUpload.value = ''
      this.$refs.inputUpload.click()
    }
  }
}
</script>

<style scoped>
.dropZone {
  width: 100%;
  height: 100%;
  position: relative;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-over {
  background: rgba(92, 92, 92, 0.1);
  opacity: 0.8;
}

.h100 {
  height: 100%;
}
</style>
