<template>
  <div class="d-flex">
    <!-- ТАРИФ -->
    <div
      v-if="subscription.plan"
      id="InfoBarSubscriptionPlan"
      class="mr-2"
    >
      {{ $t(`infoBar.plans.${subscription.plan}`) }}
    </div>

    <!-- ДАТА ИСТЕЧЕНИЯ -->
    <div
      v-if="subscription.expiration"
      id="InfoBarSubscriptionDate"
      class="mr-2"
    >
      {{ moment.parseZone(subscription.expiration).local().format("YYYY-DD-MM HH:mm:ss") }}
    </div>

    <!-- ПОЛЬЗОВАТЕЛИ -->
    <div
      v-if="subscription.users && profile.role === 'admin'"
      id="InfoBarSubscriptionUsers"
      class="mr-2"
    >
      {{ $t('infoBar.users') + ' ' }}
      {{ subscription.users.count + " /" }}
      <span style="font-weight: bold;">
        {{ subscription.users.limit }}
      </span>
    </div>

    <!-- ПРОФИЛИ -->
    <div
      v-if="subscription.browserProfiles"
      id="InfoBarSubscriptionProfiles"
    >
      {{ $t('infoBar.profiles') + ' ' }}
      {{ subscription.browserProfiles.count + " /" }}
      <span style="font-weight: bold;">
        {{ subscription.browserProfiles.limit }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'InfoBarSubscription',

  data () {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters({
      subscription: 'main/subscription',
      profile: 'main/profile'
    })
  }
}
</script>
