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
    <div class="media-right" v-if="canDelete">
      <button @click="remove" class="delete"></button>
    </div>
  </article>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'log-entry',
  props: ['id', 'type', 'date', 'message', 'userMessage', 'canDelete'],
  computed: {
    formattedDate: function () {
      return moment(this.date).fromNow()
    }
  },
  methods: {
    remove: async function () {
      if (this.type === 'comment') {
        try {
          await axios({
            method: 'DELETE',
            url: `/api/items/${this.$route.params.id}/comments/${this.id}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
            }
          })
          this.$toast.open({
            message: 'Comment deleted!',
            type: 'is-default'
          })
          this.$emit('submit')
        } catch (err) {
          this.$toast.open({
            message: 'Could not delete comment!',
            type: 'is-danger'
          })
        }
      }
    }
  }
}
</script>
