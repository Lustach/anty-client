<template>
  <v-row>
    <multiple-import-general-input
      id="multipleImportGeneralInput"
      :validation="validation"
    />
    <multiple-import-general-tags />
    <multiple-import-general-statuses />
    <multiple-import-general-platform />
    <multiple-import-general-main-website />
    <multiple-import-general-proxy-mode />
    <multiple-import-general-proxy-input
      v-if="[1, 2].includes(browserProfile.proxyMode)"
      :validation="validation"
    />
    <!-- <multiple-import-general-notes /> -->

    <multiple-import-additional-useragent
      id="multipleImportAdditionalUseragent"
      :validation="validation"
    />
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
    <multiple-import-additional-screen :validation="validation" />
    <multiple-import-additional-media />
    <multiple-import-additional-ports />
    <multiple-import-additional-do-not-track />
  </v-row>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import MultipleImportGeneralInput from './BrowserProfilesMainDialogMultipleImportGeneralInput.vue'
import MultipleImportGeneralTags from './BrowserProfilesMainDialogMultipleImportGeneralTags.vue'
import MultipleImportGeneralStatuses from './BrowserProfilesMainDialogMultipleImportGeneralStatuses.vue'
import MultipleImportGeneralPlatform from './BrowserProfilesMainDialogMultipleImportGeneralPlatform.vue'
import MultipleImportGeneralMainWebsite from './BrowserProfilesMainDialogMultipleImportGeneralMainWebsite.vue'
import MultipleImportGeneralProxyMode from './BrowserProfilesMainDialogMultipleImportGeneralProxyMode.vue'
import MultipleImportGeneralProxyInput from './BrowserProfilesMainDialogMultipleImportGeneralProxyInput.vue'
// import MultipleImportGeneralNotes from './BrowserProfilesMainDialogMultipleImportGeneralNotes.vue'

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
import MultipleImportAdditionalScreen from './BrowserProfilesMainDialogMultipleImportAdditionalScreen.vue'
import MultipleImportAdditionalMedia from './BrowserProfilesMainDialogMultipleImportAdditionalMedia.vue'
import MultipleImportAdditionalPorts from './BrowserProfilesMainDialogMultipleImportAdditionalPorts.vue'
import MultipleImportAdditionalDoNotTrack from './BrowserProfilesMainDialogMultipleImportAdditionalDoNotTrack.vue'

export default {
  name: 'BrowserProfilesMainDialogMultipleImportGeneral',

  components: {
    MultipleImportGeneralInput,
    MultipleImportGeneralTags,
    MultipleImportGeneralStatuses,
    MultipleImportGeneralPlatform,
    MultipleImportGeneralMainWebsite,
    MultipleImportGeneralProxyMode,
    MultipleImportGeneralProxyInput,
    // MultipleImportGeneralNotes,

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
    MultipleImportAdditionalScreen,
    MultipleImportAdditionalMedia,
    MultipleImportAdditionalPorts,
    MultipleImportAdditionalDoNotTrack
  },

  props: {
    validation: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapFields('browserProfilesMultipleImport', ['browserProfile'])
  }
}
</script>
