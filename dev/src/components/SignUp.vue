<template>
  <div class="box">
    <form v-on:submit="handleSubmit">
      <div class="field">
        <div class="field-body">
          <div class="field">
            <label class="label">First Name</label>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="First Name"
                v-model="firstname"
              >
            </p>
          </div>
          <div class="field">
            <label class="label">Last Name</label>
            <p class="control is-expanded">
              <input class="input" type="text" placeholder="Last Name"
                v-model="lastname"
              >
            </p>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Email</label>
        <p class="control has-icons-left">
          <input class="input has-icons-left" type="email" placeholder="Email address"
            v-model="email"
          >
          <span class="icon is-small is-left">
            <i class="fa fa-envelope"></i>
          </span>
        </p>
      </div>

      <div class="field">
        <label class="label">Phone</label>
        <p class="control has-icons-left">
          <input class="input has-icons-left" type="text" placeholder="Phone Number"
            v-model="phone"
          >
          <span class="icon is-small is-left">
            <i class="fa fa-phone"></i>
          </span>
        </p>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <p class="control has-icons-left">
          <input class="input" type="password" placeholder="Password"
            v-model="password"
          >
          <span class="icon is-small is-left">
            <i class="fa fa-lock"></i>
          </span>
        </p>
      </div>
      <div class="field fluid">
        <p class="control">
          <div class="buttons is-centered">
            <button type="submit" class="button is-success">
              Sign Up
            </button>
          </div>
        </p>
      </div>
      <div v-if="signupSuccess !== null"
        class="notification"
        v-bind:class="{ 'is-success' : signupSuccess, 'is-warning' : !signupSuccess }"
        >
        {{ notificationMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import * as Auth from '../services/auth'

export default {
  name: 'sign-up',
  data: function () {
    return {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      notificationMessage: '',
      signupSuccess: null,
      errors: []
    }
  },
  methods: {
    handleSubmit: async function (e) {
      e.preventDefault()
      // verify fields first

      const res = await Auth.signup(this.firstname, this.lastname, this.email, this.phone, this.password)
      if (res.success) {
        this.signupSuccess = true
        this.notificationMessage = 'You\'re all signed up! Go ahead and login'
      } else {
        this.signupSuccess = false
        this.notificationMessage = res.errors
      }
    },
    verifyFields: function () {
      // TODO verify fields
    }
  }
}
</script>
