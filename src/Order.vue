<template lang="pug">
#order
  .background
  .container
    .container-top 
      .order-title
        //.store_name {{order.store.name}}
        .table-number(:class="{call: order.order_info[0].good_code=='99999', setting: order.order_info[0].good_code=='88888'}") {{order.T_order_order_tablet_number}}
        .people_total_count(v-if="order.total_peoples > 0") {{order.total_peoples}}명
        .msg
          //span.title(v-if="order.products[0].code=='99999'") 호출이요
          //span.title(v-else-if="order.products[0].code=='88888'") 셋팅완료
          span.title(v-if="order.order_info[0].good_code=='99999'") 호출이요
          span.title(v-else-if="order.order_info[0].good_code=='88888'") 셋팅완료
          span.title(v-else) 주문이요
          .icon.visit(v-if="order.is_tablet_first_order") 입장
          .icon.first(v-if="order.is_first_order") 첫 주문
        //.visit(v-if="order.products[0].code!='88888'&&order.group.seq==1") 입장
        .msg-time
          .commit(:class="{commited:order.commit}") {{order.commit ? '확인' : '미확인'}}
          //.time {{order.time | moment("A hh:mm:ss") }}
          .time {{order.order_time}} 
    .container-body
      .left
        .wrap-people-list
          ul.people-list
            li.people-item(v-for="people in order.people_json" v-if="people.count > 0")
              .count {{people.count}}명
              .name {{people.name}}
        .wrap-product-list
          ul.product-list
            li.product-item(v-for="product in order.order_info")
              .count {{product.good_qty}}개
              .name {{product.good_name}}
              .memo(v-if="product.memo_show") {{product.memo}}
              //.first(v-if="product.first") 첫 주문
              ul.option-list(v-if="product.option")
                li.option-item(v-for="option in product.option")
                  span +
                  .count {{option.good_qty}}개
                  .name  {{option.display_name}}
      .right
        .wrap-c-product-list()
          .title 이전주문내역
          ul.c-product-list
            li.order-item(v-for="c_product in order.total_orders")
              .name {{c_product.display_name}}
              .count {{c_product.order_qty}}개
              ul.option-list(v-if="c_product.option")
                li.option-item(v-for="option in c_product.option")
                  span +
                  .count {{option.order_qty}}개
                  .name  {{option.display_name}}
    .container-foot
      .msg {{seconds}}초 후 닫혀요.
      .buttons
        .button.button-commit(v-on:click="commitOrder(order)") 확인
        .button.button(v-on:click="closeOrder") 닫기
</template>
<script>
export default {
  data() {
    return {
      interval: undefined,
      seconds: 10,
    };
  },
  computed: {
    order() {
      return this.$store.getters.order;
    },
  },
  methods: {
    commitOrder(order) {
      let auth = this.$store.getters.auth;
      this.$store.dispatch("commitOrder", {auth, order});
    },
    closeOrder() {
      clearInterval(this.interval);
      this.$store.dispatch('unsetOrder');
    },
  },
  mounted() {
    clearInterval(this.interval);
    this.seconds = 10;
    this.interval = setInterval(function(){
      this.seconds -= 1;

      if(this.seconds < 1) {
        this.closeOrder();
      } 
    }.bind(this), 1000);
  },
  beforeDestroy() {
    this.closeOrder();
  }, 
}
</script>
<style lang="scss">
@import "./scss/global.scss";

