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
                  <a class="button is-fullwidth" :href="slackUri">Continue with Slack</a>
                </div>
                <div class="field">
                  <a class="button is-fullwidth">Or create a new account</a>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label>Email</label>
                  <p class="control">
                    <input class="input" type="email" placeholder="Email" v-model="email">
                  </p>
                </div>
                <div class="field">
                  <label>Password</label>
                  <p class="control">
                    <input class="input" type="password" placeholder="Password" v-model="password">
                  </p>
                </div>
                <div class="field">
                  <a class="button is-success">Login</a>
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
import config from '@/../../config.json'

export default {
  name: 'home-page',
  data: function () {
    return {
      email: '',
      password: '',
      slackUri: `http://slack.com/oauth/authorize?client_id=${config.slack.client_id}&scope=identity.basic`
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
