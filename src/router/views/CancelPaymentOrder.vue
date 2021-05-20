<template lang="pug">
#tables
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" class="empty-table") {{getTableName(table)}}
</template>

<script>
import axios from 'axios';
import endpoints from '@apis/endpoints';

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
      const {
        payment: {
          deleteCartList
        }
      } = endpoints;

      console.log(table, deleteCartList, this.$store.state.auth.store.store_code);

      const fd = new FormData();
      fd.append('store_shop_code', this.$store.state.auth.store.store_code);
      fd.append('tablet_number', table.Ta_id);

      const r = await axios.post(deleteCartList, fd);

      if (r?.data.code === 200) {
        return this.$store.commit('pushFlashMessage', `${table.Tablet_name} 결제 주문 삭제 완료 되었습니다.`);
      }

      return this.$store.commit('pushFlashMessage', `${table.Tablet_name} 결제 주문 삭제 실패`);
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
