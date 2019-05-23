/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getItem } from '@/utils/storage';
import routes from './routes';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  // 未登录，则从URL里获取用户信息
  if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
    const username = getItem('username');
    if (username === 'null' || !username) {
      store.dispatch('auth/logout');
    }
    next();
  } else {
    next();
  }
});

Vue.router = router;

export default {
  router,
};
