const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload.js');

// 获取七牛上传token
router.get('/token', upload.img);

module.exports = router;