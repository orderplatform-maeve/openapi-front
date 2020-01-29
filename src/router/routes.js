import Layout from '@layouts/Layout.vue';

import Login from '@views/Login.vue';
import Store from '@views/Store.vue';
import Table from '@views/Table.vue';
import OrderList from '@views/OrderList.vue';

import paths from './paths';

const routes = [{
  path: paths.root,
  component: Layout,
  children: [{
    path: paths.root,
    name: paths.root.replace('/',''),
    redirect: paths.order,
    meta: { requiresAuth: true },
  },
  {
    path: paths.login,
    name: paths.login.replace('/',''),
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: paths.store,
    name: paths.store.replace('/',''),
    component: Store,
    meta: { requiresAuth: true },
  },
  {
    path: paths.table,
    name: paths.table.replace('/',''),
    component: Table,
    meta: { requiresAuth: true },
  },
  {
    path: paths.order,
    name: paths.order.replace('/',''),
    component: OrderList,
    meta: { requiresAuth: true },
  }]
}];

export default routes;
