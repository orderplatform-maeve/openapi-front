import Vue from 'vue';
import VueRouter from 'vue-router';

import { COOKIE_AUTH_NAME } from '@config';

import routes from './routes';
import paths from './paths';

const router = new VueRouter({
  scrollBehavior:() => ({ y: 0 }),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const {
        member: {
          code,
        },
      } = Vue.$cookies.get(COOKIE_AUTH_NAME);

      if (code) {
        next();
      } else {
        next(paths.login);
      }
    } catch (error) {
      next(paths.login);
    }
  } else {
    if (to.path.path === paths.login) {
      next(false);
    }
    next();
  }
});

export default router;
