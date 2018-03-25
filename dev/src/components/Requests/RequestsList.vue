<template>
<div id="requests-list">
  <request v-for="request in requests"
    :key="request.id"
    :id="request.id"
    :date="request.date"
    :name="request.user_name"
    :item="request.item"
    :description="request.description"
  />
  <h1 v-if="requests.length === 0" class="subtitle is-size-5">No requests available</h1>
</div>
</template>

<script>
import moment from 'moment'
import Request from './Request'

export default {
  name: 'requests-list',
  components: {
    Request
  },
  props: {
    user_id: Number,
    requests: Array
  },
  methods: {
    formatDate: function (date) {
      return moment(Date.parse(date)).format('MMM Do YY')
    }
  }
}
</script>
