// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import 'lib-flexible'
import router from './router'
import App from './App'
import {AlertPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin} from 'vux'
import store from './store'
import 'babel-polyfill'

FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
