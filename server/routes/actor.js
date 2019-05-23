const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { actor } = require('../middlewares/actor.js');

// 获取演员
router.get('/list', actor.list, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, actor.add, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, actor.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
