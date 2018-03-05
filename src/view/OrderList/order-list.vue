<template>
  <scroll ref="wrapper" class="scroll-content">
    <div class="content">
      <div class="order-item" :class="{'border-off': item.order_status===2}" v-for="(item, index) in list">
        <div class="order-item-shop">
          <div class="order-item-shop-wrapper">
            <span class="order-item-shop-icon" :class="{'order-item-shop-icon-off': item.order_status===2}"></span>
            <span :class="{'off': item.order_status===2}">{{item.shopname}}</span>
          </div>
          <div class="red-word" :class="{'off': item.order_status===2}">{{status(item.order_status)}}</div>
        </div>
        <div class="order-item-warpper">
          <div class="order-item-info">
            <div>
              <span :class="{'off': item.order_status===2}">订单编号：</span><span :class="{'off': item.order_status===2}">{{item.order_no}}</span>
            </div>
            <div>
              <span :class="{'off': item.order_status===2}">共计金额：</span><span
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
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'
  import CommonModel from '../../models/common-model'

  export default {
    components: {
      Scroll
    },
    data: function () {
      return {
        list: [0, 0, 0, 0, 0]
      }
    },
    methods: {
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
