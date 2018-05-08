import Vue from 'vue'
import Router from 'vue-router'
import Requests from '@/components/Requests'
import RequestPage from '@/components/Requests/RequestPage'
import Items from '@/components/Items/Items'
import ItemPage from '@/components/Items'
import Profile from '@/components/Profile'
import Landing from '@/components/Landing'
import FourOFour from '@/components/404'

Vue.use(Router)

const communityCreditId = 'community-credit-id'
const communityCreditToken = 'community-credit-token'
const communityCreditName = 'community-credit-name'

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
          return token ? createElement(Items) : createElement(Landing)
        }
      }),
      beforeEnter: async (to, from, next) => {
        // check if redirected from slack
        const { code } = to.query
        if (!code || code.length === 0) {
          return next()
        }
        const response = await fetch(`/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code, method: 'slack' })
        })
        if (response.ok) {
          // Do something
          const payload = await response.json()
          window.localStorage.setItem(communityCreditToken, payload.token)
          window.localStorage.setItem(communityCreditId, payload.id)
          console.log(payload.name)
          window.localStorage.setItem(communityCreditName, payload.name)
        } else if (response.status === 401) {
          // User could have old tokens
          window.localStorage.removeItem(communityCreditToken)
          window.localStorage.removeItem(communityCreditId)
          window.localStorage.setItem(communityCreditName)
        }
        return next()
      }
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
        path: '/',
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
