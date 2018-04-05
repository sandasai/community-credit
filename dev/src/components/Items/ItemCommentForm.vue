<template>
  <article class="media">
    <div class="media-content">
      <b-field>
        <b-input type="textarea"
          maxlength="1000"
          placeholder="Add a comment"
          v-model="comments"
        >
        </b-input>
      </b-field>
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <a @click.prevent="comment" class="button is-primary">Submit</a>
          </div>
        </div>
      </nav>
    </div>
  </article>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'item-comment-form',
  data: function () {
    return {
      comments: ''
    }
  },
  methods: {
    comment: async function () {
      this.$toast.open({
        message: 'Comment posted!',
        type: 'is-success'
      })
      this.$emit('submit')
    }
  }
}
</script>

