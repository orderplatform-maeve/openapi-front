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
