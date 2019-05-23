const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { order } = require('../middlewares/order.js');

// 获取订单
router.get('/all', order.all, function(req, res, next) {
  res.json(req.body);
});
router.get('/list', order.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/detail', order.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, order.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, order.update, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, order.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
