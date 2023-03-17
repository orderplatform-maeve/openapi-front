<template lang="pug">
.cancel-payment-order-page-container
  p.cancel-payment-order-page-title 결제 보류 처리
  .order-table-list
    button.order-table-name(v-for="table in tables" :key="table.Ta_id" @click="postPendPaymentTableOrder(table)")
      p {{getTableName(table)}}
</template>

<script>
import { credit } from '@apis';
const {
  requestPaymentPend
} = credit;

export default {
  data() {
    return {
      //
    };
  },
  computed: {
    tables() {
      return this.$store.state.tables;
    },
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
    async postPendPaymentTableOrder(table) {
      try {
        const config = {
          storeCode: this.$store.state.auth.store.store_code,
          tabletCode: table.Ta_id,
        };

        const res = await requestPaymentPend(config);
        console.log(res);

        if (res.data.resultCode === 200) {
          this.$store.commit('pushFlashMessage', '해당 테이블의 결제를 보류 처리 했습니다!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.initialized();
  },
};

</script>

<style lang="scss" scoped>
.cancel-payment-order-page-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;

  .cancel-payment-order-page-title {
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
    overflow-y: scroll;
    padding-bottom: 1.5625vw !important;

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
}
</style>