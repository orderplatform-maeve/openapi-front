<template lang="pug">
.container
  .top
    .title
      .name {{store.name}} {{store.order_amt | currency}}원 {{store.order_cnt}}개
      .table {{current_amt | currency}}원
  .body
    ul.table-list
      li.table-item(v-for="table in tables" :data-number="table.number" )
        .name(:class="{'active':table.total_price}") {{table.name}}
        .total-price {{table.total_price | currency}}원
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      store: {
        order_cnt: 0,
        order_amt: 0,
      },
      tables: [],
    }
  },
  filters: {
    currency(value) {
      if (!value) return '0'
      return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
    }
  },
  computed: {
    current_amt() {
      let amt = 0;
      for (let table of this.tables ) {
       amt += table.total_price;
      }
      return amt;
    }
  },
  methods: {
    select(table) {
      let auth = this.$cookies.get('auth');
      auth.table = {
        number: table.number,
        name: table.name,
      };
      //this.$cookies.set('auth',  auth, '1y', null, ".orderhae.com");
      this.$cookies.set('auth',  auth, '1y', null, null);
      location.href="http://order.orderhae.com";
    },
    getTablesInfo() {
      let store_code = this.store.code;
      let req_data = {
        store_code: store_code,
      };
      axios
      .get('http://api.auth.order.orderhae.com/tables', {params: req_data})
      .then(function(res) {
        console.log({res: res});
        if (res.data) {
          this.tables = [];
          for (let item of res.data.tables) {
            this.tables.push({
              number: item.Tablet_number,
              name: item.Tablet_name,
              total_price: item.total_price,
            });
          }
          this.tables.sort((a, b) => {
            return a.name - b.name;
          });

          this.store.order_cnt  = res.data.store.T_order_store_tablet_order_cnt;
          //this.data.store.order_date = res.data.store.T_order_store_order_date;
          this.store.order_amt  = res.data.store.T_order_store_tablet_amt;
        }
      }.bind(this)).catch(function(err) {
        //alert('테이블 정보를 가져오지 못하였습니다.');
        console.log({err: err});
      }).finally(function () {
      });
    },
    check() {
      let auth = {};
      try { 
        auth = this.$cookies.get('auth');
      } catch(e) {
      }

      if (auth && auth.member) {
      } else {
        this.$router.push('/member');
      }
      if (auth && auth.store) {
      } else {
        this.$router.push('/store');
      }
      this.store = auth.store;
    },
    selectStore() {
      this.$router.push('/store');
    },
    logout() {
      this.$eventBus.$emit('logout');
    },
  },
  beforeMount() {
    this.check(); 
    ;
  },
  mounted() {
    this.getTablesInfo();
  },
}
</script>
<style lang="scss">
.top {
  .title {
    display:flex;
    flex-grow:1;
    .name {
      display:flex;
      flex-grow:1;
    }
  }
}
ul.table-list {
  display:flex;
  flex-wrap:wrap;
  margin:-12px;
  padding:0;
  list-style:none;

  li.table-item {
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    flex-grow:1;
    margin:12px;

    .name {
      display:flex;
      align-items: center;
      justify-content: center;
      border:solid 2px #ffffff;
      border-radius:200px;
      font-size:20px;
      font-weight:700;
      min-width:3em;
    }
    .name:after {
      content:'';
      display:block;
      padding-top:100%;
    }
    .name.active {
      color:#ffffff;
      background-color:#ff0000;
      border-color:#ff0000;
    }
    .total-price {
      margin-top:4px;
      padding-top:4px;
      border-top:solid 2px #ffffff;
      color:#ffffff;
    }
  }
}

</style>
