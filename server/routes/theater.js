const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { theater } = require('../middlewares/theater.js');

// 获取影院列表
router.get('/list', theater.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/detail', theater.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, theater.add, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, theater.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
