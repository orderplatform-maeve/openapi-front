<template lang="pug">
#tables
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openTableOrders(table)" :class="'empty-table'") {{getTableName(table)}}
        p {{table.ordering ? '주문중' : ''}}
</template>

<script>
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
      console.log(table.Ta_id);

      // 맘맘분식
      const {
        // connected,
        disconnected,
      } = this.$socket.emit('torder', {
        store: {
          code: this.$store.state.auth.store.store_code,
        },
        table: {
          code: table.Ta_id
        },
        type: 'message',
        message: '주문하신 메뉴가 나왔습니다.',
      });

      if (disconnected) return this.$store.dispatch('pushFlashMessage', '네트워크가 불안정 합니다. 다시 시도 해주세요.');

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

    }
  }
}
</style>
