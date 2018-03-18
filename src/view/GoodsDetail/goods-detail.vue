<template>
  <div class="content-wrapper">
    <scroll ref="wrapper" class="scroll-content" :data="list">
      <div class="content">
        <div class="header">
          <div class="header-btn" @click="goOrder">
            <img src="./icon_order.png" alt="" class="icon-order">
            <span>我的订单</span>
          </div>
          <div class="header-btn" @click="scan">
            <img src="./icon_scan.png" alt="" class="icon-home">
            <span>扫商品码</span>
          </div>
        </div>
        <swiper :list="picList" style="width:100%;margin:0 auto;" :aspect-ratio="750/750" dots-position="center"
                :show-desc-mask="false" class="border-1px"></swiper>
        <div class="title border-1px">
          <div class="title-name">{{goodsname}}</div>
          <div class="title-price">
            <span class="title-price-symbol">￥</span>
            <span class="title-price-num">{{adviceprice}}.00</span>
          </div>
        </div>
        <div class="item border-1px" v-for="(item,index) in list">
          <div class="item-title">{{item.color}}</div>
          <div class="item-ctrl">
            <span class="item-ctrl-btn" @click="sub(item,index)">-</span>
            <input type="number" class="item-ctrl-num" v-model="item.num" @click="inputNum(item,index)"
                   @blur="changeNum(item,index)">
            <span class="item-ctrl-btn" @click="add(item,index)">+</span>
          </div>
        </div>
        <div class="blank"></div>
      </div>
    </scroll>
    <div class="footer">
      <div class="btn-shopping-cart" @click="goShoppingCart">
        <div class="btn-shopping-cart-img">
          <img src="./icon_shopping1.png" alt="">
          <transition name="bounce">
            <span class="number" v-show="num>0&&flag">{{num}}</span>
          </transition>
        </div>
        <span>购物车</span>
      </div>
      <div class="footer-total">
        <div class="footer-total-price">
          <span>合计 :</span>
          <span>￥{{totalPrice}}.00</span>
        </div>
        <div class="footer-total-num">共{{num}}件</div>
      </div>
      <div class="footer-add" @click="addCart">加入购物车</div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'
  import {Swiper} from 'vux'
  import CommonModel from '../../models/common-model'
  import wx from 'weixin-js-sdk'

  export default {
    components: {
      Scroll,
      Swiper
    },
    data: function () {
      return {
        picList: [],
        list: [],
        goodsname: '',
        adviceprice: '',
        totalPrice: 0,
        totalNum: 0,
        num: 0,
        flag: false,
        shopCode: '',
        barcode: ''
      }
    },
    methods: {
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
                code: that.barcode
              }
//              that.$router.reload({
//                path: '/goodsDetail',
//                query: params
//              })
              that.init(params)
            },
            error: function (res) {
              if (res.errMsg.indexOf('function_not_exist') > 0) {
                alert('版本过低请升级')
              }
            }
          })
          that.$vux.loading.hide()
        })
      },
      goHome: function () {
        this.$router.push({
          path: '/index'
        })
      },
      goOrder: function () {
        this.$router.push({
          path: '/orderList'
        })
      },
      goShoppingCart: function () {
        this.$router.push({
          path: '/shoppingCartList',
          query: {
            shopCode: this.shopCode
          }
        })
      },
      inputNum: function (item, index) {
        if (item.num === 0) {
          item.num = ''
          this.$set(this.list, index, item)
        }
      },
      changeNum: function (item, index) {
        if (item.num === '') {
          item.num = 0
          this.$set(this.list, index, item)
        }
      },
      sub: function (item, index) {
        if (item.num > 0) {
          item.num--
          this.$set(this.list, index, item)
        }
      },
      add: function (item, index) {
        item.num++
        this.$set(this.list, index, item)
      },
      addCart: function () {
        let that = this
        let goods = []
        this.list.forEach((item, index, array) => {
          if (item.num > 0) {
            this.num += item.num
            goods.push({
              goodsId: item.goodsId,
              num: parseInt(item.num),
              price: parseInt(item.adviceprice),
              categoryId: item.categoryId,
              goodsname: item.goodsname,
              color: item.color,
              picture: that.picture,
              je: parseInt(item.adviceprice) * parseInt(item.num),
              fdiscount: item.fdiscount,
              fprice: item.fprice,
              smoney: 0
            })
          }
        })
        console.log(goods)
        if (goods.length === 0) {
          that.$vux.toast.show({
            text: '商品数量不能为0！',
            type: 'warn'
          })
        } else {
          let params = {
            shopcode: localStorage.getItem('shopcode'),
            goods: JSON.stringify(goods)
          }
          CommonModel.add(params, (res) => {
            that.$vux.toast.show({
              text: '添加成功！'
            })
            params = {
              shopcode: localStorage.getItem('shopcode')
            }
            CommonModel.cartList(params, (res) => {
              console.log(res)
              that.totalPrice = res.pd.totalAmount
              that.num = 0
              res.pd.items.forEach((item, index, array) => {
                that.num += item.num
              })
              this.flag = false
              setTimeout(() => {
                this.flag = true
              }, 10)
            })
          })
          this.list.forEach((item, index, array) => {
            item.num = 0
          })
        }
      },
      init: function (params) {
        let that = this
        that.picList = []
        that.num = 0
        CommonModel.goodsscan(params, function (res) {
          console.log(res)
          if (res.pd.length === 0) {
            console.log('aaa')
            that.$vux.alert.show({
              title: '提示',
              content: '无此商品，请点击确定返回首页！',
              onHide: function () {
                that.$router.push({
                  path: '/index'
                })
              }
            })
          }
          that.list = res.pd
          that.adviceprice = that.list[0].adviceprice
          that.goodsname = that.list[0].goodsname
          that.list.forEach((item, index, array) => {
            item.num = 0
            if (item.picture) {
              let img = item.picture.split('?')[0] + '?x-oss-process=image/resize,m_lfit,h_750,w_750'
              let imgSmall = item.picture.split('?')[0] + '?x-oss-process=image/resize,m_lfit,h_100,w_100'
              that.picture = imgSmall
              that.picList.push({
                url: 'javascript:',
                img: img
              })
            }
          })
          params = {
            shopcode: localStorage.getItem('shopcode')
          }
          CommonModel.cartList(params, (res) => {
            console.log(res)
            that.totalPrice = res.pd.totalAmount
            res.pd.items.forEach((item, index, array) => {
              that.num += parseInt(item.num)
            })
            if (that.num > 0) {
              that.flag = true
            }
          })
        }, function (res) {
        }, localStorage.getItem('token'))
      }
    },
    created: function () {
      let params = {
        code: this.$route.query.barcode
      }
      this.init(params)
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .content-wrapper {
    position: relative;
    .content {
      .header {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        display: flex;
        width: 100%;
        justify-content: space-between;
        .header-btn {
          margin: 20/@rem 30/@rem;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 110/@rem;
          height: 110/@rem;
          box-shadow: 0 5/@rem 8/@rem 0 rgba(0, 0, 0, 0.3);
          span {
            .dpr-font(10px);
            color: #333;
            margin-top: 3/@rem;
          }
        }
      }
      .title {
        padding: 30/@rem;
        .title-name {
          color: #333333;
          .dpr-font(16px);
        }
        .title-price {
          .title-price-symbol {
            .dpr-font(14px);
            color: #e54028;
          }
          .title-price-num {
            .dpr-font(18px);
            color: #e54028;
          }
        }
      }
      .item {
        display: flex;
        padding: 0 30/@rem;
        height: 116/@rem;
        justify-content: space-between;
        align-items: center;
        .item-ctrl {
          display: flex;
          height: 58/@rem;
          text-align: center;
          .dpr-font(14px);
          .item-ctrl-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 66/@rem;
            border: 1px solid #cccccc;
            background: #f5f5f5;
            .dpr-font(18px);
          }
          .item-ctrl-num {
            width: 114/@rem;
            line-height: 56/@rem;
            border: none;
            border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
            text-align: center;
            outline: none;
            -webkit-appearance: none;
          }
          .item-ctrl-btn:first-child {
            border-radius: 8/@rem 0 0 8/@rem;
          }
          .item-ctrl-btn:nth-child(3) {
            border-radius: 0 8/@rem 8/@rem 0;
          }
        }
      }
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 99/@rem;
      background: #ffffff;
      width: 100%;
      display: flex;
      .btn-shopping-cart {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        border-top: 1/@rem solid #cccccc;
        border-right: 1/@rem solid #cccccc;
        width: 126/@rem;
        padding-bottom: 3/@rem;
        .btn-shopping-cart-img {
          position: relative;
          width: 40/@rem;
          height: 40/@rem;
          .number {
            left: 20/@rem;
            top: -14/@rem;
            z-index: 9999;
          }
          img {
            width: 40/@rem;
            height: 40/@rem;
          }
        }
        span {
          .dpr-font(11px);
          color: #666666;
        }
      }
      .footer-total {
        border-top: 1/@rem solid #cccccc;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        padding-right: 20/@rem;
        .footer-total-price {
          span {
            .dpr-font(15px);
            color: #e54028;
          }
          span:first-child {
            .dpr-font(12px);
            color: #666666;
          }
        }
        .footer-total-num {
          .dpr-font(12px);
          color: #666666;
        }

      }
      .footer-add {
        width: 300/@rem;
        background-color: #e54028;
        height: 100/@rem;
        line-height: 100/@rem;
        text-align: center;
        color: #ffffff;
        .dpr-font(18px);
      }
    }
  }

  .blank {
    height: 95/@rem;
  }

  .scroll-content {
    height: 100%;
    overflow: hidden;
  }

  .icon-order {
    width: 42/@rem;
    height: 44/@rem;
  }

  .icon-home {
    width: 46/@rem;
    height: 46/@rem;
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

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
<style>
  .vux-icon-dot {
    background-color: #cccccc !important;
  }

  .vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active {
    background-color: #e54028 !important;
  }
</style>
