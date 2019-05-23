import BaseProxy from './base';

/**
 * 影评管理的请求定义
 */

// 影评管理
const apiUrlConf = {
  getComments: '/comment/list',
  removeComment: '/comment/remove',
  addComment: '/comment/add',
  updateComment: '/comment/update',
};

class Comment extends BaseProxy {
  async getComments() {
    const response = await this.submit('get', apiUrlConf.getComments);
    return response;
  }
  async addComment(data) {
    const response = await this.submit('post', apiUrlConf.addComment, data);
    return response;
  }
  async updateComment(data) {
    const response = await this.submit('post', apiUrlConf.updateComment, data);
    return response;
  }
  async removeComment(data) {
    const response = await this.submit('get', apiUrlConf.removeComment, data);
    return response;
  }
}
const CommentProxy = new Comment();
export default CommentProxy;
