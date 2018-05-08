<template>
<div class="section">
  <div class="container">
    <div class="card">
      <template v-if="!editing">
        <header class="card-header">
          <p class="card-header-title">
            <span><strong>{{ user.name }}</strong> <span style="font-weight: normal">requests</span> <strong>{{ item }}</strong></span>
          </p>
        </header>
      </template>
      <div class="card-content">
        <template v-if="editing">
          <request-form
            :initialItem="item"
            :initialDescription="description"
            editing
            :editRequestId="id"
            @submit="handleEdit"
          />
        </template>
        <template v-else>
          <div class="content">
            <time>{{ formatDate(date) }}</time>
            <br />
            {{ description }}
          </div>
        </template>
      </div>
      <footer class="card-footer">
        <template v-if="isMine">
          <a href="#" class="card-footer-item" @click="editing = !editing">
            <template v-if="editing">Cancel</template>
            <template v-else>Edit</template>
          </a>
          <a href="#" class="card-footer-item" @click="handleDelete">Delete</a>
        </template>
        <template v-else>
          <a href="#" class="card-footer-item" @click.prevent="handleFulfull">Fulfill</a>
        </template>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import RequestForm from './RequestForm'
import axios from 'axios'

export default {
  name: 'request-page',
  components: {
    RequestForm
  },
  data: function () {
    return {
      id: null,
      item: null,
      description: null,
      user: {},
      editing: false,
      date: null
    }
  },
  computed: {
    request: function () {
      return this.$store.state.request
    },
    isMine: function () {
      return Number(window.localStorage.getItem('community-credit-id')) === Number(this.user.id)
    }
  },
  mounted: async function () {
    try {
      await this.getRequest()
    } catch (err) {
      this.$router.push({ name: '404' })
    }
  },
  methods: {
    getRequest: async function () {
      const response = await axios.get(`/api/requests/${this.$route.params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      this.id = response.data.id
      this.item = response.data.item
      this.description = response.data.description
      this.user = response.data.user
      this.date = response.data.updated_at
      this.editing = false
    },
    formatDate: function (date) {
      return moment(Date.parse(date)).format('MMM Do YY')
    },
    handleEdit: async function () {
      await this.getRequest()
      this.editing = false
    },
    handleDelete: function () {
      this.$dialog.confirm({
        message: 'Delete your request?',
        onConfirm: this.delete
      })
    },
    handleFulfull: function () {
      this.$router.push({ name: 'Items', query: { list: true, request: this.id } })
    },
    delete: async function () {
      try {
        await axios.delete(`/api/requests/${this.$route.params.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        this.$toast.open('Request deleted')
        this.$router.push({ name: 'Requests' })
      } catch (err) {
        this.toast.open('Unabled to delete your request')
      }
    }
  }
}
</script>

<style scoped>
a {
  font-weight: bold;
}
</style>
