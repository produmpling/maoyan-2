
import BaseProxy from './base';

/**
 * 通用的请求定义
 */

// 接口地址
const apiUrlConf = {
  // 获取七牛上传token
  getQiniuUploadToken: '/upload/token',
  // 获取分类
  getTypes: '/tasks/getTypes',
};

class CommonApi extends BaseProxy {
  // 获取七牛上传token
  async getQiniuUploadToken() {
    const res = await this.submit('get', apiUrlConf.getQiniuUploadToken);
    return res;
  }
  // 获取分类
  async getTypes() {
    const res = await this.submit('get', apiUrlConf.getTypes);
    return res;
  }
}
const CommonProxy = new CommonApi();
export default CommonProxy;
