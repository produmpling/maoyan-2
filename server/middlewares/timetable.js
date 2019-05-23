const query = require('../utils/pool');
const timetable = {};
exports.timetable = timetable;

//获取排期
timetable.list = function(req, res, next) {
  console.info("查询排期");
  const movie_id = req.query.movie_id;
  const play_date = req.query.play_date;
  const sql = `SELECT * FROM timetable
               left join theaters on timetable.theater_id=theaters.id
               where movie_id=${movie_id} and theaters.deleted=0 and
               date_format(play_date,'%Y-%m-%d')=date_format('${play_date}','%Y-%m-%d')`;
  query(sql, (err, vals) => {
    console.info("查询排期返回", sql);
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}
timetable.listByTheater = function(req, res, next) {
  const theater_id = req.query.id;
  const sql = `SELECT *,timetable.id as timetable_id FROM timetable
               left join movies on timetable.movie_id=movies.id
               where theater_id=${theater_id}`;
  query(sql, (err, vals) => {
    console.info("查询影院所有电影排期", sql);
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
timetable.add = function(req, res, next) {
  const movie_id = req.body.movie_id;
  const theater_id = req.body.theater_id;
  const play_date = req.body.date;
  const times = JSON.stringify(req.body.times);
  const sql = `insert into timetable(movie_id,theater_id,play_date,times)
               values(${movie_id},${theater_id},"${play_date}","${times}")`;
  console.info("添加排期", sql);
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
timetable.update = function(req, res, next) {
  const id = req.body.id;
  const status = 2;
  const updated_at = new Date().getTime();
  const sql = `update timetable set status=${status},updated_at="${updated_at}" where id=${id}`;
  console.info("查询排期", sql);
  query(sql, (err, vals) => {
    console.info('查询排期返回', vals);
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
timetable.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const sql = `delete from timetable where id=${id}`;
  console.info("删除排期", sql);
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