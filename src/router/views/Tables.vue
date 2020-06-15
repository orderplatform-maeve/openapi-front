<template lang="pug">
#tables
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="'empty-table'") {{getTableName(table)}}
        p {{table.ordering ? '주문중' : ''}}
  .footer
    .button(
      v-if="getAllRefreshDataVisible()"
      @click="onAllRefresh"
    ) 테이블 전체 새로고침
</template>

<script>
import paths from '@router/paths';

export default {
  data() {
    return {
      visibleAllRefreshModal: false,
      timerArr: [],
    };
  },
  computed: {
    tables() {
      return this.$store.state.tables;
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
      // this.$store.commit('SHOW_ALL_REFRES_MODAL');

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
              msg: res?.data,
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

<style lang="scss">
@import "../../scss/global.scss";
#tables {
  display:flex;
  flex-direction:column;
  width:100%;

  .footer {
    display:flex;
    padding: 12px;
    align-items: center;
    justify-content: center;
    border-top: solid 2px #484848;

    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin:0px;
      padding: 20px;
      height:40px;
      background-color:#fafafa;
      color:#000000;
      border-radius:100px;
      font-weight:900;
      font-size: 32px;
    }
    .button.button-dark {
      background-color:#484848;
      color:#ffffff;
    }
  }
  .table-list {
    display:flex;
    flex-wrap:wrap;
    margin:0;
    padding:0 12px;
    overflow:scroll;
    flex-grow:1;
    -webkit-overflow-scrolling: touch;

    .table-item {
      display:flex;
      flex-direction:column;
      align-items: center;
      justify-content: flex-start;
      flex-grow:1;
      margin:0;
      padding:8px 4px;

      .table-number {
        @include table-number;
        position:relative;
      }
      .table-number.empty-table {
        background-color:#484848!important;
      }
      .table-number.disconnected {
        background-color:#484848!important;
      }
      .table-number.preparing {
        background-color:#ff8400!important;
      }
      .wrap-info {
        .price-amt {
          font-weight:900;
          font-size:20px;
        }
      }
      .wrap-clients {
        display:flex;
        z-index:10;
        padding-top:8px;

        .client-count {
          display:flex;
          align-items: center;
          justify-content: center;
          color:#ffffff;
          border-radius:100px;
          font-size:28px;
          font-weight:900;
          border-radius:4px;
          width:1.2em;
          height:1.4em;
        }

        .client {
          display:flex;
          align-items: center;
          justify-content: center;
          background-color:#fafafa;
          color:#ff0000;
          font-size:28px;
          font-weight:900;
          border-radius:4px;
          width:1.2em;
          height:1.4em;
          box-shadow: 0 0 4px 0 #000000;
          margin: 0 -1px;
        }
        .client.preparing {
          color:#000000;
        }
      }
    }
  }
}
</style>
