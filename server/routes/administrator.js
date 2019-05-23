const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { administrator } = require('../middlewares/administrator.js');

router.get('/list', administrator.list, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, administrator.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, administrator.update, function(req, res, next) {
  res.json(req.body);
});
router.post('/remove', login.check, administrator.remove, function(req, res, next) {
  res.json(req.body);
});
module.exports = router;
