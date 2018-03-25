<template>
  <div>
    <notifications />
    <feed />
  </div>
</template>

<script>
import * as Api from '@/services/api'
import Feed from './Feed'
import Notifications from './Notifications'

export default {
  name: 'activity',
  components: {
    Feed, Notifications
  },
  data: function () {
    return {
      notifications: []
    }
  },
  mounted: async function () {
    this.notifications = await Api.getNotifications()
  }
}
</script>
