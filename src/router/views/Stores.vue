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
      const res = await this.$store.dispatch('requestStoreList', this.auth);

      if (res) {
        this.data = res;
      }
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

      localStorage.auth = JSON.stringify(auth);
      await this.$store.dispatch('updateAuth', auth);

      try {
        if (auth.store.code) {
          console.log(auth.store.code);
          const data = {
            storeCode: auth.store.code,
            tableCode: '',
          };

          window.UUID.setStoreCode(JSON.stringify(data));
        }
      } catch(error) {
        console.log('안드로이드 아니라서 발생하는 에러');
      }

      const params = new FormData();
      params.append('store_code', this.auth.store.store_code);
      const res = await this.$store.dispatch('setStoreInit', params);

      try {
        if (res.data.data.T_order_store_orderView_version) {

          if (process.env.STOP_REDIRECT) {
            return this.$router.push(paths.order);
          } else {
            // 캐시된 문서가 있는경우 서버에 요청 하지 않음
            // window.location.href = res.data.data.T_order_store_orderView_version;
            // cache 파일을 로드하지 않는다.
            return location.replace(res.data.data.T_order_store_orderView_version);
          }
        } else {
          console.error('리다이렉션 버젼 주소가 없습니다. 루트버젼을 사용합니다.');
          return this.$router.push(paths.order);
        }
      } catch(error) {
        // console.log('리다이렉션 버젼 주소가 없습니다.');
        return this.$router.push(paths.order);
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
    padding:4px 24px !important;
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
      padding:0 24px !important;
      background-color:#fafafa;
      height:48px;
      border-radius:200px;
      color:#000000;
      font-size:16px;
    }
  }
}
</style>
