const query = require('../utils/pool');
const movie = {};
exports.movie = movie;

//获取电影列表
movie.list = function(req, res, next) {
  const name = req.query.name;
  const sql = `SELECT * FROM movies where
               deleted=0 ${(name=='undefined' || name=='null' || !name)?'':`and name like "%${name}%"`}
               order by sort desc`;
  console.info("获取电影列表", sql);
  query(sql, (err, vals) => {
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
movie.detail = function(req, res, next) {
  let id = req.query.id || req.body.id;
  id = +id;
  const sql = `SELECT * FROM movies where deleted=0 and id=${id};
               SELECT * FROM actors where movie_id=${id};
               SELECT * FROM stills where movie_id=${id};
               SELECT 
               c.id as comments_id,
               c.user_id,
               c.content,
               c.created_at as comments_created_at,
               c.rating as comments_rating,
               u.nick_name,
               u.avatar
               FROM comments c left join users u on c.user_id=u.id where c.movie_id=${id};`;
  console.info("获取电影详情", sql);
  query(sql, (err, vals) => {
    console.info('获取电影详情返回', vals);
    if (!err && vals instanceof Array) {
      req.body.data = {
        movie: vals[0][0],
        actors: vals[1],
        stills: vals[2],
        comments: vals[3]
      };
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
// 添加电影
movie.add = function(req, res, next) {
  const name = req.body.name;
  const en_name = req.body.en_name;
  const types = req.body.types;
  const rating = +req.body.rating;
  const cover = req.body.cover;
  const summary = req.body.summary;
  const description = req.body.description;
  const created_at = new Date().getTime();
  const updated_at = created_at;
  const duration = +req.body.duration;
  const onsale = +req.body.onsale;
  const likes = req.body.likes || 0 ;
  const actors = req.body.actors;
  const deleted = 0;
  const sql = `insert into movies(actors,likes,onsale,name,en_name,types,rating,cover,summary,description,created_at,updated_at,duration,deleted)
               values("${actors}",${+likes},${onsale},"${name}","${en_name}","${types}",${rating},"${cover}","${summary}","${description}",${created_at},${updated_at},${duration},${deleted})`;
  console.info("新增电影", sql);
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
movie.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update movies set deleted=1,updated_at=${updatedAt} where id=${id}`;
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
movie.addStill = function(req, res, next) {
  const movie_id = req.body.movie_id;
  const image = req.body.image;
  const sql = `insert into stills(movie_id,image) values(${movie_id}, "${image}")`;
  console.info("添加剧照", sql);
  query(sql, (err, vals) => {
    console.info("添加剧照返回", vals);
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}