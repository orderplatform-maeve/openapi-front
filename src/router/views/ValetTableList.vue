<template lang="pug">
  .tables-page-container
    p.tables-page-title 발렛 파킹
    .order-table-list
      button.order-table-name(
        v-for="table in sortedTables"
        :key="table.Ta_id"
        @click="goValetPage(table)"
      )
        p {{getTableName(table)}}
</template>

<script>
export default {
  data() {
    return {
      timerArr: [],
    };
  },
  computed: {
    sortedTables() {
      const data = this.$store.state.tables;

      const tables = data.sort((a, b) => {
        return a.Tablet_name.length - b.Tablet_name.length || a.Tablet_name.localeCompare(b.Tablet_name);
      });

      return tables;
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
    goValetPage(table) {
      console.log(table);
      this.$router.push({
        name: 'valetPage',
        params: {
          tableCode: table.Ta_id,
          tableName: table.Tablet_name,
        },
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.tables-page-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5625vw !important;
  font-size: 1.71875vw;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;

  .tables-page-title {
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
