import OrderView from '@layouts/OrderView.vue';

import Login from '@views/Login.vue';
import Store from '@views/Store.vue';
import Table from '@views/Table.vue';
import Logout from '@views/Logout.vue';
import OrderList from '@views/OrderList.vue';

import paths from './paths';

const routes = [{
  path: paths.root,
  component: OrderView,
  children: [{
    path: paths.root,
    redirect: paths.order,
    meta: { requiresAuth: false },
  },
  {
    path: paths.login,
    name: paths.login,
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: paths.store,
    name: paths.store,
    component: Store,
    meta: { requiresAuth: true },
  },
  {
    path: paths.table,
    name: paths.table,
    component: Table,
    meta: { requiresAuth: true },
  },
  {
    path: paths.order,
    name: paths.order,
    component: OrderList,
    meta: { requiresAuth: true },
  },
  {
    path: paths.logout,
    name: paths.logout,
    component: Logout,
    meta: { requiresAuth: true },
  }]
}];

export default routes;
