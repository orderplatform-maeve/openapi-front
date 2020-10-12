<template lang="pug">
.top-container
  .title 타이머 제거
  .justifyBetween
    .button(@click="removeTimer") 제거하기
  .title 기본 메세지 설정
  .justifyBetween
    .button(@click="setBaseMesage('기본 메세지 1', 1)" :class="getActive(baseTabIndex, 1)") 기본 메세지 1
    .button(@click="setBaseMesage('기본 메세지 2', 2)" :class="getActive(baseTabIndex, 2)") 기본 메세지 2
    .button(@click="setBaseMesage('기본 메세지 3', 3)" :class="getActive(baseTabIndex, 3)") 기본 메세지 3
  .title 종료 메세지 설정
  .justifyBetween
    .button(@click="setEndMessage('종료 메세지 1', 1)" :class="getActive(endTabIndex, 1)") 종료 메세지 1
    .button(@click="setEndMessage('종료 메세지 2', 2)" :class="getActive(endTabIndex, 2)") 종료 메세지 2
    .button(@click="setEndMessage('종료 메세지 3', 3)" :class="getActive(endTabIndex, 3)") 종료 메세지 3
  .title 마감 알림 시간 설정
  .justifyBetween
    .button(@click="setHour(1)" :class="getActive(hour, 1)") 1 시간 뒤
    .button(@click="setHour(2)" :class="getActive(hour, 2)") 2 시간 뒤
    .button(@click="setHour(3)" :class="getActive(hour, 3)") 3 시간 뒤
  .justifyBetween
    .button(@click="confirm") 확인
    //- .button.button-cancel(@click="cancel") 취소
</template>

<script>
export default {
  data: () => ({
    baseMessage: '',
    baseTabIndex: 0,
    endMessage: '',
    endTabIndex: 0,
    hour: 0,
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
    setHour(hour) {
      this.hour = hour;
    },
    getActive(target, idx) {
      if (target === idx) return 'button-red';
      return '';
    },
    async setLastOrder() {
      const fd = new FormData();

      const { store_code } = this.$store.state.auth.store;
      fd.append('store_code', store_code);
      fd.append('base_message', this.baseMessage);
      fd.append('end_message', this.endMessage);

      const time = Date.now();
      const getHours = (h) => (h * 60 * 60 * 1000);
      const utcTimestamp = this.$moment.utc(time + getHours(this.hour)).valueOf();

      console.log('time', new Date(time + getHours(this.hour)), this.$moment.utc(time + getHours(this.hour)).format('MM.DD HH:mm:ss'));
      fd.append('time', utcTimestamp);

      const response = await this.$store.dispatch('requestLastOrder', fd);
      // console.log(response);
      if (response.result) {
        this.$store.commit('pushFlashMessage', '라스트오더 설정이 완료 되었습니다.');
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
        hour,
      } = this;

      if (!baseMessage) {
        return this.$store.commit('pushFlashMessage', '기본 메세지를 선택해 주세요');
      }

      if (!endMessage) {
        return this.$store.commit('pushFlashMessage', '종료 메세지를 선택해 주세요');
      }

      if (!hour) {
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
.top-container {
  display: flex;
  flex-direction: column;
  padding: 28px;
  flex-grow: 0;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;

  .title {
    font-size: 36px;
    margin-bottom: 16px;
  }
  .justifyBetween {
    display: flex;
    justify-content: space-between;

    .button {
      margin:0;
      display:flex;
      flex-grow:1;
      align-items: center;
      justify-content: center;
      height:60px;
      border-radius:100px;
      font-size:28px;
      font-weight:900;
      background-color:#ffffff;
      color:#202020;
      margin-right:24px;
      box-shadow: 0 0 8px -4px #000000;
      padding: 0px 12px 0px 12px;
      margin-bottom: 24px;
    }

    .button-red {
      background-color: #ff0000;
      color: #fff;
    }

    .button-cancel {
      background-color:#484848;
      color: #fff;
    }
  }
}
</style>
