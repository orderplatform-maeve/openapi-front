<template lang="pug">
  .serving-robot-management-container
    p.control-order-page-title 로봇제어(테스트)
    .robot-list
      .wrap-robot-status(
        v-for="(robotStatus, index) in allRobotStatus"
        :key="`robot-status-${index}`"
      )
        .wrap-robot-name
          p.robot-brand-name
            img(:src="getRobotImage(robotStatus)")
          p.robot-nickname {{getRobotName(robotStatus)}}
        p.robot-status
          span.default(v-if="getRobotStatus(robotStatus)") {{getRobotStatus(robotStatus)}}
          span.red(v-else) 확인필요
        p.table-number
          span.default(v-if="getRobotPosition(robotStatus)") {{getRobotPosition(robotStatus)}}
          span.red(v-else) -
        .wrap-serving-status
          p.serving-status {{getRobotCommandText(robotStatus)}}
    serving-robot-start-modal(v-if="false")
    serving-robot-cancel-modal(v-if="false")
    serving-robot-back-modal(v-if="false")
    serving-robot-error-modal(v-if="false")
</template>

<script>
import {
  servingRobot
} from '@apis';

const {
  requestRobotStatus,
} = servingRobot;

import {
  ServingRobotStartModal,
  ServingRobotCancelModal,
  ServingRobotBackModal,
  ServingRobotErrorModal,
} from '@components';

export default {
  components: {
    ServingRobotStartModal,
    ServingRobotCancelModal,
    ServingRobotBackModal,
    ServingRobotErrorModal,
  },
  data() {
    return {
      allRobotStatus: [],
    };
  },
  computed: {
    storeCode() {
      return this.$store.state.auth.store.code;
    },
  },
  methods: {
    async getAllServingRobotStatus(storeCode) {
      try {
        const request = await requestRobotStatus(storeCode);
        const data = request.data.result;

        if (data) {
          this.allRobotStatus = data;
        }
      } catch {
        console.log('로봇 상태 불러오기 에러');
      }
    },
    getRobotName(robot) {
      const robotName = robot.name;
      const robotType = robot.type;

      if (!robotName && !robotType) {
        return '';
      }

      return robotName ? robotName : robotType;
    },
    getRobotImage(robot) {
      const robotType = robot.type;

      if (robotType && robotType === "LGSR") {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/lgcloi.png';
      }

      return "https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torderNoImage.PNG";
    },
    getRobotStatus(robot) {
      const robotInfo = JSON.parse(robot.rinfo);
      const robotStatus = robotInfo.status;

      if (robotStatus === 'Unknown') {
        return false;
      }

      if (robotStatus === 'Ready') {
        return '대기중';
      }

      return true;
    },
    getRobotPosition(robot) {
      const robotInfo = JSON.parse(robot.rinfo);
      const robotPosition = robotInfo.destination;

      if (!robotPosition) {
        return false;
      }

      if (robotPosition === 'homepoi') {
        return '-';
      }
    },
    getRobotCommandText(robot) {
      const robotStatus = this.getRobotStatus(robot);

      if (robotStatus === '대기중') {
        return '서빙 진행';
      }

      return '로봇 상태 확인';
    }
  },
  mounted() {
    const code = 'TOD_TEST';

    this.getAllServingRobotStatus(code);
  }
};
</script>

<style lang="scss" scoped>
.serving-robot-management-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .control-order-page-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 2.5vh 0 !important;
    box-sizing: border-box;
  }

  .robot-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5625vw;

    .wrap-robot-status {
      width: 100%;
      min-height: 12.5vw;
      border: solid 0.125vw #000;
      border-radius: 1.953125vw;
      display: flex;
      align-items: center;
      gap: 3.90625vw;
      padding: 1.5625vw !important;
      box-sizing: border-box;
      text-align: center;

      .wrap-robot-name {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.78125vw;
        font-family: "notosans";
        font-size: 1.4vw;
        text-align: center;

        .robot-brand-name {
          width: 100%;

          img {
            width: 50%;
            object-fit: contain;
          }
        }
      }

      .robot-status {
        width: 11.71875vw;
        font-family: "notosans";
        font-size: 2.5vw;
      }

      .table-number {
        flex: 1;
        font-family: "notosans";
        font-size: 2.5vw;
        text-align: center;
      }

      .wrap-serving-status {
        display: flex;
        justify-content: center;
        align-items: center;

        .serving-status {
          width: 13.28125vw;
          background-color: #fc0000;
          padding: 0.78125vw !important;
          font-family: "notosans";
          font-size: 1.953125vw;
          font-weight: bold;
          color: #fff;
          text-align: center;
          border-radius: 0.78125vw;
          box-sizing: border-box;
        }
      }
    }

    .red {
      font-weight: bold;
      color: #fc0000;
    }
  }
}
</style>