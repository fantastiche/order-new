import apiConfig from '../config/api-config'
import $http from '../util/api-util'

// 获取评分详情
function detail (params, successCallback, failCallback) {
  let api = apiConfig.detail
  $http(api, params, function (res) {
    successCallback(res.data)
  })
}

// 提交评分
function handin (params, successCallback, failCallback) {
  let api = apiConfig.handin
  $http(api, params, function (res) {
    successCallback(res.data)
  })
}

export {
  detail,
  handin
}
