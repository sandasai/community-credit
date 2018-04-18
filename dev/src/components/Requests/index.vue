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
import qs from 'query-string'

export default {
  components: {
    RequestsList,
    RequestForm
  },
  data: function () {
    return {
      requests: [],
      requestPage: 1,
      loadingRequests: false
    }
  },
  computed: {
    myRequests: function () {
      return this.requests.filter(request => {
        return request.user_id === this.myId
      })
    }
  },
  mounted: async function () {
    await this.getRequests()
  },
  created: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getRequests: async function () {
      this.loadingRequests = true
      const params = qs.stringify({
        page: this.requestPage
      })
      const response = await axios({
        method: 'GET',
        url: `/api/requests?${params}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      this.requests = this.requests.concat(response.data)
      this.requestPage++
      this.loadingRequests = false
    },
    handleScroll: function (event) {
      if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && !this.loadingRequests) {
        this.getRequests()
      }
    }
  }
}
</script>
