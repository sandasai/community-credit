<template>
  <article class="media" @mouseover="hovering = true" @mouseout="hovering = false">
    <div class="media-content">
      <div class="content-log">
        <div class="content-left">
          <small>{{ this.leftContent }}:&nbsp;&nbsp;&nbsp;&nbsp;</small>
        </div>
        <div class="content-main">
          <drop-off v-if="log.item_log_type === 'Drop off'" 
            :name="log.user_name" :date="log.dropoff_at" :comments="log.comments"/>
          <pick-up v-if="log.item_log_type === 'Pick up'" 
            :name="log.user_name" :date="log.pickup_at" :comments="log.comments"/>
          <request v-if="log.item_log_type === 'Request'"
            :name="log.user_name" :date="log.updated_at"/>
          <talk v-if="log.item_log_type === 'Talk'"
            :name="log.user_name" :comments="log.comments"/>
          <created v-if="log.item_log_type === 'Created'" />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment'

function formatDate (date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

const DropOff = {
  template: `
  <span>
    <strong>{{ this.name }}</strong> dropped off the item on {{ this.formatDate }}.
    <template v-if="this.comments">
      <br>
      <small><strong>Comments:</strong></small> {{ this.comments }}
    </template>
  </span>
  `,
  name: 'drop-off',
  props: ['name', 'date', 'comments'],
  computed: {
    formatDate: function () {
      return formatDate(this.date)
    }
  }
}

const PickUp = {
  template: `
  <span>
    <strong>{{ this.name }}</strong> picked up the item on {{ this.formatDate }}.
    <template v-if="this.comments">
      <br>
      <small><strong>Comments:</strong></small> {{ this.comments }}
    </template>
  </span>
  `,
  name: 'pick-up',
  props: ['name', 'date', 'comments'],
  computed: {
    formatDate: function () {
      return moment(this.date).format('MMMM Do YYYY, h:mm:ss a')
    }
  }
}

const Request = {
  template: `
  <span>
    <strong>{{ this.name }}</strong> requested this item on {{ this.formatDate }}.
  </span>
  `,
  name: 'request',
  props: ['name', 'date'],
  computed: {
    formatDate: function () {
      return formatDate(this.date)
    }
  }
}

const Talk = {
  template: `
  <span>
    <strong>{{ this.name }}</strong> commented: {{ this.comments }}
  </span>
  `,
  name: 'talk',
  props: ['name', 'comments']
}

const Created = {
  template: `<span>This item was added to the store.</span>`,
  name: 'created'
}

export default {
  name: 'log-entry',
  components: {
    DropOff, PickUp, Request, Talk, Created
  },
  data: function () {
    return {
      hovering: false
    }
  },
  props: ['log', 'last'],
  computed: {
    leftContent: function () {
      return moment(this.log.updated_at).format('MMM Do YY')
    }
  },
  methods: {
    undo: async function () {
      await this.$store.dispatch('deleteItemLog', this.log.id)
      this.$toast.open({
        message: 'Undo action!',
        type: 'is-success'
      })
    }
  }
}
</script>

<style scoped>
.content-log {
  display: flex;
}

.content-main {
  flex: 1 0 auto;
}
.content-right {
  flex: 0 1 auto;
}
</style>
