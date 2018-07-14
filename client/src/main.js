// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import { sync } from 'vuex-router-sync';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import store from '@/store/store';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    if (!store.state.isUserLoggedIn ) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } 
  else if (to.matched.some(record => record.meta.requiresVisitor)) {
   
    if (store.state.isUserLoggedIn ) {
      next({
        name: 'home'
      })
    } else {
      next()
    }
  }
  else {
    next() // make sure to always call next()!
  }
});

sync(store, router);

console.log(store.state);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});