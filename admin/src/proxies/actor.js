import BaseProxy from './base';

/**
 * 演员管理的请求定义
 */

// 演员管理
const apiUrlConf = {
  getActors: '/actor/list',
  removeActor: '/actor/remove',
  addActor: '/actor/add',
};

class Actor extends BaseProxy {
  async getActors() {
    const response = await this.submit('get', apiUrlConf.getActors);
    return response;
  }
  async addActor(data) {
    const response = await this.submit('post', apiUrlConf.addActor, data);
    return response;
  }
  async removeActor(data) {
    const response = await this.submit('get', apiUrlConf.removeActor, data);
    return response;
  }
}
const ActorProxy = new Actor();
export default ActorProxy;
