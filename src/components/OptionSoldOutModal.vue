<template lang="pug">
.option-sold-out-modal-container
  .close-bt
    close-icon
    span.close-text(@click="closeOptionSoldOutModal") 닫기
  .wrap-option-sold-out-modal
    div.modal-title 옵션 상태 변경
    div.option-groups-wrap
      div.option-group-box(
        v-for="(option, index) in options"
        :key="`option-${option.name}-${index}`"
        )
        div(v-if="option.require_flag") 필수선택
        div.option-group-name {{option.name}}
        div.option-item-wrap
          div.option-item-box(
            v-for="(item, index) in option.option_items"
            :key="`option-item-${item.code}-${index}`"
            )
            span.option-item-name 밀떡
            div.sales-box
              button.deactivate-bt.sales-active 판매
              button.deactivate-bt.sold-out-active 품절
    div.save-bt-wrap
      button.option-setting-save-bt 저장
</template>

<script>
import { CloseIcon } from '@svg';
export default {
  data() {
    return {

    };
  },
  props: {
    options: {
      type: Array,
    },
    closeOptionSoldOutModal: {
      type: Function,
    }
  },
  components: {
    CloseIcon
  },
  computed: {
    // optionSoldOutModalFlag() {
    //   const optionSoldOutModal = this.$store.state.optionSoldOutModal;
    //   return optionSoldOutModal;
    // }
  },
  methods: {

  },
  mounted() {
    console.log('options', this.options);

  },
};

</script>

<style lang="scss" scoped>
.option-sold-out-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375vw;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.7);

  .close-bt {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 146px;
    height: 64px;
    border-radius: 32px;
    background-color: #fff;
    color: #000;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-text {
      margin-left: 10px !important;
      letter-spacing: -0.75px;
      font-size: 30px;
      font-weight: 500;
    }
  }

  .wrap-option-sold-out-modal {
    width: 1054px;
    height: 664px;
    background-color: #111;
    border-radius: 1.5625vw;
    box-sizing: border-box;
    border: 2px solid #666;
    padding: 30px 20px !important;
    box-sizing: border-box;

    .modal-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 20px !important;
    }

    .option-groups-wrap {
      height: 466px;
      overflow: scroll;
      margin-bottom: 30px !important;

      .option-group-box {
        padding: 20px !important;
        border-radius: 10px;
        border: 1px solid #fff;

        .option-group-name {
          font-size: 20px;
          letter-spacing: -1px;
          margin-bottom: 10px !important;
        }

        .option-item-wrap {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;

          .option-item-box {
            width: 234px;
            min-height: 134px;
            display: flex;
            flex-direction: column;
            gap: 26px;
            padding: 28px 15px 15px 15px !important;
            border-radius: 10px;
            background-color: #292929;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;

            .option-item-name {
              font-size: 20px;
              font-weight: 500;
              letter-spacing: -0.5px;
            }

            .sales-box {
              display: flex;
              gap: 6px;

              .deactivate-bt {
                width: 100px;
                height: 40px;
                border-radius: 5px;
                background-color: #404144;
                color: #aaa;
                font-size: 20px;
                border: none;
              }

              .sales-active {
                background-color: #fff;
                color:#000;
                font-weight: bold;
              }

              .sold-out-active {
                background-color: #000;
                color: #fc0000;
                font-weight: bold;
              }
            }
          }
        }


      }
    }

    .save-bt-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      .option-setting-save-bt {
        width: 480px;
        height: 58px;
        border-radius: 13px;
        background-color: #fc0000;
        border: none;
        color: #fff;
        font-size: 26px;
        font-weight: bold;
      }
    }
  }
}
</style>