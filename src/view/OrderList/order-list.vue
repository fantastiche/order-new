<template>
  <div class="content-wrapper">
    <scroll ref="wrapper" class="scroll-content" :data="list">
      <div class="content">
        <div class="order-item" :class="{'border-off': item.order_status===2}" v-for="(item, index) in list">
          <div class="order-item-shop">
            <div class="order-item-shop-wrapper">
              <span class="order-item-shop-icon" :class="{'order-item-shop-icon-off': item.order_status===2}"></span>
              <span :class="{'off': item.order_status===2}">{{item.shopname}}</span>
            </div>
            <div class="red-word" :class="{'off': item.order_status===2,'green-word':item.order_status===1}">
              {{status(item.order_status)}}
            </div>
          </div>
          <div class="order-item-warpper">
            <div class="order-item-info">
              <div>
                <span :class="{'off': item.order_status===2}">订单编号：</span><span :class="{'off': item.order_status===2}">{{item.order_no}}</span>
              </div>
              <div>
                <span :class="{'off': item.order_status===2}">折后总额：</span><span
                class="red-word" :class="{'grey-word': item.order_status===2}">￥{{item.order_sum}}</span>
              </div>
            </div>
            <div class="order-item-btn">
              <button :class="{'bg-off': item.order_status===2}" @click="detail(item.order_no)">查看详情</button>
            </div>
          </div>
          <div class="order-item-time" :class="{'off': item.order_status===2}">
            {{item.createtime}}
          </div>
        </div>
      </div>
    </scroll>
    <div class="header-btn" @click="goHome">
      <img src="./icon_home2.png" alt="" class="icon-home">
      <span>返回首页</span>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" :title="'提示'" @on-hide="onHide"> {{ '您还没有任何订单，请点击确定返回首页扫码购买！'}}</alert>
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
        show: false
      }
    },
    methods: {
      onHide: function () {
        this.$router.push({
          path: '/index'
        })
      },
      showPlugin: function () {
        this.$vux.alert.show()
      },
      goHome: function () {
        this.$router.push({
          path: '/index'
        })
      },
      detail: function (no) {
        this.$router.push({
          path: '/orderDetail',
          query: {
            orderNo: no
          }
        })
      },
      status: function (status) {
        if (status === 0) {
          return '未支付'
        } else if (status === 1) {
          return '已支付'
        } else if (status === 2) {
          return '已取消'
        }
      }
    },
    created: function () {
      let that = this
      let params = {
        shopcode: localStorage.getItem('shopcode')
      }
      CommonModel.orderList(params, (res) => {
        that.list = res.pd
        if (that.list.length === 0) {
          that.show = true
        }
      })
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .scroll-content {
    height: 100%;
    overflow: hidden;
    background: #f3f5f7;
  }

  .content-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    .header-btn {
      position: absolute;
      bottom: 100/@rem;
      right: 30/@rem;
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

  .icon-home {
    width: 46/@rem;
    height: 46/@rem;
  }

  .content {
    padding: 30/@rem;
    padding-bottom: 10/@rem;
    .order-item {
      padding: 40/@rem 30/@rem;
      background: #ffffff;
      border-radius: 10/@rem;
      box-shadow: 0 3/@rem 6/@rem 0 rgba(0, 0, 0, 0.25);
      border-left: 6/@rem solid #e54028;
      margin-bottom: 20/@rem;
      .order-item-shop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .dpr-font(14px);
        .order-item-shop-wrapper {
          display: flex;
          align-items: center;
          span:nth-child(2) {
            margin-left: 20/@rem;
            .dpr-font(16px);
            color: #333333;
          }
        }
      }
      .order-item-warpper {
        margin-left: 54/@rem;
        margin-top: 40/@rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .order-item-info {
          div {
            display: flex;
            span {
              .dpr-font(14px);
              line-height: 40/@rem;
              color: #333333;
            }
            span:nth-child(2) {
              margin-left: 10/@rem;
            }
          }
        }
        .order-item-btn {
          button {
            width: 180/@rem;
            height: 70/@rem;
            outline: none;
            border: none;
            background: #e54028;
            border-radius: 35/@rem;
            color: #ffffff;
            .dpr-font(14px);
          }
        }
      }
      .order-item-time {
        margin-top: 40/@rem;
        .dpr-font(12px);
        color: #999999;
      }
    }
  }

  .order-item-shop-icon {
    display: inline-block;
    width: 34/@rem;
    height: 30/@rem;
    background: url("./icon_shop.png") no-repeat center;
    background-size: 34/@rem 30/@rem;
  }

  .order-item-shop-icon-off {
    background: url("./icon_shop_off.png") no-repeat center !important;
    background-size: 34/@rem 30/@rem !important;
  }

  .red-word {
    color: #e54028 !important;
  }

  .grey-word {
    color: #777777 !important;
  }

  .green-word {
    color: #11c010 !important;
  }

  .off {
    color: #aaaaaa !important;
  }

  .bg-off {
    background: #aaaaaa !important;
  }

  .border-off {
    border-left: 6/@rem solid #aaaaaa !important;
  }
</style>
