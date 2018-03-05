<template>
  <div style="height: 100%">
    <transition :name="transitionName">
      <router-view ref="child" class="child-view" v-on:showMask="showMask" v-on:hideMask="hideMask"></router-view>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="maskFlag" @click="hideMask"></div>
    </transition>
    <transition name="fade">
      <div class="pop" v-show="maskFlag">
        <div class="pop-title">提示</div>
        <div class="pop-content">
          <div><img src="./icon_caution.png" alt="">
            {{text}}
          </div>
        </div>
        <div class="pop-ctrl">
          <button @click="hideMask">取消</button>
          <button @click="sub">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        transitionName: 'slide-left',
        maskFlag: false,
        text: '删除后不可恢复，确定要删除所选记录吗？'
      }
    },
    beforeRouteUpdate: function (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
      next()
    },
    methods: {
      showMask: function (title) {
        this.text = title
        this.maskFlag = true
      },
      hideMask: function () {
        this.maskFlag = false
      },
      sub: function () {
        this.$refs.child.submit()
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

  .pop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 590/@rem;
    height: 320/@rem;
    background: #ffffff;
    border-radius: 20/@rem;
    z-index: 10011;
    .pop-title {
      height: 106/@rem;
      line-height: 106/@rem;
      text-align: center;
      .dpr-font(18px);
      font-weight: bold;
      color: #333333;
    }
    .pop-content {
      padding: 0 40/@rem;
      display: flex;
      align-items: flex-start;
      margin-bottom: 36/@rem;
      img {
        width: 30/@rem;
        height: 32/@rem;
        margin-right: 10/@rem;
      }
      div {
        text-align: center;
        .dpr-font(15px);
        line-height: 44/@rem;
        color: #333333;
      }
    }
    .pop-ctrl {
      display: flex;
      height: 90/@rem;
      border-top: 1px solid #e5e5e5;
      button {
        flex-grow: 1;
        border: none;
        background: #ffffff;
        .dpr-font(17px);
      }
      button:first-child {
        border-right: 1px solid #e5e5e5;
        border-radius: 0 0 0 20/@rem;
      }
      button:nth-child(2) {
        border-right: 1px solid #e5e5e5;
        border-radius: 0 0 20/@rem 0;
        color: #e54028;
      }
    }
  }
</style>
<style scoped>
  .child-view {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all .8s cubic-bezier(.55, 0, .1, 1);
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

  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50px, 0);
    transform: translate(50px, 0);
  }

  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-50px, 0);
    transform: translate(-50px, 0);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .header {
    position: absolute;
    height: 44px;
    /*background:#0058f1;*/
    width: 100%
  }
</style>
