<template>
  <div class="mt-4">
    <!-- ПОЛЬЗОВАТЕЛЬСКИЕ ПОЛЯ -->
    <user-fields />
  </div>
</template>
<script>
import UserFields from './BrowserProfilesMainDialogUserDataUserFields.vue'

export default {
  name: 'BrowserProfilesMainDialogUserData',

  components: {
    UserFields
  }
}
</script>
