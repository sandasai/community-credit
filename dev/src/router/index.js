import Vue from 'vue'
import Router from 'vue-router'
import Activity from '@/components/Activity/Activity'
import Login from '@/components/Login'
import SignUpPage from '@/components/SignUpPage'
import Requests from '@/components/Requests'
import RequestPage from '@/components/Requests/RequestPage'
import store from '../services/store'
import Items from '@/components/Items/Items'
import ItemPage from '@/components/Items'
import Profile from '@/components/Profile'
import Landing from '@/components/Landing'
import FourOFour from '@/components/404'

Vue.use(Router)

const communityCreditId = 'community-credit-id'
const communityCreditToken = 'community-credit-token'

const router = new Router({
  routes: [
    {
      // Homepage is based on whether the user is logged in
      path: '/',
      name: 'Landing',
      component: Vue.component('home-page', {
        functional: true,
        render: function (createElement) {
          const token = window.localStorage.getItem(communityCreditToken)
          console.log(token)
          return token ? createElement(Activity) : createElement(Landing)
        }
      }),
      beforeEnter: async (to, from, next) => {
        // check if redirected from slack
        const { code } = to.query
        const response = await fetch(`/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.token}`
          },
          body: JSON.stringify({ code, method: 'slack' })
        })
        if (response.ok) {
          // Do something
          const payload = await response.json()
          window.localStorage.setItem(communityCreditToken, payload.token)
          window.localStorage.setItem(communityCreditId, payload.id)
        }
        next()
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUpPage',
      component: SignUpPage
    },
    {
      path: '/requests',
      name: 'Requests',
      component: Requests,
      meta: { requiresAuth: true }
    },
    {
      path: '/requests/:id',
      component: RequestPage,
      props: true
    },
    {
      path: '/items',
      name: 'Items',
      component: Items,
      meta: { requiresAuth: true }
    },
    {
      path: '/items/:id',
      name: 'ItemPage',
      component: ItemPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      meta: { requiresAuth: true },
      component: Profile
    },
    {
      path: '/404',
      component: FourOFour
    },
    {
      path: '*',
      component: FourOFour
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!window.localStorage.getItem(communityCreditToken)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
