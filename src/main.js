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
  OrderModal,
  TableOrdersModal,
  MenuModal,
  ProductOptionModal,
} from '@components';

Vue.config.devtools = true;

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter);
Vue.use(VueMoment);

Vue.use(new VueSocketIO(socketConfig));

Vue.component('modal-order', OrderModal);
Vue.component('modal-confirm', ConfirmModal);
Vue.component('modal-table-orders', TableOrdersModal);
Vue.component('modal-menu', MenuModal);
Vue.component('modal-product-option', ProductOptionModal);

new Vue({router}).$mount("#app");
