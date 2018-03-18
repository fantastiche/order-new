<template>
  <div class="content">
    <div class="btn-home" @click="goHome">
      <img src="./icon_home1.png" alt="">
      <span>返回首页</span>
    </div>
    <div class="title" ref="topTitle">
      <div class="title-info">
        <div>
          <span>加盟商:</span><span class="title-info-detail">{{business}}</span>
        </div>
        <div>
          <span>订单号:</span><span class="title-info-detail">{{orderNo}}</span>
        </div>
        <div>
          <span>门&nbsp&nbsp&nbsp店:</span><span class="title-info-detail">{{shopname}}</span>
        </div>
      </div>
    </div>
    <scroll ref="wrapper" :startY="startY" class="scroll-content" :data="list">
      <div class="main-body">
        <div class="goods-list border-1px">
          <div class="goods-list-title border-1px">
            <div>
              <img src="./icon_shopping2.png" alt="">
              <span>已购商品</span>
            </div>
            <div></div>
          </div>
          <div class="goods-list-body">
            <div class="goods-list-body-item" v-for="(item, index) in list">
              <div class="goods-list-body-item-wrapper border-1px-e5">
                <img :src="item.picture" alt="">
                <div class="goods-list-body-item-info">
                  <div class="goods-list-body-item-info-title">
                    <span>{{item.goodsname}}</span>
                    <span>颜色：{{item.color}}</span>
                  </div>
                  <div class="goods-list-body-item-info-price">
                    <span>￥{{item.price}}.00</span>
                    <span>×{{item.num}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="remark">
          <div class="remark-title">
            <img src="./icon_write.png" alt="">
            <span>备注</span>
          </div>
          <div class="remark-body">
            <textarea readonly v-model="remark"></textarea>
          </div>
        </div>
      </div>
    </scroll>
    <div class="confirm-wrapper">
      <div class="confirm-btn" v-show="status===0">
        <button @click="cancel" class="btn-cancel">取消订单</button>
      </div>
      <div class="confirm-btn">
        <button @click="copyOrder">再次下单</button>
      </div>
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
          <div class="store-list-item" v-for="(item, index) in stores">
            <span class="choose-off" :class="{'choose-on':item.checked}" @click="choose(item, index)"></span>
            <span class="store-list-item-title">{{item.shopname}}</span>
          </div>
        </div>
      </scroll>
      <div class="store-btn">
        <button @click="confirmStore">确定</button>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" :title="'提示'" @on-hide="onHide">{{'您当前登入的门店与本单不一致，请返回首页切换门店！'}}</alert>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'
  import CommonModel from '../../models/common-model'
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
        list: [],
        startY: 0,
        cutList: [],
        cutPrice: 0,
        totalPrice: 0,
        num: 0,
        remark: '',
        stores: [],
        popState: false,
        status: 0,
        business: '',
        shopcode: '',
        shopname: '',
        orderNo: '',
        show: false
      }
    },
    methods: {
      onHide: function () {
        this.$router.push({
          path: '/login'
        })
      },
      copyOrder: function () {
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
      confirmStore: function () {
        let shopcode
        let that = this
        this.stores.forEach((item, index, array) => {
          if (item.checked === true) {
            shopcode = item.shopcode
          }
        })
        console.log(shopcode)
        this.popState = false
        let goods = []
        this.list.forEach((item, index, array) => {
          if (item.goodsId !== 19000092 && item.goodsId !== 19000093 && item.goodsId !== 19000094 && item.goodsId !== 19000095 && item.goodsId !== 19000096) {
            goods.push({
              goodsId: item.goodsId,
              num: item.num,
              price: item.price,
              categoryId: item.categoryId,
              goodsname: item.goodsname,
              color: item.color,
              picture: item.picture,
              je: parseInt(item.price) * parseInt(item.num),
              fdiscount: item.fdiscount,
              fprice: item.fprice,
              smoney: 0
            })
          }
        })
        let params = {
          shopcode: shopcode,
          goods: JSON.stringify(goods)
        }
        CommonModel.add(params, (res) => {
          localStorage.setItem('shopcode', shopcode)
          params = {
            username: shopcode,
            password: '888'
          }
          CommonModel.login(params, function (res) {
            localStorage.setItem('token', res.pd.token)
            localStorage.setItem('business', res.pd.business)
            localStorage.setItem('shopcode', res.pd.shopcode)
            localStorage.setItem('shopname', res.pd.shopname)
            that.$router.push({
              path: '/orderConfirm'
            })
          })
        })
      },
      goHome: function () {
        this.$router.push({
          path: '/index'
        })
      },
      cancel: function () {
        let title = '确定需要取消订单吗？确认后无法修改！'
        this.$emit('showMask', title)
      },
      submit: function () {
        let params = {
          orderno: this.$route.query.orderNo
        }
        CommonModel.orderCancel(params, (res) => {
          this.$emit('hideMask')
          this.$router.push({
            path: '/orderList'
          })
        })
      }
    },
    created: function () {
      this.$nextTick(() => {
      })
      let that = this
      let params = {
        orderno: this.$route.query.orderNo
      }
      CommonModel.orderDetail(params, (res) => {
        if (res.pd.shopcode !== localStorage.getItem('shopcode')) {
          that.show = true
        }
        that.list = res.pd.items
        that.business = localStorage.getItem('business')
        that.shopcode = localStorage.getItem('shopcode')
        that.shopname = localStorage.getItem('shopname')
        that.remark = res.pd.remark
        that.status = res.pd.order_status
        that.orderNo = res.pd.order_no
      })
      params = {
        shopcode: localStorage.getItem('shopcode')
      }
      CommonModel.otherStore(params, (res) => {
        that.stores = res.pd
        that.stores.forEach((item, index, array) => {
          item.checked = false
        })
      })
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .content {
    position: relative;
    height: 100%;
    .title {
      position: absolute;
      top: 0;
      left: 0;
      background: url("./bg_order.png") no-repeat center;
      background-size: 100%;
      width: 100%;
      height: 220/@rem;
      z-index: 10001;
      .title-info {
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 86/@rem;
        top: 56/@rem;
        span {
          .dpr-font(15px);
          line-height: 46/@rem;
          color: #333333;
        }
        .title-info-detail {
          margin-left: 44/@rem;
        }
      }
    }
    .btn-home {
      position: absolute;
      top: 20/@rem;
      right: 30/@rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 110/@rem;
      height: 110/@rem;
      border-radius: 50%;
      background: rgba(229, 64, 40, 0.9);
      box-shadow: 0 5/@rem 8/@rem 0 rgba(0, 0, 0, 0.3);
      z-index: 10002;
      img {
        width: 46/@rem;
        height: 46/@rem;
      }
      span {
        color: #ffffff;
        .dpr-font(10px);
      }
    }
    .main-body {
      padding-bottom: 150/@rem;
      padding-top: 220/@rem;
      .goods-list {
        margin-top: 20/@rem;
        background: #ffffff;
        .goods-list-title {
          display: flex;
          padding: 0 30/@rem;
          justify-content: space-between;
          align-items: center;
          height: 80/@rem;
          .dpr-font(14px);
          color: #333333;
          div:first-child {
            display: flex;
            align-items: center;
            img {
              width: 36/@rem;
              height: 36/@rem;
            }
            span {
              margin-left: 20/@rem;
            }
          }
          div:nth-child(2) {
            color: #777777;
          }
        }
        .goods-list-body {
          .goods-list-body-item {
            .goods-list-body-item-wrapper {
              display: flex;
              padding: 20/@rem 0;
              margin: 0 30/@rem;
              img {
                width: 178/@rem;
                height: 178/@rem;
                border: 1px solid #e5e5e5;
              }
              .goods-list-body-item-info {
                flex-grow: 1;
                margin-left: 20/@rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .goods-list-body-item-info-title {
                  display: flex;
                  flex-direction: column;
                  line-height: 42/@rem;
                  span:first-child {
                    .dpr-font(16px);
                    color: #333333;
                  }
                  span:nth-child(2) {
                    .dpr-font(12px);
                    color: #777777;
                  }
                }
                .goods-list-body-item-info-price {
                  display: flex;
                  justify-content: space-between;
                  line-height: 60/@rem;
                  span:first-child {
                    .dpr-font(14px);
                    color: #e54028;
                  }
                  span:last-child {
                    .dpr-font(14px);
                    color: #333333;
                  }
                }
              }
            }
          }
        }
      }
      .remark {
        margin-top: 20/@rem;
        background: #ffffff;
        display: flex;
        padding: 20/@rem 30/@rem;
        .remark-title {
          display: flex;
          width: 210/@rem;
          img {
            width: 37/@rem;
            height: 40/@rem;
          }
          span {
            .dpr-font(14px);
            color: #333333;
            margin-left: 20/@rem;
          }
        }
        .remark-body {
          flex-grow: 1;
          margin-right: 30/@rem;
          textarea {
            width: 100%;
            border: none;
            background: #f8f8f8;
            color: #333333;
            line-height: 36/@rem;
            border-radius: 20/@rem;
            .dpr-font(12px);
            padding: 10/@rem 20/@rem;
            outline: none;
            resize: none;
          }
          textarea::placeholder {
            color: #aaaaaa;
          }
        }
      }
    }
    .confirm-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      background: #ffffff;
      border-top: 1/@rem solid #e5e5e5;
      .confirm-btn {
        flex-grow: 1;
        button {
          width: 100%;
          height: 100/@rem;
          border: none;
          .dpr-font(18px);
          color: #ffffff;
          background: #e54028;
        }
        .btn-cancel {
          background: #fc9613;
        }
      }
    }
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

  .scroll-content {
    height: 100%;
    overflow: hidden;
    background: #e9edf2;
  }
</style>
