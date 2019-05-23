const query = require('../utils/pool');
const theater = {};
exports.theater = theater;

//获取电影院列表
theater.list = function(req, res, next) {
  const city = req.query.city;
  const name = req.query.name;
  const sql = `SELECT * FROM theaters where
               deleted=0 ${(city=='undefined' || city=='null' || !city)?' ':`and city="${city}" `}
               ${(name=='undefined' || name=='null' || !name)?'':`and name like "%${name}%"`}
               order by sort desc`;
  console.info("获取电影院列表", sql);
  query(sql, (err, vals) => {
    console.info("获取电影院列表返回", vals);
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
theater.detail = function(req, res, next) {
  const id = +req.query.id;
  const sql = `SELECT * FROM theaters where id=${id}`;
  console.info("获取影院详情", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals[0];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
// 添加电影院
theater.add = function(req, res, next) {
  const name = req.body.name;
  const city = req.body.city;
  const location = req.body.location;
  const labels = req.body.labels;
  const min_price = +req.body.min_price;
  const created_at = new Date().getTime();
  const deleted = 0;
  const sort = 0;
  const sql = `insert into theaters(name,city,location,labels,min_price,deleted,sort,created_at)
               values("${name}","${city}","${location}","${labels}",${min_price},${deleted},${sort},"${created_at}")`;
  console.info("新增影院", sql);
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
// 删除电影院
theater.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update theaters set deleted=1,updated_at=${updatedAt} where id=${id}`;
  console.info("删除电影", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}