const query = require('../utils/pool');
const order = {};
exports.order = order;

//获取订单
order.all = function(req, res, next) {
  const sql = `SELECT * FROM orders`;
  console.info('查询所有订单', sql);
  query(sql, (err, vals) => {
    console.info('查询所有订单返回', vals);
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
order.list = function(req, res, next) {
  const user_id = req.query.user_id;
  const sql = `SELECT *,orders.id as order_id FROM orders left join movies on orders.movie_id=movies.id where user_id=${user_id}`;
  console.info('查询当前用户订单', sql);
  query(sql, (err, vals) => {
    console.info('查询当前用户订单返回', vals);
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
order.add = function(req, res, next) {
  const theater_name = req.body.theater_name;
  const theater_id = req.body.theater_id;
  const movie_id = req.body.movie_id;
  const movie_name = req.body.movie_name;
  const start_time = req.body.start_time;
  const date = req.body.date;
  const room = req.body.room;
  const seats = req.body.seats;
  const price = req.body.price;
  const user_id = req.body.user_id;
  const status = 1;
  const created_at = new Date().getTime();

  const sql = `insert into orders(
               theater_name,
               theater_id,
               movie_id,
               movie_name,
               start_time,
               date,
               room,
               seats,
               price,
               user_id,
               status,
               created_at)
               values(
                 "${theater_name}",
                 ${theater_id},
                 ${movie_id},
                 "${movie_name}",
                 "${start_time}",
                 "${date}",
                 "${room}",
                 "${seats}",
                 ${price},
                 ${user_id},
                 ${status},
                 "${created_at}")`;
  console.info("新增订单", sql);
  query(sql, (err, vals) => {
    console.info("新增订单返回", vals);
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
order.update = function(req, res, next) {
  const id = req.body.id;
  const status = 2;
  const updated_at = new Date().getTime();
  const sql = `update orders set status=${status},updated_at="${updated_at}" where id=${id}`;
  console.info("更新订单", sql);
  query(sql, (err, vals) => {
    console.info('更新订单返回', vals);
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
order.detail = function(req, res, next) {
  const id = req.query.id;
  const sql = `select * from orders where id=${id}`;
  console.info("查询订单详情", sql);
  query(sql, (err, vals) => {
    console.info('查询订单详情返回', vals);
    if (!err && vals instanceof Object) {
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
order.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const sql = `delete from orders where id=${id}`;
  console.info("删除订单", sql);
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