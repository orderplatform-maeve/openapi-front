<template lang="pug">
#tables
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="getTableNumberClass(table.orderStatus)") {{getTableName(table)}}
      p {{table.orderStatus ? '주문 가능' : '주문 막음'}}
</template>

<script>
export default {
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
    async openTableOrders(table) {
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
      }, (ask) => console.log(ask));

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
      margin: 0;
      padding:8px 4px;

      .table-number {
        @include table-number;
        position:relative;
      }
      .table-number.empty-table {
        background-color:#484848!important;
      }
      .table-number.connect {
        background-color:#006a4a!important;
      }
      .table-number.disconnected {
        background-color:#B53737!important;
      }
      .table-number.preparing {
        background-color:#ff8400!important;
      }
    }
  }
}
</style>
