import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import VueFilter from 'vue-filter';
import VueSocketIO from 'vue-socket.io';
import VueMoment from 'vue-moment';

import "@babel/polyfill";

import router from '@router';
import { socketConfig } from '@config';
import {
  ConfirmModal,
  TableOrdersModal,
  OrderModal,
} from '@components';

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter);
Vue.use(VueMoment);

Vue.use(new VueSocketIO(socketConfig));

Vue.component('order', OrderModal);
Vue.component('modal-confirm', ConfirmModal);
Vue.component('modal-table-orders', TableOrdersModal);

new Vue({router}).$mount("#app");
