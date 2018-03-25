<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Notifications</h1>
      <hr>
      <notification v-for="notification in notifications"
        :id="notification.id"
        :key="notification.id"
        :date="notification.date"
        @dismiss="dismissNotification">
        <component
          :is="notificationTypeToComponent(notification.notification_type)"
          :name="who(notification.from_user_id, notification.from_user_name)"
          :date="formatDate(notification.date)"
          :item="notification.associated_item"
          :comments="whichComments(notification)"
          :request="notification.associated_request"
          :to="notification.to"
          :itemLink="itemLink(notification.associated_item)"
        >
        </component>
      </notification>
      <h1 v-if="notifications.length === 0" class="subtitle is-size-5">No new notifications available</h1>
    </div>
  </section>
</template>

<script>
import * as Api from '@/services/api'
import moment from 'moment'
import Notification from './Notification'

const mapping = {
  'Request': 'Request',
  'Request Response': 'RequestResponse',
  'Item Dropoff': 'ItemDropoff',
  'Item Pickup': 'ItemPickup',
  'Item Comment': 'ItemComment',
  'Log Comment': 'LogComment',
  'Like': 'Like'
}

const Request = {
  template: `
    <p>
      <strong>{{ name }}</strong> requested your <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>
      <br>
      <small>{{ date }}</small>
    </p>
  `,
  props: ['name', 'date', 'item', 'itemLink']
}

const RequestResponse = {
  template: `
    <p>
      <strong>{{ name }}</strong> listed <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong> for your {{ request.item }} request
      <br><small>{{ date }}</small>
    </p>
  `,
  props: ['name', 'date', 'item', 'request', 'itemLink']
}

const ItemDropoff = {
  template: `
    <p>
      <strong>{{ name }}</strong> dropped off <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>.
      {{ formatComments }}
      <br><small>{{ date }}</small>
    </p>
  `,
  computed: {
    formatComments: function () {
      return this.comments ? `Comments: ${this.comments}` : null
    }
  },
  props: ['name', 'to', 'date', 'item', 'itemLink', 'comments']
}

const ItemPickup = {
  template: `
    <p>
      <strong>{{ name }}</strong> picked up <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>.
      {{ formatComments }}
      <br><small>{{ date }}</small>
    </p>
  `,
  computed: {
    formatComments: function () {
      return this.comments ? `Comments: ${this.comments}` : null
    }
  },
  props: ['name', 'to', 'date', 'item', 'itemLink', 'comments']
}

const ItemComment = {
  template: `
    <p>
      <strong>{{ name }}</strong> commented "{{ comments }}" on your <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>.
      <br><small>{{ date }}</small>
    </p>
  `,
  props: ['name', 'date', 'item', 'comments', 'itemLink']
}

const LogComment = {
  template: `
    <p>
      <strong>{{ name }}</strong> commented "{{ comments }}" on your <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>'s history.
      <br><small>{{ date }}</small>
    </p>
  `,
  props: ['name', 'date', 'item', 'comments', 'itemLink']
}

const Like = {
  template: `
  <p>
    <strong>{{ name }}</strong> liked your <strong><router-link :to='itemLink'>{{ item.name }}</router-link></strong>
  </p>
  `,
  props: ['name', 'date', 'item', 'comments', 'itemLink']
}

export default {
  name: 'activity-notifications',
  components: {
    Notification, Request, RequestResponse, ItemDropoff, ItemPickup, ItemComment, LogComment, Like
  },
  data: function () {
    return {
      notifications: []
    }
  },
  mounted: async function () {
    this.notifications = await Api.getNotifications()
  },
  methods: {
    notificationTypeToComponent: function (type) {
      return mapping[type]
    },
    formatDate: function (date) {
      return moment(date).fromNow()
    },
    who: function (fromId, fromUserName) {
      return fromId === this.$store.state.id ? 'You' : fromUserName
    },
    itemLink: function (item) {
      return `/items/${item.id}`
    },
    whichComments: function (notification) {
      switch (notification.notification_type) {
        case 'Item Comment':
          return notification.associated_item_comment.content
        case 'Item Pickup':
          return ''
        case 'Item Dropoff':
          return notification.associated_item_log.comments
        case 'Log Comment':
          return notification.associated_item_log.comments
        default:
          return ''
      }
    },
    dismissNotification: async function (id) {
      this.notifications = await Api.getNotifications()
    }
  }
}
</script>
