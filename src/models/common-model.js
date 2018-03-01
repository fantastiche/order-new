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
  }
}

export default CommonModel
