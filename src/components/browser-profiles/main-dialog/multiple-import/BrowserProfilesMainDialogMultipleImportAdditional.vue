<template>
  <v-row>
    <multiple-import-additional-useragent :validation="validation" />
    <multiple-import-additional-webrtc :validation="validation" />
    <multiple-import-additional-canvas />
    <multiple-import-additional-webgl />
    <multiple-import-additional-webgl-info :validation="validation" />
    <multiple-import-additional-client-rects />
    <multiple-import-additional-timezone :validation="validation" />
    <multiple-import-additional-locale :validation="validation" />
    <multiple-import-additional-geolocation :validation="validation" />
    <multiple-import-additional-cpu />
    <multiple-import-additional-memory />
    <multiple-import-additional-do-not-track />
  </v-row>
</template>

<script>
import MultipleImportAdditionalUseragent from './BrowserProfilesMainDialogMultipleImportAdditionalUseragent.vue'
import MultipleImportAdditionalWebrtc from './BrowserProfilesMainDialogMultipleImportAdditionalWebrtc.vue'
import MultipleImportAdditionalCanvas from './BrowserProfilesMainDialogMultipleImportAdditionalCanvas.vue'
import MultipleImportAdditionalWebgl from './BrowserProfilesMainDialogMultipleImportAdditionalWebgl.vue'
import MultipleImportAdditionalWebglInfo from './BrowserProfilesMainDialogMultipleImportAdditionalWebglInfo.vue'
import MultipleImportAdditionalClientRects from './BrowserProfilesMainDialogMultipleImportAdditionalClientRects.vue'
import MultipleImportAdditionalTimezone from './BrowserProfilesMainDialogMultipleImportAdditionalTimezone.vue'
import MultipleImportAdditionalLocale from './BrowserProfilesMainDialogMultipleImportAdditionalLocale.vue'
import MultipleImportAdditionalGeolocation from './BrowserProfilesMainDialogMultipleImportAdditionalGeolocation.vue'
import MultipleImportAdditionalCpu from './BrowserProfilesMainDialogMultipleImportAdditionalCpu.vue'
import MultipleImportAdditionalMemory from './BrowserProfilesMainDialogMultipleImportAdditionalMemory.vue'
import MultipleImportAdditionalDoNotTrack from './BrowserProfilesMainDialogMultipleImportAdditionalDoNotTrack.vue'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportAdditional',

  components: {
    MultipleImportAdditionalUseragent,
    MultipleImportAdditionalWebrtc,
    MultipleImportAdditionalCanvas,
    MultipleImportAdditionalWebgl,
    MultipleImportAdditionalWebglInfo,
    MultipleImportAdditionalClientRects,
    MultipleImportAdditionalTimezone,
    MultipleImportAdditionalLocale,
    MultipleImportAdditionalGeolocation,
    MultipleImportAdditionalCpu,
    MultipleImportAdditionalMemory,
    MultipleImportAdditionalDoNotTrack
  },

  props: {
    validation: {
      type: Object,
      required: true
    }
  }
}
</script>
