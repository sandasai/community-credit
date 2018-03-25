<template>
  <div class="container">
    <div class="center">
      <h1 class="title is-4">Log into Community Credit</h1>
      <form v-on:submit="handleSubmit" class="box">
        <div class="field">
          <div class="control">
            <label class="label">Email</label>
            <input class="input" type="email" placeholder="Enter your email"
              v-model="email"
            >
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="label">Password</label>
            <input class="input" type="password" placeholder="Enter your password"
              v-model="password"
            >
          </div>
        </div>
        <button class="button is-primary is-fullwidth">Log In</button>
      </form>
      <p v-if="errors" class="is-danger">{{ errors }}</p>
      <div class="box">
        <p>New to Community Credit?<br><router-link to='/signup'>Create an account.</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import * as Auth from '../services/auth'

export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: '',
      errors: null
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      Auth.login(this.email, this.password)
        .then(res => {
          if (res.success) {
            this.$router.push('/')
          } else {
            this.errors = res.errors
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}

.box {
  margin: 10px 10px;
  width: 350px;
  max-width: 50%;
}
</style>
