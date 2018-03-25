<template>
<article class="media">
  <div class="media-content">
    <div class="content">
      <p>
        <strong>{{ name }}</strong> <small>{{ readableDate }}</small>
        <br>
        {{ comment }}
      </p>
    </div>
  </div>
</article>
</template>

<script>
import moment from 'moment'

export default {
  name: 'comment',
  props: ['date', 'name', 'comment'],
  computed: {
    readableDate: function () {
      return moment(Date.parse(this.date)).fromNow()
    }
  }
}
</script>


