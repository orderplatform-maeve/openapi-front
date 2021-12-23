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
            p.battery-stats-text {{getBatteryText(robotStatus)}}%
            img.battery-status(:src="getBatteryImage(robotStatus)")
          p.serving-status(@click="visibleModal(robotStatus)") {{getRobotCommandText(robotStatus)}}
    serving-robot-start-modal(
      v-if="selectStartRobotModalStatus"
      :sortedTables="sortedTables"
      :selectedTable="startRobotSelectedTable"
      :selectTable="startRobotSelectTable"
      :startServingRobot="startServingRobot"
      :unVisibleModal="unVisibleModal"
    )
    serving-robot-cancel-modal(
      v-if="robotCancelModalStatus"
      :unVisibleModal="unVisibleModal"
      :getRobotPosition="getRobotPosition"
    )
    serving-robot-back-modal(
      v-if="robotBackModalStatus"
      :unVisibleModal="unVisibleModal"
      :goBackRobot="goBackRobot"
      :getRobotPosition="getRobotPosition"
    )
    serving-robot-error-modal(v-if="false")
</template>

<script>
import {
  servingRobot
} from '@apis';

const {
  requestRobotOrder,
  requestBackRobot,
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
      return this.$store.robot.destination;
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
      }

      return "https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/torderNoImage.PNG";
    },
    getRobotStatus(robot) {
      const robotInfo = robot.rinfo;
      const robotStatus = robotInfo.status;

      if (robotStatus === 'Ready') {
        return '대기중';
      }

      if (robotStatus === 'Moving') {
        return '이동중';
      }

      if (robotStatus === 'Arrived') {
        return '도착';
      }

      if (robotStatus === 'Charge') {
        return '충전중';
      }

      return false;
    },
    getRobotPosition(robot) {
      const robotPosition = robot.destination;

      if (!robotPosition) {
        return false;
      }

      if (robotPosition === 'homepoi') {
        return '-';
      }

      return robotPosition;
    },
    getRobotCommandText(robot) {
      const robotInfo = robot.rinfo;
      const robotStatus = robotInfo.status;
      console.log(robot);

      if (robotStatus === 'Ready') {
        return '서빙 진행';
      }

      if (robotStatus === 'Moving') {
        return '이동 취소';
      }

      if (robotStatus === 'Arrived') {
        return '대기 장소 복귀';
      }

      if (robotStatus === 'Charge') {
        return '충전중';
      }

      return '로봇 상태 확인';
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

      return robotInfo.battery;
    },
    startRobotSelectTable(table) {
      const tableName = table?.Tablet_name;

      this.$store.commit('robot/updateStartRobotSelectedTable', tableName);
    },
    async startServingRobot() {
      try {
        const config = {
          id: this.selectStartRobot.deviceid,
          tableName: this.startRobotSelectedTable,
          storeCode: this.selectStartRobot.storeid,
        };
        await requestRobotOrder(config);
        this.unVisibleModal();

      } catch(error) {
        console.log(error);
      }
    },
    async goBackRobot() {
      try {
        // const robotInfo = JSON.parse(this.selectStartRobot.rinfo);
        const config = {
          ssid: this.selectStartRobot.ssid,
          deviceid: this.selectStartRobot.deviceid,
        };
        // const deviceId = this.selectStartRobot.deviceid;

        const res = await requestBackRobot(config);
        console.log(res);
      } catch(error) {
        console.log(error);
      }
    },
    visibleModal(robot) {
      const robotInfo = robot.rinfo;
      const robotStatus = robotInfo.status;

      if (robotStatus === 'Ready') {
        this.$store.commit('robot/updateStartRobot', robot);
        this.$store.commit('robot/updateStartRobotModalStatus', true);
        return;
      }

      if (robotStatus === 'Moving') {
        this.$store.commit('robot/updateCancelRobot', robot);
        this.$store.commit('robot/updateRobotCancelModalStatus', true);
        return;
      }

      if (robotStatus === 'Arrived') {
        this.$store.commit('robot/updateStartRobot', robot);
        this.$store.commit('robot/updateRobotBackModalStatus', true);
        return;
      }

      return '로봇 상태 확인';
    },
    unVisibleModal() {
      this.$store.commit('robot/updateStartRobot', undefined);
      this.$store.commit('robot/updateCancelRobot', undefined);
      this.$store.commit('robot/updateRobotCancelModalStatus', false);
      this.$store.commit('robot/updateStartRobotModalStatus', false);
      this.$store.commit('robot/updateRobotBackModalStatus', false);
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
  },
  sockets: {
    connect() {
    },
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