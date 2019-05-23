const query = require('../utils/pool');
const actor = {};
exports.actor = actor;

//获取演员
actor.list = function(req, res, next) {
  console.info("查询演员");
  query("SELECT *,actors.id as actor_id,actors.name as actor_name,movies.name as movie_name FROM `actors` left join movies on actors.movie_id=movies.id", (err, vals) => {
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
actor.add = function(req, res, next) {
  const avatar = req.body.avatar;
  const name = req.body.name;
  const role = req.body.role;
  const movie_id = req.body.movie_id;
  const sql = `insert into actors(avatar,name,role,movie_id)
               values("${avatar}","${name}","${role}",${movie_id})`;
  console.info("新增演员", sql);
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
actor.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const sql = `delete from actors where id=${id}`;
  console.info("删除演员", sql);
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