import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import VueFilter from 'vue-filter';
import VueSocketIO from 'vue-socket.io';
import VueMoment from 'vue-moment';

import "@babel/polyfill";

import OrderDetail from './OrderDetail.vue';
import Order from './Order.vue';
import ModalConfirm from './ConfirmModal.vue';
import MenuBoard from './MenuBoard.vue';
import TableOrders from './TableOrders.vue';

import router from '@router';
import { socketConfig } from '@config';

// Vue.prototype.$eventBus = new Vue();

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter);
Vue.use(VueMoment);

Vue.use(new VueSocketIO(socketConfig));

Vue.component('order-detail', OrderDetail);
Vue.component('order', Order);
Vue.component('modal-confirm', ModalConfirm);
Vue.component('modal-table-orders', TableOrders);
Vue.component('menu-board', MenuBoard);

new Vue({
  router
}).$mount("#app");
