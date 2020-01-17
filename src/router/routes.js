import OrderView from '@layouts/OrderView.vue';

import Member from '@views/Member.vue';
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
  }, {
    path: paths.member,
    name: paths.member,
    component: Member,
  }, {
    path: paths.store,
    name: paths.store,
    component: Store,
  }, {
    path: paths.table,
    name: paths.table,
    component: Table,
  }, {
    path: paths.order,
    name: paths.order,
    component: OrderList,
  }, {
    path: paths.logout,
    name: paths.logout,
    component: Logout,
  }]
}];

export default routes;
