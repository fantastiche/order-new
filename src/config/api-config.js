/**
 * 接口地址与请求方法
 * @type {{ name : {path: string, method: string} }}
 */
const common = {
  goodsscan: {
    path: 'goodsscan.do',
    method: 'GET'
  },
  login: {
    path: 'login.do',
    method: 'GET'
  },
  add: {
    path: 'cart/add.do',
    method: 'GET'
  },
  edit: {
    path: 'cart/item/edit.do',
    method: 'GET'
  },
  cartList: {
    path: 'cart/list.do',
    method: 'GET'
  },
  getShopDiscount: {
    path: 'getShopDiscount.do',
    method: 'GET'
  },
  submit: {
    path: 'order/submit',
    method: 'GET'
  }
}

export default common
