import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import LandingPage from '../views/LandingPage.vue'
import Register from '../views/Register.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Listing from '../views/Listing.vue'
import About from '../views/About.vue'
import Profile from '../views/Profile.vue'

import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AuthLayout,
      meta: {
        requiresAuth: false,
        redirectIsAuth: true,
      },
      children: [
        {
          path: '/',
          name: 'LandingPage',
          component: LandingPage
        },
        {
          path: '/login',
          name: 'Login',
          component: Login
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
        },
        {
          path: '/forgot-password',
          name: 'ForgotPassword',
          component: ForgotPassword
        },
        {
          path: '/verify',
          name: 'VerifyEmail',
          component: VerifyEmail
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/profile',
          name: 'Profile',
          component: Profile
        },
        {
          path: '/listing',
          name: 'Listing',
          component: Listing
        },
        {
          path: '/summary',
          name: 'Summary',
          component: () => import(`@/views/CrimeSummary.vue`)
        },
        {
          path: '/about',
          name: 'About',
          component: About
        },
      ]
    },
    {
      path: '/admin',
      component: DashboardLayout,
      redirect: '/admin/map',
      children: [
        {
          path: 'map',
          name: 'Map',
          meta: {
            requiresAuth: true,
            requireRoles: ['admin', 'super-admin', 'viewer']
          },
          component: () => import(`@/views/admin/Map.vue`)
        },
        {
          path: 'crimes',
          name: 'Crimes',
          meta: {
            requiresAuth: true,
            requireRoles: ['admin', 'super-admin']
          },
          component: () => import(`@/views/admin/Crimes.vue`)
        },
        {
          path: 'users',
          name: 'Users',
          meta: {
            requiresAuth: true,
            requireRoles: ['admin', 'super-admin']
          },
          component: () => import(`@/views/admin/Users.vue`)
        }
      ]
    },
  ]
})

router.beforeEach((to, _, next) => {
  const isAuth = store.getters['Auth/$isAuth']
  const authRole = store.getters['Auth/$authRole']

  // Redirect to login if not logged in
  const requiresAuth = to.matched.some(res => res.meta.requiresAuth)
  if (requiresAuth && !isAuth) return next({ name: 'Login' })

  if (isAuth) {

    // Redirect to home if already logged on
    const redirectIsAuth = to.matched.some(res => res.meta.redirectIsAuth)
    if (redirectIsAuth) return next({ name: 'Home' })

    const requireRoles = to.matched.some(res => res.meta.requireRoles)
    if (requireRoles && !to.meta.requireRoles.includes(authRole)) return next({ name: 'Home' })
  }

  return next();
})

export default router
