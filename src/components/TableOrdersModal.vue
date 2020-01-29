<template lang="pug">
#tableOrders(v-if="show")
  .background(v-on:click="close")
  .container
    .top
      .wrap
        .table-number {{table.name}}
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
        .button(v-on:click="close") 닫기
</template>

<script>
export default {
  data() {
    return {
      show: false,
      table: {},
    };
  },
  methods: {
    openMenuBoard(table) {
      this.$eventBus.$emit('openMenuBoard', table);
      this.close();
    },
    open(table) {
      this.table = table;
      this.show = true;
    },
    close() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
@import "../scss/global.scss";
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
