<template>
<section>
  <form @submit.prevent="handleSubmit">
    <b-field label="Item"
      :type="itemFieldDanger ? 'is-danger' : null"
      :message="itemFieldDanger ? 'This field is required': null">
      <b-input
        v-model="item"
        placeholder="What item are you looking for?"
        @blur="itemFieldTouched = true"></b-input>
    </b-field>

    <b-field label="Description">
      <b-input
        v-model="description"
        maxlength="200"
        type="textarea"
        placeholder="Where, when, how do you need it?"
      ></b-input>
    </b-field>

    <input class="button is-primary" type="submit" />
  </form>
  <br>
  <article v-if="errors" class="message is-danger">
    <div class="message-body">
      There was an error with your request.
    </div>
  </article>
</section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'request-form',
  data: function () {
    return {
      item: '',
      description: '',
      itemFieldTouched: false,
      descriptionFieldTouched: false,
      errors: null
    }
  },
  computed: {
    itemFieldDanger: function () {
      return this.itemFieldTouched && (!this.item || this.item.length === 0)
    },
    descriptionFieldDanger: function () {
      return this.descriptionFieldTouched && (!this.description || this.description.length === 0)
    }
  },
  props: {
    initialItem: {
      type: String,
      default: ''
    },
    initialDescription: {
      type: String,
      default: ''
    },
    editing: {
      type: Boolean,
      default: false
    },
    editRequestId: {
      type: Number
    }
  },
  mounted: function () {
    this.item = this.initialItem
    this.description = this.initialDescription
  },
  methods: {
    handleSubmit: async function () {
      if (this.itemFieldDanger) {
        return
      }
      if (this.editing) {
        try {
          await axios({
            method: 'PUT',
            url: `/api/requests/${this.editRequestId}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
            },
            data: {
              item: this.item,
              description: this.description
            }
          })
          this.$toast.open({
            message: 'Request changed!',
            type: 'is-success'
          })
        } catch (err) {
          this.errors = err.response
        }
      } else {
        try {
          await axios({
            method: 'POST',
            url: `/api/requests`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
            },
            data: {
              item: this.item,
              description: this.description
            }
          })
          this.item = ''
          this.description = ''
          this.$toast.open({
            message: 'Request created!',
            type: 'is-success'
          })
        } catch (err) {
          this.errors = err.response
        }
      }
      this.$emit('submit')
    }
  }
}
</script>
