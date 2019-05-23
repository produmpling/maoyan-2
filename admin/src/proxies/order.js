import BaseProxy from './base';

/**
 * 订单管理的请求定义
 */

// 订单管理
const apiUrlConf = {
  getOrders: '/order/all',
  removeOrder: '/order/remove',
  addOrder: '/order/add',
  updateOrder: '/order/update',
};

class Order extends BaseProxy {
  async getOrders() {
    const response = await this.submit('get', apiUrlConf.getOrders);
    return response;
  }
  async addOrder(data) {
    const response = await this.submit('post', apiUrlConf.addOrder, data);
    return response;
  }
  async updateOrder(data) {
    const response = await this.submit('post', apiUrlConf.updateOrder, data);
    return response;
  }
  async removeOrder(data) {
    const response = await this.submit('get', apiUrlConf.removeOrder, data);
    return response;
  }
}
const OrderProxy = new Order();
export default OrderProxy;
