<template>
  <article class="media" @mouseover="show = true" @mouseout="show = false">
    <div class="media-content">
      <div class="msg-content">
        <button
          class="delete"
          aria-label="delete"
          :style="{ 'visibility': show ? null : 'hidden'}"
          @click="dismiss">
        </button>              
        <slot>
        </slot>
      </div>
    </div>
  </article>
</template>

<script>
import moment from 'moment'
import * as Api from '@/services/api'

export default {
  data: function () {
    return {
      show: false
    }
  },
  props: ['id', 'date'],
  computed: {
    formatDate: function () {
      return moment(this.date).fromNow()
    }
  },
  methods: {
    dismiss: async function () {
      const result = await Api.dismissNotification(this.id)
      if (result) {
        this.$emit('dismiss', this.id)
      }
    }
  }
}
</script>

<style scoped>
.msg-content {
  display: flex;
  align-items: center;
}

.media-left {
  vertical-align: middle;
}

.delete {
  margin: 0 10px;
}
</style>
