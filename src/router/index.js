import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/pages/Dashboard'
import store from '@/store'
import WelcomePage from '@/pages/WelcomePage'
import RequestForm from '@/pages/RequestForm'
import MyRequests from '@/pages/MyRequests'
import Approvals from '@/pages/Approvals'
import Profile from '@/pages/Profile'
import NotFoundPage from '@/pages/NotFoundPage'
import Edit from '@/pages/Edit'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/request_form',
    name: 'requestForm',
    component: RequestForm,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/my_requests',
    component: { render: h => h('router-view') },
    children: [
      {
        path: '/',
        name: 'myRequests',
        component: MyRequests
      },
      {
        path: ':id/edit',
        name: 'myRequest.edit',
        component: Edit
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/approval',
    name: 'approval',
    component: Approvals,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomePage
  },
  {
    path: '*',
    name: '404',
    component: NotFoundPage,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (!store.state.profile.user) {
    store.dispatch('auth/isSessionExist').then(() => {
      if (to.matched.some(record => record.meta.requiresAuth) && !store.state.auth.isUserLoggedIn) {
        next('/welcome')
      } else {
        next()
      }
    }).catch(err => next(err))
  } else {
    next()
  }
})

export default router
