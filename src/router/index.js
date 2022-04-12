import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('remoteApiToken')) {
    return next()
  }
  return next('/login')
}

const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.getItem('remoteApiToken')) {
    return next()
  }
  return next('/')
}

const routes = [
  {
    path: '/',
    name: 'BrowserProfiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/BrowserProfiles.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    beforeEnter: ifNotAuthenticated
  },
  // {
  //   path: '/registration',
  //   name: 'Registration',
  //   component: () => import('../views/Registration.vue'),
  //   beforeEnter: ifNotAuthenticated
  // },
  {
    path: '/proxy',
    name: 'Proxy',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Proxy.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Bookmarks.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/extensions',
    name: 'Extensions',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Extensions.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Settings.vue'),
    beforeEnter: ifAuthenticated
  },
  {
    path: '/users',
    name: 'Users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue'),
    beforeEnter: ifAuthenticated
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
