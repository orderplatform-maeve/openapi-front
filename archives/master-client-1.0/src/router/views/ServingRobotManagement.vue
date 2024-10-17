<template lang="pug">
.serving-robot-management-container
  .wrap-header
    p.control-order-page-title 로봇제어(테스트)
    button.refresh-robot(@click="refreshRobotInfo")
      refresh-black-new-icon
      | 새로고침
  .robot-list
    .wrap-robot-status(
      v-for="(robotStatus, index) in allRobotStatus"
      :key="`robot-status-${index}`"
    )
      .wrap-robot-name
        img.robot-brand-image(
          :src="getRobotImage(robotStatus)"
        )
        p.robot-nickname {{getRobotName(robotStatus)}}
      p.robot-status
        span(
          :class="getRobotStatusStyle(robotStatus)"
        ) {{getRobotStatus(robotStatus)}}
      p.table-number
        span.default(v-if="getRobotPosition(robotStatus)") {{getRobotPosition(robotStatus)}}
        span.red(v-else) -
      .wrap-confirm-button
        .wrap-battery-info
          img.battery-img(:src="getBatteryImage(robotStatus)")
          p.battery-info {{getBatteryText(robotStatus)}}
        .wrap-serving-status
          button(
            :class="getRobotActionButtonStyle(robotStatus)"
            @click="visibleModal(robotStatus)"
          ) {{getRobotCommandText(robotStatus)}}
  serving-robot-start-modal(
    v-if="selectStartRobotModalStatus"
    :sortedTables="currentTabTable[currentTab]"
    :selectedTable="startRobotSelectedTable"
    :selectTable="startRobotSelectTable"
    :startServingRobot="onMovingServingRobotConfirmModal"
    :unVisibleModal="unVisibleModal"
    :setCurrentTab="setCurrentTab"
    :currentTab="currentTab"
  )
  serving-robot-error-modal(
    v-if="errorModalStatus"
    :unVisibleModal="unVisibleModal"
    :errorRobotStatus="errorRobotStatus"
  )
  move-serving-robot-confirm-modal(
    v-if="isVisibleMovingServingRobotConfirmModal"
    :confirm="onMovingServingRobot"
    :cancel="offMovingServingRobotConfirmModal"
    :destination="startRobotSelectedTable"
  )
  back-serving-robot-confirm-modal(
    v-if="isVisibleBackServingRobotConfirmModal"
    :confirm="() => onActionRobot(selectedBackServingRobot)"
    :cancel="offBackServingRobotConfirmModal"
    :destination="selectedBackServingRobotTableName"
  )
</template>

<script>
import {
  RefreshBlackNewIcon
} from '@svg';

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
  MoveServingRobotConfirmModal,
  BackServingRobotConfirmModal,
} from '@components';

