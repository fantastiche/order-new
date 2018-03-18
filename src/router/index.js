import Vue from 'vue'
import Router from 'vue-router'
import PageTransition from '@/components/PageTransition/PageTransition'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageTransition',
      component: PageTransition,
      children: [{
        path: '/',
        redirect: '/login'
      }, {
        path: '/index',
        name: 'index',
        component: resolve => require(['../view/Index/index.vue'], resolve)
      }, {
        path: '/goods',
        name: 'goods',
        component: resolve => require(['../view/Goods/goods.vue'], resolve)
      }, {
        path: '/orderConfirm',
        name: 'orderConfirm',
        component: resolve => require(['../view/OrderConfirm/order-confirm.vue'], resolve)
      }, {
        path: '/login',
        name: 'login',
        component: resolve => require(['../view/Login/login.vue'], resolve)
      }, {
        path: '/goodsDetail',
        name: 'goodsDetail',
        component: resolve => require(['../view/GoodsDetail/goods-detail.vue'], resolve)
      }, {
        path: '/orderList',
        name: 'orderList',
        component: resolve => require(['../view/OrderList/order-list.vue'], resolve)
      }, {
        path: '/orderDetail',
        name: 'orderDetail',
        component: resolve => require(['../view/OrderDetail/order-detail.vue'], resolve)
      }, {
        path: '/orderMore',
        name: 'orderMore',
        component: resolve => require(['../view/OrderMore/order-more.vue'], resolve)
      }, {
        path: '/shoppingCartList',
        name: 'shoppingCartList',
        component: resolve => require(['../view/ShoppingCartList/shopping-cart-list.vue'], resolve)
      }]
    }
  ]
})
