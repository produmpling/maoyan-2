import BaseProxy from './base';

/**
 * 系统管理的请求定义
 */

// 系统管理
const apiUrlConf = {
  getAdminList: '/administrator/list',
  addAdmin: '/administrator/add',
  updateAdmin: '/administrator/update',
  removeAdmin: '/administrator/remove',
};

class SysManage extends BaseProxy {
  async getAdminList(data) {
    const response = await this.submit('get', apiUrlConf.getAdminList, data);
    return response;
  }
  async addAdmin(data) {
    const response = await this.submit('post', apiUrlConf.addAdmin, data);
    return response;
  }
  async updateAdmin(data) {
    const response = await this.submit('post', apiUrlConf.updateAdmin, data);
    return response;
  }
  async removeAdmin(data) {
    const response = await this.submit('post', apiUrlConf.removeAdmin, data);
    return response;
  }
}
const SysManageProxy = new SysManage();
export default SysManageProxy;
