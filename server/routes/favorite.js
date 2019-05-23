const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { favorite } = require('../middlewares/favorite.js');

// 获取收藏
router.get('/list', favorite.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/detail', login.check, favorite.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, favorite.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, favorite.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
