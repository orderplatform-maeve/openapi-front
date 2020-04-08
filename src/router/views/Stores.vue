<template lang="pug">
.container
  .top
    .title {{ name }}
  .body
    ul.store-list
      li.store-item(v-for="store in data" :key="getStoreItemKey(store)")
        .name {{getStoreName(store)}}
        .button.button-order(@click="selectStore(store)") 주문 보기
</template>

<script>
import axios from 'axios';

import paths from '@router/paths';
import { COOKIE_AUTH_NAME } from '@config';
import { COOKIE_DOMAIN } from '@config/auth.constant';
import { isDev } from '@utils/constants';

export default {
  props: {
    auth: {
      type: Object,
      default() {
        return {
          member: {
            name: '',
          },
          store: {
            store_code: '',
          },
        };
      },
    },
    stores: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      data: this.stores,
    };
  },
  computed: {
    name: (state) => state.auth.member.name,
  },
  async mounted() {
    if (this.stores.length === 0) {
      const res = await axios.get(`http://api.auth.order.orderhae.com/stores?member_code=${this.auth.member.code}`);
      console.log(res.data.store_data);

      this.data = res.data.store_data.map((o) => ({
        ...o,
        store_code: o.shop_code,
        store_name: o.shop_name,
      }));
    }
  },
  methods: {
    async selectStore(store) {
      this.auth.store = store;

      const auth = {
        ...this.auth,
        store: {
          ...store,
          code: store.store_code,
          name: store.store_name,
        },
      };

      console.log('auth 1@#!@#!@', auth);

      this.$cookies.set(COOKIE_AUTH_NAME, auth, '1y', null, COOKIE_DOMAIN);
      localStorage.auth = JSON.stringify(auth);
      await this.$store.dispatch('updateAuth', auth);

      const fd = new FormData();
      fd.append('shop_code', this.auth.store.store_code);
      await this.$store.dispatch('setOrders', fd);

      const params = new FormData();
      params.append('store_code', this.auth.store.store_code);
      const res = await this.$store.dispatch('setStoreInit', params);

      await this.$store.dispatch('resetDisplayNewOrder');

      try {
        if (res.data.data.T_order_store_orderView_version) {
          window.location.href = res.data.data.T_order_store_orderView_version;
          // this.$router.push(paths.order);
        } else {
          this.$router.push(paths.order);
        }
      } catch(error) {
        return alert('리다이렉션 버젼 주소가 없습니다.');
        // this.$router.push(paths.order);
      }

    },
    getStoreItemKey(store) {
      try {
        return store && store.store_code;
      } catch (error) {
        console.error('store item key err');
        return -1;
      }
    },
    getStoreName(store) {
      if (!store) return '';
      return store.store_name;
    }
  },
};
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
