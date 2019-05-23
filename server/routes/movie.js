const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { movie } = require('../middlewares/movie.js');

// 获取电影列表
router.get('/list', movie.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/detail', movie.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, movie.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/addStill', login.check, movie.addStill, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, movie.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
