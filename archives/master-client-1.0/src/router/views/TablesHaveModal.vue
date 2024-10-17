<template lang="pug">
#tables
  modal-table-orders(
    v-if="chooseTable"
    :show="isTableOrderModal"
    :tableName="getTableName()"
    :tableId="getTableId()"
    :onClose="closeTableOrderModal"
    :showMenuModal="showMenuModal"
  )
  modal-menu(
    v-if="chooseTable"
    :show="isMenuModal"
    :onClose="closeMenuModal"
    :tableName="getTableName()"
    :tableId="getTableId()"
    :onTableOrder="showTableOrderModal"
  )
  .top
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="'empty-table'") {{table.Tablet_name}}
</template>

<script>
export default {
  data() {
    return {
      isMenuModal: false,
      chooseTable: null,
      isTableOrderModal: false,
    };
  },
  computed: {
    tables() {
      return this.$store.state.tables;
    },
  },
  async mounted() {
    const params = { shop_code: this.$store.state.auth.store.store_code };
    this.$store.dispatch('setTables', params);

    const fd = new FormData();
    fd.append('store_code', this.$store.state.auth.store.store_code);

    // const categories = await this.$store.dispatch('setCategories', fd);
    // const goods = await this.$store.dispatch('setGoods', fd);
    // // console.log('categories', categories, goods);
  },
  methods: {
    showMenuModal() {
      this.isMenuModal = true;
    },
    closeTableOrderModal() {
      this.isTableOrderModal = false;
    },
    showTableOrderModal() {
      this.isTableOrderModal = true;
    },
    closeMenuModal() {
      this.isMenuModal = false;
    },
    getTableName() {
      return this.chooseTable?.Tablet_name;
    },
    getTableId() {
      return this.chooseTable?.Ta_id;
    },
    openTableOrders(table) {
      this.isTableOrderModal = true;
      this.chooseTable = table;

      const fd = new FormData();

      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.getTableId());

      // console.log(store_code, this.getTableId());

      this.$store.dispatch('setTableCartList', fd);
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
