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
            <b-checkbox v-model="enable">
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
import config from '@/../../config.json'

export default {
  name: 'profile',
  data: function () {
    const clientId = config.slack.client_id
    const scopes = config.slack.scopes.join('')
    return {
      enable: false,
      slackUri: `https://slack.com/oauth/authorize?scope=${scopes}&client_id=${clientId}`
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 758px;
}
</style>
