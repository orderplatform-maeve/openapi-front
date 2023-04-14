<template lang="pug">
  .tables-page-container
    p.tables-page-title 테이블 주문 (테스트)
    .order-table-list
      button.order-table-name(v-for="table in sortedTables" :key="table.Ta_id" @click="openTableOrders(table)" :class="checkOrderTableStyle(table)")
        p {{getTableName(table)}}
        p {{table.ordering ? '주문중' : ''}}
    .wrap-all-table-reset-button
      button.all-table-reset-button(@click="onAllRefresh") 테이블 전체 새로고침
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import paths from '@router/paths';

export default {
  data() {
    return {
      visibleAllRefreshModal: false,
      timerArr: [],
    };
  },
  computed: {
    sortedTables() {
      const tables = this.$store.state.tables.sort((a, b) => {
        return a.Tablet_name.length - b.Tablet_name.length || a.Tablet_name.localeCompare(b.Tablet_name);
      });
      return tables;
    },
  },
  watch: {
    '$store.state.allRefreshList'(nextValue) {
      const filteredDoneData = nextValue.filter((o) => o.status === 'fulfilled' || o.status === 'reject');
      const filteredDoneDataLength = filteredDoneData.length;
      // // console.log(filteredDoneDataLength, nextValue.length);
      // // console.log('watch', nextValue);

      if (filteredDoneDataLength > 0) {
        const curTimerIdx = filteredDoneDataLength - 1;
        const timer = this.timerArr[curTimerIdx];
        // console.log(timer);
        clearTimeout(timer);
      }

      if (filteredDoneDataLength === nextValue.length) {
        this.timerArr = [];
        // console.log('clean timer done', this.timerArr);
      }
    },
  },
  mounted() {
    this.initialized();
  },
  methods: {
    checkOrderTableStyle(table) {
      console.log('test');
      const orderTableStyle = {
        'order-table-color': table.orderId !== "1"
      };

      return orderTableStyle;
    },
    async initialized() {
      if (this.$store.state.tables.length === 0) {
        try {
          const params = { shop_code: this.$store.state.auth.store.store_code };
          await this.$store.dispatch('setTables', params);

        } catch (error) {
        // console.log(error);
        }
      }
    },
    getTableName(table) {
      return table?.Tablet_name;
    },
    async openTableOrders(table) {
      if (table?.ordering) return this.$store.commit('pushFlashMessage', '다른 오더뷰 에서 주문 중입니다.');

      this.$router.push({
        name: paths.tableOrders.replace('/', ''),
        params: {
          id: table.Ta_id,
        },
      });
    },
    async onAllRefresh() {
      const { store_code } = this.$store.state.auth.store;

      const getPreparingTabletInfoData = (item) => {
        return {
          status: 'request',
          tabletName: item.Tablet_name,
          msg: '요청 중입니다.',
        };
      };

      const preparingAllRefeshList = this.tables.map(getPreparingTabletInfoData);

      // // console.log('preparingAllRefeshList', preparingAllRefeshList);
      // this.$store.commit('SET_ALL_REFRESH_LIST', preparingAllRefeshList);
      // this.$store.commit('SHOW_ALL_REFRESH_MODAL');

      const nowSoketInfo = this.$socket.emit('orderview', {
        store: {
          code: store_code,
        },
        type: '@show/allRefreshModal',
        allRefreshList: preparingAllRefeshList,
      });

      // console.log('nowSoketInfo', nowSoketInfo);

      const { disconnected, connected } = nowSoketInfo;

      if (disconnected) return this.$store.dispatch('pushFlashMessage', '소켓 통신이 원활하지 않습니다. 잠시후 시도해주세요.');

      if (connected) {
        this.tables.forEach((item, i) => {
          const timer = setTimeout(async () => {
            const fd = new FormData();
            fd.append('store_code', store_code);
            fd.append('table_id', item.Ta_id);

            const res = await this.$store.dispatch('tabletReload', fd);
            // // console.log(res);

            const result = {
              status: res.status === 200 ? 'fulfilled' : 'rejected',
              tabletName: item.Tablet_name,
              msg: '새로고침이 되었습니다.',
            };
            // // console.log(result);

            const targetItemIndex = this.$store.state.allRefreshList.findIndex((o) => o.tabletName === result.tabletName);

            if (targetItemIndex > -1) {
              const allRefreshList = [...this.$store.state.allRefreshList];

              allRefreshList[targetItemIndex] = result;

              // this.$store.commit('SET_ALL_REFRESH_LIST', allRefreshList);

              this.$socket.emit('orderview', {
                store: {
                  code: store_code,
                },
                type: '@show/allRefreshModal',
                allRefreshList,
              });
            }
          }, i * 3000);

          this.timerArr = [...JSON.parse(JSON.stringify(this.timerArr)), timer];
        });

        // console.log(this.timerArr);
      }
    },
    getAllRefreshDataVisible() {
      return this.$store.state.tables.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.tables-page-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .tables-page-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 2.5vh 0 !important;
    box-sizing: border-box;
  }

  .order-table-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10.9375vw);
    align-items: center;
    gap: 0.78125vw;

    .order-table-name {
      min-height: 4.6875vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #e5e5e5;
      border: none;
      border-radius: 1.015625vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      color: #666;
      letter-spacing: -0.0390625vw;
      text-align: center;
    }

    .order-table-color {
      background-color: #fc0000;
      color: #fff;
    }
  }

  .wrap-all-table-reset-button {
    flex: 1;
    padding: 1.5625vw 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .all-table-reset-button {
      width: 37.5vw;
      height: 4.53125vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-weight: bold;
      font-size: 2.03125vw;
      color: #fff;
      letter-spacing: -0.05078125vw;
      background-color: #fc0000;
      border: none;
      border-radius: 1.015625vw;
    }
  }
}
</style>
