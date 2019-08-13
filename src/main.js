import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import VueFilter from 'vue-filter';
import VueSocketIO from 'vue-socket.io'
import VueMoment from 'vue-moment'

import OrderView from './OrderView.vue'
import Member from './Member.vue'
import Store from './Store.vue'
import Table from './Table.vue'
import Logout from './Logout.vue'
import OrderList from './OrderList.vue'
import OrderDetail from './OrderDetail.vue'

Vue.use(VueCookies);
Vue.use(VueRouter);
Vue.use(VueFilter); 
Vue.use(VueMoment);

Vue.use(new VueSocketIO({
    debug: true,
    //connection: 'http://socketio.order.orderhae.com',
    connection: 'http://1.socketio.order.orderhae.com',
    //options: { path: "/my-app/" } //Optional options
}))

Vue.prototype.$eventBus = new Vue();

Vue.component('order-detail', OrderDetail)

/*
new Vue({
  //el: '#order',
  render: h => h(Order)
})
*/

let routes = [{
  path: '/',
  component: OrderView,
  children: [{
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
  //mode: 'history',
  routes: routes,
});

new Vue({
  router
}).$mount("#app");
