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
              td.name {{order.name_product}}
              td.price {{order.price_product}}원
              td.qty {{order.qty}}개
              td.price.price-amt {{order.price_product * order.qty}}원
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
      table: {},
    };
  },
  computed: {
    orders() {
      return [];
    }
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
