import BaseProxy from './base';
// 接口地址
const apiUrlConf = {
  // 登录
  login: '/login/admin',
};

class Auth extends BaseProxy {
  // 登录
  async login(data) {
    const response = await this.submit('post', apiUrlConf.login, data);
    return response;
  }
}
const AuthProxy = new Auth();
export default AuthProxy;
