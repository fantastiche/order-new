/**
 * 接口地址与请求方法
 * @type {{ name : {path: string, method: string} }}
 */
const common = {
  goodsscan: {
    path: 'goodsscan',
    method: 'GET'
  },
  login: {
    path: 'login',
    method: 'GET'
  },
  add: {
    path: 'cart/add',
    method: 'GET'
  },
  edit: {
    path: 'cart/item/edit',
    method: 'GET'
  },
  del: {
    path: 'cart/del',
    method: 'GET'
  },
  cartList: {
    path: 'cart/list',
    method: 'GET'
  },
  getShopDiscount: {
    path: 'getShopDiscount',
    method: 'GET'
  },
  submit: {
    path: 'order/submit',
    method: 'GET'
  },
  orderList: {
    path: 'order/list',
    method: 'GET'
  },
  orderDetail: {
    path: 'order/detail',
    method: 'GET'
  },
  orderCancel: {
    path: 'order/cancel',
    method: 'GET'
  },
  otherStore: {
    path: 'shop/list',
    method: 'GET'
  }
}

export default common
