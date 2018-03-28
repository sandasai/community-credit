<template>
  <div class="section">
    <router-view></router-view>

    <b-tabs @change="getRequests">
      <b-tab-item label="Requests" icon="upload">
        <requests-list
          :requests="requests"
        />
      </b-tab-item>
      <b-tab-item label="Make a Request" icon="upload">
        <request-form />
      </b-tab-item>
      <b-tab-item label="My Requests" icon="upload">
        <requests-list
          :requests="myRequests"
        />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import RequestsList from './RequestsList'
import RequestForm from './RequestForm'
import axios from 'axios'

export default {
  components: {
    RequestsList,
    RequestForm
  },
  data: function () {
    return {
      requests: []
    }
  },
  computed: {
    myRequests: function () {
      return this.requests.filter(request => {
        return request.user_id === this.$store.state.id
      })
    }
  },
  mounted: async function () {
    await this.getRequests()
  },
  methods: {
    getRequests: async function () {
      const response = await axios({
        method: 'GET',
        url: '/api/requests',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      this.requests = response.data
    }
  }
}
</script>
