<template lang="pug">
  .container
    .top
      .title {{auth.member?auth.member.name:''}}
    .body
      ul.store-list
        li.store-item(v-for="store in stores" :data-number="store.code")
          .name {{store.name}}
          //.order
            .amt {{store.amt | currency}}원
            .cnt {{store.cnt | currency}}개
          //.button.button-table(v-on:click='select(store, "table")') 테이블 보기
          .button.button-order(v-on:click='selectStore(store, "order")') 주문 보기
    //.bottom
      .button(v-on:click='logout') 로그아웃
</template>
<script>
import axios from 'axios';

export default {
  props: ['auth'],
  data() {
    return {
      stores: [],
    };
  },
  filters: {
    currency(value) {
      if (!value) return '0'
      return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
    }
  },
  methods: {
    check() {
      let auth = this.auth;
      if (auth && auth.member) {
      } else {
        this.$router.push('/member');
      }
    },
    selectStore(store, type) {
      console.log('selectStore', store, type);
      this.auth.store = store;
      console.log(this.auth);
      this.$eventBus.$emit('saveAuth'); 
      this.$eventBus.$emit('reqOrders'); 
      this.$router.push({
        name: type,
      });
    },
    getStores() {
      if (this.auth && this.auth.member) {
      } else {
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
              amt: 0,
              cnt: 0,
            }
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
          this.$eventBus.$emit('setStoreLength', this.stores.length); 

        } else {
          alert('매장이 없습니다.');
        }
      }.bind(this)).catch(function(err) {
        alert('매장 정보를 가져오지 못하였습니다.');
        console.log({err: err});
      }).finally(function () {
      });
    },
  },
  beforeMount() {
    this.check(); 
  },
  created() {
    this.getStores();
  },
  mounted() {
  },
}
</script>
<style lang="scss">
ul.store-list {
  display:flex;
  flex-grow:1;
  flex-direction:column;
  padding:0;
  margin:0;
  list-style:none;
  background-color:#272727;

  li.store-item {
    display:flex;
    align-items: center;
    flex-grow:1;
    flex-shrink:0;
    margin:0px;
    padding:4px 24px;
    border-bottom:solid 1px #484848;
    height:60px;
    color:#fafafa;
    font-size:20px;
    font-weight:900;

    .name {
      flex-grow:1
    }
    .order {
      display:flex;

      > * {
        margin-left:16px;
      }
    }
    .button {
      margin-left:24px;
      display:flex;
      align-items: center;
      justify-content: center;
      padding:0 24px;
      background-color:#fafafa;
      height:48px; 
      border-radius:200px;
      color:#000000;
      font-size:16px;
    }
  }
}
</style>
