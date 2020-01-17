import VueRouter from 'vue-router';
import routes from './routes';

const router = new VueRouter({
  scrollBehavior:() => ({ y: 0 }),
  routes,
});

export default router;
