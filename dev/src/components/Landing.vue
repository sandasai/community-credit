<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="app-header">
          <h1 class="title is-3">Community Credit</h1>
          <h3 class="title is-5">A system for sharing items with friends!</h3>
        </div>
        <div class="sign-in-content">
          <form>
            <div class="columns">
              <div class="column">
                <div class="field">
                  <a class="button is-fullwidth" :href="uri">
                    <img src="@/assets/Slack_Mark_Web.png" style="width: 40px; height: 40px;"/>
                    <strong>Continue with Slack</strong>
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import qs from 'querystring'

export default {
  name: 'home-page',
  data: function () {
    const params = qs.stringify({
      'client_id': process.env.SLACK_CLIENT_ID,
      'scope': 'identity.basic',
      'redirect_uri': process.env.BASE_URL
    })
    console.log(params)
    return {
      email: '',
      password: '',
      uri: `http://slack.com/oauth/authorize?${params}`
    }
  }
}
</script>

<style scoped>
.sign-in-content {
  margin: 30px;
  display: flex;
  justify-content: center;
}

.app-header {
  text-align: center;
}
</style>
