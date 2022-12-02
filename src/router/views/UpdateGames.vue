<template lang="pug">
.update-categories-container
  p.update-categories-title 게임관리
  .main-categories
    .main-category(class="active") 게임설정
  .background-white
    .wrap-main-category-status
      p.main-category-status-title 게임 사용 여부
      .main-category-status-button
        button.main-category-status-visible(
          @click="() => {}"
          :style="getAbleButtonColor(true)"
        ) 사용
        button.main-category-status-unvisible(
          @click="() => {}"
          :style="getAbleButtonColor(false)"
        ) 사용안함
    .wrap-sub-category-status
      p.sub-category-status-title 게임별 사용 여부
      .wrap-sub-category-status-button
        .sub-category-status(
          v-for="(game, subIndex) in games"
          :key="game"
        )
          p.sub-category-name {{game}}
          .sub-category-status-button
            button.sub-category-status-visible(
              @click="() => {}"
              :style="getAbleButtonColor(true)"
            ) 표시
            button.sub-category-status-unvisible(
              @click="() => {}"
              :style="getAbleButtonColor(false)"
            ) 숨김
</template>

<script>
import { tableGame } from '@apis';

const {
  gameStoreInfo
} = tableGame;

export default {
  data() {
    return {
      games: ['악어게임', '양궁', '가위바위보', '동전먹기대결'],
      useGame: false,
    };
  },
  computed: {
  },
  async mounted() {
  },
  methods: {
    async reqGameStoreInfo() {
      try {
        const storeCode = this.$store.state.auth.store.store_code;
        const res = await gameStoreInfo(storeCode);

        if (res.data.resultCode === 200) {
          if (res.data.resultData.useTableGame) {
            this.useGame = true;
          } else {
            this.useGame = false;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    getAbleButtonColor(isOk) {
      if (isOk) {
        return {
          backgroundColor: 'black',
          color: 'white',
        };
      }

      return {
        backgroundColor: '#e5e5e5',
        color: '#666',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.update-categories-container {
  flex: 1;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  color:#ffffff;
  padding: 0.390625vw 0 0 !important;
  box-sizing: border-box;
  overflow: hidden;

  .update-categories-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 1.5625vw !important;
    color: #fff;
  }

  .main-categories {
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    max-width: 84.53125vw;
    overflow: auto;

    .main-category {
      font-size: 1.5625vw;
      color: #ddd;
      letter-spacing: -0.0390625vw;
      background-color: #404144;
      padding: 1.328125vw 1.5625vw !important;
      box-sizing: border-box;
      border-top-left-radius: 1.015625vw;
      border-top-right-radius: 1.015625vw;
      white-space:nowrap;
      word-break: keep-all;
    }

    .active {
      color: #000;
      font-weight: bold;
      background-color: #fff;
    }
  }

  .background-white {
    height: calc(100vh - 10.546875vw);
    background-color: #fff;
    box-sizing: border-box;
    overflow: auto;

    .wrap-main-category-status {
      padding: 2.34375vw !important;
      box-sizing: border-box;

      .main-category-status-title {
        color: #000;
        font-size: 1.5625vw;
        letter-spacing: -0.078125vw;
      }

      .main-category-status-button {
        margin-top: 1.5625vw !important;
        display: flex;
        align-items: center;
        gap: 0.781250vw;

        > button {
          width: 15.625vw;
          height: 4.6875vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.875vw;
          font-weight: bold;
          letter-spacing: -0.046875vw;
          border-radius: 1.015625vw;
          border: none;
          background-color: #e5e5e5;
          color: #666;
        }
      }

      .main-category-day-of-week {
        margin-top: 1.5625vw !important;
        display: flex;
        align-items: center;
        gap: 0.781250vw;

        .category-visible-time {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 0.0781vw solid #D3DCE6;
          width: 5.6937vw;
          height: 5.3325vh;
          border-radius: 0.3906vw;
          color: #000;
          font-size: 2vw;
        }

        > button {
          width: 4.1667vw;
          height: 3.4722vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.2500vw;
          font-weight: bold;
          letter-spacing: -0.046875vw;
          border-radius: 1.015625vw;
          border: none;
          background-color: #e5e5e5;
          color: #666;
        }

        > input {
          height: 3.3333vw;
          width: 5.6944vw;
          border: 0.0781vw solid #D3DCE6;
          box-sizing: border-box;
          border-radius: 0.3906vw;
        }

        .tilde {
          color: #000;
          font-style: normal;
          font-size: 2.4306vw;
          line-height: 1.6667vw;
          text-transform: capitalize;
        }

        .time-description {
          width: 50%;
          color: #929292;
          font-size: 0.9028vw;
        }
      }
    }

    .wrap-sub-category-status {
      padding: 2.34375vw !important;
      box-sizing: border-box;

      .sub-category-status-title {
        color: #000;
        font-size: 1.5625vw;
        letter-spacing: -0.078125vw;
      }

      .wrap-sub-category-status-button {
        margin-top: 1.5625vw !important;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        color: #000;
        display: grid;
        grid-template-columns: repeat(auto-fill, 19.375vw);
        gap: 0.78125vw;

        .sub-category-status {
          min-height: 11.71875vw;
          background-color: #f5f5f5;
          border: solid 0.078125vw #d6d6d6;
          border-radius: 0.78125vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .sub-category-name {
            flex: 1;
            font-size: 1.5625vw;
            font-weight: bold;
            letter-spacing: -0.078125vw;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.171875vw !important;
            box-sizing: border-box;
            word-break: break-all;
          }

          .sub-category-status-button {
            width: 100%;
            display: flex;
            gap: 0.78125vw;
            padding: 1.2890625vw 1.171875vw !important;
            box-sizing: border-box;

            > button {
              flex: 1;
              height: 3.125vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 1.40625vw;
              color: #666;
              border: none;
              border-radius: 0.390625vw;
              background-color: #e5e5e5;
            }
          }
        }
      }
    }

    .description {
      box-sizing: border-box;
      font-size: 0.9028vw;
      line-height: 1.0417vw;
      color: #929292;
    }
  }
}

</style>
