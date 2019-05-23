import BaseProxy from './base';

/**
 * 用户提现
 */

const paths = {
  // 获取提现列表
  getWithdraw: '/withdraw/list',
  // 驳回提现
  withdrawReject: '/withdraw/reject',
  // 通过审核
  withdrawResolve: '/withdraw/resolve',
};

class WithdrawManage extends BaseProxy {
  async getWithdraw(data) {
    const response = await this.submit('get', paths.getWithdraw, data);
    return response;
  }
  async withdrawReject(data) {
    const response = await this.submit('post', paths.withdrawReject, data);
    return response;
  }
  async withdrawResolve(data) {
    const response = await this.submit('post', paths.withdrawResolve, data);
    return response;
  }
}
const WithdrawManageProxy = new WithdrawManage();
export default WithdrawManageProxy;
