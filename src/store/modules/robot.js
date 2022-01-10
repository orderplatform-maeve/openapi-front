import {
  servingRobot
} from '@apis';
// import Vue from 'vue';

const {
  requestRobotStatus,
} = servingRobot;

const robot = {
  namespaced: true,
  state: {
    allRobotStatus: [],
    selectStartRobot: undefined,
    startRobotSelectedTable: undefined,
    selectStartRobotModalStatus: false,
    errorModalStatus: false,
    cancelRobot: undefined,
    robotCancelModalStatus: false,
    robotBackModalStatus: false,
    destination: undefined,
    errorRobotStatus: {
      name: '',
      message: '',
    }
  },
  mutations: {
    updateAllRobotStatus(state, payload) {
      state.allRobotStatus = payload;
    },
    updateStartRobot(state, payload) {
      state.selectStartRobot = payload;
    },
    updateStartRobotModalStatus(state, payload) {
      state.selectStartRobotModalStatus = payload;
    },
    updateCancelRobot(state, payload) {
      state.cancelRobot = payload;
    },
    updateRobotCancelModalStatus(state, payload) {
      state.robotCancelModalStatus = payload;
    },
    updateRobotBackModalStatus(state, payload) {
      state.robotBackModalStatus = payload;
    },
    updateStartRobotSelectedTable(state, payload) {
      state.startRobotSelectedTable = payload;
    },
    updateRobotStatus(state, payload) {
      state.allRobotStatus.forEach((robot, index) => {
        if (robot.deviceid === payload.robotId) {
          state.allRobotStatus[index].rinfo.battery = payload.robotInfo.battery;
          state.allRobotStatus[index].rinfo.status = payload.status;
          state.allRobotStatus[index].ReverseDestination = payload.ReverseDestination;
          state.allRobotStatus[index].rinfo.reveseStatus = payload.robotInfo.reveseStatus;

          // const robot = state.allRobotStatus[index];

          // Vue.set(state.allRobotStatus, index, robot);
        }
      });
    },
    updateErrorModalStatus(state, payload) {
      state.errorModalStatus = payload;
    },
    updateErrorRobotStatus(state, payload) {
      state.errorRobotStatus = payload;
    }
  },
  actions: {
    async updateAllRobotStatus({commit}) {
      try {
        // const storeCode = this.state.auth.store.store_code;
        const storeCode = 'TOD_TEST';
        const request = await requestRobotStatus(storeCode);
        const data = request.data.result;
        data.forEach(d => {
          d.rinfo = JSON.parse(d.rinfo);
        });

        if (data) {
          commit('updateAllRobotStatus', data);
        }
      } catch(error) {
        console.log('로봇 상태 불러오기 에러', error);
      }
    }
  }
};

export default robot;