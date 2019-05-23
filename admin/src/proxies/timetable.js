import BaseProxy from './base';

/**
 * 排期管理的请求定义
 */

// 排期管理
const apiUrlConf = {
  getTimetables: '/timetable/list',
  listByTheater: '/timetable/listByTheater',
  removTimetable: '/timetable/remove',
  addTimetable: '/timetable/add',
  updateTimetable: '/timetable/update',
};

class Timetable extends BaseProxy {
  async getTimetables() {
    const response = await this.submit('get', apiUrlConf.getTimetables);
    return response;
  }
  async listByTheater(data) {
    const response = await this.submit('get', apiUrlConf.listByTheater, data);
    return response;
  }
  async addTimetable(data) {
    const response = await this.submit('post', apiUrlConf.addTimetable, data);
    return response;
  }
  async updateTimetable(data) {
    const response = await this.submit('post', apiUrlConf.updateTimetable, data);
    return response;
  }
  async removeTimetable(data) {
    const response = await this.submit('get', apiUrlConf.removTimetable, data);
    return response;
  }
}
const TimetableProxy = new Timetable();
export default TimetableProxy;
