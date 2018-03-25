<template>
<div class="section">
  <div class="container">
    <div class="card">
      <template v-if="!editing">
        <header class="card-header">
          <p class="card-header-title">
            <span><strong>{{ request.user_name }}</strong> <span style="font-weight: normal">requests</span> <strong>{{ request.item }}</strong></span>
          </p>
        </header>
      </template>
      <div class="card-content">
        <template v-if="editing">
          <request-form
            :initialItem="request.item"
            :initialDescription="request.description"
            editing
            :editRequestId="request.id"
            @submit="handleEdit"
          />
        </template>
        <template v-else>
          <div class="content">
            <time>{{ formatDate(request.date) }}</time>
            <br />
            {{ request.description }}
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
          <a href="#" class="card-footer-item">Talk</a>
        </template>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import RequestForm from './RequestForm'
import * as Api from '@/services/api'

export default {
  name: 'request-page',
  components: {
    RequestForm
  },
  data: function () {
    return {
      editing: false
      // request: null
    }
  },
  props: ['bloop', 'test'],
  computed: {
    request: function () {
      return this.$store.state.request
    },
    isMine: function () {
      return Number(this.$store.state.id) === Number(this.request.user_id)
    }
  },
  beforeRouteUpdate: async function (to, from, next) {
    if (to.path !== from.path) {
      await this.$store.dispatch('getRequest', to.params.id)
    }
    next()
  },
  mounted: async function () {
    this.request = await Api.getRequest(this.$route.params.id)
  },
  methods: {
    formatDate: function (date) {
      return moment(Date.parse(date)).format('MMM Do YY')
    },
    handleEdit: async function () {
      this.$store.dispatch('getRequest', this.request.id)
      this.editing = false
    },
    handleDelete: function () {
      this.$dialog.confirm({
        message: 'Delete your request?',
        onConfirm: this.delete
      })
    },
    handleFulfull: function () {
      this.$router.push({ name: 'Items', query: { list: true, request: this.request.id } })
    },
    delete: async function () {
      await this.$store.dispatch('deleteRequest', this.$route.params.id)
      if (!this.request) {
        this.$toast.open('Request deleted')
        this.$router.push({ name: 'Requests' })
      } else {
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
