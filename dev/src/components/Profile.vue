<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Profile (Still under development)</h1>
      <div class="box">
        <div class="level">
          <div class="level-left">
            <div>
              <h3 class="title is-size-5">Slack Integration</h3>
              <h3 class="subtitle is-size-6">Send activity notifications through Slack</h3>
            </div>
          </div>
          <div class="level-right">
            <a :href="slackConnectUri"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
          </div>
        </div>
        <hr />

        <b-checkbox v-model="checkbox">
          Enable Slack integration
        </b-checkbox>
      </div>
      <div class="box">
        <h3 class="title is-size-5">Contact Information</h3>
        <hr />
      </div>

      <div class="box">
        <h3 class="title is-size-5">Personal Settings</h3>
        <hr />
      </div>
    </div>
  </div>

</template>

<script>
import * as Auth from '@/services/auth'

export default {
  name: 'profile',
  data: function () {
    return {
      slackConnectUri: Auth.slackConnect()
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 758px;
}
</style>
