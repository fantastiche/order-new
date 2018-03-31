<template>
  <div class="content">
    <scroll ref="wrapper" class="scroll-content">
      <div>
        <div class="header border-1px-ccc">
          <div class="header-store">
            <span>当前门店：</span>
            <span>{{shopname}}</span>
          </div>
          <div class="change-store" @click="changeStore">
            <span>切换门店</span>
          </div>
        </div>
        <div class="scan-blank">
          <div class="scan-wrapper" @click="scan">
            <div class="scan-btn">
              <img src="./icon_scan.png" alt="">
              <span>扫一扫商品条码</span>
            </div>
          </div>
        </div>
        <div class="btn-wrapper">
          <div class="or">
            <span>或</span>
          </div>
          <div class="btn-input">
            <input type="text" @click="scrollTo" v-model="barcode" placeholder="请输入商品条码" ref="btnInput">
            <button @click="sub">确认</button>
          </div>
        </div>
        <div class="change-wrapper">
          <span @click="exit">退出账号</span>
        </div>
      </div>
    </scroll>

    <div class="footer">
      <div class="btn-shopping-cart" @click="goCart">
        <div class="btn-shopping-cart-img">
          <img src="./icon_shopping1.png" alt="">
          <span class="number" v-show="num>0">{{num}}</span>
        </div>
        <span>购物车</span>
      </div>
      <div class="btn-order" @click="myOrder">我的订单</div>
    </div>
    <div class="mask" v-show="popState" @click="hidePop">
    </div>
    <div class="store-wrapper" v-show="popState">
      <div class="store-wrapper-title">
        <span>请选择门店</span>
        <img src="./icon_close.png" alt="" @click="hidePop">
      </div>
      <scroll class="list-wrapper">
        <div class="store-list">
          <div class="store-list-item" v-for="(item, index) in stores" @click="choose(item, index)">
            <span class="choose-off" :class="{'choose-on':item.checked}"></span>
            <span class="store-list-item-title">{{item.shopname}}</span>
          </div>
        </div>
      </scroll>
      <div class="store-btn">
        <button @click="confirmStore">确定</button>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" :title="'提示'" @on-hide="onHide">{{'您还没有登入，请点击确定跳转至登入页面！'}}</alert>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import CommonModel from '../../models/common-model'
  import Scroll from '../../components/Scroll/Scroll'
  import {Alert, TransferDomDirective as TransferDom} from 'vux'

  export default {
    components: {
      Scroll,
      Alert
    },
    directives: {
      TransferDom
    },
    data: function () {
      return {
        num: 0,
        barcode: '',
        shopname: '',
        stores: [],
        popState: false,
        show: false
      }
    },
    methods: {
      onHide: function () {
        this.$router.push({
          path: '/login'
        })
      },
      showPlugin: function () {
        this.$vux.alert.show()
      },
      scrollTo: function () {
        setTimeout(() => {
          this.$refs.wrapper.refresh()
          this.$refs.wrapper.scrollToElement(this.$refs.btnInput)
        }, 800)
      },
      confirmStore: function () {
        let shopcode
        this.stores.forEach((item, index, array) => {
          if (item.checked === true) {
            shopcode = item.shopcode
          }
        })
        this.popState = false
        let params = {
          username: shopcode,
          password: '888'
        }
        CommonModel.login(params, function (res) {
          localStorage.setItem('token', res.pd.token)
          localStorage.setItem('business', res.pd.business)
          localStorage.setItem('shopcode', res.pd.shopcode)
          localStorage.setItem('shopname', res.pd.shopname)
          location.reload()
        })
      },
      changeStore: function () {
        this.popState = true
      },
      hidePop: function () {
        this.popState = false
      },
      choose: function (item, index) {
        this.stores.forEach((store, i, array) => {
          store.checked = false
        })
        item.checked = !item.checked
        this.$set(this.stores, index, item)
      },
      exit: function () {
        localStorage.removeItem('shopcode')
        this.$router.push({
          path: '/login'
        })
      },
      goCart: function () {
        this.$router.push({
          path: '/shoppingCartList'
        })
      },
      myOrder: function () {
        this.$router.push({
          path: '/orderList'
        })
      },
      sub: function () {
        if (this.barcode) {
          let params = {
            barcode: this.barcode
          }
          this.$router.push({
            path: '/goodsDetail',
            query: params
          })
        } else if (!this.barcode) {
          this.$vux.alert.show({
            title: '提示',
            content: '请输入商品码'
          })
        }
      },
//      scan: function () {
//        let params = {
//          barcode: '11000155'
//        }
//        this.$router.push({
//          path: '/goodsDetail',
//          query: params
//        })
//      }
      scan: function () {
        let that = this
        this.$vux.loading.show({
          text: 'Loading'
        })
        let xhr = new XMLHttpRequest()
        xhr.open('get', 'https://cs1.gzqqs.com/qqs/weixin/shareToFriend.do?url=https://cs1.gzqqs.com/qqs/jsp/weixin/orderNew/dist/#/')
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
              let obj = JSON.parse(xhr.response).pd
              let signature = obj.signature
              let timestamp = obj.timeStamp
              let appId = obj.appId
              let noncestr = obj.nonceStr
              // 配置信息
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名
                jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
              })
            } else {
              // alert("微信分享签名出错: " + xhr.status);
              console.log('微信分享签名出错: ' + xhr.status)
            }
          }
        }
        xhr.send()
        wx.ready(function () {
          wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              that.$vux.loading.hide()
              // 回调
              if (res.resultStr.indexOf('/n') !== -1) {
                that.barcode = res.resultStr.split('/')[0]
              } else {
                that.barcode = res.resultStr
              }
              let params = {
                barcode: that.barcode
              }
              that.$router.push({
                path: '/goodsDetail',
                query: params
              })
            },
            error: function (res) {
              if (res.errMsg.indexOf('function_not_exist') > 0) {
                alert('版本过低请升级')
              }
            }
          })
          that.$vux.loading.hide()
        })
      }
    },
    created: function () {
      let that = this
      that.$vux.loading.hide()
      if (!localStorage.getItem('shopcode')) {
        that.show = true
      }
      that.shopname = localStorage.getItem('shopname')
      let params
      params = {
        shopcode: localStorage.getItem('shopcode')
      }
      CommonModel.cartList(params, (res) => {
        res.pd.items.forEach((item, index, array) => {
          that.num += item.num
        })
        CommonModel.otherStore(params, (res) => {
          that.stores = res.pd
          that.stores.forEach((item, index, array) => {
            item.checked = false
          })
        })
      })
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .scroll-content {
    height: 100%;
    overflow: hidden;
  }

  .scan-blank {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 90/@rem;
    .scan-wrapper {
      width: 310/@rem;
      height: 310/@rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(229, 64, 40, 0.4);
      box-shadow: 0 0 24/@rem 0 rgba(229, 64, 40, 0.3);
      .scan-btn {
        width: 290/@rem;
        height: 290/@rem;
        border-radius: 50%;
        background: #e54028;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          width: 100/@rem;
          height: 100/@rem;
        }
        span {
          .dpr-font(15px);
          color: #ffffff;
          margin-top: 36/@rem;
        }
      }
    }
  }

  .content {
    position: relative;
    font-family: -apple-system-font, "Microsoft YaHei UI";
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 88/@rem;
      line-height: 88/@rem;
      padding: 0 30/@rem;
      .dpr-font(14px);
      color: #e54028;
      .header-store {
        span:first-child {
          color: #333333;
        }
      }
      .change-store {
        .dpr-font(14px);
        color: #333333;
        border: 1px solid #333333;
        height: 58/@rem;
        text-align: center;
        width: 142/@rem;
        border-radius: 31/@rem;
        display: flex;
        justify-content: center;
        align-items: center;
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
        margin-top: 70/@rem;
        margin-bottom: 30/@rem;
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
        height: 78/@rem;
        input {
          border-radius: 44/@rem 0 0 44/@rem;
          .dpr-font(14px);
          border: 2/@rem solid #e54028;
          height: 74/@rem;
          padding-left: 40/@rem;
          outline: none;
          width: 368/@rem;
        }
        input::placeholder {
          color: #999999;
        }
        button {
          width: 150/@rem;
          height: 78/@rem;
          line-height: 78/@rem;
          text-align: center;
          color: #e54028;
          .dpr-font(15px);
          background: none;
          border: 2/@rem solid #e54028;
          border-left: none;
          border-radius: 0 44/@rem 44/@rem 0;
        }
      }
    }
    .change-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 100/@rem;
      padding-bottom: 130/@rem;
      span {
        .dpr-font(14px);
        color: #666666;
        text-decoration: underline;
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
        background: #fbf9fe;
        .btn-shopping-cart-img {
          position: relative;
          margin-right: 30/@rem;
          width: 40/@rem;
          height: 40/@rem;
          .number {
            left: 19/@rem;
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

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10010;
  }

  .store-wrapper {
    width: 600/@rem;
    height: 820/@rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #ffffff;
    border-radius: 20/@rem;
    z-index: 10011;
    .store-wrapper-title {
      height: 100/@rem;
      padding: 0 40/@rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dpr-font(17px);
      color: #333333;
      border-bottom: 1/@rem solid #dbdbdb;
      img {
        width: 36/@rem;
        height: 36/@rem;
      }
    }
    .list-wrapper {
      height: 530/@rem;
      overflow: hidden;
      margin: 30/@rem 0;
      padding: 0 40/@rem;
      .store-list {
        .store-list-item {
          display: flex;
          align-items: center;
          margin-bottom: 30/@rem;
          .choose-off {
            display: inline-block;
            width: 40/@rem;
            height: 40/@rem;
            background: url("./icon_check_o.png") no-repeat center;
            background-size: 40/@rem;
          }
          .choose-on {
            background: url("./icon_check_red.png") no-repeat center !important;
            background-size: 40/@rem !important;
          }
          .store-list-item-title {
            .dpr-font(15px);
            color: #333333;
            margin-left: 40/@rem;
          }
        }
      }
    }
    .store-btn {
      padding: 0 40/@rem;
      button {
        width: 100%;
        border: none;
        height: 88/@rem;
        background: #e54028;
        color: #ffffff;
        .dpr-font(17px);
        border-radius: 44/@rem;
      }
    }
  }
</style>
