import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Activity from '@/components/Activity/Activity'
import Login from '@/components/Login'
import SignUpPage from '@/components/SignUpPage'
import Requests from '@/components/Requests'
import RequestPage from '@/components/Requests/RequestPage'
import store from '../services/store'
import * as Auth from '../services/auth'
import Items from '@/components/Items/Items'
import ItemPage from '@/components/Items'
import Profile from '@/components/Profile'
import FourOFour from '@/components/404'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // Homepage is based on whether the user is logged in
      path: '/',
      name: 'Homepage',
      component: Vue.component('home-page', {
        functional: true,
        render: function (createElement) {
          return store.state.token ? createElement(Activity) : createElement(HomePage)
        }
      }),
      beforeEnter: async (to, from, next) => {
        const { code } = to.query
        if (code) {
          await Auth.storeSlackAccessToken(code)
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
      meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        await store.dispatch('getRequests')
        next()
      }
    },
    {
      path: '/requests/:id',
      component: RequestPage,
      beforeEnter: async (to, from, next) => {
        await store.dispatch('getRequest', to.params.id)
        if (!store.state.request) {
          next({
            path: '/404'
          })
        }
        next()
      }
    },
    {
      path: '/items',
      name: 'Items',
      component: Items,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        await store.dispatch('getItems')
        next()
      }
    },
    {
      path: '/items/:id',
      name: 'ItemPage',
      component: ItemPage,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        await store.dispatch('getItem', to.params.id)
        if (!store.state.item) {
          next({
            path: '/404'
          })
        }
        next()
      }
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
    if (!store.state.token) {
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
