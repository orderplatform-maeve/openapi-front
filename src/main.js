import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import moment from 'moment';


import VCalendar from 'v-calendar';

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
  AllRefreshModal,
  RightMenu,
} from '@components';

Vue.config.devtools = true;

Vue.use(VueRouter);

const momentPlugins = {
  install: (Vue, name) => {
    name = name || '$moment';
    Object.defineProperty(Vue.prototype, name, { value: moment });
  },
};
Vue.use(momentPlugins);

Vue.use(new VueSocketIO(socketConfig));

Vue.use(VCalendar, {
  componentPrefix: 'vc',
});

Vue.filter('moment', function (value, format) {
  if (value === null || value === undefined || format === undefined) {
    return '';
  }
  if (format === 'from') {
    return moment(value).fromNow();
  }
  return moment(value).format(format);
});

Vue.component('modal-order', OrderModal);
Vue.component('modal-confirm', ConfirmModal);
Vue.component('modal-table-orders', TableOrdersModal);
Vue.component('modal-menu', MenuModal);
Vue.component('modal-product-option', ProductOptionModal);
Vue.component('flash-message', FlashMessage);
Vue.component('modal-all-refresh', AllRefreshModal);
Vue.component('right-menu', RightMenu);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
