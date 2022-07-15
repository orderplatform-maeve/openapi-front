<template lang="pug">
.update-categories-container
  category-visible-select-date-modal(
    v-if="isCategoryVisibleSelectDateModal"
    :closeModal="closeModal"
    :selectDateModalSubmit="selectDateModalSubmit"
    :categoryVisibleTime="cloneDate"
    :timeReset="timeReset")
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
      p.main-category-status-title 노출 상태
      .main-category-status-button
        button.main-category-status-unvisible(
          @click="postCategoryUpdateCategoryScheduleOffApi"
          :style="getAbleButtonColor(!getScheduleOn())"
        ) 항상 노출
        button.main-category-status-unvisible(
          @click="postCategoryUpdateCategoryScheduleOnApi"
          :style="getAbleButtonColor(getScheduleOn())"
        ) 제한 노출
    // 노출 요일 선택
    .wrap-main-category-status(v-if="getScheduleOn() && getUseCategory()")
      p.main-category-status-title 노출 요일 선택
      .main-category-day-of-week
        button(
          @click="clickAllDayOfWeek()"
          :style="getAbleButtonColor(dayOfWeekAllStyle())"
        ) 매일
        button(
          v-for="day of dayOfWeek"
          @click="clickDayOfWeek(day)"
          :style="getAbleButtonColor(dayOfWeekStyle(day))"
        ) {{ getDayText(day) }}
    // 노출 시간 선택
    .wrap-main-category-status(v-if="getScheduleOn() && getUseCategory()")
      p.main-category-status-title 노출 시간 선택
      .main-category-day-of-week
        .category-visible-time(@click="openModal()") {{ getCategoryVisibleStartHour() }}시
        .category-visible-time(@click="openModal()") {{ getCategoryVisibleStartMinute() }}분
        span.tilde ~
        .category-visible-time(@click="openModal()") {{ getCategoryVisibleEndHour() }}시
        .category-visible-time(@click="openModal()") {{ getCategoryVisibleEndMinute() }}분
        button(
          @click="postCategoryUpdateCategoryTimeApi()"
          :style="getAbleButtonColor(true)"
        ) 적용
        .time-description
         p *00:00~30:00시 시간입력(30시=익일 새벽 6시)
         p 익일 새벽으로 넘어갈 시 노출요일은 시작시간 요일기준으로 판단
         p 예)월요일과 수요일 오후 10시부터 익일 새벽 2시까지 상품노출을 원할 경우
         p 월요일과 수요일 선택 후 22:00 ~ 26:00입력
    // 노출시간 이후 표시여부
    .wrap-main-category-status(v-if="getScheduleOn() && getUseCategory()")
      p.main-category-status-title 노출시간 이후 표시여부
      .main-category-status-button
        button.main-category-status-unvisible(
          @click="postCategoryUpdateCategoryHideApi()"
          :style="getAbleButtonColor(!getHide())"
        ) 분류표시
        button.main-category-status-visible(
          @click="postCategoryUpdateCategoryShowApi()"
          :style="getAbleButtonColor(getHide())"
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
import { CategoryVisibleSelectDateModal } from '@components';
import { category } from '@apis';

const {
  postCategoryUpdateCategoryTime,
  postCategoryUpdateCategoryScheduleOff,
  postCategoryUpdateCategoryScheduleOn,
  postCategoryUpdateCategoryScheduleDateArray,
  postCategoryUpdateCategoryHide,
  postCategoryUpdateCategoryShow
} = category;

export default {
  components : {
    CategoryVisibleSelectDateModal
  },
  data() {
    return {
      selectMainCategoryItem: null,
      selectMainCategoryNumber: 0,
      selectSubCategoryItem: null,
      dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
      // 시간 선택 모달
      isCategoryVisibleSelectDateModal : false,
      categoryVisibleTime : {
        startHour : '00',
        startMinute : '00',
        endHour : '30',
        endMinute : '00'
      },
      cloneDate : {}
    };
  },
  computed: {
    data() {
      return this.$store.getters.getAllCategories;
    },
    subCategoryItem() {
      return this.data[this.selectMainCategoryNumber]?.subCategories ? this.data[this.selectMainCategoryNumber]?.subCategories : [];
    },
    getSubCategoryStatus() {
      return this.subCategoryItem?.length > 0;
    },
  },
  async mounted() {
    await this.initialize();
    this.cloneDate.startHour = this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[0];
    this.cloneDate.startMinute = this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[1];
    this.cloneDate.endHour = this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[0];
    this.cloneDate.endMinute = this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[1];
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
    // isHide - 분류표시(1) / 분류숨김(0)
    getHide() {
      return this.data[this.selectMainCategoryNumber]?.isHide;
    },
    // useCategory - 노출(1) / 숨김(0)
    getUseCategory() {
      return this.data[this.selectMainCategoryNumber]?.useCategory;
    },
    // scheduleOn - 항상 노출(0) / 제한 노출(1)
    getScheduleOn() {
      return this.data[this.selectMainCategoryNumber]?.scheduleOn;
    },
    //
    getCategoryVisibleStartHour() {
      return this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[0];
    },
    getCategoryVisibleStartMinute() {
      return this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[1];
    },
    getCategoryVisibleEndHour() {
      return this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[0];
    },
    getCategoryVisibleEndMinute() {
      return this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[1];
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
      this.selectSubCategoryItem = item?.subCategories[0];
      this.select(`mainCategoryId-${index}`);
    },
    getActiveMainCategory(targetCode) {
      try {
        const { data, selectMainCategoryItem } = this;

        if (!selectMainCategoryItem) {
          const isDefaultActive = targetCode === data[0]?.code;
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
          depthStr: JSON.parse(target.T_order_store_menu_depth)?.includes('1') ? '메인' : '서브',
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

    // 노출 상태 '특정 요일' 스타일
    dayOfWeekStyle(day) {
      if (this.data[this.selectMainCategoryNumber].weekArray?.includes(day)) {
        return true;
      }
      return false;
    },

    // 노출 상태 요일 '특정 요일' 눌렀을때
    async clickDayOfWeek(day) {
      // 이미 요일로 지정 되어 있으면 삭제
      if (this.data[this.selectMainCategoryNumber].weekArray?.includes(day)) {
        const deleteIndex1 = this.data[this.selectMainCategoryNumber].weekArray.findIndex((dayArrayItem) => dayArrayItem === day);
        const cloneArray1 = JSON.parse(JSON.stringify(this.data[this.selectMainCategoryNumber].weekArray));
        cloneArray1?.splice(deleteIndex1, 1);
        const config = {
          body : {
            store_code : this.$store.state.auth.store.store_code,
            good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
            dateArray : cloneArray1
          }
        };

        const res = await postCategoryUpdateCategoryScheduleDateArray(config);
        if (res.data.result === true) {
          this.initialize();
          this.$store.commit('pushFlashMessage', '노출 요일이 제거 되었습니다.');
        }
        return;
      }

      // 요일이 지정 되어 있지 않으면, 요일을 추가
      const cloneArray2 = JSON.parse(JSON.stringify(this.data[this.selectMainCategoryNumber]?.weekArray));
      cloneArray2.push(day);

      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
          dateArray : cloneArray2.sort()
        }
      };

      const res = await postCategoryUpdateCategoryScheduleDateArray(config);
      if (res.data.result === true) {
        this.initialize();
        this.$store.commit('pushFlashMessage', '노출 요일이 추가 되었습니다.');
      }
      return;
    },

    // 노출 상태 요일 '매일' 눌렀을때
    async clickAllDayOfWeek() {
      let dateArray2 = [0, 1, 2, 3, 4, 5, 6];

      // 모두 선택 되어 있을 경우 배열을 비운다.
      if (this.dayOfWeekAllStyle()) {
        dateArray2 = [];
      }

      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
          dateArray : dateArray2
        }
      };

      const res = await postCategoryUpdateCategoryScheduleDateArray(config);

      if (res.data.result === true) {
        this.initialize();
        this.$store.commit('pushFlashMessage', '노출 요일이 변경 되었습니다.');
      }
    },

    // 노출 요일 선택 '매일' 스타일
    dayOfWeekAllStyle() {
      if (this.data[this.selectMainCategoryNumber]?.weekArray?.length === 7) {
        return true;
      }
      return false;
    },

    // 요일 텍스트
    getDayText(day) {
      if (day === 0) { return '일'; }
      if (day === 1) { return '월'; }
      if (day === 2) { return '화'; }
      if (day === 3) { return '수'; }
      if (day === 4) { return '목'; }
      if (day === 5) { return '금'; }
      if (day === 6) { return '토'; }
    },

    // 시간 선택 모달창
    openModal() {
      // time 세팅
      this.cloneDate.startHour = this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[0];
      this.cloneDate.startMinute = this.data[this.selectMainCategoryNumber]?.categoryVisibleStartTime?.split(':')[1];
      this.cloneDate.endHour = this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[0];
      this.cloneDate.endMinute = this.data[this.selectMainCategoryNumber]?.categoryVisibleEndTime?.split(':')[1];

      this.isCategoryVisibleSelectDateModal = true;
    },

    closeModal() {
      this.isCategoryVisibleSelectDateModal = false;
    },

    // 시간 리셋
    timeReset() {
      this.cloneDate = {...this.categoryVisibleTime};
    },

    // 모달 창 안에서 시간 설정 하기
    selectDateModalSubmit() {
      // 시작 시간과 종료시간이 같을때
      if (Number(this.cloneDate.startHour) === Number(this.cloneDate.endHour)) {
        if (this.cloneDate.startMinute === this.cloneDate.endMinute) {
          this.$store.commit('pushFlashMessage', '시작 시간과 종료 시간이 같습니다.');
          return;
        }
      }

      // 시작 시간(hour)이 종료 시간보다 클때
      if (Number(this.cloneDate.startHour) > Number(this.cloneDate.endHour)) {
        this.$store.commit('pushFlashMessage', '시작 시간이 종료 시간 보다 큽니다.');
        return;
      }

      // 시(hour)는 같은데 분이 클때
      if (Number(this.cloneDate.startHour) === Number(this.cloneDate.endHour)) {
        if (Number(this.cloneDate.startMinute) > Number(this.cloneDate.endMinute)) {
          this.$store.commit('pushFlashMessage', '시작 시간이 종료 시간 보다 큽니다.');
          return;
        }
      }

      // 종료 시간은 30시 00분 까지 설정하며, 그 이후 시간은 설정 불가능
      if (Number(this.cloneDate.endHour) === 30) {
        console.log('마지막 분', this.cloneDate.endMinute, typeof this.cloneDate.endMinute);
        if(Number(this.cloneDate.endMinute) > 0) {
          this.$store.commit('pushFlashMessage', '종료 시간은 30시 00분 까지 설정 할 수 있습니다.');
          return;
        }
      }

      this.data[this.selectMainCategoryNumber].categoryVisibleStartTime = `${this.cloneDate.startHour}:${this.cloneDate.startMinute}`;
      this.data[this.selectMainCategoryNumber].categoryVisibleEndTime = `${this.cloneDate.endHour}:${this.cloneDate.endMinute}`;
      this.closeModal();
    },

    // 노출 시간 선택 API
    async postCategoryUpdateCategoryTimeApi() {
      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
          startTime : `${this.cloneDate.startHour}:${this.cloneDate.startMinute}`,
          endTime : `${this.cloneDate.endHour}:${this.cloneDate.endMinute}`,
        }
      };
      console.log('body에 날릴 데이터', config.body);
      const res = await postCategoryUpdateCategoryTime(config);
      if (res.data.result === true) {
        this.initialize();
        this.$store.commit('pushFlashMessage', '노출 시간이 변경 되었습니다.');
      }
    },

    // 노출 상태 -> 제한 노출로 변경
    async postCategoryUpdateCategoryScheduleOnApi() {
      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
        }
      };

      const res = await postCategoryUpdateCategoryScheduleOn(config);
      if (res.data.result === true) {
        this.initialize();
        this.categoryVisibleOption = true;
        this.$store.commit('pushFlashMessage', '노출 상태가 제한 노출로 변경 되었습니다.');
      }
    },

    // 노출 상태 -> 항상 노출로 변경
    async postCategoryUpdateCategoryScheduleOffApi() {
      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
        }
      };

      const res = await postCategoryUpdateCategoryScheduleOff(config);

      if (res.data.result === true) {
        this.data[this.selectMainCategoryNumber].scheduleOn = false;
        this.$store.commit('pushFlashMessage', '노출 상태가 항상 노출로 변경 되었습니다.');
        this.initialize();
      }

    },

    // 노출시간 이후 표시여부 ->  '분류표시' 로 변경
    async postCategoryUpdateCategoryHideApi() {
      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
        }
      };

      const res = await postCategoryUpdateCategoryHide(config);

      if (res.data.result === true) {
        this.$store.commit('pushFlashMessage', '노출시간 이후 표시 여부가 분류표시로 변경 되었습니다.');
        console.log('isHide', this.data[this.selectMainCategoryNumber]?.isHide);
        this.initialize();
      }
    },

    // 노출시간 이후 표시여부 ->  '분류숨김' 으로 변경
    async postCategoryUpdateCategoryShowApi() {
      const config = {
        body : {
          store_code : this.$store.state.auth.store.store_code,
          good_categroty_code : this.data[this.selectMainCategoryNumber]?.code,
        }
      };

      const res = await postCategoryUpdateCategoryShow(config);
      if (res.data.result === true) {
        this.$store.commit('pushFlashMessage', '노출시간 이후 표시 여부가 분류숨김으로 변경 되었습니다.');
        console.log('isHide', this.data[this.selectMainCategoryNumber]?.isHide);
        this.initialize();
      }
    },
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

        .category-visible-time {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 0.0781vw solid #D3DCE6;
          width: 5.6937vw;
          height: 5.3325vh;
          border-radius: 0.3906vw;
          color: #000;
          font-size: 2vw;
        }

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
          border: 0.0781vw solid #D3DCE6;
          box-sizing: border-box;
          border-radius: 0.3906vw;
        }

        .tilde {
          color: #000;
          font-style: normal;
          font-size: 2.4306vw;
          line-height: 1.6667vw;
          text-transform: capitalize;
        }

        .time-description {
          width: 50%;
          color: #929292;
          font-size: 0.9028vw;
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
      box-sizing: border-box;
      font-size: 0.9028vw;
      line-height: 1.0417vw;
      color: #929292;
    }
  }
}

</style>
