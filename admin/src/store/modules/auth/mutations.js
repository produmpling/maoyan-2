/* ============
 * Mutations for the auth module
 * ============
 */
import {
  getPureItem,
  setItem,
  removeItem,
} from '@/utils/storage';
import {
  CHECK,
  REGISTER,
  LOGIN,
  LOGOUT,
} from './mutation-types';

export default {
  /**
   * 重新验证是否登录
   * @param {Object} state   当前模块的状态
   */
  [CHECK](state) {
    state.authenticated = !!getPureItem('token');
  },
  /**
   * 注册，功能预留
  */
  [REGISTER]() {
  },
  /**
   * 登录
   * @param {Object} state   当前模块的状态
   * @param {Object} token   登录返回的token
   */
  [LOGIN](state, data) {
    state.authenticated = true;
    for (const key in data) {
      let item = data[key];
      item = item instanceof Object ? JSON.stringify(item) : item;
      setItem(key, item);
    }
    state.userInfo = data;
    // ...
  },
  /**
   * 注销
   * @param {Object} state   当前模块的状态
   */
  [LOGOUT](state) {
    state.authenticated = false;
    removeItem('username');
    removeItem('password');
    removeItem('id');
    removeItem('role');
  },
};
