<template lang="pug">
#tables
  modal-table-orders
  modal-menu(
    v-if="chooseTable"
    :show="isMenuModal"
    :onClose="closeMenuModal"
    :tableName="getTableName()"
    :tableId="getTableId()"
  )
  .top
    .button(v-if="!flag_restaring" @click="restartAllClient()") 태블릿 전체 새로고침
    .button.button-dark(v-if="flag_restaring" @click="cancelRestart()") 태블릿 새로고침 취소
  ul.table-list
    li.table-item(v-for="table in tables" :key="table.Ta_id" )
      .table-number(@click="openMenuBoard(table)" :class="'empty-table'") {{table.Tablet_name}}
</template>

<script>
export default {
  data() {
    return {
      timeouts: [],
      flag_restaring: false,
      isMenuModal: false,
      chooseTable: null,
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

    const categories = await this.$store.dispatch('setCategories', fd);
    const goods = await this.$store.dispatch('setGooods', fd);
    console.log('categories', categories, goods);
  },
  beforeDestroy() {
    this.cancelRestart();
  },
  methods: {
    closeMenuModal() {
      this.isMenuModal = false;
    },
    getTableName() {
      return this.chooseTable?.Tablet_name;
    },
    getTableId() {
      return this.chooseTable?.Ta_id;
    },
    openMenuBoard(table) {
      this.isMenuModal = true;
      this.chooseTable = table;
    },
    restartAllClient() {
      this.flag_restaring = true;
      console.log('restart all client');

      let clients = this.$store.getters.clients;

      let count = 0;
      for (let myid in clients) {
        let client = clients[myid];

        let timeout = setTimeout(function() {
          console.log(myid, client);

          client.tablet_number;

          let data = {
            type_msg: 'restart',
            myid: myid,
          };
          this.$socket.emit('reqRestartClient', data);
        }.bind(this), count * 3000);
        this.timeouts.push(timeout);
        count += 1;
      }

    },
    cancelRestart() {
      for (let timeout of this.timeouts) {
        clearTimeout(timeout);
      }
      this.timeouts = [];
      this.flag_restaring = false;
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
