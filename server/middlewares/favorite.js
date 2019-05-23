const query = require('../utils/pool');
const favorite = {};
exports.favorite = favorite;

//获取收藏
favorite.list = function(req, res, next) {
  console.info("查询收藏");
  const user_id = req.query.user_id;
  query(`SELECT * FROM favorites left join movies on favorites.movie_id=movies.id where user_id=${user_id}`, (err, vals) => {
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
favorite.detail = function(req, res, next) {
  const user_id = req.query.user_id;
  const movie_id = req.query.movie_id;
  const sql = `SELECT * FROM favorites where user_id=${user_id} and movie_id=${movie_id}`;
  console.info("查询是否收藏", sql);
  query(sql, (err, vals) => {
    console.info('查询是否收藏返回', vals)
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
favorite.add = function(req, res, next) {
  const movie_id = req.body.movie_id;
  const user_id = req.body.user_id;
  const created_at = new Date().getTime();
  const sql = `insert into favorites(movie_id,user_id,created_at)
               values(${movie_id},${user_id},"${created_at}")`;
  console.info("新增收藏", sql);
  query(sql, (err, vals) => {
    console.info("新增收藏返回", vals);
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
favorite.remove = function(req, res, next) {
  const id = req.body.id;
  const sql = `delete from favorites where id=${id}`;
  console.info("删除收藏", sql);
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