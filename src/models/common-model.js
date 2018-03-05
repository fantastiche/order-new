import apiConfig from '../config/api-config'
import $http from '../util/api-util'

const CommonModel = {
  // 登入
  login: function (params, successCallback, failCallback, token) {
    let api = apiConfig.login
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 扫码
  goodsscan: function (params, successCallback, failCallback, token) {
    let api = apiConfig.goodsscan
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 购物车添加商品
  add: function (params, successCallback, failCallback, token) {
    let api = apiConfig.add
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 购物车编辑商品
  edit: function (params, successCallback, failCallback, token) {
    let api = apiConfig.edit
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 购物车编辑商品
  del: function (params, successCallback, failCallback, token) {
    let api = apiConfig.del
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 购物车列表
  cartList: function (params, successCallback, failCallback, token) {
    let api = apiConfig.cartList
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 获取折扣
  getShopDiscount: function (params, successCallback, failCallback, token) {
    let api = apiConfig.getShopDiscount
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 确认订单
  submit: function (params, successCallback, failCallback, token) {
    let api = apiConfig.submit
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 订单列表
  orderList: function (params, successCallback, failCallback, token) {
    let api = apiConfig.orderList
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 订单详情
  orderDetail: function (params, successCallback, failCallback, token) {
    let api = apiConfig.orderDetail
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 订单取消
  orderCancel: function (params, successCallback, failCallback, token) {
    let api = apiConfig.orderCancel
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  },
  // 其他店铺
  otherStore: function (params, successCallback, failCallback, token) {
    let api = apiConfig.otherStore
    $http(api, params, function (res) {
      successCallback(res.data)
    }, token)
  }
}

export default CommonModel
