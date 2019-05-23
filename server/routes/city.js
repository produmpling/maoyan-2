const express = require('express');
const router = express.Router();
const { city } = require('../middlewares/city.js');

// 获取城市
router.get('/all', city.all, function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
