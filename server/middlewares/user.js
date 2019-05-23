const query = require('../utils/pool');
const user = {};
exports.user = user;

// 查询用户信息
user.detail = function(req, res, next) {
  const user_id = req.query.userId || req.body.userId;
  let openid = req.query.openid || req.body.openid;
  const skey = req.headers.skey;
  if (skey) {
    global.redisClient.get(skey, function(err, reply) {
      if (reply) {
        // 截取openid
        openid = reply.toString().split(':')[0];
        doQuery();
      } else {
        return res.json({ code: '10006', message: err || 'session无效', success: false, data: null }); 
      }
    });
  } else {
    doQuery();
  }
  function doQuery() {
    const sql = `select * from users where ${user_id ? `id=${user_id}` : `openid="${openid}"`}`;
    console.info("查询用户信息", sql);
    query(sql, (err, vals) => {
      if (!err && vals instanceof Array) {
        req.body.data = vals[0];
        req.body.code = '10000';
        req.body.message = '操作成功';
        req.body.success = true;
        return next();
      } else {
        return res.json({ code: '10001', message: err, success: false, data: null }); 
      }
    })
  }
}

//后台管理》分页获取用户列表
user.all = function(req, res, next) {
  var param = req.query;
  //分页实现
  var currentPage = 1; //默认为1
  var size = 10; //每页条数
  if (param.page) {
    currentPage = parseInt(param.page);
  }
  if (param.size) {
    size = parseInt(param.size);
  }
  //设置最后一页页码
  var lastPage = currentPage - 1;
  //假如目前仅有一页，则最后一页则为1
  if (currentPage <= 1) {
    lastPage = 1;
  }
  //如果需要下一页，则开启
  //var nextPage = currentPage + 1;
  var offset = (currentPage - 1) * size;

  const nickname = param.nickname;
  const userId = param.userId;
  const isSearch = nickname || userId;
  let filters = [];
  nickname && filters.push(`nick_name like "%${nickname}%"`);
  userId && filters.push(`id=${userId}`);
  filters = isSearch ? ' and ' + filters.join(' and ') : '';

  var sql = `SELECT COUNT(*) FROM users;
            select * FROM users where deleted=0 ${filters}
            order by created_at desc limit ${size} offset ${offset}`;

  console.info('查询用户', sql);;
  query(sql, (err, vals) => {
    console.info('查询用户返回', vals);
    if (!err && vals instanceof Array) {
      const totalCount = vals[0][0]['COUNT(*)'];
      const totalPage = Math.ceil(parseInt(totalCount) / size);
      req.body.data = {
        list: vals[1],
        size: size,
        page: currentPage,
        totalPage: totalPage,
        totalCount: totalCount,
      };
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({
        code: '10001',
        message: err,
        success: false,
        data: null,
      });
    }
  });
};

// 更新用户信息
user.update = function(req, res, next) {
  const status = req.body.status;
  const account_amount = req.body.account_amount;
  const userId = req.body.userId;
  let sets = [];
  if (status) {
    sets.push(`status=${status}`);
  }
  if (account_amount) {
    sets.push(`account_amount=${account_amount}`);
  }
  sets = sets.join(',');
  const sql = `update users set ${sets} where id=${userId}`;
  console.info("更新用户信息", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}