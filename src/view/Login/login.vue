<template>
  <scroll ref="wrapper" class="scroll-content">

    <div class="content">
      <div class="title">
        <img src="./title1.png" alt="">
        <div>千千氏2018年度加盟商大会</div>
      </div>
      <div class="ctrl-area">
        <div class="ctrl-area-wrapper">
          <div class="input-wrapper">
            <img src="./icon_user.png" alt="">
            <div class="input-wrapper-two">
              <input type="text" placeholder="请输入门店补货账号" v-model="shopcode">
            </div>
          </div>
          <div class="ctrl-btn">
            <button @click="confirm">登入</button>
          </div>
        </div>
        <div class="logo">
          <img src="./logo.png" alt="">
        </div>
      </div>
      <div v-transfer-dom>
        <alert v-model="show" :title="'提示'" @on-hide="onHide">{{text}}</alert>
      </div>
      <div v-transfer-dom>
        <loading :show="loading" :text="'正在登入'"></loading>
      </div>
    </div>
  </scroll>
</template>

<script>
  import CommonModel from '../../models/common-model'
  import {Alert, Loading, TransferDomDirective as TransferDom} from 'vux'
  import Scroll from '../../components/Scroll/Scroll'

  export default {
    components: {
      Alert,
      Loading,
      Scroll
    },
    directives: {
      TransferDom
    },
    data: function () {
      return {
        shopcode: '',
        show: false,
        text: '',
        loading: false
      }
    },
    methods: {
      onHide: function () {
      },
      showPlugin: function () {
        this.$vux.alert.show()
      },
      confirm: function () {
        let that = this
        that.loading = true
        if (!this.shopcode) {
          that.loading = false
          this.text = '请输入您的门店账号！'
          this.show = true
        } else {
          let params = {
            username: this.shopcode,
            password: '888'
          }
          CommonModel.login(params, function (res) {
            if (res.result !== '100') {
              that.loading = false
              that.text = '请输入正确的订货账号！'
              that.show = true
            } else {
              localStorage.setItem('token', res.pd.token)
              localStorage.setItem('business', res.pd.business)
              localStorage.setItem('shopcode', res.pd.shopcode)
              localStorage.setItem('shopname', res.pd.shopname)
              that.loading = false
              that.$router.push({
                path: '/index'
              })
            }
          })
        }
      }
    },
    created: function () {
      if (localStorage.getItem('shopcode')) {
        this.$router.push({
          path: '/index'
        })
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .scroll-content {
    height: 100%;
    overflow: hidden;
  }

  .content {
    background: #f3f5f7;
    position: relative;
    width: 100%;
    height: 100%;
    background: url("./bg.jpg") no-repeat bottom;
    background-size: cover;
    .title {
      width: 100%;
      padding-top: 150/@rem;
      .dpr-font(18px);
      img {
        width: 100%;
      }
      div {
        margin-top: 36/@rem;
        text-align: center;
        .dpr-font(18px);
        font-weight: bold;
        letter-spacing: 0.1em;
        font-family: "PingFang SC";
      }
    }
    .ctrl-area {
      position: absolute;
      bottom: 0;
      flex-direction: column;
      align-items: center;
      width: 100%;
      .ctrl-area-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 30/@rem;
        .input-wrapper {
          position: relative;
          width: 100%;
          img {
            width: 40/@rem;
            height: 40/@rem;
            position: absolute;
            left: 30/@rem;
            top: 25/@rem;
          }
          .input-wrapper-two {
            width: 100%;
            display: flex;
            input {
              flex-grow: 1;
              border: none;
              outline: none;
              height: 90/@rem;
              border-radius: 45/@rem;
              padding-left: 90/@rem;
              padding-right: 30/@rem;
              box-shadow: 0 8/@rem 16/@rem 0 rgba(7, 43, 88, 0.4);
            }
          }
        }
        .ctrl-btn {
          width: 100%;
          margin-top: 60/@rem;
          button {
            width: 100%;
            border: none;
            outline: none;
            border-radius: 45/@rem;
            height: 90/@rem;
            background: #e54028;
            color: #ffffff;
            .dpr-font(17px);
            box-shadow: 0 8/@rem 16/@rem 0 rgba(7, 43, 88, 0.4);
          }
        }
      }
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 270/@rem;
      img {
        width: 111/@rem;
        height: 120/@rem;
      }
    }
  }
</style>
