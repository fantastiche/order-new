<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';

  html {
    height: 100%;
    width: 100%;
  }

  body {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    position: fixed;
    font-size: 100%;
    font-family: "PingFang SC";
  }

  #app {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  body {
    background-color: #fbf9fe;
  }

  button {
    outline: none;
  }
</style>
<style>
  @font-face {
    font-family: 'PingFang SC';
    src: url('./common/ttf/PingFang Sc regular.ttf');
  }

  .weui-dialog__btn_primary {
    color: #e54028 !important;
  }
</style>
