<template>
  <div class="comments">
    <comment v-for="comment in comments"
      :key="comment.id"
      :date="comment.date"
      :name="comment.name"
      :comment="comment.comment"
    />
    <article class="media">
      <div class="media-content">
        <b-field
          :type="commentFieldDanger ? 'is-danger' : null"
          :message="commentFieldDanger ? 'Please include a comment' : null"
        >
          <b-input type="textarea"
              maxlength="1000"
              v-model="postComment"
              placeholder="Add a comment"
              @focus="commentFieldTouched = false"
              @blur="commentFieldTouched = true"
          >
          </b-input>  
        </b-field>
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <a @click.prevent="submit" class="button is-primary">Submit</a>
            </div>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
import Comment from './Comment'

export default {
  name: 'comment-feed',
  components: {
    Comment
  },
  data: function () {
    return {
      postComment: '',
      commentFieldTouched: false
    }
  },
  computed: {
    commentFieldDanger: function () {
      return this.commentFieldTouched && (!this.postComment || this.postComment.length === 0)
    }
  },
  props: ['comments'],
  methods: {
    submit: function () {
      if (this.commentFieldDanger) {
        return
      }
      this.$emit('post', this.postComment)
      this.postComment = ''
    }
  }
}
</script>

