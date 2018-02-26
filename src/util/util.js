import {base64encode} from './base64.js'
import b64_hmac_sha1 from './hmacsha1.js'

let TS = Date.parse(new Date())

// 构造加密key值
function structureKey (msg) {
  let cryptoKey = 'qqs/web-app'
  console.log(msg)
  let Str = b64_hmac_sha1(cryptoKey, msg)
  console.log('===========' + Str)
  let Base64Str = base64encode(Str)
  console.log('===========' + Base64Str)

  return Base64Str
}

export {
  structureKey,
  TS
}
