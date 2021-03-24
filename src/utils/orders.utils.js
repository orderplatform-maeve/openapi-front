function validGoodCode(order) {
  const isOrderInfo = order && order.order_info;
  const isEmptyOrderInfo = order.order_info.length > 0;
  const isGoodCode = !!order.order_info[0];
  const itemCode = isOrderInfo && isEmptyOrderInfo && isGoodCode && order.order_info[0].good_code;

  return itemCode;
}

function getGoodType(goodCode) {
  const call = goodCode === '99999';
  const setting = goodCode === '88888';

  const result = {
    call,
    setting,
  };

  return result;
}

export function getTableNumberClass(order) {
  if (!order) {
    return {
      call: false,
      setting: false,
      rating: false,
      crew: false,
    };
  }

  if (order.order_type === 'RATING') {
    if (order.rating_type === 'humans') {
      return {
        call: false,
        setting: false,
        rating: false,
        crew: true,
      };
    }

    return {
      call: false,
      setting: false,
      rating: true,
      crew: false,
    };
  }

  const goodCode = validGoodCode(order);
  return getGoodType(goodCode);
}

export function visibleCall(order) {
  if (!order) return false;
  const goodCode = validGoodCode(order);
  const isCall = goodCode === '99999';
  return isCall;
}

export function isDoneSetting(order) {
  if (!order) return false;
  const goodCode = validGoodCode(order);
  const isDone = goodCode === '88888';
  return isDone;
}

export function isRating(order) {
  try {
    return order.order_type === 'RATING';
  } catch (error) {
    return false;
  }
}

export function checkedTabletNum(order) {
  try {
    if (!order) {
      throw 'have not order data';
    }

    return order.T_order_order_tablet_number;
  } catch (error) {
    // console.error(error);
    return 'have not tablet number';
  }
}

export function visibleCustomerCount(order) {
  const cnt = checkedTotalPeople(order);

  return cnt > 0;
}

export function checkedTotalPeople(order) {
  if (!order) return 0;
  return order.total_peoples;
}

export function isFirstEntered(order) {

  return order && order.is_tablet_first_order;
}

export function isFirstOrder(order) {
  return order && order.is_first_order;
}

export function getMsgTimeClass(order) {
  return {
    commited: this.checkedCommit(order),
  };
}

export function validCommitText(order) {
  const isCommit = this.checkedCommit(order);

  const msg = isCommit ? '확인' : '미확인';
  return msg;
}

export function checkedCommit(order) {
  // // console.log(order.commit);
  return order && order.commit;
}

export function getOrderTiem(order) {
  if (!order) {
    return '';
  }

  return order.order_time;
}

const productMethods = {
  getProductQty(product) {
    if (!product) return 0;
    return product.good_qty;
  },
  getProjectGoodName(product) {
    if (!product) return '';
    return product.good_name;
  },
  isProductMemoShow(product) {
    if(!product) return false;
    return product.memo_show;
  },
  getProductMemo(product) {
    if (!product) return '';
    return product.memo;
  },
  isProductOpt(product) {
    if(!product) return false;
    return product.option;
  },
  getOptionGoodQty(option) {
    if (!option) return 0;
    return option.good_qty;
  },
  getOptionDisplayName(option) {
    if (!option) return '';
    return option.display_name;
  },
};

const peopleMethods = {
  isPeopleCnt(people) {
    if (!people) return false;
    return people.count > 0;
  },
  getPeopleCnt(people) {
    if (!people) return 0;
    return people.count;
  },
  getPeopleName(people) {
    if (!people) return '';
    return people.name;
  },
};

const beforeProductMethods = {
  getBeforeProductDisplayName(cProduct) {
    if (!cProduct) return '';
    return cProduct.display_name;
  },
  getBeforeProductOrderQty(cProduct) {
    if (!cProduct) return 0;
    return cProduct.order_qty;
  },
  isBeforeProductOtp(cProduct) {
    if (!cProduct) return false;
    return cProduct.option;
  },
  getBeforeProductOptionOrderQty(option) {
    if (!option) return 0;
    return option.order_qty;
  },
  getBeforeProductOptionDisplayName(option) {
    if (!option) return '';
    return option.display_name;
  },
};

export const getRatingText = (type) => {
  try {
    if (!type) throw type;

    if (type === 'humans') return '직원 평가';

    if (type === 'goods') return '메뉴 평가';

    return '평가';
  } catch (error) {
    return '평가';
  }
};

export default {
  getTableNumberClass,
  checkedTabletNum,
  visibleCustomerCount,
  checkedTotalPeople,
  visibleCall,
  isDoneSetting,
  isFirstEntered,
  isFirstOrder,
  getMsgTimeClass,
  checkedCommit,
  validCommitText,
  getOrderTiem,
  isRating,
  getRatingText,
  ...productMethods,
  ...peopleMethods,
  ...beforeProductMethods,
};
