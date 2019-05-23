import BaseProxy from './base';

/**
 * 影片管理的请求定义
 */

// 影片管理
const apiUrlConf = {
  getMovies: '/movie/list',
  removeMovie: '/movie/remove',
  addMovie: '/movie/add',
  updateMovie: '/movie/update',
  addStill: '/movie/addStill',
};

class Movie extends BaseProxy {
  async getMovies() {
    const response = await this.submit('get', apiUrlConf.getMovies);
    return response;
  }
  async addMovie(data) {
    const response = await this.submit('post', apiUrlConf.addMovie, data);
    return response;
  }
  async addStill(data) {
    const response = await this.submit('post', apiUrlConf.addStill, data);
    return response;
  }
  async updateMovie(data) {
    const response = await this.submit('post', apiUrlConf.updateMovie, data);
    return response;
  }
  async removeMovie(data) {
    const response = await this.submit('get', apiUrlConf.removeMovie, data);
    return response;
  }
}
const MovieProxy = new Movie();
export default MovieProxy;
