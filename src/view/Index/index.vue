<template>
  <div class="content">
    <div class="header">
      <span></span>
      <span>切换账号</span>
    </div>
    <div class="intro">
      <img src="./pic_phone.png" alt="">
    </div>
    <div class="btn-wrapper">
      <button class="btn-scan" @click="scan">扫一扫商品条码</button>
      <div class="or">
        <span>或</span>
      </div>
      <div class="btn-input">
        <input type="text" v-model="barcode" placeholder="请输入商品条码">
        <button @click="sub">确认</button>
      </div>
    </div>
    <div class="footer">
      <div class="btn-shopping-cart">
        <div class="btn-shopping-cart-img">
          <img src="./icon_shopping1.png" alt="">
          <span class="number" v-show="num>0">{{num}}</span>
        </div>
        <span>购物车</span>
      </div>
      <div class="btn-order">我的订单</div>
    </div>
  </div>
</template>

<script>
  //  import wx from 'weixin-js-sdk'
  import CommonModel from '../../models/common-model'

  export default {
    data: function () {
      return {
        num: 0,
        barcode: ''
      }
    },
    methods: {
      sub: function () {
        let params = {
          barcode: this.barcode
        }
        this.$router.push({
          path: '/goodsDetail',
          query: params
        })
      },
      scan: function () {
        let params = {
          barcode: '10125908'
        }
        this.$router.push({
          path: '/goodsDetail',
          query: params
        })
      }
//      scan: function () {
//        let xhr = new XMLHttpRequest()
//        xhr.open('get', 'https://cs1.gzqqs.com/qqs/weixin/shareToFriend.do?url=https://cs1.gzqqs.com/qqs/jsp/weixin/orderNew/dist/#/')
//        xhr.onreadystatechange = function () {
//          if (xhr.readyState === 4) {
//            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
//              let obj = JSON.parse(xhr.response).pd
//              let signature = obj.signature
//              let timestamp = obj.timeStamp
//              let appId = obj.appId
//              let noncestr = obj.nonceStr
//              // 配置信息
//              wx.config({
//                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                appId: appId, // 必填，公众号的唯一标识
//                timestamp: timestamp, // 必填，生成签名的时间戳
//                nonceStr: noncestr, // 必填，生成签名的随机串
//                signature: signature, // 必填，签名
//                jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
//              })
//            } else {
//              // alert("微信分享签名出错: " + xhr.status);
//              console.log('微信分享签名出错: ' + xhr.status)
//            }
//          }
//        }
//        xhr.send()
//        wx.ready(function () {
//          wx.scanQRCode({
//            desc: 'scanQRCode desc',
//            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
//            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
//            success: function (res) {
//              // 回调
//              alert(res.resultStr.split(',')[1])
//              alert(res)
//              alert(JSON.stringify(res))
//            },
//            error: function (res) {
//              if (res.errMsg.indexOf('function_not_exist') > 0) {
//                alert('版本过低请升级')
//              }
//            }
//          })
//        })
//      }
    },
    created: function () {
      let that = this
      let params = {
        username: 'B00009',
        password: '888'
      }
      CommonModel.login(params, function (res) {
        console.log(res)
        localStorage.setItem('token', res.token)
        params = {
          shopcode: 'B00009'
        }
        CommonModel.cartList(params, (res) => {
          res.pd.items.forEach((item, index, array) => {
            that.num += item.num
          })
        })
      })
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .content {
    position: relative;
    font-family: -apple-system-font, "Microsoft YaHei UI";
    .header {
      height: 100/@rem;
      line-height: 100/@rem;
      display: flex;
      justify-content: space-between;
      padding-right: 30/@rem;
      span {
        .dpr-font(14px);
        color: #333333;
        text-decoration: underline;
      }
    }
    .intro {
      display: flex;
      justify-content: center;
      margin-bottom: 40/@rem;
      img {
        width: 280/@rem;
        height: 280/@rem;
      }
    }
    .btn-wrapper {
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding: 0 50/@rem;
      .btn-scan {
        height: 90/@rem;
        line-height: 90/@rem;
        .dpr-font(17px);
        background: #e54028;
        border: none;
        border-radius: 45/@rem;
        box-shadow: 0 8/@rem 16/@rem 0 rgba(247, 56, 28, 0.4);
        color: #ffffff;
      }
      .or {
        height: 100/@rem;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          width: 50/@rem;
          height: 50/@rem;
          line-height: 50/@rem;
          text-align: center;
          border-radius: 50%;
          background: #f3f5f7;
          .dpr-font(16px);
          color: #666666;
        }
      }
      .btn-input {
        display: flex;
        justify-content: center;
        height: 88/@rem;
        input {
          border-radius: 44/@rem 0 0 44/@rem;
          .dpr-font(14px);
          border: 2/@rem solid #e54028;
          height: 84/@rem;
          padding-left: 40/@rem;
          outline: none;
          flex-grow: 1;
        }
        input::placeholder {
          color: #999999;
        }
        button {
          width: 200/@rem;
          height: 88/@rem;
          line-height: 88/@rem;
          text-align: center;
          color: #e54028;
          .dpr-font(17px);
          background: none;
          border: 2/@rem solid #e54028;
          border-left: none;
          border-radius: 0 44/@rem 44/@rem 0;
        }
      }
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      height: 100/@rem;
      width: 100%;
      justify-content: space-between;
      .dpr-font(17px);
      .btn-shopping-cart {
        width: 50%;
        border-top: 2/@rem solid #cccccc;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-shopping-cart-img {
          position: relative;
          margin-right: 30/@rem;
          width: 40/@rem;
          height: 40/@rem;
          .number {
            left: 15/@rem;
            top: -14/@rem;
            z-index: 9999;
          }
          img {
            width: 40/@rem;
            height: 40/@rem;
          }
        }
        span {
          color: #333333;
        }
      }
      .btn-order {
        width: 50%;
        text-align: center;
        line-height: 100/@rem;
        background: #e54028;
        color: #ffffff;
      }
    }
  }

  .number {
    position: absolute;
    .dpr-font(10px);
    border: 1px solid #ffffff;
    background: #e54028;
    height: 28/@rem;
    line-height: 28/@rem;
    min-width: 28/@rem;
    text-align: center;
    color: #ffffff !important;
    border-radius: 14/@rem;
  }
</style>
