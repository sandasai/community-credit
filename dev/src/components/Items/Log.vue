<template>
  <section class="section">
    <div class="container">
      <h2 class="title is-size-5">History</h2>
      <!--
      <div class="content">
        <template v-if="item.owner_id !== myId && item.holder_id !== myId">
          <a v-if="!requested" class="button" @click="request">
            <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
            <span>Request</span>
          </a>
          <a v-else class="button" @click="cancelRequest">
            <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
            <span>Cancel Request</span>
          </a>
        </template>
        <a class="button"
          @click="action === 'comment' ? action = null : action = 'comment'">
          <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
          <span>Comment</span>
        </a>
        <a class="button"
          v-if="!canDropoff"
          @click="action === 'pickup' ? action = null : action = 'pickup'">
          <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
          <span>Pick up</span>
        </a>
        <a class="button"
          v-if="canDropoff"
          @click="action === 'dropoff' ? action = null : action = 'dropoff'">
          <span class="icon is-small"><i class="fa fa-comments-o"></i></span>
          <span>Drop off</span>
        </a>
      </div>
      -->

      <div>
        <article v-if="action === 'talk'" class="media">
          <div class="media-content">
            <b-field>
              <b-input type="textarea"
                maxlength="1000"
                placeholder="Add a comment"
                v-model="logComments"
              >
              </b-input>
            </b-field>
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <a @click.prevent="talk" class="button is-primary">Submit</a>
                </div>
              </div>
            </nav>
          </div>
        </article>

        <section v-if="action === 'pickup'">
          <b-field horizontal label="Picked up on:">
            <b-timepicker
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
          <b-field horizontal label="Comments">
            <b-input
              placeholder="Where did you pick it up? From who? etc..."
              v-model="comments"
              type="textarea"
              maxlength="1000"
            >
            </b-input>
          </b-field>
          <b-field horizontal>
            <p class="control">
              <button class="button is-primary" @click="pickup">
                Post!
              </button>
            </p>
          </b-field>
        </section>

        <section v-if="action === 'dropoff'">
          <b-field horizontal label="Dropped item off at">
            <b-timepicker
              :max-date="new Date()"
              placeholder="Click to select a time"
              v-model="time"
              icon="clock"
              hour-format="12">
            </b-timepicker>
          </b-field>
          <b-field horizontal label="On Date">
            <b-datepicker
              :max-date="new Date()"
              placeholder="Click to select a date"
              v-model="date"
              icon="calendar-today">
            </b-datepicker>
          </b-field>
          <b-field horizontal label="For">
            <b-autocomplete
              v-model="dropOffUser"
              :data="filterdNames"
              placeholder="Who did you drop it off to?"
              icon="magnify"
              @select="handleAutocompleteSelection"
              >
              <template slot="empty">No results found</template>
            </b-autocomplete>
          </b-field>
          <b-field horizontal label="Comments">
            <b-input
              placeholder="Where did you drop it off? From who? etc..."
              v-model="comments"
              type="textarea"
              maxlength="1000"
            >
            </b-input>
          </b-field>
          <b-field horizontal>
            <p class="control">
              <button class="button is-primary" @click="dropoff">
                Post!
              </button>
            </p>
          </b-field>
        </section>

        <div class="container">
          <log-entry v-for="log in logs" :key="log.id" :log="log" :last="log.id === logs[0].id"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import LogEntry from './LogEntry'

export default {
  name: 'item-log',
  components: {
    LogEntry
  },
  data: function () {
    return {
      action: '',
      // formatAmPm: true,
      // time: initialDate,
      // date: initialDate,
      // comments: '',
      // logComments: '',
      // dropOffUser: '',
      // dropOffUserId: null,
      users: []
    }
  },
  props: ['logs'],
  computed: {
    canDropoff: function () {
      return Number(this.item.holder_id) === Number(this.$store.state.id)
    },
    datetime: function () {
      return new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.time.getHours(), this.time.getMinutes())
    },
    names: function () {
      return this.users.map((user) => {
        return user.name
      })
    },
    filterdNames: function () {
      return this.names.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.dropOffUser.toLowerCase()) >= 0
      })
    }
  },
  mounted: async function () {
    this.users = await axios({
      method: 'GET',
      url: '/api/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
      }
    }).data
  },
  methods: {
    request: async function () {
      // const result = await Api.postItemRequest(this.item.id)
      // if (result) {
      //   this.$toast.open({
      //     message: 'Item Requested',
      //     type: 'is-success'
      //   })
      //   this.$emit('update')
      // }
    },
    cancelRequest: async function () {
      // const result = await Api.postItemCancelRequest(this.item.id)
      // if (result) {
      //   this.$toast.open({
      //     message: 'Request canceled'
      //   })
      //   this.$emit('update')
      // }
    },
    talk: async function () {
      // const result = await Api.postItemLogComment(this.item.id, this.logComments)
      // if (result) {
      //   this.$toast.open({
      //     message: 'Comment logged'
      //   })
      //   this.$emit('update')
      //   this.reset()
      // }
    },
    pickup: async function () {
      // const result = await Api.postItemPickup(this.item.id, this.datetime, this.comments)
      // if (result) {
      //   this.$toast.open({
      //     message: 'Pickup Posted',
      //     type: 'is-success'
      //   })
      //   this.$emit('update')
      //   this.reset()
      // }
    },
    dropoff: async function () {
      // const result = await Api.postItemDropoff(this.item.id, this.datetime, this.dropOffUserId, this.comments)
      // if (result) {
      //   this.$toast.open({
      //     message: 'Dropoff Posted',
      //     type: 'is-success'
      //   })
      //   this.$emit('update')
      //   this.reset()
      // }
    },
    handleAutocompleteSelection (option) {
      // const user = this.users.filter((user) => {
      //   return user.name === option
      // })[0]
      // if (user) {
      //   this.dropOffUserId = user.id
      // }
    },
    reset: function () {
      this.action = null
      this.date = new Date()
      this.time = new Date()
      this.comments = null
    }
  }
}
</script>
