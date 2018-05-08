<template>
  <div id="app">
    <nav v-if="isAuthorized" class="navbar is-transparent" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="https://imageog.flaticon.com/icons/png/512/32/32719.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF" alt="Community Credit">
          Community Credit
        </router-link>
        <small class="navbar-item">Hello {{ this.myName }}!</small>
        <a
          v-on:click="toggleBurger"
          :class="{ 'is-active': menuIsActive}"
          class="navbar-burger burger"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>

      <div class="navbar-menu is-hoverable"
        :class="{ 'is-active': menuIsActive}"
      >
        <div class="navbar-end">
          <template v-if="isAuthorized">
            <router-link @click.native="menuIsActive = false" class="navbar-item" to="/items">Items</router-link>
            <router-link @click.native="menuIsActive = false" class="navbar-item" to="/requests">Requests</router-link>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                <span class="icon">
                  <i class="fa fa-cog fa-2x"></i>
                </span>
              </a>
              <div class="navbar-dropdown">
                <router-link @click.native="menuIsActive = false" class="navbar-item" to="/profile">Profile</router-link>
                <a class="navbar-item" v-on:click="handleLogOut">
                  Log Out
                </a>
              </div>
            </div>
          </template>
          <!--  not signed in -->
          <template v-if="!isAuthorized">
            <div class="navbar-item">
              <router-link @click.native="menuIsActive = false" to="/signup">Sign Up</router-link>
              <small>&nbsp;or&nbsp;</small>
              <router-link @click.native="menuIsActive = false" to="/login">Login</router-link>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <!-- Display the main content -->
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data: function () {
    return {
      loginEmail: '',
      loginPassword: '',
      menuIsActive: false,
      get isAuthorized () {
        return window.localStorage.getItem('community-credit-token')
      }
    }
  },
  methods: {
    handleLogOut: async function (e) {
      try {
        await axios({
          method: 'POST',
          url: '/auth/logout',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('community-credit-token')}`
          }
        })
        window.localStorage.removeItem('community-credit-token')
        window.localStorage.removeItem('community-credit-id')
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
    },
    toggleBurger: function () {
      this.menuIsActive = !this.menuIsActive
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar-item {
  font-weight: bold;
}
</style>
