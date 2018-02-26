import config from '../config/config'
import axios from 'axios'

/**
 * 接口地址构造
 * @param {string} path 接口地址
 * @returns {string} 完整地址
 */
function structureApiUrl(path) {
  let url = config.protocol + '://' + config.host + config.basePath + path

  return url
}

/**
 * 使用axios进行网络请求
 * @param api 接口api
 * @param params 参数
 * @param successCallback 成功回调
 */
function httpRequest(api, params, successCallback) {
  let url = structureApiUrl(api.path)
  // 若url中包含 :id ，则用data中的id值替换，并且将id从data中删除
  if (url.indexOf(':id') > -1) {
    url = url.replace(':id', JSON.parse(JSON.stringify(params.id)));
    delete params.id;
  }
  console.log(params)
  axios({
    method: api.method,
    url: url,
    params: params
  }).then(function (res) {
    successCallback(res)
  })
}

export default httpRequest

export {
  structureApiUrl,
  httpRequest
}
