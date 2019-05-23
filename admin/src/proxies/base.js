import Vue from 'vue';

class BaseProxy {
  /**
   * BaseProxy构造函数.
   *
   * @param {string} path       请求路径
   * @param {Object} parameters 请求参数
   */
  constructor(path, parameters = {}) {
    this.path = path;
    this.parameters = parameters;
  }

  /**
   * 设置多个请求参数.
   *
   * @param {Object} parameters 请求参数
   *
   * @returns {BaseProxy}       返回当前proxy的实例
   */
  setParameters(parameters) {
    Object.keys(parameters).forEach((key) => {
      this.parameters[key] = parameters[key];
    });

    return this;
  }

  /**
   * 设置单个请求参数.
   *
   * @param {string} parameter 请求参数
   * @param {*} value          参数值
   *
   * @returns {BaseProxy}      返回当前proxy的实例
   */
  setParameter(parameter, value) {
    this.parameters[parameter] = value;

    return this;
  }

  /**
   * 移除多个请求参数
   *
   * @param {Array} parameters 请求参数
   *
   * @returns {BaseProxy}      返回当前proxy的实例
   */
  removeParameters(parameters) {
    parameters.forEach((parameter) => {
      delete this.parameters[parameter];
    });

    return this;
  }

  /**
   * 移除单个请求参数
   *
   * @param {string} parameter 请求参数
   *
   * @returns {BaseProxy}      返回当前proxy的实例
   */
  removeParameter(parameter) {
    delete this.parameters[parameter];

    return this;
  }

  /**
   * 执行ajax请求方法
   *
   * @param {string}      requestType 请求类型
   * @param {string}      url         请求链接
   * @param {Object|null} data        请求参数
   *
   * @returns {Object}                返回请求结果
   */
  async submit(requestType, url, data = null, config) {
    if (requestType.toLocaleLowerCase() === 'get') {
      data = {
        params: data,
      };
    }
    const response = await Vue.$http[requestType](url + this.getParameterString(), data, config);
    return response;
  }

  /**
   * 获取所有的数据.
   *
   * @returns {Object} 返回结果
   */
  async all() {
    const response = await this.submit('get', `/${this.path}`);
    return response;
  }

  /**
   * 根据ID获取单条数据
   *
   * @param {int} id   数据ID
   *
   * @returns {Object} 返回结果
   */
  async find(id) {
    const response = await this.submit('get', `/${this.path}/${id}`);
    return response;
  }

  /**
   * 添加一条数据
   *
   * @param {Object} item 数据信息
   *
   * @returns {Object}    返回结果
   */
  async create(item) {
    const response = await this.submit('post', `/${this.path}`, item);
    return response;
  }

  /**
   * 更新一条数据
   *
   * @param {int}    id   数据ID
   * @param {Object} item 其他数据信息
   *
   * @returns {Object}    返回结果
   */
  async update(id, item) {
    const response = await this.submit('put', `/${this.path}/${id}`, item);
    return response;
  }

  /**
   * 删除一条数据
   *
   * @param {int} id   数据ID
   *
   * @returns {Object} 返回结果
   */
  async destroy(id) {
    const response = await this.submit('delete', `/${this.path}/${id}`);
    return response;
  }

  /**
   * 将参数对象转换为参数字符串
   *
   * @returns {string} 返回参数字符串
   */
  getParameterString() {
    const keys = Object.keys(this.parameters);

    const parameterStrings = keys
      .filter(key => !!this.parameters[key])
      .map(key => `${key}=${this.parameters[key]}`);

    return parameterStrings.length === 0 ? '' : `?${parameterStrings.join('&')}`;
  }
}

export default BaseProxy;
