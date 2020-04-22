<template lang="pug">
  #container
    .left-box
      .top
        <table>
          <tr>
            <th>주문 번호</th>
            <td>1231312</td>
          </tr>
          <tr>
            <th>테이블</th>
            <td>25</td>
          </tr>
          <tr>
            <th>담당자</th>
            <td>마스터</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>주문시간</th>
            <th>10:14:47</th>
          </tr>
          <tr>
            <th>고객수</th>
            <td>$0</td>
          </tr>
          <tr>
            <th>특기사항</th>
            <td></td>
          </tr>
        </table>
      .bill
        .top
          p 상품명
          p 수량
          p 할인
          p 금액
          p 비고
        .body(v-if="previousOrders")
          .row(v-for="order in previousOrders")
            p {{ order.display_name }}
            p {{ order.order_qty }}
            p discount
            p {{ order.good_price }}
            p etc
        .footer
          p {{ previousOrders.length }} 건
          p 합계
    .right-box
      div right
</template>

<script>
export default {
  computed: {
    previousOrders() {
      return this.$store.state.cartList;
    },
  },
  async mounted() {
    const isMenu = await this.getMenu();
    const isPreviousOrders = await this.getPreviousOrders();
  },
  methods: {
    async getMenu() {
      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);

      const categories = await this.$store.dispatch('setCategories', fd);
      const goods = await this.$store.dispatch('setGooods', fd);
      // console.log('categories', categories, goods);

      const noData = !categories || !goods;

      if (noData) return false;

      return true;
    },
    async getPreviousOrders() {
      console.log(this.$route.params.id);

      const fd = new FormData();
      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('tablet_number', this.$route.params.id);

      const orders = await this.$store.dispatch('setTableCartList', fd);
      // console.log(orders);
      if (!orders) return false;

      return true;
    },
  },
};
</script>

<style lang="scss">
  #container {
    display: flex;
    flex: 1;
    .left-box {
      width: 50%;
      background-color: silver;
      .top {
        display: flex;
      }
      .bill {
        .top {
          width: 100%;
          background-color: green;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-around;
        }
        .body {
          width: 100%;
          background-color: orange;
          padding: 10px;
          box-sizing: border-box;

          .row {
            display: flex;
            justify-content: space-around;
          }
        }
        .footer {
          display: flex;
          justify-content: space-around;
          background-color: aqua;
        }
      }
    }
    .right-box {
      width: 50%;
      background-color: red;
    }
  }
</style>
