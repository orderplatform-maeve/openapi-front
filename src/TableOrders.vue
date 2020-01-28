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
      show: true,
      table: {},
    };
  },
  computed: {
    orders() {
      let orders = {};
      for (let order of this.table.orders) {
        if (orders[order.good.id]) {
          orders[order.good.id].qty += order.qty;
        } else {
          orders[order.good.id] = {
            code_product: order.good.code,
            name_product:order.good.name,
            price_product: order.good.price,
            qty: order.qty,
          };
        }
      }
      return orders;
    }
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
@import "./scss/global.scss";
#tableOrders {
  @include modal;
  .top {
  }

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
      .name {
      }
      .price {
        text-align:right;
      }
      .qty {
        text-align:right;
      }
      .price-amt {
      }
    }
    tfoot {
      text-align:right;
      font-weight:900;
    }
  }
}
</style>
