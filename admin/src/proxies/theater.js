import BaseProxy from './base';

/**
 * 影院管理的请求定义
 */

// 影院管理
const apiUrlConf = {
  getTheaters: '/theater/list',
  removeTheater: '/theater/remove',
  addTheater: '/theater/add',
  updateTheater: '/theater/update',
};

class Theater extends BaseProxy {
  async getTheaters() {
    const response = await this.submit('get', apiUrlConf.getTheaters);
    return response;
  }
  async addTheater(data) {
    const response = await this.submit('post', apiUrlConf.addTheater, data);
    return response;
  }
  async updateTheater(data) {
    const response = await this.submit('post', apiUrlConf.updateTheater, data);
    return response;
  }
  async removeTheater(data) {
    const response = await this.submit('get', apiUrlConf.removeTheater, data);
    return response;
  }
}
const TheaterProxy = new Theater();
export default TheaterProxy;
