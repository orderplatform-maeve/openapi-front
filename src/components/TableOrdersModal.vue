<template lang="pug">
#tableOrders(v-if="show")
  .background(@click="onClose")
  .container
    .top
      .wrap
        .table-number {{tableName}}
      .wrap
        .title 주문내역보기
      .buttons
        .button(v-on:click="openMenuBoard(table)") 주문하기
    .body
      .left
        table.order-list
          tbody
            tr.order-item(v-for="order in orders")
              td.name {{order.display_name}}
              td.price {{order.good_price}}원
              td.qty {{order.order_qty}}개
              td.price.price-amt {{order.good_price * order.order_qty}}원
          tfoot
            tr
              td(colspan=2) 합계
              td {{table.qty_amt}}개
              td {{table.price_amt}}원
    .foot
      .buttons
        .button(@click="onClose") 닫기
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tableName: {
      type: String,
      default: '',
    },
    tableId: {
      type: String,
      default: '',
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    showMenuModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      table: {
        qty_amt: 0,
        price_amt: 0,
      },
    };
  },
  computed: {
    orders() {
      return [];
    }
  },
  created() {
    const fd = new FormData();

    const { store_code } = this.$store.state.auth.store;
    fd.append('store_code', store_code);
    fd.append('tablet_number', this.tableId);

    this.$store.dispatch('setTableCartList', fd);
  },
  methods: {
    openMenuBoard() {
      this.showMenuModal();
      this.onClose();
    },
  },
};
</script>

<style lang="scss">
@import "../scss/global.scss";
#orderview .body .left .container .top {
  padding: 0;
  justify-content: space-between;
}

#tableOrders {
  @include modal;

  .order-list {
    display:table;
    flex-direction:column;
    margin:0;
    padding:0;
    width:100%;
    list-style:none;
    font-size:24px;
    font-weight:400;

    .order-item {
      display:table-row;
      margin:0;
      padding:0;

      > * {
        display:table-cell;
      }
      .price {
        text-align:right;
      }
      .qty {
        text-align:right;
      }
    }
    tfoot {
      text-align:right;
      font-weight:900;
    }
  }
}
</style>
