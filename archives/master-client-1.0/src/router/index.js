import VueRouter from 'vue-router';

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
      } = JSON.parse(localStorage.auth);

      // console.log(JSON.parse(localStorage.auth));

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