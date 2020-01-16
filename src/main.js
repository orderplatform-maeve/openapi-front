import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import VueFilter from 'vue-filter';
import VueSocketIO from 'vue-socket.io';
import VueMoment from 'vue-moment';

Vue.prototype.$eventBus = new Vue();

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter);
Vue.use(VueMoment);

import OrderView from './OrderView.vue';
import Member from './Member.vue';
import Store from './Store.vue';
import Table from './Table.vue';
import Logout from './Logout.vue';
import OrderList from './OrderList.vue';
import OrderDetail from './OrderDetail.vue';
import Order from './Order.vue';
import ModalConfirm from './ConfirmModal.vue';
import MenuBoard from './MenuBoard.vue';
import TableOrders from './TableOrders.vue';

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://1.socketio.orderview.torder.co.kr',
}));
Vue.component('order-detail', OrderDetail);
Vue.component('order', Order);
Vue.component('modal-confirm', ModalConfirm);
Vue.component('modal-table-orders', TableOrders);
Vue.component('menu-board', MenuBoard);

let routes = [{
  path: '/',
  component: OrderView,
  children: [{
    path: '/',
    redirect: 'order',
  }, {
    path: 'member',
    name: 'member',
    component: Member,
  }, {
    path: 'store',
    name: 'store',
    component: Store,
  }, {
    path: 'table',
    name: 'table',
    component: Table,
  }, {
    path: 'order',
    name: 'order',
    component: OrderList,
  }, {
    path: 'logout',
    name: 'logout',
    component: Logout,
  }]
}];

let router = new VueRouter({
  scrollBehavior:() => ({ y:0 }),
  routes,
});

new Vue({
  router
}).$mount("#app");
