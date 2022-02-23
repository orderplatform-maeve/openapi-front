<template lang="pug">
.update-categories-container
  p.update-categories-title 분류관리 (테스트)
  .main-categories
    .main-category(
      v-for="(ctgItem, index) in data"
      :key="ctgItem.code"
      @click="() => onSelectMainCtg(ctgItem, index)"
      :class="getActiveMainCategory(ctgItem.code)"
      :id="`mainCategoryId-${index}`"
    ) {{ ctgItem.name }}
  .background-white
    // 대분류 노출여부
    .wrap-main-category-status
      p.main-category-status-title 대분류 노출여부
      .main-category-status-button
        button.main-category-status-visible(
          @click="() => open(data[selectMainCategoryNumber].code, getUseCategory())"
          :style="getAbleButtonColor(getUseCategory())"
        ) 노출
        button.main-category-status-unvisible(
          @click="() => close(data[selectMainCategoryNumber].code, getUseCategory())"
          :style="getAbleButtonColor(!getUseCategory())"
        ) 숨김
    // 노출 상태
    .wrap-main-category-status(v-if="getUseCategory()")
      p.main-category-status-title 노출 상태(미구현)
      .main-category-status-button
        button.main-category-status-unvisible(
          :style="getAbleButtonColor(false)"
        ) 항상 노출
        button.main-category-status-unvisible(
          :style="getAbleButtonColor(false)"
        ) 제한 노출
    // 노출 요일 선택
    .wrap-main-category-status(v-if="getUseCategory()")
      p.main-category-status-title 노출 요일 선택(미구현)
      .main-category-day-of-week
        button(
          @click="clickAllDayOfWeek()"
          :style="getAbleButtonColor(dayOfWeekAllStyle())"
        ) 매일
        button(
          v-for="day of dayOfWeek"
          @click="clickDayOfWeek(day)"
          :style="getAbleButtonColor(dayOfWeekStyle(day))"
        ) {{ day }}
    // 노출 시간 선택
    .wrap-main-category-status(v-if="getUseCategory()")
      p.main-category-status-title 노출 시간 선택(미구현)
      .main-category-day-of-week
        input(placeholder="시")
        input(placeholder="분")
        span.tilde ~
        input(placeholder="시")
        input(placeholder="분")
        button(
          @click="() => {}"
          :style="getAbleButtonColor(false)"
        ) 적용
    // 노출시간 이후 표시여부
    .wrap-main-category-status(v-if="getUseCategory()")
      p.main-category-status-title 노출시간 이후 표시여부(미구현)
      .main-category-status-button
        button.main-category-status-visible(
          @click="() => {}"
          :style="getAbleButtonColor(getUseCategory())"
        ) 분류표시
        button.main-category-status-unvisible(
          @click="() => {}"
          :style="getAbleButtonColor(!getUseCategory())"
        ) 분류숨김
    pre.description *분류표시: 설정된 시간 이후 대분류가 제일 하단으로 이동하며 메뉴 선택시 주문 불가 팝업이 뜸
      br
      | *분류숨김: 설정된 시간 이후 분류가 숨겨짐
    // 중분류 노출여부
    .wrap-sub-category-status(v-if="getSubCategoryStatus")
      p.sub-category-status-title 중분류 노출여부
      .wrap-sub-category-status-button
        .sub-category-status(
          v-for="(subCtgItem, subIndex) in subCategoryItem"
          :key="subCtgItem.code"
        )
          p.sub-category-name {{subCtgItem.name}}
          .sub-category-status-button
            button.sub-category-status-visible(
              @click="() => open(subCtgItem.code, subCtgItem.useCategory)"
              :style="getAbleButtonColor(subCtgItem.useCategory)"
            ) 표시
            button.sub-category-status-unvisible(
              @click="() => close(subCtgItem.code, !subCtgItem.useCategory)"
              :style="getAbleButtonColor(!subCtgItem.useCategory)"
            ) 숨김
</template>

