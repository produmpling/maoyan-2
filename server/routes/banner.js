const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { banner } = require('../middlewares/banner.js');

// 获取轮播图
router.get('/get', banner.get, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, banner.add, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, banner.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
