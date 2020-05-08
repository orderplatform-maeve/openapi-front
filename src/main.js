import Vue from 'vue';
import VueRouter from 'vue-router';
import VueCookies from 'vue-cookies';
import VueSocketIO from 'vue-socket.io';
import VueMoment from 'vue-moment';

import App from './App.vue';

import "@babel/polyfill";

import router from '@router';
import { socketConfig } from '@config';
import {
  ConfirmModal,
  OrderModal,
  TableOrdersModal,
  MenuModal,
  ProductOptionModal,
  FlashMessage,
} from '@components';

Vue.config.devtools = true;

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueMoment);

Vue.use(new VueSocketIO(socketConfig));

Vue.component('modal-order', OrderModal);
Vue.component('modal-confirm', ConfirmModal);
Vue.component('modal-table-orders', TableOrdersModal);
Vue.component('modal-menu', MenuModal);
Vue.component('modal-product-option', ProductOptionModal);
Vue.component('flash-message', FlashMessage);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
