import {
  servingRobot
} from '@apis';

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
    cancelRobot: undefined,
    robotCancelModalStatus: false,
    robotBackModalStatus: false,
    destination: undefined,
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
          if (payload.status === 'Ready') {
            state.allRobotStatus[index].rinfo.status = 'Ready';
            state.destination = undefined;
          } else if (payload.status === 'Arrived') {
            state.allRobotStatus[index].rinfo.status = 'Arrived';
            state.destination = payload.destination;
          } else if (payload.status === 'OnTheWay'){
            state.allRobotStatus[index].rinfo.status = 'Moving';
            state.destination = payload.destination;
          }
        }
      });
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