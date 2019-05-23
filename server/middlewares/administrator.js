const query = require('../utils/pool');
const administrator = {};
exports.administrator = administrator;

//后台管理》分页获取管理员列表
administrator.list = function(req, res, next) {
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
  var sql = `SELECT COUNT(*) FROM administrators;
            select * FROM administrators where deleted=0
            order by created_at desc limit ${size} offset ${offset}`;

  console.info('查询管理员', sql);;
  query(sql, (err, vals) => {
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

// 添加管理员
administrator.add = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const created_at = new Date().getTime();
  const updated_at = created_at;
  const sql = `insert into administrators(username,password,role,created_at,updated_at) values("${username}","${password}",2,"${created_at}","${updated_at}")`;
  console.info("添加管理员", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}

// 修改管理员
administrator.update = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const id = req.body.id;
  const updated_at = new Date().getTime();
  const sql = `update administrators set username="${username}",password="${password}",updated_at="${updated_at}" where id=${id}`;
  console.info("修改管理员", sql);
  query(sql, (err, vals) => {
    if (!err && vals.affectedRows) {
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

// 删除管理员
administrator.remove = function(req, res, next) {
  const id = req.body.id;
  const updated_at = new Date().getTime();
  const sql = `update administrators set deleted=1,updated_at="${updated_at}" where id=${id}`;
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