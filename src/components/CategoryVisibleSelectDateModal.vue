<template lang="pug">
  .select-date-modal-container(@click.self="closeSearchModal")
    .wrap-select-date-modal
      .select-date-modal-title 날짜/시간별 조회
      .select-date-modal
        .select-date-modal-information
          .wrap-start-date
            p.select-date-title 시작일
            .select-date
              input.date(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('YYYY-MM-DD')" readonly v-on:click.stop="pickerSelectStartDate")
              .wrap-time
                input.time(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('HH')" readonly v-on:click.stop="pickerSelectStartHour")
                span 시
              .wrap-minute
                input.minute(type='text' name='' v-bind:value="$moment(searchOptions.datetime.start).format('mm')" readonly v-on:click.stop="pickerSelectStartMinute")
                span 분
          .wrap-end-date
            p.select-date-title 종료일
            .select-date
              input.date(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('YYYY-MM-DD')" readonly v-on:click.stop="pickerSelectEndDate")
              .wrap-time
                input.time(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('HH')" readonly v-on:click.stop="pickerSelectEndHour")
                span 시
              .wrap-minute
                input.minute(type='text' name='' v-bind:value="$moment(searchOptions.datetime.end).format('mm')" readonly v-on:click.stop="pickerSelectEndMinute")
                span 분
        .select-date-modal-calendar
          .wrap-select-time(v-if="['startHour', 'startMinute', 'endMinute', 'endHour'].includes(picker.selected)")
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
          .wrap-select-date(v-if="['startDate', 'enddate'].includes(picker.selected)")
            .select-date-header
              button.previous-button(@click.stop="pickerPrevMonth") &lt;
              span.date-information {{calendarYear}}년 {{calendarMonth}}월
              button.next-button(@click.stop="pickerNextMonth") &gt;
            .wrap-calendar
              .wrap-weekdays
                p.week(v-for="day in weekday" :key="day") {{day}}
              .calendar
                p.week(v-for="date in calendarFirstDayOfMonth")
                p.week(
                  v-for="date in calendarDaysInMonth"
                  :class="{'active': activeDate(date), 'deactivate': deactivateDate(date)}"
                  v-on:click.stop="pickerSelectDate(calendarYear, calendarMonth, date)"
                ) {{date}}
      .select-confirm-button
        button.confirm-button(@click="selectDateModalSubmit(searchOptions.datetime)") 선택완료
</template>

<script>
export default {
  name: 'SelectDateModal',
  props: {
    data: {
      type: Object,
    },
    selectDateModalSubmit: {
      type: Function,
    },
    closeSearchModal: {
      type: Function,
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
      activeButton: 'today',
      weekday: ['일', '월', '화', '수', '목', '금', '토'],
    };
  },
  methods: {
    activeDate(date) {
      return date == this.initialDate && this.calendarMonth == this.initialMonth && this.calendarYear == this.initialYear;
    },
    deactivateDate(date) {
      const today = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      return today < date && this.calendarMonth == currentMonth && this.calendarYear == currentYear;
    },
    pickerSelectButton(k) {
      let tmp = 0;

      if (k=='r') {
        tmp = this.picker.numberRefeshTemp;
      } else if (k=='d') {
        let number = this.picker.number;
        let stringNumber = String(number);
        stringNumber = stringNumber.substr(0, stringNumber.length -1);

        if (stringNumber.length<1) stringNumber =0;

        tmp = parseInt(stringNumber);
      } else if (parseInt(k)) {
        let number = this.picker.number;
        let stringNumber = String(number);

        stringNumber+=k;
        if (stringNumber.length > 2) {
          stringNumber = stringNumber.substr(stringNumber.length -2, stringNumber.length -1);

        }
        tmp = parseInt(stringNumber);
      }


      if (this.picker.selected == 'startHour' || this.picker.selected == 'endHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }


      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }

    },
    pickerUpNumber() {
      let tmp = this.picker.number;

      tmp = parseInt(tmp);
      tmp  += 1;

      if (this.picker.selected == 'startHour' || this.picker.selected == 'endHour') {
        if (tmp > 23) {
          tmp = 0;
        }
      } else {
        if (tmp > 59) {
          tmp = 0;
        }
      }

      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }
    },
    pickerDownNumber() {
      let tmp = this.picker.number;
      tmp = parseInt(tmp);

      tmp  -= 1;

      if (this.picker.selected == 'startHour' || this.picker.selected== 'endHour') {
        if (tmp < 0) {
          tmp = 23;
        }
      } else {
        if (tmp < 0) {
          tmp = 59;
        }
      }

      this.picker.number = tmp;

      if (this.picker.selected == 'startHour') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ hour: tmp });
      } else if (this.picker.selected == 'endHour') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ hour: tmp });
      } else if (this.picker.selected == 'startMinute') {
        this.searchOptions.datetime.start = this.$moment(this.searchOptions.datetime.start).set({ minute: tmp });
      } else if (this.picker.selected == 'endMinute') {
        this.searchOptions.datetime.end = this.$moment(this.searchOptions.datetime.end).set({ minute: tmp });
      }
    },
    pickerSelectStartHour() {
      let tmp = this.$moment(this.searchOptions.datetime.start).format('H');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startHour';
    },
    pickerSelectEndHour() {
      let tmp = this.$moment(this.searchOptions.datetime.end).format('H');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endHour';
    },
    pickerSelectStartMinute() {
      let tmp = this.$moment(this.searchOptions.datetime.start).format('m');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'startMinute';
    },
    pickerSelectEndMinute() {
      let tmp = this.$moment(this.searchOptions.datetime.end).format('m');
      this.picker.number = tmp;
      this.picker.numberRefeshTemp = tmp;
      this.picker.selected = 'endMinute';
    },
    pickerSelectStartDate() {
      this.picker.today = this.searchOptions.datetime.start;
      this.picker.context = this.searchOptions.datetime.start;
      this.picker.selected = 'startDate';
    },
    pickerSelectEndDate() {
      this.picker.today = this.searchOptions.datetime.end;
      this.picker.context = this.searchOptions.datetime.end;
      this.picker.selected = 'enddate';
    },
    pickerSelectDate(year, month, date) {
      if (!this.deactivateDate(date)) {
        this.activeButton = 'none';
        month = parseInt(month) - 1;
        if (this.picker.selected == 'startDate') {
          this.searchOptions.datetime.start = this.$moment([year, month, date]);
          if (this.searchOptions.datetime.start > this.searchOptions.datetime.end) {
            this.searchOptions.datetime.end = this.$moment({year, month, date, hour: 23, minute: 59});
          }
          this.picker.today = this.searchOptions.datetime.start;
        } else if (this.picker.selected == 'enddate') {
          this.searchOptions.datetime.end = this.$moment({year, month, date, hour: 23, minute: 59});
          if (this.searchOptions.datetime.start > this.searchOptions.datetime.end) {
            this.searchOptions.datetime.start = this.$moment([year, month, date]);
          }
          this.picker.today = this.searchOptions.datetime.end;
        }
      }
    },
    pickerPrevMonth() {
      this.picker.context = this.$moment(this.picker.context).subtract(1, 'months');
    },
    pickerNextMonth() {
      if(this.calendarMonth != new Date().getMonth() + 1) {
        this.picker.context = this.$moment(this.picker.context).add(1, 'months');
      }
    },
    activeSelectButton() {
      console.log(this.searchOptions.datetime.start, this.$moment({ hour:0, minute:0 }), 'te');
      if (this.searchOptions.datetime.start == this.$moment({ hour:0, minute:0 }) && this.searchOptions.datetime.end == this.$moment({ hour:24, minute:0 })) {
        return 'today';
      }
    }
  },
  computed: {
    calendarYear() {
      return this.picker.context.format('YYYY');
    },
    calendarMonth() {
      return this.picker.context.format('MM');
    },
    calendarDaysInMonth() {
      return this.picker.context.daysInMonth();
    },
    calendarFirstDayOfMonth: function () {
      let firstDay = this.$moment(this.picker.context).subtract((this.picker.context.get('date') - 1), 'days');
      return firstDay.weekday();
    },
    initialDate() {
      return this.picker.today.get('date');
    },
    initialMonth() {
      return this.picker.today.format('MM');
    },
    initialYear() {
      return this.picker.today.format('YYYY');
    },
  },
  mounted() {
    this.pickerSelectToday();
    this.searchOptions.datetime = this.data;
    this.pickerSelectStartDate();
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