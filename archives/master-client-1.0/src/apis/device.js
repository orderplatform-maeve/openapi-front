import { customAxios } from "@utils/customAxios";
import endpoints from '@apis/endpoints';

export const postDeviceShopOpen = async (params) => {
  const url = endpoints.device.shopOpen;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceShopClose = async (params) => {
  const url = endpoints.device.shopClose;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceShopOpenOrder = async (params) => {
  const url = endpoints.device.shopOpenOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceShopCloseOrder = async (params) => {
  const url = endpoints.device.shopCloseOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceShowRecentOrder = async (params) => {
  const url = endpoints.device.showRecentOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceHideRecentOrder = async (params) => {
  const url = endpoints.device.hideRecentOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceShowKitchenOrder = async (params) => {
  const url = endpoints.device.showKitchenOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export const postDeviceHideKitchenOrder = async (params) => {
  const url = endpoints.device.hideKitchenOrder;
  const res =  await customAxios().post(url, params);

  return res;
};

export default {
  postDeviceShopOpen,
  postDeviceShopClose,
  postDeviceShopOpenOrder,
  postDeviceShopCloseOrder,
  postDeviceShowRecentOrder,
  postDeviceHideRecentOrder,
  postDeviceShowKitchenOrder,
  postDeviceHideKitchenOrder
};
