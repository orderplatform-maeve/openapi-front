function vaildGoodCode(order) {
  const isOrderInfo = order && order.order_info;
  const isEmptyOrderInfo = order.order_info.length > 0;
  const itemCode = isOrderInfo && isEmptyOrderInfo && order.order_info[0].good_code;

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
  const goodCode = vaildGoodCode(order);
  return getGoodType(goodCode);
}

export function visibleCall(order) {
  const goodCode = vaildGoodCode(order);
  const isCall = goodCode === '99999';
  return isCall;
}

export function isDoneSetting(order) {
  const goodCode = vaildGoodCode(order);
  const isDone = goodCode === '88888';
  return isDone;
}

export function checkedTabletNum(order) {
  try {
    if (!order) {
      throw 'have not order data';
    }

    return order.T_order_order_tablet_number;
  } catch (error) {
    console.error(error);
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

export function vaildCommitText(order) {
  const isCommit = this.checkedCommit(order);

  const msg = isCommit ? '확인' : '미확인';
  return msg;
}

export function checkedCommit(order) {
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
  vaildCommitText,
  getOrderTiem,
  ...productMethods,
  ...peopleMethods,
};