#order {
  position:fixed;
  top:0;
  left:0;
  display:flex;
  align-items: center;
  justify-content: center;
  
  width:100%;
  height:100%;
  z-index:101;

  .background {
    position:absolute;
    top:0;
    left:0;
    display:flex;
    width:100%;
    height:100%;
    z-index:102;
    background-color:rgba(0,0,0,0.8);
  }

  .container {
    display:flex;
    padding:24px !important;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    width:80%;
    height:80%;
    z-index:103;
    border:solid 2px #ffffff;
    border-radius:24px;
    flex-grow:0 !important;
    background-color:rgba(0,0,0,0.9);

    .container-top {
      display:flex;
      width:100%;
      flex-shrink:0;
      .order-title {
        width:100%;
        @include order-title;
        margin-bottom:12px;
      }
    }
    .container-body {
      display:flex;
      flex-direction:row;
      flex-grow:1;
      flex-shrink:1;
      width:100%;
      overflow:scroll;

      .left {
        display:flex;
        flex-direction:column;
        flex-grow:1;

        .wrap-people-list {
          display:flex;
          height:48px;
          margin-bottom:12px;
          font-size:36px;
          font-weight:900;
      
          .people_total_count {
            display:flex;
            align-items: center;
            justify-content: center;
            border-radius: 100px;
            background-color: #ffffff;
            color: #000000;
            padding: 0 12px;
          }
          .people-list {
            margin:0;
            padding:0;
            display:flex;
            font-size:32px;

            .people-item {
              display:flex;
              align-items: center;
              justify-content: center;
              margin:0;
              padding:0;
              display:flex;
              margin-right:12px;
              padding-right:12px;
              border-left: solid 1px #444444;
              .count {
                margin-right:8px;
              }
            }
            .people-item:first-child {
              border:none;
            }
          }
        }


        .wrap-product-list {
          display:flex;
          flex-direction:column;
          flex-grow:1;

          .product-list {
            display:flex;
            flex-direction:column;
            word-break: keep-all;
            margin:0;
            padding:0;
            overflow:scroll;
            -webkit-overflow-scrolling: touch; 
      
            .product-item {
              display:flex;
              flex-shrink:0;
              flex-direction: row;
              flex-wrap: wrap;
              align-items: stretch;
              word-break:break-all;
              margin-bottom:12px;
              font-size:48px;
              font-weight:900;


              .option-list {
                display:flex;
                flex-direction:column;
                margin:0;
                padding:0;
                font-size:0.8em;
                width:100%;

                .option-item {
                  display:flex;
                  margin-left:88px;
                }
              }

              .msg {
              }
              .name {
              }
              .memo {
                display:flex;
                align-items: center;
                border-radius:100px;
                border:solid 3px #ffffff;
                padding:0 12px;
                font-size:0.6em;
                margin-left:12px;
              }
              .count {
                margin-right:24px;
                text-align:right;
              }
              .first {
                margin-left:12px;
                display:flex;
                align-items: center;
                justify-content: center;
                padding:0 24px;
                border-radius:100px;
                height:48px;
                background-color:#ffffff;
                color:#000000;
                font-size:24px;
                font-weight:900;
              }
            }
          }
        }

      }
      .right {
        display:flex;
        flex-direction:column;
        flex-grow:1;

        .wrap-c-product-list {
          display:flex;
          flex-direction:column;
          //margin-left:24px;
          //margin-bottom:24px;
          flex-shrink:1;
          flex-grow:1;
          padding-left:24px;
          //border-left:solid 1px #808080;
          min-width:200px;

          .title {
            display:flex;
            flex-shrink:0;
            align-items: center;
            justify-content: center;
            height:40px;
            font-size:20px;
            font-weight:700;
            background-color:#ffffff;
            color:#000000;
            border-radius:100px;
          }
          .c-product-list {
            flex-grow:1;
            font-size:20px;
            display:flex;
            flex-direction:column;
            margin:0;
            padding:0;
            list-style:none;
            word-break: keep-all;
            overflow:scroll;
            -webkit-overflow-scrolling: touch; 
           
            .order-item {
              display:flex;
              flex-direction: row;
              flex-wrap: wrap;
              margin:0;
              padding:8px 0;
              font-size:20px;
              align-items: flex-start;

              border {
                bottom:solid 1px #484848;
              }

              .option-list {
                display:flex;
                flex-direction:column;
                margin:0;
                padding:0;
                font-size:0.8em;
                width:100%;

                .option-item {
                  display:flex;
                }
              }


              .name {
                flex-grow:1;
                word-break:break-all;
              }
              .count {
                margin-left:12px;
              }
            } 
          }
        }
      }
    }
  }
  .container-foot {
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    width:100%;
    flex-shrink:0;
    .msg {
      display:flex;
      align-items: center;
      justify-content: center;
      width:100%;
      font-size:20px;
      height:60px;
    }
    .buttons {
      display:flex;
      align-items: center;
      justify-content: center;
      width:100%;
      .button {
        margin:0;
        display:flex;
        flex-grow:1;
        align-items: center;
        justify-content: center;
        height:60px;
        border-radius:100px;
        font-size:24px;
        font-weight:900;
        background-color:#ffffff;
        color:#202020;
        margin-left:24px;
      }
      .button:first-child {
        margin-left:0;
      }
      .button-commit {
        flex-grow:1;
        background-color:#ff0000;
        color:#ffffff;
      }
    }
  }
}
</style>
