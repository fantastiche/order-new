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
  }
}

export default CommonModel
