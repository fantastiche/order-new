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
          <span>账&nbsp&nbsp&nbsp号:</span><span class="title-info-detail">{{shopcode}}</span>
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
            <div @click="edit">编辑</div>
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
            <textarea placeholder="(选填)" v-model="remark" @blur="focusState = false" v-focus="focusState"></textarea>
          </div>
        </div>
      </div>
    </scroll>
    <div class="confirm-wrapper">
      <div class="confirm-info">
        <div class="confirm-info-left">
          <div>
            <span>原价:</span>
            <span>￥{{totalPrice}}.00</span>
          </div>
          <div>
            <span>折扣价:</span>
            <span>￥{{cutPrice}}</span>
          </div>
        </div>
        <div class="confirm-info-right">共{{num}}件</div>
      </div>
      <div class="confirm-btn">
        <button @click="confirm">确认订单</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'
  import CommonModel from '../../models/common-model'

  export default {
    components: {
      Scroll
    },
    directives: {
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.focus()
          }
        }
      }
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
        business: '',
        shopcode: '',
        shopname: '',
        orderSmoney: 0,
        focusState: false
      }
    },
    methods: {
      edit: function () {
        this.$router.push({
          path: '/shoppingCartList'
        })
      },
      focus: function () {
        console.log(this.$refs)
      },
      goHome: function () {
        this.$router.push({
          path: '/index'
        })
      },
      confirm: function () {
        let title = '确认订单后将无法修改，请确保您的订单正确再点击确认！'
        this.$emit('showMask', title)
      },
      submit: function () {
        let params = {
          shopcode: localStorage.getItem('shopcode'),
          remark: this.remark
        }
        CommonModel.submit(params, (res) => {
          this.$emit('hideMask')
          this.$router.push({
            path: '/orderList'
          })
        })
      }
    },
    created: function () {
      this.$nextTick(() => {
        this.business = localStorage.getItem('business')
        this.shopcode = localStorage.getItem('shopcode')
        this.shopname = localStorage.getItem('shopname')
      })
      let that = this
      let params = {
        shopcode: localStorage.getItem('shopcode')
      }
      console.log(params)
      CommonModel.getShopDiscount(params, (res) => {
        that.cutList = res.pd
        CommonModel.cartList(params, (res) => {
          that.totalPrice = res.pd.totalAmount
          that.list = res.pd.items
          that.list.forEach((item, index, array) => {
            let flag = false
            let flagTwo = false
            that.num += item.num
            if (item.fdiscount > 0) {
              flagTwo = true
              let cutPrice = item.price * (item.fdiscount / 100) * item.num
              that.cutPrice += cutPrice
            } else if (item.fprice > 0) {
              flagTwo = true
              let cutPrice = item.fprice * item.num
              that.cutPrice += cutPrice
            } else {
              if (that.cutList.categoryDiscount.length > 0) {
                that.cutList.categoryDiscount.forEach((item2, index2, array2) => {
                  if (item.categoryId === item2.categoryId.toString()) {
                    flag = true
                    let cutPrice = item.price * (item2.zk / 100) * item.num
                    that.cutPrice += cutPrice
                  }
                })
              }
            }
            if (flag === false && flagTwo === false) {
              let cutPrice = item.price * (that.cutList.shopDiscount.zk / 100) * item.num
              that.cutPrice += cutPrice
            }
          })
          that.cutPrice = that.cutPrice.toFixed(2)
          if (that.cutList.length === 0) {
            that.cutPrice = that.totalPrice.toFixed(2)
          }
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
            resize: none;
            -webkit-appearance: none;
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
      .confirm-info {
        flex-grow: 1;
        padding: 16/@rem 20/@rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .dpr-font(14px);
        .confirm-info-left {
          div {
            span:first-child {
              color: #333333;
            }
            span:nth-child(2) {
              color: #e54028;
            }
          }
          div:nth-child(2) {
            span:nth-child(2) {
              font-weight: bold;
            }
          }
        }
        .confirm-info-right {
          color: #777777;
        }
      }
      .confirm-btn {
        button {
          height: 100%;
          border: none;
          width: 236/@rem;
          .dpr-font(18px);
          color: #ffffff;
          background: #e54028;
        }
      }
    }
  }

  .scroll-content {
    height: 100%;
    overflow: hidden;
    background: #e9edf2;
  }
</style>
