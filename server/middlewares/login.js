const request = require('request');
const config = require('../config/index');
const { encryptSha1 } = require('../utils/function');
const query = require('../utils/pool');
const login = {};
exports.login = login;

redisClient.on('error', function(err) {
  console.log('Redis Error ' + err);
});

// 检测是否登录
login.check = function(req, res, next) {
  const skey = req.headers.skey;
  console.info('skey', skey);
  global.redisClient.get(skey, function(err, reply) {
    console.info('校验登录状态返回', reply);
    if (reply && reply.toString()) {
      next();
    } else {
      return res.json({
        code: '10005',
        message: '请登录后再操作',
        success: false,
        data: false,
      });
    }
  });
};

// 微信登录
login.wechat = function(req, res, next) {
  const code = req.query.code;
  const params = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: config.wechat.appId,
      secret: config.wechat.appSecret,
      js_code: code,
    },
  };
  console.info('微信登录请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信登录返回参数：', data);
      //生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis
      data.session = encryptSha1(data.session_key);
      global.redisClient.set(
        data.session,
        `${data.openid}:${data.session_key}`,
        global.redis.print,
      );
      delete data.session_key;
      req.body.data = data;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// 获取小程序全局唯一后台接口调用凭据
login.getAccessToken = function(req, res, next) {
  const params = {
    uri: 'https://api.weixin.qq.com/cgi-bin/token',
    json: true,
    qs: {
      grant_type: 'client_credential',
      appid: config.wechat.appId,
      secret: config.wechat.appSecret,
    },
  };
  console.info('微信凭据请求参数：', params);

  function callback(error, response, data) {
    const status = response && response.statusCode;
    if (!error && status == 200) {
      console.info('微信凭据返回参数：', data);
      req.body.data = data;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: 1, message: error });
    }
  }
  request.get(params, callback);
};

// 如不存在此用户则创建
login.createUser = function(req, res, next) {
  const openid = req.body.data.openid;
  const sql = `SELECT * FROM users where openid = "${openid}"`;
  query(sql, (err, vals) => {
    if (!err && vals && !vals.length) {
      // 新用户，则创建
      let userInfo = req.query.userInfo;
      userInfo = JSON.parse(userInfo);
      const createdAt = new Date().getTime();
      const updatedAt = createdAt;
      const inserSql = `INSERT INTO users set openid="${openid}", nick_name="${userInfo.nickName}", gender="${userInfo.gender}", 
                        country="${userInfo.country}", province="${userInfo.province}", city="${userInfo.city}", avatar="${userInfo.avatarUrl}", 
                        created_at=${createdAt}, updated_at=${updatedAt};`;
      console.info('创建用户', inserSql);
      query(inserSql, (err) => {
        if (err) {
          return res.json({
            code: '10001',
            message: err,
            success: false,
            data: null,
          });
        }
        return next();
      });
    } else {
      next();
    }
  });
};

// 管理员登录
login.admin = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `SELECT id,username,role FROM administrators where username = "${username}" and password = "${password}" and deleted=0`;
  console.info('管理员登陆：', sql);
  query(sql, (err, vals) => {
    console.info('管理员登陆返回：', err);
    if (!err && vals instanceof Array && vals.length) {
      // 记录登录状态，过期时间为两小时
      const session = encryptSha1(username);
      global.redisClient.set(
        session,
        username,
        'EX',
        7200
      );
      req.body.data = vals[0];
      req.body.data.session = session;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10004',
        message: '账号或密码错误',
        success: false,
        data: null,
      });
    }
  });
};
