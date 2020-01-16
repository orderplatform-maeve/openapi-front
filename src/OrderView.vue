<template lang="pug">
  #orderview
    menu-board
    modal-confirm
    modal-table-orders
    order-detail(v-bind:orders="orders" v-bind:auth="auth")
    order(v-if="order")
    .body
      .left
        router-view(v-bind:orders="orders" v-bind:auth="auth" v-bind:time="time" v-bind:stores="stores")
      .right
        .top
          .button(v-on:click="restart('/')") 새로고침
          .datetime
            span {{time.now | moment("MM.DD HH:mm") }}
          img.logo(src="https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torder_color_white.png")
          .store_name(v-on:click="removeAuth") {{store.name}}
          router-link.button(v-if="store.code" to="/order") 주문 보기
          router-link.button(v-if="store.code" to="/table") 테이블 보기<br/>(테스트)

        .bottom
          hr
          .tab-group
            .tab-name 태블릿 화면
            .tab-buttons
              .tab-button(:class="{active:!store.serviceStatus}" v-on:click="setServiceStatus(0)") On
              .tab-button(:class="{active:store.serviceStatus}" v-on:click="setServiceStatus(1)") Off
          .tab-group
            .tab-name 태블릿 주문
            .tab-buttons
              .tab-button(:class="{active:!store.orderStatus}" v-on:click="setOrderStatus(0)") On
              .tab-button(:class="{active:store.orderStatus}" v-on:click="setOrderStatus(1)") Off
          hr
          router-link.button(v-if="stores.length>1" to="/store") 매장 보기
          router-link.button.button-red(v-if="!auth.member" to="/member") 로그인
          .button.button-red.button-member(v-if="auth.member" v-on:click="logout")
            span.name {{auth.member.name}}
            span 로그아웃
    .foot.foot-left
</template>

