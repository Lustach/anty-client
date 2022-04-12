<template>
  <v-navigation-drawer
    :value="dialogs.activityLog"
    temporary
    right
    absolute
    class="anty-browser-profile-log-drawer"
    style="position: fixed; top: 0; width: 520px; height: 100%; z-index: 99999; padding-top: 76.5px;"
    @transitionend="$emit('close')"
  >
    <v-container
      class="d-flex justify-space-between align-center anty-browser-profile-log-drawer-header"
      style="flex-wrap: wrap;"
    >
      <!-- СНАЧАЛА-->
      <div>
        {{ $t('browserProfiles.log.first') }}
        <v-btn-toggle
          v-model="filters.sort"
          mandatory
          class="mb-1"
          @change="filterEvents"
        >
          <v-btn
            value="new"
            small
            color="primary"
            outlined
          >
            {{ $t('browserProfiles.log.new') }}
          </v-btn>
          <v-btn
            value="old"
            small
            color="primary"
            outlined
          >
            {{ $t('browserProfiles.log.old') }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <!--      ФИЛЬТР-->
      <div>
        <v-btn-toggle
          v-model="filters.types"
          multiple
          class="mb-1"
          @change="filterEvents"
        >
          <v-btn
            v-for="type in allTypes"
            :key="`anty-browser-profile-log-filter-type${type}`"
            :value="type"
            small
            color="primary"
            outlined
          >
            <ion-icon
              :name="eventIcon(type)"
              style="font-size: 16px;"
              class="mr-1"
            />
            <!--            {{ $t(`browserProfiles.log.${type}`) }}-->
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-container>

    <!-- ЛОАДЕР -->
    <v-container
      v-if="loader && events.length === 0"
      class="d-flex justify-center align-center"
      style="height: 100%;"
    >
      <v-progress-circular
        indeterminate
      />
    </v-container>

    <!-- ТАЙМЛАЙН  -->
    <v-timeline
      v-else
      dense
    >
      <v-timeline-item
        v-for="(event, index) in events"
        :key="`anty-browser-profile-log-${index}-${event.id}`"
        :color="eventColor(event.type)"
        fill-dot
      >
        <!-- ИКОНКА -->
        <template #icon>
          <ion-icon
            :name="eventIcon(event.type)"
            style="font-size: 22px; color: #fff;"
          />
        </template>

        <!-- СООБЩЕНИЕ ЛОГА -->
        <v-card>
          <v-card-title style="padding-bottom: 0px;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <!--ЗАГОЛОВОК-->
              <div class="headline font-weight-thin">
                {{ $t(`browserProfiles.log.${event.type}`) }}
              </div>

              <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
                <!--ВРЕМЯ-->
                <div style="height: 18px;">
                  <v-icon
                    :size="10"
                    class="mr-1"
                    color="grey"
                    style="margin-top: 2px;"
                  >
                    fas fa-clock
                  </v-icon>
                  <span
                    style="margin-left: 1px; font-size: 12px; color: grey;"
                  >{{ moment(event.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </div>

                <!--ПОЛЬЗОВАТЕЛЬ-->
                <div style="height: 18px;">
                  <v-icon
                    :size="10"
                    class="mr-1"
                    color="grey"
                    style="margin-top: 3px;"
                  >
                    fas fa-user
                  </v-icon>
                  <span style="margin-left: 1px; color: grey; font-size: 12px;">{{ event.user.username }}</span>
                </div>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <!--ЕСЛИ СОБЫТИЕ === СЕССИЯ-->
            <div v-if="event.type === 'session' && event.content.duration.seconds">
              {{ $t('browserProfiles.log.sessionTime') + ': ' + event.content.duration.seconds }}
            </div>

            <!--ЕСЛИ СОБЫТИЕ === РЕДАКТИРОВАНИЕ-->
            <div v-if="event.type === 'update' && event.content.changedValues">
              <edit-changes
                :changed-values="event.content.changedValues"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-navigation-drawer>
</template>

<script>
import EditChanges from './BrowserMainTableActivityLogEditChanges.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'BrowserMainTableActivityLog',

  components: {
    EditChanges
  },

  data () {
    return {
      moment,
      events: [],
      allEventsLoaded: false,
      loading: false,
      loader: false,
      allTypes: ['start', 'stop', 'update', 'session'],
      filters: {
        sort: 'new',
        types: []
      },
      page: 1
    }
  },

  computed: {
    ...mapGetters({
      dialogs: 'browserProfiles/dialogs',
      browserProfile: 'browserProfiles/browserProfile'
    })
  },

  watch: {
    events: {
      deep: true,
      async handler () {
        const drawer = document.querySelector('.anty-browser-profile-log-drawer')

        if (typeof drawer !== 'undefined' && drawer !== null) {
          const drawerContent = drawer.querySelector('.v-navigation-drawer__content')
          const _this = this
          drawerContent.addEventListener('scroll', async function (e) {
            const currentPosition = e.target.scrollTop
            const height = e.target.scrollHeight - e.target.clientHeight
            const scrollPosition = currentPosition / height

            if (Math.round(scrollPosition * 100) > 95 && !_this.loading && !_this.allEventsLoaded) {
              _this.loading = true
              await _this.loadEvents()
            }
          })
        }
      }
    }
  },

  created () {
    this.loadEvents()
  },

  methods: {
    eventColor (type) {
      if (type === 'start') {
        return 'green'
      }
      if (type === 'stop') {
        return 'red'
      }
      if (type === 'update') {
        return 'orange'
      }
      if (type === 'session') {
        return 'purple'
      }
      return 'primary'
    },

    eventIcon (type) {
      if (type === 'start') {
        return 'play-outline'
      }
      if (type === 'stop') {
        return 'pause-outline'
      }
      if (type === 'update') {
        return 'pencil-outline'
      }
      if (type === 'session') {
        return 'albums-outline'
      }
      return 'ellipse-outline'
    },

    filterEvents () {
      this.events = []
      this.allEventsLoaded = false
      this.loadEvents()
    },

    async loadEvents () {
      if (typeof this.browserProfile.id === 'undefined') {
        this.$emit('close')
        return
      }

      this.loader = true

      const response = await this.api.get(`/browser_profiles/${this.browserProfile.id}/events/list?types=${this.filters.types.join()}&sort=${this.filters.sort}&page=${this.page}`)

      if (response.status === 200 && response.data.data && response.data.pagination) {
        this.events = this.events.concat(response.data.data)

        if (response.data.pagination.page === response.data.pagination.pages) {
          this.allEventsLoaded = true
        } else {
          this.page++
        }
      }

      this.loading = false
      this.loader = false
    }
  }

}
</script>
