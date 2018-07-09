import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Poems from '@/components/poems/Poems'
import Poem from '@/components/poems/Poem'
import AddPoem from '@/components/poems/AddPoem'
import Account from '@/components/user/Account';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/poems',
      name: 'poems',
      component: Poems
    },
    {
      path: '/poems/:docId',
      name: 'poem',
      component: Poem
    },
    {
      path: '/documents',
      name: 'documents',
      component: Poems
    },
    {
      path: '/documents/:docId',
      name: 'document',
      component: Poem
    },
    {
      path: '/docs/add',
      name: 'addPoem',
      component: AddPoem
    },
  ],
  linkExactActiveClass: "is-active"
})
