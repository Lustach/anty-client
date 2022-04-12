<template>
  <v-avatar
    :color="showImg ? '' : 'primary'"
    :size="size"
    class="elevation-3"
  >
    <!--
          @deniszhitnyakov
          текстовая аватарка
          если у юзера на профиле нет картинки
          сначала пробуем взять displayName
          - если displayName состоит из двух и более слов (например, имя/фамилия), то берем по первой букве из первого и второго слова
          - если displayName состоит из одного слова, берем первые две буквы из него
          - если displayName пустой, то берем первые две буквы из username (оно есть всегда)
          -->
    <span
      v-if="!showImg"
      :class="['white--text', 'font-weight-light', `text-h${textSize}`]"
    >
    {{
        profile.displayName
          ? profile.displayName.split(' ').length > 1
            ? profile.displayName.split(' ')[0].substring(0,1).toUpperCase() + profile.displayName.split(' ')[1].substring(0,1).toUpperCase()
            : profile.displayName.substring(0,2).toUpperCase()
          : profile.username
            ? profile.username.substring(0,2).toUpperCase()
            : ''
      }}
    </span>

    <img
      v-else
      :src="avatarImgUrl"
    >
  </v-avatar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    size: {
      type: Number,
      default: 36
    },
    textSize: {
      type: Number,
      default: 6
    }
  },

  data () {
    return {
      avatarImgUrl: null
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile'
    }),

    showImg () {
      return (
        typeof this.profile.avatar !== 'undefined' &&
        typeof this.profile.isAvatarDeleted !== 'undefined' &&
        this.profile.avatar &&
        parseInt(this.profile.isAvatarDeleted, 10) === 0
      )
    }
  },

  watch: {
    profile: {
      deep: true,
      handler: function (n, o) {
        this.generateAvatarImgUrl()

        // @deniszhitnyakov
        //
        // адрес аватарки всегда один и тот же
        // это значит, что ава меняется, но в браузере картинка заново не подгрузится
        // именно поэтому делаем этот костыль
        if (n.avatarUpdateTime !== o.avatarUpdateTime) {
          this.avatarImgUrl = null
          this.$forceUpdate()
          this.generateAvatarImgUrl()
        }
      }
    }
  },

  created () {
    this.generateAvatarImgUrl()
  },

  methods: {
    generateAvatarImgUrl () {
      if (this.profile.avatar) {
        // @deniszhitnyakov
        //
        // зачем в адресе нужна version=ХХХ ?
        // затем, что браузер кэширует картинку, а новая ава идет по тому же адресу, что и старая
        // поэтому в URL нужно постоянно иметь что-то новое, чтобы не срабатывал кэш
        this.avatarImgUrl = `https://anty-assets.s3.eu-central-1.amazonaws.com/avatars/${this.profile.avatar}.png?version=${Date.now()}`
      }
    }
  }
}
</script>
