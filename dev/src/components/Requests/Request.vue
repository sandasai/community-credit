<template>
<div class="request">
  <router-link :to="`/requests/${id}`" class="request-link">
    {{ formatDate(date) }}
    <br />
    <strong>{{ name }}</strong> requests <strong>{{ item }}</strong>
  </router-link>
</div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['id', 'date', 'name', 'item', 'description'],
  methods: {
    formatDate: function (date) {
      return moment(Date.parse(date)).format('MMM Do YY')
    }
  }
}
</script>

<style scoped>
.request {
  display: block;
}

.request::after {
  display: block;
  content: '';
  border: 1px solid #ededed;
}

.request-link {
  display: block;
  color: inherit;
}

.request-link:hover {
  color: initial;
}
</style>
