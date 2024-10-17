<template lang="pug">
  .control-order-page-container
    p.control-order-page-title 테이블 주류 주문 관리 (테스트)
    .order-table-list
      button(v-for="table in tables" :key="table.Ta_id" @click="openTableOrders(table)" :class="orderStatus('order-table-name', !table.orderStatus)")
        p {{getTableName(table)}}
        p.order-status {{table.orderStatus ? '주문 가능' : '주문 막음'}}
</template>

<script>
export default {
  data() {
    return {
      reRequest : false,
      timer : 0,
      tableId : ''
    };
  },

  computed: {
    tables() {
      const tables = this.$store.state.tables;
      const sortedTables = tables.sort((a, b) => {
        return a.Tablet_name.length - b.Tablet_name.length || a.Tablet_name.localeCompare(b.Tablet_name);
      });
      return sortedTables;
    }
  },

  async mounted() {
    await this.initialized();
  },

  methods: {
    orderStatus(defaultClass, status) {
      return {
        [defaultClass]: true,
        notOrder: status
      };
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
    getTableNumberClass(orderStatus) {
      return orderStatus ? 'connect': 'disconnected';
    },

    // 주류 주문 관리 상태 변경
    async openTableOrders(table) {
      if (this.reRequest && this.tableId === table.Ta_id) {
        return;
      }

      console.log(table);
      const tables = JSON.parse(JSON.stringify(this.tables));

      this.$socket.emit('event', {
        store: {
          code: this.$store.state.auth.store.store_code,
        },
        table: {
          code: table.Ta_id,
        },
        type: 'setSuspendSale',
        suspendSale: Number(table.orderStatus),
      }, (ask) => {
        if (ask.resultPush) {
          this.$store.commit('pushFlashMessage', '테이블 주류 주문 상태를 변경 했습니다.');
        }
      });

      const defineTabels = tables.map((o) => {
        if (o.Ta_id === table.Ta_id) {
          return {
            ...o,
            orderStatus: !table.orderStatus,
          };
        }
        return o;
      });
      this.$store.commit('SET_TABLES', defineTabels);

      // 각각 개별적으로 5초 뒤에 다시 실행 가능
      this.reRequest = true;
      this.tableId = table.Ta_id;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.reRequest = false;
        return;
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.control-order-page-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .control-order-page-title {
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

      > p {
        word-break: break-all;
      }

      .order-status {
        color: #999;
        font-size: 1.2vw;
      }
    }

    .notOrder {
      background-color: #000;
      color: #fff;
      font-weight: bold;

      .order-status {
        color: #fff;
        font-weight: lighter;
      }
    }
  }
}
</style>
