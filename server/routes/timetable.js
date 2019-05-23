const express = require('express');
const router = express.Router();
const { login } = require('../middlewares/login.js');
const { timetable } = require('../middlewares/timetable.js');

// 获取排期
router.get('/list', timetable.list, function(req, res, next) {
  res.json(req.body);
});
router.get('/listByTheater', timetable.listByTheater, function(req, res, next) {
  res.json(req.body);
});
router.post('/add', login.check, timetable.add, function(req, res, next) {
  res.json(req.body);
});
router.post('/update', login.check, timetable.update, function(req, res, next) {
  res.json(req.body);
});
router.get('/remove', login.check, timetable.remove, function(req, res, next) {
  res.json(req.body);
});


module.exports = router;
