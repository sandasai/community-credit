<template>
  <article class="media" @mouseover="hovering = true" @mouseout="hovering = false">
    <div class="media-content">
      <div class="content-log">
        <div class="content-left">
          <small>{{ formattedDate }}:&nbsp;&nbsp;&nbsp;&nbsp;</small>
        </div>
        <div class="content-main">
          <span>
            {{ this.message }}
            <template v-if="this.userMessage">
              <br>
              <small><strong>Comments:</strong></small> {{ this.userMessage }}
            </template>
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment'

export default {
  name: 'log-entry',
  props: ['date', 'message', 'userMessage'],
  computed: {
    formattedDate: function () {
      return moment(this.date).fromNow()
    }
  }
}
</script>
