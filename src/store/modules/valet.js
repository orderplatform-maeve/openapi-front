const valet = {
  namespaced: true,
  state: {
    carNumber: [],
  },
  mutations: {
    updateCarNumber(state, payload) {
      state.carNumber.push(payload);
    },
    initCarNumber(state) {
      state.carNumber = [];
    },
    deleteCarNumber(state) {
      state.carNumber.splice(0, 1);
    }
  },
};

export default valet;