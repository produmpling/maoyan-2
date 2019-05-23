const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { comment } = require('../middlewares/comment.js');

// 获取评论
router.get('/list', comment.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/detail', login.check, comment.detail, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, comment.add, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, comment.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
