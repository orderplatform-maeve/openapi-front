<template lang="pug">
  .container
    .top
      .title {{ name }}
    .body
      ul.store-list
        li.store-item(v-for="store in stores" :key="getStoreItemKey(store)")
          .name {{getStoreName(store)}}
          .button.button-order(@click="selectStore(store)") 주문 보기
</template>
<script>
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
  computed: {
    name: (state) => state.auth.member.name,
  },
  methods: {
    async selectStore(store) {
      this.auth.store = store;

      const auth = {
        ...this.auth,
        code: this.auth.store_code,
        name:  this.auth.store_name,
      };

      this.$cookies.set(COOKIE_AUTH_NAME, auth, '1y', null, COOKIE_DOMAIN);
      await this.$store.dispatch('updateAuth', this.auth);

      const fd = new FormData();
      fd.append('shop_code', this.auth.store.store_code);
      await this.$store.dispatch('setOrders', fd);

      const params = new FormData();
      params.append('store_code', this.auth.store.store_code);
      const res = await this.$store.dispatch('setStoreInit', params);

      await this.$store.dispatch('resetDisplayNewOrder');

      if (isDev) {
        this.$router.push(paths.order);
      } else {
        window.location.href = res.data.data.T_order_store_orderView_version;
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
