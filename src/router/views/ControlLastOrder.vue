<template lang="pug">
.control-last-order-container
  p.control-last-order-container-title 타이머 관리(테스트)
  .wrap-delete-timer
    p.delete-timer-title 타이머 제거
    button.delete-timer-button(@click="removeTimer") 제거하기
  .wrap-message-setting
    p.message-setting-title 메세지 설정
    .message-setting-button-list
      button.message-setting-button(@click="setMessage('후 주방이 마감됩니다.', '주류 주문만 가능', 1)" :class="getActive(tabIndex, 1)") 후 주방이 마감됩니다. <br>주류 주문만 가능
      button.message-setting-button(@click="setMessage('기본 메세지 2', '종료 메세지 2', 2)" :class="getActive(tabIndex, 2)") 기본 메세지 2 <br>종료 메세지 2
      button.message-setting-button(@click="setMessage('기본 메세지 3', '종료 메세지 3', 3)" :class="getActive(tabIndex, 3)") 기본 메세지 3 <br>종료 메세지 3
  .wrap-time-setting
    p.time-setting-title 설정 시간
    .time-setting-button-list
      button.time-setting-button(@click="calMinute(5)") +5분
      button.time-setting-button(@click="calMinute(-5)") -5분
      button.time-setting-button(@click="calMinute(10)") +10분
      button.time-setting-button(@click="calMinute(-10)") -10분
      button.reset-button(@click="resetMinute()") 리셋
  p.wrap-alarm-time
    span.red-text {{minute}}분 
    span 뒤 메세지가 노출 됩니다.
  .wrap-confirm-button
    button.confirm-buttom(@click="confirm") 확인
</template>

