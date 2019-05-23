const express = require('express');
const router = express.Router();
const { system } = require('../middlewares/system.js');

// 获取系统配置
router.get('/get', system.get, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