<script>
export default {
  data() {
    return {
      selectMainCategoryItem: null,
      selectMainCategoryNumber: 0,
      selectSubCategoryItem: null,
      dayOfWeek: [
        '일', '월', '화', '수', '목', '금', '토',
      ],
      selectedDayOfWeek : []
    };
  },
  computed: {
    data() {
      return this.$store.getters.getAllCategories;
    },
    subCategoryItem() {
      return this.data[this.selectMainCategoryNumber]?.subCategories ? this.data[this.selectMainCategoryNumber].subCategories : [];
    },
    getSubCategoryStatus() {
      return this.subCategoryItem.length > 0;
    }
  },
  async mounted() {
    await this.initialize();
  },
  methods: {
    select(id) {
      const wrap = document.querySelector(".main-categories");
      const windowWidth = document.documentElement.clientWidth / 2;
      const windowHeight = document.documentElement.clientHeight / 2;
      const target = document.getElementById(id);
      if(target) {
        // document.querySelector(".wrap-category").scrollBy(150, 0);
        if(!this.$store.getters.verticalTheme) {
          if(windowWidth - target.getBoundingClientRect().left < 0) {
            wrap.scrollBy({
              left: -(windowWidth - (target.offsetWidth / 2) - target.getBoundingClientRect().left),
              top: 0,
              behavior: 'smooth',
            });
          } else if(wrap.getBoundingClientRect().left - target.getBoundingClientRect().left > 0){
            wrap.scrollBy({
              left: -(windowWidth - (target.offsetWidth / 2) - target.getBoundingClientRect().left),
              top: 0,
              behavior: 'smooth',
            });
          }
        } else {
          if(windowHeight - target.getBoundingClientRect().top < 0) {
            wrap.scrollBy({
              top: -(windowHeight - (target.offsetHeight / 2) - target.getBoundingClientRect().top),
              left: 0,
              behavior: 'smooth',
            });
          } else if(wrap.getBoundingClientRect().top - target.getBoundingClientRect().top > 0){
            wrap.scrollBy({
              top: -(wrap.getBoundingClientRect().top - target.getBoundingClientRect().top),
              left: 0,
              behavior: 'smooth',
            });
          }
        }
      }
    },
    async initialize() {
      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      await this.$store.dispatch('setAllCategories', fd);
    },
    getUseCategory() {
      return this.data[this.selectMainCategoryNumber]?.useCategory;
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
    onSelectMainCtg(item, index) {
      this.selectMainCategoryItem = item;
      this.selectMainCategoryNumber = index;
      this.selectSubCategoryItem = item.subCategories[0];
      this.select(`mainCategoryId-${index}`);
    },
    getActiveMainCategory(targetCode) {
      try {
        const { data, selectMainCategoryItem } = this;

        if (!selectMainCategoryItem) {
          const isDefaultActive = targetCode === data[0].code;
          if (isDefaultActive) {
            return 'active';
          }
          return '';
        }

        const isSelectedActive = selectMainCategoryItem.code === targetCode;
        if (isSelectedActive) return 'active';

        return '';
      } catch (error) {
        console.error(error);
        return '';
      }
    },
    async open(code) {
      // if (useCategory) {
      //   return this.$store.commit('pushFlashMessage', '해당 카테고리는 이미 개방이 되었습니다.');
      // }

      const fd = new FormData();
      fd.append('store_code', this.$store.state.auth.store.store_code);
      fd.append('good_categroty_code', code);

      const res = await this.$store.dispatch('updateCategoryOpen', fd);

      if (res.status === 200) {
        this.renewCategoriesState(code, true);
      }
      this.apiException(res.status);
    },
    async close(code) {
      // if (useCategory) {
      //   return this.$store.commit('pushFlashMessage', '해당 카테고리는 이미 닫혀있습니다.');
      // }

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
        backgroundColor: '#e5e5e5',
        color: '#666',
      };
    },
    apiException(status) {
      if (status !== 200) {
        return this.$store.commit('pushFlashMessage', '네트워크 상태가 불완전 합니다. 잠시후 시도 해주세요.');
      }
    },
    onConditionOpen(code, flagCategory) {
      console.log(code, flagCategory);
    },
    dayOfWeekStyle(day) {
      if (this.selectedDayOfWeek.includes(day)) {
        return true;
      }
      return false;
    },
    clickDayOfWeek(day) {
      // 들어 있으면
      if(this.selectedDayOfWeek.includes(day)) {
        const deleteIndex = this.selectedDayOfWeek.findIndex((dayArray) => dayArray === day);
        this.selectedDayOfWeek.splice(deleteIndex,1);
        return;
      }
      this.selectedDayOfWeek.push(day);
    },
    dayOfWeekAllStyle() {
      if(this.selectedDayOfWeek.length === 7) {
        return true;
      }
      return false;
    },
    clickAllDayOfWeek() {
      if(this.selectedDayOfWeek.length === 0) {
        this.selectedDayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        return;
      }
      this.selectedDayOfWeek = [];
    }
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.update-categories-container {
  flex: 1;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
  color:#ffffff;
  padding: 0.390625vw 0 0 !important;
  box-sizing: border-box;
  overflow: hidden;

  .update-categories-title {
    font-family: "notosans";
    font-weight: bold;
    font-size: 1.71875vw;
    padding: 1.5625vw 0 1.5625vw !important;
    color: #fff;
  }

  .main-categories {
    display: flex;
    align-items: center;
    gap: 0.78125vw;
    max-width: 84.53125vw;
    overflow: auto;

    .main-category {
      font-size: 1.5625vw;
      color: #ddd;
      letter-spacing: -0.0390625vw;
      background-color: #404144;
      padding: 1.328125vw 1.5625vw !important;
      box-sizing: border-box;
      border-top-left-radius: 1.015625vw;
      border-top-right-radius: 1.015625vw;
      white-space:nowrap;
      word-break: keep-all;
    }

    .active {
      color: #000;
      font-weight: bold;
      background-color: #fff;
    }
  }

  .background-white {
    height: calc(100vh - 10.546875vw);
    background-color: #fff;
    box-sizing: border-box;
    overflow: auto;

    .wrap-main-category-status {
      padding: 2.34375vw !important;
      box-sizing: border-box;

      .main-category-status-title {
        color: #000;
        font-size: 1.5625vw;
        letter-spacing: -0.078125vw;
      }

      .main-category-status-button {
        margin-top: 1.5625vw !important;
        display: flex;
        align-items: center;
        gap: 0.781250vw;

        > button {
          width: 15.625vw;
          height: 4.6875vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.875vw;
          font-weight: bold;
          letter-spacing: -0.046875vw;
          border-radius: 1.015625vw;
          border: none;
          background-color: #e5e5e5;
          color: #666;
        }
      }

      .main-category-day-of-week {
        margin-top: 1.5625vw !important;
        display: flex;
        align-items: center;
        gap: 0.781250vw;

        > button {
          width: 4.1667vw;
          height: 3.4722vw;
          font-family: 'Spoqa Han Sans Neo', 'sans-serif';
          font-size: 1.2500vw;
          font-weight: bold;
          letter-spacing: -0.046875vw;
          border-radius: 1.015625vw;
          border: none;
          background-color: #e5e5e5;
          color: #666;
        }

        > input {
          height: 3.3333vw;
          width: 5.6944vw;
          border: 1px solid #D3DCE6;
          box-sizing: border-box;
          border-radius: 5px;
        }

        .tilde {
          color: #000;
          font-style: normal;
          font-size: 2.4306vw;
          line-height: 1.6667vw;
          text-transform: capitalize;
        }
      }
    }

    .wrap-sub-category-status {
      padding: 2.34375vw !important;
      box-sizing: border-box;

      .sub-category-status-title {
        color: #000;
        font-size: 1.5625vw;
        letter-spacing: -0.078125vw;
      }

      .wrap-sub-category-status-button {
        margin-top: 1.5625vw !important;
        font-family: 'Spoqa Han Sans Neo', 'sans-serif';
        color: #000;
        display: grid;
        grid-template-columns: repeat(auto-fill, 19.375vw);
        gap: 0.78125vw;

        .sub-category-status {
          min-height: 11.71875vw;
          background-color: #f5f5f5;
          border: solid 0.078125vw #d6d6d6;
          border-radius: 0.78125vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .sub-category-name {
            flex: 1;
            font-size: 1.5625vw;
            font-weight: bold;
            letter-spacing: -0.078125vw;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.171875vw !important;
            box-sizing: border-box;
            word-break: break-all;
          }

          .sub-category-status-button {
            width: 100%;
            display: flex;
            gap: 0.78125vw;
            padding: 1.2890625vw 1.171875vw !important;
            box-sizing: border-box;

            > button {
              flex: 1;
              height: 3.125vw;
              font-family: 'Spoqa Han Sans Neo', 'sans-serif';
              font-size: 1.40625vw;
              color: #666;
              border: none;
              border-radius: 0.390625vw;
              background-color: #e5e5e5;
            }
          }
        }
      }
    }

    .description {
      padding-left: 2.34375vw !important;
      box-sizing: border-box;
      font-size: 0.9028vw;
      line-height: 1.0417vw;
      color: #929292;
    }
  }
}

</style>
