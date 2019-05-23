const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { user } = require('../middlewares/user.js');

// 获取用户信息
router.get('/detail', user.detail, function(req, res, next) {
  res.json(req.body);
});
// 获取用户列表
router.get('/all', user.all, function(req, res, next) {
  res.json(req.body);
});
// 更新用户
router.post('/update', login.check, user.update, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
