import BaseProxy from './base';

/**
 * 用户管理的请求定义
 */

// 接口地址
const apiUrlConf = {
  // 获取用户列表
  getUserList: '/user/all',
  // 更新用户
  updateUser: '/user/update',
};

class UserManage extends BaseProxy {
  // 获取用户列表
  async getUserList(data) {
    const response = await this.submit('get', apiUrlConf.getUserList, data);
    return response;
  }
  // 更新用户
  async updateUser(data) {
    const response = await this.submit('post', apiUrlConf.updateUser, data);
    return response;
  }
}
const UserManageProxy = new UserManage();
export default UserManageProxy;
