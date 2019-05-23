const query = require('../utils/pool');
const banner = {};
exports.banner = banner;

//获取轮播图
banner.get = function(req, res, next) {
  console.info("查询轮播图");
  query("SELECT * FROM `banners` where deleted=0 order by sort desc", (err, vals) => {
    if (!err && vals instanceof Array) {
      req.body.data = vals;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}
banner.add = function(req, res, next) {
  const image = req.body.image;
  const title = req.body.title;
  const url = req.body.url;
  const createdAt = new Date().getTime();
  const createdBy = req.body.createdBy;
  const sql = `insert into banners(image,title,url,created_at,created_by)
               values("${image}","${title}","${url}","${createdAt}","${createdBy}")`;
  console.info("新增轮播图", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = vals.insertId;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err, success: false, data: null }); 
    }
  })
}
banner.remove = function(req, res, next) {
  const id = req.query.id || req.body.id;
  const updatedAt = new Date().getTime();
  const sql = `update banners set deleted=1,updated_at=${updatedAt} where id=${id}`;
  console.info("删除轮播图", sql);
  query(sql, (err, vals) => {
    if (!err && vals instanceof Object) {
      req.body.data = true;
      req.body.code = '10000';
      req.body.message = '操作成功';
      req.body.success = true;
      return next();
    } else {
      return res.json({ code: '10001', message: err.code, success: false, data: null }); 
    }
  })
}