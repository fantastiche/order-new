<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    beforeCreate: function () {
//      let SHOPCODE = 'B00035'
//      let USERID = '8949'
//      let LEVEL = 'Base'
//      let CATALOGUE = 'updo'
//      localStorage.setItem('SHOPCODE', SHOPCODE)
//      localStorage.setItem('USERID', USERID)
//      localStorage.setItem('LEVEL', LEVEL)
//      localStorage.setItem('CATALOGUE', CATALOGUE)

//      let SHOPCODE
//      let USERID
//      let LEVEL
//      let CATALOGUE
//      SHOPCODE = location.href.split('?')[1].split('&')[0].split('=')[1]
//      console.error('------------' + SHOPCODE)
//      localStorage.setItem('SHOPCODE', SHOPCODE)
//      USERID = location.href.split('?')[1].split('&')[1].split('=')[1]
//      localStorage.setItem('USERID', USERID)
//      LEVEL = location.href.split('?')[1].split('&')[2].split('=')[1]
//      localStorage.setItem('LEVEL', LEVEL)
//      CATALOGUE = location.href.split('?')[1].split('&')[3].split('=')[1]
//      localStorage.setItem('CATALOGUE', CATALOGUE)
    }
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
  }

  #app {
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  body {
    background-color: #fbf9fe;
  }
</style>
<style>
  .weui-dialog__btn_primary {
    color: #ff73b7 !important;
  }
</style>