<script>
  import axios from 'axios';
  import { store } from './store/store';
  import { won } from './utils/regularExpressions';

  const filters = {
    won,
  };

  function data() {
    return {
      auth: {},
      stores: [],
      store: {},
      orders: [],
      flag_restarting_clients: 0,
      time: {
        now: 0,
        start: 0,
        end: 0,
      },
    };
  }

  const sockets = {
    connect: function () {
      console.log('socket connected');
    },
    // where is caller?
    resStoreInfo(data) {
      console.log('resStoreInfo');
      this.store = data;
    },
    resClients(data) {
      let clients = {};
      for (let client of data) {
        clients[client.myid] = client;
      }
      this.$store.dispatch('setClients', clients);
    },
    resTablesInfo(data) {
      let items = {};
      for (let table of data) {
        items[table.code] = table;
      }
      this.$store.dispatch('setTables', items);
      this.$socket.emit('reqClients', {store_code: this.auth.store.code});
    },
    resPos: function(data) {
      // console.log('!!!!!!!!!!!!!!!resPos', data);
      if (data && data.storeCode && data.storeCode == this.auth.store.code) {
        let pos_tables = {};
        for (let item of data.data) {
          pos_tables[item.id] = item;
        }
        this.$store.dispatch('setPos', pos_tables);
      }
    },
    resOrders: function(data) {
      console.log('!!!resOrders');
      if (data.time) {
        this.time.start = data.time.start;
        this.time.end = data.time.end;
      }

      if (data.items.length) {
        let items = data.items;


        for (let item of items) {
          //console.log('!time', item.time);
          this.orders.push(item);
        }
      }

      if (!data.LastEvaluatedKey) {
        this.orders.sort(function(a, b) {
          return b.time - a.time;
        });

        for (let index = this.orders.length - 1 ; index > -1 ; index--) {
          let order  = this.orders[index];
          this.cumulativeProducts(order);
        }
      }
    },
    resCommitOrder: function(data) {
      console.log('resCommitOrder', data);
      if (data && data.code && data.commit && data.commit.time) {
        for (let order of this.orders) {
          if (order.code == data.code) {
            order.commit.time = data.commit.time;
            break;
          }
        }
      }
    },
    resCategorys: function(data) {
      let categorys = {};
      for (let category of data) {
        let code = category['T_order_store_menu_code'];
        category.T_order_store_menu_depth = JSON.parse(category.T_order_store_menu_depth);
        categorys[code] = category;
      }
      this.$store.dispatch('setCategorys', categorys);
    },
    resProducts: function(data) {
      // console.log('resProducts', data);
      let products = {};
      for (let product of data) {
        let code = product['T_order_store_good_code'];
        //console.log(product.T_order_store_good_category);

        product.T_order_store_good_category = JSON.parse(product.T_order_store_good_category);


        if (!product.T_order_store_good_category) {
          product.T_order_store_good_category = [];
        }
        //console.log(product.T_order_store_good_category);
        products[code] = product;
      }
      this.$store.dispatch('setProducts', products);
    },
    resRestartClients: function(data) {
      console.log('resRestartClients', data);
      alert(data.count + '대의 태블렛에 새로고침을 요청 했습니다.');
      this.flag_restarting_clients = 0;
    },
    newOrder: function(order) {
      if (this.auth && this.auth.store && this.auth.store.code) {
        if (this.auth.store.code != order.store.code) {
          return;
        }
      } else {
        return;
      }
      console.log('!orderview', order);

      this.orders.push(order);
      this.orders.sort(function(a, b) {
        return b.time - a.time;
      });

      this.cumulativeProducts(order);

      for(let product of order.products) {
        if (Object.keys(order.cumulative_products).indexOf(product.code) < 0) {
          product.first = true;
          order.first = true;
        } else {
          product.first = false;
        }
      }
    },
    youAre: function(data) {
      console.log('youAre', data, data.store_code);

      if(data.store_code) {
        if (!this.auth.store) {
          console.log('set store_code', data.store_code);
          this.auth.store = {
            name: '',
            code: data.store_code,
          };
          console.log(this.auth.store);
          this.initStore();
        }
      }
    },
    restart: function(url) {
      this.restart(url);
    },
    updateClient: function(data) {
      // console.log('updateClient', data);
      if (this.auth && this.auth.store) {
        if (data.store_code == this.auth.store.code) {
          this.$socket.emit('reqClients', {store_code: this.auth.store.code});
        }
      }
    },
    orderlog: function(data) {
      // console.log('orderlog', data);
      if (this.$store.state.auth.store.code == data.shop_code) {
        // console.log('mine!');
        this.$store.dispatch('pushOrder', data);

        this.audio.play();
        this.$store.dispatch('setOrder', data);
      }
    },
    syncCommitOrder: function(data) {
      if (this.$store.state.auth.store.code == data.shop_code) {
        this.$store.commit('syncCommitOrder', data);
      }
    },
  };

  export default {
    store,
    filters,
    data,
    sockets,
    computed: {
      order() {
        return Boolean(this.$store.getters.order);
      },
      isMember() {
        if (this.auth && this.auth.member) {
          return true;
        }
        return false;
      },
      ordersCount() {
        let result = {
          price: 0,
          count: 0,
        };
        for (let order of this.orders) {
          for (let product of order.products) {
            result.price += product.price;
          }
          result.count += 1;
        }
        return result;
      },
    },
    created() {
      console.log('created');

      setInterval(function(){
        this.time.now = Date();
      }.bind(this), 1000);

      this.loadAuth();
      this.$eventBus.$on('logout', this.logout);
      this.$eventBus.$on('saveAuth', this.saveAuth);
      this.$eventBus.$on('removeAuth', this.removeAuth);
      this.$eventBus.$on('reqOrders', this.initStore);
      this.$eventBus.$on('setStores', this.setStores);

      this.audio = new Audio('http://demo.admin.torder.co.kr/public/wav/order_sound.wav');

      if (this.auth && this.auth.store && this.auth.store.code) {
        this.initStore();
      } else {
        this.$router.push({name: 'member'});
      }

      if(this.auth.member && this.auth.member.code) {
        this.setStores();
      }
    },
    beforeDestroy() {
      this.sockets.unsubscribe('orderview');
    },
    methods: {
      cumulativeProducts: function(order) {
        let cumulative_products = {};
        let tmp_prev_seq = 0;

        if (order.group.seq > 1) {
          for (let orderTmp of this.orders) {
            if (order.table.code == orderTmp.table.code && orderTmp.time < order.time) {
              if (tmp_prev_seq > 0 && tmp_prev_seq <= orderTmp.group.seq) {
                break;
              }

              for (let product of orderTmp.products) {
                let tmp_code = [];
                tmp_code.push(product.code);

                if (product.hasOwnProperty('options')) {
                  for(let option of product.options) {
                    tmp_code.push([option.code, option.qty].join(':'));
                  }
                }
                product.new_code = tmp_code.join('-');

                if (cumulative_products[product.new_code]) {
                  cumulative_products[product.new_code].qty += product.qty;
                } else {
                  cumulative_products[product.new_code] = {
                    code: product.code,
                    price: product.price,
                    name: product.name,
                    options: product.options,
                    first: product.first,
                    qty: product.qty,
                  };
                }
              }

              tmp_prev_seq = orderTmp.group.seq;
            }
          }
        }

        order.first = false;
        for(let product of order.products) {
          if (Object.keys(cumulative_products).indexOf(product.code) < 0) {
            product.first = true;
            order.first = true;
          } else {
            product.first = false;
          }
        }
        order.cumulative_products = cumulative_products;

        return order;
      },
      setStores() {
        if(!(this.auth.member && this.auth.member.code)) {
          return;
        }
        let req_data = {
          member_code: this.auth.member.code,
        };
        axios
          .get('http://api.auth.order.orderhae.com/stores', {
            params: req_data
          })
          .then(function(res) {
            if (res.data) {
              this.stores = [];
              for (let item of res.data.store_data) {
                let store = {
                  code: item.shop_code,
                  name: item.shop_name,
                };
                if (item.current_order) {
                  store.amt = item.current_order.amt;
                  store.cnt = item.current_order.cnt;
                }
                this.stores.push(store);
              }
              this.stores.sort((a, b) => {
                return a.name - b.name;
              });

              if (this.stores.length == 1) {
                let store = this.stores[0];
                this.selectStore(store, 'order');
              }

            } else {
              alert('매장이 없습니다.');
            }
          }.bind(this)).catch(function(err) {
            //alert('매장 정보를 가져오지 못하였습니다.');
            console.log({err: err});
          }).finally(function () {
          });
      },
      restartClients() {
        if(!(this.auth.store && this.auth.store.code)) {
          return;
        }
        let reqData = {store_code: this.auth.store.code};
        this.flag_restarting_clients = 1;
        console.log('reqRestartClients', reqData);
        this.$socket.emit('reqRestartClients', reqData);
      },
      setServiceStatus(value) {
        if (value) {
          this.$eventBus.$emit('openConfirmModal', {
            title: '태블릿 닫기',
            message: '모든 태블릿의 화면을 닫아요',
            confirm: function() {
              let url = 'http://admin.torder.co.kr/store/shop_close';
              let fd = new FormData();
              fd.append('store_code', this.auth.store.code);
              axios
                .post(url, fd)
                .then(function(res) {
                  console.log(res);
                  this.$eventBus.$emit('closeConfirmModal');
                  this.store.serviceStatus = value;
                }.bind(this));
            }.bind(this),
          });
        } else {
          this.$eventBus.$emit('openConfirmModal', {
            title: '태블릿 열기',
            message: '모든 태블릿의 화면을 열어요',
            confirm: function() {
              let url = 'http://admin.torder.co.kr/store/shop_open';
              let fd = new FormData();
              fd.append('store_code', this.auth.store.code);
              axios
                .post(url, fd)
                .then(function(res) {
                  console.log(res);
                  this.$eventBus.$emit('closeConfirmModal');
                  this.store.serviceStatus = value;
                }.bind(this));
            }.bind(this),
          });
        }
      },
      setOrderStatus(value) {
        if (!value) {
          this.$eventBus.$emit('openConfirmModal', {
            title: '주문 받기',
            message: '태블릿에서 주문을 받아요',
            confirm: function() {
              let url = 'http://admin.torder.co.kr/store/shop_open_order';
              let fd = new FormData();
              fd.append('store_code', this.auth.store.code);
              axios
                .post(url, fd)
                .then(function(res) {
                  console.log(res);
                  this.$eventBus.$emit('closeConfirmModal');
                  this.store.orderStatus = value;
                }.bind(this));
            }.bind(this),
          });
        } else {
          this.$eventBus.$emit('openConfirmModal', {
            title: '주문 중단',
            message: '태블릿을 메뉴판으로만 사용하고 주문은 안돼요',
            confirm: function() {
              let url = 'http://admin.torder.co.kr/store/shop_close_order';
              let fd = new FormData();
              fd.append('store_code', this.auth.store.code);
              axios
                .post(url, fd)
                .then(function(res) {
                  console.log(res);
                  this.$eventBus.$emit('closeConfirmModal');
                  this.store.orderStatus = value;
                }.bind(this));

            }.bind(this),
          });
        }
      },
      restart(url) {
        if (!url) {
          url = '/';
        }
        window.location = url;
      },
      initStore() {
        console.log('!!!!!!!!!! try init store');
        if (this.auth && this.auth.store && this.auth.store.code) {
          let reqData = {store_code: this.auth.store.code};
          this.orders = [];
          // console.log('reqOrders', reqData);

          this.$socket.emit('reqStoreInfo', reqData);
          this.$socket.emit('reqOrders', reqData);
          this.$socket.emit('reqTablesInfo', reqData);
          this.$socket.emit('reqPos', reqData);
          this.$socket.emit('reqCategorys', reqData);
          this.$socket.emit('reqProducts', reqData);
        }
      },
      reqOrders() {
        console.log('!!!!!!!!!!try reqOrders');
        if (this.auth && this.auth.store && this.auth.store.code) {
          let reqData = {store_code: this.auth.store.code};
          console.log('reqOrders', reqData);
          this.$socket.emit('reqStoreInfo', reqData);
          this.$socket.emit('reqOrders', reqData);
          this.$socket.emit('reqTablesInfo', reqData);
          this.$socket.emit('reqCategorys', {
            store_code: this.auth.store.code,
          });
          this.$socket.emit('reqProducts', {
            store_code: this.auth.store.code,
          });
        }
      },
      loadAuth() {
        let auth = {};
        try {
          auth = this.$cookies.get('auth');
        } catch(e) {
          console.log(e);
        }
        if (!auth) {
          auth = {};
        }
        this.auth = auth;
        this.$store.dispatch('setAuth', auth);
      },
      saveAuth() {
        let auth = this.auth;
        console.log('saveAuth', auth);
        this.$cookies.set('auth',  auth, '1y', null, null);
        this.$store.dispatch('setAuth', auth);
      },
      removeAuth() {
        if (confirm('매장을 떠나시겠습니까?')) {
          this.auth = {};
          this.$cookies.remove("auth", null, null);
          this.restart('/');
        }
      },
      logout() {
        this.stores = [];
        this.auth.member = undefined;
        this.saveAuth();
      },
      isSelectedStore() {
        if (this.auth && this.auth.store) {
          return true;
        }
      },
    },
  };
