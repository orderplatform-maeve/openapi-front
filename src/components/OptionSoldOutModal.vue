<template lang="pug">
.option-sold-out-modal-container
  option-save-check-modal(
    v-if="optionSaveCheckModalFlag"
    :changedOptionSaveConfirmAndSubmit="changedOptionSaveConfirmAndSubmit"
    :changedOptionSaveCancel="changedOptionSaveCancel"
    :goodsName="goodsName"
    )
  .close-bt(@click="closeOptionSoldOutModal")
    close-icon
    span.close-text 닫기
  .wrap-option-sold-out-modal
    div.modal-title 옵션 상태 변경
    div.option-groups-wrap
      div(
        v-for="(option, optionIndex) in deepCopyOptions"
        :key="`option-${option.name}-${optionIndex}`"
        :class="getOptionGroupBoxStyle(option.require_flag)"
        )
        div.require-wrap(v-if="option.require_flag")
          div.require-badge 필수옵션
          div.require-text 최소 {{option.limit_select}}개 이상 판매 해야 주문이 가능합니다!
        div.option-group-name {{option.name}}
        div.option-item-wrap
          div.option-item-box(
            v-for="(item, itemIndex) in option.option_items"
            :key="`option-item-${item.code}-${itemIndex}`"
            )
            span.option-item-name {{item.name}}
            div.sales-box
              button(
                :class="getSalesBtStyle(item.isSale)"
                @click="onClickSalesBt(optionIndex, itemIndex)"
                ) 판매
              button(
                :class="getSoldOutBtStyle(item.isSale)"
                @click="onClickSoldOutBt(optionIndex, itemIndex)"
                ) 품절
    div.save-bt-wrap
      button.option-setting-save-bt(@click="changedOptionSaveAndCheck") 저장
</template>

<script>
import { CloseIcon } from '@svg';
import _ from 'lodash';
import { goods } from '@apis';

const { postOptionSaleOffCheck, postOptionSaleOffSubmit } = goods;


