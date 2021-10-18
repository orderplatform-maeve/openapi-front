<template lang="pug">
  .pick-up-tables-container
    p.pick-up-tables-title 픽업 요청 (테스트)
    .order-table-list
      button.order-table-name(v-for="table in tables" :key="table.Ta_id" @click="openTableOrders(table)") 
        p {{getTableName(table)}}
        p {{table.ordering ? '주문중' : ''}}
</template>

<script>
export default {
  data() {
    return {
      visibleAllRefreshModal: false,
      timerArr: [],
    };
  },
  computed: {
    tables() {
      return this.$store.state.tables;
    },
  },
  mounted() {
    this.initialized();
  },
  methods: {
    async initialized() {
      if (this.$store.state.tables.length === 0) {
        try {
          const params = { shop_code: this.$store.state.auth.store.store_code };
          await this.$store.dispatch('setTables', params);

        } catch (error) {
        // console.log(error);
        }
      }
    },
    getTableName(table) {
      return table?.Tablet_name;
    },
    async openTableOrders(table) {
      console.log(table.Ta_id);

      // 맘맘분식
      const {
        connected,
        disconnected,
      } = this.$socket.emit('torder', {
        store: {
          code: this.$store.state.auth.store.store_code,
        },
        table: {
          code: table.Ta_id
        },
        type: 'message',
        message: '주문하신 메뉴가 나왔습니다.',
      });

      if (disconnected) return this.$store.commit('pushFlashMessage', '네트워크가 불안정 합니다. 다시 시도 해주세요.');
      if (connected) return this.$store.commit('pushFlashMessage', '픽업 요청을 성공하셨습니다.');
    },
  },
};
</script>

<style lang="scss">
.pick-up-tables-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .pick-up-tables-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 2.5vh 0 !important;
    box-sizing: border-box;
  }

  .order-table-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10.9375vw);
    align-items: center;
    gap: 0.78125vw;

    .order-table-name {
      min-height: 4.6875vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #e5e5e5;
      border: none;
      border-radius: 1.015625vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-size: 1.5625vw;
      color: #666;
      letter-spacing: -0.0390625vw;
      text-align: center;
    }
  }

  .wrap-all-table-reset-button {
    flex: 1;
    padding: 1.5625vw 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .all-table-reset-button {
      width: 37.5vw;
      height: 4.53125vw;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
      font-weight: bold;
      font-size: 2.03125vw;
      color: #fff;
      letter-spacing: -0.05078125vw;
      background-color: #fc0000;
      border: none;
      border-radius: 1.015625vw;
    }
  }
}
</style>
