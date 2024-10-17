// export const validShopCodeOrigins = (state, order) => {
//   const isStateCode = state.auth && state.auth.store && state.auth.store.store_code;
//   const isShopCode = order && order.shop_code;

//   const isTrueCode = isStateCode && isShopCode;
//   const isMatchShopCode = state.auth.store.store_code === order.shop_code;

//   const isTrue = isTrueCode && isMatchShopCode;

//   return isTrue;
// };

export const validShopCode = (state, order) => {
  const isStateCode = state.auth?.store?.store_code;

  const isShopCode = order?.shop_code;

  const isTrueCode = isStateCode && isShopCode;
  const isMatchShopCode = state.auth.store.store_code === order.shop_code;

  const isTrue = isTrueCode && isMatchShopCode;

  return isTrue;
};

export const getCategories = (categories) => {
  try {
    const processCategories = categories.map((item) => ({
      code: item.T_order_store_menu_code,
      parentCodes: JSON.parse(item.T_order_store_menu_depth),
      name: item.T_order_store_menu_name,
      names: item.T_order_store_menu_name_array,
      sortNo: Number(item.T_order_store_menu_sort_number),
      serviceFlag: item.T_order_store_menu_serviceUse,
      startTime: item.T_order_store_menu_starttime,
      endTime: item.T_order_store_menu_endtime,
      serviceUse: item.T_order_store_menu_serviceUse,
      useCategory: item.T_order_store_menu_use === 'Y',
      // 노출 상태
      categoryVisibleStartTime : item.startTime,
      categoryVisibleEndTime : item.endTime,
      isHide : item.isHide,
      scheduleOn : item.scheduleOn,
      weekArray : item.weekArray
    }));

    const firstCategories = processCategories.filter((category) => {
      return category.parentCodes.includes('1');
    }).sort((a, b) => a.sortNo - b.sortNo);

    const secondCategories = firstCategories.map((fCtg) => {
      return processCategories.filter((ctg) => {
        return ctg.parentCodes.includes(fCtg.code);
      }).sort((a, b) => a.sortNo - b.sortNo);
    });

    const results = firstCategories.map((item, idx) => ({
      ...item,
      subCategories: secondCategories[idx],
    }));

    return results;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getNewCategories = (categories) => {
  try {
    const processCategories = categories.map((item) => ({
      code: item.T_order_store_menu_code,
      parentCodes: item.T_order_store_menu_depth[0],
      name: item.T_order_store_menu_name,
      names: item.T_order_store_menu_name_array,
      sortNo: Number(item.T_order_store_menu_sort_number),
      serviceFlag: item.T_order_store_menu_serviceUse,
      startTime: item.T_order_store_menu_starttime,
      endTime: item.T_order_store_menu_endtime,
      serviceUse: item.T_order_store_menu_serviceUse,
      useCategory: item?.T_order_store_menu_use === 'Y',
      goods: item.T_order_category_goods,
    }));

    const firstCategories = processCategories.filter((category) => {
      return category.parentCodes === '1';
    }).sort((a, b) => a.sortNo - b.sortNo);

    const secondCategories = firstCategories.map((fCtg) => {
      return processCategories.filter((ctg) => {
        return ctg.parentCodes.includes(fCtg.code);
      }).sort((a, b) => a.sortNo - b.sortNo);
    });

    const results = firstCategories.map((item, idx) => ({
      ...item,
      subCategories: secondCategories[idx],
    }));

    return results;
  } catch (error) {
    console.log(error);
    return [];
  }
};