export default {
  data() {
    return {
      deepCopyOptions: [],
      optionSaveCheckModalFlag: false,
    };
  },
  props: {
    options: {
      type: Array,
    },
    closeOptionSoldOutModal: {
      type: Function,
    },
    goodsName: {
      type: String,
    },
    goodsCode: {
      type: String,
    },
    initialize: {
      type: Function,
    }
  },
  components: {
    CloseIcon,
  },
  computed: {
    getStoreCode() {
      return this.$store.state.auth.store.store_code;
    },
  },
  methods: {
    // 필수 값에 따른 그룹 테두리 스타일
    getOptionGroupBoxStyle(require_flag) {
      return {
        'option-group-box': true,
        'require-option-group-box' : require_flag,
      };
    },
    // 판매 버튼 동적 스타일
    getSalesBtStyle(isSale) {
      return {
        'deactivate-bt': true,
        'sales-active': isSale,
      };
    },
    // 품절 버튼 동적 스타일
    getSoldOutBtStyle(isSale) {
      return {
        'deactivate-bt': true,
        'sold-out-active': !isSale,
      };
    },
    // 판매 클릭
    onClickSalesBt(optionIndex, itemIndex) {
      const thisIsSale = this.deepCopyOptions[optionIndex].option_items[itemIndex].isSale;
      if (!thisIsSale) {
        this.deepCopyOptions[optionIndex].option_items[itemIndex].isSale = 1;
      }
    },
    // 품절 클릭
    onClickSoldOutBt(optionIndex, itemIndex) {
      const thisIsSale = this.deepCopyOptions[optionIndex].option_items[itemIndex].isSale;
      if (thisIsSale) {
        this.deepCopyOptions[optionIndex].option_items[itemIndex].isSale = 0;
      }
    },

    // 체크 후 진짜 저장하기
    async changedOptionSaveConfirmAndSubmit() {
      try {
        const config = {
          storeCode: this.getStoreCode,
          goodCode: this.goodsCode,
          options: this.deepCopyOptions,
        };

        const res = await postOptionSaleOffSubmit(config);

        if (res.data.result) {
          // 성공적으로 저장하면 플래쉬메세지 노출 및 모달 닫기
          this.$store.commit('pushFlashMessage', '옵션 상태를 변경했습니다.');
          this.optionSaveCheckModalFlag = false;
          this.closeOptionSoldOutModal();
          this.initialize();
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 저장 클릭 시 필수 옵션 limit 체크
    async changedOptionSaveAndCheck() {
      try {
        const config = {
          storeCode: this.getStoreCode,
          goodCode: this.goodsCode,
          options: this.deepCopyOptions,
        };
        const res = await postOptionSaleOffCheck(config);

        if (res.data.result) {
          // 서버 응답 중 하나라도 result: false면 경고 모달 띄우기
          const result = res.data.data.find((data) => { return data.result === false; });
          if (result === undefined) {
            await this.changedOptionSaveConfirmAndSubmit();
          } else {
            this.optionSaveCheckModalFlag = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 실제로 저장할건지 묻는 모달 닫기
    changedOptionSaveCancel() {
      this.optionSaveCheckModalFlag = false;
    },
  },
  mounted() {
    // 깊은 복사
    this.deepCopyOptions = _.cloneDeep(this.options);
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
    top: 1.5625vw;
    right: 1.5625vw;
    width: 11.4063vw;
    height: 5vw;
    border-radius: 2.5vw;
    background-color: #fff;
    color: #000;
    font-size: 2.3438vw;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-text {
      margin-left: 0.7813vw !important;
      letter-spacing: -0.0586vw;
      font-weight: 500;
    }
  }

  .wrap-option-sold-out-modal {
    width: 82.3438vw;
    height: 51.8750vw;
    background-color: #111;
    border-radius: 1.5625vw;
    box-sizing: border-box;
    border: 0.1563vw solid #666;
    padding: 2.3438vw 1.5625vw !important;
    box-sizing: border-box;

    .modal-title {
      font-size: 1.8750vw;
      font-weight: 500;
      margin-bottom: 1.5625vw !important;
    }

    .option-groups-wrap {
      height: 36.4063vw;
      overflow: scroll;
      margin-bottom: 2.3438vw !important;
      display: flex;
      flex-direction: column;
      gap: 0.3906vw;

      .option-group-box {
        padding: 1.5625vw !important;
        border-radius: 0.7813vw;
        border: none;

        .option-group-name {
          font-size: 1.5625vw;
          letter-spacing: -0.0781vw;
          margin-bottom: 0.7813vw !important;
        }

        .option-item-wrap {
          display: flex;
          gap: 0.7813vw;
          flex-wrap: wrap;

          .option-item-box {
            width: 18.2813vw;
            min-height: 10.4688vw;
            display: flex;
            flex-direction: column;
            gap: 2.0313vw;
            padding: 2.1875vw 1.1719vw 1.1719vw 1.1719vw !important;
            border-radius: 0.7813vw;
            background-color: #292929;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;

            .option-item-name {
              font-size: 1.5625vw;
              font-weight: 500;
              letter-spacing: -0.0391vw;
            }

            .sales-box {
              display: flex;
              gap: 0.4688vw;

              .deactivate-bt {
                width: 7.8125vw;
                height: 3.1250vw;
                border-radius: 0.3906vw;
                background-color: #404144;
                color: #aaa;
                font-size: 1.5625vw;
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

        .require-wrap {
          display: flex;
          margin: -1.5625vw 0 0.7813vw -1.5625vw !important;
          align-items: center;
          gap: 0.7813vw;

          .require-badge {
            width: 7.8125vw;
            height: 3.1250vw;
            background-color: #fc0000;
            border-top-left-radius: 0.7813vw;
            border-bottom-right-radius: 0.7813vw;
            font-size: 1.4063vw;
            font-weight: 500;
            letter-spacing: -0.0703vw;
            line-height: 3.1250vw;
            text-align: center;
          }

          .require-text {
            font-size: 1.4063vw;
            font-weight: 500;
            letter-spacing: -0.0703vw;
            color: #fc0000;
          }
        }


      }

      .require-option-group-box {
        border: 0.0781vw solid #fc0000;
      }
    }

    .save-bt-wrap {
      display: flex;
      align-items: center;
      justify-content: center;

      .option-setting-save-bt {
        width: 37.5vw;
        height: 4.5313vw;
        border-radius: 1.0156vw;
        background-color: #fc0000;
        border: none;
        color: #fff;
        font-size: 2.0313vw;
        font-weight: 500;
      }
    }
  }
}
</style>