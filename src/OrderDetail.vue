<template lang="pug">
#orderDetail(v-if="show")
  .background
  .container
    .container-top 
      .order-title
        //.store_name {{order.store.name}}
        .table-number {{order.table.name}}
        .msg
          span.title(v-if="order.products[0].code=='99999'") 호출이요
          span.title(v-else-if="order.products[0].code=='88888'") 셋팅완료
          span.title(v-else) 주문이요
        .first(v-if="order.products[0].code!='88888'&&order.group.seq==1") 첫 주문
        .commit(:class="{commited:order.commit.time}") {{order.commit.time ? '확인' : '미확인'}}
        .time {{order.time | moment("A hh:mm:ss") }}
    .container-body
      .wrap-product-list
        ul.product-list
          li.product-item(v-for="product in order.products")
            .count {{product.qty}}개
            .name {{product.name}}
            .first(v-if="!(product.code in Object.keys(cumulative_products))") 첫 주문
            ul.option-list(v-if="product.options")
              li.option-item(v-for="option in product.options")
                span +
                .count {{option.qty}}개
                .name  {{option.name}}
      .wrap-c-product-list(v-if="Object.keys(cumulative_products).length")
        .title 이전주문내역
        ul.c-product-list
          li.order-item(v-for="c_product in cumulative_products")
            .name {{c_product.name}}
            .count {{c_product.qty}}개
            ul.option-list(v-if="c_product.options")
              li.option-item(v-for="option in c_product.options")
                span +
                .count {{option.qty}}개
                .name  {{option.name}}

    .container-foot
      .msg {{seconds}}초 후 닫혀요.
      .buttons
        .button.button-commit(v-on:click="commitOrder(order)") 확인
        .button.button(v-on:click="closeOrder") 닫기
</template>
<script>
import axios from 'axios';

export default {
  props: ['auth', 'orders'],
  data () {
    return {
      cumulative_products: {},
      order: {},
      show: false,
      interval: undefined,
      seconds: 10,
    }
  },
  methods: {
    commitOrder(order) {
      order.commit.time = parseInt(Date.now()/1000);
      console.log('commit order', order);

      this.$socket.emit('reqCommitOrder', order);

      this.closeOrder(); 
    },
    newOrder(order) {
      console.log('!newOrder', order);

      this.order = order;
      this.show = true;

      let code_group = this.order.group.code;
      let code_order = this.order.code;
      let time_current_order = this.order.time;
      let cumulative_products = {};

      let tmp_prev_seq = 0;

      //console.log('select', this.order.code);
      if (this.order.group.seq > 1) {
        for (let order of this.orders) {
          if (this.order.table.code == order.table.code && order.time < time_current_order) {
            if (tmp_prev_seq > 0 && tmp_prev_seq <= order.group.seq) {
              break
            }

            for (let product of order.products) {
              let tmp_code = [];
              tmp_code.push(product.code);

              if (product.hasOwnProperty('options')) {
                for(let option of product.options) {
                  tmp_code.push([option.code, option.qty].join(':'));
                }
              }
              product.new_code = tmp_code.join('-');

              console.log('!!!!new_code', product.new_code);

              if (cumulative_products[product.new_code]) {
                cumulative_products[product.new_code].qty += product.qty;
              } else {
                cumulative_products[product.new_code] = {
                  code: product.code, 
                  price: product.price,
                  name: product.name,
                  options: product.options,
                  first: product.first,
                  qty: product.qty,
                };
              }
            }

            tmp_prev_seq = order.group.seq;
          }
        }
      }

      this.cumulative_products = cumulative_products; 
      clearInterval(this.interval);
      this.seconds = 10;
      this.interval = setInterval(function(){
        this.seconds -= 1;
        console.log('seconds', this.seconds);

        if(this.seconds < 1) {
          this.closeOrder();
        } 
      }.bind(this), 1000);
    },
    closeOrder() {
      clearInterval(this.interval);
      this.show = false;
      this.$eventBus.$emit('closeOrder'); 
    },
  },
  created() {
    console.log('created newOrder');
    this.$eventBus.$off("newOrder");
    this.$eventBus.$on('newOrder', this.newOrder); 
    //this.$eventBus.$on('openOrder', this.openOrder); 
  },
  beforeDestroy() {
    //this.$eventBus.$off("openOrder");
  },
}

</script>
<style lang="scss">
@import "./scss/global.scss";

#orderDetail {
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
            word-break:break-all;
            align-items: center;
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
      .wrap-c-product-list {
        display:flex;
        flex-direction:column;
        //margin-left:24px;
        //margin-bottom:24px;
        flex-shrink:1;
        flex-grow:1;
        padding-left:24px;
        //border-left:solid 1px #808080;
        max-width:40%;

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
