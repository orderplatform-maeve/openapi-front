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
          .wrap-battery-status
            p.battery-stats-text {{getBatteryText(robotStatus)}}
            img.battery-status(:src="getBatteryImage(robotStatus)")
          p.serving-status(@click="visibleModal(robotStatus)") {{getRobotCommandText(robotStatus)}}
    serving-robot-start-modal(
      v-if="selectStartRobotModalStatus"
      :sortedTables="startTableList"
      :selectedTable="startRobotSelectedTable"
      :selectTable="startRobotSelectTable"
      :startServingRobot="robotMoving"
      :unVisibleModal="unVisibleModal"
    )
    serving-robot-error-modal(
      v-if="errorModalStatus"
      :unVisibleModal="unVisibleModal"
      :errorRobotStatus="errorRobotStatus"
    )
</template>

<script>
import {
  servingRobot
} from '@apis';

const {
  requestRobotOrder,
  requestRobotMoving,
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
      interval: 0,
      startTableList: [],
      currentRobot: undefined,
    };
  },
  computed: {
    storeCode() {
      return this.$store.state.auth.store.code;
    },
    allRobotStatus() {
      return this.$store.state.robot.allRobotStatus;
    },
    selectStartRobot() {
      return this.$store.state.robot.selectStartRobot;
    },
    startRobotSelectedTable() {
      return this.$store.state.robot.startRobotSelectedTable;
    },
    selectStartRobotModalStatus() {
      return this.$store.state.robot.selectStartRobotModalStatus;
    },
    cancelRobot() {
      return this.$store.state.robot.cancelRobot;
    },
    robotCancelModalStatus() {
      return this.$store.state.robot.robotCancelModalStatus;
    },
    robotBackModalStatus() {
      return this.$store.state.robot.robotBackModalStatus;
    },
    sortedTables() {
      const tables = this.$store.state.tables;
      const sortedTables = tables.sort((a, b) => {
        return a.Tablet_name.length - b.Tablet_name.length || a.Tablet_name.localeCompare(b.Tablet_name);
      });
      return sortedTables;
    },
    getDestination() {
      return this.$store.robot.ReverseDestination;
    },
    errorModalStatus() {
      return this.$store.state.robot.errorModalStatus;
    },
    errorRobotStatus() {
      return this.$store.state.robot.errorRobotStatus;
    }
  },
  methods: {
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

      if (robotType) {
        if (robotType === "LGSR") {
          return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/lgcloi.png';
        }

        if (robotType === 'KTSR') {
          return 'https://s3.ap-northeast-2.amazonaws.com/images.good.orderhae.com/logo/kt-ci.png';
        }

        if (robotType === 'LGSR2') {
          return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/lgcloi.png';
        }

        if (robotType === 'VDCS') {
          return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/pudubot-logo.png';
        }
      }

      return "https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torderNoImage.PNG";
    },
    getRobotStatus(robot) {
      const robotInfo = robot.rinfo;
      const robotStatus = robotInfo.reveseStatus;

      return robotStatus;
    },
    getRobotPosition(robot) {
      const robotPosition = robot.ReverseDestination;

      if (!robotPosition) {
        return false;
      }

      if (robotPosition === 'unknown') {
        return '-';
      }

      return robotPosition;
    },
    getRobotCommandText(robot) {
      const robotInfo = robot.rinfo;
      let robotStatus = robotInfo.reveseStatus;

      if (robotStatus === '대기중') {
        return '서빙';
      }

      if (robotStatus === '도착') {
        return '복귀';
      }

      if (robotStatus === '복귀중') {
        return '이동중';
      }

      if (robotStatus === '충전중') {
        return '복귀';
      }

      if (robotStatus === '확인필요') {
        return '확인';
      }

      if (robotStatus === '가는중') {
        return '이동중';
      }

      return robotStatus;
    },
    getBatteryImage(robot) {
      const robotInfo = robot.rinfo;

      if (robotInfo.status === 'Charge') {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/tabler-icon-battery-charging.svg';
      }
      if(robotInfo.battery > 75) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/tabler-icon-battery-4.svg';
      }

      if(robotInfo.battery > 50) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/tabler-icon-battery-3.svg';
      }

      if(robotInfo.battery > 25) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/tabler-icon-battery-2.svg';
      }

      return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/tabler-icon-battery-1.svg';
    },
    getBatteryText(robot) {
      const robotInfo = robot.rinfo;

      if (robotInfo.battery < 0) {
        return '-';
      }

      return `${robotInfo.battery}%`;
    },
    startRobotSelectTable(table) {
      const tableName = table?.torderTableName;

      this.$store.commit('robot/updateStartRobotSelectedTable', tableName);
    },
    async startServingRobot() {
      try {
        const config = {
          id: this.selectStartRobot.deviceid,
          storeCode: this.selectStartRobot.storeid,
        };
        const res = await requestRobotOrder(config);

        return res.data;

      } catch(error) {
        console.log(error);
      }
    },
    async robotMoving() {
      try {
        const config = {
          id: this.selectStartRobot.deviceid,
          tableName: this.startRobotSelectedTable,
          storeCode: this.selectStartRobot.storeid,
        };
        await requestRobotMoving(config);

        this.unVisibleModal();

      } catch(error) {
        console.log(error);
      }
    },
    async goBackRobot() {
      try {
        const config = {
          id: this.selectStartRobot.deviceid,
          tableName: this.currentRobot,
          storeCode: this.selectStartRobot.storeid,
        };
        await requestRobotOrder(config);

      } catch(error) {
        console.log(error);
      }
    },
    async visibleModal(robot) {
      await this.$store.commit('robot/updateStartRobot', robot);
      await this.startServingRobot().then(
        result => {
          console.log(result, '복귀 확인');
          if (result?.tableList && Object.prototype.toString.call(result.tableList) !== '[object Object]') {
            this.startTableList = result?.tableList;
          } else {
            this.startTableList = [];

            this.$store.commit('pushFlashMessage', result.message);
          }
        },
        error => console.log(error),
      );

      if (this.startTableList?.length > 0) {
        this.$store.commit('robot/updateStartRobotModalStatus', true);
      }
    },
    unVisibleModal() {
      this.$store.commit('robot/updateStartRobotModalStatus', false);
      this.$store.commit('robot/updateErrorModalStatus', false);
    },
    modalClose(robot) {
      const robotInfo = robot.rinfo;
      const robotStatus = robotInfo.status;

      if (robotStatus === 'Ready') {
        this.$store.commit('robot/updateStartRobot', undefined);
        this.$store.commit('robot/updateStartRobotModalStatus', false);
        return;
      }

      if (robotStatus === 'Moving') {
        this.$store.commit('robot/updateCancelRobot', undefined);
        this.$store.commit('robot/updateRobotCancelModalStatus', false);
        return;
      }

      if (robotStatus === 'Arrived') {
        return '대기 장소 복귀';
      }

      return '로봇 상태 확인';
    }
  },
  mounted() {
    this.$store.dispatch('robot/updateAllRobotStatus');
    this.interval = setInterval(() => {
      this.$store.dispatch('robot/updateAllRobotStatus');
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
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
            max-height: 40px;
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
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .wrap-battery-status {
          display: flex;
          gap: 1vw;

          .battery-status {
            width: 3vw;
            margin-bottom: 1px !important;
          }
        }

        .serving-status {
          flex: 1;
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
