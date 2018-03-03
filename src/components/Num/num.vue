<template>
  <div class="item-ctrl">
    <span class="item-ctrl-btn" @click="sub(item,index)">-</span>
    <input type="number" class="item-ctrl-num" v-model="item.num" @click="inputNum(item,index)"
           @blur="changeNum(item,index)">
    <span class="item-ctrl-btn" @click="add(item,index)">+</span>
  </div>
</template>

<script>
  export default {
    props: {
      num: {
        type: Number,
        default: 0
      }
    },
    data: function () {
      return {}
    },
    methods: {},
    created: function () {
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../common/less/mixin";

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
</style>
