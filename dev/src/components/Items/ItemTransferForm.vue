<template>
  <div>
    <b-field horizontal :label="label">
      <b-timepicker
        ref="top"
        placeholder="Click to select a time"
        v-model="time"
        icon="clock"
        hour-format="12">
      </b-timepicker>
    </b-field>
    <b-field horizontal label="On Date:">
      <b-datepicker
        placeholder="Click to select a date"
        v-model="date"
        icon="calendar-today">
      </b-datepicker>
    </b-field>
    <b-field horizontal :label="this.holding ? 'Dropped off for' : 'Picked up from'">
      <b-autocomplete
        :disabled="!this.holding"
        v-model="name"
        :data="userNames"
        icon="magnify"
        @select="handleAutocompleteSelection"
      >
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <b-field horizontal label="Comments">
      <b-input
        placeholder="How did you exchange it? From who? To Who? etc..."
        v-model="comments"
        type="textarea"
        maxlength="1000"
      >
      </b-input>
    </b-field>
    <b-field horizontal>
      <p class="control">
        <button class="button is-primary" @click="transfer">
          Post!
        </button>
      </p>
    </b-field>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'item-transfer-form',
  props: [
    'holder', 'initialHolderName'
  ],
  computed: {
    label: function () {
      return this.holding ? 'Dropped off on:' : 'Picked up on:'
    },
    userNames: function () {
      if (this.users.length === 0) {
        return []
      }
      return this.users.map((user) => {
        return user.name
      })
    },
    holding: function () {
      return this.holder === this.myId
    },
    datetime: function () {
      return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.time.getHours(), this.time.getMinutes())
    }
  },
  data: function () {
    return {
      date: new Date(),
      time: new Date(),
      comments: '',
      name: this.initialHolderName || '',         // name in the field
      users: [],
      user: {}          // user to recieve item
    }
  },
  mounted: async function () {
    const response = await axios({
      method: 'GET',
      url: '/api/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
      }
    })
    this.users = response.data
    if (!this.holding) {
      this.user = this.myId
    }
    this.$refs.top.focus()
  },
  methods: {
    transfer: async function () {
      try {
        await axios({
          method: 'POST',
          url: `/api/items/${this.$route.params.id}/transfer`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          },
          data: {
            user_id: this.user,
            message: this.comments,
            date: this.datetime
          }
        })
        this.$toast.open({
          message: 'Item exchanged!',
          type: 'is-success'
        })
        this.$emit('submit')
      } catch (err) {
        this.$toast.open({
          message: 'Couldn\t exchange the item!',
          type: 'is-danger'
        })
        console.log(err)
      }
    },
    handleAutocompleteSelection: async function (option) {
      const user = this.users.filter((user) => {
        return user.name === option
      })[0]
      if (user) {
        this.user = user.id
      }
    }
  }
}
</script>
