<template>
  <div class="card">
    <div class="card-image">
      <img
        v-if="item.images && item.images.length > 0"
        v-bind:src="item.images[0].url"
        v-bind:class="{ 'small-card-image' : size == 'small', 'large-card-image' : size == 'large' }"
        alt=""
      >
    </div>
    <div class="card-content">
      <p class="title is-6">
        {{ item.name }}
      </p>
      <p class="subtitle is-6">
        <small>Owner: <strong>{{ this.item.owner.name }}</strong></small>
        <template v-if="item.holder_id !== item.owner_id">
          <br>
          <small>Held By: <strong>{{ this.item.holder.name }}</strong></small>
        </template>
        <br>
        <small>{{ relativeDate }}</small>
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'item-card',
  props: [
    'item',
    'size'
  ],
  computed: {
    relativeDate: function () {
      return moment(this.item.updated_at).fromNow()
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.card {
  cursor: pointer;
}
</style>
