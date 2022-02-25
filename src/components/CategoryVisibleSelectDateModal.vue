<template lang="pug">
  .select-date-modal-container(@click.self="closeModal")
    .wrap-select-date-modal
      .select-date-modal-title 노출 시간 선택
      .select-date-modal
        .select-date-modal-information
          .wrap-start-date
            p.select-date-title 시작 시간
            .select-date
              .wrap-time
                input.time(type='text' name='' v-bind:value="categoryVisibleTime.startHour" readonly v-on:click.stop="pickerSelectStartHour")
                span 시
              .wrap-minute
                input.minute(type='text' name='' v-bind:value="categoryVisibleTime.startMinute" readonly v-on:click.stop="pickerSelectStartMinute")
                span 분
          .wrap-end-date
            p.select-date-title 종료 시간
            .select-date
              .wrap-time
                input.time(type='text' name='' v-bind:value="categoryVisibleTime.endHour" readonly v-on:click.stop="pickerSelectEndHour")
                span 시
              .wrap-minute
                input.minute(type='text' name='' v-bind:value="categoryVisibleTime.endMinute" readonly v-on:click.stop="pickerSelectEndMinute")
                span 분
        .select-date-modal-calendar
          .wrap-select-time
            .select-time-header
              button.time-minus-button(@click.stop="pickerDownNumber") -
              span.time-information {{picker.number}}
              button.time-plus-button(@click.stop="pickerUpNumber") +
            .number-button-list
              button.number-button(v-for="number in 9" :key="'number-'+number" @click.stop="pickerSelectButton(number)") {{number}}
              button.reset-button(@click.stop="pickerSelectButton('r')")
                icon-refresh-black-icon
              button.number-button(@click.stop="pickerSelectButton(0)") 0
              button.delete-button(@click.stop="pickerSelectButton('d')")
                icon-delete-icon
      .select-confirm-button
        button.confirm-button(@click="selectDateModalSubmit()") 설정완료
</template>

