<template lang="pug">
.container
  .card(
    v-for="ctgItem in data"
    :key="ctgItem.code"
  )
    .header {{ ctgItem.name }} (메인 카테고리)
      .toggles
        button.btn(@click="() => open(ctgItem.code, ctgItem.useCategory)" :style="getAbleButtonColor(ctgItem.useCategory)") 표시
        button.btn(@click="() => close(ctgItem.code, !ctgItem.useCategory)" :style="getAbleButtonColor(!ctgItem.useCategory)") 숨김
    .sub-category(
      v-for="subCtgItem in ctgItem.subCategories"
      :key="subCtgItem.code"
    ) {{ subCtgItem.name }} (서브 카테고리)
      .toggles
        button.btn(@click="() => open(subCtgItem.code, subCtgItem.useCategory)" :style="getAbleButtonColor(subCtgItem.useCategory)") 표시
        button.btn(@click="() => close(subCtgItem.code, !subCtgItem.useCategory)" :style="getAbleButtonColor(!subCtgItem.useCategory)") 숨김
</template>

<script>
export default {
  data() {
    return {
      selectMainCategoryItem: null,
    };
  },
  computed: {
    data() {
      const { getAllCategories } = this.$store.getters;
      return getAllCategories;
    },
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    async initialize() {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      await this.$store.dispatch('setAllCategories', fd);
    },
    getSubCategories() {
      try {
        const { data, selectMainCategoryItem } = this;
        if (selectMainCategoryItem) return selectMainCategoryItem.subCategories;
        return data[0].subCategories;
      } catch (error) {
        return [];
      }
    },
    async open(code, useCategory) {
      if (useCategory) {
        return this.$store.commit('pushFlashMessage', '해당 카테고리는 이미 개방이 되었습니다.');
      }

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryOpne', fd);

      if (res.status === 200) {
        this.renewCategoriesState(code, true);
      }
      this.apiException(res.status);
    },
    async close(code, useCategory) {
      if (useCategory) {
        return this.$store.commit('pushFlashMessage', '해당 카테고리는 이미 닫혀있습니다.');
      }

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryClose', fd);

      if (res.status === 200) {
        this.renewCategoriesState(code, false);
      }
      this.apiException(res.status);
    },
    renewCategoriesState(targetCode, visible) {
      const currentIdx = this.$store.state.allCategories.findIndex((o) => o.T_order_store_menu_code === targetCode);

      const target = this.$store.state.allCategories[currentIdx];
      if (currentIdx > -1) {
        const results = {
          index: currentIdx,
          T_order_store_menu_use: visible ? 'Y' : 'N',
          name: target.T_order_store_menu_name,
          depthStr: JSON.parse(target.T_order_store_menu_depth).includes('1') ? '메인' : '서브',
        };

        const { disconnected } = this.emmitSocket(results);

        if (disconnected) {
          this.$store.commit('SET_MENU_USE', results);
          this.$store.commit('pushFlashMessage', `${results.name} ${results.depthStr} 카테고리 상태가 ${visible ? '개방' : '닫힘'}으로 변경이 되었습니다.`);
        }
      }
    },
    emmitSocket(target) {
      const { store_code } = this.$store.state.auth.store;
      const payload = {
        store: {
          code: store_code,
        },
        type: '@update/categories/useStatus',
        target,
      };

      console.log('payload', payload);

      return this.$socket.emit('orderview', payload);
    },
    getAbleButtonColor(isOk) {
      if (isOk) {
        return {
          backgroundColor: 'black',
          color: 'white',
        };
      }

      return {
        backgroundColor: 'white',
        color: 'black',
      };
    },
    apiException(status) {
      if (status !== 200) {
        return this.$store.commit('pushFlashMessage', '네트워크 상태가 불완전 합니다. 잠시후 시도 해주세요.');
      }
    }
  },
};
</script>

<style lang="scss">
.container{
  --c-1: #ffffff;
  --c-2: #202020;
  --c-3: #ff0000;
  --c-7: #e0e0e0;
  --c-8: #fafafa;
  --c-9: #efefef;
  --c-10: #000000;

  .card {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--c-9);
    border-radius: 8px;
    color: var(--c-2);
    padding: 16px;
    box-sizing: border-box;

    .header {
      display: flex;
      font-weight: 900;
      font-size: 32px;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      border-bottom: .8px solid var(--c-2);
      padding-bottom: 8px;

      .toggles {
        width: 220px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .sub-category {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 4px;
      font-weight: 900;
      font-size: 24px;
      align-items: center;
      padding: 20px;

      .toggles {
        width: 220px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
.btn {
  width: 100px;
  height: 40px;
}
</style>
