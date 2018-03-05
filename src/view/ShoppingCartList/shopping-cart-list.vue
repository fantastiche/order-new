<template>
  <div class="content">
    <div class="title border-1px">
      <div></div>
      <span v-if="!editState" @click="editGoods">编辑</span>
      <span v-if="editState" @click="complete" class="complete">完成</span>
    </div>
    <scroll ref="wrapper" class="scroll-content">
      <div class="main-body">
        <div v-if="!editState" class="item border-1px-e5" v-for="(item,index) in list">
          <img src="./pic.jpg" alt="">
          <div class="item-info-wrapper">
            <div class="item-info-title">{{item.goodsname}}</div>
            <div class="item-info">
              <div class="item-info-color">
                <span>颜色：{{item.color}}</span>
              </div>
              <div class="item-info-total">
                <span>小计：</span>
                <span>￥{{item.je}}.00</span>
              </div>
            </div>
            <div class="item-ctrl-wrapper">
              <span class="item-ctrl-price">￥{{item.price}}.00</span>
              <div class="item-ctrl">
                <span class="item-ctrl-btn" @click="sub(item,index)">-</span>
                <input type="number" class="item-ctrl-num" v-model="item.num">
                <span class="item-ctrl-btn" @click="add(item,index)">+</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="editState" class="item border-1px-e5" v-for="(item,index) in list">
          <span class="icon-check-off" :class="{'icon-check-on':item.checked}" @click="check(item,index)"></span>
          <img src="./pic.jpg" alt="">
          <div class="item-info-wrapper-edit">
            <div class="item-info-title">
              <span>{{item.goodsname}}</span>
              <span>颜色：{{item.color}}</span>
            </div>
            <div class="item-ctrl-wrapper">
              <span class="item-ctrl-price">￥{{item.price}}.00</span>
              <span>×{{item.num}}</span>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="bottom" v-if="!editState">
      <div class="bottom-info">
        <span>共{{num}}件</span>
        <span>合计：</span>
        <span>￥{{totalPrice}}.00</span>
      </div>
      <div class="bottom-btn" @click="confirm">
        <button>提交订单</button>
      </div>
    </div>
    <div class="bottom-edit" v-if="editState">
      <div class="bottom-edit-info">
        <div class="bottom-edit-all">
          <span class="icon-check-off" :class="{'icon-check-on':allFlag}" @click="checkAll"></span>
          <span>全选</span>
        </div>
        <div>已选择(10)</div>
      </div>
      <div class="bottom-edit-delete">
        <button @click="deleteGoods">删除</button>
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
    data: function () {
      return {
        list: [],
        num: 0,
        totalPrice: 0,
        shopCode: '',
        editState: false,
        allFlag: false
      }
    },
    methods: {
      deleteGoods: function () {
        let title = '删除后不可恢复，确定要删除所选记录吗！'
        this.$emit('showMask', title)
      },
      submit: function () {
        this.list.forEach((item, index, array) => {
          let params = {
            shopcode: localStorage.getItem('shopcode'),
            goodsId: item.goodsId
          }
          if (item.checked) {
            CommonModel.del(params, (res) => {
              this.init()
              this.editState = false
            })
          }
          this.$emit('hideMask')
        })
      },
      checkAll: function () {
        console.log('aaa')
        if (!this.allFlag) {
          this.list.forEach((item, index, array) => {
            item.checked = true
            this.$set(this.list, index, item)
          })
          this.allFlag = true
        } else {
          this.list.forEach((item, index, array) => {
            item.checked = false
            this.$set(this.list, index, item)
          })
          this.allFlag = false
        }
      },
      check: function (item, index) {
        item.checked = !item.checked
        this.$set(this.list, index, item)
      },
      complete: function () {
        this.editState = false
      },
      editGoods: function () {
        this.editState = true
      },
      sub: function (item, index) {
        if (item.num > 0) {
          item.num--
          let goods = [{
            goodsId: item.goodsId,
            num: item.num
          }]
          let params = {
            shopcode: localStorage.getItem('shopcode'),
            goods: JSON.stringify(goods)
          }
          CommonModel.edit(params, (res) => {
            this.$set(this.list, index, item)
          })
        }
      },
      add: function (item, index) {
        let goods = [{
          goodsId: item.goodsId,
          num: 1
        }]
        let params = {
          shopcode: localStorage.getItem('shopcode'),
          goods: JSON.stringify(goods)
        }
        CommonModel.add(params, (res) => {
          console.log(res)
          item.num++
          this.$set(this.list, index, item)
        })
      },
      confirm: function () {
        this.$router.push({
          path: '/orderConfirm'
        })
      },
      init: function () {
        let that = this
        let params = {
          shopcode: localStorage.getItem('shopcode')
        }
        CommonModel.cartList(params, (res) => {
          console.log(res)
          that.totalPrice = res.pd.totalAmount
          that.list = res.pd.items
          res.pd.items.forEach((item, index, array) => {
            item.checked = false
            that.num += item.num
          })
        })
      }
    },
    watch: {
      list: function (val, old) {
        let all = true
        this.list.forEach((item, index, array) => {
          if (item.checked === false) {
            all = false
          }
        })
        this.allFlag = all
      }
    },
    created: function () {
      this.init()
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .content {
    position: relative;
    .title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 79/@rem;
      background: #ffffff;
      z-index: 10000;
      img {
        margin-left: 30/@rem;
      }
      span {
        margin-right: 30/@rem;
      }
    }
    .main-body {
      padding-top: 79/@rem;
      padding-bottom: 100/@rem;
      .item {
        display: flex;
        align-items: center;
        padding: 20/@rem 30/@rem;
        img {
          width: 178/@rem;
          height: 178/@rem;
          border: 1px solid #e5e5e5;
        }
        .item-info-wrapper {
          flex-grow: 1;
          margin-left: 20/@rem;
          .item-info-title {
            .dpr-font(16px);
            line-height: 42/@rem;
            color: #333333;
          }
          .item-info {
            display: flex;
            justify-content: space-between;
            .item-info-color {
              .dpr-font(12px);
              line-height: 42/@rem;
              color: #777777;
            }
            .item-info-total {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              span:first-child {
                .dpr-font(12px);
                line-height: 30/@rem;
                color: #333333;
              }
              span:nth-child(2) {
                .dpr-font(14px);
                line-height: 42/@rem;
                color: #e54028;
              }
            }
          }
          .item-ctrl-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .item-ctrl-price {
              .dpr-font(14px);
              line-height: 60/@rem;
              color: #e54028;
            }
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
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #ffffff;
      border-top: 1/@rem solid #dbdbdb;
      height: 99/@rem;
      z-index: 10000;
      .bottom-info {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20/@rem;
        span:first-child {
          .dpr-font(14px);
          color: #777777;
          margin-right: 30/@rem;
        }
        span:nth-child(2) {
          .dpr-font(14px);
          color: #333333;
        }
        span:nth-child(3) {
          .dpr-font(16px);
          color: #e54028;
        }
      }
      .bottom-btn {
        height: 100%;
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

  .complete {
    color: #fc9613 !important;
  }

  .scroll-content {
    height: 100%;
    overflow: hidden;
  }

  .bottom-edit {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-top: 1/@rem solid #dbdbdb;
    height: 99/@rem;
    z-index: 10000;
    .bottom-edit-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
      margin-right: 20/@rem;
      margin-left: 30/@rem;
      .dpr-font(14px);
      color: #333333;
      .bottom-edit-all {
        display: flex;
        align-items: center;
      }
    }
    .bottom-edit-delete {
      width: 236/@rem;
      height: 99/@rem;
      button {
        width: 100%;
        height: 100%;
        border: none;
        background: #fc9613;
        .dpr-font(17px);
        color: #ffffff;
      }
    }
  }

  .item-info-wrapper-edit {
    height: 180/@rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    margin-left: 20/@rem;
    .item-info-title {
      display: flex;
      flex-direction: column;
      span:first-child {
        .dpr-font(16px);
        line-height: 42/@rem;
        color: #333333;
      }
      span:nth-child(2) {
        .dpr-font(12px);
        line-height: 42/@rem;
        color: #777777;
      }
    }
    .item-ctrl-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60/@rem;
      span:first-child {
        .dpr-font(14px);
        line-height: 60/@rem;
        color: #e54028;
      }
      span:nth-child(2) {
        .dpr-font(14px);
        line-height: 60/@rem;
        color: #333333;
      }
    }
  }

  .icon-check-off {
    display: inline-block;
    width: 40/@rem;
    height: 40/@rem;
    background: url("./icon_check_o.png") no-repeat center;
    background-size: 40/@rem;
    margin-right: 20/@rem;
  }

  .icon-check-on {
    background: url("./icon_check.png") no-repeat center !important;
    background-size: 40/@rem !important;
  }
</style>