<script>
export default {
  name: 'CategoryVisibleSelectDateModal',
  props: {
    selectDateModalSubmit: {
      type: Function,
    },
    closeModal: {
      type: Function,
    },
    categoryVisibleTime : {
      type : Object
    }
  },
  data() {
    return {
      searchOptions: {
        datetime: {
          start: new Date(),
          end: new Date(),
        },
      },
      picker: {
        today: null,
        context: null,
        number: null,
        numberRefeshTemp: null,
        selected: 'start',
      },
      cloneDate : {}
    };
  },
  methods: {
    pickerSelectButton(k) {
      if (this.picker.selected === 'start') {
        return;
      }
      console.log('k', k);
      let tmp = 0;

      if (k=='r') {
        tmp = this.picker.numberRefeshTemp;
      } else if (k=='d') {
        let number = this.picker.number;
        let stringNumber = String(number);
        stringNumber = stringNumber.substr(0, stringNumber.length -1);

        if (stringNumber.length < 1) stringNumber = 0;

        tmp = parseInt(stringNumber);
      } else if (parseInt(k) | k === 0) {
        let number = this.picker.number;
        let stringNumber = String(number);

        stringNumber += k;

        if (stringNumber.length > 2) {
          stringNumber = stringNumber.substr(stringNumber.length -2, stringNumber.length -1);
        }

        tmp = parseInt(stringNumber);
      }

      if (this.picker.selected == 'startHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      if (this.picker.selected == 'endHour') {
        if (tmp > 30) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      this.picker.number = tmp;

      if (this.picker.number < 10) {
        tmp = `0${this.picker.number}`;
      }

      if (this.picker.selected == 'startHour') {
        this.categoryVisibleTime.startHour = tmp;
      } else if (this.picker.selected == 'endHour') {
        this.categoryVisibleTime.endHour = tmp;
      } else if (this.picker.selected == 'startMinute') {
        this.categoryVisibleTime.startMinute = tmp;
      } else if (this.picker.selected == 'endMinute') {
        this.categoryVisibleTime.endMinute = tmp;
      }
    },
    pickerUpNumber() {
      if (this.picker.selected === 'start') {
        return;
      }
      let tmp = this.picker.number;

      tmp = parseInt(tmp);
      tmp  += 1;

      if (this.picker.selected == 'startHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      if (this.picker.selected == 'endHour') {
        if (tmp > 30) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      this.picker.number = tmp;

      if (this.picker.number < 10) {
        tmp = `0${this.picker.number}`;
      }

      if (this.picker.selected == 'startHour') {
        this.categoryVisibleTime.startHour = tmp;
      } else if (this.picker.selected == 'endHour') {
        this.categoryVisibleTime.endHour = tmp;
      } else if (this.picker.selected == 'startMinute') {
        this.categoryVisibleTime.startMinute = tmp;
      } else if (this.picker.selected == 'endMinute') {
        this.categoryVisibleTime.endMinute = tmp;
      }
    },
    pickerDownNumber() {
      if (this.picker.selected === 'start') {
        return;
      }
      let tmp = this.picker.number;
      tmp = parseInt(tmp);

      tmp  -= 1;

      if (this.picker.selected == 'startHour') {
        if (tmp < 0) {
          tmp = 23;
        }
      } else {
        if (tmp < 0) {
          tmp = 59;
        }
      }

      console.log(tmp);

      if (this.picker.selected == 'endHour') {
        if (tmp > 30) {
          tmp = 0;
        }
      } else {
        if (tmp < 0) {
          tmp = 59;
        }
      }

      this.picker.number = tmp;

      if (this.picker.number < 10) {
        tmp = `0${this.picker.number}`;
      }

      if (this.picker.selected == 'startHour') {
        this.categoryVisibleTime.startHour = tmp;
      } else if (this.picker.selected == 'endHour') {
        this.categoryVisibleTime.endHour = tmp;
      } else if (this.picker.selected == 'startMinute') {
        this.categoryVisibleTime.startMinute = tmp;
      } else if (this.picker.selected == 'endMinute') {
        this.categoryVisibleTime.endMinute = tmp;
      }
    },
    pickerSelectStartHour() {
      let tmp = this.categoryVisibleTime.startHour;
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startHour';
    },
    pickerSelectEndHour() {
      let tmp = this.categoryVisibleTime.endHour;
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endHour';
    },
    pickerSelectStartMinute() {
      let tmp = this.categoryVisibleTime.startMinute;
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startMinute';
    },
    pickerSelectEndMinute() {
      let tmp = this.categoryVisibleTime.endMinute;
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endMinute';
    },
  },
  computed: {
    //
  },
  mounted() {
    this.searchOptions.datetime = this.data;
  }
};
</script>

<style lang="scss" scoped>
.select-date-modal-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1;

  .wrap-select-date-modal {
    width: 85.3125vw;
    padding: 3.125vw 3.125vw 1.5625vw !important;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 1.5625vw;
    color:#000;

    .select-date-modal-title {
      font-size: 1.5625vw;
      letter-spacing: -0.0390625vw;
    }

    .select-date-modal {
      margin-top: 1.5625vw !important;
      display: flex;
      justify-content: space-between;

      .select-date-modal-information {
        flex: 1;
        padding-right: 1.5625vw !important;
        border-right: solid 0.078125vw #ccc;
        box-sizing: border-box;

        .select-date-button-list {
          display: flex;
          align-items: center;
          gap: 0.78125vw;

          > button {
            flex: 1;
            height: 4.6875vw;
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.875vw;
            color: #666;
            letter-spacing: -0.046875vw;
            background-color: #e5e5e5;
            border: none;
            border-radius: 1.015625vw;
          }

          .activeButton {
            background-color: #12151d;
            font-weight: bold;
            color: #fff
          }
        }

        .wrap-start-date,
        .wrap-end-date {
          margin-top: 3.90625vw !important;

          .select-date-title {
            font-size: 1.875vw;
            letter-spacing: -0.046875vw;
            margin-bottom: 0.78125vw !important;
          }

          .select-date {
            display: flex;
            align-items: center;
            gap: 0.78125vw;

            .date,
            .time,
            .minute {
              width: 12.734375vw;
              height: 4.375vw;
              font-size: 1.71875vw;
              letter-spacing: -0.04296875vw;
              text-align: center;
              border: solid 0.078125vw #373737;
              border-radius: 0.390625vw;
              box-sizing: border-box;
            }

            .wrap-time,
            .wrap-minute {
              display: flex;
              align-items: center;
              gap: 0.78125vw;
              font-size: 1.875vw;
              letter-spacing: -0.046875vw;

              .time,
              .minute {
                width: 5.46875vw;
              }
            }

            input:focus {
              border: solid 0.15625vw #fc0000;;
              outline: unset;
              font-weight: bold;
            }
          }
        }

        .wrap-end-date {
          margin-top: 2.34375vw !important
        }
      }

      .select-date-modal-calendar {
        flex: 1;
        padding-left: 1.5625vw !important;
        box-sizing: border-box;

        .wrap-select-time {
          padding: 0 6.71875vw !important;
          box-sizing: border-box;

          .select-time-header {
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 3.125vw;
            font-weight: bold;
            letter-spacing: -0.15625vw;

            > button {
              font-family: unset;
              width: 3.28125vw;
              height: 3.28125vw;
              font-size: 3.125vw;
              font-weight: lighter;
              background-color: unset;
              display: flex;
              justify-content: center;
              align-items: center;
              border: solid 0.078125vw #000;
              box-sizing: border-box;
              border-radius: 50%;
              padding: unset !important;
            }
          }

          .time-information {
            width: 3.515625vw;
            text-align: center;
          }

          .number-button-list {
            margin-top: 1.796875vw !important;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: center;
            gap: 1.5625vw;

            .number-button,
            .reset-button,
            .delete-button {
              margin: 0 auto !important;
              width: 5.9375vw;
              height: 5.9375vw;
              font-size: 2.8125vw;
              background-color: #f5f5f5;
              border: solid 0.078125vw #dcdcdc;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: unset !important;
            }
          }
        }

        .wrap-select-date {
          .select-date-header {
            margin: 0 auto !important;
            width: 21.875vw;
            display: flex;
            justify-content: space-between;
            align-items: center;

            > button {
              width: 3.28125vw;
              height: 3.28125vw;
              font-family: unset;
              font-size: 1.5625vw;
              font-weight: bold;
              background-color: unset;
              border: solid 0.078125vw #000;
              border-radius: 50%;
            }

            .date-information {
              font-size: 1.875vw;
            }
          }

          .wrap-calendar {
            width: 100%;

            .wrap-weekdays,
            .calendar {
              display: grid;
              grid-template-columns: repeat(7, 4.140625vw);
              grid-template-rows: repeat(auto-fill, 4.140625vw);
              justify-content: center;
              align-items: center;
              gap: 0.78125vw;

              .week {
                height: 4.140625vw;
                font-family: "notosans";
                font-size: 1.40625vw;
                color: #999;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }

            .calendar {
              margin-top: 1.171875vw !important;
              height: 28.75vw;

              .week {
                font-family: 'Spoqa Han Sans Neo', 'sans-serif';
                font-size: 1.875vw;
                color: #000;
                border-radius: 50%;
              }

              .active {
                color: #fff;
                background-color: #000;
              }

              .deactivate {
                color: #ccc !important;
              }
            }
          }
        }
      }
    }
    .select-confirm-button {
      margin-top: 3.828125vw !important;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .confirm-button {
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 2.03125vw;
        font-weight: bold;
        letter-spacing: -0.05078125vw;
        color: #fff;
        width: 37.5vw;
        height: 4.53125vw;
        background-color: #fc0000;
        border: none;
        border-radius: 1.015625vw;
      }
    }
  }
}
</style>