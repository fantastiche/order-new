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
  .weui-dialog__btn_primary {
    color: #ff73b7 !important;
  }
</style>
