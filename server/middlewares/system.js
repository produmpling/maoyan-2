const query = require('../utils/pool');
const system = {};
exports.system = system;

// 获取系统配置
system.get = function(req, res, next) {
  const sql = "SELECT * FROM `system`";
  console.info("查询系统配置", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Array) {
      console.info(vals);
      req.body.data = vals[0];
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}