</script>

<style lang="scss">
@import "./scss/global.scss";
#orderview {
  display:flex;
  flex-direction:column;
  width:100vw;
  height: 100vh;
  position:relative;
  background-color:#000000;
  font-family: 'NanumSquare', sans-serif;
}
#orderview > .top {
  display:flex;
  flex-direction:row;
  padding:12px;
}
#orderview > .body {
  display:flex;
  flex-grow:1;
  overflow:scroll;

  .right {
    width:120px;
    flex-shrink:0;
    flex-direction:column;
    display:flex;
    padding:12px;
    overflow:auto;
    background-color:#121212;

    hr {
      border-color:#606060;
    }
    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin-top:12px;
      height:40px;
      width:100%;
      border-radius:100px;
      background-color:#ffffff;
      color:#000000;
      font-weight:900;
      text-decoration:none;
      .name {
        font-size:12px;
      }
      text-align:center;
    }
    .button.active {
      background-color:#484848;
      color:#eaeaea;
    }
    .button-member {
      flex-direction:column;
    }
    .button-red {
      background-color:#ff0000;
      color:#ffffff;
    }
    .top {
      display:flex;
      flex-direction:column;
      align-items: center;
      justify-content: flex-start;
      flex-grow:1;
      .logo {
        height:40px;
        margin-bottom:12px;
        max-width:160px;
      }
      .button{
        margin-top:0!important;
        margin-bottom:12px;
      }
      .store_name {
        margin-bottom:12px;
        font-size:12px;
        font-weight:900;
        word-break:keep-all;
        text-align:center;
      }
      .datetime {
        margin-bottom:12px;
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;
        width:100%;
        height:40px;
        border-radius:100px;
        background-color:#484848;
        font-weight:400;

        .price {
          font-size:12px;
          font-weight:900;
        }
      }
    }
    .bottom{
      justify-content: flex-end;

      .buttons {
        display:flex;
      }
    }

    @include tab-group;

    .tab-group {
      flex-direction:column;
      margin-top:0px;
      flex-grow:0;
      .tab-name {
        display:flex;
        height:40px;
        padding:0 24px;
        font-size:12px;
        font-weight:900;
        border-radius:200px;
        background-color:#121212;
        color:#ffffff;
        align-items: center;
        justify-content: center;
        text-decoration:none;
      }
    }
    > .button {
      display:flex;
      margin-top:40px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }

  }
  .left {
    flex-grow:1;
    display:flex;
    overflow:auto;
    .container {
      display:flex;
      flex-direction:column;
      padding:12px;
      flex-grow:1;

      > * {
        display:flex;
      }
      > .top {

        display:flex;
        align-items: center;
        justify-content: center;
        border-bottom:solid 1px #ffffff;
        padding-bottom:12px;
        .title {
          display:flex;
          align-items: center;
          justify-content: center;
          font-size:24px;
          font-weight:900;
        }
      }
      > .bottom {
        margin-top:24px;

        .button {
          display:flex;
          margin:0;
          flex-grow:1;
          align-items: center;
          justify-content: center;
          height:60px;
          background-color:#ff0000;
          color:#ffffff;
          border-radius:100px;
          font-size:20px;
          font-weight:900;
        }
      }
    }
  }
}
#orderview {
  > .foot-left {
    display:flex;
    position:absolute;
    bottom:0;
    left:0;
  }
  > .foot-right {
    display:flex;
    position:fixed;
    bottom:0;
    right:0;
  }
  > .foot {
    .button {
      display:flex;
      margin: 12px 6px;
      height:40px;
      padding:0 24px;
      font-size:16px;
      font-weight:900;
      border-radius:200px;
      background-color:#eaeaea;
      color:#000000;
      align-items: center;
      justify-content: center;
      text-decoration:none;
      box-shadow: 0px 0px 12px -4px #000000;
    }
  }
}
</style>
