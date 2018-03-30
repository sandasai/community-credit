// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

Vue.use(Buefy)

// Add stylesheets
require('../node_modules/font-awesome/css/font-awesome.min.css')
// require('../node_modules/bulma/css/bulma.css')

Vue.config.productionTip = false

var communityCredit = {
  data: function () {
    return {
      myId: Number(window.localStorage.getItem('community-credit-id'))
    }
  }
}

Vue.mixin(communityCredit)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
