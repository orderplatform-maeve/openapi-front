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
      this.$cookies.set('auth', this.auth, '1y', null, null);

      await this.$store.dispatch('updateAuth', this.auth);

      const fd = new FormData();
      fd.append('shop_code', this.auth.store.store_code);

      await this.$store.dispatch('setOrders', fd);

      this.$router.push(paths.order);
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
