const query = require('../utils/pool');
const comment = {};
exports.comment = comment;

//获取评论
comment.list = function(req, res, next) {
  console.info("查询评论");
  query(`SELECT *,comments.id as comment_id FROM comments left join movies on comments.movie_id=movies.id`, (err, vals) => {
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
comment.detail = function(req, res, next) {
  const user_id = req.query.user_id;
  const movie_id = req.query.movie_id;
  const sql = `SELECT * FROM comments where user_id=${user_id} and movie_id=${movie_id}`;
  console.info("查询是否评论", sql);
  query(sql, (err, vals) => {
    console.info('查询是否评论返回', vals)
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
comment.add = function(req, res, next) {
  const movie_id = req.body.movie_id;
  const user_id = req.body.user_id;
  const content = req.body.content;
  const rating = req.body.rating;
  const created_at = new Date().getTime();
  const sql = `insert into comments(movie_id,user_id,content,rating,created_at)
               values(${movie_id},${user_id},"${content}",${rating},"${created_at}")`;
  console.info("新增评论", sql);
  query(sql, (err, vals) => {
    console.info("新增评论返回", vals);
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
comment.remove = function(req, res, next) {
  const id = req.body.id || req.query.id;
  const sql = `delete from comments where id=${id}`;
  console.info("删除评论", sql);
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