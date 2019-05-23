import BaseProxy from './base';

/**
 * 任务管理
 */

const paths = {
  // 获取任务列表
  getTasks: '/tasks/admin',
  // 删除任务
  removeTask: '/tasks/remove',
  // 修改任务状态
  updateTaskStatus: '/tasks/updateStatus',
  // 添加任务
  addTask: '/tasks/add',
  // 更新任务
  updateTask: '/tasks/update',
  // 任务审核列表
  reviewTasks: '/tasks/getReviewList',
  // 任务审核操作
  reviewTask: '/tasks/reivew',
  // 驳回任务
  reviewReject: '/tasks/reviewReject',
  // 通过审核
  reviewResolve: '/tasks/reviewResolve',
  // 任务详情
  getDetail: '/tasks/getDetail',
  // 任务审核步骤
  getReviewStep: '/tasks/getReviewStep',
};

class TasksManage extends BaseProxy {
  // 获取任务列表
  async getTasks(data) {
    const response = await this.submit('get', paths.getTasks, data);
    return response;
  }
  async reviewTasks(data) {
    const response = await this.submit('get', paths.reviewTasks, data);
    return response;
  }
  async removeTask(data) {
    const response = await this.submit('post', paths.removeTask, data);
    return response;
  }
  async updateTaskStatus(data) {
    const response = await this.submit('post', paths.updateTaskStatus, data);
    return response;
  }
  async reviewReject(data) {
    const response = await this.submit('post', paths.reviewReject, data);
    return response;
  }
  async reviewResolve(data) {
    const response = await this.submit('post', paths.reviewResolve, data);
    return response;
  }
  async addTask(data) {
    const response = await this.submit('post', paths.addTask, data);
    return response;
  }
  async updateTask(data) {
    const response = await this.submit('post', paths.updateTask, data);
    return response;
  }
  async reviewTask(data) {
    const response = await this.submit('post', paths.reviewTask, data);
    return response;
  }
  async getDetail(data) {
    const response = await this.submit('get', paths.getDetail, data);
    return response;
  }
  async getReviewStep(data) {
    const response = await this.submit('get', paths.getReviewStep, data);
    return response;
  }
}
const TasksManageProxy = new TasksManage();
export default TasksManageProxy;
