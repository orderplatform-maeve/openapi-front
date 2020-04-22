<template lang="pug">
#tables
  .top
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="'empty-table'") {{getTableName(table)}}
</template>

<script>
import paths from '@router/paths';

export default {
  data() {
    return {
      chooseTable: null,
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
      const params = { shop_code: this.$store.state.auth.store.store_code };
      this.$store.dispatch('setTables', params);
    },
    getTableName(table) {
      return table?.Tablet_name;
    },
    getTableId() {
      return this.chooseTable?.Ta_id;
    },
    async openTableOrders(table) {
      this.chooseTable = table;
      const isMenu = await this.getMenu();
      const isPreviousOrders = await this.getPreviousOrders();

      // console.log(isMenu, isPreviousOrders);

      const isNext = isMenu && isPreviousOrders;
      if (isNext) {
        this.$router.push({
          name: paths.tableOrders.replace('/', ''),
          params: {
            id: this.getTableId(),
          },
        });
      }
    },
    async getMenu() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);

      const categories = await this.$store.dispatch('setCategories', fd);
      const goods = await this.$store.dispatch('setGooods', fd);
      // console.log('categories', categories, goods);

      const noData = !categories || !goods

      if (noData) return false;

      return true;
    },
    async getPreviousOrders() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.getTableId());

      const orders = await this.$store.dispatch('setTableCartList', fd);
      // console.log(orders);
      if (!orders) return false;

      return true;
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

  .top {
    display:flex;
    padding:12px;

    .button {
      display:flex;
      align-items: center;
      justify-content: center;
      margin:0px;
      padding:0;
      height:40px;
      background-color:#fafafa;
      color:#000000;
      border-radius:100px;
      flex-grow:1;
      font-weight:900;
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