<script>
export default {
  data: () => ({
    baseMessage: '',
    baseTabIndex: 0,
    endMessage: '',
    endTabIndex: 0,
    hour: 0,
    tabIndex: 0,
    minute: 0,
  }),
  methods: {
    setBaseMesage(msg, idx) {
      this.baseMessage = msg;
      this.baseTabIndex = idx;
    },
    setEndMessage(msg, idx) {
      this.endMessage = msg;
      this.endTabIndex = idx;
    },
    setMessage(baseMsg, endMsg, tabIndex) {
      this.baseMessage = baseMsg;
      this.endMessage = endMsg;
      this.tabIndex = tabIndex;
    },
    setHour(hour) {
      this.hour = hour;
    },
    calMinute(min) {
      if (this.minute + min < 0) return this.$store.commit('pushFlashMessage', '0분 보다 아래 일수 없습니다.');
      this.minute = this.minute + min;
    },
    resetMinute() {
      this.minute = 0;
    },
    getActive(target, idx) {
      if (target === idx) return 'button-black';
      return '';
    },
    // async setLastOrder() {
    //   const fd = new FormData();

    //   const { store_code } = this.$store.state.auth.store;
    //   fd.append('store_code', store_code);
    //   fd.append('base_message', this.baseMessage);
    //   fd.append('end_message', this.endMessage);

    //   const time = Date.now();
    //   const getHours = (h) => (h * 60 * 60 * 1000);
    //   const timestamp = this.$moment(time + getHours(this.hour)).valueOf();

    //   console.log('time', new Date(time + getHours(this.hour)));
    //   fd.append('time', timestamp);

    //   const response = await this.$store.dispatch('requestLastOrder', fd);
    //   // console.log(response);
    //   if (response.result) {
    //     this.$store.commit('pushFlashMessage', '라스트오더 설정이 완료 되었습니다.');
    //   }
    // },
    async setLastOrder() {
      const fd = new FormData();

      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('base_message', this.baseMessage);
      fd.append('end_message', this.endMessage);

      const time = Date.now();
      const getMinutes = (m) => (m * 60 * 1000);
      const timestamp = this.$moment(time + getMinutes(this.minute)).valueOf();

      console.log('time', new Date(timestamp), timestamp);
      fd.append('time', timestamp);

      const response = await this.$store.dispatch('requestLastOrder', fd);
      // console.log(response);
      if (response.result) {
        this.$store.commit('pushFlashMessage', `${new Date(timestamp).toLocaleString('ko-KR')} 시간 설정이 완료 되었습니다.`);
      }
    },
    async removeTimer() {
      const fd = new FormData();

      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('base_message', ' ');
      fd.append('end_message', ' ');
      fd.append('time', 0);

      const response = await this.$store.dispatch('requestLastOrder', fd);
      // console.log(response);
      if (response.result) {
        this.$store.commit('pushFlashMessage', '타이머 설정이 제거 되었습니다.');
      }
    },
    confirm() {
      const {
        baseMessage,
        endMessage,
        // hour,
        minute,
      } = this;

      if (!baseMessage) {
        return this.$store.commit('pushFlashMessage', '기본 메세지를 선택해 주세요');
      }

      if (!endMessage) {
        return this.$store.commit('pushFlashMessage', '종료 메세지를 선택해 주세요');
      }

      // if (!hour) {
      //   return this.$store.commit('pushFlashMessage', '마감 알림 시간을 선택해 주세요');
      // }

      if (!minute) {
        return this.$store.commit('pushFlashMessage', '마감 알림 시간을 선택해 주세요');
      }

      return this.setLastOrder();
    },
    cancel() {
      return this.$router.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.control-last-order-container {
  flex: 1;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .control-last-order-container-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 2.5vh 0 !important;
    box-sizing: border-box;
  }

  .wrap-delete-timer {
    .delete-timer-title {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
      color: #666;
      padding: 2.5vh 0 !important;
      box-sizing: border-box;
    }
    
    .delete-timer-button {
      width: 25.78125vw;
      height: 6.71875vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.875vw;
      color: #666;
      letter-spacing: -0.046875vw;
      background-color: #e5e5e5;
      border: none;
      border-radius: 1.015625vw;
    }
  }

  .wrap-message-setting {
    .message-setting-title {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
      color: #666;
      padding: 5vh 0 2.5vh !important;
      box-sizing: border-box;
    }

    .message-setting-button-list {
      display: flex;
      align-items: center;
      gap: 2.03125vw;

      .message-setting-button {
        width: 25.78125vw;
        height: 6.71875vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        color: #666;
        letter-spacing: -0.046875vw;
        background-color: #e5e5e5;
        border: none;
        border-radius: 1.015625vw;
      }

      .button-black {
        color: #fff;
        background-color: #12151d;
      }
    }
  }

  .wrap-time-setting {
    .time-setting-title {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
      color: #666;
      padding: 5vh 0 2.5vh !important;
      box-sizing: border-box;
    }

    .time-setting-button-list {
      display: flex;
      align-items: center;
      gap: 0.859375vw;

      > button {
        width: 15.625vw;
        height: 6.71875vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        color: #666;
        letter-spacing: -0.046875vw;
        background-color: #e5e5e5;
        border: none;
        border-radius: 1.015625vw;
      }

      .reset-button {
        color: #fc0000;
      }
    }
  }

  .wrap-alarm-time {
    width: 100%;
    margin: 9.5vh 0 2.5vh !important;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    font-size: 2.03125vw;
    letter-spacing: -0.05078125vw;
    text-align: center;

    .red-text {
      font-size: 3.125vw;
      font-weight: bold;
      letter-spacing: -0.078125vw;
      color: #fc0000;
    }
  }
  .wrap-confirm-button {
    width: 100%;
    text-align: center;
    .confirm-buttom {
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      width: 37.5vw;
      height: 4.53125vw;
      font-size: 2.03125vw;
      letter-spacing: -0.05078125vw;
      color: #fff;
      background-color: #fc0000;
      border: none;
      border-radius: 1.015625vw;
    }
  }
}

@media screen and (max-height: 710px){
  .control-last-order-container {
    .wrap-alarm-time {
      margin-top: 2.5vh !important;
    }
  }  
}
</style>
