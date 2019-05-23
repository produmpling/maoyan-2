import BaseProxy from './base';

/**
 * 轮播管理的请求定义
 */

// 轮播管理
const apiUrlConf = {
  getBanners: '/banner/get',
  removeBanner: '/banner/remove',
  addBanner: '/banner/add',
};

class Banners extends BaseProxy {
  async getBanners() {
    const response = await this.submit('get', apiUrlConf.getBanners);
    return response;
  }
  async addBanner(data) {
    const response = await this.submit('post', apiUrlConf.addBanner, data);
    return response;
  }
  async removeBanner(data) {
    const response = await this.submit('get', apiUrlConf.removeBanner, data);
    return response;
  }
}
const BannersProxy = new Banners();
export default BannersProxy;
