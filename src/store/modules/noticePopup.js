import {
  notice
} from '@apis';
// import Vue from 'vue';

const {
  getNoticePopup,
} = notice;

const noticePopup = {
  namespaced: true,
  state: {
    noticePopupData: [],
    noticePopupPage: 0,
    isPopupVisible: false,
    isNoticeEmergency: false,
  },
  mutations: {
    updatePopupVisible(state, payload) {
      state.isPopupVisible = payload;
    },
    updateNoticePopupData(state, payload) {
      state.noticePopupData = payload;
    },
    noticePopupNext(state) {
      if (state.noticePopupData.length === state.noticePopupPage + 1) {
        state.noticePopupPage = 0;
        return;
      }

      state.noticePopupPage += 1;
    },
    noticePopupPrevious(state) {
      if (state.noticePopupPage === 0) {
        state.noticePopupPage = state.noticePopupData.length - 1;
        return;
      }

      state.noticePopupPage -= 1;
    },
    updateNoticeEmergency(state, payload) {
      state.isNoticeEmergency = payload;
    },
  },
  actions: {
    async updateNoticePopupData({commit}) {
      try {
        const res = await getNoticePopup();

        if (res.status === 200) {
          commit('updateNoticePopupData', res.data);
        }
      } catch(error) {
        console.log('에러', error);
      }
    }
  }
};

export default noticePopup;