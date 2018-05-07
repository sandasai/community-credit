<template>
  <div class="section">
    <div class="container">
      <div class="box">
        <div class="level">
          <div class="level-left">
            <div>
              <h3 class="title is-size-5">Slack Integration</h3>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <b-checkbox v-model="slackDmPermission">
              Receive and send notifications from other community members through Slack
            </b-checkbox>
          </div>
        </div>
        <a class="button" :href="slackUri">Update Preferences</a>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import qs from 'querystring'

export default {
  name: 'profile',
  data: function () {
    const params = qs.stringify({
      'client_id': process.env.SLACK_CLIENT_ID,
      'scope': process.env.SLACK_SCOPES,
      'redirect_uri': process.env.BASE_URL
    })
    return {
      slackUri: `https://slack.com/oauth/authorize?${params}`,
      slackScopes: {},
      slackDmPermission: false
    }
  },
  mounted: async function () {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
        }
      })
      response.data.slack_scopes.split(',').forEach((scope) => {
        this.slackScopes[scope] = true
      })
      this.slackDmPermission = this.slackScopes['chat:write:bot']
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 758px;
}
</style>
