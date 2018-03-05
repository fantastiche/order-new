<template>
  <div class="content-wrapper">
    <scroll ref="wrapper" class="scroll-content">
      <div class="content">
        <div class="header">
          <div class="header-btn" @click="goOrder">
            <img src="./icon_order.png" alt="" class="icon-order">
            <span>我的订单</span>
          </div>
          <div class="header-btn" @click="goHome">
            <img src="./icon_home2.png" alt="" class="icon-home">
            <span>返回首页</span>
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

  const imgList = [
    'https://cs1.gzqqs.com/qqs/jsp/weixin/demo/pic.jpg',
    'https://cs1.gzqqs.com/qqs/jsp/weixin/demo/pic.jpg'
  ]

  const demoList = imgList.map((one, index) => ({
    url: 'javascript:',
    img: one
  }))

  export default {
    components: {
      Scroll,
      Swiper
    },
    data: function () {
      return {
        picList: demoList,
        list: [],
        goodsname: '',
        adviceprice: '',
        totalPrice: 0,
        totalNum: 0,
        num: 0,
        flag: false,
        shopCode: 'B00009'
      }
    },
    methods: {
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
              num: item.num
            })
          }
        })
        let params = {
          shopcode: 'B00009',
          goods: JSON.stringify(goods)
        }
        CommonModel.add(params, (res) => {
          params = {
            shopcode: 'B00009'
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
    created: function () {
      let that = this
      let params = {
        barcode: this.$route.query.barcode
      }
      console.log(params)
      CommonModel.goodsscan(params, function (res) {
        console.log(res)
        that.list = res.pd
        that.adviceprice = that.list[0].adviceprice
        that.goodsname = that.list[0].goodsname
        that.list.forEach((item, index, array) => {
          item.num = 0
        })
        params = {
          shopcode: localStorage.getItem('shopcode')
        }
        CommonModel.cartList(params, (res) => {
          console.log(res)
          that.totalPrice = res.pd.totalAmount
          res.pd.items.forEach((item, index, array) => {
            that.num += item.num
            that.list.forEach((item2, index2, array2) => {
              if (item2.goodsId === item.goodsId) {
                item2.num = item.num
              }
            })
          })
          if (that.num > 0) {
            that.flag = true
          }
        })
      }, function (res) {
      }, localStorage.getItem('token'))
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
        padding: 28/@rem 30/@rem;
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
