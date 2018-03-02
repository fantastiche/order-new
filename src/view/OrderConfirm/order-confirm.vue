<template>
  <div class="content">
    <div class="btn-home">
      <img src="./icon_home1.png" alt="">
      <span>返回首页</span>
    </div>
    <div class="title">
      <div class="title-info">
        <div>
          <span>加盟商:</span><span class="title-info-detail">AAAAAA</span>
        </div>
        <div>
          <span>手&nbsp&nbsp&nbsp机:</span><span class="title-info-detail">18811111111</span>
        </div>
        <div>
          <span>门&nbsp&nbsp&nbsp店:</span><span class="title-info-detail">云蜜测试店</span>
        </div>
      </div>
    </div>
    <scroll ref="wrapper" class="scroll-content">
      <div class="main-body">
        <div class="goods-list border-1px">
          <div class="goods-list-title border-1px">
            <div>
              <img src="./icon_shopping2.png" alt="">
              <span>已购商品</span>
            </div>
            <div>编辑</div>
          </div>
          <div class="goods-list-body">
            <div class="goods-list-body-item" v-for="(item, index) in list">
              <div class="goods-list-body-item-wrapper border-1px-e5">
                <img src="./pic.jpg" alt="">
                <div class="goods-list-body-item-info">
                  <div class="goods-list-body-item-info-title">
                    <span>晴彩炫色眼影</span>
                    <span>颜色：粉红色</span>
                  </div>
                  <div class="goods-list-body-item-info-price">
                    <span>￥99.00</span>
                    <span>×100</span>
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
            <textarea placeholder="(选填)"></textarea>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../../components/Scroll/Scroll'

  export default {
    components: {
      Scroll
    },
    data: function () {
      return {
        list: [0]
      }
    },
    methods: {},
    created: function () {
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
      background: url("./bg_order.png") no-repeat center;
      background-size: 100%;
      width: 100%;
      height: 220/@rem;
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
      z-index: 10000;
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
          span  {
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
  }

  .scroll-content {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    top: 220/@rem;
    background: #e9edf2;
  }
</style>
