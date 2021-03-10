import Layout from '@layouts/Layout.vue';
import {
  Login,
  Stores,
  Orders,
  Tables,
  TableOrders,
  Products,
  PickUpTables,
  UpdateCategories,
  TorderControl,
  Additional,
  NewProducts,
  ControlOrder,
  ControlLastOrder,
  PaymentManagement,
} from '@views';

import paths from './paths';

const routes = [{
  path: paths.root,
  component: Layout,
  children: [
    {
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
      component: Stores,
      meta: { requiresAuth: true },
    },
    {
      path: paths.order,
      name: paths.order.replace('/',''),
      component: Orders,
      meta: { requiresAuth: true },
    },
    {
      path: paths.products,
      name: paths.products.replace('/',''),
      component: Products,
      meta: { requiresAuth: true },
    },
    {
      path: paths.tables,
      name: paths.tables.replace('/',''),
      component: Tables,
      meta: { requiresAuth: true },
    },
    {
      path: `${paths.tableOrders}/:id`,
      name: paths.tableOrders.replace('/',''),
      component: TableOrders,
      meta: { requiresAuth: true },
    },
    {
      path: paths.pickUpTables,
      name: paths.pickUpTables.replace('/',''),
      component: PickUpTables,
      meta: { requiresAuth: true },
    },
    {
      path: paths.updateCategories,
      name: paths.updateCategories.replace('/',''),
      component: UpdateCategories,
      meta: { requiresAuth: true },
    },
    {
      path: paths.torderControl,
      name: paths.torderControl.replace('/',''),
      component: TorderControl,
      meta: { requiresAuth: true },
    },
    {
      path: paths.additional,
      name: paths.additional.replace('/',''),
      component: Additional,
      meta: { requiresAuth: true },
    },
    {
      path: paths.newProducts,
      name: paths.newProducts.replace('/',''),
      component: NewProducts,
      meta: { requiresAuth: true },
    },
    {
      path: paths.controlOrder,
      name: paths.controlOrder.replace('/',''),
      component: ControlOrder,
      meta: { requiresAuth: true },
    },
    {
      path: paths.controlLastOrder,
      name: paths.controlLastOrder.replace('/',''),
      component: ControlLastOrder,
      meta: { requiresAuth: true },
    },
    {
      path: paths.paymentManagement,
      name: paths.paymentManagement.replace('/',''),
      component: PaymentManagement,
      meta: { requiresAuth: true },
    },
  ],
}];

export default routes;
