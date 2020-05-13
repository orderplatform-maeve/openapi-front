<template lang="pug">
#tables
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="'empty-table'") {{getTableName(table)}}
  .footer
    .button(@click="onAllRefresh") 테이블 전체 초기화
</template>

<script>
import paths from '@router/paths';

export default {
  data() {
    return {
      visibleAllRefreshModal: false,
    };
  },
  computed: {
    tables() {
      return this.$store.state.tables;
    },
  },
  mounted() {
    this.initialized();
  },
  methods: {
    async initialized() {
      try {
        const params = { shop_code: this.$store.state.auth.store.store_code };
        this.$store.dispatch('setTables', params);
      } catch (error) {
        console.log(error);
      }
    },
    getTableName(table) {
      return table?.Tablet_name;
    },
    async openTableOrders(table) {
      this.$router.push({
        name: paths.tableOrders.replace('/', ''),
        params: {
          id: table.Ta_id,
        },
      });
    },
    // async onAllRefresh() {
    //   try {
    //     const { store_code } = this.$store.state.auth.store;
    //     const fd = new FormData();
    //     fd.append('store_code', store_code);
    //     fd.append('timer', 2);

    //     const res = await this.$store.dispatch('allTaletReload', fd);
    //     console.log(res);

    //   } catch (error) {
    //     this.$store.commit('pushFlashMessage', '전체 새로 고침에 실패 하였습니다.');
    //   }
    // },
    async onAllRefresh() {
      this.$store.commit('SHOW_ALL_REFRES_MODAL');
      // console.log(this.tables);
      const { store_code } = this.$store.state.auth.store;

      const getPreparingTabletInfoData = (item) => {
        return {
          status: 'request',
          tabletName: item.Tablet_name,
          msg: '요청 중입니다.',
        };
      };

      const preparingAllRefeshList = this.tables.map(getPreparingTabletInfoData);

      this.$store.commit('SET_ALL_REFRESH_LIST', preparingAllRefeshList);

      this.$socket.emit('orderview', {
        store: {
          code: store_code,
        },
        type: '@show/allRefreshModal',
        allRefreshList: preparingAllRefeshList,
      });

      const delay = (asyncFn) => new Promise((reslove) => setTimeout(() => reslove(asyncFn), 3000));

      const refreshReqeust = async (item) => {
        const fd = new FormData();
        fd.append('store_code', store_code);
        fd.append('table_id', item.Ta_id);

        const response = await delay(this.$store.dispatch('tabletReload', fd));

        return {
          response,
          item,
        };
      };

      const promises = await this.tables.map(refreshReqeust);

      const resutls = await Promise.allSettled(promises);

      const allRefreshList = resutls.map((item) => {
        console.log(item);

        return {
          // requesterUCode: this.$store.state.uCode,
          status: item.status,
          tabletName: item.value.item.Tablet_name,
          msg: item.value.response.data,
        };
      });

      this.$store.commit('SET_ALL_REFRESH_LIST', allRefreshList);

      this.$socket.emit('orderview', {
        store: {
          code: store_code,
        },
        type: '@show/allRefreshModal',
        allRefreshList,
      });
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