export default {
  components: {
    ServingRobotStartModal,
    ServingRobotCancelModal,
    ServingRobotBackModal,
    ServingRobotErrorModal,
    RefreshBlackNewIcon,
    MoveServingRobotConfirmModal,
    BackServingRobotConfirmModal,
  },
  data() {
    return {
      interval: 0,
      startTableList: [],
      currentRobot: undefined,
      currentTab: 'serving',
      isVisibleMovingServingRobotConfirmModal: false,
      isVisibleBackServingRobotConfirmModal: false,
      selectedBackServingRobot: {},
      selectedBackServingRobotTableName: '',
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
    getDestination() {
      return this.$store.robot.ReverseDestination;
    },
    errorModalStatus() {
      return this.$store.state.robot.errorModalStatus;
    },
    errorRobotStatus() {
      return this.$store.state.robot.errorRobotStatus;
    },
    currentTabTable() {
      const tableList = this.startTableList;
      const tableListWithTab = {
        'serving': [],
        'decay': [],
        'moving': [],
      };

      tableList.forEach((table) => {
        const isUnknownTable = table?.torderTabletId === null;

        if (isUnknownTable) {
          const isKnownTable = table.robotSpotName !== 'unknown';
          if (isKnownTable) {
            tableListWithTab.moving.push(table);
          }
        } else {
          tableListWithTab.serving.push(table);
          tableListWithTab.decay.push(table);
        }
      });

      return tableListWithTab;
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
      const robotStatus = robot?.rinfo?.reveseStatus;

      return robotStatus;
    },
    isKnowRobotStatus(robot) {
      const robotStatus = this.getRobotStatus(robot);
      const isKnowRobotStatus = robotStatus && robotStatus !== '확인필요';

      return isKnowRobotStatus;
    },
    getRobotStatusStyle(robot) {
      const robotStatusStyle = {
        'red': !this.isKnowRobotStatus(robot)
      };

      return robotStatusStyle;
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
      const robotStatus = robotInfo.reveseStatus;

      if (robotStatus === '대기중') {
        return '이동';
      }

      if (robotStatus === '도착') {
        return '복귀';
      }

      if (robotStatus === '충전중') {
        return '충전중';
      }

      if (robotStatus === '복귀중' || robotStatus === '가는중') {
        return '이동중';
      }

      if (robotStatus === '확인필요') {
        return '확인';
      }

      return robotStatus;
    },
    getBatteryImage(robot) {
      const robotInfo = robot.rinfo;

      if (robotInfo.status === 'Charge') {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/charge-battery.svg';
      }
      if(robotInfo.battery > 75) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/green-battery.svg';
      }

      if(robotInfo.battery > 50) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/orange-battery.svg';
      }

      if(robotInfo.battery > 25) {
        return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/red-battery.svg';
      }

      return 'https://s3.ap-northeast-2.amazonaws.com/images.orderhae.com/logo/red-battery.svg';
    },
    getBatteryText(robot) {
      const robotInfo = robot.rinfo;
      const isNotInfo = robotInfo.battery < 0 || robotInfo.battery === undefined;

      if (isNotInfo) {
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

        // this.unVisibleModal();
        this.offMovingServingRobotConfirmModal();
        this.offMovingServingRobotConfirmModal();

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
    async onActionRobot(robot) {
      try {
        await this.$store.commit('robot/updateStartRobot', robot);
        const resData = await this.startServingRobot();

        if (resData?.tableList && Object.prototype.toString.call(resData.tableList) !== '[object Object]') {
          this.startTableList = resData?.tableList;
        } else {
          this.startTableList = [];

          this.$store.commit('pushFlashMessage', resData.message);
        }

        if (this.startTableList?.length > 0) {
          this.$store.commit('robot/updateStartRobotModalStatus', true);
        }

        this.offBackServingRobotConfirmModal();
      } catch(error) {
        console.log(error, '에러 확인');
      }
    },
    visibleModal(robot) {
      const robotStatus = robot?.rinfo?.reveseStatus;
      const isCharging = robotStatus === '충전중';

      if (isCharging) {
        this.$store.commit('pushFlashMessage', '로봇이 충전중입니다. 로봇을 직접 확인해주세요.');
        return;
      }

      const isArrivalRobot = robot?.rinfo?.reveseStatus === '도착';
      if (isArrivalRobot) {
        this.selectedBackServingRobot = robot;
        this.selectedBackServingRobotTableName = robot.ReverseDestination;
        this.onBackServingRobotConfirmModal();
        return;
      }

      this.onActionRobot(robot);
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
    },
    refreshRobotInfo() {
      this.$store.dispatch('robot/updateAllRobotStatus');
    },
    getRobotActionButtonStyle(robot) {
      const robotStatus = robot?.rinfo?.reveseStatus;

      const isCharging = robotStatus === '충전중';
      const isUnknown = robotStatus === 'Unknown';
      const isUndefined = robotStatus === undefined;
      const isMove = robotStatus === '복귀중' || robotStatus === '이동중';
      const isGray = isCharging || isUnknown || isUndefined || isMove;

      return {
        'serving-status': true,
        'serving-status-gray': isGray,
      };
    },
    setCurrentTab(tabName) {
      this.currentTab = tabName;
    },
    onMovingServingRobotConfirmModal() {
      this.unVisibleModal();
      this.isVisibleMovingServingRobotConfirmModal = true;
    },
    offMovingServingRobotConfirmModal() {
      this.isVisibleMovingServingRobotConfirmModal = false;
    },
    onMovingServingRobot() {
      this.robotMoving();
    },
    onBackServingRobotConfirmModal() {
      this.isVisibleBackServingRobotConfirmModal = true;
    },
    offBackServingRobotConfirmModal() {
      this.selectedBackServingRobot = {};
      this.selectedBackServingRobotTableName = '';
      this.isVisibleBackServingRobotConfirmModal = false;
    }
  },
  mounted() {
    this.refreshRobotInfo();
    this.interval = setInterval(() => {
      this.refreshRobotInfo();
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

  .wrap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .control-order-page-title {
      font-family: "notosans";
      font-weight: bold;
      font-size: 1.71875vw;
      padding: 1.5625vw 0 !important;
      box-sizing: border-box;
    }

    .refresh-robot {
      width: 8.515625vw;
      height: 2.65625vw;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.546875vw;
      border-radius: 0.390625vw;
      border: solid 0.078125vw #000;
      background-color: #fff;
    }
  }

  .robot-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5625vw;

    .wrap-robot-status {
      width: 100%;
      height: 10.9375vw;
      border-radius: 0.234375vw;
      border: solid 0.1171875vw #d4d4d4;
      display: flex;
      align-items: center;
      padding: 1.5625vw !important;
      box-sizing: border-box;
      text-align: center;
      gap: 2.109375vw;

      .wrap-robot-name {
        width: 13.28125vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.78125vw;

        .robot-brand-image {
          height: 2.0703125vw;
          object-fit: contain;
        }
        .robot-nickname {
          width: 100%;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.25vw;
          font-weight: bold;
          letter-spacing: -0.025em;
          word-break: break-all;
          text-align: center;
        }
      }

      .robot-status {
        width: 7.421875vw;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-weight: bold;
        font-size: 1.875vw;
        letter-spacing: -0.025em;
        text-align: center;

        .red {
          color: #fc0000;
        }
      }

      .table-number {
        flex: 1;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        font-size: 1.875vw;
        font-weight: bold;
        letter-spacing: -0.025em;
      }

      .wrap-confirm-button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.78125vw;
        .wrap-battery-info {
          width: 9.375vw;
          height: 2.781250vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.78125vw;

          .battery-info {
            font-family: 'Spoqa Han Sans Neo', 'sans-serif';
            font-size: 1.875vw;
            font-weight: bold;
            letter-spacing: -0.025em;
          }
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
            border: none;
          }

          .serving-status-gray {
            background-color: #e5e5e5;
            border: none;
          }
        }
      }
    }
  }
}
</style>
