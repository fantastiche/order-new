<template>
  <div class="content">
    <div class="title border-1px">
      <div></div>
      <span v-if="!editState" @click="editGoods">编辑</span>
      <span v-if="editState" @click="complete" class="complete">完成</span>
    </div>
    <scroll ref="wrapper" class="scroll-content" :data="list">
      <div class="main-body">
        <div v-if="!editState" class="item border-1px-e5" v-for="(item,index) in list">
          <img :src="item.picture" alt="">
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
                <input @blur="changeNum(item,index)" type="number" class="item-ctrl-num" v-model="item.num">
                <span class="item-ctrl-btn" @click="add(item,index)">+</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="editState" class="item border-1px-e5" v-for="(item,index) in list">
          <span class="icon-check-off" :class="{'icon-check-on':item.checked}" @click="check(item,index)"></span>
          <img :src="item.picture" alt="">
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
        <div>已选择({{chooseLength()}})</div>
      </div>
      <div class="bottom-edit-delete">
        <button @click="deleteGoods">删除</button>
      </div>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" :title="'提示'" @on-hide="onHide"> {{ '您的购物车为空，请点击确定返回首页扫码！'}}</alert>
    </div>
    <div v-if="cutShow">
      <div class="weui-mask" @click="cutCancel"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">温馨提示</strong>
        </div>
        <div class="weui-dialog__bd">
          <div class="dialog-content">
            <div class="dialog-content-item border-1px" v-for="(item,index) in cutList">
              <div class="dialog-title">
                <span>{{item.name}}</span>
                <span>再购买<span class="red">1</span>件，即可享受</span>
              </div>
              <div class="dialog-content-detail" v-html="item.text">

              </div>
            </div>
          </div>
        </div>
        <div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default"
                                        @click="cutCancel">返回</a> <a
          href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="cutConfirm">确定</a></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'
  import CommonModel from '../../models/common-model'
  import {Alert, Confirm, TransferDomDirective as TransferDom} from 'vux'

  export default {
    components: {
      Scroll,
      Alert,
      Confirm
    },
    directives: {
      TransferDom
    },
    data: function () {
      return {
        list: [],
        num: 0,
        totalPrice: 0,
        shopCode: '',
        editState: false,
        allFlag: false,
        show: false,
        cutList: [],
        cutShow: false
      }
    },
    methods: {
      cutCancel: function () {
        this.cutShow = false
      },
      cutConfirm: function () {
        this.cutShow = false
        this.$router.push({
          path: '/orderConfirm'
        })
      },
      onHide: function () {
        this.$router.push({
          path: '/index'
        })
      },
      showPlugin: function () {
        this.$vux.alert.show()
      },
      deleteGoods: function () {
        let title = '删除后不可恢复，确定要删除所选记录吗！'
        this.$emit('showMask', title)
      },
      changeNum: function (item, index) {
        let params = {
          shopcode: localStorage.getItem('shopcode'),
          goodsId: item.goodsId,
          num: item.num
        }
        CommonModel.edit(params, (res) => {
          if (res.result === '100') {
            this.init()
          }
        })
      },
      chooseLength: function () {
        let num = 0
        this.list.forEach((item, index, array) => {
          if (item.checked === true) {
            num += item.num
          }
        })
        return num
      },
      ifListNone: function () {
        if (this.list.length === 0) {
          this.show = true
        }
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
        if (item.num > 1) {
          item.num--
          let params = {
            shopcode: localStorage.getItem('shopcode'),
            goodsId: item.goodsId,
            num: item.num
          }
          CommonModel.edit(params, (res) => {
            if (res.result === '100') {
              this.init()
            }
          })
        } else {
          let params = {
            shopcode: localStorage.getItem('shopcode'),
            goodsId: item.goodsId
          }
          CommonModel.del(params, (res) => {
            this.init()
          })
        }
      },
      add: function (item, index) {
        item.num++
        let params = {
          shopcode: localStorage.getItem('shopcode'),
          goodsId: item.goodsId,
          num: item.num
        }
        CommonModel.edit(params, (res) => {
          if (res.result === '100') {
            this.init()
          }
        })
      },
      confirm: function () {
        let text = ''
        let flag = false
        let flagTwo = false
        let that = this
        let num = 0
        this.list.forEach((item, index, array) => {
          if (item.goodsId === 11000169 && item.num) {
            that.list.forEach((item2, index2, array2) => {
              if (item2.goodsId === 11000170) {
                num = item2.num
              }
            })
            if (num === 0) {
              flagTwo = true
              that.$vux.alert.show({
                title: '提示',
                content: '购买<span class="red">A套餐</span>必须选购<span class="red">B套餐</span>，点击按钮去选购！',
                buttonText: '去购买',
                onHide: function () {
                  that.$router.push({
                    path: '/goodsDetail',
                    query: {barcode: '11000170'}
                  })
                }
              })
            }
          } else if (item.goodsId === 11000170 && item.num) {
            that.list.forEach((item2, index2, array2) => {
              if (item2.goodsId === 11000169) {
                num = item2.num
              }
            })
            if (num === 0) {
              flagTwo = true
              that.$vux.alert.show({
                title: '提示',
                content: '购买<span class="red">B套餐</span>必须选购<span class="red">A套餐</span>，点击按钮去选购！',
                buttonText: '去购买',
                onHide: function () {
                  that.$router.push({
                    path: '/goodsDetail',
                    query: {barcode: '11000169'}
                  })
                }
              })
            }
          }
          if (item.goodsId === 11000169 && item.num < 3) {
            that.list.forEach((item2, index2, array2) => {
              if (item2.goodsId === 11000170) {
                num = item2.num
              }
            })
            if (num < 3 && num > 0) {
              flag = true
              if (item.num < 2 && item.num > 0) {
                text = '<span>① 面膜陈列货架<span class="red">78折</span>优惠</span><span>② 面膜宣传单<span class="red">200</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
              } else if (item.num >= 2 && item.num < 3) {
                text = '<span>① 面膜陈列货架<span class="red">68折</span>优惠</span><span>② 面膜宣传单<span class="red">300</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
              }
              this.cutList[0] = {
                name: 'A套餐',
                text: text
              }
              if (num < 2 && num > 0) {
                text = '<span>① 灯箱画布<span class="red">78折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">78折</span>优惠</span><span>③ 赠送<span class="red">1193元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">8</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
              } else if (num >= 2 && num < 3) {
                text = '<span>① 灯箱画布<span class="red">68折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">68折</span>优惠</span><span>③ 赠送<span class="red">2148元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">12</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
              }
              this.cutList[1] = {
                name: 'B套餐',
                text: text
              }
            } else if (num >= 3) {
              flag = true
              this.cutList = []
              if (item.num < 2 && item.num > 0) {
                text = '<span>① 面膜陈列货架<span class="red">78折</span>优惠</span><span>② 面膜宣传单<span class="red">200</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
              } else if (item.num >= 2 && item.num < 3) {
                text = '<span>① 面膜陈列货架<span class="red">68折</span>优惠</span><span>② 面膜宣传单<span class="red">300</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
              }
              this.cutList[0] = {
                name: 'A套餐',
                text: text
              }
            }
          } else if (item.goodsId === 11000169 && item.num >= 3) {
            that.list.forEach((item2, index2, array2) => {
              if (item2.goodsId === 11000170) {
                num = item2.num
              }
            })
            if (num < 3 && num > 0) {
              flag = true
              that.cutList = []
              if (num < 2 && num > 0) {
                text = '<span>① 灯箱画布<span class="red">78折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">78折</span>优惠</span><span>③ 赠送<span class="red">1193元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">8</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
              } else if (num >= 2 && num < 3) {
                text = '<span>① 灯箱画布<span class="red">68折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">68折</span>优惠</span><span>③ 赠送<span class="red">2148元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">12</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
              }
              this.cutList[0] = {
                name: 'B套餐',
                text: text
              }
            } else if (num > 3) {
              flag = false
            }
          }
//          if (item.goodsId === 11000169 && item.num > 3) {
//            that.list.forEach((item2, index2, array2) => {
//              if (item2.goodsId === 11000170) {
//                num = item2.num
//              }
//            })
//          }
//          if (item.goodsId === 11000169 && item.num < 3) {
//            that.list.forEach((item2, index2, array2) => {
//              if (item2.goodsId === 11000170) {
//                num = item2.num
//              }
//            })
//            if (num === 0) {
//              flagTwo = true
//              that.$vux.alert.show({
//                title: '提示',
//                content: '购买套装A必须选购套装B，点击按钮去选购！',
//                buttonText: '去购买',
//                onHide: function () {
//                  that.$router.push({
//                    path: '/goodsDetail',
//                    query: {barcode: '11000170'}
//                  })
//                }
//              })
//            } else {
//              flag = true
//              if (item.num < 2 && item.num > 0) {
//                text = '<span>① 面膜陈列货架<span class="red">78折</span>优惠</span><span>② 面膜宣传单<span class="red">200</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
//              } else if (item.num >= 2 && item.num < 3) {
//                text = '<span>① 面膜陈列货架<span class="red">68折</span>优惠</span><span>② 面膜宣传单<span class="red">300</span>张</span><span>③ 面膜宣传视频<span class="red">1</span>份</span>'
//              }
//              this.cutList[0] = {
//                name: item.goodsname,
//                text: text
//              }
//            }
//          } else if (item.goodsId === 11000170 && item.num < 3) {
//            that.list.forEach((item2, index2, array2) => {
//              if (item2.goodsId === 11000169) {
//                console.log('bbb')
//                num = item2.num
//              }
//            })
//            if (num === 0) {
//              flagTwo = true
//              that.$vux.alert.show({
//                title: '提示',
//                content: '购买套装B必须选购套装A，点击按钮去选购！',
//                buttonText: '去购买',
//                onHide: function () {
//                  that.$router.push({
//                    path: '/goodsDetail',
//                    query: {barcode: '11000169'}
//                  })
//                }
//              })
//            } else {
//              flag = true
//              if (item.num < 2 && item.num > 0) {
//                text = '<span>① 灯箱画布<span class="red">78折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">78折</span>优惠</span><span>③ 赠送<span class="red">1193元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">8</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
//              } else if (item.num >= 2 && item.num < 3) {
//                text = '<span>① 灯箱画布<span class="red">68折</span>优惠</span><span>② 礼盒陈列货柜<span class="red">68折</span>优惠</span><span>③ 赠送<span class="red">2148元</span>自选产品</span><span>④ 套盒配套精美折页<span class="red">12</span>套</span><span>⑤ 场景妆容宣传视频<span class="red">1</span>份</span>'
//              }
//              this.cutList[1] = {
//                name: item.goodsname,
//                text: text
//              }
//            }
//          }
        })
        console.log(flag)
        if (flag) {
          this.cutShow = true
        } else if (flagTwo) {
          console.log(flagTwo)
        } else {
          this.cutConfirm()
        }
      },
      init: function () {
        let that = this
        let params = {
          shopcode: localStorage.getItem('shopcode')
        }
        CommonModel.cartList(params, (res) => {
          that.list = res.pd.items
          that.ifListNone()
          that.num = 0
          that.cutList = []
          that.totalPrice = res.pd.totalAmount
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

  input {
    border-radius: 0 !important;
  }

  .dialog-content {
    color: #333333;

    .dialog-content-item {
      padding-bottom: 30/@rem;
      padding-top: 30/@rem;
      .dialog-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .dpr-font(15px);
        font-weight: bold;
        span:nth-child(2) {
          .dpr-font(13px);
          font-weight: normal;
        }
      }
      .dialog-content-detail {
        .dpr-font(13px);
        line-height: 40/@rem;
        margin-top: 10/@rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
      }
    }
    .dialog-content-item:last-child {
      &:after {
        display: none;
      }
    }
  }

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
      z-index: 999;
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
              color: #e54028;
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
              color: #777777;
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
      z-index: 999;
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

<style>
  .red {
    color: #e54028 !important;
  }
</style>
