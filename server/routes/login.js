const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');

router.get('/', login.wechat, login.createUser, function(req, res) {
  res.json(req.body);
});

router.get('/getAccessToken', login.getAccessToken, function(req, res) {
  res.json(req.body);
});

router.post('/admin', login.admin, function(req, res) {
  res.json(req.body);
});


module.exports = router;
