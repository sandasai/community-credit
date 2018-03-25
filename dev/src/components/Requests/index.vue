<template>
  <div class="section">
    <router-view></router-view>
    
    <b-tabs @change="handleTabChange">
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

export default {
  components: {
    RequestsList,
    RequestForm
  },
  computed: {
    requests: function () {
      return this.$store.state.requests
    },
    myRequests: function () {
      return this.requests.filter(request => {
        return request.user_id === this.$store.state.id
      })
    }
  },
  methods: {
    handleTabChange: function () {
      this.$store.dispatch('getRequests')
    }
  }
}
</script>
