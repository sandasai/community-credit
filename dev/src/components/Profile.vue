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
const slackClientId = process.env.SLACK_CLIENT_ID
const slackScopes = process.env.SLACK_SCOPES

export default {
  name: 'profile',
  data: function () {
    return {
      enable: false,
      slackUri: `https://slack.com/oauth/authorize?scope=${slackScopes}&client_id=${slackClientId}`
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 758px;
}
</style>
